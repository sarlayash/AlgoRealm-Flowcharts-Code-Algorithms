import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, ArrowRight, RotateCcw, Map, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { LevelDefinition } from '../types/game';
import { sound } from '../services/sound';

interface VictoryModalProps {
  isOpen: boolean;
  level: LevelDefinition;
  starsEarned: number;
  stepsUsed: number;
  unlockedBadgeTitles: string[];
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onGoToMap: () => void;
  onOpenCertificate: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  level,
  starsEarned,
  stepsUsed,
  unlockedBadgeTitles,
  onNextLevel,
  onReplayLevel,
  onGoToMap,
  onOpenCertificate,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#f59e0b', '#10b981', '#38bdf8'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isFinalLevel = level.id === 30;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl text-center">
        {/* Victory Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>TRIAL {level.id} CONQUERED</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isFinalLevel ? 'Grandmaster Masterwork Complete!' : 'Algorithm Executed Successfully!'}
          </h2>

          <p className="text-sm text-slate-400">{level.title}</p>
        </div>

        {/* Stars Display */}
        <div className="flex justify-center items-center gap-2 py-2">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`p-2 rounded-xl transition-all ${
                starIdx <= starsEarned
                  ? 'bg-amber-500/10 text-amber-400 scale-110'
                  : 'bg-slate-950 text-slate-700'
              }`}
            >
              <Star
                className={`w-8 h-8 ${
                  starIdx <= starsEarned ? 'fill-amber-400' : ''
                }`}
              />
            </div>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-left font-mono text-xs">
          <div>
            <div className="text-slate-500">STEPS TAKEN</div>
            <div className="text-lg font-bold text-white mt-0.5">{stepsUsed}</div>
          </div>
          <div>
            <div className="text-slate-500">OPTIMAL TARGET</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">
              ≤ {level.optimalSteps} Steps
            </div>
          </div>
        </div>

        {/* Unlocked Badges Notification if any */}
        {unlockedBadgeTitles.length > 0 && (
          <div className="p-3 bg-indigo-950/60 border border-indigo-500/40 rounded-xl text-left flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-300 font-mono">
                NEW BADGE UNLOCKED!
              </div>
              <div className="text-xs text-indigo-200 mt-0.5">
                {unlockedBadgeTitles.join(', ')}
              </div>
            </div>
          </div>
        )}

        {/* Educational CS Fact */}
        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-left space-y-1">
          <div className="text-[11px] font-mono text-indigo-400 font-bold uppercase">
            Algorithmic Insight:
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {level.learningFact}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {!isFinalLevel ? (
            <button
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm font-mono shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Proceed to Trial {level.id + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onOpenCertificate();
              }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm font-mono shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Award className="w-5 h-5" />
              <span>Claim & Download Master Certificate</span>
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onReplayLevel();
              }}
              className="flex-1 py-2.5 px-3 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Trial</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onGoToMap();
              }}
              className="flex-1 py-2.5 px-3 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Overworld Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
