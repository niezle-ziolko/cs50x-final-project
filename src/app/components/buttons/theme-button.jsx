"use client";
import { useTheme } from "context/theme-context";

import Sun from "styles/icons/sun";
import Moon from "styles/icons/moon";

export default function ThemeButton() {
  // Destructure dark mode state and setter function from theme context
  const { isDarkMode, setIsDarkMode } = useTheme();
  // Common style string used for positioning and transition on toggle labels
  const style = "top-2 md:top-1.5 absolute transition-(--transition)";

  return (
    <div className="flex gap-2 text-center align-middle items-center">
      <Sun />

      <label className="p-(--n) h-7 w-35 relative inline-block cursor-pointer">
        <input className="h-7 absolute opacity-(--n) cursor-pointer" type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
        <span className="block w-(--fp) h-(--fp) text-x relative rounded-full overflow-hidden bg-(--secondary) text-(--primary) transition-(--transition)">
          <span className={`${style} right-7 md:right-5 ${isDarkMode ? "hidden" : "block"}`}>
            Dark
          </span>

          <span className={`${style} left-7 md:left-5 ${isDarkMode ? "block" : "hidden"}`}>
            Light
          </span>

          <span className={`h-7 w-18 grid absolute text-center items-center rounded-full transition-(--transition) ${isDarkMode ? "left-17 bg-(--b)" : "left-(--n) bg-(--w)"}`}>
            {isDarkMode ? "Dark" : "Light"}
          </span>
        </span>
      </label>

      <Moon />
    </div>
  );
};