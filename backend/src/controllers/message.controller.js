import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { io, isUserOnline } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;
    const { limit = 50, before } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);

    const query = {
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
      deletedFor: { $ne: myId },
    };

    if (before) {
      const beforeDate = new Date(before);
      if (!isNaN(beforeDate.getTime())) {
        query.createdAt = { $lt: beforeDate };
      }
    }

    // Fetch the most recent N messages matching the query, then reverse to chronological order
    const messages = await Message.find(query)
      .populate("replyTo", "text image senderId isDeleted")
      .sort({ createdAt: -1 })
      .limit(parsedLimit);

    res.status(200).json(messages.reverse());
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, replyTo } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid receiver ID format." });
    }

    const trimmedText = typeof text === "string" ? text.trim() : "";
    if (!trimmedText && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    let validReplyTo = null;
    if (replyTo && mongoose.Types.ObjectId.isValid(replyTo)) {
      const parentMsg = await Message.findById(replyTo);
      if (parentMsg) validReplyTo = parentMsg._id;
    }

    const isReceiverOnline = isUserOnline(receiverId);
    const newMessage = new Message({
      senderId,
      receiverId,
      text: trimmedText || undefined,
      image: imageUrl,
      replyTo: validReplyTo,
      status: isReceiverOnline ? "delivered" : "sent",
    });

    await newMessage.save();
    await newMessage.populate("replyTo", "text image senderId isDeleted");

    // Broadcast to the receiver's private room (supports multi-tab / multi-device)
    io.to(receiverId.toString()).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const chatPartners = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
          deletedFor: { $ne: loggedInUserId },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          partnerId: {
            $cond: [
              { $eq: ["$senderId", loggedInUserId] },
              "$receiverId",
              "$senderId",
            ],
          },
          isUnread: {
            $cond: [
              {
                $and: [
                  { $eq: ["$receiverId", loggedInUserId] },
                  { $ne: ["$status", "read"] },
                ],
              },
              1,
              0,
            ],
          },
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: "$partnerId",
          lastMessageAt: { $first: "$createdAt" },
          unreadCount: { $sum: "$isUnread" },
        },
      },
      {
        $sort: { lastMessageAt: -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "partnerUser",
        },
      },
      {
        $unwind: "$partnerUser",
      },
      {
        $project: {
          _id: "$partnerUser._id",
          fullName: "$partnerUser.fullName",
          email: "$partnerUser.email",
          profilePic: "$partnerUser.profilePic",
          lastSeen: "$partnerUser.lastSeen",
          createdAt: "$partnerUser.createdAt",
          updatedAt: "$partnerUser.updatedAt",
          unreadCount: 1,
        },
      },
    ]);

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: senderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ message: "Invalid sender ID format." });
    }

    const readAt = new Date();

    const result = await Message.updateMany(
      {
        senderId,
        receiverId: myId,
        status: { $ne: "read" },
      },
      {
        $set: {
          status: "read",
          readAt,
        },
      },
    );

    if (result.modifiedCount > 0) {
      io.to(senderId.toString()).emit("messagesRead", {
        readerId: myId.toString(),
        readAt,
      });
    }

    res.status(200).json({
      message: "Messages marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error in markMessagesAsRead: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const toggleReaction = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: messageId } = req.params;
    const { emoji } = req.body;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: "Invalid message ID format." });
    }
    if (!emoji || typeof emoji !== "string") {
      return res.status(400).json({ message: "Emoji string is required." });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }
    if (message.isDeleted) {
      return res
        .status(400)
        .json({ message: "Cannot react to a deleted message." });
    }

    const isParticipant =
      message.senderId.equals(myId) || message.receiverId.equals(myId);
    if (!isParticipant) {
      return res
        .status(403)
        .json({ message: "Not authorized to react to this message." });
    }

    const existingIndex = message.reactions.findIndex(
      (r) => r.userId.toString() === myId.toString(),
    );

    if (existingIndex > -1) {
      if (message.reactions[existingIndex].emoji === emoji) {
        message.reactions.splice(existingIndex, 1);
      } else {
        message.reactions[existingIndex].emoji = emoji;
      }
    } else {
      message.reactions.push({ userId: myId, emoji });
    }

    await message.save();

    io.to(message.senderId.toString())
      .to(message.receiverId.toString())
      .emit("messageReaction", {
        messageId: message._id,
        reactions: message.reactions,
      });

    res.status(200).json({
      message: "Reaction updated",
      reactions: message.reactions,
    });
  } catch (error) {
    console.error("Error in toggleReaction:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editMessage = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: messageId } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: "Invalid message ID format." });
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required for editing." });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }
    if (!message.senderId.equals(myId)) {
      return res
        .status(403)
        .json({ message: "You can only edit your own messages." });
    }
    if (message.isDeleted) {
      return res
        .status(400)
        .json({ message: "Cannot edit a deleted message." });
    }

    message.text = text.trim();
    message.isEdited = true;
    message.editedAt = new Date();

    await message.save();
    await message.populate("replyTo", "text image senderId isDeleted");

    io.to(message.senderId.toString())
      .to(message.receiverId.toString())
      .emit("messageEdited", message);

    res.status(200).json(message);
  } catch (error) {
    console.error("Error in editMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: messageId } = req.params;
    const { deleteType = "everyone" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: "Invalid message ID format." });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    const isParticipant =
      message.senderId.equals(myId) || message.receiverId.equals(myId);
    if (!isParticipant) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this message." });
    }

    if (deleteType === "everyone") {
      if (!message.senderId.equals(myId)) {
        return res.status(403).json({
          message: "You can only delete for everyone on your own messages.",
        });
      }

      message.isDeleted = true;
      message.text = "This message was deleted";
      message.image = null;
      message.reactions = [];

      await message.save();

      io.to(message.senderId.toString())
        .to(message.receiverId.toString())
        .emit("messageDeleted", {
          messageId: message._id,
          deleteType: "everyone",
          message: {
            _id: message._id,
            isDeleted: true,
            text: "This message was deleted",
            image: null,
            reactions: [],
          },
        });

      return res.status(200).json({
        message: "Message deleted for everyone",
        deletedMessage: message,
      });
    } else {
      // deleteType === "me"
      const alreadyDeletedForMe = message.deletedFor.some(
        (id) => id.toString() === myId.toString(),
      );
      if (!alreadyDeletedForMe) {
        message.deletedFor.push(myId);
        await message.save();
      }

      return res.status(200).json({
        message: "Message deleted for you",
        messageId: message._id,
      });
    }
  } catch (error) {
    console.error("Error in deleteMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const clearConversation = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: partnerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ message: "Invalid partner ID format." });
    }

    const result = await Message.updateMany(
      {
        $or: [
          { senderId: myId, receiverId: partnerId },
          { senderId: partnerId, receiverId: myId },
        ],
        deletedFor: { $ne: myId },
      },
      {
        $addToSet: { deletedFor: myId },
      },
    );

    res.status(200).json({
      message: "Conversation cleared successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error in clearConversation:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
