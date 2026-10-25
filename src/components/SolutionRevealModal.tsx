import React from 'react';
import { Lightbulb, CheckCircle2, Play, ArrowRight, X, Cpu, Sparkles, BookOpen, Lock, Terminal } from 'lucide-react';
import { LevelDefinition } from '../types/game';
import { LEVEL_SOLUTIONS } from '../data/solutions';
import { sound } from '../services/sound';

interface SolutionRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: LevelDefinition;
  failedAttempts: number;
  onApplyAndSolve: () => void;
  onLoadIntoWorkspace?: () => void;
}

export const SolutionRevealModal: React.FC<SolutionRevealModalProps> = ({
  isOpen,
  onClose,
  level,
  failedAttempts,
  onApplyAndSolve,
  onLoadIntoWorkspace,
}) => {
  if (!isOpen) return null;

  const solution = LEVEL_SOLUTIONS[level.id];
  const isUnlocked = failedAttempts >= 2;

  const handleApply = () => {
    sound.playSuccess();
    onApplyAndSolve();
    onClose();
  };

  const handleLoadOnly = () => {
    sound.playClick();
    if (onLoadIntoWorkspace) {
      onLoadIntoWorkspace();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-amber-950/40">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lightbulb className="w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-700/50">
                  LEVEL {level.id} SOLUTION ARCHIVE
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {failedAttempts >= 2 ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked (2 Failed Attempts)
                    </span>
                  ) : (
                    <span className="text-amber-400">
                      Locked ({failedAttempts}/2 failed attempts)
                    </span>
                  )}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">{level.title}</h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-sm">
          {!isUnlocked ? (
            <div className="p-6 bg-slate-950/70 border border-amber-500/30 rounded-xl text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-950/50 border border-amber-600/40 flex items-center justify-center text-amber-400">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Solution Locked</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                In accordance with AlgoRealm mastery guidelines, full solutions and automated blueprints unlock after{' '}
                <strong className="text-amber-400">2 failed attempts</strong> on any challenge. You currently have{' '}
                <strong className="text-white">{failedAttempts} failed attempt{failedAttempts === 1 ? '' : 's'}</strong>.
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-mono transition-colors"
                >
                  Return to Challenge & Try Again
                </button>
              </div>
            </div>
          ) : !solution ? (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center text-slate-400 text-xs">
              Solution blueprint is loading or in verification.
            </div>
          ) : (
            <>
              {/* Concept & Why It Works */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                  <BookOpen className="w-4 h-4" />
                  <span>ALGORITHMIC LOGIC & WHY THIS WORKS</span>
                </div>
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl leading-relaxed text-slate-300 text-xs">
                  {solution.explanation}
                </div>
              </div>

              {/* Mode Specific Breakdown */}
              {level.mode === 'GRID_BOT' && solution.gridCommands && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400">
                      <Terminal className="w-4 h-4" />
                      <span>OPTIMAL COMMAND SEQUENCE ({solution.gridCommands.length} STEPS)</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      Optimal Target: ≤ {level.optimalSteps} steps
                    </span>
                  </div>

                  <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
                    <div className="flex flex-wrap gap-2 items-center">
                      {solution.gridCommands.map((cmd, idx) => (
                        <React.Fragment key={idx}>
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 border border-indigo-500/40 rounded-lg text-xs font-mono text-indigo-200">
                            <span className="text-[10px] text-slate-500 font-bold">{idx + 1}.</span>
                            <span>{cmd}</span>
                          </div>
                          {idx < (solution.gridCommands?.length || 0) - 1 && (
                            <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {level.mode === 'FLOWCHART_BUILDER' && level.flowchartPuzzle && solution.flowchartSlots && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                    <Cpu className="w-4 h-4" />
                    <span>FLOWCHART BLUEPRINT WIRING</span>
                  </div>

                  <div className="space-y-2">
                    {level.flowchartPuzzle.slotNodes?.map((slot) => {
                      const assignedNodeId = solution.flowchartSlots?.[slot.id];
                      const nodeData = level.flowchartPuzzle?.paletteNodes.find(
                        (p) => p.id === assignedNodeId
                      );

                      return (
                        <div
                          key={slot.id}
                          className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4"
                        >
                          <div>
                            <div className="text-[10px] font-mono text-slate-500 uppercase">
                              {slot.label} ({slot.acceptedType})
                            </div>
                            <div className="text-xs font-bold font-mono text-white mt-0.5">
                              {nodeData?.text || assignedNodeId}
                            </div>
                          </div>
                          <span className="px-2 py-1 text-[10px] font-mono bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 rounded shrink-0">
                            ✓ WIRED
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {level.mode === 'ALGORITHM_ARENA' && solution.algoStepsDescription && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span>OPTIMAL EXECUTION STEPS</span>
                  </div>

                  <div className="space-y-1.5 p-4 bg-slate-950/80 border border-slate-800 rounded-xl font-mono text-xs">
                    {solution.algoStepsDescription.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 py-0.5">
                        <span className="text-indigo-400 font-bold shrink-0">{idx + 1}.</span>
                        <span className="text-slate-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Note */}
              <div className="p-3 bg-indigo-950/30 border border-indigo-700/30 rounded-xl text-xs text-indigo-300 font-mono flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>
                  Tip: Studying why each instruction fits the concept will accelerate your mastery of algorithms!
                </span>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors"
          >
            Close & Solve Myself
          </button>

          {isUnlocked && (
            <div className="flex items-center gap-2">
              {level.mode === 'GRID_BOT' && onLoadIntoWorkspace && (
                <button
                  onClick={handleLoadOnly}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-indigo-500/50 text-indigo-300 font-bold rounded-lg text-xs font-mono transition-colors cursor-pointer"
                >
                  Load Into Palette
                </button>
              )}

              <button
                onClick={handleApply}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs font-mono shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Apply Solution & Auto-Solve</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
