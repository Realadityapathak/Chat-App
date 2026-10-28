import { useState, useRef } from "react";
import { CameraIcon, LogOutIcon, VolumeOffIcon, Volume2Icon, SunIcon, MoonIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const { theme, toggleTheme } = useThemeStore();
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
    <div className="p-4 border-b border-console-border shrink-0 bg-console-surface">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {/* SQUIRCLE AVATAR */}
          <div className="relative shrink-0">
            <button
              className="size-11 sm:size-12 rounded-[8px] overflow-hidden relative group cursor-pointer border border-console-border focus:outline-none focus:ring-2 focus:ring-console-accent"
              onClick={() => fileInputRef.current.click()}
              aria-label="Upload operator picture"
              type="button"
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt={authUser.fullName}
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus:opacity-100 flex items-center justify-center transition-opacity">
                <CameraIcon className="size-4 text-white" />
              </div>
            </button>

            {/* LIVE STATUS PIP */}
            <span
              className="absolute -top-1 -right-1 size-2.5 rounded-full bg-emerald-500 ring-2 ring-console-surface"
              title="Channel status: Active"
            />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* OPERATOR DETAILS */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-console-text font-bold text-sm truncate leading-tight">
                {authUser.fullName}
              </h2>
            </div>
            <p className="text-console-text-muted text-[11px] font-mono mt-0.5 flex items-center gap-1">
              <span className="inline-block size-1 rounded-full bg-emerald-500" />
              ONLINE // TRANSMITTING
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-1">
          {/* THEME TOGGLE */}
          <button
            className="size-9 rounded-md flex items-center justify-center text-console-text-muted hover:text-console-text hover:bg-console-surface-subtle border border-transparent hover:border-console-border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-console-accent"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            type="button"
          >
            {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
          </button>

          {/* AUDIO TOGGLE */}
          <button
            className="size-9 rounded-md flex items-center justify-center text-console-text-muted hover:text-console-text hover:bg-console-surface-subtle border border-transparent hover:border-console-border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-console-accent"
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch((error) => console.log("Audio playback failed:", error));
              toggleSound();
            }}
            aria-label={isSoundEnabled ? "Disable acoustic feedback" : "Enable acoustic feedback"}
            type="button"
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-4 text-console-accent" />
            ) : (
              <VolumeOffIcon className="size-4" />
            )}
          </button>

          {/* LOGOUT */}
          <button
            className="size-9 rounded-md flex items-center justify-center text-console-text-muted hover:text-rose-500 hover:bg-console-surface-subtle border border-transparent hover:border-console-border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500"
            onClick={logout}
            aria-label="Disconnect session"
            type="button"
          >
            <LogOutIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileHeader;
