import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        console: {
          canvas: "var(--color-canvas)",
          surface: "var(--color-surface)",
          "surface-subtle": "var(--color-surface-subtle)",
          border: "var(--color-border)",
          text: "var(--color-text)",
          "text-muted": "var(--color-text-muted)",
          accent: "var(--color-accent)",
          "accent-hover": "var(--color-accent-hover)",
          "accent-subtle": "var(--color-accent-subtle)",
          signal: "var(--color-success)",
        },
      },
      boxShadow: {
        tactile: "0 1px 2px rgba(0, 0, 0, 0.12)",
        "tactile-press": "inset 0 1px 2px rgba(0, 0, 0, 0.2)",
        "inset-rim": "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      },
      borderRadius: {
        xs: "2px",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: false,
    base: false,
  },
};
