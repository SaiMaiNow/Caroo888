import React, { useState } from "react";
import ReelGrid from "./ReelGrid";
import ControlPanel from "./ControlPanel";
import "./Slot.css";

const symbols = ["⭐", "💖", "🟡", "🟢", "🟣", "🟠", "🥝", "💧"];
const ROWS = 6;
const COLS = 6;

const randomGrid = () =>
  Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => symbols[Math.floor(Math.random() * symbols.length)])
  );

// เช็ค combo
const checkCombos = (grid) => {
  const toRemove = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  let comboCount = 0;

  // แนวนอน
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 2; c++) {
      const val = grid[r][c];
      if (val && val === grid[r][c + 1] && val === grid[r][c + 2]) {
        toRemove[r][c] = toRemove[r][c + 1] = toRemove[r][c + 2] = true;
      }
    }
  }

  // แนวตั้ง
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 2; r++) {
      const val = grid[r][c];
      if (val && val === grid[r + 1][c] && val === grid[r + 2][c]) {
        toRemove[r][c] = toRemove[r + 1][c] = toRemove[r + 2][c] = true;
      }
    }
  }

  // นับสัญลักษณ์ที่จะหาย
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (toRemove[r][c]) comboCount++;
    }
  }

  return { toRemove, comboCount };
};

// cascade symbols ลงมาและเติมใหม่
const cascadeSymbols = (grid, toRemove) => {
  const newGrid = grid.map((row) => [...row]);

  for (let c = 0; c < COLS; c++) {
    let colSymbols = [];

    // เก็บสัญลักษณ์ที่เหลือจากล่างขึ้นบน
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!toRemove[r][c]) colSymbols.push(newGrid[r][c]);
    }

    // เติมใหม่จนเต็มคอลัมน์
    while (colSymbols.length < ROWS) {
      colSymbols.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }

    // เขียนกลับลงกริดจากล่างขึ้นบน
    for (let r = ROWS - 1; r >= 0; r--) {
      newGrid[r][c] = colSymbols[ROWS - 1 - r];
    }
  }

  return newGrid;
};

// Cascade แบบ async + animation ให้เห็นว่าแตกและเลื่อนลง
const runCascade = async (setGrid, grid, bet) => {
  let totalWin = 0;
  let newGrid = grid;

  while (true) {
    const { toRemove, comboCount } = checkCombos(newGrid);
    if (comboCount === 0) break;

    totalWin += comboCount * bet;

    // highlight / effect สัญลักษณ์ที่จะหาย
    const gridWithRemoved = newGrid.map((row, r) =>
      row.map((cell, c) => (toRemove[r][c] ? "" : cell))
    );
    setGrid(gridWithRemoved);

    // รอให้ผู้เล่นเห็น effect
    await new Promise((res) => setTimeout(res, 500));

    // cascade ลงมา
    newGrid = cascadeSymbols(newGrid, toRemove);
    setGrid(newGrid);

    // รอให้ผู้เล่นเห็น cascade
    await new Promise((res) => setTimeout(res, 500));
  }

  return totalWin;
};

const SlotApp = () => {
  const [grid, setGrid] = useState(randomGrid());
  const [balance, setBalance] = useState(100000);
  const [bet, setBet] = useState(12);
  const [win, setWin] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winStreak, setWinStreak] = useState(0);
  const [freeSpins, setFreeSpins] = useState(0);

  const handleSpin = () => {
    if (spinning) return;
    if (balance < bet && freeSpins === 0) return alert("ยอดเงินไม่เพียงพอ!");

    setSpinning(true);
    if (freeSpins > 0) {
      setFreeSpins((fs) => fs - 1);
    } else {
      setBalance((b) => b - bet);
    }
    setWin(0);

    // spin animation แบบ random grid
    const spinInterval = setInterval(() => {
      setGrid(randomGrid());
    }, 150);

    // หลัง spin จริง
    setTimeout(async () => {
      clearInterval(spinInterval);
      const finalGrid = randomGrid();
      setGrid(finalGrid);

      const totalWin = await runCascade(setGrid, finalGrid, bet);

      setWin(totalWin);
      setBalance((b) => b + totalWin);

      // Win streak + free spin
      if (totalWin > 0) {
        const newStreak = winStreak + 1;
        setWinStreak(newStreak);
        if (newStreak >= 3) {
          setFreeSpins((fs) => fs + 1);
          setWinStreak(0);
          alert("🎁 ได้ Free Spin 🐻!");
        }
      } else {
        setWinStreak(0);
      }

      setSpinning(false);
    }, 1500);
  };

  return (
    <div className="slot-container">
      <h1 className="slot-title">Candy Burst Slot 🍭</h1>

      <ReelGrid grid={grid} spinning={spinning} />

      <ControlPanel
        balance={balance}
        bet={bet}
        win={win}
        spinning={spinning}
        setBet={setBet}
        onSpin={handleSpin}
      />

      {freeSpins > 0 && (
        <div style={{ marginTop: 10, color: "#ff6fb3", fontWeight: "bold" }}>
          🐻 Free Spins: {freeSpins}
        </div>
      )}
    </div>
  );
};

export default SlotApp;