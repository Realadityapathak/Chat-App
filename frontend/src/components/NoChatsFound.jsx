import { RadioIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoChatsFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center p-4">
      <div className="size-12 rounded-lg bg-console-surface-subtle border border-console-border flex items-center justify-center text-console-text-muted mb-3">
        <RadioIcon className="size-6" />
      </div>

      <h4 className="text-sm font-bold text-console-text mb-1">No Open Channels</h4>
      <p className="text-xs text-console-text-muted max-w-xs mb-4">
        Select an operator from the contacts directory to start a new transmission.
      </p>

      <button
        onClick={() => setActiveTab("contacts")}
        className="min-h-[40px] px-4 py-2 text-xs font-mono font-semibold text-console-accent bg-console-accent/10 border border-console-accent/30 rounded-md hover:bg-console-accent/20 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-console-accent"
        type="button"
      >
        BROWSE DIRECTORY
      </button>
    </div>
  );
}

export default NoChatsFound;
