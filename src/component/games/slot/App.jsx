import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { GameCanvas } from './features/GameCanvas';
import { StatsDisplay } from './features/StatsDisplay';
import { ControlPanel } from './features/ControlPanel';
import { delay, tickNumber, findClusters, createRandomGrid } from './utils';
import {
  BET_AMOUNTS, DEFAULT_BET_INDEX,
  FREE_SPINS_TRIGGER_COUNT, BASE_FREE_SPINS_AWARDED,
  EXTRA_SPINS_PER_SCATTER, SPIN_DURATION_NORMAL,
  SPIN_DURATION_TURBO, SCATTER_SYMBOL, SYMBOLS,
  MIN_CLUSTER_SIZE, PAYTABLE
} from './constants';

// --- 3. Main Game Component (คอมโพเนนต์หลัก) ---
function App({ className }) {
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
  }, []); 

  // --- 3.2. Main Spin Logic (ตรรกะการหมุนหลัก) ---
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
    <div className={className}>
      <h1 className="css-title">
        Chocolate Deluxe Demo
      </h1>
      <p className="css-message">{message}</p>

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

      <StatsDisplay
        spinWin={spinWin}
        spinMultiplier={spinMultiplier}
      />

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
  );
}

export default styled(App)`
  /* นี่คือสไตล์ของ .css-app-container (div นอกสุด) */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1a202c; 
  color: white;
  padding: 1rem;
  font-family: sans-serif;

  /* (นี่คือสไตล์ของคลาสลูกๆ ที่อยู่ข้างใน) */
  .css-title {
    font-size: 2.25rem; 
    font-weight: bold;
    color: #f6e05e; 
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px #000;
  }
  .css-message {
    font-size: 1.125rem; 
    color: #d1d5db; 
    margin-bottom: 1rem;
  }
  .css-canvas-container {
    position: relative;
    width: 450px;
    height: 450px;
    background-color: black;
    border-radius: 0.5rem; 
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); 
    overflow: hidden;
    border: 4px solid #b7791f; 
  }
  .css-stats-bar {
    display: flex;
    justify-content: space-between;
    width: 450px;
    margin-top: 1rem;
    font-size: 1.5rem; 
  }
  .css-stat-box {
    background-color: #2d3748; 
    padding: 0.5rem;
    border-radius: 0.5rem;
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); 
  }
  .css-stat-label {
    color: #9ca3af; 
    margin-right: 0.5rem;
  }
  .css-stat-value-win {
    color: #4ade80; 
    font-weight: bold;
  }
  .css-stat-value-mult {
    color: #f87171; 
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
    background-color: #2d3748; 
    border-radius: 0.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); 
  }
  .css-bet-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem; 
  }
  .css-bet-button {
    width: 3rem; 
    height: 3rem; 
    border-radius: 9999px; 
    color: white;
    font-size: 1.875rem; 
    font-weight: bold;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); 
    border: none;
    cursor: pointer;
  }
  .css-bet-button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .css-bet-button-minus {
    background-color: #dc2626; 
  }
  .css-bet-button-minus:hover:not(:disabled) {
    background-color: #ef4444; 
  }
  .css-bet-button-plus {
    background-color: #16a34a; 
  }
  .css-bet-button-plus:hover:not(:disabled) {
    background-color: #22c55e; 
  }
  .css-bet-display {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .css-bet-label {
    font-size: 0.75rem; 
    color: #9ca3af; 
  }
  .css-bet-value {
    font-size: 1.25rem; 
    font-weight: bold;
    color: #f6e05e; 
  }
  .css-spin-button-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .css-spin-button {
    width: 6rem; 
    height: 6rem; 
    border-radius: 9999px;
    font-weight: bold;
    font-size: 1.5rem; 
    color: black;
    border-width: 4px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); 
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
    background-image: linear-gradient(to bottom right, #fcd34d, #f59e0b); 
    border-color: #fef3c7; 
  }
  .css-spin-button-normal:hover:not(:disabled) {
    background-image: linear-gradient(to bottom right, #fde047, #facc15); 
  }
  .css-spin-button-free {
    background-image: linear-gradient(to bottom right, #c084fc, #a855f7); 
    border-color: #e9d5ff; 
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
    gap: 0.5rem; 
  }
  .css-turbo-button {
    width: 100%;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: bold;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); 
    border: none;
    cursor: pointer;
  }
  .css-turbo-button:disabled {
    opacity: 0.3;
    cursor: default;
  }
  .css-turbo-on {
    background-color: #3b82f6; 
    color: white;
  }
  .css-turbo-off {
    background-color: #4b5563; 
    color: #d1d5db; 
  }
  .css-small-stat-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 0.875rem; 
  }
  .css-small-stat-label {
    color: #9ca3af; 
  }
  .css-small-stat-luck {
    color: #f6e05e; 
    font-weight: bold;
  }
  .css-small-stat-balance {
    color: #4ade80; 
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
    background-image: linear-gradient(to bottom right, #581c87, #3b0764); 
    padding: 2rem;
    border-radius: 1rem; 
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border: 4px solid #f6e05e; 
    width: 91.666667%; 
    text-align: center;
  }
  .css-popup-title {
    font-size: 2.25rem; 
    font-weight: bold;
    color: #f6e05e; 
    margin-bottom: 1.5rem;
  }
  .css-popup-stat-block {
    margin-bottom: 1rem;
  }
  .css-popup-stat-label {
    font-size: 1.25rem; 
    color: #d1d5db; 
  }
  .css-popup-stat-value {
    font-size: 3rem; 
    font-weight: bold;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .css-popup-win-green {
    color: #4ade80; 
  }
  .css-popup-win-white {
    color: white;
  }
  .css-popup-multiplier-block {
    margin-bottom: 1.5rem;
  }
  .css-popup-multiplier-label {
    font-size: 1.25rem; 
    color: #d1d5db; 
  }
  .css-popup-multiplier-value {
    font-size: 3.75rem; 
    font-weight: bold;
    color: #f87171; 
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
    background-color: #f59e0b; 
    color: black;
    font-size: 1.5rem; 
    font-weight: bold;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); 
    transition: all 0.15s ease-in-out;
    border: none;
    cursor: pointer;
  }
  .css-popup-confirm-button:hover {
    background-color: #fcd34d; 
  }
`;


