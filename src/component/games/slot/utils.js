import { GRID_SIZE, SYMBOLS, MIN_CLUSTER_SIZE, WILD_SYMBOL, SCATTER_SYMBOL, SYMBOL_LIST, SPECIAL_SYMBOL_CHANCE, WILD_CHANCE, MULTIPLIER_CHANCE } from './constants';

// --- 2.1. ฟังก์ชันหน่วงเวลา (Delay) ---
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- 2.2. ฟังก์ชันสุ่มตัวเลข (Number Ticker Animation) ---
export const tickNumber = async (start, end, duration, setDisplayValue) => {
  if (start === end) {
    setDisplayValue(end);
    return;
  }
  const range = end - start;
  let startTime = null;

  return new Promise((resolve) => {
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      const currentVal = Math.floor(start + range * (percentage));
      setDisplayValue(currentVal);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
        resolve();
      }
    };
    requestAnimationFrame(animate);
  });
};

// --- 2.3. Cluster Finding Engine (ค้นหากลุ่มที่ชนะ) ---
export const findClusters = (targetGrid) => {
  const clusters = [];
  const visited = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(false));
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  const floodFill = (r, c, symbol, currentCluster) => {
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE || visited[r][c]) {
      return;
    }
    
    const cell = targetGrid[r][c];
    if (cell && (cell.symbol === symbol || cell.symbol === WILD_SYMBOL)) {
      visited[r][c] = true;
      currentCluster.push({ r, c, cell });
      
      for (const [dr, dc] of directions) {
        floodFill(r + dr, c + dc, symbol, currentCluster);
      }
    }
  };

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!visited[r][c]) {
        const cell = targetGrid[r][c];
        if (cell && cell.symbol !== WILD_SYMBOL && cell.symbol !== SCATTER_SYMBOL) {
          const currentCluster = [];
          floodFill(r, c, cell.symbol, currentCluster);
          
          if (currentCluster.length >= MIN_CLUSTER_SIZE) {
            clusters.push(currentCluster);
          }
        }
      }
    }
  }
  return clusters;
};

// --- 2.4. Grid Creation (สร้างตารางสุ่ม) ---
export const createRandomGrid = () => {
  const newGrid = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      let symbol = null;
      let multiplier = 1;
      
      const rand = Math.random();

      if (rand < SPECIAL_SYMBOL_CHANCE) {
        if (Math.random() < WILD_CHANCE) {
          symbol = WILD_SYMBOL;
        } else {
          symbol = SCATTER_SYMBOL;
        }
      } else {
        symbol = SYMBOL_LIST[Math.floor(Math.random() * SYMBOL_LIST.length)];
        
        if (Math.random() < MULTIPLIER_CHANCE) {
          const randMult = Math.random();
          if (randMult < 0.1) {
            multiplier = 10;
          } else if (randMult < 0.4) {
            multiplier = 5;
          } else {
            multiplier = 2;
          }
        }
      }
      
      row.push({ symbol, multiplier });
    }
    newGrid.push(row);
  }
  return newGrid;
};