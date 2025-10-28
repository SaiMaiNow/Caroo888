import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- 1. Game Configuration (Game Balance) ---
const GRID_SIZE = 6;
const CELL_SIZE = 75; // Kích thước của mỗi ô (pixel)
const MIN_CLUSTER_SIZE = 5; // ต้องมี 5 อันขึ้นไปถึงจะชนะ

// --- (ปรับสมดุลล่าสุด: อ้างอิง Paytable) ---
const SYMBOLS = {
  // High-value Symbols (ขนม)
  S1: '🌰', // Truffle (แทน 2500)
  S2: '🍓', // Strawberry (แทน 2500)
  S3: '💧', // Blue (แทน 800)
  S4: '🍊', // Orange (แทน 600)
  // Low-value Symbols (ไพ่)
  L1: '♠️', // Spade
  L2: '♥️', // Heart
  L3: '♣️', // Club
  L4: '♦️', // Diamond
  // พิเศษ (กลไก)
  WILD: '🃏', // Wild
  SCATTER: '🎁', // Scatter (ใช้ 🎁 แทน Scatter รูปคน)
};

// (อัปเดต: สัญลักษณ์ที่ใช้สุ่ม)
const SYMBOL_LIST = [SYMBOLS.S1, SYMBOLS.S2, SYMBOLS.S3, SYMBOLS.S4, SYMBOLS.L1, SYMBOLS.L2, SYMBOLS.L3, SYMBOLS.L4];
const SPECIAL_SYMBOL_CHANCE = 0.08; // 8%
const WILD_CHANCE = 0.80; // 80% (ของ 8%)
const SCATTER_SYMBOL = SYMBOLS.SCATTER;
const WILD_SYMBOL = SYMBOLS.WILD;
const MULTIPLIER_CHANCE = 0.15; // 15%

