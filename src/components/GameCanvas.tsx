import React, { useRef, useEffect } from 'react';
import { Direction, GridCell } from '../types/game';

interface GameCanvasProps {
  width: number;
  height: number;
  cells: GridCell[];
  playerPos: { x: number; y: number; dir: Direction };
  collectedGems: string[]; // keys like "x,y"
  variables: Record<string, number>;
  activeStepIndex: number;
  isSimulating: boolean;
  avatarColor?: string;
  avatarId?: string;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  width,
  height,
  cells,
  playerPos,
  collectedGems,
  variables,
  isSimulating,
  avatarColor = '#6366f1',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cell calculation
    const cellSize = Math.min(
      Math.floor((canvas.width - 40) / width),
      Math.floor((canvas.height - 40) / height),
      70
    );

    const offsetX = (canvas.width - width * cellSize) / 2;
    const offsetY = (canvas.height - height * cellSize) / 2;

    // Clear background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle arena circuit grid lines
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
    ctx.lineWidth = 1;
    for (let c = 0; c <= width; c++) {
      ctx.beginPath();
      ctx.moveTo(offsetX + c * cellSize, offsetY);
      ctx.lineTo(offsetX + c * cellSize, offsetY + height * cellSize);
      ctx.stroke();
    }
    for (let r = 0; r <= height; r++) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + r * cellSize);
      ctx.lineTo(offsetX + width * cellSize, offsetY + r * cellSize);
      ctx.stroke();
    }

    // Draw Floor Grid Cells
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cellX = offsetX + x * cellSize;
        const cellY = offsetY + y * cellSize;

        // Base tile
        ctx.fillStyle = (x + y) % 2 === 0 ? '#0f172a' : '#131d33';
        ctx.fillRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);

        // Border
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);
      }
    }

    // Draw Specific Cell Elements
    cells.forEach((cell) => {
      const cellX = offsetX + cell.x * cellSize;
      const cellY = offsetY + cell.y * cellSize;
      const centerX = cellX + cellSize / 2;
      const centerY = cellY + cellSize / 2;
      const gemKey = `${cell.x},${cell.y}`;
      const isCollected = collectedGems.includes(gemKey);

      if (cell.type === 'WALL') {
        // High-tech Wall block
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cellX + 3, cellY + 3, cellSize - 6, cellSize - 6);

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.strokeRect(cellX + 3, cellY + 3, cellSize - 6, cellSize - 6);

        // Hazard stripes
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cellX + 6, cellY + cellSize - 6);
        ctx.lineTo(cellX + cellSize - 6, cellY + 6);
        ctx.stroke();
      } else if (cell.type === 'GEM' && !isCollected) {
        // Floating Algorithmic Gem Crystal
        const time = Date.now() / 400;
        const hover = Math.sin(time) * 3;

        // Glow
        const glow = ctx.createRadialGradient(
          centerX,
          centerY + hover,
          2,
          centerX,
          centerY + hover,
          cellSize * 0.4
        );
        glow.addColorStop(0, 'rgba(56, 189, 248, 0.8)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(centerX, centerY + hover, cellSize * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Crystal Diamond
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        const gemR = cellSize * 0.22;
        ctx.moveTo(centerX, centerY - gemR + hover);
        ctx.lineTo(centerX + gemR, centerY + hover);
        ctx.lineTo(centerX, centerY + gemR + hover);
        ctx.lineTo(centerX - gemR, centerY + hover);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Optional value label
        if (cell.value !== undefined) {
          ctx.fillStyle = '#0369a1';
          ctx.font = 'bold 10px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(cell.value), centerX, centerY + hover);
        }
      } else if (cell.type === 'GOAL') {
        // Destination Portal
        const time = Date.now() / 600;
        ctx.save();
        ctx.translate(centerX, centerY);

        // Outer glow
        const portalGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, cellSize * 0.45);
        portalGlow.addColorStop(0, 'rgba(16, 185, 129, 0.6)');
        portalGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = portalGlow;
        ctx.beginPath();
        ctx.arc(0, 0, cellSize * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // Rotating ring
        ctx.rotate(time);
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, cellSize * 0.32, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Inner core
        ctx.rotate(-time * 2);
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(0, 0, cellSize * 0.16, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (cell.type === 'DOOR') {
        // Logic Door / Gate
        const requiredVal = Number(cell.value) || 0;
        const currentVal = Object.values(variables)[0] || 0;
        const isDoorOpen = currentVal >= requiredVal;

        if (!isDoorOpen) {
          // Closed security barrier
          ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
          ctx.fillRect(cellX + 4, cellY + 4, cellSize - 8, cellSize - 8);

          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          ctx.strokeRect(cellX + 4, cellY + 4, cellSize - 8, cellSize - 8);

          // Padlock / Door Text
          ctx.fillStyle = '#fca5a5';
          ctx.font = 'bold 10px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`REQ ≥ ${requiredVal}`, centerX, centerY);
        } else {
          // Open barrier
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(cellX + 6, cellY + 6, cellSize - 12, cellSize - 12);
          ctx.setLineDash([]);

          ctx.fillStyle = '#86efac';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('UNLOCKED', centerX, centerY);
        }
      } else if (cell.type === 'CONVEYOR') {
        // Conveyor / Array cell
        ctx.fillStyle = 'rgba(99, 102, 241, 0.12)';
        ctx.fillRect(cellX + 3, cellY + 3, cellSize - 6, cellSize - 6);

        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX + 3, cellY + 3, cellSize - 6, cellSize - 6);

        if (cell.value) {
          ctx.fillStyle = '#a5b4fc';
          ctx.font = '600 11px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(cell.value), centerX, centerY);
        }
      }
    });

    // Draw Player Algorithmic Rover / Robot
    const playerPxX = offsetX + playerPos.x * cellSize + cellSize / 2;
    const playerPxY = offsetY + playerPos.y * cellSize + cellSize / 2;

    ctx.save();
    ctx.translate(playerPxX, playerPxY);

    // Rotation based on Direction
    let angle = 0;
    if (playerPos.dir === 'RIGHT') angle = 0;
    if (playerPos.dir === 'DOWN') angle = Math.PI / 2;
    if (playerPos.dir === 'LEFT') angle = Math.PI;
    if (playerPos.dir === 'UP') angle = -Math.PI / 2;

    ctx.rotate(angle);

    // Rover Tread Tracks
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-cellSize * 0.28, -cellSize * 0.28, cellSize * 0.56, cellSize * 0.12);
    ctx.fillRect(-cellSize * 0.28, cellSize * 0.16, cellSize * 0.56, cellSize * 0.12);

    // Rover Main Body
    ctx.fillStyle = avatarColor;
    ctx.beginPath();
    ctx.roundRect(
      -cellSize * 0.22,
      -cellSize * 0.2,
      cellSize * 0.44,
      cellSize * 0.4,
      6
    );
    ctx.fill();

    // Sensor Scanner Head
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cellSize * 0.12, 0, cellSize * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Forward laser visor / eye
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(cellSize * 0.16, 0, cellSize * 0.05, 0, Math.PI * 2);
    ctx.fill();

    // Scanner beam pulse when running
    if (isSimulating) {
      const beamGrad = ctx.createRadialGradient(
        cellSize * 0.2, 0, 2,
        cellSize * 0.5, 0, cellSize * 0.35
      );
      beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
      beamGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(cellSize * 0.2, 0);
      ctx.lineTo(cellSize * 0.65, -cellSize * 0.3);
      ctx.lineTo(cellSize * 0.65, cellSize * 0.3);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }, [width, height, cells, playerPos, collectedGems, variables, isSimulating, avatarColor]);

  return (
    <div className="relative w-full aspect-square max-w-[480px] mx-auto bg-slate-950 rounded-2xl border border-slate-800 p-2 shadow-2xl flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={460}
        height={460}
        className="w-full h-full rounded-xl"
      />
    </div>
  );
};
