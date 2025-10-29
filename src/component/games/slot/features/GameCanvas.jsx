import React, { useEffect, useRef } from 'react';
import { GRID_SIZE, CELL_SIZE } from '../constants';
import { FreeSpinSummary } from './FreeSpinSummary';

export function GameCanvas({
  grid, spinning, winningCells, isFreeSpins,
  pulseStateRef, lastPulseTimeRef,
  showFreeSpinSummary, freeSpinTotalWin, freeSpinTotalMultiplier, onCloseSummary
}) {
  const canvasRef = useRef(null);

  // --- Drawing Engine (กลไกการวาดภาพ) ---
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