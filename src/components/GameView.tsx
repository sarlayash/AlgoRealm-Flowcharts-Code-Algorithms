import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Lightbulb, Map, Trash2, Plus, ChevronLeft, ChevronRight, HelpCircle, BookOpen, X, AlertCircle } from 'lucide-react';
import { LevelDefinition, PlayerProfile, CommandBlock, ActionCommandType, Direction } from '../types/game';
import { GameCanvas } from './GameCanvas';
import { FlowchartVisualizer } from './FlowchartVisualizer';
import { FlowchartPuzzleEditor } from './FlowchartPuzzleEditor';
import { AlgorithmPlayground } from './AlgorithmPlayground';
import { SolutionRevealModal } from './SolutionRevealModal';
import { LEVEL_SOLUTIONS } from '../data/solutions';
import { AVATARS } from '../data/avatars';
import { sound } from '../services/sound';

interface GameViewProps {
  level: LevelDefinition;
  profile: PlayerProfile;
  failedAttempts?: number;
  onRecordFailure?: () => void;
  onLevelComplete: (levelId: number, stepsUsed: number) => void;
  onGoToMap: () => void;
  onSelectLevel: (levelId: number) => void;
  onOpenGuide?: () => void;
}

const COMMAND_LABEL_MAP: Record<ActionCommandType, string> = {
  FORWARD: 'Step Forward',
  TURN_LEFT: 'Turn Left 90°',
  TURN_RIGHT: 'Turn Right 90°',
  COLLECT: 'Collect Crystal',
  IF_WALL_AHEAD: 'If Wall Ahead -> Turn Right',
  IF_GEM_AHEAD: 'If Gem Ahead -> Turn Left',
  WHILE_NOT_GOAL: 'While Not At Goal',
  LOOP_START: 'Loop Start',
  LOOP_END: 'Loop End',
  SET_VARIABLE: 'Set Variable X = 1',
  INCREMENT_VARIABLE: 'Increment Register X++',
  DECREMENT_VARIABLE: 'Decrement Counter X--',
  SWAP: 'Swap Items',
  PUSH: 'Push Stone',
  POP: 'Pop Stone',
};

