import { PlayerProfile } from '../types/game';

/**
 * High-Resolution Certificate Renderer & PNG Downloader
 * Renders an official certificate directly onto an off-screen HTML5 Canvas (2400 x 1600 px)
 * and triggers a crisp, direct PNG file download without external API calls or watermarks.
 */

export function renderCertificateToCanvas(
  canvas: HTMLCanvasElement,
  profile: PlayerProfile,
  totalStarsEarned: number,
  completedCount: number
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 2400;
  const height = 1600;
  canvas.width = width;
  canvas.height = height;

  // 1. Deep Midnight Obsidian Gradient Background
  const bgGrad = ctx.createRadialGradient(
    width / 2, height / 2, 200,
    width / 2, height / 2, 1400
  );
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(0.6, '#090d16');
  bgGrad.addColorStop(1, '#030712');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle Algorithmic Circuit Grid & Flowchart Watermark Lines
  ctx.save();
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
  ctx.lineWidth = 1.5;
  const gridSize = 80;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw concentric technical rings in background
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.06)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 550, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 680, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 3. Ornate Double Gold Outer Borders
  ctx.save();
  // Outer border
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 8;
  ctx.strokeRect(60, 60, width - 120, height - 120);

  // Inner hairline border
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.strokeRect(84, 84, width - 168, height - 168);

  // Corner geometric brackets
  const cornerSize = 70;
  const drawCorner = (cx: number, cy: number, dx: number, dy: number) => {
    ctx.beginPath();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 5;
    ctx.moveTo(cx, cy + dy * cornerSize);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + dx * cornerSize, cy);
    ctx.stroke();

    // Corner diamond
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(cx + dx * 20, cy + dy * 20, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  drawCorner(96, 96, 1, 1);
  drawCorner(width - 96, 96, -1, 1);
  drawCorner(96, height - 96, 1, -1);
  drawCorner(width - 96, height - 96, -1, -1);
  ctx.restore();

  // 4. Header Badge / Crest Motif
  ctx.save();
  const crestX = width / 2;
  const crestY = 220;

  // Golden Glow
  const glow = ctx.createRadialGradient(crestX, crestY, 10, crestX, crestY, 90);
  glow.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(crestX, crestY, 90, 0, Math.PI * 2);
  ctx.fill();

  // Diamond Star
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(crestX, crestY - 45);
  ctx.lineTo(crestX + 45, crestY);
  ctx.lineTo(crestX, crestY + 45);
  ctx.lineTo(crestX - 45, crestY);
  ctx.closePath();
  ctx.fill();

  // Inner code brackets motif
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 36px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('< />', crestX, crestY);
  ctx.restore();

  // 5. Institution / Academy Title
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('ALGOREALM INTERNATIONAL ACADEMY OF COMPUTING', width / 2, 330);

  // 6. Main Certificate Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 58px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('CERTIFICATE OF ALGORITHMIC MASTERY', width / 2, 420);

  ctx.fillStyle = '#f59e0b';
  ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('& FLOWCHART ARCHITECTURE', width / 2, 470);

  // Subtle separator line
  const gradLine = ctx.createLinearGradient(width / 2 - 350, 0, width / 2 + 350, 0);
  gradLine.addColorStop(0, 'transparent');
  gradLine.addColorStop(0.5, '#f59e0b');
  gradLine.addColorStop(1, 'transparent');
  ctx.strokeStyle = gradLine;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 350, 510);
  ctx.lineTo(width / 2 + 350, 510);
  ctx.stroke();

  // 7. Presentation Subtext
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '400 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('This is officially conferred upon', width / 2, 580);

  // 8. Player Name (Prominent & Elegant)
  const playerName = profile.name.trim() || 'Hero of Logic';
  ctx.fillStyle = '#38bdf8'; // bright cyan
  ctx.font = '800 82px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(playerName, width / 2, 690);

  // Underline under player name
  const nameWidth = ctx.measureText(playerName).width;
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - nameWidth / 2 - 40, 720);
  ctx.lineTo(width / 2 + nameWidth / 2 + 40, 720);
  ctx.stroke();

  // 9. Citation & Achievement Statement
  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    'For exceptional technical prowess, rigorous deductive problem solving, and supreme mastery over',
    width / 2,
    790
  );
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    '30 Levels of Flowchart Design, Data Structures, Graph Traversal, & Computational Optimization.',
    width / 2,
    835
  );

  // 10. Stats Badges Bar in Certificate
  const statBoxY = 930;
  const stats = [
    { label: 'TRIALS COMPLETED', value: `${completedCount} / 30 LEVELS` },
    { label: 'MASTERY STARS', value: `${totalStarsEarned} ★ EARNED` },
    { label: 'ACADEMIC RANK', value: completedCount >= 30 ? 'GRAND ARCHITECT' : 'ALGO ADVENTURER' },
    { label: 'EFFICIENCY SCORE', value: `${profile.totalScore} PTS` },
  ];

  const colWidth = 460;
  const startX = (width - stats.length * colWidth) / 2 + colWidth / 2;

  stats.forEach((st, i) => {
    const x = startX + i * colWidth;

    // Card background
    ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - 200, statBoxY - 45, 400, 110, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 32px "JetBrains Mono", monospace';
    ctx.fillText(st.value, x, statBoxY + 5);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(st.label, x, statBoxY + 42);
  });

  // 11. Official Seal & Signatures
  const footerY = 1290;

  // Left Signature: The Grand Compiler
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(350, footerY);
  ctx.lineTo(750, footerY);
  ctx.stroke();

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'italic 34px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Ada Lovelace & Alan Turing', 550, footerY - 20);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('HIGH COUNCIL OF ALGORITHMS', 550, footerY + 30);
  ctx.font = '400 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CHIEF COMPILE ARCHITECT', 550, footerY + 55);

  // Center Golden Digital Seal
  const sealX = width / 2;
  const sealY = footerY - 10;
  ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
  ctx.beginPath();
  ctx.arc(sealX, sealY, 70, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(sealX, sealY, 60, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillText('VERIFIED', sealX, sealY - 12);
  ctx.fillText('★ 2026 ★', sealX, sealY + 12);

  // Right Signature: Verification Code & Date
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width - 750, footerY);
  ctx.lineTo(width - 350, footerY);
  ctx.stroke();

  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 24px "JetBrains Mono", monospace';
  ctx.fillText(issueDate, width - 550, footerY - 20);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('DATE OF CONFERRAL', width - 550, footerY + 30);

  const certHash = `ALG-${Math.abs((playerName.length * 997 + totalStarsEarned * 31) % 9000 + 1000)}-${new Date().getFullYear()}`;
  ctx.font = '500 15px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`ID: ${certHash}`, width - 550, footerY + 55);

  // Bottom Notice
  ctx.fillStyle = '#64748b';
  ctx.font = '400 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    'AlgoRealm Certification Authority · Powered by Kapil · Permanent Hash Authenticated · Issued via Web Client Engine',
    width / 2,
    1480
  );

  ctx.restore();
}

/**
 * Trigger immediate PNG download in the user's browser
 */
export function downloadCertificatePng(
  canvas: HTMLCanvasElement,
  playerName: string
): void {
  const safeName = (playerName || 'Player').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `AlgoRealm_Certificate_${safeName}.png`;

  try {
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error('Failed to export certificate PNG:', err);
  }
}
