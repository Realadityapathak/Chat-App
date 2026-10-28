import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoChatsFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
        <MessageCircleIcon className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h4 className="text-base-content font-medium mb-1">No conversations yet</h4>
        <p className="text-base-content/60 text-sm px-4">
          Start a new chat by selecting a contact from the contacts tab
        </p>
      </div>
      <button
        onClick={() => setActiveTab("contacts")}
        className="min-h-[44px] px-4 py-2 text-sm text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer flex items-center justify-center mx-auto"
      >
        Find contacts
      </button>
    </div>
  );
}
export default NoChatsFound;
