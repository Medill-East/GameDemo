// Get the grid container
const gridContainer = document.getElementById('grid-container');

// Set the initial grid size
let gridSize = 3;

// Get the element to display the round number
let roundInfoElement;

// Define round variables
let currentRound = 0;
let isInitialPhase = true;

// 获取输入框元素
const gridSizeInput = document.getElementById('grid-size-input');

// 处理用户输入，更新网格大小
function applyCustomGridSize() {
    // 获取用户输入的网格大小
    const customSize = parseInt(gridSizeInput.value);

    // 验证输入是否为有效数字
    if (!isNaN(customSize) && customSize > 0) {
        // 更新 gridSize 变量
        gridSize = customSize;
        console.log('Current grid size = ', gridSize);

        // 重新生成网格
        createGrid();
    } else {
        // 提示用户输入有效的数字
        alert('Please enter a valid grid size (a positive number).');
    }
}

// 创建网格，动态设置列数和行数
function createGrid() {
    gridContainer.innerHTML = ''; // 清空网格容器

    // 获取元素以显示回合数
    roundInfoElement = document.getElementById('round-info');
    
    // 初始化回合数
    currentRound = isInitialPhase ? 0 : 1;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            // 添加类以标识行数
            cell.classList.add(`row-${i}`);
            cell.classList.add(`column-${j}`)

            cell.addEventListener('click', toggleCellState); // 添加点击事件
            gridContainer.appendChild(cell);

            // 确保样式应用生效
            cell.style.backgroundColor = 'white';

            // 显示每个格子的索引
            const index = i * gridSize + j;
            cell.innerText = index;

            // 将每个格子的索引字体颜色改为蓝色
            cell.style.color = 'red';
        }
    }

    // 动态设置列数和行数
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;


    // 在 createGrid 函数中初始化阶段信息
    const phaseInfoElement = document.getElementById('phase-info');
    phaseInfoElement.innerText = 'Current Phase: Initial';

    // 在 createGrid 函数中初始化回合数显示
    updateRoundDisplay();
}

// Toggle game phase
function togglePhase(phase) {
    isInitialPhase = phase === 'initial';

    const phaseInfoElement = document.getElementById('phase-info');
    phaseInfoElement.innerText = `Current Phase: ${isInitialPhase ? 'Initial' : 'Game'}`;

    if (!isInitialPhase) {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.removeEventListener('click', handleClick));
    }
}

// Handle click event
function handleClick(event) {
    const cell = event.target;

    if (isInitialPhase) {
        toggleCellState(cell);
    } else {
        lockCellState(cell);
    }
}

// 切换格子状态（0或1）
function toggleCellState(event) {
    const cell = event.target;

    if (!cell) {
        console.error('Cell is undefined');
        return;
    }

    const currentClassList = cell.classList;

    if (currentClassList.contains('yin')) {
        // 如果已经是阴，则切换为阳
        currentClassList.remove('yin');
        currentClassList.add('yang');
        cell.style.setProperty('background-color', 'white', 'important');
    } else if (currentClassList.contains('yang')) {
        // 如果已经是阳，则切换为阴
        currentClassList.remove('yang');
        currentClassList.add('yin');
        cell.style.setProperty('background-color', 'black', 'important');
    } else {
        // 如果没有阴阳状态，则默认设置为阴
        currentClassList.add('yin');
        cell.style.setProperty('background-color', 'black', 'important');
    }
}


// Lock cell state
function lockCellState(cell) {
    cell.removeEventListener('click', handleClick);
}

// Toggle initial state of cells (0 or 1)
function toggleInitialState() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.toggle('yin', Math.random() < 0.5);
        cell.classList.toggle('yang', !cell.classList.contains('yin'));
    });
}

// Toggle game phase
function toggleGamePhase() {
    isInitialPhase = !isInitialPhase;

    const phaseInfoElement = document.getElementById('phase-info');
    phaseInfoElement.innerText = `Current Phase: ${isInitialPhase ? 'Initial' : 'Game'}`;

    const cells = document.querySelectorAll('.cell');
    
    // 根据当前阶段决定添加或移除事件处理函数
    cells.forEach(cell => {
        if (isInitialPhase) {
            cell.addEventListener('click', toggleCellState);
        } else {
            cell.removeEventListener('click', toggleCellState);
        }
    });
}


// Get the cell above
function getAboveCell(index) {
    const aboveIndex = index - gridSize;
    return aboveIndex >= 0 ? gridContainer.children[aboveIndex] : undefined;
}

