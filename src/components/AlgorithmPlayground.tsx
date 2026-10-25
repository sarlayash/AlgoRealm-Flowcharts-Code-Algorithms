import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Check, ArrowRight, Shield, Layers, Link as LinkIcon, Crosshair, ArrowDownUp, Compass, Network, Zap } from 'lucide-react';
import { AlgoArenaConfig } from '../types/game';
import { sound } from '../services/sound';

interface AlgorithmPlaygroundProps {
  config: AlgoArenaConfig;
  onSuccess: (stepsUsed: number) => void;
  onFailAttempt?: () => void;
  failedAttempts?: number;
}

export const AlgorithmPlayground: React.FC<AlgorithmPlaygroundProps> = ({
  config,
  onSuccess,
  onFailAttempt,
  failedAttempts = 0,
}) => {
  const { subType } = config;

  if (subType === 'BINARY_SEARCH') {
    return <BinarySearchGame config={config} onSuccess={onSuccess} onFailAttempt={onFailAttempt} />;
  }
  if (subType === 'BUBBLE_SORT') {
    return <BubbleSortGame config={config} onSuccess={onSuccess} onFailAttempt={onFailAttempt} />;
  }
  if (subType === 'SELECTION_SORT') {
    return <SelectionSortGame config={config} onSuccess={onSuccess} onFailAttempt={onFailAttempt} />;
  }
  if (subType === 'STACK_LIFO') {
    return <StackLifoGame config={config} onSuccess={onSuccess} onFailAttempt={onFailAttempt} />;
  }
  if (subType === 'QUEUE_FIFO') {
    return <QueueFifoGame config={config} onSuccess={onSuccess} onFailAttempt={onFailAttempt} />;
  }
  if (subType === 'HASH_MAP') {
    return <HashMapGame config={config} onSuccess={onSuccess} onFailAttempt={onFailAttempt} />;
  }
  if (subType === 'LINKED_LIST') {
    return <LinkedListGame config={config} onSuccess={onSuccess} onFailAttempt={onFailAttempt} />;
  }
  if (subType === 'DIJKSTRA_GRAPH') {
    return <DijkstraGame config={config} onSuccess={onSuccess} onFailAttempt={onFailAttempt} />;
  }
  if (subType === 'BST_TRAVERSAL') {
    return <BstTraversalGame config={config} onSuccess={onSuccess} onFailAttempt={onFailAttempt} />;
  }
  if (subType === 'DYNAMIC_PROGRAMMING') {
    return <DynamicProgrammingGame config={config} onSuccess={onSuccess} onFailAttempt={onFailAttempt} />;
  }
  if (subType === 'BIG_O_RACE') {
    return <BigORaceGame config={config} onSuccess={onSuccess} onFailAttempt={onFailAttempt} />;
  }

  return <div>Unknown Arena Type</div>;
};

