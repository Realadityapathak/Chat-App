import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full max-w-5xl h-dvh sm:h-[780px] sm:max-h-[calc(100dvh-2rem)]">
      <BorderAnimatedContainer>
        {/* LEFT PANE (Sidebar / Channels Directory) */}
        <div
          className={`w-full md:w-80 bg-console-surface md:border-r border-console-border flex flex-col h-full shrink-0 ${
            selectedUser ? "hidden md:flex" : "flex"
          }`}
        >
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-2.5 space-y-1 min-h-0 bg-console-surface">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT PANE (Transmission Feed / Chat Viewport) */}
        <div
          className={`w-full md:w-auto flex-1 flex flex-col bg-console-canvas h-full min-w-0 ${
            selectedUser ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;
