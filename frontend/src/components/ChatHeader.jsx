import { ArrowLeftIcon, Trash2, XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser, typingUsers, clearConversation } =
    useChatStore();
  const { onlineUsers, lastSeenMap } = useAuthStore();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const isOnline = selectedUser?._id
    ? onlineUsers.includes(selectedUser._id)
    : false;
  const isTyping = Boolean(selectedUser?._id && typingUsers[selectedUser._id]);
  const effectiveLastSeen = selectedUser?._id
    ? lastSeenMap[selectedUser._id] ||
      selectedUser.lastSeen ||
      selectedUser.createdAt
    : null;

  const formatLastSeen = (dateString) => {
    if (!dateString) return "Offline";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Offline";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "Offline";

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);

    // Over 30 days (more than 1 month)
    if (diffDays >= 30) {
      return "Last seen more than 1 month ago";
    }

    // 1 to 4 weeks ago
    if (diffWeeks >= 1) {
      return `Last seen ${diffWeeks}w ago`;
    }

    // 2 to 6 days ago
    if (diffDays >= 2) {
      return `Last seen ${diffDays}d ago`;
    }

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday.toDateString() === date.toDateString()) {
      return `Last seen yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }

    // 1 hour or more (Today)
    if (diffHours >= 1) {
      return `Last seen ${diffHours}h ago`;
    }

    // Under 1 hour
    if (diffMins >= 1) {
      return `Last seen ${diffMins}m ago`;
    }

    // Under 1 minute
    return "Last seen just now";
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className="flex justify-between items-center bg-base-200/50 border-b border-base-content/10 px-3 sm:px-6 py-2.5 sm:py-3 shrink-0">
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        {/* Mobile Back Button */}
        <button
          onClick={() => setSelectedUser(null)}
          aria-label="Back to conversations"
          className="md:hidden min-h-[44px] min-w-[44px] p-2 -ml-1 flex items-center justify-center text-base-content/70 hover:text-base-content transition-colors cursor-pointer"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        <div className={`avatar ${isOnline ? "online" : "offline"} shrink-0`}>
          <div className="w-10 sm:w-12 rounded-full">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
            />
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="text-base-content font-medium truncate text-sm sm:text-base">
            {selectedUser.fullName}
          </h3>
          <p className="text-base-content/60 text-xs sm:text-sm flex items-center gap-1.5">
            {isTyping ? (
              <span className="text-primary font-medium animate-pulse">
                typing...
              </span>
            ) : isOnline ? (
              <span className="text-emerald-400">Online</span>
            ) : (
              <span className="truncate">
                {formatLastSeen(effectiveLastSeen)}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setShowConfirmClear(true)}
          aria-label="Delete conversation"
          title="Delete conversation"
          className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center text-base-content/70 hover:text-rose-400 transition-colors cursor-pointer"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <button
          onClick={() => setSelectedUser(null)}
          aria-label="Close conversation"
          className="min-h-[44px] min-w-[44px] p-2 -mr-1 flex items-center justify-center text-base-content/70 hover:text-base-content transition-colors cursor-pointer"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {showConfirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-base-200 border border-base-content/10 rounded-xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-base-content">
            <h4 className="text-base font-semibold">Delete Conversation?</h4>
            <p className="text-sm text-base-content/80">
              Are you sure you want to delete the conversation with{" "}
              <strong className="text-base-content font-bold">
                {selectedUser.fullName}
              </strong>
              ? Your chat history will be cleared.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  clearConversation(selectedUser._id);
                  setShowConfirmClear(false);
                }}
                className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm transition-colors cursor-pointer"
              >
                Delete Conversation
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmClear(false)}
                className="w-full py-2 px-3 rounded-lg bg-base-300 hover:bg-base-100 text-base-content text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ChatHeader;
