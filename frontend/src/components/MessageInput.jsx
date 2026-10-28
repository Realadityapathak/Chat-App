import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const { sendMessage, isSoundEnabled } = useChatStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

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
    <div className="p-2 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-slate-700/50 shrink-0 bg-slate-900/40 backdrop-blur-sm">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              aria-label="Remove image"
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700 border border-slate-600 cursor-pointer"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2.5 px-3 sm:px-4 text-[16px] sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 min-h-[44px]"
          placeholder="Type your message..."
        />

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
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg transition-colors shrink-0 cursor-pointer ${
            imagePreview ? "text-cyan-400" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          aria-label="Send message"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-3 sm:px-4 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
export default MessageInput;
