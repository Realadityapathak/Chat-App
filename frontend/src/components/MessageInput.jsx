import { useRef, useState, useEffect } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon, ActivityIcon } from "lucide-react";
import { m } from "motion/react";
import { tactilePress } from "../lib/motion";

const MotionButton = m.button;

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [keystrokeCadence, setKeystrokeCadence] = useState(false);

  const fileInputRef = useRef(null);
  const cadenceTimeoutRef = useRef(null);

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
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (isSoundEnabled) playRandomKeyStrokeSound();

    // Trigger signature audio-cadence visualizer tick
    setKeystrokeCadence(true);
    if (cadenceTimeoutRef.current) clearTimeout(cadenceTimeoutRef.current);
    cadenceTimeoutRef.current = setTimeout(() => {
      setKeystrokeCadence(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (cadenceTimeoutRef.current) clearTimeout(cadenceTimeoutRef.current);
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file format. Select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Payload too large. Maximum image size is 5MB.");
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
    <div className="p-2.5 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-console-border shrink-0 bg-console-surface">
      {/* SIGNATURE ELEMENT: TACTILE SOUND DECK TELEMETRY STRIP */}
      <div className="max-w-2xl mx-auto mb-2 px-1 flex items-center justify-between text-[10px] font-mono text-console-text-muted select-none">
        <div className="flex items-center gap-2">
          <ActivityIcon className={`size-3 ${keystrokeCadence ? "text-console-accent" : "text-console-text-muted"}`} />
          <span>SOUND DECK: {isSoundEnabled ? "ACOUSTIC ACTIVE" : "MUTED"}</span>
        </div>

        {/* CADENCE TICK METER */}
        <div className="flex items-center gap-0.5 h-2">
          {[1, 2, 3, 4, 5, 6].map((bar) => (
            <span
              key={bar}
              className={`w-0.5 rounded-full transition-all duration-75 ${
                keystrokeCadence
                  ? "bg-console-accent h-2.5"
                  : "bg-console-border h-1"
              }`}
            />
          ))}
        </div>
      </div>

      {imagePreview && (
        <div className="max-w-2xl mx-auto mb-2 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Attachment preview"
              className="size-16 sm:size-20 object-cover rounded-md border border-console-border"
            />
            <button
              onClick={removeImage}
              aria-label="Remove image payload"
              className="absolute -top-2 -right-2 size-6 rounded-full bg-console-surface border border-console-border text-console-text-muted hover:text-rose-500 flex items-center justify-center cursor-pointer shadow-sm"
              type="button"
            >
              <XIcon className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            className="w-full bg-console-surface-subtle border border-console-border rounded-md py-2.5 pl-3.5 pr-3 text-[16px] sm:text-sm text-console-text placeholder:text-console-text-muted focus:outline-none focus:ring-2 focus:ring-console-accent focus:border-transparent min-h-[44px] transition-all font-sans"
            placeholder="Write transmission..."
          />
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {/* ATTACH IMAGE BUTTON */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach image transmission"
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md border transition-all shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-console-accent ${
            imagePreview
              ? "bg-console-accent/15 border-console-accent text-console-accent"
              : "bg-console-surface-subtle border-console-border text-console-text-muted hover:text-console-text hover:bg-console-surface"
          }`}
        >
          <ImageIcon className="size-4 sm:size-5" />
        </button>

        {/* SEND BUTTON */}
        <MotionButton
          whileTap={tactilePress.tap}
          type="submit"
          disabled={!text.trim() && !imagePreview}
          aria-label="Send transmission message"
          className="min-h-[44px] min-w-[44px] px-4 flex items-center justify-center gap-1.5 bg-console-accent text-white font-mono font-semibold text-xs rounded-md hover:bg-console-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer shadow-tactile focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-console-accent"
        >
          <span className="hidden sm:inline">DISPATCH</span>
          <SendIcon className="size-4" />
        </MotionButton>
      </form>
    </div>
  );
}
export default MessageInput;
