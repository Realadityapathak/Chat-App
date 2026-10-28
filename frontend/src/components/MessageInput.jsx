import { useEffect, useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, Pencil, Reply, SendIcon, XIcon } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const {
    sendMessage,
    isSendingMessage,
    sendTyping,
    isSoundEnabled,
    replyingToMessage,
    setReplyingToMessage,
    editingMessage,
    setEditingMessage,
    editMessage,
  } = useChatStore();

  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.text || "");
    }
  }, [editingMessage]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      sendTyping(false);
    };
  }, [sendTyping]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    if (isSoundEnabled) playRandomKeyStrokeSound();

    if (!editingMessage) {
      if (val.trim()) {
        sendTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          sendTyping(false);
        }, 1500);
      } else {
        sendTyping(false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (isSendingMessage) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    if (editingMessage) {
      if (!text.trim()) return;
      editMessage(editingMessage._id, text.trim());
      setText("");
      return;
    }

    if (!text.trim() && !imagePreview) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    sendTyping(false);

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });
    setText("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-2 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-base-content/10 shrink-0 bg-base-100/50 backdrop-blur-sm">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-base-content/20"
            />
            <button
              onClick={removeImage}
              aria-label="Remove image"
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-base-300 flex items-center justify-center text-base-content hover:bg-base-200 border border-base-content/20 cursor-pointer"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {editingMessage && (
        <div className="max-w-3xl mx-auto mb-2.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-between text-xs sm:text-sm text-primary">
          <div className="flex items-center gap-2 truncate">
            <Pencil className="w-4 h-4 shrink-0 text-primary" />
            <span className="font-semibold text-primary">Editing:</span>
            <span className="truncate opacity-90">{editingMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingMessage(null);
              setText("");
            }}
            className="p-1 hover:opacity-75 cursor-pointer ml-2"
            aria-label="Cancel edit"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {replyingToMessage && !editingMessage && (
        <div className="max-w-3xl mx-auto mb-2.5 px-3 py-1.5 rounded-lg bg-base-200 border border-base-content/15 flex items-center justify-between text-xs sm:text-sm text-base-content">
          <div className="flex items-center gap-2 truncate">
            <Reply className="w-4 h-4 shrink-0 text-primary" />
            <span className="font-semibold text-primary">Replying:</span>
            <span className="truncate opacity-80">
              {replyingToMessage.text ||
                (replyingToMessage.image ? "Shared an image" : "message")}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setReplyingToMessage(null)}
            className="p-1 hover:opacity-75 cursor-pointer ml-2"
            aria-label="Cancel reply"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-3"
      >
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          className="flex-1 bg-base-200/60 border border-base-content/20 rounded-lg py-2.5 px-3 sm:px-4 text-[16px] sm:text-sm text-base-content placeholder-base-content/40 focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px]"
          placeholder={
            editingMessage ? "Update your message..." : "Type your message..."
          }
        />

        {!editingMessage && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach image"
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center bg-base-200/60 text-base-content/60 hover:text-base-content rounded-lg transition-colors shrink-0 cursor-pointer ${
                imagePreview ? "text-primary" : ""
              }`}
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          </>
        )}

        <button
          type="submit"
          disabled={(!text.trim() && !imagePreview) || isSendingMessage}
          aria-label={editingMessage ? "Update message" : "Send message"}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-primary text-primary-content rounded-lg px-3 sm:px-4 font-medium hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer shadow-sm"
        >
          {editingMessage ? (
            <Pencil className="w-5 h-5" />
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}
export default MessageInput;
