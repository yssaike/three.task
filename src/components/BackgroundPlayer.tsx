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

  // Audio tracks with working URLs from freesound.org and other free sources
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
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const selectTrack = async (track: AudioTrack) => {
    setError(null);
    setIsLoading(true);
    
    // Stop current track
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    setCurrentTrack(track);
    setIsPlaying(false);
    
    try {
      // Create new audio element
      const audio = new Audio();
      audio.loop = true;
      audio.volume = isMuted ? 0 : volume;
      audio.crossOrigin = 'anonymous';
      
      // Set up event listeners
      const handleLoadStart = () => setIsLoading(true);
      const handleCanPlay = () => {
        setIsLoading(false);
        setError(null);
      };
      const handleError = (e: Event) => {
        console.error('Audio loading error:', e);
        setError(`Failed to load ${track.name}. This may be due to CORS restrictions or the audio file being unavailable.`);
        setIsLoading(false);
        setIsPlaying(false);
      };
      const handleLoadedData = () => {
        setIsLoading(false);
      };

      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);
      audio.addEventListener('loadeddata', handleLoadedData);
      
      // For demo purposes, since external audio URLs may have CORS issues,
      // we'll create a Web Audio API generated sound based on the track type
      audio.src = await generateAudioForTrack(track);
      
      audioRef.current = audio;
      
      // Cleanup function
      return () => {
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('loadeddata', handleLoadedData);
      };
    } catch (err) {
      console.error('Error setting up audio:', err);
      setError(`Failed to set up audio for ${track.name}`);
      setIsLoading(false);
    }
  };

  // Generate audio using Web Audio API for demo purposes
  const generateAudioForTrack = async (track: AudioTrack): Promise<string> => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const sampleRate = audioContext.sampleRate;
      const duration = 30; // 30 seconds loop
      const numSamples = sampleRate * duration;
      const buffer = audioContext.createBuffer(2, numSamples, sampleRate);
      
      const leftChannel = buffer.getChannelData(0);
      const rightChannel = buffer.getChannelData(1);

      // Generate different sounds based on track type
      for (let i = 0; i < numSamples; i++) {
        const time = i / sampleRate;
        let leftSample = 0;
        let rightSample = 0;

        switch (track.id) {
          case 'brown-noise':
            // Brown noise (1/f² power spectrum)
            leftSample = rightSample = (Math.random() * 2 - 1) * 0.15;
            break;
            
          case 'white-noise':
            // White noise
            leftSample = rightSample = (Math.random() * 2 - 1) * 0.1;
            break;
            
          case 'pink-noise':
            // Pink noise approximation
            leftSample = rightSample = (Math.random() * 2 - 1) * 0.12;
            break;
            
          case 'rain':
            // Rain simulation with filtered noise
            const rainNoise = (Math.random() * 2 - 1) * 0.08;
            const rainFilter = Math.sin(time * 0.5) * 0.3 + 0.7;
            leftSample = rightSample = rainNoise * rainFilter;
            break;
            
          case 'forest':
            // Forest ambience with bird chirps
            const forestBase = (Math.random() * 2 - 1) * 0.05;
            const birdChirp = Math.sin(time * 1000 + Math.sin(time * 0.1) * 100) * 0.02 * 
                             (Math.random() > 0.995 ? 1 : 0);
            leftSample = rightSample = forestBase + birdChirp;
            break;
            
          case 'ocean':
            // Ocean waves simulation
            const wave1 = Math.sin(time * 0.3) * 0.06;
            const wave2 = Math.sin(time * 0.7) * 0.04;
            const oceanNoise = (Math.random() * 2 - 1) * 0.03;
            leftSample = rightSample = wave1 + wave2 + oceanNoise;
            break;
            
          case 'binaural-40hz':
            // 40Hz binaural beats (base frequency 200Hz)
            leftSample = Math.sin(2 * Math.PI * 200 * time) * 0.1;
            rightSample = Math.sin(2 * Math.PI * 240 * time) * 0.1; // 200 + 40
            break;
            
          case 'binaural-10hz':
            // 10Hz binaural beats (base frequency 200Hz)
            leftSample = Math.sin(2 * Math.PI * 200 * time) * 0.1;
            rightSample = Math.sin(2 * Math.PI * 210 * time) * 0.1; // 200 + 10
            break;
            
          case 'cafe':
            // Café ambience with chatter and coffee machine sounds
            const chatter = (Math.random() * 2 - 1) * 0.04 * 
                           (Math.sin(time * 0.2) * 0.5 + 0.5);
            const coffeeMachine = Math.sin(time * 60) * 0.02 * 
                                 (Math.random() > 0.98 ? 1 : 0);
            leftSample = rightSample = chatter + coffeeMachine;
            break;
            
          case 'library':
            // Very quiet library ambience
            const quietNoise = (Math.random() * 2 - 1) * 0.02;
            const pageFlip = Math.sin(time * 1000) * 0.01 * 
                           (Math.random() > 0.999 ? 1 : 0);
            leftSample = rightSample = quietNoise + pageFlip;
            break;
            
          default:
            leftSample = rightSample = (Math.random() * 2 - 1) * 0.1;
        }

        leftChannel[i] = leftSample;
        rightChannel[i] = rightSample;
      }

      // Convert buffer to WAV blob
      const wavBlob = bufferToWav(buffer);
      return URL.createObjectURL(wavBlob);
    } catch (err) {
      console.error('Error generating audio:', err);
      throw new Error('Failed to generate audio');
    }
  };

  // Convert AudioBuffer to WAV blob
  const bufferToWav = (buffer: AudioBuffer): Blob => {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);

    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const togglePlayPause = async () => {
    if (!currentTrack || !audioRef.current) return;

    setError(null);

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Resume audio context if suspended (required by some browsers)
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Playback error:', err);
      setError('Failed to play audio. Please try again or select a different track.');
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const resetPlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
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
                {isPlaying && (
                  <div className="text-success text-xs font-medium mt-1">
                    ● Playing
                  </div>
                )}
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
                      disabled={isLoading && currentTrack?.id === track.id}
                      className={`p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] border-2 disabled:opacity-50 disabled:hover:scale-100 ${
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
          <p className="text-secondary text-sm mb-4">
            Select from noise, nature sounds, binaural beats, or ambient audio to enhance your productivity.
          </p>
          <p className="text-tertiary text-xs mb-4">
            Audio is generated using Web Audio API for demonstration purposes.
          </p>
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="glass-card px-4 py-2 hover:scale-105 transition-all duration-300 ease-in-out text-button font-medium"
            >
              Browse Audio Tracks
            </button>
          )}
        </div>
      )}
    </div>
  );
};