import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <div className="space-y-1">
      {chats.map((chat) => {
        const isOnline = onlineUsers.includes(chat._id);
        const isSelected = selectedUser?._id === chat._id;

        return (
          <button
            key={chat._id}
            onClick={() => setSelectedUser(chat)}
            className={`w-full p-2.5 rounded-md text-left transition-all cursor-pointer flex items-center justify-between min-h-[52px] border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-console-accent ${
              isSelected
                ? "bg-console-surface border-console-accent/40 shadow-tactile text-console-text"
                : "bg-transparent border-transparent hover:bg-console-surface hover:border-console-border text-console-text-muted hover:text-console-text"
            }`}
            type="button"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* SQUIRCLE AVATAR */}
              <div className="relative shrink-0">
                <div className="size-10 rounded-[6px] overflow-hidden border border-console-border bg-console-surface-subtle">
                  <img
                    src={chat.profilePic || "/avatar.png"}
                    alt={chat.fullName}
                    className="size-full object-cover"
                  />
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 size-2 rounded-full ring-2 ring-console-surface ${
                    isOnline ? "bg-emerald-500" : "bg-console-border"
                  }`}
                />
              </div>

              {/* NAME & STATUS */}
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate leading-tight text-console-text">
                  {chat.fullName}
                </h3>
                <p className="text-[11px] font-mono mt-0.5 text-console-text-muted">
                  {isOnline ? "ACTIVE // READY" : "IDLE // STANDBY"}
                </p>
              </div>
            </div>

            {isSelected && (
              <span className="size-1.5 rounded-full bg-console-accent shrink-0 ml-2" />
            )}
          </button>
        );
      })}
    </div>
  );
}
export default ChatsList;
