// Maze.js
import React from 'react';

const Maze = () => {
  // Define the maze layout
  const mazeLayout = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ];

  // Render the maze
  return (
    <div className="maze">
      {mazeLayout.map((row, rowIndex) => (
        <div className="maze-row" key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <div
              className={`maze-cell ${cell === 1 ? 'wall' : 'path'}`}
              key={cellIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Maze;
