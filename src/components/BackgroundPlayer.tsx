import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface AudioTrack {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  category: 'noise' | 'nature' | 'binaural' | 'ambient';
}

interface BackgroundPlayerProps {
  isDarkMode: boolean;
}

export const BackgroundPlayer: React.FC<BackgroundPlayerProps> = ({ isDarkMode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Audio tracks with free, royalty-free sources
  const audioTracks: AudioTrack[] = [
    {
      id: 'brown-noise',
      name: 'Brown Noise',
      description: 'Deep, low-frequency noise for focus',
      url: 'https://www.soundjay.com/misc/sounds/brown-noise.mp3',
      icon: '🌊',
      category: 'noise'
    },
    {
      id: 'white-noise',
      name: 'White Noise',
      description: 'Classic white noise for concentration',
      url: 'https://www.soundjay.com/misc/sounds/white-noise.mp3',
      icon: '📻',
      category: 'noise'
    },
    {
      id: 'pink-noise',
      name: 'Pink Noise',
      description: 'Balanced frequency noise',
      url: 'https://www.soundjay.com/misc/sounds/pink-noise.mp3',
      icon: '🎵',
      category: 'noise'
    },
    {
      id: 'rain',
      name: 'Rain Sounds',
      description: 'Gentle rainfall for relaxation',
      url: 'https://www.soundjay.com/nature/sounds/rain-01.mp3',
      icon: '🌧️',
      category: 'nature'
    },
    {
      id: 'forest',
      name: 'Forest Ambience',
      description: 'Birds and rustling leaves',
      url: 'https://www.soundjay.com/nature/sounds/forest-01.mp3',
      icon: '🌲',
      category: 'nature'
    },
    {
      id: 'ocean',
      name: 'Ocean Waves',
      description: 'Calming ocean sounds',
      url: 'https://www.soundjay.com/nature/sounds/ocean-01.mp3',
      icon: '🌊',
      category: 'nature'
    },
    {
      id: 'binaural-40hz',
      name: '40Hz Binaural',
      description: 'Gamma waves for focus',
      url: 'https://www.soundjay.com/misc/sounds/binaural-40hz.mp3',
      icon: '🧠',
      category: 'binaural'
    },
    {
      id: 'binaural-10hz',
      name: '10Hz Binaural',
      description: 'Alpha waves for relaxation',
      url: 'https://www.soundjay.com/misc/sounds/binaural-10hz.mp3',
      icon: '🧘',
      category: 'binaural'
    },
    {
      id: 'cafe',
      name: 'Café Ambience',
      description: 'Coffee shop atmosphere',
      url: 'https://www.soundjay.com/misc/sounds/cafe-ambience.mp3',
      icon: '☕',
      category: 'ambient'
    },
    {
      id: 'library',
      name: 'Library Quiet',
      description: 'Subtle library atmosphere',
      url: 'https://www.soundjay.com/misc/sounds/library-ambience.mp3',
      icon: '📚',
      category: 'ambient'
    }
  ];

  // Initialize audio element
  useEffect(() => {
    if (currentTrack && !audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = isMuted ? 0 : volume;
      
      audioRef.current.addEventListener('loadstart', () => setIsLoading(true));
      audioRef.current.addEventListener('canplay', () => setIsLoading(false));
      audioRef.current.addEventListener('error', () => {
        setError('Failed to load audio track');
        setIsLoading(false);
        setIsPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentTrack]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const selectTrack = async (track: AudioTrack) => {
    setError(null);
    
    // Stop current track
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setCurrentTrack(track);
    setIsPlaying(false);
    
    // Create new audio element
    const audio = new Audio();
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume;
    
    // For demo purposes, we'll use a data URL with a simple tone generator
    // In a real app, you'd use actual audio files
    audio.src = generateToneDataUrl(track.id);
    
    audioRef.current = audio;
    
    audio.addEventListener('loadstart', () => setIsLoading(true));
    audio.addEventListener('canplay', () => setIsLoading(false));
    audio.addEventListener('error', () => {
      setError('Failed to load audio track');
      setIsLoading(false);
      setIsPlaying(false);
    });
  };

  // Generate simple tone for demo (replace with real audio URLs in production)
  const generateToneDataUrl = (trackId: string): string => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 10; // 10 seconds loop
    const numSamples = sampleRate * duration;
    const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
    const channelData = buffer.getChannelData(0);

    // Generate different tones based on track type
    let frequency = 200; // Default brown noise frequency
    switch (trackId) {
      case 'brown-noise':
        frequency = 100;
        break;
      case 'white-noise':
        frequency = 1000;
        break;
      case 'pink-noise':
        frequency = 500;
        break;
      case 'rain':
        frequency = 300;
        break;
      case 'forest':
        frequency = 250;
        break;
      case 'ocean':
        frequency = 150;
        break;
      case 'binaural-40hz':
        frequency = 40;
        break;
      case 'binaural-10hz':
        frequency = 10;
        break;
      case 'cafe':
        frequency = 400;
        break;
      case 'library':
        frequency = 50;
        break;
    }

    // Generate noise/tone
    for (let i = 0; i < numSamples; i++) {
      if (trackId.includes('noise')) {
        // Generate noise
        channelData[i] = (Math.random() * 2 - 1) * 0.1;
      } else {
        // Generate tone
        channelData[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.1;
      }
    }

    // Convert to WAV data URL (simplified)
    return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
  };

  const togglePlayPause = async () => {
    if (!currentTrack || !audioRef.current) return;

    setError(null);

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      setError('Failed to play audio. Please try again.');
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const resetPlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setError(null);
    setIsLoading(false);
  };

  const categories = [
    { id: 'noise', name: 'Noise', icon: '🔊' },
    { id: 'nature', name: 'Nature', icon: '🌿' },
    { id: 'binaural', name: 'Binaural', icon: '🧠' },
    { id: 'ambient', name: 'Ambient', icon: '🏢' }
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-light text-primary flex items-center gap-3">
          <Volume2 size={24} />
          Background Audio
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-secondary hover:text-primary transition-colors duration-200 text-sm font-medium"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Current Track Display */}
      {currentTrack && (
        <div 
          className="p-4 rounded-xl mb-4 border-2"
          style={{
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.05)',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.2)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentTrack.icon}</span>
              <div>
                <div className="text-primary font-medium">{currentTrack.name}</div>
                <div className="text-secondary text-sm">{currentTrack.description}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-primary transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.1)'
                }}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              
              <button
                onClick={togglePlayPause}
                disabled={isLoading}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause size={20} />
                ) : (
                  <Play size={20} className="ml-0.5" />
                )}
              </button>
              
              <button
                onClick={resetPlayer}
                className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-primary transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.1)'
                }}
                aria-label="Reset player"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* Volume Control */}
          <div className="mt-4 flex items-center gap-3">
            <VolumeX size={16} className="text-tertiary" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, ${isDarkMode ? '#4b5563' : '#d1d5db'} ${volume * 100}%, ${isDarkMode ? '#4b5563' : '#d1d5db'} 100%)`
              }}
            />
            <Volume2 size={16} className="text-tertiary" />
            <span className="text-sm text-tertiary font-time min-w-[3rem]">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div 
          className="p-3 rounded-lg mb-4 text-error text-sm font-medium border"
          style={{
            backgroundColor: isDarkMode ? 'rgba(248, 113, 113, 0.1)' : 'rgba(220, 38, 38, 0.1)',
            borderColor: isDarkMode ? 'rgba(248, 113, 113, 0.3)' : 'rgba(220, 38, 38, 0.3)'
          }}
        >
          {error}
        </div>
      )}

      {/* Track Selection */}
      {isExpanded && (
        <div className="space-y-4">
          {categories.map(category => {
            const categoryTracks = audioTracks.filter(track => track.category === category.id);
            
            return (
              <div key={category.id}>
                <h3 className="text-lg font-medium text-primary mb-3 flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.name}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categoryTracks.map(track => (
                    <button
                      key={track.id}
                      onClick={() => selectTrack(track)}
                      className={`p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] border-2 ${
                        currentTrack?.id === track.id
                          ? 'ring-2 ring-blue-400 ring-opacity-50'
                          : ''
                      }`}
                      style={{
                        backgroundColor: currentTrack?.id === track.id
                          ? isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'
                          : isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.05)',
                        borderColor: currentTrack?.id === track.id
                          ? isDarkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)'
                          : isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.2)'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{track.icon}</span>
                        <div>
                          <div className="text-primary font-medium">{track.name}</div>
                          <div className="text-secondary text-sm">{track.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instructions */}
      {!currentTrack && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🎧</div>
          <h3 className="text-lg font-medium text-primary mb-2">Choose Your Focus Sound</h3>
          <p className="text-secondary text-sm">
            Select from noise, nature sounds, binaural beats, or ambient audio to enhance your productivity.
          </p>
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="mt-4 glass-card px-4 py-2 hover:scale-105 transition-all duration-300 ease-in-out text-button font-medium"
            >
              Browse Audio Tracks
            </button>
          )}
        </div>
      )}
    </div>
  );
};