import React, { useEffect, useRef, useState } from 'react';

interface InteractiveBackgroundProps {
  children: React.ReactNode;
}

export const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringFrame, setIsHoveringFrame] = useState(false);
  const [lastActivePosition, setLastActivePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setMousePosition({ x, y });

      // If not hovering over a frame, update the last active position
      if (!isHoveringFrame) {
        setLastActivePosition({ x, y });
      }
    };

    const handleMouseEnterFrame = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.glass-card, .interactive-frame')) {
        setIsHoveringFrame(true);
      }
    };

    const handleMouseLeaveFrame = (e: Event) => {
      const target = e.target as HTMLElement;
      const relatedTarget = (e as MouseEvent).relatedTarget as HTMLElement;
      
      // Check if we're leaving a frame and not entering another frame
      if (target.closest('.glass-card, .interactive-frame') && 
          !relatedTarget?.closest('.glass-card, .interactive-frame')) {
        setIsHoveringFrame(false);
        // Update position immediately when leaving frame
        setLastActivePosition(mousePosition);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      
      // Add event listeners for all frame elements
      const frameElements = container.querySelectorAll('.glass-card, .interactive-frame');
      frameElements.forEach(element => {
        element.addEventListener('mouseenter', handleMouseEnterFrame);
        element.addEventListener('mouseleave', handleMouseLeaveFrame);
      });

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        frameElements.forEach(element => {
          element.removeEventListener('mouseenter', handleMouseEnterFrame);
          element.removeEventListener('mouseleave', handleMouseLeaveFrame);
        });
      };
    }
  }, [mousePosition, isHoveringFrame]);

  // Use the appropriate position based on hover state
  const spotlightPosition = isHoveringFrame ? lastActivePosition : mousePosition;

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `
          radial-gradient(
            circle at ${spotlightPosition.x}% ${spotlightPosition.y}%, 
            rgba(20, 184, 166, 0.15) 0%, 
            rgba(6, 182, 212, 0.08) 25%, 
            transparent 50%
          ),
          linear-gradient(
            135deg, 
            #0a0a0a 0%, 
            #1a1a2e 25%, 
            #16213e 50%, 
            #0f3460 75%, 
            #0e4749 100%
          )
        `,
        transition: isHoveringFrame ? 'none' : 'background 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Additional overlay for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              circle at ${spotlightPosition.x}% ${spotlightPosition.y}%, 
              rgba(255, 255, 255, 0.03) 0%, 
              rgba(255, 255, 255, 0.01) 30%, 
              transparent 60%
            )
          `,
          transition: isHoveringFrame ? 'none' : 'background 0.2s ease-out',
        }}
      />
      
      {/* Subtle animated particles for extra ambiance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-teal-400/20 rounded-full animate-pulse"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${10 + (i * 12)}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + (i * 0.5)}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};