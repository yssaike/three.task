import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { DarkModeToggle } from './DarkModeToggle';

interface SettingsMenuProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ isDarkMode, onToggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Settings Button */}
      <button
        onClick={toggleMenu}
        className="glass-card p-3 hover:scale-105 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Open settings menu"
        title="Settings"
      >
        <Settings size={24} className="text-primary" />
      </button>

      {/* Settings Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            style={{
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(59, 130, 246, 0.1)'
            }}
            onClick={closeMenu}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-full right-0 mt-2 w-80 glass-card p-6 z-50 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-primary">Settings</h3>
              <button
                onClick={closeMenu}
                className="w-8 h-8 text-secondary hover:text-primary rounded-full flex items-center justify-center transition-colors duration-200"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.1)'
                }}
                aria-label="Close settings"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Dark Mode Setting */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-primary font-medium">Dark Mode</div>
                  <div className="text-secondary text-sm font-normal">
                    Reduces eye strain in low-light conditions
                  </div>
                </div>
                <DarkModeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
              </div>

              {/* Additional settings can be added here */}
              <div 
                className="border-t pt-4"
                style={{
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(59, 130, 246, 0.2)'
                }}
              >
                <div className="text-xs text-tertiary font-medium">
                  Theme: {isDarkMode ? 'Dark' : 'Light'} Mode
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};