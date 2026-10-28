import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  ENV.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// Track all active socket IDs per user (userId -> Set<socketId>)
const userSocketMap = new Map();

// Check if user is online
export function isUserOnline(userId) {
  const sockets = userSocketMap.get(String(userId));
  return Boolean(sockets && sockets.size > 0);
}

// Backwards compatible helper returning a socket ID
export function getReceiverSocketId(userId) {
  const sockets = userSocketMap.get(String(userId));
  if (!sockets || sockets.size === 0) return null;
  return Array.from(sockets)[0];
}

io.on("connection", (socket) => {
  const userId = socket.userId;

  if (!userSocketMap.has(userId)) {
    userSocketMap.set(userId, new Set());
  }
  userSocketMap.get(userId).add(socket.id);

  // Each user joins their private room for multi-device/multi-tab message routing
  socket.join(userId);

  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  // Mark pending sent messages as delivered upon user connection
  Message.find({ receiverId: userId, status: "sent" })
    .distinct("senderId")
    .then(async (senderIds) => {
      if (senderIds && senderIds.length > 0) {
        await Message.updateMany(
          { receiverId: userId, status: "sent" },
          { $set: { status: "delivered" } },
        );
        for (const senderId of senderIds) {
          io.to(senderId.toString()).emit("messagesDelivered", {
            receiverId: userId,
          });
        }
      }
    })
    .catch((err) => {
      console.error(
        "Error updating message delivery status on socket connect:",
        err.message,
      );
    });

  // Typing indicator relays
  socket.on("typing", (data) => {
    if (data && typeof data === "object" && data.to) {
      io.to(data.to.toString()).emit("userTyping", { from: userId });
    }
  });

  socket.on("stopTyping", (data) => {
    if (data && typeof data === "object" && data.to) {
      io.to(data.to.toString()).emit("userStopTyping", { from: userId });
    }
  });

  socket.on("disconnect", async () => {
    const sockets = userSocketMap.get(userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        userSocketMap.delete(userId);
        io.emit("userStopTyping", { from: userId });
        const lastSeen = new Date();
        try {
          await User.findByIdAndUpdate(userId, { lastSeen });
          io.emit("userLastSeen", { userId, lastSeen });
        } catch (err) {
          console.error(
            "Failed to update lastSeen on disconnect:",
            err.message,
          );
        }
      }
    }
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

export { io, app, server };
