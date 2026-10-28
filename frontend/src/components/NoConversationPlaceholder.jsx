import { RadioIcon } from "lucide-react";

function NoConversationPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 select-none">
      <div className="size-16 rounded-lg bg-console-surface border border-console-border flex items-center justify-center mb-4 shadow-tactile text-console-accent">
        <RadioIcon className="size-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-console-surface border border-console-border text-console-text-muted text-[11px] font-mono mb-2">
        <span className="size-1.5 rounded-full bg-console-border" />
        CHANNELS STANDBY
      </div>

      <h3 className="text-base sm:text-lg font-bold text-console-text mb-1">
        No Active Transmission Channel
      </h3>
      <p className="text-console-text-muted text-xs sm:text-sm max-w-sm leading-relaxed">
        Select a contact from the directory to open an encrypted messaging session.
      </p>
    </div>
  );
}

export default NoConversationPlaceholder;
