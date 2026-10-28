import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const { getAllContacts, allContacts, chats, setSelectedUser, isUsersLoading, typingUsers } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const unreadCounts = chats.reduce((acc, c) => {
    if (c.unreadCount) acc[c._id] = c.unreadCount;
    return acc;
  }, {});

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-base-300/40 p-3 sm:p-4 rounded-xl cursor-pointer hover:bg-base-300/80 transition-all min-h-[44px] flex items-center justify-between border border-transparent hover:border-base-content/10"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"} shrink-0`}>
              <div className="size-10 sm:size-12 rounded-full">
                <img src={contact.profilePic || "/avatar.png"} alt={contact.fullName} />
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="text-base-content font-medium truncate text-sm sm:text-base">{contact.fullName}</h4>
              {typingUsers[contact._id] && (
                <p className="text-xs text-primary animate-pulse font-medium">typing...</p>
              )}
            </div>
          </div>

          {unreadCounts[contact._id] > 0 && (
            <span className="badge badge-primary font-bold text-xs px-2 py-0.5 rounded-full shadow-sm shrink-0">
              {unreadCounts[contact._id] > 99 ? "99+" : unreadCounts[contact._id]}
            </span>
          )}
        </div>
      ))}
    </>
  );
}
export default ContactList;
