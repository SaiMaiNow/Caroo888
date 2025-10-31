import React, { useState, useEffect } from 'react';
import { delay, tickNumber } from '../utils';

export function FreeSpinSummary({ baseWin, totalMultiplier, onClose }) {
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