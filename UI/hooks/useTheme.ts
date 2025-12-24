// "use client";

// import { useEffect, useState } from "react";

// type Mode = "light" | "dark";
// const STORAGE_KEY = "theme";

// export function useTheme() {
//   const [mode, setMode] = useState<Mode | null>(null);

//   // 🔹 INITIAL LOAD (ONE TIME ONLY)
//   useEffect(() => {
//     const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;

//     let resolved: Mode;

//     if (saved === "light" || saved === "dark") {
//       resolved = saved; // ✅ user choice wins
//     } else {
//       // ✅ fallback to system ONLY if no saved value
//       resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
//         ? "dark"
//         : "light";
//     }

//     setMode(resolved);
//     apply(resolved);
//   }, []);

//   // 🔹 APPLY FUNCTION
//   const apply = (m: Mode) => {
//     const root = document.documentElement;

//     root.classList.remove("light-mode", "dark-mode");
//     root.classList.add(`${m}-mode`);
//     root.classList.toggle("dark", m === "dark");
//   };

//   // 🔹 USER TOGGLE
//   const toggle = () => {
//     if (!mode) return;

//     const next = mode === "dark" ? "light" : "dark";
//     setMode(next);
//     localStorage.setItem(STORAGE_KEY, next);
//     apply(next);
//   };

//   return {
//     theme: mode, // "light" | "dark"
//     toggle,
//     setLight: () => {
//       setMode("light");
//       localStorage.setItem(STORAGE_KEY, "light");
//       apply("light");
//     },
//     setDark: () => {
//       setMode("dark");
//       localStorage.setItem(STORAGE_KEY, "dark");
//       apply("dark");
//     },
//   };
// }
