import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import {
  Check,
  CheckCheck,
  Pencil,
  Reply,
  Smile,
  Trash2,
  X,
} from "lucide-react";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    markMessagesAsRead,
    messages,
    typingUsers,
    isMessagesLoading,
    toggleReaction,
    setReplyingToMessage,
    setEditingMessage,
    deleteMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const isTyping = Boolean(typingUsers[selectedUser?._id]);

  const [showEmojiPickerFor, setShowEmojiPickerFor] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null);

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessagesByUserId(selectedUser._id);
    markMessagesAsRead(selectedUser._id);
  }, [selectedUser?._id, getMessagesByUserId, markMessagesAsRead]);

  const prevMessagesLengthRef = useRef(messages.length);
  const prevLastMessageIdRef = useRef(messages[messages.length - 1]?._id);

  useEffect(() => {
    const currentLength = messages.length;
    const currentLastMessageId = messages[currentLength - 1]?._id;

    if (
      messageEndRef.current &&
      (currentLength > prevMessagesLengthRef.current ||
        currentLastMessageId !== prevLastMessageIdRef.current ||
        isTyping)
    ) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    prevMessagesLengthRef.current = currentLength;
    prevLastMessageIdRef.current = currentLastMessageId;
  }, [messages, isTyping]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-3 sm:px-6 overflow-y-auto py-4 sm:py-6 min-h-0">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-6">
            {messages.map((msg) => {
              const isSender = msg.senderId === authUser._id;
              const hasReactions = msg.reactions && msg.reactions.length > 0;
              const groupedReactions = hasReactions
                ? msg.reactions.reduce((acc, r) => {
                    if (!acc[r.emoji])
                      acc[r.emoji] = { count: 0, hasUser: false };
                    acc[r.emoji].count += 1;
                    if (r.userId === authUser._id) acc[r.emoji].hasUser = true;
                    return acc;
                  }, {})
                : {};

              return (
                <div
                  key={msg._id}
                  id={`msg-${msg._id}`}
                  className={`chat ${isSender ? "chat-end" : "chat-start"} group relative`}
                >
                  <div className="relative inline-block max-w-[85%] sm:max-w-[75%] min-w-[5.5rem]">
                    {/* Hover Action Toolbar */}
                    {!msg.isDeleted && !msg.isOptimistic && (
                      <div
                        className={`hidden group-hover:flex items-center gap-0.5 absolute -top-8.5 bg-base-200/95 border border-base-content/20 rounded-full px-1.5 py-0.5 shadow-lg backdrop-blur-md z-20 ${
                          isSender ? "right-0" : "left-0"
                        }`}
                      >
                        {/* Quick Reactions */}
                        {["👍", "❤️", "😂"].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => toggleReaction(msg._id, emoji)}
                            className="hover:scale-125 transition-transform text-xs p-1 cursor-pointer"
                            title={`React ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}

                        {/* More Emoji dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setShowEmojiPickerFor(
                                showEmojiPickerFor === msg._id ? null : msg._id,
                              )
                            }
                            className="p-1 hover:text-primary text-base-content/70 cursor-pointer transition-colors"
                            title="More reactions"
                          >
                            <Smile className="w-3.5 h-3.5" />
                          </button>
                          {showEmojiPickerFor === msg._id && (
                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-base-200 border border-base-content/20 rounded-lg p-1.5 shadow-xl flex gap-1 z-30">
                              {["👍", "❤️", "😂", "😮", "😢", "🔥"].map(
                                (emoji) => (
                                  <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => {
                                      toggleReaction(msg._id, emoji);
                                      setShowEmojiPickerFor(null);
                                    }}
                                    className="hover:scale-125 transition-transform text-sm p-1 cursor-pointer"
                                  >
                                    {emoji}
                                  </button>
                                ),
                              )}
                            </div>
                          )}
                        </div>

                        {/* Reply Button */}
                        <button
                          type="button"
                          onClick={() => setReplyingToMessage(msg)}
                          className="p-1 hover:text-primary text-base-content/70 cursor-pointer transition-colors"
                          title="Reply"
                        >
                          <Reply className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Button (sender only) */}
                        {isSender && (
                          <button
                            type="button"
                            onClick={() => setEditingMessage(msg)}
                            className="p-1 hover:text-primary text-base-content/70 cursor-pointer transition-colors"
                            title="Edit message"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmModal(msg)}
                          className="p-1 hover:text-rose-400 text-base-content/70 cursor-pointer transition-colors"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div
                      className={`chat-bubble w-full min-w-[5.5rem] break-words [overflow-wrap:anywhere] ${
                        msg.isDeleted
                          ? "bg-base-200/60 border border-base-content/10 text-base-content/50 italic"
                          : isSender
                            ? "bg-primary text-primary-content shadow-sm"
                            : "bg-base-200 text-base-content shadow-sm"
                      }`}
                    >
                      {/* Quoted / Replied Message Preview */}
                      {msg.replyTo && (
                        <div
                          className={`mb-2 p-2 rounded text-xs border-l-4 border-primary bg-black/15 text-left cursor-pointer hover:bg-black/25 transition-colors`}
                          onClick={() => {
                            const target = document.getElementById(
                              `msg-${msg.replyTo._id}`,
                            );
                            target?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }}
                        >
                          <p className="font-semibold text-primary mb-0.5">
                            {msg.replyTo.senderId === authUser._id
                              ? "You"
                              : selectedUser.fullName}
                          </p>
                          <p className="truncate opacity-85">
                            {msg.replyTo.isDeleted
                              ? "This message was deleted"
                              : msg.replyTo.text ||
                                (msg.replyTo.image
                                  ? "Shared an image"
                                  : "Message")}
                          </p>
                        </div>
                      )}

                      {msg.image && !msg.isDeleted && (
                        <img
                          src={msg.image}
                          alt="Shared"
                          className="rounded-lg max-w-full max-h-48 sm:max-h-60 w-auto object-cover"
                        />
                      )}
                      {msg.text && (
                        <p
                          className={`${msg.image ? "mt-2" : ""} text-sm sm:text-base leading-relaxed break-words`}
                        >
                          {msg.text}
                        </p>
                      )}

                      <p
                        className={`text-[10px] sm:text-xs mt-1 opacity-75 flex items-center gap-1 whitespace-nowrap shrink-0 ${
                          isSender ? "justify-end" : "justify-start"
                        }`}
                      >
                        {msg.isEdited && !msg.isDeleted && (
                          <span className="italic mr-0.5 shrink-0">
                            (edited)
                          </span>
                        )}
                        <span className="whitespace-nowrap shrink-0">
                          {new Date(msg.createdAt).toLocaleTimeString(
                            undefined,
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                        {isSender && !msg.isDeleted && (
                          <span
                            className="inline-flex items-center ml-0.5"
                            title={
                              msg.status === "read"
                                ? "Read"
                                : msg.status === "delivered"
                                  ? "Delivered"
                                  : "Sent"
                            }
                          >
                            {msg.status === "read" ? (
                              <CheckCheck className="w-3.5 h-3.5 text-cyan-200" />
                            ) : msg.status === "delivered" ? (
                              <CheckCheck className="w-3.5 h-3.5 opacity-80" />
                            ) : (
                              <Check className="w-3.5 h-3.5 opacity-80" />
                            )}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Reactions Pill List */}
                    {hasReactions && !msg.isDeleted && (
                      <div
                        className={`flex flex-wrap gap-1 mt-1 ${
                          isSender ? "justify-end" : "justify-start"
                        }`}
                      >
                        {Object.entries(groupedReactions).map(
                          ([emoji, data]) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => toggleReaction(msg._id, emoji)}
                              className={`px-1.5 py-0.5 rounded-full text-xs flex items-center gap-1 border transition-all cursor-pointer ${
                                data.hasUser
                                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-200"
                                  : "bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700"
                              }`}
                              title={data.hasUser ? "Remove reaction" : "React"}
                            >
                              <span>{emoji}</span>
                              <span className="text-[10px] opacity-80">
                                {data.count}
                              </span>
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="chat chat-start">
                <div className="chat-bubble bg-base-200 text-base-content py-2 px-3 sm:px-4 rounded-2xl flex items-center gap-1.5 shadow-sm">
                  <span className="text-xs text-base-content/70 mr-1">
                    {selectedUser.fullName} is typing
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                </div>
              </div>
            )}

            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-base-200 border border-base-content/10 rounded-xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-base-content">
            <h4 className="text-base font-semibold">Delete Message?</h4>
            <p className="text-sm text-base-content/80">
              {deleteConfirmModal.senderId === authUser._id
                ? "Would you like to delete this message for everyone or only for yourself?"
                : "Delete this message from your chat history?"}
            </p>
            <div className="flex flex-col gap-2 pt-2">
              {deleteConfirmModal.senderId === authUser._id && (
                <button
                  type="button"
                  onClick={() => {
                    deleteMessage(deleteConfirmModal._id, "everyone");
                    setDeleteConfirmModal(null);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm transition-colors cursor-pointer"
                >
                  Delete for everyone
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  deleteMessage(deleteConfirmModal._id, "me");
                  setDeleteConfirmModal(null);
                }}
                className="w-full py-2 px-3 rounded-lg bg-base-300 hover:bg-base-100 text-base-content font-medium text-sm transition-colors cursor-pointer"
              >
                Delete for me
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(null)}
                className="w-full py-2 px-3 rounded-lg bg-base-300/60 hover:bg-base-100 text-base-content/70 text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <MessageInput />
    </>
  );
}

export default ChatContainer;
