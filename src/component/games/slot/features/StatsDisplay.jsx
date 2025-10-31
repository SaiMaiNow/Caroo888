import React from 'react';

export function StatsDisplay({ spinWin, spinMultiplier }) {
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