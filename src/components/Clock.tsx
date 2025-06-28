import React, { useState, useEffect } from 'react';

interface ClockProps {
  onMidnight: () => void;
}

export const Clock: React.FC<ClockProps> = ({ onMidnight }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Check if it's midnight
      if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        onMidnight();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onMidnight]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate day progress
  const calculateDayProgress = (date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const totalDayMs = endOfDay.getTime() - startOfDay.getTime();
    const elapsedMs = date.getTime() - startOfDay.getTime();
    
    const progressPercentage = (elapsedMs / totalDayMs) * 100;
    const remainingPercentage = 100 - progressPercentage;
    
    return {
      elapsed: Math.min(progressPercentage, 100),
      remaining: Math.max(remainingPercentage, 0)
    };
  };

  const dayProgress = calculateDayProgress(currentTime);

  // Format remaining time
  const formatRemainingTime = (date: Date) => {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const remainingMs = endOfDay.getTime() - date.getTime();
    const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${remainingHours}h ${remainingMinutes}m remaining`;
  };

  // Array of carefully selected minimalist quotes
  const quotes = [
    "Simplicity is the ultimate sophistication.",
    "Focus on what matters. Let go of what doesn't.",
    "Less but better.",
    "Clarity comes from simplicity.",
    "Do fewer things, but do them well.",
    "The art of being wise is knowing what to overlook.",
    "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
    "Concentrate all your thoughts upon the work at hand.",
    "Quality over quantity, always.",
    "Embrace the power of less."
  ];

  // Select quote based on day of year for consistency
  const dayOfYear = Math.floor((currentTime.getTime() - new Date(currentTime.getFullYear(), 0, 0).getTime()) / 86400000);
  const selectedQuote = quotes[dayOfYear % quotes.length];

  return (
    <div className="relative mb-8">
      {/* Clock container with enhanced border */}
      <div className="glass-card interactive-frame text-center p-8 border-2 border-teal-400/30">
        {/* Time display with IBM Plex Mono */}
        <div className="text-5xl font-light text-primary mb-3 font-time tracking-wider">
          {formatTime(currentTime)}
        </div>
        
        {/* Date display with Montserrat */}
        <div className="text-sm text-secondary uppercase tracking-widest font-medium mb-6">
          {formatDate(currentTime)}
        </div>

        {/* Day Progress Bar */}
        <div className="mb-6 px-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-secondary font-medium uppercase tracking-wider">
              Day Progress
            </span>
            <span className="text-xs text-secondary font-medium font-time">
              {dayProgress.elapsed.toFixed(1)}% elapsed
            </span>
          </div>
          
          {/* Progress bar container */}
          <div className="relative w-full h-3 bg-gray-300/30 dark:bg-gray-600/30 rounded-full overflow-hidden backdrop-blur-sm border border-gray-400/20 dark:border-gray-500/20">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200/20 to-gray-300/20 dark:from-gray-700/20 dark:to-gray-600/20"></div>
            
            {/* Progress fill */}
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{ 
                width: `${dayProgress.elapsed}%`,
                boxShadow: '0 0 20px rgba(20, 184, 166, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
            </div>
            
            {/* Remaining time indicator */}
            <div 
              className="absolute top-0 h-full bg-gradient-to-r from-gray-400/30 to-gray-500/30 dark:from-gray-600/30 dark:to-gray-700/30 rounded-full"
              style={{ 
                left: `${dayProgress.elapsed}%`,
                width: `${dayProgress.remaining}%`
              }}
            ></div>
          </div>
          
          {/* Time remaining text with IBM Plex Mono */}
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-tertiary font-medium font-time">
              00:00
            </span>
            <span className="text-xs text-secondary font-medium font-time">
              {formatRemainingTime(currentTime)}
            </span>
            <span className="text-xs text-tertiary font-medium font-time">
              23:59
            </span>
          </div>
        </div>
        
        {/* Inspirational quote with Montserrat */}
        <div className="border-t border-gray-300/20 dark:border-gray-600/20 pt-6">
          <blockquote className="text-primary text-lg font-light italic leading-relaxed max-w-md mx-auto">
            "{selectedQuote}"
          </blockquote>
        </div>
      </div>
    </div>
  );
};