// --- (ใหม่: ตารางจ่ายเงิน PAYTABLE อ้างอิงจากรูป) ---
// (ใช้ key เป็น "Symbol_ClusterSize")
const PAYTABLE = {
  // S1 (Truffle) & S2 (Strawberry)
  '🌰_5': 10, '🍓_5': 10,
  '🌰_6': 12, '🍓_6': 12,
  '🌰_7': 15, '🍓_7': 15,
  '🌰_8': 20, '🍓_8': 20,
  '🌰_9': 25, '🍓_9': 25,
  '🌰_10': 30, '🍓_10': 30,
  '🌰_11': 35, '🍓_11': 35,
  '🌰_12': 40, '🍓_12': 40,
  '🌰_13': 45, '🍓_13': 45,
  '🌰_14': 50, '🍓_14': 50,
  '🌰_15': 60, '🍓_15': 60,
  '🌰_16': 70, '🍓_16': 70,
  '🌰_17': 80, '🍓_17': 80,
  '🌰_18': 100, '🍓_18': 100,
  '🌰_19': 120, '🍓_19': 120,
  '🌰_20': 150, '🍓_20': 150,
  '🌰_21': 200, '🍓_21': 200,
  '🌰_22': 250, '🍓_22': 250,
  '🌰_23': 300, '🍓_23': 300,
  '🌰_24': 350, '🍓_24': 350,
  '🌰_25': 400, '🍓_25': 400,
  '🌰_26': 450, '🍓_26': 450,
  '🌰_27': 500, '🍓_27': 500,
  '🌰_28': 600, '🍓_28': 600,
  '🌰_29': 800, '🍓_29': 800,
  '🌰_30': 1000, '🍓_30': 1000,
  '🌰_31': 1200, '🍓_31': 1200,
  '🌰_32': 1500, '🍓_32': 1500,
  '🌰_33': 1800, '🍓_33': 1800,
  '🌰_34': 2000, '🍓_34': 2000,
  '🌰_35': 2500, '🍓_35': 2500,
  '🌰_36': 2500, '🍓_36': 2500,

  // S3 (Blue)
  '💧_5': 8, '💧_6': 10, '💧_7': 12, '💧_8': 14, '💧_9': 16, '💧_10': 18,
  '💧_11': 20, '💧_12': 25, '💧_13': 30, '💧_14': 35, '💧_15': 40, '💧_16': 45,
  '💧_17': 50, '💧_18': 60, '💧_19': 80, '💧_20': 100, '💧_21': 120, '💧_22': 140,
  '💧_23': 160, '💧_24': 180, '💧_25': 200, '💧_26': 220, '💧_27': 250, '💧_28': 280,
  '💧_29': 320, '💧_30': 360, '💧_31': 400, '💧_32': 450, '💧_33': 500, '💧_34': 550,
  '💧_35': 600, '💧_36': 800, 

  // S4 (Orange)
  '🍊_5': 8, '🍊_6': 10, '🍊_7': 12, '🍊_8': 14, '🍊_9': 16, '🍊_10': 18,
  '🍊_11': 20, '🍊_12': 25, '🍊_13': 30, '🍊_14': 35, '🍊_15': 40, '🍊_16': 45,
  '🍊_17': 50, '🍊_18': 60, '🍊_19': 80, '🍊_20': 100, '🍊_21': 120, '🍊_22': 140,
  '🍊_23': 160, '🍊_24': 180, '🍊_25': 200, '🍊_26': 220, '🍊_27': 240, '🍊_28': 260,
  '🍊_29': 280, '🍊_30': 300, '🍊_31': 350, '🍊_32': 400, '🍊_33': 450, '🍊_34': 500,
  '🍊_35': 550, '🍊_36': 600, 

  // L1 (Spade) & L2 (Heart)
  '♠️_5': 3, '♥️_5': 3,
  '♠️_6': 4, '♥️_6': 4,
  '♠️_7': 5, '♥️_7': 5,
  '♠️_8': 6, '♥️_8': 6,
  '♠️_9': 8, '♥️_9': 8,
  '♠️_10': 10, '♥️_10': 10,
  '♠️_11': 12, '♥️_11': 12,
  '♠️_12': 14, '♥️_12': 14,
  '♠️_13': 16, '♥️_13': 16,
  '♠️_14': 18, '♥️_14': 18,
  '♠️_15': 20, '♥️_15': 20,
  '♠️_16': 25, '♥️_16': 25,
  '♠️_17': 40, '♥️_17': 40, 
  '♠️_18': 45, '♥️_18': 45,
  '♠️_19': 50, '♥️_19': 50,
  '♠️_20': 55, '♥️_20': 55,
  '♠️_21': 60, '♥️_21': 60,
  '♠️_22': 65, '♥️_22': 65,
  '♠️_23': 70, '♥️_23': 70,
  '♠️_24': 80, '♥️_24': 80,
  '♠️_25': 95, '♥️_25': 95,
  '♠️_26': 190, '♥️_26': 190, 
  '♠️_27': 200, '♥️_27': 200,
  '♠️_28': 220, '♥️_28': 220,
  '♠️_29': 240, '♥️_29': 240,
  '♠️_30': 260, '♥️_30': 260,
  '♠️_31': 300, '♥️_31': 300,
  '♠️_32': 300, '♥️_32': 300,
  '♠️_33': 320, '♥️_33': 320,
  '♠️_34': 340, '♥️_34': 340,
  '♠️_35': 360, '♥️_35': 360,
  '♠️_36': 360, '♥️_36': 360,

  // L3 (Club) & L4 (Diamond)
  '♣️_5': 2, '♦️_5': 2,
  '♣️_6': 3, '♦️_6': 3,
  '♣️_7': 4, '♦️_7': 4,
  '♣️_8': 5, '♦️_8': 5,
  '♣️_9': 6, '♦️_9': 6,
  '♣️_10': 8, '♦️_10': 8,
  '♣️_11': 10, '♦️_11': 10,
  '♣️_12': 12, '♦️_12': 12,
  '♣️_13': 14, '♦️_13': 14,
  '♣️_14': 16, '♦️_14': 16,
  '♣️_15': 18, '♦️_15': 18,
  '♣️_16': 20, '♦️_16': 20,
  '♣️_17': 30, '♦️_17': 30, 
  '♣️_18': 35, '♦️_18': 35,
  '♣️_19': 40, '♦️_19': 40,
  '♣️_20': 45, '♦️_20': 45,
  '♣️_21': 50, '♦️_21': 50,
  '♣️_22': 55, '♦️_22': 55,
  '♣️_23': 60, '♦️_23': 60,
  '♣️_24': 65, '♦️_24': 65,
  '♣️_25': 80, '♦️_25': 80,
  '♣️_26': 160, '♦️_26': 160, 
  '♣️_27': 170, '♦️_27': 170,
  '♣️_28': 180, '♦️_28': 180,
  '♣️_29': 190, '♦️_29': 190,
  '♣️_30': 200, '♦️_30': 200,
  '♣️_31': 220, '♦️_31': 220,
  '♣️_32': 240, '♦️_32': 240,
  '♣️_33': 260, '♦️_33': 260,
  '♣️_34': 280, '♦️_34': 280,
  '♣️_35': 300, '♦️_35': 300,
  '♣️_36': 300, '♦️_36': 300,
};

// Free Spins
const FREE_SPINS_TRIGGER_COUNT = 3;
const BASE_FREE_SPINS_AWARDED = 10;
const EXTRA_SPINS_PER_SCATTER = 2; // (ใหม่: อ้างอิงจากรูป)

// Bet
const BET_AMOUNTS = [1, 5, 10, 25, 50, 100];
const DEFAULT_BET_INDEX = 2; // เริ่มที่ 10

