import React, { useState } from 'react';
import { Youtube, ExternalLink, Music, Volume2 } from 'lucide-react';

interface YouTubeLinkOpenerProps {
  isDarkMode: boolean;
}

export const YouTubeLinkOpener: React.FC<YouTubeLinkOpenerProps> = ({ isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Predefined popular background audio searches
  const quickLinks = [
    { label: 'Brown Noise', query: 'brown noise 10 hours', icon: '🌊' },
    { label: 'Lo-fi Hip Hop', query: 'lofi hip hop study music', icon: '🎵' },
    { label: 'Rain Sounds', query: 'rain sounds for sleeping', icon: '🌧️' },
    { label: 'Binaural Beats', query: 'binaural beats focus', icon: '🧠' },
    { label: 'Café Ambience', query: 'coffee shop ambience', icon: '☕' },
    { label: 'Nature Sounds', query: 'forest sounds relaxing', icon: '🌲' }
  ];

  const openYouTube = (query: string = searchQuery) => {
    const searchUrl = query 
      ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
      : 'https://www.youtube.com';
    
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      openYouTube(searchQuery.trim());
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-light text-primary flex items-center gap-3">
          <Youtube size={24} className="text-red-500" />
          Background Audio
        </h2>
        <button
          onClick={() => openYouTube()}
          className="text-secondary hover:text-primary transition-colors duration-200 text-sm font-medium flex items-center gap-2"
        >
          <ExternalLink size={16} />
          Open YouTube
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for background music or sounds..."
              className="w-full px-4 py-3 glass-card text-input placeholder:text-placeholder border-none outline-none text-base font-normal focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
          </div>
          <button
            type="submit"
            disabled={!searchQuery.trim()}
            className="glass-card px-6 py-3 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition-all duration-300 ease-in-out flex items-center gap-2 font-medium text-button hover:text-button focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ExternalLink size={18} />
            Search
          </button>
        </div>
      </form>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-medium text-primary mb-4 flex items-center gap-2">
          <Music size={20} />
          Popular Background Audio
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => openYouTube(link.query)}
              className="p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] border-2 group"
              style={{
                backgroundColor: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(59, 130, 246, 0.05)',
                borderColor: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(59, 130, 246, 0.2)'
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{link.icon}</span>
                <div className="flex-1">
                  <div className="text-primary font-medium text-sm group-hover:text-blue-500 transition-colors duration-200">
                    {link.label}
                  </div>
                  <div className="text-tertiary text-xs mt-1 flex items-center gap-1">
                    <ExternalLink size={10} />
                    Opens YouTube
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div 
        className="mt-6 p-4 rounded-lg border"
        style={{
          backgroundColor: isDarkMode 
            ? 'rgba(59, 130, 246, 0.1)' 
            : 'rgba(59, 130, 246, 0.05)',
          borderColor: isDarkMode 
            ? 'rgba(59, 130, 246, 0.3)' 
            : 'rgba(59, 130, 246, 0.2)'
        }}
      >
        <div className="flex items-start gap-3">
          <Volume2 size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-primary font-medium text-sm mb-1">How it works</h4>
            <p className="text-secondary text-sm leading-relaxed">
              Click any category above or search for specific audio to open YouTube in a new tab. 
              You can then play your chosen background audio while continuing to work on your tasks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};