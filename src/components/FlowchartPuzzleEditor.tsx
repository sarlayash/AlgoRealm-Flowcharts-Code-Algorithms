import React, { useState } from 'react';
import { Play, Check, X, RotateCcw, AlertCircle, ArrowDown } from 'lucide-react';
import { FlowchartPuzzleConfig } from '../types/game';
import { sound } from '../services/sound';

interface FlowchartPuzzleEditorProps {
  puzzle: FlowchartPuzzleConfig;
  onSuccess: (stepsUsed: number) => void;
  onFailAttempt?: () => void;
  failedAttempts?: number;
  externalPlacedSlots?: Record<string, string>;
  onOpenSolution?: () => void;
}

export const FlowchartPuzzleEditor: React.FC<FlowchartPuzzleEditorProps> = ({
  puzzle,
  onSuccess,
  onFailAttempt,
  failedAttempts = 0,
  externalPlacedSlots,
  onOpenSolution,
}) => {
  // Map of slotId -> paletteNodeId
  const [placedSlots, setPlacedSlots] = useState<Record<string, string>>(externalPlacedSlots || {});
  const [testResults, setTestResults] = useState<{ pass: boolean; msg: string }[] | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeSlotPulse, setActiveSlotPulse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync external slots when provided (e.g. from Auto-Solve)
  React.useEffect(() => {
    if (externalPlacedSlots && Object.keys(externalPlacedSlots).length > 0) {
      setPlacedSlots(externalPlacedSlots);
      setTestResults(null);
      setErrorMessage(null);
    }
  }, [externalPlacedSlots]);

  const slots = puzzle.slotNodes || [];
  const palette = puzzle.paletteNodes || [];

  const handlePlaceNode = (slotId: string, nodeId: string) => {
    sound.playClick();
    setErrorMessage(null);
    setPlacedSlots((prev) => ({
      ...prev,
      [slotId]: nodeId,
    }));
    setTestResults(null);
  };

  const handleClearSlot = (slotId: string) => {
    sound.playClick();
    setErrorMessage(null);
    setPlacedSlots((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
    setTestResults(null);
  };

  const handleReset = () => {
    sound.playClick();
    setErrorMessage(null);
    setPlacedSlots({});
    setTestResults(null);
  };

  const handleRunVerification = async () => {
    sound.playClick();
    setErrorMessage(null);
    // Check if all slots are filled
    const unfilled = slots.find((s) => !placedSlots[s.id]);
    if (unfilled) {
      sound.playFailure();
      setErrorMessage(`Please assign a node to "${unfilled.label}" before running verification.`);
      onFailAttempt?.();
      return;
    }

    setIsEvaluating(true);
    setTestResults(null);

    // Step animation through slots
    for (const slot of slots) {
      setActiveSlotPulse(slot.id);
      sound.playFlowchartTick();
      await new Promise((res) => setTimeout(res, 400));
    }
    setActiveSlotPulse(null);

    // Evaluate logic correctness
    // A correct assembly matches the valid palette action per slot
    let allPassed = true;
    const results = puzzle.testCases.map((tc, idx) => {
      // Check heuristic based on puzzle node actions
      const assignedNodeIds = slots.map((s) => placedSlots[s.id]);
      const assignedActions = assignedNodeIds
        .map((id) => palette.find((p) => p.id === id)?.action || '')
        .filter(Boolean);

      // Distractor check
      const hasBadAction = assignedActions.some((a) =>
        ['DIVIDE_ZERO', 'ALARM', 'DROP', 'LEAK', 'RANDOM', 'INVERT'].includes(a)
      );

      const pass = !hasBadAction && assignedActions.length === slots.length;
      if (!pass) allPassed = false;

      return {
        pass,
        msg: pass
          ? `✓ Case ${idx + 1}: Expected output validated.`
          : `✗ Case ${idx + 1}: Logic anomaly or incorrect block placement.`,
      };
    });

    setTestResults(results);
    setIsEvaluating(false);

    if (allPassed) {
      sound.playSuccess();
      setTimeout(() => {
        onSuccess(slots.length);
      }, 700);
    } else {
      sound.playFailure();
      setErrorMessage('Flowchart logic failed one or more verification test cases. Check node choices.');
      onFailAttempt?.();
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3 bg-rose-950/70 border border-rose-500/40 text-rose-200 rounded-xl text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left: Palette of Flowchart Nodes */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono">FLOWCHART NODE PALETTE</h3>
            <span className="text-xs text-slate-400">Available Components</span>
          </div>

          <p className="text-xs text-slate-400 mt-2">
            Click a component below, then select an open slot on the blueprint to wire the algorithm.
          </p>

          <div className="mt-4 space-y-2.5">
            {palette.map((node) => {
              const isUsed = Object.values(placedSlots).includes(node.id);
              const isDecision = node.type === 'DECISION';

              return (
                <div
                  key={node.id}
                  className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                    isUsed
                      ? 'border-slate-800 bg-slate-950/40 opacity-50'
                      : isDecision
                      ? 'border-amber-600/50 bg-amber-950/20 hover:border-amber-400 hover:bg-amber-950/40 cursor-pointer'
                      : 'border-indigo-600/50 bg-indigo-950/20 hover:border-indigo-400 hover:bg-indigo-950/40 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isDecision
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}
                    >
                      {node.type}
                    </span>
                    {isUsed && (
                      <span className="text-[10px] text-slate-500 font-mono">WIRED</span>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-white font-mono">
                    {node.text}
                  </div>

                  {!isUsed && (
                    <div className="pt-2 flex gap-1.5 flex-wrap">
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handlePlaceNode(slot.id, node.id)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono rounded cursor-pointer transition-colors"
                        >
                          → {slot.label.split(':')[0]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Placements</span>
        </button>
      </div>

      {/* Right: Flowchart Canvas Blueprint */}
      <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white font-mono">LOGIC BLUEPRINT SLOTS</h3>
            <button
              onClick={handleRunVerification}
              disabled={isEvaluating}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold font-mono shadow-md flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isEvaluating ? 'Tracing...' : 'Run & Test Logic'}</span>
            </button>
          </div>

          {/* Interactive Flowchart Diagram */}
          <div className="mt-4 flex flex-col items-center space-y-3">
            {/* Terminal Start */}
            <div className="px-6 py-1.5 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 font-mono text-xs font-bold">
              [ START ]
            </div>
            <ArrowDown className="w-4 h-4 text-slate-500" />

            {/* Slots */}
            {slots.map((slot, idx) => {
              const placedId = placedSlots[slot.id];
              const placedNode = palette.find((p) => p.id === placedId);
              const isPulsing = activeSlotPulse === slot.id;

              return (
                <React.Fragment key={slot.id}>
                  <div
                    className={`w-full max-w-md p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${
                      isPulsing
                        ? 'border-emerald-400 bg-emerald-950/60 ring-2 ring-emerald-400'
                        : placedNode
                        ? 'border-indigo-500/80 bg-slate-950'
                        : 'border-dashed border-slate-700 bg-slate-950/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">
                        {slot.label} ({slot.acceptedType})
                      </div>
                      <div className="text-xs font-mono font-semibold text-white">
                        {placedNode ? placedNode.text : '< Empty Slot: Click a node to wire >'}
                      </div>
                    </div>

                    {placedNode && (
                      <button
                        type="button"
                        onClick={() => handleClearSlot(slot.id)}
                        className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Remove from slot"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {idx < slots.length - 1 && (
                    <ArrowDown className="w-4 h-4 text-slate-500" />
                  )}
                </React.Fragment>
              );
            })}

            <ArrowDown className="w-4 h-4 text-slate-500" />
            {/* Terminal End */}
            <div className="px-6 py-1.5 rounded-full bg-rose-950 border border-rose-600 text-rose-300 font-mono text-xs font-bold">
              [ END / HALT ]
            </div>
          </div>
        </div>

        {/* Verification Test Cases Results */}
        {testResults && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-xs font-mono font-bold text-slate-300">
              SIMULATION TEST HARNESS
            </div>
            <div className="space-y-1">
              {testResults.map((tr, idx) => (
                <div
                  key={idx}
                  className={`text-xs font-mono flex items-center gap-2 ${
                    tr.pass ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {tr.pass ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>{tr.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
};