export const GameView: React.FC<GameViewProps> = ({
  level,
  profile,
  failedAttempts,
  onRecordFailure,
  onLevelComplete,
  onGoToMap,
  onSelectLevel,
  onOpenGuide,
}) => {
  // Command sequence for GRID_BOT levels
  const [commands, setCommands] = useState<CommandBlock[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1 = normal, 2 = fast, 4 = turbo
  const [showHint, setShowHint] = useState(false);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // External slots for flowchart puzzle auto-wiring
  const [externalFlowchartSlots, setExternalFlowchartSlots] = useState<Record<string, string> | undefined>(undefined);

  // Internal failed attempts fallback if not supplied by parent
  const [localFailedAttempts, setLocalFailedAttempts] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(`algorealm_fail_lvl_${level.id}`);
      return raw ? parseInt(raw, 10) : 0;
    } catch {
      return 0;
    }
  });

  const currentFailedAttempts = failedAttempts !== undefined ? failedAttempts : localFailedAttempts;

  // Rover Simulation State
  const initialPlayerStart = level.grid?.playerStart || { x: 0, y: 0, dir: 'RIGHT' };
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number; dir: Direction }>(initialPlayerStart);
  const [collectedGems, setCollectedGems] = useState<string[]>([]);
  const [variables, setVariables] = useState<Record<string, number>>(level.grid?.defaultVariables || {});
  const [stepsCount, setStepsCount] = useState(0);

  // Reset simulator state when level changes
  useEffect(() => {
    handleResetSimulation();
    setCommands([]);
    setShowHint(false);
    setIsSolutionModalOpen(false);
    setStatusNotification(null);
    setExternalFlowchartSlots(undefined);
    try {
      const raw = localStorage.getItem(`algorealm_fail_lvl_${level.id}`);
      setLocalFailedAttempts(raw ? parseInt(raw, 10) : 0);
    } catch {
      setLocalFailedAttempts(0);
    }
  }, [level.id]);

  const avatar = AVATARS.find((a) => a.id === profile.avatarId) || AVATARS[0];

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setActiveStepIndex(-1);
    setPlayerPos(level.grid?.playerStart || { x: 0, y: 0, dir: 'RIGHT' });
    setCollectedGems([]);
    setVariables(level.grid?.defaultVariables || {});
    setStepsCount(0);
  };

  const handleRecordFail = (reasonMsg?: string) => {
    sound.playFailure();
    const nextVal = currentFailedAttempts + 1;
    setLocalFailedAttempts(nextVal);
    try {
      localStorage.setItem(`algorealm_fail_lvl_${level.id}`, nextVal.toString());
    } catch {}
    onRecordFailure?.();

    if (nextVal >= 2) {
      setStatusNotification(
        reasonMsg
          ? `${reasonMsg} (Attempt ${nextVal} Failed) — 💡 Solution Unlocked! Click "Reveal Solution" above to view full code & auto-solve.`
          : `Attempt ${nextVal} Failed — 💡 Solution Unlocked! Click "Reveal Solution" above.`
      );
    } else {
      setStatusNotification(
        reasonMsg
          ? `${reasonMsg} (Attempt ${nextVal}/2 Failed — Solution unlocks after 2 failed attempts)`
          : `Attempt ${nextVal}/2 Failed — Solution unlocks after 2 failed attempts.`
      );
    }
  };

  // Add a command block
  const handleAddCommand = (type: ActionCommandType) => {
    if (isSimulating) return;
    sound.playClick();
    setStatusNotification(null);

    const newBlock: CommandBlock = {
      id: `${type}_${Date.now()}_${Math.random()}`,
      type,
      label: COMMAND_LABEL_MAP[type] || type,
      iconName: type,
      color: type.startsWith('IF_') || type.startsWith('WHILE_') ? 'amber' : 'indigo',
    };

    setCommands([...commands, newBlock]);
  };

  const handleRemoveCommand = (idx: number) => {
    if (isSimulating) return;
    sound.playClick();
    setStatusNotification(null);
    setCommands(commands.filter((_, i) => i !== idx));
  };

  const handleClearCommands = () => {
    if (isSimulating) return;
    sound.playClick();
    setStatusNotification(null);
    setCommands([]);
    handleResetSimulation();
  };

  // Execute Rover Steps
  const executeNextStep = (
    currentCommands: CommandBlock[],
    cmdIdx: number,
    currentPos: { x: number; y: number; dir: Direction },
    currentGems: string[],
    currentVars: Record<string, number>,
    totalSteps: number
  ) => {
    if (!level.grid) return;

    // Check goal condition first
    const atGoal = currentPos.x === level.grid.targetGoal.x && currentPos.y === level.grid.targetGoal.y;
    const requiredGems = level.grid.cells.filter((c) => c.type === 'GEM').length;

    if (atGoal) {
      if (currentGems.length >= requiredGems) {
        sound.playSuccess();
        setIsSimulating(false);
        setTimeout(() => {
          onLevelComplete(level.id, totalSteps);
        }, 500);
        return;
      }
    }

    if (cmdIdx >= currentCommands.length) {
      // Reached end of commands
      setIsSimulating(false);
      setActiveStepIndex(-1);

      if (atGoal && currentGems.length >= requiredGems) {
        sound.playSuccess();
        onLevelComplete(level.id, totalSteps);
      } else {
        handleRecordFail(
          !atGoal
            ? 'Execution ended: Rover did not reach the Goal Terminal.'
            : 'Execution ended: Not all required Data Gems were collected.'
        );
      }
      return;
    }

    const cmd = currentCommands[cmdIdx];
    setActiveStepIndex(cmdIdx);
    sound.playFlowchartTick();

    let nextPos = { ...currentPos };
    let nextGems = [...currentGems];
    let nextVars = { ...currentVars };
    let nextCmdIdx = cmdIdx + 1;

    if (cmd.type === 'FORWARD') {
      sound.playStep();
      let dx = 0;
      let dy = 0;
      if (currentPos.dir === 'RIGHT') dx = 1;
      if (currentPos.dir === 'LEFT') dx = -1;
      if (currentPos.dir === 'DOWN') dy = 1;
      if (currentPos.dir === 'UP') dy = -1;

      const targetX = currentPos.x + dx;
      const targetY = currentPos.y + dy;

      // Bounds & Wall check
      const isOutOfBounds =
        targetX < 0 || targetX >= level.grid.width || targetY < 0 || targetY >= level.grid.height;
      const wallCell = level.grid.cells.find((c) => c.x === targetX && c.y === targetY && c.type === 'WALL');

      // Door check
      const doorCell = level.grid.cells.find((c) => c.x === targetX && c.y === targetY && c.type === 'DOOR');
      let doorLocked = false;
      if (doorCell) {
        const req = Number(doorCell.value) || 0;
        const cur = Object.values(nextVars)[0] || 0;
        if (cur < req) doorLocked = true;
      }

      if (isOutOfBounds || wallCell || doorLocked) {
        setIsSimulating(false);
        handleRecordFail(
          doorLocked
            ? `Security Door is locked! Variable register must reach ≥ ${doorCell?.value}.`
            : isOutOfBounds
            ? 'Collision detected! Rover attempted to march outside grid boundary.'
            : 'Collision detected! Rover crashed into a fortress wall block.'
        );
        return;
      }

      nextPos.x = targetX;
      nextPos.y = targetY;
    } else if (cmd.type === 'TURN_LEFT') {
      sound.playRotate();
      const leftRot: Record<Direction, Direction> = {
        UP: 'LEFT',
        LEFT: 'DOWN',
        DOWN: 'RIGHT',
        RIGHT: 'UP',
      };
      nextPos.dir = leftRot[currentPos.dir];
    } else if (cmd.type === 'TURN_RIGHT') {
      sound.playRotate();
      const rightRot: Record<Direction, Direction> = {
        UP: 'RIGHT',
        RIGHT: 'DOWN',
        DOWN: 'LEFT',
        LEFT: 'UP',
      };
      nextPos.dir = rightRot[currentPos.dir];
    } else if (cmd.type === 'COLLECT') {
      sound.playCollect();
      const gemKey = `${currentPos.x},${currentPos.y}`;
      const isGemHere = level.grid.cells.some(
        (c) => c.x === currentPos.x && c.y === currentPos.y && c.type === 'GEM'
      );
      if (isGemHere && !nextGems.includes(gemKey)) {
        nextGems.push(gemKey);
        // Automatically increment primary variable if level uses variable collection
        if (Object.keys(nextVars).length > 0) {
          const varName = Object.keys(nextVars)[0];
          nextVars[varName] = (nextVars[varName] || 0) + 1;
        }
      }
    } else if (cmd.type === 'INCREMENT_VARIABLE') {
      sound.playClick();
      const varName = Object.keys(nextVars)[0] || 'X';
      nextVars[varName] = (nextVars[varName] || 0) + 1;
    } else if (cmd.type === 'DECREMENT_VARIABLE') {
      sound.playClick();
      const varName = Object.keys(nextVars)[0] || 'Counter';
      nextVars[varName] = Math.max((nextVars[varName] || 0) - 1, 0);
    } else if (cmd.type === 'IF_WALL_AHEAD') {
      sound.playClick();
      let dx = 0;
      let dy = 0;
      if (currentPos.dir === 'RIGHT') dx = 1;
      if (currentPos.dir === 'LEFT') dx = -1;
      if (currentPos.dir === 'DOWN') dy = 1;
      if (currentPos.dir === 'UP') dy = -1;
      const tx = currentPos.x + dx;
      const ty = currentPos.y + dy;
      const isWall =
        tx < 0 || tx >= level.grid.width || ty < 0 || ty >= level.grid.height;
      if (isWall) {
        const rightRot: Record<Direction, Direction> = {
          UP: 'RIGHT',
          RIGHT: 'DOWN',
          DOWN: 'LEFT',
          LEFT: 'UP',
        };
        nextPos.dir = rightRot[currentPos.dir];
      }
    } else if (cmd.type === 'WHILE_NOT_GOAL') {
      const isAtGoal = currentPos.x === level.grid.targetGoal.x && currentPos.y === level.grid.targetGoal.y;
      if (!isAtGoal) {
        let dx = 0;
        let dy = 0;
        if (currentPos.dir === 'RIGHT') dx = 1;
        if (currentPos.dir === 'LEFT') dx = -1;
        if (currentPos.dir === 'DOWN') dy = 1;
        if (currentPos.dir === 'UP') dy = -1;
        nextPos.x = currentPos.x + dx;
        nextPos.y = currentPos.y + dy;
        if (nextPos.x !== level.grid.targetGoal.x || nextPos.y !== level.grid.targetGoal.y) {
          nextCmdIdx = cmdIdx;
        }
      }
    }

    setPlayerPos(nextPos);
    setCollectedGems(nextGems);
    setVariables(nextVars);
    setStepsCount(totalSteps + 1);

    const delay = Math.max(450 / simSpeed, 120);

    setTimeout(() => {
      executeNextStep(
        currentCommands,
        nextCmdIdx,
        nextPos,
        nextGems,
        nextVars,
        totalSteps + 1
      );
    }, delay);
  };

  const handleStartSimulation = () => {
    if (commands.length === 0) {
      sound.playFailure();
      setStatusNotification('Add instructions from the command palette below before running the algorithm!');
      return;
    }
    sound.playClick();
    setStatusNotification(null);
    handleResetSimulation();
    setIsSimulating(true);

    setTimeout(() => {
      executeNextStep(
        commands,
        0,
        level.grid?.playerStart || { x: 0, y: 0, dir: 'RIGHT' },
        [],
        level.grid?.defaultVariables || {},
        0
      );
    }, 200);
  };

  // Auto-Solve & Load Handler triggered from SolutionRevealModal
  const handleApplySolutionAndSolve = () => {
    const sol = LEVEL_SOLUTIONS[level.id];
    if (!sol) return;

    if (level.mode === 'GRID_BOT' && sol.gridCommands) {
      const blocks: CommandBlock[] = sol.gridCommands.map((cmdType, idx) => ({
        id: `sol_${cmdType}_${idx}_${Date.now()}`,
        type: cmdType,
        label: COMMAND_LABEL_MAP[cmdType] || cmdType,
        iconName: cmdType,
        color: cmdType.startsWith('IF_') || cmdType.startsWith('WHILE_') ? 'amber' : 'indigo',
      }));
      setCommands(blocks);
      handleResetSimulation();
      setStatusNotification('✓ Applied optimal solution sequence! Auto-solving trial...');
      setTimeout(() => {
        onLevelComplete(level.id, sol.gridCommands!.length);
      }, 700);
    } else if (level.mode === 'FLOWCHART_BUILDER' && sol.flowchartSlots) {
      setExternalFlowchartSlots(sol.flowchartSlots);
      setStatusNotification('✓ Auto-wired flowchart solution! All unit tests verified.');
      setTimeout(() => {
        onLevelComplete(level.id, level.optimalSteps);
      }, 700);
    } else if (level.mode === 'ALGORITHM_ARENA') {
      setStatusNotification('✓ Executed optimal algorithm solution sequence!');
      setTimeout(() => {
        onLevelComplete(level.id, level.optimalSteps);
      }, 600);
    }
  };

  const handleLoadSolutionIntoPalette = () => {
    const sol = LEVEL_SOLUTIONS[level.id];
    if (!sol) return;

    if (level.mode === 'GRID_BOT' && sol.gridCommands) {
      const blocks: CommandBlock[] = sol.gridCommands.map((cmdType, idx) => ({
        id: `sol_load_${cmdType}_${idx}_${Date.now()}`,
        type: cmdType,
        label: COMMAND_LABEL_MAP[cmdType] || cmdType,
        iconName: cmdType,
        color: cmdType.startsWith('IF_') || cmdType.startsWith('WHILE_') ? 'amber' : 'indigo',
      }));
      setCommands(blocks);
      handleResetSimulation();
      setStatusNotification('✓ Loaded solution commands into palette! Click "Execute Algorithm" to run.');
    } else if (level.mode === 'FLOWCHART_BUILDER' && sol.flowchartSlots) {
      setExternalFlowchartSlots(sol.flowchartSlots);
      setStatusNotification('✓ Loaded solution blueprint into flowchart slots! Click "Run & Test Logic" to verify.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Level Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
              TRIAL {level.id} / 30
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Realm {level.realmNumber}: {level.realmName}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {level.title}
          </h1>

          <div className="text-xs text-indigo-300 font-mono">
            Core Concept: <span className="font-semibold text-white">{level.concept}</span>
          </div>
        </div>

        {/* Level Navigation & Shortcut Controls */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end flex-wrap">
          {/* Solution Reveal Button */}
          <button
            onClick={() => {
              sound.playClick();
              setIsSolutionModalOpen(true);
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              currentFailedAttempts >= 2
                ? 'border-amber-400 bg-amber-950/70 text-amber-200 font-bold shadow-lg shadow-amber-950/50 hover:bg-amber-900/70 animate-pulse'
                : 'border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400'
            }`}
            title={
              currentFailedAttempts >= 2
                ? 'Solution Unlocked after 2 failed attempts!'
                : `Solution unlocks after 2 failed attempts (${currentFailedAttempts}/2)`
            }
          >
            <Lightbulb
              className={`w-3.5 h-3.5 ${
                currentFailedAttempts >= 2 ? 'fill-amber-400 text-amber-300' : 'text-slate-500'
              }`}
            />
            <span>
              {currentFailedAttempts >= 2
                ? '💡 Reveal Solution'
                : `Solution (${currentFailedAttempts}/2)`}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setShowHint(!showHint);
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
              showHint
                ? 'border-amber-400 bg-amber-950/60 text-amber-200'
                : 'border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Hint</span>
          </button>

          {onOpenGuide && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenGuide();
              }}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-indigo-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Learner Guide</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onGoToMap();
            }}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Map className="w-3.5 h-3.5 text-indigo-400" />
            <span>All Levels</span>
          </button>

          {/* Quick Prev / Next Level */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                sound.playClick();
                if (level.id > 1) onSelectLevel(level.id - 1);
              }}
              disabled={level.id <= 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-40"
              title="Previous Level"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                if (level.id < 30 && level.id < profile.unlockedLevel) {
                  onSelectLevel(level.id + 1);
                }
              }}
              disabled={level.id >= 30 || level.id >= profile.unlockedLevel}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-40"
              title="Next Level"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Solution Unlocked Alert Banner */}
      {currentFailedAttempts >= 2 && (
        <div className="p-4 bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/70 border border-amber-500/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Lightbulb className="w-5 h-5 fill-amber-400/30" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-amber-300 flex items-center gap-2">
                <span>💡 SOLUTION UNLOCKED FOR LEVEL {level.id}</span>
                <span className="text-[10px] px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-700/50 rounded-full font-mono">
                  {currentFailedAttempts} Failed Attempts Recorded
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Step-by-step algorithmic explanation and automated solution blueprint are now unlocked.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => {
                sound.playClick();
                setIsSolutionModalOpen(true);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs font-mono shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Lightbulb className="w-3.5 h-3.5 fill-slate-950" />
              <span>Reveal Solution & Auto-Solve</span>
            </button>
          </div>
        </div>
      )}

      {/* Status / Error Toast Notification */}
      {statusNotification && (
        <div className="p-3 bg-slate-900/95 border border-amber-500/40 text-slate-200 rounded-xl text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in shadow-md">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{statusNotification}</span>
          </div>
          <button
            onClick={() => setStatusNotification(null)}
            className="p-1 text-slate-400 hover:text-white rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Optional Hint Drawer */}
      {showHint && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-start gap-3 animate-in fade-in duration-150">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold font-mono">TACTICAL HINT: </span>
            {level.hint}
          </div>
        </div>
      )}

      {/* Main Mode Renderers */}
      {level.mode === 'GRID_BOT' && level.grid && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Game Canvas & Visual Trace */}
          <div className="lg:col-span-6 space-y-4">
            <GameCanvas
              width={level.grid.width}
              height={level.grid.height}
              cells={level.grid.cells}
              playerPos={playerPos}
              collectedGems={collectedGems}
              variables={variables}
              activeStepIndex={activeStepIndex}
              isSimulating={isSimulating}
              avatarColor={avatar.color}
              avatarId={avatar.id}
            />

            {/* Live Register & Status Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Position:</span>
                <span className="text-white font-bold">
                  ({playerPos.x}, {playerPos.y}) · {playerPos.dir}
                </span>
              </div>

              {Object.keys(variables).length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Registers:</span>
                  {Object.entries(variables).map(([k, v]) => (
                    <span
                      key={k}
                      className="px-2 py-0.5 bg-indigo-950 border border-indigo-800 rounded text-indigo-300 font-bold"
                    >
                      {k} = {v}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Crystals:</span>
                <span className="text-amber-400 font-bold">
                  {collectedGems.length} /{' '}
                  {level.grid.cells.filter((c) => c.type === 'GEM').length}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Execution Controls, Palette & Flowchart Wire */}
          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
            {/* Simulation Speed & Controls */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartSimulation}
                  disabled={isSimulating}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg text-xs font-mono shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{isSimulating ? 'Running...' : 'Execute Algorithm'}</span>
                </button>

                <button
                  onClick={handleResetSimulation}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors cursor-pointer"
                  title="Reset Arena"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                {[1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSimSpeed(spd)}
                    className={`px-2 py-1 rounded transition-colors ${
                      simSpeed === spd
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Flowchart Diagram Visualization */}
            <div className="h-64">
              <FlowchartVisualizer
                commands={commands}
                activeCommandIndex={activeStepIndex}
                isSimulating={isSimulating}
              />
            </div>

            {/* Instruction Command Blocks Palette */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-300">COMMAND PALETTE</span>
                <button
                  onClick={handleClearCommands}
                  disabled={isSimulating || commands.length === 0}
                  className="text-slate-500 hover:text-rose-400 disabled:opacity-30 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {level.grid.allowedCommands.map((cmdType) => (
                  <button
                    key={cmdType}
                    onClick={() => handleAddCommand(cmdType)}
                    disabled={isSimulating}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500 text-slate-200 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <Plus className="w-3 h-3 text-indigo-400" />
                    <span>{cmdType}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode: Flowchart Builder Puzzle */}
      {level.mode === 'FLOWCHART_BUILDER' && level.flowchartPuzzle && (
        <FlowchartPuzzleEditor
          puzzle={level.flowchartPuzzle}
          externalPlacedSlots={externalFlowchartSlots}
          failedAttempts={currentFailedAttempts}
          onFailAttempt={() => handleRecordFail('Flowchart verification failed')}
          onOpenSolution={() => setIsSolutionModalOpen(true)}
          onSuccess={(steps) => onLevelComplete(level.id, steps)}
        />
      )}

      {/* Mode: Algorithm Arenas */}
      {level.mode === 'ALGORITHM_ARENA' && level.algoArena && (
        <AlgorithmPlayground
          config={level.algoArena}
          failedAttempts={currentFailedAttempts}
          onFailAttempt={() => handleRecordFail('Algorithmic operation failed')}
          onSuccess={(steps) => onLevelComplete(level.id, steps)}
        />
      )}

      {/* Solution Reveal Modal */}
      <SolutionRevealModal
        isOpen={isSolutionModalOpen}
        onClose={() => setIsSolutionModalOpen(false)}
        level={level}
        failedAttempts={currentFailedAttempts}
        onApplyAndSolve={handleApplySolutionAndSolve}
        onLoadIntoWorkspace={handleLoadSolutionIntoPalette}
      />
    </div>
  );
};
