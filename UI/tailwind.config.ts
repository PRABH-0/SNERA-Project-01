// @ts-nocheck
import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-tertiary": "var(--bg-tertiary)",
        "bg-section": "var(--bg-section)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        "border-theme": "var(--border-color)",
        accent: "var(--accent-color)",
        "accent-hover": "var(--accent-hover)",
        card: "var(--card-bg)",
        overlay: "var(--overlay-bg)",
        "button-text": "var(--button-text)",
        "section-border": "var(--section-border)",
      },
      boxShadow: {
        theme: "0 8px 24px var(--shadow-color)",
      },
    },
  },

  darkMode: ["class", ".dark-mode"],

  plugins: [daisyui],

  daisyui: {
    themes: ["light", "dark"],
    darkTheme: "dark",
  },
};

export default config;
