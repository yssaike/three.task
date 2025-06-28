import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const ClockDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="glass-card p-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Clock size={24} className="text-primary" />
        <h2 className="text-xl font-medium text-primary">Current Time</h2>
      </div>
      
      <div className="font-time text-4xl font-light text-primary mb-2 tracking-wider">
        {formatTime(currentTime)}
      </div>
      
      <div className="text-sm text-secondary font-medium uppercase tracking-wider">
        {formatDate(currentTime)}
      </div>
    </div>
  );
};