// Animation
const SPIN_DURATION_NORMAL = 1100; // ms
const SPIN_DURATION_TURBO = 200; // ms

// --- 2. Helper Functions (ย้ายออกมาเพื่อให้ 'App' สะอาดขึ้น) ---

// 2.1. ฟังก์ชันหน่วงเวลา (Delay)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 2.2. ฟังก์ชันสุ่มตัวเลข (Number Ticker Animation)
const tickNumber = async (start, end, duration, setDisplayValue) => {
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

// 2.3. Cluster Finding Engine (ค้นหากลุ่มที่ชนะ)
const findClusters = (targetGrid) => {
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

// 2.4. Grid Creation (สร้างตารางสุ่ม)
const createRandomGrid = () => {
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


// --- 3. Main Game Component (คอมโพเนนต์หลัก) ---
export default function App() {
  
  // --- State (สถานะของเกม) ---
  const [grid, setGrid] = useState([]); 
  const [balance, setBalance] = useState(1000); 
  const [currentBetIndex, setCurrentBetIndex] = useState(DEFAULT_BET_INDEX);
  const [message, setMessage] = useState("กด 'หมุน!' เพื่อเริ่ม"); 
  
  const [spinning, setSpinning] = useState(false); 
  const [isTurbo, setIsTurbo] = useState(false); 

  // Win Animation State
  const [spinWin, setSpinWin] = useState(0); 
  const [spinMultiplier, setSpinMultiplier] = useState(0); 

  // Luck State
  const [luck, setLuck] = useState(80); 

  // Highlight State
  const [winningCells, setWinningCells] = useState(new Set()); 
  const lastPulseTimeRef = useRef(0);
  const pulseStateRef = useRef(false);

  // Free Spin State
  const [isFreeSpins, setIsFreeSpins] = useState(false); 
  const [freeSpinsLeft, setFreeSpinsLeft] = useState(0); 
  const [isAutoSpinningFreeSpins, setIsAutoSpinningFreeSpins] = useState(false); 
  const [freeSpinTotalWin, setFreeSpinTotalWin] = useState(0); 
  const [freeSpinTotalMultiplier, setFreeSpinTotalMultiplier] = useState(0); 
  const [showFreeSpinSummary, setShowFreeSpinSummary] = useState(false); 

  // --- Refs ---
  const currentBet = BET_AMOUNTS[currentBetIndex]; 
  const spinLogicRef = useRef();

  
  // --- 3.1. Win Animation (อนิเมชันโชว์เงินไหล) ---
  // (useCallback จะช่วยให้ฟังก์ชันนี้ไม่ถูกสร้างใหม่ทุกครั้ง)
  const runWinAnimation = useCallback(async (baseWin, totalMultiplier) => {
    setMessage("ชนะ!");
    setSpinWin(0); 
    setSpinMultiplier(0);
    
    await tickNumber(0, baseWin, 1000, setSpinWin);
    await delay(200);

    if (totalMultiplier > 0) {
      setSpinMultiplier(totalMultiplier);
      await delay(500);
      
      const finalWin = baseWin * totalMultiplier;
      await tickNumber(baseWin, finalWin, 1000, setSpinWin);
      await delay(200);
      return finalWin; 
    }

    return baseWin; 

  }, []); // (ว่างเปล่า = สร้างฟังก์ชันนี้แค่ครั้งเดียว)

  
  // --- 3.2. Main Spin Logic (ตรรกะการหมุนหลัก) ---
  // (ตรรกะหลักยังคงอยู่ที่นี่ เพราะต้องใช้ State Setters จำนวนมาก)
  spinLogicRef.current = async () => {
    
    setSpinning(true);
    setWinningCells(new Set()); 
    
    const isThisAFreeSpin = isFreeSpins;
    const spinDuration = (isThisAFreeSpin ? false : isTurbo) ? SPIN_DURATION_TURBO : SPIN_DURATION_NORMAL;
    
    if (isThisAFreeSpin) {
      setMessage(`ฟรีสปิน! (รอบที่ ${freeSpinsLeft})`); 
    } else {
      if (balance < currentBet) {
        setMessage("เงินไม่พอ!");
        setSpinning(false);
        return;
      }
      setBalance(prev => prev - currentBet);
      setMessage("...หมุน...");
    }

    setSpinWin(0);
    setSpinMultiplier(0);
    lastPulseTimeRef.current = 0; 

    let currentGrid; 

    const startTime = Date.now();
    while (Date.now() - startTime < spinDuration) {
      currentGrid = createRandomGrid(); 
      setGrid(currentGrid);
      await delay(50);
    }

    if (!isThisAFreeSpin) {
      const scatterCount = currentGrid.flat().filter(cell => cell && cell.symbol === SCATTER_SYMBOL).length;
      if (scatterCount >= FREE_SPINS_TRIGGER_COUNT) {
        const spinsAwarded = BASE_FREE_SPINS_AWARDED + ((scatterCount - FREE_SPINS_TRIGGER_COUNT) * EXTRA_SPINS_PER_SCATTER);
        
        setIsFreeSpins(true);
        setFreeSpinsLeft(spinsAwarded);
        setFreeSpinTotalMultiplier(0); 
        setFreeSpinTotalWin(0);
        setGrid(currentGrid); 
        setMessage(`เข้าสู่โหมดฟรีสปิน! ${spinsAwarded} ครั้ง`);
        
        setIsAutoSpinningFreeSpins(true); 
        setIsTurbo(false); 
        
        setSpinning(false);
        return; 
      }
    }
    
    let clusters = findClusters(currentGrid);
    let didWin = clusters.length > 0;
    
    if (!didWin && !isThisAFreeSpin && luck > 0) {
      const pityChance = luck / 400; 
      if (Math.random() < pityChance) {
        currentGrid[0][0] = { symbol: SYMBOLS.S1, multiplier: 1 };
        currentGrid[0][1] = { symbol: SYMBOLS.S1, multiplier: 1 };
        currentGrid[0][2] = { symbol: SYMBOLS.S1, multiplier: 1 };
        currentGrid[1][1] = { symbol: SYMBOLS.S1, multiplier: 1 };
        currentGrid[1][2] = { symbol: SYMBOLS.S1, multiplier: 1 };
        setGrid([...currentGrid]); 
        clusters = findClusters(currentGrid); 
        didWin = true;
        setMessage("โชคช่วย!");
      }
    }
    
    if (didWin) {
      let baseWin = 0;
      let currentSpinMultiplier = 0;
      const newWinningCells = new Set();
      
      clusters.forEach(cluster => {
        const symbol = cluster[0].cell.symbol; 
        const size = cluster.length; 
        
        let payoutSize = Math.min(size, 36);
        let payout = 0;
        while (payoutSize >= MIN_CLUSTER_SIZE && payout === 0) {
          payout = PAYTABLE[`${symbol}_${payoutSize}`] || 0;
          payoutSize--; 
        }
        
        const calculatedPayout = payout * (currentBet / 10);
        baseWin += calculatedPayout;
        
        cluster.forEach(c => {
          newWinningCells.add(`${c.r},${c.c}`);
          if (c.cell.multiplier > 1) {
            currentSpinMultiplier += c.cell.multiplier; 
          }
        });
      });
      
      if (isThisAFreeSpin) {
        await runWinAnimation(baseWin, 0); 
        setFreeSpinTotalWin(prev => prev + baseWin); 
        setFreeSpinTotalMultiplier(prev => prev + currentSpinMultiplier); 
        setLuck(prev => Math.max(prev - 15, 0)); 
      } else {
        const finalWin = await runWinAnimation(baseWin, currentSpinMultiplier);
        setBalance(prev => prev + finalWin);
        setMessage(`คุณชนะ ${finalWin.toLocaleString()}!`);
        setLuck(prev => Math.max(prev - 10, 0)); 
      }
      
      setWinningCells(newWinningCells); 

    } else {
      setMessage(isThisAFreeSpin ? "โอ๊ะ..." : "เสียใจด้วยนะ");
      if (isThisAFreeSpin) {
        setLuck(prev => Math.min(prev + 10, 100)); 
      } else {
        setLuck(prev => Math.min(prev + 2, 100)); 
      }
    }

    setSpinning(false);
  };
  
  
  // --- 3.3. Game Loop (สำหรับ Auto Free Spins) ---
  useEffect(() => {
    if (!isAutoSpinningFreeSpins) return; 
    
    if (freeSpinsLeft > 0) {
      const autoSpin = async () => {
        await spinLogicRef.current(); 
        await delay(4000); 
        setFreeSpinsLeft(prev => prev - 1); 
      };
      autoSpin();
    } else {
      const showSummary = async () => {
        setIsAutoSpinningFreeSpins(false);
        setMessage(`ฟรีสปินสิ้นสุด! กำลังรวมยอด...`);
        await delay(2000); 
        setShowFreeSpinSummary(true); 
      };
      
      if(isAutoSpinningFreeSpins) { 
         showSummary();
      }
    }
  }, [isAutoSpinningFreeSpins, freeSpinsLeft]);
  
  
  // --- 3.4. Event Handlers (จัดการปุ่ม) ---
  const handleSpin = async () => {
    if (spinning || isAutoSpinningFreeSpins) return; 
    await spinLogicRef.current(); 
  };

  const handleChangeBet = (direction) => {
    if (spinning || isFreeSpins) return;
    let newIndex = currentBetIndex + direction;
    if (newIndex < 0) newIndex = BET_AMOUNTS.length - 1;
    if (newIndex >= BET_AMOUNTS.length) newIndex = 0;
    setCurrentBetIndex(newIndex);
  };

  const handleToggleTurbo = () => {
    if (isFreeSpins) return; 
    setIsTurbo(prev => !prev);
  };
  
  const handleCloseSummary = () => {
    const finalAmount = freeSpinTotalWin * (freeSpinTotalMultiplier > 0 ? freeSpinTotalMultiplier : 1);
    setBalance(prev => prev + finalAmount);
    setShowFreeSpinSummary(false);
    setIsFreeSpins(false);
    setMessage("กด 'หมุน!' เพื่อเริ่ม");
  };

  
  // --- 3.5. Render (วาดหน้าจอ UI) ---
  return (
    <>
      {/* (Plain CSS ทั้งหมดจะอยู่ใน <style> นี้) */}
      <style>
        {`
          .css-app-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: #1a202c; /* เทียบเท่า bg-gray-900 */
            color: white;
            padding: 1rem;
            font-family: sans-serif;
          }
          .css-title {
            font-size: 2.25rem; /* เทียบเท่า text-4xl */
            font-weight: bold;
            color: #f6e05e; /* เทียบเท่า text-yellow-400 */
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px #000;
          }
          .css-message {
            font-size: 1.125rem; /* เทียบเท่า text-lg */
            color: #d1d5db; /* เทียบเท่า text-gray-300 */
            margin-bottom: 1rem;
          }
          .css-canvas-container {
            position: relative;
            width: 450px;
            height: 450px;
            background-color: black;
            border-radius: 0.5rem; /* เทียบเท่า rounded-lg */
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* เทียบเท่า shadow-2xl */
            overflow: hidden;
            border: 4px solid #b7791f; /* เทียบเท่า border-yellow-600 */
          }
          .css-stats-bar {
            display: flex;
            justify-content: space-between;
            width: 450px;
            margin-top: 1rem;
            font-size: 1.5rem; /* เทียบเท่า text-2xl */
          }
          .css-stat-box {
            background-color: #2d3748; /* เทียบเท่า bg-gray-800 */
            padding: 0.5rem;
            border-radius: 0.5rem;
            box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); /* เทียบเท่า shadow-inner */
          }
          .css-stat-label {
            color: #9ca3af; /* เทียบเท่า text-gray-400 */
            margin-right: 0.5rem;
          }
          .css-stat-value-win {
            color: #4ade80; /* เทียบเท่า text-green-400 */
            font-weight: bold;
          }
          .css-stat-value-mult {
            color: #f87171; /* เทียบเท่า text-red-400 */
            font-weight: bold;
          }
          .css-controls-panel {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1rem;
            align-items: center;
            width: 450px;
            margin-top: 1rem;
            padding: 1rem;
            background-color: #2d3748; /* เทียบเท่า bg-gray-800 */
            border-radius: 0.5rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* เทียบเท่า shadow-xl */
          }
          .css-bet-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem; /* เทียบเท่า space-x-2 */
          }
          .css-bet-button {
            width: 3rem; /* เทียบเท่า w-12 */
            height: 3rem; /* เทียบเท่า h-12 */
            border-radius: 9999px; /* เทียบเท่า rounded-full */
            color: white;
            font-size: 1.875rem; /* เทียบเท่า text-3xl */
            font-weight: bold;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* เทียบเท่า shadow-md */
            border: none;
            cursor: pointer;
          }
          .css-bet-button:disabled {
            opacity: 0.5;
            cursor: default;
          }
          .css-bet-button-minus {
            background-color: #dc2626; /* เทียบเท่า bg-red-600 */
          }
          .css-bet-button-minus:hover:not(:disabled) {
            background-color: #ef4444; /* เทียบเท่า hover:bg-red-500 */
          }
          .css-bet-button-plus {
            background-color: #16a34a; /* เทียบเท่า bg-green-600 */
          }
          .css-bet-button-plus:hover:not(:disabled) {
            background-color: #22c55e; /* เทียบเท่า hover:bg-green-500 */
          }
          .css-bet-display {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .css-bet-label {
            font-size: 0.75rem; /* เทียบเท่า text-xs */
            color: #9ca3af; /* เทียบเท่า text-gray-400 */
          }
          .css-bet-value {
            font-size: 1.25rem; /* เทียบเท่า text-xl */
            font-weight: bold;
            color: #f6e05e; /* เทียบเท่า text-yellow-400 */
          }
          .css-spin-button-container {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .css-spin-button {
            width: 6rem; /* เทียบเท่า w-24 */
            height: 6rem; /* เทียบเท่า h-24 */
            border-radius: 9999px;
            font-weight: bold;
            font-size: 1.5rem; /* เทียบเท่า text-2xl */
            color: black;
            border-width: 4px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* เทียบเท่า shadow-lg */
            transition: all 0.15s ease-in-out;
            cursor: pointer;
          }
          .css-spin-button:active:not(:disabled) {
            transform: scale(0.95);
          }
          .css-spin-button:disabled {
            opacity: 0.5;
            cursor: default;
          }
          .css-spin-button-normal {
            background-image: linear-gradient(to bottom right, #fcd34d, #f59e0b); /* เทียบเท่า from-yellow-400 to-yellow-600 */
            border-color: #fef3c7; /* เทียบเท่า border-yellow-200 */
          }
          .css-spin-button-normal:hover:not(:disabled) {
            background-image: linear-gradient(to bottom right, #fde047, #facc15); /* เทียบเท่า hover:from-yellow-300 hover:to-yellow-500 */
          }
          .css-spin-button-free {
            background-image: linear-gradient(to bottom right, #c084fc, #a855f7); /* เทียบเท่า from-purple-400 to-purple-600 */
            border-color: #e9d5ff; /* เทียบเท่า border-purple-300 */
          }
          .css-spin-button-pulsing {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .css-side-panel {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.5rem; /* เทียบเท่า space-y-2 */
          }
          .css-turbo-button {
            width: 100%;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-weight: bold;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* เทียบเท่า shadow-md */
            border: none;
            cursor: pointer;
          }
          .css-turbo-button:disabled {
            opacity: 0.3;
            cursor: default;
          }
          .css-turbo-on {
            background-color: #3b82f6; /* เทียบเท่า bg-blue-500 */
            color: white;
          }
          .css-turbo-off {
            background-color: #4b5563; /* เทียบเท่า bg-gray-600 */
            color: #d1d5db; /* เทียบเท่า text-gray-300 */
          }
          .css-small-stat-row {
            display: flex;
            justify-content: space-between;
            width: 100%;
            font-size: 0.875rem; /* เทียบเท่า text-sm */
          }
          .css-small-stat-label {
            color: #9ca3af; /* เทียบเท่า text-gray-400 */
          }
          .css-small-stat-luck {
            color: #f6e05e; /* เทียบเท่า text-yellow-400 */
            font-weight: bold;
          }
          .css-small-stat-balance {
            color: #4ade80; /* เทียบเท่า text-green-400 */
            font-weight: bold;
          }

          /* --- Popup Styles --- */
          .css-popup-overlay {
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 50;
          }
          .css-popup-box {
            background-image: linear-gradient(to bottom right, #581c87, #3b0764); /* เทียบเท่า from-purple-800 to-purple-900 */
            padding: 2rem;
            border-radius: 1rem; /* เทียบเท่า rounded-2xl */
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border: 4px solid #f6e05e; /* เทียบเท่า border-yellow-400 */
            width: 91.666667%; /* เทียบเท่า w-11/12 */
            text-align: center;
          }
          .css-popup-title {
            font-size: 2.25rem; /* เทียบเท่า text-4xl */
            font-weight: bold;
            color: #f6e05e; /* เทียบเท่า text-yellow-400 */
            margin-bottom: 1.5rem;
          }
          .css-popup-stat-block {
            margin-bottom: 1rem;
          }
          .css-popup-stat-label {
            font-size: 1.25rem; /* เทียบเท่า text-xl */
            color: #d1d5db; /* เทียบเท่า text-gray-300 */
          }
          .css-popup-stat-value {
            font-size: 3rem; /* เทียบเท่า text-5xl */
            font-weight: bold;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }
          .css-popup-win-green {
            color: #4ade80; /* เทียบเท่า text-green-400 */
          }
          .css-popup-win-white {
            color: white;
          }
          .css-popup-multiplier-block {
            margin-bottom: 1.5rem;
          }
          .css-popup-multiplier-label {
            font-size: 1.25rem; /* เทียบเท่า text-xl */
            color: #d1d5db; /* เทียบเท่า text-gray-300 */
          }
          .css-popup-multiplier-value {
            font-size: 3.75rem; /* เทียบเท่า text-6xl */
            font-weight: bold;
            color: #f87171; /* เทียบเท่า text-red-400 */
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
            transition: transform 0.3s;
          }
          .css-popup-multiplier-scaled {
            transform: scale(1.1);
          }
          .css-popup-confirm-button {
            margin-top: 2rem;
            padding: 0.75rem 2rem;
            background-color: #f59e0b; /* เทียบเท่า bg-yellow-500 */
            color: black;
            font-size: 1.5rem; /* เทียบเท่า text-2xl */
            font-weight: bold;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* เทียบเท่า shadow-lg */
            transition: all 0.15s ease-in-out;
            border: none;
            cursor: pointer;
          }
          .css-popup-confirm-button:hover {
            background-color: #fcd34d; /* เทียบเท่า hover:bg-yellow-400 */
          }
        `}
      </style>
      
      {/* (Cleaned JSX) 
        ส่วน JSX นี้จะ "สะอาด" ขึ้นมาก เพราะเราแยกคอมโพเนนต์ย่อยออกไป
      */}
      <div className="css-app-container">
        
        <h1 className="css-title">
          Chocolate Deluxe Demo
        </h1>
        <p className="css-message">{message}</p>

        {/* --- 4.1. คอมโพเนนต์ Canvas (แยกส่วนวาดรูป) --- */}
        <GameCanvas
          grid={grid}
          spinning={spinning}
          winningCells={winningCells}
          isFreeSpins={isFreeSpins}
          pulseStateRef={pulseStateRef}
          lastPulseTimeRef={lastPulseTimeRef}
          showFreeSpinSummary={showFreeSpinSummary}
          freeSpinTotalWin={freeSpinTotalWin}
          freeSpinTotalMultiplier={freeSpinTotalMultiplier}
          onCloseSummary={handleCloseSummary}
        />

        {/* --- 4.2. คอมโพเนนต์ Stats (แยกส่วนแสดงผล 'ชนะ') --- */}
        <StatsDisplay
          spinWin={spinWin}
          spinMultiplier={spinMultiplier}
        />

        {/* --- 4.3. คอมโพเนนต์ Controls (แยกส่วนปุ่มทั้งหมด) --- */}
        <ControlPanel
          spinning={spinning}
          isFreeSpins={isFreeSpins}
          isAutoSpinningFreeSpins={isAutoSpinningFreeSpins}
          isTurbo={isTurbo}
          currentBet={currentBet}
          freeSpinsLeft={freeSpinsLeft}
          luck={luck}
          balance={balance}
          onChangeBet={handleChangeBet}
          onSpin={handleSpin}
          onToggleTurbo={handleToggleTurbo}
        />

      </div>
    </>
  );
}


// --- 4. Sub-Components (คอมโพเนนต์ย่อยที่ 'Clean' ขึ้น) ---

// --- 4.1. คอมโพเนนต์ Canvas ---
function GameCanvas({
  grid, spinning, winningCells, isFreeSpins, 
  pulseStateRef, lastPulseTimeRef,
  showFreeSpinSummary, freeSpinTotalWin, freeSpinTotalMultiplier, onCloseSummary
}) {
  const canvasRef = useRef(null);

  // (Drawing Engine)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let pulseOpacity = 1.0;
    const now = Date.now();
    if (winningCells.size > 0 && !spinning) {
      if (now - lastPulseTimeRef.current > 250) { 
        pulseStateRef.current = !pulseStateRef.current;
        lastPulseTimeRef.current = now;
      }
      pulseOpacity = pulseStateRef.current ? 1.0 : 0.6;
    }

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cell = grid[r] ? grid[r][c] : null;
        const x = c * CELL_SIZE;
        const y = r * CELL_SIZE;
        const cellKey = `${r},${c}`;
        const isWinningCell = winningCells.has(cellKey);

        ctx.globalAlpha = 1.0;
        if (winningCells.size > 0 && !spinning && !isWinningCell) {
          ctx.globalAlpha = 0.3; 
        }

        ctx.fillStyle = isFreeSpins ? '#4a2f64' : '#5a3a22'; 
        ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

        if (cell) {
          ctx.font = '40px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(cell.symbol, x + CELL_SIZE / 2, y + CELL_SIZE / 2);

          if (cell.multiplier > 1) {
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = '#ff4d4d'; 
            ctx.fillText(`x${cell.multiplier}`, x + CELL_SIZE / 2 + 10, y + CELL_SIZE / 2 + 15);
          }
        }
        
        if (isWinningCell && !spinning) {
          ctx.globalAlpha = pulseOpacity; 
          ctx.strokeStyle = '#FFD700'; 
          ctx.lineWidth = 5;
          ctx.strokeRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
          ctx.globalAlpha = 1.0; 
        }
      }
    }
  }, [grid, spinning, winningCells, isFreeSpins, pulseStateRef, lastPulseTimeRef]);

  return (
    <div className="css-canvas-container">
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
      />
      
      {showFreeSpinSummary && (
        <FreeSpinSummary
          baseWin={freeSpinTotalWin}
          totalMultiplier={freeSpinTotalMultiplier}
          onClose={onCloseSummary}
        />
      )}
    </div>
  );
}


