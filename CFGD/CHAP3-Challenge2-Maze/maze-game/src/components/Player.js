// Player.js
import React, { useState, useEffect } from 'react';

const Player = () => {
  const [position, setPosition] = useState({ x: 1, y: 1 });

  // Handle player movement
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Update position based on arrow key press
      if (event.key === 'ArrowUp') {
        setPosition((prevPosition) => ({ x: prevPosition.x, y: prevPosition.y - 1 }));
      } else if (event.key === 'ArrowDown') {
        setPosition((prevPosition) => ({ x: prevPosition.x, y: prevPosition.y + 1 }));
      } else if (event.key === 'ArrowLeft') {
        setPosition((prevPosition) => ({ x: prevPosition.x - 1, y: prevPosition.y }));
      } else if (event.key === 'ArrowRight') {
        setPosition((prevPosition) => ({ x: prevPosition.x + 1, y: prevPosition.y }));
      }
    };

    // Attach event listener for key press
    window.addEventListener('keydown', handleKeyPress);

    // Clean up the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="player" style={{ top: position.y * 50, left: position.x * 50 }} />
  );
};

export default Player;
