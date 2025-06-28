import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="glass-card p-3 hover:scale-105 transition-all duration-300 ease-in-out group focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6">
        <Sun 
          size={24} 
          className={`absolute inset-0 transition-all duration-300 ease-in-out ${
            !isDarkMode 
              ? 'opacity-100 rotate-0 scale-100 text-orange-500' 
              : 'opacity-0 rotate-90 scale-75 text-orange-500'
          }`}
        />
        <Moon 
          size={24} 
          className={`absolute inset-0 transition-all duration-300 ease-in-out ${
            isDarkMode 
              ? 'opacity-100 rotate-0 scale-100 text-blue-400' 
              : 'opacity-0 -rotate-90 scale-75 text-blue-400'
          }`}
        />
      </div>
    </button>
  );
};