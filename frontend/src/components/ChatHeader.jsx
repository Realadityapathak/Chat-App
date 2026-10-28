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

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 px-3 sm:px-6 py-2.5 sm:py-3 shrink-0"
    >
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        {/* Mobile Back Button */}
        <button
          onClick={() => setSelectedUser(null)}
          aria-label="Back to conversations"
          className="md:hidden min-h-[44px] min-w-[44px] p-2 -ml-1 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        <div className={`avatar ${isOnline ? "online" : "offline"} shrink-0`}>
          <div className="w-10 sm:w-12 rounded-full">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="text-slate-200 font-medium truncate text-sm sm:text-base">
            {selectedUser.fullName}
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm">{isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      <button
        onClick={() => setSelectedUser(null)}
        aria-label="Close conversation"
        className="min-h-[44px] min-w-[44px] p-2 -mr-1 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
export default ChatHeader;
