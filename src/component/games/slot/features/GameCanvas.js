import React, { useEffect, useRef, useState } from 'react';
import { GRID_SIZE, CELL_SIZE, SYMBOLS } from '../constants';
import { FreeSpinSummary } from './FreeSpinSummary';

export function GameCanvas({
  grid, spinning, winningCells, isFreeSpins,
  pulseStateRef, lastPulseTimeRef,
  showFreeSpinSummary, freeSpinTotalWin, freeSpinTotalMultiplier, onCloseSummary
}) {
  const canvasRef = useRef(null);
  const imageElementsRef = useRef(new Map());
  const [imagesReadyVersion, setImagesReadyVersion] = useState(0);

  const drawRoundedRect = (ctx, x, y, w, h, r) => {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // Preload images once
  useEffect(() => {
    const map = new Map();
    const symbolArray = Object.values(SYMBOLS);
    let loadedCount = 0;
    const total = symbolArray.length;
    
    symbolArray.forEach((symbolObj) => {
      const img = new Image();
      img.src = symbolObj.image;
      img.onload = () => {
        loadedCount += 1;
        map.set(symbolObj, img);
        if (loadedCount === total) {
          setImagesReadyVersion((v) => v + 1);
        } else {
          // Trigger incremental re-render for progressive loading
          setImagesReadyVersion((v) => v + 1);
        }
      };
      img.onerror = () => {
        loadedCount += 1;
        // Still trigger to avoid blocking renders
        setImagesReadyVersion((v) => v + 1);
      };
    });
    imageElementsRef.current = map;
  }, []);

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

        // Cell background with rounded corners and subtle vertical gradient
        const pad = 4;
        const rx = x + pad;
        const ry = y + pad;
        const rw = CELL_SIZE - pad * 2;
        const rh = CELL_SIZE - pad * 2;
        const radius = Math.min(14, rw / 2, rh / 2);
        const grad = ctx.createLinearGradient(0, ry, 0, ry + rh);
        if (isFreeSpins) {
          grad.addColorStop(0, '#56307c');
          grad.addColorStop(1, '#3a1e57');
        } else {
          grad.addColorStop(0, '#8a6a4a');
          grad.addColorStop(1, '#5f462f');
        }
        ctx.fillStyle = grad;
        drawRoundedRect(ctx, rx, ry, rw, rh, radius);
        ctx.fill();

        // Inner bevel
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        drawRoundedRect(ctx, rx + 1, ry + 1, rw - 2, rh - 2, radius - 1);
        ctx.stroke();

        // Golden border
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        drawRoundedRect(ctx, rx, ry, rw, rh, radius);
        ctx.stroke();

        if (cell && cell.symbol) {
          const img = imageElementsRef.current.get(cell.symbol);
          const hasImg = img && img.complete && img.naturalWidth > 0;
          if (hasImg) {
            const padding = 10;
            const drawX = x + padding;
            const drawY = y + padding;
            const drawSize = CELL_SIZE - padding * 2;
            ctx.drawImage(img, drawX, drawY, drawSize, drawSize);
          } else {
            // Fallback: draw symbol label as text
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            const label = cell.symbol.label || '?';
            ctx.fillText(label, x + CELL_SIZE / 2, y + CELL_SIZE / 2);
          }

          if (cell.multiplier > 1) {
            // Badge pill top-left
            const badgeW = 36;
            const badgeH = 22;
            const bx = rx + 6;
            const by = ry + 6;
            const badgeGrad = ctx.createLinearGradient(bx, by, bx, by + badgeH);
            badgeGrad.addColorStop(0, '#ff6b6b');
            badgeGrad.addColorStop(1, '#e63946');
            ctx.fillStyle = badgeGrad;
            drawRoundedRect(ctx, bx, by, badgeW, badgeH, 10);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            ctx.lineWidth = 1;
            drawRoundedRect(ctx, bx + 0.5, by + 0.5, badgeW - 1, badgeH - 1, 9.5);
            ctx.stroke();
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`x${cell.multiplier}`, bx + badgeW / 2, by + badgeH / 2 + 1);
          }
        }
        
        if (isWinningCell && !spinning) {
          ctx.globalAlpha = pulseOpacity;
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 4;
          drawRoundedRect(ctx, rx - 1, ry - 1, rw + 2, rh + 2, radius + 2);
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#FFD700';
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;
        }
      }
    }
  }, [grid, spinning, winningCells, isFreeSpins, pulseStateRef, lastPulseTimeRef, imagesReadyVersion]);

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