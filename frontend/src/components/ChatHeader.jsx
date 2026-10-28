import { ArrowLeftIcon, XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className="flex justify-between items-center bg-console-surface border-b border-console-border px-4 py-2.5 sm:py-3 shrink-0">
      <div className="flex items-center space-x-3 min-w-0">
        {/* Mobile Back Button */}
        <button
          onClick={() => setSelectedUser(null)}
          aria-label="Return to channel list"
          className="md:hidden min-h-[44px] min-w-[44px] -ml-2 p-2 flex items-center justify-center text-console-text-muted hover:text-console-text transition-colors cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-console-accent"
          type="button"
        >
          <ArrowLeftIcon className="size-5" />
        </button>

        {/* Contact Squircle Avatar */}
        <div className="relative shrink-0">
          <div className="size-10 sm:size-11 rounded-[6px] overflow-hidden border border-console-border bg-console-surface-subtle">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
              className="size-full object-cover"
            />
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-console-surface ${
              isOnline ? "bg-emerald-500" : "bg-console-border"
            }`}
          />
        </div>

        {/* Contact Details */}
        <div className="min-w-0">
          <h2 className="text-console-text font-bold truncate text-sm sm:text-base leading-tight">
            {selectedUser.fullName}
          </h2>
          <p className="text-console-text-muted text-[11px] font-mono mt-0.5 flex items-center gap-1.5">
            <span
              className={`inline-block size-1.5 rounded-full ${
                isOnline ? "bg-emerald-500 animate-pulse" : "bg-console-border"
              }`}
            />
            {isOnline ? "CHANNEL ENCRYPTED // LIVE" : "CHANNEL STANDBY // OFFLINE"}
          </p>
        </div>
      </div>

      {/* Close Button & Desktop Esc Hint */}
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-block px-1.5 py-0.5 rounded border border-console-border bg-console-surface-subtle text-console-text-muted text-[10px] font-mono">
          ESC
        </span>
        <button
          onClick={() => setSelectedUser(null)}
          aria-label="Close conversation channel"
          className="min-h-[44px] min-w-[44px] -mr-2 p-2 flex items-center justify-center text-console-text-muted hover:text-console-text transition-colors cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-console-accent"
          type="button"
        >
          <XIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
export default ChatHeader;
