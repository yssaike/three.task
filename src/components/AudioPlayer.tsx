import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Brain, Waves } from 'lucide-react';

interface AudioPlayerProps {}

interface AudioTrack {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  // In a real app, these would be actual audio file URLs
  // For demo purposes, we'll use data URLs or placeholder URLs
  audioUrl: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio tracks with placeholder URLs (in production, these would be actual audio files)
  const audioTracks: AudioTrack[] = [
    {
      id: 'binaural',
      name: 'Binaural Beats',
      description: '40Hz Gamma waves for enhanced focus and concentration',
      icon: <Brain size={24} />,
      color: 'text-purple-500',
      gradient: 'from-purple-500/20 to-indigo-500/20',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' // Placeholder
    },
    {
      id: 'brown-noise',
      name: 'Brown Noise',
      description: 'Deep, soothing brown noise for relaxation and focus',
      icon: <Waves size={24} />,
      color: 'text-amber-600',
      gradient: 'from-amber-500/20 to-orange-500/20',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' // Placeholder
    },
    {
      id: 'lofi',
      name: 'Lo-fi Hip Hop',
      description: 'Chill beats perfect for studying and working',
      icon: <Music size={24} />,
      color: 'text-pink-500',
      gradient: 'from-pink-500/20 to-rose-500/20',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' // Placeholder
    }
  ];

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  // Update audio properties when state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
    audio.loop = true; // Loop background audio
  }, [volume, isMuted]);

  const selectTrack = (track: AudioTrack) => {
    if (currentTrack?.id === track.id) {
      // Toggle play/pause for same track
      togglePlayPause();
    } else {
      // Switch to new track
      setCurrentTrack(track);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.log('Audio play failed:', error);
        // In a real app, you might show a user-friendly error message
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-light text-primary flex items-center gap-3">
          <Volume2 size={24} className="text-yinmn-blue-500" />
          Background Audio
        </h2>
        <div className="text-secondary text-sm">
          Built-in focus sounds
        </div>
      </div>

      {/* Audio Element */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onLoadStart={() => console.log('Loading audio...')}
          onError={(e) => console.log('Audio error:', e)}
        />
      )}

      {/* Current Track Display */}
      {currentTrack && (
        <div className={`mb-6 p-6 rounded-2xl bg-gradient-to-r ${currentTrack.gradient} border-2 border-opacity-30`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`${currentTrack.color}`}>
                {currentTrack.icon}
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary">{currentTrack.name}</h3>
                <p className="text-sm text-secondary">{currentTrack.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayPause}
                className="w-12 h-12 rounded-full bg-yinmn-blue-500 hover:bg-yinmn-blue-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-secondary">
                {formatTime(currentTime)}
              </span>
              <span className="text-xs text-secondary">
                {duration ? formatTime(duration) : '--:--'}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-300/30 dark:bg-gray-600/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yinmn-blue-500 rounded-full transition-all duration-300"
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
              />
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="text-secondary hover:text-primary transition-colors duration-200"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-gray-300/30 dark:bg-gray-600/30 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${(isMuted ? 0 : volume) * 100}%, rgba(156, 163, 175, 0.3) ${(isMuted ? 0 : volume) * 100}%, rgba(156, 163, 175, 0.3) 100%)`
              }}
            />
            <span className="text-xs text-secondary font-time min-w-[3rem]">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Track Selection */}
      <div>
        <h3 className="text-lg font-medium text-primary mb-4">Choose Your Focus Sound</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {audioTracks.map((track) => (
            <button
              key={track.id}
              onClick={() => selectTrack(track)}
              className={`p-6 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] border-2 ${
                currentTrack?.id === track.id
                  ? 'border-yinmn-blue-500 bg-yinmn-blue-500/10'
                  : 'border-gray-300/30 dark:border-gray-600/30 hover:border-yinmn-blue-400/50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`${track.color} flex-shrink-0`}>
                  {track.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-primary font-medium mb-1 flex items-center gap-2">
                    {track.name}
                    {currentTrack?.id === track.id && isPlaying && (
                      <div className="w-2 h-2 bg-yinmn-blue-500 rounded-full animate-pulse" />
                    )}
                  </h4>
                  <p className="text-secondary text-sm leading-relaxed">
                    {track.description}
                  </p>
                  <div className="mt-3 text-xs text-tertiary">
                    {currentTrack?.id === track.id 
                      ? (isPlaying ? 'Now Playing' : 'Selected') 
                      : 'Click to select'
                    }
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
          backgroundColor: 'var(--success-bg)',
          borderColor: 'var(--success-border)'
        }}
      >
        <div className="flex items-start gap-3">
          <Volume2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--success-icon)' }} />
          <div>
            <h4 className="text-primary font-medium text-sm mb-1">How to use</h4>
            <ul className="text-sm leading-relaxed space-y-1" style={{ color: 'var(--success-text)' }}>
              <li>• Select any audio track to begin background playback</li>
              <li>• Audio loops automatically for continuous focus</li>
              <li>• Adjust volume or mute as needed</li>
              <li>• Perfect for maintaining concentration while working</li>
              <li>• Switch between tracks anytime without interruption</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Note about audio files */}
      <div 
        className="mt-4 p-3 rounded-lg border text-center"
        style={{
          backgroundColor: 'var(--info-bg)',
          borderColor: 'var(--info-border)'
        }}
      >
        <p className="text-xs" style={{ color: 'var(--info-text)' }}>
          <strong>Note:</strong> In a production environment, these would be actual audio files. 
          Currently using placeholder audio for demonstration purposes.
        </p>
      </div>
    </div>
  );
};