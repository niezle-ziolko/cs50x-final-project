"use client";
import { useTheme } from "context/theme-context";

import Sun from "styles/icons/sun";
import Moon from "styles/icons/moon";

export default function ThemeButton() {
  // Destructure dark mode state and setter function from theme context
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <div className="u15 gap-2 text-center align-middle">
      <Sun />

      <label className="p-0 h-7 w-35 relative inline-block cursor-pointer">
        <input className="h-7 absolute opacity-0 cursor-pointer" type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
        <span className="block w-full h-full text-x relative rounded-full overflow-hidden bg-secondary text-secondary transition-(--transition)">
          <span className={`u10 right-7 md:right-5 ${isDarkMode ? "hidden" : "block"}`}>
            Dark
          </span>

          <span className={`u10 left-7 md:left-5 ${isDarkMode ? "block" : "hidden"}`}>
            Light
          </span>

          <span className={`h-7 w-18 grid absolute text-secondary text-center items-center rounded-full transition-(--transition) ${isDarkMode ? "left-17 bg-white" : "left-0 bg-black"}`}>
            {isDarkMode ? "Dark" : "Light"}
          </span>
        </span>
      </label>

      <Moon />
    </div>
  );
};