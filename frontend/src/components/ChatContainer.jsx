import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { m } from "motion/react";
import { incomingMessageVariants } from "../lib/motion";

const MotionDiv = m.div;

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser, socket } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, socket, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />

      <div className="flex-1 px-4 sm:px-6 overflow-y-auto py-4 sm:py-6 min-h-0 bg-console-canvas/40">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
            {messages.map((msg) => {
              const isSent = msg.senderId === authUser._id;

              return (
                <MotionDiv
                  key={msg._id}
                  variants={incomingMessageVariants}
                  initial={msg.isOptimistic ? "initial" : false}
                  animate="animate"
                  className={`flex flex-col ${isSent ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`relative max-w-[85%] sm:max-w-[75%] px-4 py-2.5 break-words [overflow-wrap:anywhere] transition-colors ${
                      isSent
                        ? "bg-console-accent text-white rounded-xl rounded-tr-xs shadow-tactile"
                        : "bg-console-surface border border-console-border text-console-text rounded-xl rounded-tl-xs shadow-tactile"
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Shared transmission"
                        className="rounded-md max-w-full max-h-56 sm:max-h-64 w-auto object-cover mb-2 border border-black/10"
                      />
                    )}

                    {msg.text && (
                      <p className="text-sm sm:text-[14.5px] leading-relaxed break-words font-normal">
                        {msg.text}
                      </p>
                    )}

                    <div
                      className={`text-[10px] font-mono mt-1 flex items-center gap-1.5 ${
                        isSent ? "text-white/80 justify-end" : "text-console-text-muted justify-start"
                      }`}
                    >
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {msg.isOptimistic && <span className="text-[9px] uppercase tracking-wider">Transmitting...</span>}
                    </div>
                  </div>
                </MotionDiv>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;
