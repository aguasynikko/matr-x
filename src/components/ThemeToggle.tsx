import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';

export function ThemeToggle() {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg transition-colors duration-200 bg-gray-200 dark:bg-dark-input hover:bg-gray-300 dark:hover:bg-dark-hover text-gray-800 dark:text-dark-text"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
}
