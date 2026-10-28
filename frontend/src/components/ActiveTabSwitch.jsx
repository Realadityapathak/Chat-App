import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab, chats, allContacts } = useChatStore();

  return (
    <div className="p-2 border-b border-console-border bg-console-surface-subtle shrink-0">
      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-md bg-console-canvas/50 border border-console-border">
        <button
          onClick={() => setActiveTab("chats")}
          className={`min-h-[38px] rounded px-3 py-1.5 text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-console-accent ${
            activeTab === "chats"
              ? "bg-console-surface text-console-accent shadow-tactile border border-console-border"
              : "text-console-text-muted hover:text-console-text border border-transparent"
          }`}
          type="button"
        >
          <span>CHATS</span>
          {chats.length > 0 && (
            <span className="px-1.5 py-0.2 rounded bg-console-accent/10 text-console-accent text-[10px]">
              {chats.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("contacts")}
          className={`min-h-[38px] rounded px-3 py-1.5 text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-console-accent ${
            activeTab === "contacts"
              ? "bg-console-surface text-console-accent shadow-tactile border border-console-border"
              : "text-console-text-muted hover:text-console-text border border-transparent"
          }`}
          type="button"
        >
          <span>CONTACTS</span>
          {allContacts.length > 0 && (
            <span className="px-1.5 py-0.2 rounded bg-console-surface-subtle text-console-text-muted text-[10px]">
              {allContacts.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
export default ActiveTabSwitch;
