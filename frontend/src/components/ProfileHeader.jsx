import { useState, useRef } from "react";
import {
  CameraIcon,
  LogOutIcon,
  VolumeOffIcon,
  Volume2Icon,
  Palette,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ThemeModal from "./ThemeModal";
import toast from "react-hot-toast";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
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
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      try {
        await updateProfile({ profilePic: base64Image });
        setSelectedImg(base64Image);
      } catch {
        setSelectedImg(null);
      }
    };
  };

  return (
    <div className="p-4 sm:p-6 border-b border-base-content/10 shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {/* AVATAR */}
          <div className="avatar online shrink-0 relative">
            <button
              className="size-12 sm:size-14 rounded-full overflow-hidden relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => fileInputRef.current.click()}
              aria-label="Change profile picture"
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>

            {/* Mobile-visible camera edit indicator badge */}
            <div className="absolute -bottom-1 -right-1 bg-base-300 border border-base-content/20 rounded-full p-1 text-base-content pointer-events-none shadow-sm">
              <CameraIcon className="size-3" />
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div className="min-w-0">
            <h3 className="text-base-content font-medium text-sm sm:text-base max-w-[150px] sm:max-w-[180px] truncate">
              {authUser.fullName}
            </h3>

            <p className="text-base-content/60 text-xs">Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* THEME SWITCHER BTN */}
          <button
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-base-content/70 hover:text-primary transition-colors cursor-pointer rounded-lg"
            onClick={() => setShowThemeModal(true)}
            aria-label="Change theme"
            title="Change theme"
          >
            <Palette className="size-5" />
          </button>

          {/* SOUND TOGGLE BTN */}
          <button
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-base-content/70 hover:text-base-content transition-colors cursor-pointer rounded-lg"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound
                .play()
                .catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
            aria-label={isSoundEnabled ? "Disable sounds" : "Enable sounds"}
            title={isSoundEnabled ? "Disable sounds" : "Enable sounds"}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>

          {/* LOGOUT BTN */}
          <button
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-base-content/70 hover:text-rose-400 transition-colors cursor-pointer rounded-lg"
            onClick={() => setShowLogoutConfirm(true)}
            aria-label="Logout"
            title="Logout"
          >
            <LogOutIcon className="size-5" />
          </button>
        </div>
      </div>

      {/* THEME PICKER MODAL */}
      <ThemeModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-base-200 border border-base-content/10 rounded-xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-base-content">
            <h4 className="text-base font-semibold flex items-center gap-2">
              <LogOutIcon className="size-5 text-rose-400" />
              Confirm Logout
            </h4>
            <p className="text-sm text-base-content/80">
              Are you sure you want to log out of Chatify?
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 px-3 rounded-lg bg-base-300 hover:bg-base-100 text-base-content text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ProfileHeader;
