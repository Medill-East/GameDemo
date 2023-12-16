Vue.component('grid-cell', {
    template: `
    <div ref="gridCellRef"> <!-- 修改这行 -->
        <div
            class="grid-cell"
            :style="{ borderColor: borderColor }"
        >
            {{ currentCell }}
        </div>
    `,
    props: {
        currentCell: Number,
        borderColor: String,
    },
});

// 在 app.js 中
new Vue({
    el: '#app',
    data: {
      gridSize: 5, // 初始网格大小
      round: 0, // 初始回合数
      grid: [], // 用于存储网格状态的数组
    },
    methods: {
    initializeGrid() {
        // 生成随机的网格状态
        this.grid = Array.from({ length: this.gridSize }, () =>
            Array.from({ length: this.gridSize }, () => Math.round(Math.random()))
        );
    
        // 更新回合数
        this.round = 0;
        },
        nextRound() {
            const newGrid = [];
        
            for (let i = 0; i < this.gridSize; i++) {
                const newRow = [];
                for (let j = 0; j < this.gridSize; j++) {
                    newRow.push(this.calculateNextState(i, j));
                }
                newGrid.push(newRow);
            }
        
            this.grid = newGrid;
            this.round++;
        
            // 输出每个格子的样式信息
            this.grid.forEach((row, rowIndex) => {
                row.forEach((cell, cellIndex) => {
                    const isOddRound = this.round % 2 === 1;
                    const isOddRow = rowIndex % 2 === 1;
                    const borderColor = isOddRound ? (isOddRow ? 'black' : 'red') : (isOddRow ? 'red' : 'black');
                    console.log(`(${rowIndex}, ${cellIndex}): currentCell=${cell}, borderColor=${borderColor}`);
                });
            });

            this.$forceUpdate(); // 强制更新组件
            this.applyStyles(); // 新增这行
        }
        ,
        // 在 applyStyles 方法中
        applyStyles() {
            const cells = this.$refs.gridCellRef.$children; // 修改这行
            cells.forEach((cell, index) => {
                const isOddRound = this.round % 2 === 1;
                const isOddRow = Math.floor(index / this.gridSize) % 2 === 1;

                if (isOddRound && isOddRow) {
                    cell.classList.add('odd-round');
                    cell.style.borderColor = 'red';
                } else if (!isOddRound && !isOddRow) {
                    cell.classList.remove('odd-round');
                    cell.style.borderColor = 'black';
                } else {
                    cell.classList.remove('odd-round');
                    cell.style.borderColor = 'red';
                }
            });
        },

        mounted() {
            this.initializeGrid();
        },
          // 在 calculateNextState 方法中添加调试信息
          calculateNextState(row, col) {
            const upperRow = row > 0 ? row - 1 : this.gridSize - 1;
            const lowerRow = row < this.gridSize - 1 ? row + 1 : 0;
        
            const upperCell = this.grid[upperRow][col];
            const lowerCell = this.grid[lowerRow][col];
        
            console.log(`(${row}, ${col}): currentCell=${this.grid[row][col]}, upperCell=${upperCell}, lowerCell=${lowerCell}`);
        
            // 根据规则判断下一状态
            if (this.round % 2 === 1) {
                if (row % 2 === 0) {
                    // 如果是奇数回合的奇数行格子
                    return this.calculateOddRowCellState(this.grid[row][col], upperCell, lowerCell);
                } else {
                    // 如果是奇数回合的偶数行格子
                    return this.grid[row][col];
                }
            } else {
                if (row % 2 === 0) {  // 修正这里的条件
                    // 如果是偶数回合的偶数行格子
                    return this.calculateEvenRowCellState(this.grid[row][col], upperCell, lowerCell);
                } else {
                    // 如果是偶数回合的奇数行格子
                    return this.grid[row][col];
                }
            }
        }
        ,
          calculateOddRowCellState(currentCell, upperCell, lowerCell) {
            if (currentCell === 0 && upperCell === 1 && lowerCell === 0) {
              return 0; // 少阴 -> 老阴
            } else if (currentCell === 1 && upperCell === 1 && lowerCell === 1) {
              return 1; // 老阴 -> 少阳
            } else {
              return currentCell; // 其他情况状态不变
            }
          },
          calculateEvenRowCellState(currentCell, upperCell, lowerCell) {
            if (currentCell === 1 && upperCell === 0 && lowerCell === 1) {
              return 1; // 少阳 -> 老阳
            } else if (currentCell === 0 && upperCell === 1 && lowerCell === 1) {
              return 0; // 老阳 -> 少阴
            } else {
              return currentCell; // 其他情况状态不变
            }
          },
    },
  });
  