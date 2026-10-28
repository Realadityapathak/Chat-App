import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const THEMES = [
  "dark",
  "light",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
];

export const useThemeStore = create((set) => ({
  theme: "dark",

  setTheme: (theme, persistToDb = true) => {
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });

    if (persistToDb) {
      const authUser = useAuthStore.getState().authUser;
      if (authUser) {
        useAuthStore.getState().updateProfile({ theme });
      }
    }
  },

  resetTheme: () => {
    document.documentElement.setAttribute("data-theme", "dark");
    set({ theme: "dark" });
  },
}));
