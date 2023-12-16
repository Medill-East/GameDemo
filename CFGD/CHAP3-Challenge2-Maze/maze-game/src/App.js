import React from 'react';
import Maze from './components/Maze';
import Player from './components/Player';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Maze />
      <Player />
    </div>
  );
};

export default App;
