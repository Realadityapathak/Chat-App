import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";
import { Trash2 } from "lucide-react";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser, typingUsers, clearConversation } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [partnerToDelete, setPartnerToDelete] = useState(null);

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="group bg-base-300/40 p-3 sm:p-4 rounded-xl cursor-pointer hover:bg-base-300/80 transition-all min-h-[44px] flex items-center justify-between border border-transparent hover:border-base-content/10"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"} shrink-0`}>
              <div className="size-10 sm:size-12 rounded-full">
                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="text-base-content font-medium truncate text-sm sm:text-base">{chat.fullName}</h4>
              {typingUsers[chat._id] && (
                <p className="text-xs text-primary animate-pulse font-medium">typing...</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {chat.unreadCount > 0 && (
              <span className="badge badge-primary font-bold text-xs px-2 py-0.5 rounded-full shadow-sm animate-in fade-in zoom-in duration-200">
                {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
              </span>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPartnerToDelete(chat);
              }}
              title="Delete conversation"
              aria-label="Delete conversation"
              className="opacity-0 group-hover:opacity-100 p-2 text-base-content/60 hover:text-rose-400 transition-opacity cursor-pointer shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      {partnerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-base-200 border border-base-content/10 rounded-xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-base-content">
            <h4 className="text-base font-semibold">Delete Conversation?</h4>
            <p className="text-sm text-base-content/80">
              Are you sure you want to delete the conversation with <strong className="text-base-content font-bold">{partnerToDelete.fullName}</strong>? Your chat history will be cleared.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  clearConversation(partnerToDelete._id);
                  setPartnerToDelete(null);
                }}
                className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm transition-colors cursor-pointer"
              >
                Delete Conversation
              </button>
              <button
                type="button"
                onClick={() => setPartnerToDelete(null)}
                className="w-full py-2 px-3 rounded-lg bg-base-300 hover:bg-base-100 text-base-content text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default ChatsList;
