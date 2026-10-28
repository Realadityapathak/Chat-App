import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab, chats } = useChatStore();

  const totalUnread = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="tabs tabs-boxed bg-transparent p-2 mx-2 my-1 shrink-0 flex gap-2">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab min-h-[44px] flex-1 rounded-lg py-2.5 font-medium transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer ${
          activeTab === "chats"
            ? "bg-primary/20 text-primary font-semibold"
            : "text-base-content/60 hover:text-base-content"
        }`}
      >
        <span>Chats</span>
        {totalUnread > 0 && (
          <span className="badge badge-primary font-bold text-xs px-1.5 py-0.5 rounded-full">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab min-h-[44px] flex-1 rounded-lg py-2.5 font-medium transition-colors text-sm flex items-center justify-center cursor-pointer ${
          activeTab === "contacts"
            ? "bg-primary/20 text-primary font-semibold"
            : "text-base-content/60 hover:text-base-content"
        }`}
      >
        Contacts
      </button>
    </div>
  );
}
export default ActiveTabSwitch;
