"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full transition bg-card shadow-theme hover:scale-105"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {theme === "dark" ? (
        <Moon
          size={21}
          className="fill-[#4dabf7] stroke-none transition-transform duration-300"
        />
      ) : (
        <Sun
          size={21}
          className="text-[#f57c00] transition-transform duration-300"
        />
      )}
    </button>
  );
}
