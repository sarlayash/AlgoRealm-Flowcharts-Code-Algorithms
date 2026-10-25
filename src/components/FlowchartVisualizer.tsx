import React from 'react';
import { CommandBlock } from '../types/game';

interface FlowchartVisualizerProps {
  commands: CommandBlock[];
  activeCommandIndex: number;
  isSimulating: boolean;
}

export const FlowchartVisualizer: React.FC<FlowchartVisualizerProps> = ({
  commands,
  activeCommandIndex,
  isSimulating,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          <span>LIVE FLOWCHART EXECUTION TRACE</span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          {commands.length} Blocks Wired
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
        {/* Terminal Start Oval */}
        <div className="flex flex-col items-center">
          <div className="px-5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-600/80 text-emerald-300 text-xs font-mono font-bold shadow-sm">
            [ START ]
          </div>
          <FlowArrow />
        </div>

        {/* Commands converted to flowchart standard shapes */}
        {commands.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 font-mono italic">
            No commands added yet. Drag or tap command blocks to build your flowchart algorithm!
          </div>
        ) : (
          commands.map((cmd, idx) => {
            const isActive = isSimulating && activeCommandIndex === idx;
            const isDecision = cmd.type.startsWith('IF_') || cmd.type.startsWith('WHILE_');

            return (
              <div key={cmd.id} className="flex flex-col items-center">
                {isDecision ? (
                  // Decision Diamond Shape
                  <div
                    className={`relative w-44 py-3 px-2 border-2 transition-all flex items-center justify-center text-center text-xs font-mono ${
                      isActive
                        ? 'border-amber-400 bg-amber-950/80 text-amber-200 scale-105 shadow-lg shadow-amber-500/20'
                        : 'border-amber-600/60 bg-amber-950/30 text-amber-300'
                    }`}
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                    }}
                  >
                    <span className="max-w-[100px] text-[10px] leading-tight font-bold">
                      {cmd.label} ?
                    </span>
                  </div>
                ) : (
                  // Process Rectangle Shape
                  <div
                    className={`w-44 py-2.5 px-3 rounded-md border text-center text-xs font-mono font-medium transition-all shadow-sm ${
                      isActive
                        ? 'border-indigo-400 bg-indigo-950 text-indigo-100 scale-105 shadow-md shadow-indigo-500/30'
                        : 'border-slate-700 bg-slate-950/80 text-slate-300'
                    }`}
                  >
                    <div className="truncate font-semibold">{cmd.label}</div>
                  </div>
                )}

                {/* Arrow down to next block */}
                {idx < commands.length - 1 && <FlowArrow />}
              </div>
            );
          })
        )}

        {/* Terminal End Oval */}
        {commands.length > 0 && (
          <div className="flex flex-col items-center pt-1">
            <FlowArrow />
            <div className="px-5 py-1.5 rounded-full bg-rose-950/80 border border-rose-600/80 text-rose-300 text-xs font-mono font-bold shadow-sm">
              [ END / HALT ]
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FlowArrow = () => (
  <div className="flex flex-col items-center my-0.5 opacity-60">
    <div className="w-0.5 h-3 bg-slate-600"></div>
    <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[5px] border-t-slate-500"></div>
  </div>
);
