import { useEffect } from "react";
import { X, Palette, Check } from "lucide-react";
import { THEMES, useThemeStore } from "../store/useThemeStore";

function ThemeModal({ isOpen, onClose }) {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 text-slate-100 rounded-2xl p-5 sm:p-6 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <Palette className="size-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-100">Theme Studio</h3>
              <p className="text-xs text-slate-400">Choose from 32 distinct color themes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
            aria-label="Close theme modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* THEMES GRID */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 py-1">
          {THEMES.map((t) => {
            const isSelected = theme === t;
            return (
              <button
                key={t}
                onClick={() => setTheme(t)}
                data-theme={t}
                className={`group flex flex-col gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-cyan-400 ring-2 ring-cyan-400/30 bg-base-100 shadow-md scale-[1.02]"
                    : "border-slate-700/60 hover:border-slate-500 bg-base-100/80 hover:bg-base-100"
                }`}
              >
                {/* THEME NAME & SELECTION INDICATOR */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold capitalize text-base-content truncate">
                    {t === "dark" ? "Chatify (Default)" : t}
                  </span>
                  {isSelected && <Check className="size-3.5 text-cyan-400 shrink-0" />}
                </div>

                {/* COLOR PALETTE PREVIEW SWATCHES */}
                <div className="grid grid-cols-4 gap-1 w-full h-5 rounded-md overflow-hidden p-0.5 bg-base-200">
                  <div className="rounded-sm bg-primary h-full" title="Primary" />
                  <div className="rounded-sm bg-secondary h-full" title="Secondary" />
                  <div className="rounded-sm bg-accent h-full" title="Accent" />
                  <div className="rounded-sm bg-neutral h-full" title="Neutral" />
                </div>
              </button>
            );
          })}
        </div>

        {/* MODAL FOOTER */}
        <div className="border-t border-slate-700/60 pt-3 flex justify-between items-center text-xs text-slate-400">
          <span>Active: <strong className="text-cyan-400 capitalize">{theme}</strong></span>
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThemeModal;

