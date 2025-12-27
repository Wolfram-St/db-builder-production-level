import React, { useRef, useEffect } from 'react';
import '../css/glassbutton.css';

const GlassButton = ({ children = "EXPLORE", onClick }) => {
  const btnRef = useRef(null);
  const frameRef = useRef(null);
  
  // Mutable state to avoid React re-renders
  const state = useRef({
    mouseX: 0,
    mouseY: 0,
    currX: 0,
    currY: 0,
    isHovering: false,
  });

  useEffect(() => {
    // 0.1 = Heavy/Slow trail, 0.9 = Instant
    const SMOOTHING_FACTOR = 0.15;

    const animate = () => {
      if (btnRef.current && state.current.isHovering) {
        const { mouseX, mouseY, currX, currY } = state.current;

        // Calculate distance to move
        const newX = currX + (mouseX - currX) * SMOOTHING_FACTOR;
        const newY = currY + (mouseY - currY) * SMOOTHING_FACTOR;

        // Update state
        state.current.currX = newX;
        state.current.currY = newY;

        // Apply coordinates to CSS variables
        btnRef.current.style.setProperty('--x', `${newX}px`);
        btnRef.current.style.setProperty('--y', `${newY}px`);
      }
      
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      state.current.mouseX = e.clientX - rect.left;
      state.current.mouseY = e.clientY - rect.top;
      state.current.isHovering = true;
    }
  };

  const handleMouseLeave = () => {
    state.current.isHovering = false;
  };

  return (
    <button
      ref={btnRef}
      className="glass-btn"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <span>{children}</span>
    </button>
  );
};

export default GlassButton;