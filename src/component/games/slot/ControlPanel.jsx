import React from "react";

const ControlPanel = ({ balance, bet, win, spinning, setBet, onSpin }) => {
  return (
    <div className="control-panel">
      <div className="info-bar">
        <div>💰 ยอดเงิน: {balance.toLocaleString()}</div>
        <div>🎯 เดิมพัน: {bet.toFixed(2)}</div>
        <div>🏆 ชนะ: {win.toFixed(2)}</div>
      </div>

      <div className="btn-row">
        <button onClick={() => setBet((b) => Math.max(1, b - 1))} disabled={spinning}>
          -
        </button>
        <button
          className={`spin-btn ${spinning ? "disabled" : ""}`}
          onClick={onSpin}
        >
          {spinning ? "SPINNING..." : "SPIN"}
        </button>
        <button onClick={() => setBet((b) => Math.min(1000, b + 1))} disabled={spinning}>
          +
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
