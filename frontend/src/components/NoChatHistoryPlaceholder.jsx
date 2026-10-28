import { SendIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoChatHistoryPlaceholder({ name }) {
  const { sendMessage } = useChatStore();

  const handleQuickPrompt = (text) => {
    sendMessage({ text });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 my-auto select-none">
      <div className="size-12 sm:size-14 rounded-lg bg-console-surface border border-console-border flex items-center justify-center mb-3 text-console-accent shadow-tactile">
        <SendIcon className="size-6" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-console-surface border border-console-border text-console-text-muted text-[10px] font-mono mb-2">
        LOG CREATED // ZERO DISPATCHES
      </div>

      <h3 className="text-sm sm:text-base font-bold text-console-text mb-1">
        Channel Open with {name}
      </h3>
      <p className="text-console-text-muted text-xs max-w-xs mb-4 leading-relaxed">
        Send a message below to establish communications.
      </p>

      <div className="flex flex-wrap gap-1.5 justify-center max-w-sm">
        <button
          type="button"
          onClick={() => handleQuickPrompt("Checking in on latest status.")}
          className="min-h-[38px] px-3 py-1.5 text-xs font-mono rounded-md border border-console-border bg-console-surface text-console-text hover:bg-console-surface-subtle hover:border-console-accent/40 transition-colors cursor-pointer shadow-tactile focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-console-accent"
        >
          Status Check
        </button>
        <button
          type="button"
          onClick={() => handleQuickPrompt("Ready to sync on build progress.")}
          className="min-h-[38px] px-3 py-1.5 text-xs font-mono rounded-md border border-console-border bg-console-surface text-console-text hover:bg-console-surface-subtle hover:border-console-accent/40 transition-colors cursor-pointer shadow-tactile focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-console-accent"
        >
          Sync Progress
        </button>
        <button
          type="button"
          onClick={() => handleQuickPrompt("Transmission received and verified.")}
          className="min-h-[38px] px-3 py-1.5 text-xs font-mono rounded-md border border-console-border bg-console-surface text-console-text hover:bg-console-surface-subtle hover:border-console-accent/40 transition-colors cursor-pointer shadow-tactile focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-console-accent"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
}

export default NoChatHistoryPlaceholder;
