import React, { useEffect, useRef, useState } from 'react';

interface MouseCursorLightProps {
  children: React.ReactNode;
}

export const MouseCursorLight: React.FC<MouseCursorLightProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePosition({ x, y });
      setIsVisible(true);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      style={{ cursor: 'none' }}
    >
      {/* Mouse cursor light effect */}
      <div
        className="fixed pointer-events-none z-50 transition-opacity duration-300 ease-out"
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
          width: '200px',
          height: '200px',
          opacity: isVisible ? 1 : 0,
          background: `radial-gradient(circle, 
            rgba(255, 255, 255, 0.3) 0%, 
            rgba(255, 255, 255, 0.15) 30%, 
            rgba(255, 255, 255, 0.05) 60%, 
            transparent 100%
          )`,
          borderRadius: '50%',
          filter: 'blur(1px)',
          mixBlendMode: 'overlay',
          transform: 'translate3d(0, 0, 0)', // Hardware acceleration
        }}
      />

      {/* Secondary glow for enhanced effect */}
      <div
        className="fixed pointer-events-none z-40 transition-opacity duration-500 ease-out"
        style={{
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
          width: '300px',
          height: '300px',
          opacity: isVisible ? 0.6 : 0,
          background: `radial-gradient(circle, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 40%, 
            transparent 70%
          )`,
          borderRadius: '50%',
          filter: 'blur(3px)',
          mixBlendMode: 'soft-light',
          transform: 'translate3d(0, 0, 0)', // Hardware acceleration
        }}
      />

      {/* Custom cursor dot */}
      <div
        className="fixed pointer-events-none z-50 transition-opacity duration-200 ease-out"
        style={{
          left: mousePosition.x - 2,
          top: mousePosition.y - 2,
          width: '4px',
          height: '4px',
          opacity: isVisible ? 0.8 : 0,
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '50%',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
          transform: 'translate3d(0, 0, 0)', // Hardware acceleration
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};