import React from 'react';
import MazeData from './MazeData';

const GameBoard = () => {
  const handleMove = (direction) => {
    // 处理玩家移动的逻辑，你可以根据需要修改
    console.log(`Player moved ${direction}`);
  };

  return (
    <div>
      <h1>Maze Game</h1>
      <MazeData onPlayerMove={handleMove} />
    </div>
  );
};

export default GameBoard;
