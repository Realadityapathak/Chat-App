import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="tabs tabs-boxed bg-transparent p-2 mx-2 my-1 shrink-0 flex gap-2">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab min-h-[44px] flex-1 rounded-lg py-2.5 font-medium transition-colors text-sm flex items-center justify-center cursor-pointer ${
          activeTab === "chats"
            ? "bg-cyan-500/20 text-cyan-400 font-semibold"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab min-h-[44px] flex-1 rounded-lg py-2.5 font-medium transition-colors text-sm flex items-center justify-center cursor-pointer ${
          activeTab === "contacts"
            ? "bg-cyan-500/20 text-cyan-400 font-semibold"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        Contacts
      </button>
    </div>
  );
}
export default ActiveTabSwitch;
