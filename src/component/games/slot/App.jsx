import React, { useState } from "react";
import ReelGrid from "./ReelGrid";
import ControlPanel from "./ControlPanel";
import "./Slot.css";

const symbols = ["⭐", "💖", "🟡", "🟢", "🟣", "🟠", "🥝", "💧"];

const randomGrid = () =>
  Array.from({ length: 6 }, () =>
    Array.from({ length: 6 }, () => symbols[Math.floor(Math.random() * symbols.length)])
  );

const SlotApp = () => {
  const [grid, setGrid] = useState(randomGrid());
  const [balance, setBalance] = useState(100000);
  const [bet, setBet] = useState(12);
  const [win, setWin] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const handleSpin = () => {
    if (spinning) return;
    if (balance < bet) return alert("ยอดเงินไม่เพียงพอ!");

    setSpinning(true);
    setBalance(balance - bet);
    setWin(0);

    // Spin animation
    const spinInterval = setInterval(() => {
      setGrid(randomGrid());
    }, 150);

    // Stop spinning after 2.5s
    setTimeout(() => {
      clearInterval(spinInterval);
      const newGrid = randomGrid();
      setGrid(newGrid);

      // Calculate win mock
      const randomWin = Math.random() < 0.35 ? Math.floor(Math.random() * (bet * 5)) : 0;
      setWin(randomWin);
      setBalance((b) => b + randomWin);
      setSpinning(false);
    }, 2500);
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
    </div>
  );
};

export default SlotApp;
