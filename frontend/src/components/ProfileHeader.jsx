import { useState, useRef } from "react";
import { CameraIcon, LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="p-4 sm:p-6 border-b border-slate-700/50 shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {/* AVATAR */}
          <div className="avatar online shrink-0 relative">
            <button
              className="size-12 sm:size-14 rounded-full overflow-hidden relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
            <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-slate-700 rounded-full p-1 text-slate-300 pointer-events-none shadow-sm">
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
            <h3 className="text-slate-200 font-medium text-sm sm:text-base max-w-[150px] sm:max-w-[180px] truncate">
              {authUser.fullName}
            </h3>

            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* LOGOUT BTN */}
          <button
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer rounded-lg"
            onClick={logout}
            aria-label="Logout"
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* SOUND TOGGLE BTN */}
          <button
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer rounded-lg"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
            aria-label={isSoundEnabled ? "Disable sounds" : "Enable sounds"}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileHeader;