// --- 4.2. คอมโพเนนต์ Stats Display ---
function StatsDisplay({ spinWin, spinMultiplier }) {
  return (
    <div className="css-stats-bar">
      <div className="css-stat-box">
        <span className="css-stat-label">ชนะ:</span>
        <span className="css-stat-value-win">{spinWin.toLocaleString()}</span>
      </div>
      <div className="css-stat-box">
        <span className="css-stat-label">ตัวคูณ:</span>
        <span className="css-stat-value-mult">
          {spinMultiplier > 0 ? `x${spinMultiplier}` : '-'}
        </span>
      </div>
    </div>
  );
}


// --- 4.3. คอมโพเนนต์ Control Panel ---
function ControlPanel({
  spinning, isFreeSpins, isAutoSpinningFreeSpins, isTurbo,
  currentBet, freeSpinsLeft, luck, balance,
  onChangeBet, onSpin, onToggleTurbo
}) {
  return (
    <div className="css-controls-panel">
      
      {/* (ส่วนปุ่ม Bet) */}
      <div className="css-bet-controls">
        <button
          onClick={() => onChangeBet(-1)}
          disabled={spinning || isFreeSpins}
          className="css-bet-button css-bet-button-minus"
        >
          -
        </button>
        <div className="css-bet-display">
          <span className="css-bet-label">เดิมพัน</span>
          <span className="css-bet-value">{currentBet}</span>
        </div>
        <button
          onClick={() => onChangeBet(1)}
          disabled={spinning || isFreeSpins}
          className="css-bet-button css-bet-button-plus"
        >
          +
        </button>
      </div>

      {/* (ส่วนปุ่ม Spin) */}
      <div className="css-spin-button-container">
        <button
          onClick={onSpin}
          disabled={spinning || isAutoSpinningFreeSpins} 
          className={`css-spin-button ${
            isFreeSpins ? 'css-spin-button-free' : 'css-spin-button-normal'
          } ${spinning || isAutoSpinningFreeSpins ? 'css-spin-button-pulsing' : ''}`}
        >
          {isAutoSpinningFreeSpins ? freeSpinsLeft : (spinning ? '...' : (isFreeSpins ? freeSpinsLeft : 'หมุน!'))}
        </button>
      </div>
      
      {/* (ส่วนแสดงผลด้านข้าง) */}
      <div className="css-side-panel">
        <button
          onClick={onToggleTurbo}
          disabled={isFreeSpins} 
          className={`css-turbo-button ${
            isTurbo ? 'css-turbo-on' : 'css-turbo-off'
          }`}
        >
          Turbo {isTurbo ? 'ON' : 'OFF'}
        </button>
        
        <div className="css-small-stat-row">
          <span className="css-small-stat-label">Luck:</span>
          <span className="css-small-stat-luck">{luck}</span>
        </div>
        <div className="css-small-stat-row">
          <span className="css-small-stat-label">Balance:</span>
          <span className="css-small-stat-balance">{balance.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}


// --- 4.4. Popup Component (คอมโพเนนต์ Popup สรุปยอด) ---
function FreeSpinSummary({ baseWin, totalMultiplier, onClose }) {
  const [displayWin, setDisplayWin] = useState(0);
  const [displayMultiplier, setDisplayMultiplier] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [finalWin, setFinalWin] = useState(0);

  useEffect(() => {
    const runSummaryAnimation = async () => {
      const finalAmount = baseWin * (totalMultiplier > 0 ? totalMultiplier : 1);
      setFinalWin(finalAmount); 
      
      await tickNumber(0, baseWin, 1500, setDisplayWin);
      await delay(500);

      if (totalMultiplier > 0) {
        setDisplayMultiplier(totalMultiplier);
        await delay(500);
        
        setShowFinal(true);
        if (finalAmount !== baseWin) {
          await tickNumber(baseWin, finalAmount, 1500, setDisplayWin);
        }
      } else {
         setShowFinal(true);
      }
    };
    runSummaryAnimation();
  }, [baseWin, totalMultiplier]);

  return (
    <div className="css-popup-overlay">
      <div className="css-popup-box">
        <h2 className="css-popup-title">สรุปยอดฟรีสปิน!</h2>
        
        <div className="css-popup-stat-block">
          <span className="css-popup-stat-label">
            {showFinal && finalWin !== baseWin ? 'ยอดรวมสุทธิ' : 'ยอดชนะ (ฐาน)'}
          </span>
          <h3 className={`css-popup-stat-value ${showFinal ? 'css-popup-win-green' : 'css-popup-win-white'}`}>
            {displayWin.toLocaleString()}
          </h3>
        </div>

        {displayMultiplier > 0 && (
          <div className="css-popup-multiplier-block">
            <span className="css-popup-multiplier-label">ตัวคูณสะสม</span>
            <h3 className={`css-popup-multiplier-value ${displayMultiplier > 0 ? 'css-popup-multiplier-scaled' : ''}`}>
              {`x${displayMultiplier}`}
            </h3>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="css-popup-confirm-button"
        >
          ยืนยัน
        </button>
      </div>
    </div>
  );
}

