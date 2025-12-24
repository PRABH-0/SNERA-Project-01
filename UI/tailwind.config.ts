import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* shadcn base tokens → tere variables */
        background: "var(--bg-primary)",
        foreground: "var(--text-primary)",

        card: {
          DEFAULT: "var(--card-bg)",
          foreground: "var(--text-primary)",
        },

        border: "var(--border-color)",
        input: "var(--input-bg)",

        primary: {
          DEFAULT: "var(--accent-color)",
          foreground: "var(--button-text)",
        },

        secondary: {
          DEFAULT: "var(--bg-secondary)",
          foreground: "var(--text-secondary)",
        },

        muted: {
          DEFAULT: "var(--bg-tertiary)",
          foreground: "var(--text-tertiary)",
        },

        ring: "var(--accent-hover)",
        destructive: "var(--error-color)",
        success: "var(--success-color)",
        warning: "var(--warning-color)",
      },
      boxShadow: {
        theme: "0 4px 12px var(--shadow-color)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
