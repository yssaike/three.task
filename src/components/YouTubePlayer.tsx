import React, { useState, useRef, useEffect } from 'react';
import { Youtube, ExternalLink, Music, Volume2, Play, Maximize2, X } from 'lucide-react';

interface YouTubePlayerProps {
  isDarkMode: boolean;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ isDarkMode }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  // Predefined popular background audio videos with actual YouTube video IDs
  const quickLinks = [
    { 
      label: 'Brown Noise', 
      videoId: 'RqzGzwTY-6w', 
      icon: '🌊',
      description: '10 Hours Brown Noise for Focus'
    },
    { 
      label: 'Lo-fi Hip Hop', 
      videoId: '5qap5aO4i9A', 
      icon: '🎵',
      description: 'Lofi Hip Hop Radio - Beats to Study/Relax'
    },
    { 
      label: 'Rain Sounds', 
      videoId: 'mPZkdNFkNps', 
      icon: '🌧️',
      description: '10 Hours Rain Sounds for Sleep'
    },
    { 
      label: 'Binaural Beats', 
      videoId: 'szEfp07r5Gw', 
      icon: '🧠',
      description: '40Hz Gamma Binaural Beats for Focus'
    },
    { 
      label: 'Café Ambience', 
      videoId: 'h2zkV-l_TbY', 
      icon: '☕',
      description: 'Coffee Shop Ambience & Jazz Music'
    },
    { 
      label: 'Nature Sounds', 
      videoId: 'eKFTSSKCzWA', 
      icon: '🌲',
      description: 'Forest Sounds - Birds Chirping'
    }
  ];

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Load video from URL
  const loadVideo = (url: string) => {
    const videoId = extractVideoId(url);
    if (videoId) {
      setCurrentVideoId(videoId);
      setVideoUrl(url);
      setIsPlaying(true);
    }
  };

  // Load video from predefined link
  const loadQuickVideo = (videoId: string) => {
    setCurrentVideoId(videoId);
    setVideoUrl(`https://www.youtube.com/watch?v=${videoId}`);
    setIsPlaying(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoUrl.trim()) {
      loadVideo(videoUrl.trim());
    }
  };

  // Open YouTube search
  const openYouTubeSearch = (query: string = searchQuery) => {
    const searchUrl = query 
      ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
      : 'https://www.youtube.com';
    
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen && playerRef.current) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Clear video
  const clearVideo = () => {
    setCurrentVideoId(null);
    setVideoUrl('');
    setIsPlaying(false);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-light text-primary flex items-center gap-3">
          <Youtube size={24} className="text-red-500" />
          Background Audio Player
        </h2>
        <button
          onClick={() => openYouTubeSearch()}
          className="text-secondary hover:text-primary transition-colors duration-200 text-sm font-medium flex items-center gap-2"
        >
          <ExternalLink size={16} />
          Browse YouTube
        </button>
      </div>

      {/* Video Player */}
      {currentVideoId && (
        <div className="mb-6">
          <div 
            ref={playerRef}
            className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 transition-all duration-300 hover:shadow-3xl group"
            style={{
              aspectRatio: '16/9',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(59, 130, 246, 0.3)',
              boxShadow: isDarkMode 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
                : '0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.2)'
            }}
          >
            {/* YouTube Embed with proper parameters */}
            <iframe
              src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0&controls=1&enablejsapi=1&origin=${window.location.origin}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              style={{
                borderRadius: 'inherit'
              }}
              onLoad={() => setIsPlaying(true)}
            />

            {/* Overlay Controls */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={toggleFullscreen}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                aria-label="Toggle fullscreen"
              >
                <Maximize2 size={18} />
              </button>
              <button
                onClick={clearVideo}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                aria-label="Close video"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Video Info */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-secondary font-medium">
                {isPlaying ? 'Now Playing' : 'Paused'}
              </span>
            </div>
            <button
              onClick={() => window.open(`https://www.youtube.com/watch?v=${currentVideoId}`, '_blank')}
              className="text-xs text-tertiary hover:text-primary transition-colors duration-200 flex items-center gap-1"
            >
              <ExternalLink size={12} />
              Open in YouTube
            </button>
          </div>
        </div>
      )}

      {/* URL Input Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste YouTube URL or video ID here..."
              className="w-full px-4 py-3 glass-card text-input placeholder:text-placeholder border-none outline-none text-base font-normal focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
          </div>
          <button
            type="submit"
            disabled={!videoUrl.trim()}
            className="glass-card px-6 py-3 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition-all duration-300 ease-in-out flex items-center gap-2 font-medium text-button hover:text-button focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Play size={18} />
            Load
          </button>
        </div>
      </form>

      {/* Search Form */}
      <form onSubmit={(e) => { e.preventDefault(); openYouTubeSearch(searchQuery); }} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search YouTube for background music..."
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => loadQuickVideo(link.videoId)}
              className="p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] border-2 group"
              style={{
                backgroundColor: currentVideoId === link.videoId
                  ? isDarkMode 
                    ? 'rgba(59, 130, 246, 0.2)' 
                    : 'rgba(59, 130, 246, 0.1)'
                  : isDarkMode 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(59, 130, 246, 0.05)',
                borderColor: currentVideoId === link.videoId
                  ? isDarkMode 
                    ? 'rgba(59, 130, 246, 0.5)' 
                    : 'rgba(59, 130, 246, 0.3)'
                  : isDarkMode 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(59, 130, 246, 0.2)'
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{link.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-primary font-medium text-sm group-hover:text-blue-500 transition-colors duration-200 flex items-center gap-2">
                    {link.label}
                    {currentVideoId === link.videoId && isPlaying && (
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </div>
                  <div className="text-tertiary text-xs mt-1 line-clamp-2">
                    {link.description}
                  </div>
                  <div className="text-tertiary text-xs mt-2 flex items-center gap-1">
                    <Play size={10} />
                    Click to play
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
            <h4 className="text-primary font-medium text-sm mb-1">How to use</h4>
            <ul className="text-secondary text-sm leading-relaxed space-y-1">
              <li>• Click any category above to instantly load background audio</li>
              <li>• Paste any YouTube URL to play custom videos</li>
              <li>• Use search to find specific content on YouTube</li>
              <li>• Click fullscreen button for immersive viewing</li>
              <li>• Videos will autoplay with sound enabled</li>
              <li>• Use YouTube's built-in controls to adjust volume and playback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};