// =========================================================================
// 1. BINARY SEARCH RADAR
// =========================================================================
const BinarySearchGame: React.FC<{
  config: AlgoArenaConfig;
  onSuccess: (s: number) => void;
  onFailAttempt?: () => void;
}> = ({ config, onSuccess, onFailAttempt }) => {
  const arr = config.initialArray || [3, 9, 14, 22, 35, 47, 58, 66, 73, 85, 91, 99];
  const target = config.targetValue || 47;

  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(arr.length - 1);
  const [stepCount, setStepCount] = useState(0);
  const [isFound, setIsFound] = useState(false);

  const mid = Math.floor((low + high) / 2);
  const midVal = arr[mid];

  const handleInspectMid = () => {
    sound.playClick();
    setStepCount((s) => s + 1);

    if (midVal === target) {
      sound.playSuccess();
      setIsFound(true);
      setTimeout(() => onSuccess(stepCount + 1), 600);
    } else if (midVal < target) {
      sound.playStep();
      setLow(mid + 1);
    } else {
      sound.playStep();
      setHigh(mid - 1);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setLow(0);
    setHigh(arr.length - 1);
    setStepCount(0);
    setIsFound(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-mono text-indigo-400">RADAR FREQUENCY TARGETING</div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-indigo-400" />
            <span>Target Value to Locate: {target}</span>
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-slate-300">
            Operations: <span className="text-amber-400 font-bold">{stepCount}</span>
          </div>
          <button
            onClick={handleReset}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Array Cells */}
      <div className="space-y-3">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
          {arr.map((val, idx) => {
            const inRange = idx >= low && idx <= high;
            const isMid = idx === mid;
            const isTarget = isFound && val === target;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isTarget
                    ? 'border-emerald-400 bg-emerald-950 text-emerald-200 ring-2 ring-emerald-400 scale-105'
                    : isMid
                    ? 'border-amber-400 bg-amber-950/60 text-amber-200 scale-105 ring-1 ring-amber-400'
                    : inRange
                    ? 'border-indigo-500/40 bg-slate-950 text-white'
                    : 'border-slate-800 bg-slate-950/30 text-slate-600 opacity-30'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-500">[{idx}]</div>
                <div className="text-base font-bold font-mono">{val}</div>
                {isMid && inRange && (
                  <div className="text-[9px] font-mono text-amber-400 font-bold mt-1">MID</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-xs font-mono text-slate-400 px-1">
          <div>Low Index: {low}</div>
          <div className="text-amber-400 font-bold">Mid Index: {mid} (Value: {midVal})</div>
          <div>High Index: {high}</div>
        </div>
      </div>

      {/* Decision Prompt */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs font-mono text-slate-300">
          Current Comparison:{' '}
          <span className="font-bold text-white">
            Mid Value ({midVal}) {midVal === target ? '==' : midVal < target ? '<' : '>'} Target ({target})
          </span>
        </div>

        <button
          onClick={handleInspectMid}
          disabled={isFound}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs font-mono shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{isFound ? 'Target Locked!' : 'Probe Mid & Discard Half'}</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 2. BUBBLE SORT CRANE
// =========================================================================
const BubbleSortGame: React.FC<{
  config: AlgoArenaConfig;
  onSuccess: (s: number) => void;
  onFailAttempt?: () => void;
}> = ({ config, onSuccess, onFailAttempt }) => {
  const initial = config.initialArray || [50, 20, 40, 10, 30];
  const [array, setArray] = useState<number[]>([...initial]);
  const [cursor, setCursor] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const isSorted = array.every((v, i, a) => !i || a[i - 1] <= v);

  const handleNextPair = () => {
    sound.playClick();
    if (cursor < array.length - 2) {
      setCursor(cursor + 1);
    } else {
      setCursor(0);
    }
  };

  const handleSwap = () => {
    sound.playStep();
    const nextArr = [...array];
    const temp = nextArr[cursor];
    nextArr[cursor] = nextArr[cursor + 1];
    nextArr[cursor + 1] = temp;
    setArray(nextArr);
    setSwaps(swaps + 1);

    if (nextArr.every((v, i, a) => !i || a[i - 1] <= v)) {
      sound.playSuccess();
      setTimeout(() => onSuccess(swaps + 1), 600);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-mono text-indigo-400">MECHANICAL SORTING CRANE</div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowDownUp className="w-5 h-5 text-indigo-400" />
            <span>Bubble Sort Adjacent Elements</span>
          </h3>
        </div>
        <div className="text-xs font-mono text-slate-300">
          Swaps: <span className="text-amber-400 font-bold">{swaps}</span>
        </div>
      </div>

      {/* Visual Bars */}
      <div className="h-44 flex items-end justify-center gap-4 bg-slate-950 p-6 rounded-xl border border-slate-800">
        {array.map((val, idx) => {
          const isActivePair = idx === cursor || idx === cursor + 1;
          const heightPx = Math.max(val * 2.2, 24);

          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className="text-xs font-mono text-slate-400 font-bold">{val}</span>
              <div
                className={`w-14 rounded-t-lg transition-all ${
                  isActivePair
                    ? 'bg-indigo-500 shadow-lg shadow-indigo-500/40'
                    : 'bg-slate-700'
                }`}
                style={{ height: `${heightPx}px` }}
              ></div>
              <span className="text-[10px] font-mono text-slate-500">Idx {idx}</span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs font-mono text-slate-400">
          Inspecting pair: [{array[cursor]}] and [{array[cursor + 1]}].
          {array[cursor] > array[cursor + 1] ? (
            <span className="text-amber-400 font-bold"> Out of order! Swap needed.</span>
          ) : (
            <span className="text-emerald-400 font-bold"> In order. Advance crane.</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleNextPair}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors"
          >
            Advance Pair
          </button>
          <button
            onClick={handleSwap}
            disabled={isSorted}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs font-mono shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>Swap Elements</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. SELECTION SORT HARVESTER
// =========================================================================
const SelectionSortGame: React.FC<{
  config: AlgoArenaConfig;
  onSuccess: (s: number) => void;
  onFailAttempt?: () => void;
}> = ({ config, onSuccess, onFailAttempt }) => {
  const initial = config.initialArray || [64, 25, 12, 22, 11];
  const [array, setArray] = useState<number[]>([...initial]);
  const [sortedIndex, setSortedIndex] = useState(0);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const isSorted = array.every((v, i, a) => !i || a[i - 1] <= v);

  const handlePickMin = (idx: number) => {
    sound.playClick();
    setErrorNotice(null);
    // Verify if idx is indeed the minimum in array[sortedIndex...]
    const remaining = array.slice(sortedIndex);
    const trueMin = Math.min(...remaining);

    if (array[idx] === trueMin) {
      sound.playStep();
      const nextArr = [...array];
      const temp = nextArr[sortedIndex];
      nextArr[sortedIndex] = nextArr[idx];
      nextArr[idx] = temp;
      setArray(nextArr);
      const nextSorted = sortedIndex + 1;
      setSortedIndex(nextSorted);

      if (nextArr.every((v, i, a) => !i || a[i - 1] <= v)) {
        sound.playSuccess();
        setTimeout(() => onSuccess(nextSorted), 600);
      }
    } else {
      sound.playFailure();
      setErrorNotice(`Value ${array[idx]} is not the minimum in the unsorted range! Look closely.`);
      onFailAttempt?.();
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      {errorNotice && (
        <div className="p-3 bg-rose-950/70 border border-rose-500/40 text-rose-200 rounded-xl text-xs font-mono animate-in fade-in">
          ⚠️ {errorNotice}
        </div>
      )}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-mono text-indigo-400">SELECTION SORT HARVESTER</div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowDownUp className="w-5 h-5 text-indigo-400" />
            <span>Find Minimum & Swap to Position {sortedIndex}</span>
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {array.map((val, idx) => {
          const isSortedPart = idx < sortedIndex;

          return (
            <button
              key={idx}
              onClick={() => handlePickMin(idx)}
              disabled={isSortedPart || isSorted}
              className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                isSortedPart
                  ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300'
                  : 'border-slate-700 bg-slate-950 hover:border-indigo-400 hover:bg-slate-900 text-white'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-500">Idx {idx}</div>
              <div className="text-2xl font-bold font-mono my-2">{val}</div>
              <div className="text-[10px] font-mono font-semibold">
                {isSortedPart ? '✓ SORTED' : 'CLICK IF MIN'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 4. STACK LIFO TOWER
// =========================================================================
const StackLifoGame: React.FC<{
  config: AlgoArenaConfig;
  onSuccess: (s: number) => void;
  onFailAttempt?: () => void;
}> = ({ onSuccess, onFailAttempt }) => {
  const [stack, setStack] = useState<number[]>([]);
  const [popped, setPopped] = useState<number[]>([]);
  const goalPopped = [40, 25, 10]; // Popped in reverse of push [10, 25, 40]

  const handlePush = (val: number) => {
    sound.playClick();
    if (stack.length < 3) {
      setStack([...stack, val]);
    }
  };

  const handlePop = () => {
    sound.playStep();
    if (stack.length > 0) {
      const top = stack[stack.length - 1];
      const nextStack = stack.slice(0, -1);
      const nextPopped = [...popped, top];
      setStack(nextStack);
      setPopped(nextPopped);

      if (
        nextPopped.length === 3 &&
        nextPopped.every((v, i) => v === goalPopped[i])
      ) {
        sound.playSuccess();
        setTimeout(() => onSuccess(6), 600);
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <div className="text-xs font-mono text-indigo-400">LIFO DATA STRUCTURE</div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>Last-In, First-Out (LIFO) Stack Tower</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Push values [10, 25, 40] into the stack, then POP them out. Notice they exit in reverse order!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        {/* Stack Tower Container */}
        <div className="w-48 mx-auto h-56 border-x-4 border-b-4 border-slate-700 bg-slate-950/60 rounded-b-xl flex flex-col-reverse p-2 gap-2 relative">
          <div className="absolute top-2 left-0 right-0 text-center text-[10px] font-mono text-slate-500">
            STACK TOP ↑
          </div>
          {stack.map((v, i) => (
            <div
              key={i}
              className="w-full py-3 bg-indigo-600 rounded-lg text-center font-mono font-bold text-white text-sm shadow-md"
            >
              Stone {v}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400">Push to Stack:</div>
            <div className="flex gap-2">
              {[10, 25, 40].map((v) => (
                <button
                  key={v}
                  onClick={() => handlePush(v)}
                  disabled={stack.includes(v) || popped.includes(v)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-lg text-xs font-mono cursor-pointer transition-colors"
                >
                  Push({v})
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400">Pop from Stack:</div>
            <button
              onClick={handlePop}
              disabled={stack.length === 0}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-lg text-xs font-mono font-bold shadow-md cursor-pointer transition-colors"
            >
              POP() Top Element
            </button>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Popped Order: [{popped.join(', ')}]
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 5. QUEUE FIFO PIPELINE
// =========================================================================
const QueueFifoGame: React.FC<{
  config: AlgoArenaConfig;
  onSuccess: (s: number) => void;
  onFailAttempt?: () => void;
}> = ({
  onSuccess,
  onFailAttempt,
}) => {
  const [queue, setQueue] = useState<number[]>([]);
  const [dispatched, setDispatched] = useState<number[]>([]);
  const jobs = [101, 102, 103, 104];

  const handleEnqueue = (j: number) => {
    sound.playClick();
    if (!queue.includes(j) && !dispatched.includes(j)) {
      setQueue([...queue, j]);
    }
  };

  const handleDequeue = () => {
    sound.playStep();
    if (queue.length > 0) {
      const front = queue[0];
      const nextQueue = queue.slice(1);
      const nextDisp = [...dispatched, front];
      setQueue(nextQueue);
      setDispatched(nextDisp);

      if (nextDisp.length === jobs.length) {
        sound.playSuccess();
        setTimeout(() => onSuccess(6), 600);
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <div className="text-xs font-mono text-indigo-400">FIFO DATA STRUCTURE</div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-indigo-400" />
          <span>First-In, First-Out (FIFO) Job Queue</span>
        </h3>
      </div>

      {/* Visual Queue Conveyor */}
      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2 overflow-x-auto min-h-[90px]">
        <div className="text-xs font-mono text-emerald-400 shrink-0">FRONT (EXIT) ←</div>
        <div className="flex gap-2">
          {queue.map((item, idx) => (
            <div
              key={idx}
              className="px-4 py-2.5 bg-indigo-600 rounded-lg text-white font-mono font-bold text-xs shadow-md shrink-0"
            >
              Job #{item}
            </div>
          ))}
          {queue.length === 0 && (
            <span className="text-xs text-slate-600 font-mono italic">Queue is empty</span>
          )}
        </div>
        <div className="text-xs font-mono text-slate-500 shrink-0">← REAR (ENTRY)</div>
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          {jobs.map((j) => (
            <button
              key={j}
              onClick={() => handleEnqueue(j)}
              disabled={queue.includes(j) || dispatched.includes(j)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-mono rounded-lg transition-colors cursor-pointer"
            >
              Enqueue(#{j})
            </button>
          ))}
        </div>

        <button
          onClick={handleDequeue}
          disabled={queue.length === 0}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-mono font-bold rounded-lg shadow-md cursor-pointer transition-colors"
        >
          DEQUEUE() First Job
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 6. HASH MAP
// =========================================================================
const HashMapGame: React.FC<{
  config: AlgoArenaConfig;
  onSuccess: (s: number) => void;
  onFailAttempt?: () => void;
}> = ({ onSuccess, onFailAttempt }) => {
  const keys = ['ADMIN', 'CIPHER', 'AUTH', 'ROOT'];
  // Hash function: Sum of ASCII codes % 4
  const [buckets, setBuckets] = useState<Record<number, string[]>>({ 0: [], 1: [], 2: [], 3: [] });

  const getHash = (k: string) => {
    let sum = 0;
    for (let i = 0; i < k.length; i++) sum += k.charCodeAt(i);
    return sum % 4;
  };

  const handleInsert = (key: string) => {
    sound.playClick();
    const h = getHash(key);
    setBuckets((prev) => {
      const next = { ...prev, [h]: [...(prev[h] || []), key] };
      const totalInserted = Object.values(next).flat().length;
      if (totalInserted === keys.length) {
        sound.playSuccess();
        setTimeout(() => onSuccess(4), 600);
      }
      return next;
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <div className="text-xs font-mono text-indigo-400">HASH TABLE ENGINE</div>
        <h3 className="text-xl font-bold text-white">Hash Function & Buckets</h3>
        <p className="text-xs text-slate-400 mt-1">
          Compute Hash(Key) = ASCII_SUM(Key) % 4 to index keys into O(1) lookup buckets.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((bIdx) => (
          <div key={bIdx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-mono text-amber-400 font-bold">Bucket [{bIdx}]</div>
            <div className="min-h-[60px] space-y-1">
              {buckets[bIdx].map((k, i) => (
                <div key={i} className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-white">
                  {k}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {keys.map((k) => {
          const inserted = Object.values(buckets).flat().includes(k);
          return (
            <button
              key={k}
              onClick={() => handleInsert(k)}
              disabled={inserted}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-xs font-mono cursor-pointer transition-colors"
            >
              Insert Key "{k}"
            </button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 7. LINKED LIST POINTER BRIDGE
// =========================================================================
const LinkedListGame: React.FC<{
  config: AlgoArenaConfig;
  onSuccess: (s: number) => void;
  onFailAttempt?: () => void;
}> = ({ config, onSuccess, onFailAttempt }) => {
  const nodes = config.nodes || [
    { id: 'head', label: 'Head', x: 0, y: 0, val: 5 },
    { id: 'node_a', label: 'Node A', x: 0, y: 0, val: 15 },
    { id: 'node_b', label: 'Node B', x: 0, y: 0, val: 30 },
    { id: 'tail', label: 'Tail', x: 0, y: 0, val: 60 },
  ];

  const [links, setLinks] = useState<string[]>([]);

  const handleConnect = (fromId: string) => {
    sound.playClick();
    if (!links.includes(fromId)) {
      const nextLinks = [...links, fromId];
      setLinks(nextLinks);

      if (nextLinks.length === nodes.length - 1) {
        sound.playSuccess();
        setTimeout(() => onSuccess(4), 600);
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <div className="text-xs font-mono text-indigo-400">POINTER DATA STRUCTURE</div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-indigo-400" />
          <span>Singly Linked List Pointer Chain</span>
        </h3>
      </div>

      <div className="flex items-center justify-center gap-3 py-6 overflow-x-auto">
        {nodes.map((node, idx) => {
          const isConnected = links.includes(node.id);

          return (
            <React.Fragment key={node.id}>
              <div className="p-4 bg-slate-950 border border-indigo-500/50 rounded-xl text-center space-y-1.5 shrink-0 min-w-[100px]">
                <div className="text-[10px] font-mono text-slate-400">{node.label}</div>
                <div className="text-lg font-mono font-bold text-white">Val: {node.val}</div>
                {idx < nodes.length - 1 && (
                  <button
                    onClick={() => handleConnect(node.id)}
                    disabled={isConnected}
                    className={`mt-2 px-2 py-1 text-[10px] font-mono rounded transition-colors ${
                      isConnected
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                    }`}
                  >
                    {isConnected ? 'Linked →' : 'Link Next'}
                  </button>
                )}
              </div>

              {idx < nodes.length - 1 && (
                <div className="text-slate-600 font-mono font-bold text-lg">→</div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// 8. DIJKSTRA GRAPH ROUTER
// =========================================================================
const DijkstraGame: React.FC<{
  config: AlgoArenaConfig;
  onSuccess: (s: number) => void;
  onFailAttempt?: () => void;
}> = ({ onSuccess, onFailAttempt }) => {
  const [selectedPath, setSelectedPath] = useState<string[]>(['A']);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const totalCost = selectedPath.reduce((acc, curr, idx) => {
    if (idx === 0) return 0;
    const prev = selectedPath[idx - 1];
    if (prev === 'A' && curr === 'B') return acc + 3;
    if (prev === 'A' && curr === 'C') return acc + 6;
    if (prev === 'B' && curr === 'D') return acc + 2;
    if (prev === 'C' && curr === 'D') return acc + 1;
    if (prev === 'B' && curr === 'C') return acc + 1;
    return acc + 10;
  }, 0);

  const handleStepTo = (node: string) => {
    sound.playClick();
    setErrorNotice(null);
    const nextPath = [...selectedPath, node];
    setSelectedPath(nextPath);

    if (node === 'D') {
      // Optimal path is A -> B -> D (3+2=5) or A -> B -> C -> D (3+1+1=5)
      if (totalCost + (nextPath[nextPath.length - 2] === 'B' ? 2 : 1) <= 5) {
        sound.playSuccess();
        setTimeout(() => onSuccess(3), 600);
      } else {
        sound.playFailure();
        setErrorNotice('Path completed, but there is a shorter weighted path! Try again.');
        onFailAttempt?.();
        setSelectedPath(['A']);
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      {errorNotice && (
        <div className="p-3 bg-rose-950/70 border border-rose-500/40 text-rose-200 rounded-xl text-xs font-mono animate-in fade-in">
          ⚠️ {errorNotice}
        </div>
      )}
      <div className="border-b border-slate-800 pb-3">
        <div className="text-xs font-mono text-indigo-400">GRAPH SHORTEST PATH</div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-400" />
          <span>Dijkstra Shortest Energy Conduit</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Route power from Source [A] to Target [D] with the minimum cumulative edge resistance.
        </p>
      </div>

      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex justify-center items-center gap-6">
        <div className="text-center font-mono">
          <div className="text-xs text-slate-400">Current Route:</div>
          <div className="text-lg font-bold text-amber-400 mt-1">{selectedPath.join(' → ')}</div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        {selectedPath[selectedPath.length - 1] === 'A' && (
          <>
            <button
              onClick={() => handleStepTo('B')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-mono"
            >
              Conduit A → B (Cost 3)
            </button>
            <button
              onClick={() => handleStepTo('C')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-mono"
            >
              Conduit A → C (Cost 6)
            </button>
          </>
        )}
        {selectedPath[selectedPath.length - 1] === 'B' && (
          <>
            <button
              onClick={() => handleStepTo('D')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold"
            >
              Conduit B → D (Cost 2) [Goal]
            </button>
            <button
              onClick={() => handleStepTo('C')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-mono"
            >
              Conduit B → C (Cost 1)
            </button>
          </>
        )}
        {selectedPath[selectedPath.length - 1] === 'C' && (
          <button
            onClick={() => handleStepTo('D')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold"
          >
            Conduit C → D (Cost 1) [Goal]
          </button>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 9. BST TRAVERSAL
// =========================================================================
const BstTraversalGame: React.FC<{
  config: AlgoArenaConfig;
  onSuccess: (s: number) => void;
  onFailAttempt?: () => void;
}> = ({ onSuccess, onFailAttempt }) => {
  const [visited, setVisited] = useState<number[]>([]);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const targetInOrder = [5, 10, 15, 20, 30];

  const handlePickRune = (val: number) => {
    sound.playClick();
    setErrorNotice(null);
    const nextVisited = [...visited, val];
    setVisited(nextVisited);

    const isCorrectSoFar = nextVisited.every((v, i) => v === targetInOrder[i]);
    if (!isCorrectSoFar) {
      sound.playFailure();
      setErrorNotice('Invalid In-Order sequence! Remember: Left Subtree -> Root -> Right Subtree.');
      onFailAttempt?.();
      setVisited([]);
      return;
    }

    if (nextVisited.length === targetInOrder.length) {
      sound.playSuccess();
      setTimeout(() => onSuccess(5), 600);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      {errorNotice && (
        <div className="p-3 bg-rose-950/70 border border-rose-500/40 text-rose-200 rounded-xl text-xs font-mono animate-in fade-in">
          ⚠️ {errorNotice}
        </div>
      )}
      <div className="border-b border-slate-800 pb-3">
        <div className="text-xs font-mono text-indigo-400">TREE DATA STRUCTURE</div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Network className="w-5 h-5 text-indigo-400" />
          <span>BST In-Order Rune Traversal</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Collect runes in ascending numerical order (Left subtree → Root → Right subtree).
        </p>
      </div>

      <div className="flex justify-center gap-3">
        {[5, 10, 15, 20, 30].map((val) => {
          const isDone = visited.includes(val);
          return (
            <button
              key={val}
              onClick={() => handlePickRune(val)}
              disabled={isDone}
              className={`p-4 rounded-xl border font-mono font-bold text-lg transition-all cursor-pointer ${
                isDone
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 opacity-60'
                  : 'border-slate-700 bg-slate-950 hover:border-amber-400 text-white'
              }`}
            >
              Rune {val}
            </button>
          );
        })}
      </div>

      <div className="text-xs font-mono text-center text-slate-400">
        Collected Sequence: [{visited.join(', ')}]
      </div>
    </div>
  );
};

// =========================================================================
// 10. DYNAMIC PROGRAMMING
// =========================================================================
const DynamicProgrammingGame: React.FC<{
  config: AlgoArenaConfig;
  onSuccess: (s: number) => void;
  onFailAttempt?: () => void;
}> = ({ onSuccess, onFailAttempt }) => {
  const costs = [1, 100, 1, 1, 1, 100, 1];
  const [currentStep, setCurrentStep] = useState(0);
  const [totalCost, setTotalCost] = useState(costs[0]);

  const handleJump = (steps: number) => {
    sound.playClick();
    const nextIdx = currentStep + steps;
    if (nextIdx >= costs.length) {
      sound.playSuccess();
      setTimeout(() => onSuccess(4), 600);
      return;
    }
    setCurrentStep(nextIdx);
    setTotalCost((c) => c + costs[nextIdx]);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <div className="text-xs font-mono text-indigo-400">DYNAMIC PROGRAMMING</div>
        <h3 className="text-xl font-bold text-white">Min-Cost Stepping Stones</h3>
        <p className="text-xs text-slate-400 mt-1">
          Leap 1 or 2 stones forward to bypass high-cost traps (Cost 100) and minimize total energy spent.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto py-4">
        {costs.map((c, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg border text-center shrink-0 min-w-[70px] ${
              i === currentStep
                ? 'border-amber-400 bg-amber-950 text-amber-200 ring-2 ring-amber-400'
                : 'border-slate-800 bg-slate-950 text-slate-300'
            }`}
          >
            <div className="text-[10px] font-mono text-slate-500">Pillar {i}</div>
            <div className={`text-base font-bold font-mono ${c > 50 ? 'text-rose-400' : ''}`}>
              Cost {c}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-slate-300">
          Total Spent: <span className="text-amber-400 font-bold">{totalCost}</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleJump(1)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-mono"
          >
            Jump 1 Stone
          </button>
          <button
            onClick={() => handleJump(2)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-mono"
          >
            Jump 2 Stones
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 11. BIG-O TIME RACE
// =========================================================================
const BigORaceGame: React.FC<{
  config: AlgoArenaConfig;
  onSuccess: (s: number) => void;
  onFailAttempt?: () => void;
}> = ({ onSuccess, onFailAttempt }) => {
  const [selectedAlgo, setSelectedAlgo] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleSelect = (complexity: string) => {
    sound.playClick();
    setErrorNotice(null);
    setSelectedAlgo(complexity);
    if (complexity === 'LOG_N') {
      sound.playSuccess();
      setTimeout(() => onSuccess(3), 600);
    } else {
      sound.playFailure();
      setErrorNotice('Time limit exceeded! Quadratic or factorial algorithms cannot scale to 1,000,000 items.');
      onFailAttempt?.();
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      {errorNotice && (
        <div className="p-3 bg-rose-950/70 border border-rose-500/40 text-rose-200 rounded-xl text-xs font-mono animate-in fade-in">
          ⚠️ {errorNotice}
        </div>
      )}
      <div className="border-b border-slate-800 pb-3">
        <div className="text-xs font-mono text-indigo-400">COMPUTATIONAL COMPLEXITY</div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-400" />
          <span>Big-O Asymptotic Time Race</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          The database has N = 1,000,000 rows. Pick the algorithm that computes before timeout!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => handleSelect('N_SQUARED')}
          className="p-4 bg-slate-950 border border-slate-800 hover:border-rose-500 rounded-xl text-left space-y-2 cursor-pointer transition-colors"
        >
          <div className="text-xs font-mono text-rose-400 font-bold">O(N²) - Quadratic</div>
          <div className="text-sm font-bold text-white">Nested Loop Brute Force</div>
          <div className="text-[11px] text-slate-400 font-mono">Operations: 1,000,000,000,000</div>
        </button>

        <button
          onClick={() => handleSelect('LOG_N')}
          className="p-4 bg-slate-950 border border-indigo-500/60 hover:border-emerald-400 rounded-xl text-left space-y-2 cursor-pointer transition-colors glow-active"
        >
          <div className="text-xs font-mono text-emerald-400 font-bold">O(log N) - Logarithmic</div>
          <div className="text-sm font-bold text-white">Binary Search Tree Query</div>
          <div className="text-[11px] text-slate-400 font-mono">Operations: ≈ 20 ops</div>
        </button>

        <button
          onClick={() => handleSelect('FACTORIAL')}
          className="p-4 bg-slate-950 border border-slate-800 hover:border-rose-500 rounded-xl text-left space-y-2 cursor-pointer transition-colors"
        >
          <div className="text-xs font-mono text-rose-400 font-bold">O(N!) - Factorial</div>
          <div className="text-sm font-bold text-white">All Permutations Check</div>
          <div className="text-[11px] text-slate-400 font-mono">Operations: Heat Death of Universe</div>
        </button>
      </div>
    </div>
  );
};
