import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, selectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <div className="space-y-1">
      {allContacts.map((contact) => {
        const isOnline = onlineUsers.includes(contact._id);
        const isSelected = selectedUser?._id === contact._id;

        return (
          <button
            key={contact._id}
            onClick={() => setSelectedUser(contact)}
            className={`w-full p-2.5 rounded-md text-left transition-all cursor-pointer flex items-center justify-between min-h-[52px] border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-console-accent ${
              isSelected
                ? "bg-console-surface border-console-accent/40 shadow-tactile text-console-text"
                : "bg-transparent border-transparent hover:bg-console-surface hover:border-console-border text-console-text-muted hover:text-console-text"
            }`}
            type="button"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* SQUIRCLE AVATAR */}
              <div className="relative shrink-0">
                <div className="size-10 rounded-[6px] overflow-hidden border border-console-border bg-console-surface-subtle">
                  <img
                    src={contact.profilePic || "/avatar.png"}
                    alt={contact.fullName}
                    className="size-full object-cover"
                  />
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 size-2 rounded-full ring-2 ring-console-surface ${
                    isOnline ? "bg-emerald-500" : "bg-console-border"
                  }`}
                />
              </div>

              {/* NAME & STATUS */}
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate leading-tight text-console-text">
                  {contact.fullName}
                </h3>
                <p className="text-[11px] font-mono mt-0.5 text-console-text-muted">
                  {isOnline ? "AVAILABLE" : "OFFLINE"}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono text-console-text-muted group-hover:text-console-accent">
              CONNECT
            </span>
          </button>
        );
      })}
    </div>
  );
}
export default ContactList;
