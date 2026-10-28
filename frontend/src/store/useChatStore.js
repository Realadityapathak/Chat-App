import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

// Pre-instantiated audio instance to eliminate dynamic allocation overhead
const notificationSound = new Audio("/sounds/notification.mp3");

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  typingUsers: {},
  replyingToMessage: null,
  editingMessage: null,
  isSendingMessage: false,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  setReplyingToMessage: (message) => set({ replyingToMessage: message }),
  setEditingMessage: (message) => set({ editingMessage: message }),

  toggleSound: () => {
    const nextSoundState = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", nextSoundState);
    set({ isSoundEnabled: nextSoundState });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => {
    set((state) => ({
      selectedUser,
      replyingToMessage: null,
      editingMessage: null,
      chats: state.chats.map((c) =>
        selectedUser && c._id === selectedUser._id
          ? { ...c, unreadCount: 0 }
          : c,
      ),
    }));
    if (selectedUser?._id) {
      get().markMessagesAsRead(selectedUser._id);
    }
  },

  sendTyping: (isTyping) => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    if (!selectedUser?._id || !socket) return;
    if (isTyping) {
      socket.emit("typing", { to: selectedUser._id });
    } else {
      socket.emit("stopTyping", { to: selectedUser._id });
    }
  },

  markMessagesAsRead: async (userId) => {
    if (!userId) return;
    try {
      await axiosInstance.put(`/messages/mark-as-read/${userId}`);
      set((state) => ({
        messages: state.messages.map((m) =>
          m.senderId === userId
            ? { ...m, status: "read", readAt: new Date().toISOString() }
            : m,
        ),
        chats: state.chats.map((c) =>
          c._id === userId ? { ...c, unreadCount: 0 } : c,
        ),
      }));
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  },

  toggleReaction: async (messageId, emoji) => {
    try {
      const res = await axiosInstance.put(`/messages/${messageId}/react`, {
        emoji,
      });
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? { ...m, reactions: res.data.reactions } : m,
        ),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update reaction");
    }
  },

  editMessage: async (messageId, text) => {
    try {
      const res = await axiosInstance.put(`/messages/${messageId}/edit`, {
        text,
      });
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? res.data : m,
        ),
        editingMessage: null,
      }));
      toast.success("Message edited");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to edit message");
    }
  },

  deleteMessage: async (messageId, deleteType = "everyone") => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`, {
        data: { deleteType },
      });
      if (deleteType === "everyone") {
        set((state) => ({
          messages: state.messages.map((m) =>
            m._id === messageId
              ? {
                  ...m,
                  isDeleted: true,
                  text: "This message was deleted",
                  image: null,
                  reactions: [],
                }
              : m,
          ),
        }));
        toast.success("Message deleted for everyone");
      } else {
        set((state) => ({
          messages: state.messages.filter((m) => m._id !== messageId),
        }));
        toast.success("Message deleted for you");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  },

  clearConversation: async (partnerId) => {
    try {
      await axiosInstance.delete(`/messages/conversations/${partnerId}`);
      set({ messages: [], selectedUser: null });
      get().getMyChatPartners();
      toast.success("Conversation deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to clear conversation",
      );
    }
  },

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, replyingToMessage, isSendingMessage } = get();
    const { authUser } = useAuthStore.getState();
    if (!selectedUser || isSendingMessage) return;

    set({ isSendingMessage: true });
    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      replyTo: replyingToMessage,
      createdAt: new Date().toISOString(),
      status: "sent",
      reactions: [],
      isOptimistic: true,
    };

    // Immediately update UI with optimistic message
    set((state) => ({
      messages: [...state.messages, optimisticMessage],
      replyingToMessage: null,
    }));

    try {
      const payload = {
        ...messageData,
        replyTo: replyingToMessage?._id,
      };
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        payload,
      );
      // Replace optimistic message by ID without clobbering new incoming messages
      set((state) => ({
        messages: state.messages.map((m) => (m._id === tempId ? res.data : m)),
      }));
      // Keep chat list synchronized with recent activity
      get().getMyChatPartners();
    } catch (error) {
      // Remove optimistic message on failure
      set((state) => ({
        messages: state.messages.filter((m) => m._id !== tempId),
      }));
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isSendingMessage: false });
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Remove existing listener to prevent duplicate handlers
    socket.off("newMessage");
    socket.off("messagesRead");
    socket.off("messagesDelivered");
    socket.off("userTyping");
    socket.off("userStopTyping");
    socket.off("messageReaction");
    socket.off("messageEdited");
    socket.off("messageDeleted");

    socket.on("newMessage", (newMessage) => {
      const { selectedUser: currentSelected, isSoundEnabled: soundActive } =
        get();

      // Append message if it belongs to currently selected conversation
      if (currentSelected && newMessage.senderId === currentSelected._id) {
        set((state) => ({ messages: [...state.messages, newMessage] }));
        get().markMessagesAsRead(newMessage.senderId);
      } else {
        // Optimistically increment unread count for this sender in chats
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat._id === newMessage.senderId
              ? { ...chat, unreadCount: (chat.unreadCount || 0) + 1 }
              : chat,
          ),
        }));
      }

      if (soundActive) {
        notificationSound.currentTime = 0;
        notificationSound
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      }

      // Re-fetch chat partners so recent conversations float to the top
      get().getMyChatPartners();
    });

    socket.on("messagesRead", ({ readerId, readAt }) => {
      const { selectedUser: currentSelected } = get();
      if (currentSelected && currentSelected._id === readerId) {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.receiverId === readerId ? { ...m, status: "read", readAt } : m,
          ),
        }));
      }
    });

    socket.on("messagesDelivered", ({ receiverId }) => {
      const { selectedUser: currentSelected } = get();
      if (currentSelected && currentSelected._id === receiverId) {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.receiverId === receiverId && m.status === "sent"
              ? { ...m, status: "delivered" }
              : m,
          ),
        }));
      }
    });

    socket.on("userTyping", ({ from }) => {
      set((state) => ({
        typingUsers: { ...state.typingUsers, [from]: true },
      }));
    });

    socket.on("userStopTyping", ({ from }) => {
      set((state) => ({
        typingUsers: { ...state.typingUsers, [from]: false },
      }));
    });

    socket.on("messageReaction", ({ messageId, reactions }) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? { ...m, reactions } : m,
        ),
      }));
    });

    socket.on("messageEdited", (updatedMessage) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === updatedMessage._id ? updatedMessage : m,
        ),
      }));
    });

    socket.on("messageDeleted", ({ messageId, deleteType, message }) => {
      if (deleteType === "everyone") {
        set((state) => ({
          messages: state.messages.map((m) =>
            m._id === messageId
              ? {
                  ...m,
                  isDeleted: true,
                  text: message?.text || "This message was deleted",
                  image: null,
                  reactions: [],
                }
              : m,
          ),
        }));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("messagesRead");
      socket.off("messagesDelivered");
      socket.off("userTyping");
      socket.off("userStopTyping");
      socket.off("messageReaction");
      socket.off("messageEdited");
      socket.off("messageDeleted");
    }
  },
}));
