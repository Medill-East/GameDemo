// 在 App.js 文件中

import React from 'react';
import GameBoard from './GameBoard'; // 假设 GameBoard 组件位于同一目录下

function App() {
  return (
    <div className="App">
      <h1>迷宫游戏</h1>
      <GameBoard />
    </div>
  );
}

export default App;
