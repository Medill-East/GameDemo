import React, { useState, useEffect } from 'react';

const MazeData = ({ onPlayerMove }) => {
  const [mazeLayout, setMazeLayout] = useState([]);
  const [initialYao, setInitialYao] = useState('');
  const [playerPath, setPlayerPath] = useState([]);
  const [playerPosition, setPlayerPosition] = useState([0, 0]);
  const [exitPosition, setExitPosition] = useState([]);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [calculatedHexagram, setCalculatedHexagram] = useState('');
  const [playerPathStatus, setPlayerPathStatus] = useState([]);

  useEffect(() => {
    initializeMaze();
  }, []);

  const initializeMaze = () => {
    const initialPosition = [0, 0];
    setPlayerPath([initialPosition]);
    setPlayerPosition(initialPosition);
    const initialMaze = [
      [0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
    ];

    setMazeLayout(initialMaze);
    setPlayerPath([]);
    setPlayerPosition([0, 0]);

    // 设置出口位置为迷宫右下角
    setExitPosition([initialMaze.length - 1, initialMaze[0]?.length - 1]);
    setInitialYao('');
  };

  useEffect(() => {
    calculateHexagramAndYao();
  }, [playerPath]);

  const calculateHexagramAndYao = () => {
    if (playerPath.length < 6) {
      return;
    }

    const hexagram = playerPath.slice(0, 6);
    const currentHexagram = calculateHexagram(hexagram);
    const currentYao = calculateYao(playerPath.slice(6));

    setInitialYao(currentYao);

    // 判断是否到达出口
    if (playerPosition[0] === exitPosition[0] && playerPosition[1] === exitPosition[1]) {
      handleGameEnd();
    }
  };

  const calculateHexagram = (hexagram) => {
    const binaryString = hexagram.map((position) => mazeLayout[position[0]][position[1]] === 1 ? '1' : '0').join('');
    const lowerHexagram = binaryString.slice(3); // 取得下卦
    const upperHexagram = binaryString.slice(0, 3); // 取得上卦

    // 实际计算卦象的逻辑可以根据需要进行调整
    const hexagramList = [
      '乾卦', '坤卦', '屯卦', '蒙卦', '需卦', '讼卦', '师卦', '比卦',
      '小畜卦', '履卦', '泰卦', '否卦', '同人卦', '大有卦', '谦卦', '豫卦',
      '随卦', '蛊卦', '临卦', '观卦', '噬嗑卦', '贲卦', '剥卦', '复卦',
      '无妄卦', '大畜卦', '颐卦', '大过卦', '坎卦', '离卦', '咸卦', '恒卦',
      '遁卦', '大壮卦', '晋卦', '明卦', '睽卦', '家人卦', '睿卦', '蛊卦',
      '临卦', '观卦', '噬嗑卦', '贲卦', '剥卦', '复卦', '无妄卦', '大畜卦',
      '颐卦', '大过卦', '坎卦', '离卦', '咸卦', '恒卦', '遁卦', '大壮卦',
      '晋卦', '明卦', '睽卦', '家人卦', '睿卦', '蛊卦', '临卦', '观卦',
    ];

    const lowerHexagramIndex = parseInt(lowerHexagram, 2);
    const upperHexagramIndex = parseInt(upperHexagram, 2);

    const calculatedHexagramResult = `${hexagramList[lowerHexagramIndex]}挂${hexagramList[upperHexagramIndex]}`;
    setCalculatedHexagram(calculatedHexagramResult); // 更新卦象状态

    return calculatedHexagramResult;
  };

  const renderPlayerPathStatus = () => {
    return playerPath.map((position, index) => (
      <span key={index} style={{ marginRight: '8px', color: mazeLayout[position[0]][position[1]] === 1 ? 'orange' : 'blue' }}>
        {mazeLayout[position[0]][position[1]] === 1 ? '阳' : '阴'}
      </span>
    ));
  };

  const calculateYao = (yaoPath) => {
    const binaryString = yaoPath.map((position) => mazeLayout[position[0]][position[1]] === 1 ? '1' : '0').join('');
    const yaoIndex = parseInt(binaryString, 2);
  
    // 根据实际需要调整返回值，这里仅作为示例
    return `爻位：${yaoIndex}`;
  };
  

  const handlePlayerMove = (direction) => {
    if (isGameEnded) {
      // 如果游戏已结束，不允许继续移动
      return;
    }
    else
    {
      const newPosition = [...playerPosition];

      switch (direction) {
        case 'up':
          newPosition[0] = Math.max(newPosition[0] - 1, 0);
          break;
        case 'down':
          newPosition[0] = Math.min(newPosition[0] + 1, mazeLayout.length - 1);
          break;
        case 'left':
          newPosition[1] = Math.max(newPosition[1] - 1, 0);
          break;
        case 'right':
          newPosition[1] = Math.min(newPosition[1] + 1, mazeLayout[0].length - 1);
          break;
        default:
          break;
      }
  
      setPlayerPosition(newPosition);
      setPlayerPath([...playerPath, newPosition]);
  
      // 调用外部传入的 onPlayerMove 函数，将移动方向传递给 GameBoard
      if (onPlayerMove) {
        onPlayerMove(direction);
      }
    }
  };

  const handleRestart = () => {
    initializeMaze(); 
    setIsGameEnded(false);
  };

  const handleGameEnd = () => {
    alert('恭喜！你成功走出了迷宫！');
    setIsGameEnded(true);
  };

  const renderMazeLayout = () => {
    if (!mazeLayout || !Array.isArray(mazeLayout)) {
      return null;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {mazeLayout.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                style={{
                  width: '20px',
                  height: '20px',
                  border: `1px solid ${getBorderColor(rowIndex, colIndex)}`,
                  backgroundColor: cell === 0 ? 'blue' : 'orange',
                  margin: '1px',
                  position: 'relative',
                }}
              >
                {playerPosition[0] === rowIndex && playerPosition[1] === colIndex && (
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: 'red',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  ></div>
                )}
                {exitPosition[0] === rowIndex && exitPosition[1] === colIndex && (
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: 'green',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const getBorderColor = (row, col) => {
    if (row === 0 && col === 0) {
      // 入口
      return 'red';
    } else if (row === exitPosition[0] && col === exitPosition[1]) {
      // 出口
      return 'green';
    } else {
      return 'black';
    }
  };

  const renderPlayerPath = () => {
    return (
      <div>
        <h3>玩家路径：</h3>
        {playerPath.map((position, index) => (
          <span key={index}>{`(${position[0]}, ${position[1]}) -> `}</span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h3>迷宫布局：</h3>
      {renderMazeLayout()}
      {renderPlayerPath()}
      <h3>初始爻：</h3>
      <p>{initialYao}</p>
      <h3>玩家路径状态：</h3>
      {renderPlayerPathStatus()}
      <h3>最终卦象结果：</h3>
      <p>{calculatedHexagram}</p>
      <button onClick={() => handlePlayerMove('up')}>上移</button>
      <button onClick={() => handlePlayerMove('down')}>下移</button>
      <button onClick={() => handlePlayerMove('left')}>左移</button>
      <button onClick={() => handlePlayerMove('right')}>右移</button>
      <button onClick={handleRestart}>重新开始</button>
    </div>
  );
};

export default MazeData;