// Apply rules from a specific cell
function applyRulesFromCell(startingCell, cells, startingIndex) {
    // Check if the starting cell is defined, if not, log an error and return
    if (!startingCell) {
        console.error('Starting cell is undefined');
        return;
    }

    // Get the number of rows in the maze (assuming it's gridSize), and columns by querying all child elements in the same row
    const row = gridSize - 1;
    const column = parseInt(startingCell.classList[1].split('-')[1]);

    // Check if the current round is odd or even
    const isOddRound = currentRound % 2 !== 0;

    // Choose the starting row based on the round
    const startRow = isOddRound ? row : row - 1;

    // Initialize the row class outside the loop
    const currentRowClass = isOddRound ? 'row-odd' : 'row-even';

    // Iterate over each row starting from the chosen row
    for (let i = startRow; i >= 0; i--) {
        // Iterate over each column in the row
        for (let j = 0; j < gridSize; j++) {
            // Calculate the index of the current iteration in the one-dimensional array
            const cellIndex = i * gridSize + j;

            // Get the current cell
            const currentCell = cells[cellIndex];

            // If the current cell is defined
            if (currentCell) {
                // Add the appropriate class for highlighting based on the current round and row
                const shouldHighlight = (currentRound % 2 === 1 && i % 2 === 1) || (currentRound % 2 === 0 && i % 2 === 0);
                if (shouldHighlight) {
                    currentCell.parentNode.classList.add(currentRowClass);
                }

                // Calculate the index of the cell in the one-dimensional array
                const cellIndex = i * gridSize + column;

                // Get the above cell index directly
                const aboveCellIndex = (i - 1) * gridSize + column;

                // If the above cell is defined, call applyRule function to apply the rule
                if (i > 0) {
                    applyRule(currentCell, cells[aboveCellIndex]);
                } else {
                    // If the above cell is not defined, log an error
                    console.log('Above cell is undefined' + ' Current Index:', currentCell);
                }
            }
        }
    }
}

// 应用变化规则
function applyRules() {
    const cells = document.querySelectorAll('.cell');
    const currentStates = Array.from(cells, cell => ({
        cell,
        state: cell.classList.contains('yin') ? 'yin' : 'yang'
    }));

    // Increment the round when the button is clicked
    currentRound++;

    // Update the display to show the current round
    updateRoundDisplay();

    // 重新生成网格
    createGrid();

    // 获取新生成的格子
    const newCells = document.querySelectorAll('.cell');

    // 将之前保存的状态应用到新生成的格子
    currentStates.forEach(({ cell, state }, index) => {
        const newCell = newCells[index];
        newCell.classList.add(state);
    });

    // 应用变化规则
    const startRow = currentRound % 2 === 1 ? gridSize - 1 : gridSize - 2;
    for (let i = startRow; i >= 0; i--) {
        for (let j = 0; j < gridSize; j++) {
            const cellIndex = i * gridSize + j;
            applyRulesFromCell(newCells[cellIndex], newCells, cellIndex);
        }
    }
    // 更新回合数显示
    updateRoundDisplay();
}

// Function to update the round display
function updateRoundDisplay() {
    // Check if the roundInfoElement exists
    if (roundInfoElement) {
        // Update the text content based on the current round
        roundInfoElement.innerText = `Round: ${currentRound}`;
    }
}


// Apply cell changes based on rules
function applyRule(currentCell, aboveCell) {
    console.log('Current Cell in applyRule:', currentCell);

    const currentStates = currentCell.classList.contains('yin') ? 'yin' : 'yang';
    const aboveState = aboveCell.classList.contains('yin') ? 'yin' : 'yang';

    if (currentStates === 'yin' && aboveState === 'yin') {
        currentCell.classList.remove('yin');
        currentCell.classList.add('yang');
        currentCell.style.setProperty('background-color', 'white', 'important');
    } else if (currentStates === 'yang' && aboveState === 'yin') {
        aboveCell.classList.remove('yin');
        aboveCell.classList.add('yang');
        aboveCell.style.setProperty('background-color', 'white', 'important');
    } else if (currentStates === 'yang' && aboveState === 'yang') {
        currentCell.classList.remove('yang');
        currentCell.classList.add('yin');
        currentCell.style.setProperty('background-color', 'black', 'important');
    } else if (currentStates === 'yin' && aboveState === 'yang') {
        aboveCell.classList.remove('yang');
        aboveCell.classList.add('yin');
        aboveCell.style.setProperty('background-color', 'black', 'important');
    }
}


// Initialize the grid
createGrid();
