import { MessageCircleIcon } from "lucide-react";

const NoChatHistoryPlaceholder = ({ name }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-3 sm:p-6 my-auto">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-full flex items-center justify-center mb-2 sm:mb-5 shrink-0">
        <MessageCircleIcon className="size-6 sm:size-8 text-cyan-400" />
      </div>
      <h3 className="text-base sm:text-lg font-medium text-slate-200 mb-1 sm:mb-3">
        Start your conversation with {name}
      </h3>
      <div className="flex flex-col space-y-2 max-w-md mb-3 sm:mb-5">
        <p className="text-slate-400 text-xs sm:text-sm">
          This is the beginning of your conversation. Send a message to start chatting!
        </p>
        <div className="h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mx-auto"></div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          type="button"
          className="min-h-[36px] sm:min-h-[44px] flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full hover:bg-cyan-500/20 transition-colors cursor-pointer"
        >
          👋 Say Hello
        </button>
        <button
          type="button"
          className="min-h-[36px] sm:min-h-[44px] flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full hover:bg-cyan-500/20 transition-colors cursor-pointer"
        >
          🤝 How are you?
        </button>
        <button
          type="button"
          className="min-h-[36px] sm:min-h-[44px] flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full hover:bg-cyan-500/20 transition-colors cursor-pointer"
        >
          📅 Meet up soon?
        </button>
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;
