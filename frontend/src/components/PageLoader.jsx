import { LoaderIcon } from "lucide-react";

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-h-dvh bg-console-canvas text-console-text">
      <div className="size-12 rounded-lg bg-console-surface border border-console-border flex items-center justify-center shadow-tactile mb-3">
        <LoaderIcon className="size-6 animate-spin text-console-accent" />
      </div>
      <p className="text-xs font-mono text-console-text-muted">INITIALIZING CONSOLE...</p>
    </div>
  );
}

export default PageLoader;
