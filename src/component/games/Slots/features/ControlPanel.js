import React from 'react';

export function ControlPanel({
  spinning, isFreeSpins, isAutoSpinningFreeSpins, isTurbo,
  currentBet, freeSpinsLeft, userName, balance,
  onChangeBet, onSpin, onToggleTurbo
}) {
  return (
    <div className="css-controls-panel">
      {/* --- ส่วนปุ่ม Bet --- */}
      <div className="css-bet-controls">
        <button
          onClick={() => onChangeBet(-1)}
          disabled={spinning || isFreeSpins}
          className="css-bet-button css-bet-button-minus"
        >
          -
        </button>
        <div className="css-bet-display">
          <span className="css-bet-label">bet</span>
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

      {/* --- ส่วนปุ่ม Spin --- */}
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
      
      {/* --- ส่วนแสดงผลด้านข้าง --- */}
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
          <span className="css-small-stat-label">UserName:</span>
          <span className="css-small-stat-luck">{userName}</span>
        </div>
        <div className="css-small-stat-row">
          <span className="css-small-stat-label">Balance:</span>
          <span className="css-small-stat-balance">{balance}</span>
        </div>
      </div>
    </div>  
  );
}