"use client";
import { useTheme } from "context/theme-context";

import Sun from "styles/icons/sun";
import Moon from "styles/icons/moon";

export default function ThemeButton() {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <div className="flex gap-2 text-center align-middle items-center">
      <Sun />

      <label className="p-0 h-7 w-35 relative inline-block cursor-pointer">
        <input className="h-7 absolute opacity-0 cursor-pointer" type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
        <span className="block w-full h-full text-x relative rounded-full overflow-hidden bg-(--secondary) text-(--primary) transition-(--transition)">
          <span className={`top-1.5 right-5 absolute transition-(--transition) ${isDarkMode ? "hidden" : "block"}`}>
            Dark
          </span>

          <span className={`top-1.5 left-5 absolute transition-(--transition) ${isDarkMode ? "block" : "hidden"}`}>
            Light
          </span>

          <span className={`h-7 w-18 grid absolute text-center items-center rounded-full transition-(--transition) ${isDarkMode ? "left-17 bg-(--black)" : "left-0 bg-(--white)"}`}>
            {isDarkMode ? "Dark" : "Light"}
          </span>
        </span>
      </label>

      <Moon />
    </div>
  );
};