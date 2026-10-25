import React, { useRef, useEffect, useState } from 'react';
import { X, Download, Award, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { PlayerProfile } from '../types/game';
import { renderCertificateToCanvas, downloadCertificatePng } from '../services/certificate';
import { sound } from '../services/sound';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  totalStarsEarned: number;
  completedCount: number;
  onUpdateName?: (newName: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  profile,
  totalStarsEarned,
  completedCount,
  onUpdateName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [candidateName, setCandidateName] = useState(profile.name);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      renderCertificateToCanvas(
        canvasRef.current,
        { ...profile, name: candidateName },
        totalStarsEarned,
        completedCount
      );
    }
  }, [isOpen, profile, candidateName, totalStarsEarned, completedCount]);

  if (!isOpen) return null;

  const handleDownload = () => {
    sound.playSuccess();
    setIsExporting(true);
    if (canvasRef.current) {
      downloadCertificatePng(canvasRef.current, candidateName);
    }
    setTimeout(() => setIsExporting(false), 800);
  };

  const handleNameChange = (newName: string) => {
    setCandidateName(newName);
    if (onUpdateName) {
      onUpdateName(newName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Official Certificate of Algorithmic Mastery</h2>
              <div className="text-xs text-slate-400">
                Generated dynamically in High-Resolution (2400 x 1600) · Ready for PNG Export
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs font-mono shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exporting...' : 'Download in PNG Format'}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Controls & Live Canvas Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label htmlFor="certName" className="text-xs font-mono text-slate-400 whitespace-nowrap">
                Certificate Name:
              </label>
              <input
                id="certName"
                type="text"
                value={candidateName}
                onChange={(e) => handleNameChange(e.target.value)}
                maxLength={30}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none w-full sm:w-64"
              />
            </div>

            <div className="text-xs text-slate-400 font-mono flex items-center gap-3">
              <span>{completedCount} / 30 Levels</span>
              <span>·</span>
              <span className="text-amber-400 font-bold">{totalStarsEarned} Stars</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">Official Seal Verified</span>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="w-full bg-slate-950 rounded-xl border border-slate-800/80 p-2 sm:p-4 shadow-inner flex items-center justify-center overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-auto max-h-[62vh] rounded-lg shadow-2xl object-contain border border-amber-500/20"
            />
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>
            Click "Download in PNG Format" to save your pristine 2400x1600 official credential image to your device.
          </span>
        </div>
      </div>
    </div>
  );
};
