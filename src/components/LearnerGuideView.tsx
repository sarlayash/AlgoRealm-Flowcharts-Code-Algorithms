import React, { useState } from 'react';
import {
  BookOpen,
  GitBranch,
  Layers,
  Zap,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Award,
  Play,
  RotateCcw,
  Sparkles,
  Compass,
  Cpu,
  Search,
  Hash,
  Terminal,
} from 'lucide-react';
import { sound } from '../services/sound';

interface LearnerGuideViewProps {
  onBackToGame: () => void;
  onGoToMap: () => void;
  onOpenCertificate: () => void;
}

type GuideTopic =
  | 'OVERVIEW'
  | 'FLOWCHARTS'
  | 'PROGRAMMING_CONSTRUCTS'
  | 'DATA_STRUCTURES'
  | 'ALGORITHMS'
  | 'BIG_O'
  | 'BADGES_CERTIFICATE';

export const LearnerGuideView: React.FC<LearnerGuideViewProps> = ({
  onBackToGame,
  onGoToMap,
  onOpenCertificate,
}) => {
  const [activeTopic, setActiveTopic] = useState<GuideTopic>('OVERVIEW');

  const topics: { id: GuideTopic; label: string; icon: any }[] = [
    { id: 'OVERVIEW', label: '1. Game & Academy Basics', icon: BookOpen },
    { id: 'FLOWCHARTS', label: '2. Flowchart Architecture', icon: GitBranch },
    { id: 'PROGRAMMING_CONSTRUCTS', label: '3. Core Logic & Commands', icon: Terminal },
    { id: 'DATA_STRUCTURES', label: '4. Data Structures Primer', icon: Layers },
    { id: 'ALGORITHMS', label: '5. Classic Algorithms', icon: Compass },
    { id: 'BIG_O', label: '6. Big-O Complexity', icon: Zap },
    { id: 'BADGES_CERTIFICATE', label: '7. Badges & PNG Certificate', icon: Award },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
            <BookOpen className="w-4 h-4" />
            <span>ALGOREALM LEARNER'S HANDBOOK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Comprehensive Computational Guide
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Everything you need to master all 30 trials: flowchart conventions, control flow,
            memory architectures, asymptotic complexity, and practical tips.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onBackToGame();
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs font-mono shadow-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Resume Trial</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onGoToMap();
            }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors cursor-pointer"
          >
            World Map
          </button>
        </div>
      </div>

      {/* Main Content Layout with Sidebar Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-3 space-y-1">
          <div className="px-3 py-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Handbook Chapters
          </div>
          {topics.map((t) => {
            const Icon = t.icon;
            const isActive = activeTopic === t.id;

            return (
              <button
                key={t.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTopic(t.id);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-medium text-xs flex items-center gap-3 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Topic Content Panel */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          {activeTopic === 'OVERVIEW' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-indigo-400">CHAPTER 01</span>
                <h2 className="text-xl font-bold text-white mt-1">Welcome to AlgoRealm</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  AlgoRealm is an educational video game that teaches programming logic and computer
                  science principles through interactive graphical puzzles across 30 progressive levels.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-indigo-400 font-mono">3-STAR SCORING SYSTEM</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Every level evaluates your algorithmic efficiency. If you solve the puzzle within the
                    <strong> Optimal Step Count</strong>, you earn <strong>3 Gold Stars</strong>.
                    Take extra steps to earn 2 or 1 star.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400 font-mono">2-FAILURE SOLUTION UNLOCK</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Stuck on a challenge? After <strong>2 failed attempts</strong>, the full solution unlocks automatically!
                    Inspect the CS explanation, examine step-by-step commands, or use <strong>Auto-Solve</strong>.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 font-mono">AUTOMATIC CLOUD SAVE</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Your coder name, unlocked levels, stars, badges, and unlock records are automatically saved in
                    your browser's local memory. You can resume anytime!
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white font-mono">THE 3 GAMEPLAY MODES</h3>
                <div className="space-y-2.5">
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Rover Logic Grid</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Assemble instructions from the command palette. Step, turn, check sensors, and
                        watch the live flowchart token pulse as the rover moves through the arena.
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                      <GitBranch className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Flowchart Blueprint Builder</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Assemble standard flowchart shapes (Processes, Decisions, I/O) into designated blueprint
                        slots, then run the automated test harness to verify multiple data inputs.
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Interactive Algorithm Arenas</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Hands-on playgrounds for Binary Search radar, Bubble Sort crane, LIFO Stack, FIFO Queue,
                        Dijkstra shortest path router, and BST In-Order rune traversal.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'FLOWCHARTS' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-indigo-400">CHAPTER 02</span>
                <h2 className="text-xl font-bold text-white mt-1">Flowchart Standards & Geometry</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Flowcharts use internationally standardized geometric shapes to map algorithms before
                  writing code. Here is how each shape functions in AlgoRealm:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 font-mono text-xs font-bold">
                    Terminal Oval / Stadium
                  </div>
                  <h4 className="text-xs font-bold text-white">START / END</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Marks the entry and exit points of an algorithm. Every valid program has exactly one START
                    and at least one END / HALT state.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="inline-block px-3 py-1 rounded-md bg-indigo-950 border border-indigo-500 text-indigo-300 font-mono text-xs font-bold">
                    Process Rectangle
                  </div>
                  <h4 className="text-xs font-bold text-white">Action or Computation</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Represents data manipulation, math calculations, and actions (e.g. <code>Power = Input * 2</code>,
                    <code>Step Forward</code>, or <code>X = X + 1</code>).
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="inline-block px-3 py-1 bg-amber-950 border border-amber-500 text-amber-300 font-mono text-xs font-bold">
                    Decision Diamond
                  </div>
                  <h4 className="text-xs font-bold text-white">Branching Condition (If/Else)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Evaluates a Boolean condition with two exit arrows: <strong>Yes (True)</strong> and <strong>No (False)</strong>.
                    Used for conditional execution and loop termination tests.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="inline-block px-3 py-1 bg-cyan-950 border border-cyan-500 text-cyan-300 font-mono text-xs font-bold">
                    Parallelogram
                  </div>
                  <h4 className="text-xs font-bold text-white">Input / Output</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Indicates receiving external data (reading sensor readings, user input) or producing output
                    (displaying a result, transmitting a network packet).
                  </p>
                </div>
              </div>

              <div className="p-4 bg-indigo-950/40 border border-indigo-500/40 rounded-xl text-xs text-indigo-200 space-y-1">
                <span className="font-bold font-mono">FLOW DIRECTION RULE: </span>
                <span>
                  Flow lines always have direction arrows. Loops occur when an arrow branches backward to an
                  earlier node, creating iteration until a condition diamond tests False.
                </span>
              </div>
            </div>
          )}

          {activeTopic === 'PROGRAMMING_CONSTRUCTS' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-indigo-400">CHAPTER 03</span>
                <h2 className="text-xl font-bold text-white mt-1">Core Logic Constructs & Commands</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Every programming language on Earth is built on three fundamental constructs formulated in the
                  Böhm–Jacopini theorem: <strong>Sequence</strong>, <strong>Selection (If-Else)</strong>, and <strong>Iteration (Loops)</strong>.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-indigo-400 font-mono">1. SEQUENCE</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Instructions execute one after the other in top-down order. In Levels 1 and 6, your rover executes
                    <code>FORWARD</code>, <code>TURN_LEFT</code>, <code>TURN_RIGHT</code>, and <code>COLLECT</code> in exact order.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 font-mono">2. SELECTION (CONDITIONALS)</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Allows the computer to take different actions based on state:
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc pl-5 font-mono">
                    <li><code>IF_WALL_AHEAD</code>: Detects physical obstacles and pivots the rover to avoid crashes.</li>
                    <li><code>IF_GEM_AHEAD</code>: Evaluates if a crystal is present before collecting.</li>
                    <li><code>Boolean Operators</code>: Combining conditions using <code>AND (&amp;&amp;)</code>, <code>OR (||)</code>, and <code>NOT (!)</code>.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 font-mono">3. ITERATION & WHILE LOOPS</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Repeats instructions while a condition is True:
                  </p>
                  <div className="p-3 bg-slate-900 rounded-lg font-mono text-xs text-slate-200">
                    while (not at goal) &#123;<br />
                    &nbsp;&nbsp;stepForward();<br />
                    &#125;
                  </div>
                  <p className="text-xs text-rose-300 mt-1">
                    <strong>Infinite Loop Warning (Level 10):</strong> A loop must modify its control variable
                    (e.g. <code>Counter--</code>) on each pass; otherwise, the condition never changes and the loop freezes!
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-cyan-400 font-mono">4. VARIABLES & REGISTERS</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Named storage slots in memory (e.g. <code>X = 3</code>). Security doors in Realms 1 and 2 check
                    whether the required crystal count matches register value <code>X</code> before granting passage.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'DATA_STRUCTURES' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-indigo-400">CHAPTER 04</span>
                <h2 className="text-xl font-bold text-white mt-1">Data Structures Primer (Realm 3)</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Data structures organize and store data in memory to make operations efficient.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-mono font-bold text-indigo-400">ARRAY (Level 11)</div>
                  <h4 className="text-xs font-bold text-white">Contiguous Memory &amp; Indexing</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Stored in sequential memory addresses. Accessing <code>Array[i]</code> is $O(1)$ constant time because the
                    address is computed mathematically: <code>Base + i * Size</code>.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-mono font-bold text-amber-400">STACK (Level 12)</div>
                  <h4 className="text-xs font-bold text-white">LIFO: Last-In, First-Out</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Like a stack of plates: you can only <code>push()</code> to the top and <code>pop()</code> from the top.
                    Used in function call stacks and browser back buttons.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-mono font-bold text-emerald-400">QUEUE (Level 13)</div>
                  <h4 className="text-xs font-bold text-white">FIFO: First-In, First-Out</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Like a queue at a ticket booth: items enter at the rear (<code>enqueue</code>) and exit at the front
                    (<code>dequeue</code>). Used in print spoolers and OS CPU schedulers.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-mono font-bold text-cyan-400">HASH MAP (Level 14)</div>
                  <h4 className="text-xs font-bold text-white">Key-Value Pairs &amp; Hash Functions</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    A hash function maps keys (like <code>"ADMIN"</code>) to bucket indices, providing average $O(1)$ lookup time
                    for database indexing and caching.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 sm:col-span-2">
                  <div className="text-xs font-mono font-bold text-purple-400">LINKED LIST (Level 15)</div>
                  <h4 className="text-xs font-bold text-white">Nodes &amp; Pointer References</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Unlike arrays, elements are scattered in RAM. Each node holds its data payload plus a pointer
                    (<code>next</code>) pointing to the address of the next node, ending at <code>NULL</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'ALGORITHMS' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-indigo-400">CHAPTER 05</span>
                <h2 className="text-xl font-bold text-white mt-1">Classic Search, Sort &amp; Graph Algorithms</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Realms 4 and 5 immerse you into the foundational algorithms used across industry software.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-mono font-bold text-indigo-400">SEARCHING: LINEAR VS BINARY (Levels 16 &amp; 17)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-1">
                    <div className="p-3 bg-slate-900 rounded-lg">
                      <strong className="text-white">Linear Search $O(n)$:</strong>
                      <p className="text-slate-400 mt-1">Inspects every element from index 0 to $n-1$. Simple, but slow for big data.</p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg">
                      <strong className="text-white">Binary Search $O(\log n)$:</strong>
                      <p className="text-slate-400 mt-1">Requires sorted data. Tests the midpoint and halves the search space every step!</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-mono font-bold text-amber-400">SORTING ALGORITHMS (Levels 18, 19 &amp; 20)</div>
                  <ul className="text-xs text-slate-300 space-y-2 pl-4 list-disc">
                    <li>
                      <strong>Bubble Sort $O(n^2)$:</strong> Compares adjacent elements and swaps them if out of order until
                      all values "bubble" to their sorted position.
                    </li>
                    <li>
                      <strong>Selection Sort $O(n^2)$:</strong> Scans the unsorted partition to find the minimum element,
                      then swaps it to the front.
                    </li>
                    <li>
                      <strong>Merge Sort $O(n \log n)$:</strong> Divide-and-conquer: recursively divides array in halves,
                      sorts them, and merges them back together.
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-mono font-bold text-emerald-400">GRAPH &amp; TREE TRAVERSALS (Levels 21–24)</div>
                  <ul className="text-xs text-slate-300 space-y-2 pl-4 list-disc">
                    <li>
                      <strong>BFS (Breadth-First):</strong> Explores neighbors level by level using a FIFO queue. Finds the
                      shortest path in unweighted networks.
                    </li>
                    <li>
                      <strong>DFS (Depth-First):</strong> Plunges deep down branches before backtracking with a stack.
                    </li>
                    <li>
                      <strong>Dijkstra's Shortest Path:</strong> Solves minimum energy cost across weighted graphs using a priority queue.
                    </li>
                    <li>
                      <strong>BST In-Order Traversal:</strong> Traverses Left Subtree → Root → Right Subtree, visiting elements in
                      strictly ascending mathematical order!
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'BIG_O' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-indigo-400">CHAPTER 06</span>
                <h2 className="text-xl font-bold text-white mt-1">Big-O Computational Complexity (Level 29)</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Big-O notation measures how an algorithm's runtime or memory scales as input size $N$ grows toward infinity.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3">Notation</th>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Ops for $N = 1,000,000$</th>
                      <th className="py-2.5 px-3">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr className="text-emerald-400">
                      <td className="py-2.5 px-3 font-bold">$O(1)$</td>
                      <td className="py-2.5 px-3">Constant</td>
                      <td className="py-2.5 px-3">1 operation</td>
                      <td className="py-2.5 px-3 text-slate-300">Array Index Access</td>
                    </tr>
                    <tr className="text-emerald-300">
                      <td className="py-2.5 px-3 font-bold">$O(\log n)$</td>
                      <td className="py-2.5 px-3">Logarithmic</td>
                      <td className="py-2.5 px-3">≈ 20 operations</td>
                      <td className="py-2.5 px-3 text-slate-300">Binary Search</td>
                    </tr>
                    <tr className="text-indigo-300">
                      <td className="py-2.5 px-3 font-bold">$O(n)$</td>
                      <td className="py-2.5 px-3">Linear</td>
                      <td className="py-2.5 px-3">1,000,000 ops</td>
                      <td className="py-2.5 px-3 text-slate-300">Linear Scan / Loop</td>
                    </tr>
                    <tr className="text-amber-400">
                      <td className="py-2.5 px-3 font-bold">$O(n \log n)$</td>
                      <td className="py-2.5 px-3">Linearithmic</td>
                      <td className="py-2.5 px-3">≈ 20,000,000 ops</td>
                      <td className="py-2.5 px-3 text-slate-300">Merge / Quick Sort</td>
                    </tr>
                    <tr className="text-rose-400">
                      <td className="py-2.5 px-3 font-bold">$O(n^2)$</td>
                      <td className="py-2.5 px-3">Quadratic</td>
                      <td className="py-2.5 px-3">1,000,000,000,000 ops</td>
                      <td className="py-2.5 px-3 text-slate-300">Bubble / Nested Loops</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-amber-400 font-mono">CRITICAL TAKEAWAY FOR LEVEL 29: </span>
                When searching through a million records, an $O(\log n)$ algorithm completes in less than a microsecond,
                whereas an $O(n^2)$ nested loop would freeze your server for hours!
              </div>
            </div>
          )}

          {activeTopic === 'BADGES_CERTIFICATE' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-indigo-400">CHAPTER 07</span>
                <h2 className="text-xl font-bold text-white mt-1">Earning Badges &amp; PNG Certification</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Validate your achievements with 14 unique achievement badges and a high-resolution certificate.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-mono font-bold text-amber-400">14 UNLOCKABLE BADGES</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Earn milestone badges as you conquer specific concepts:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono pt-1 text-slate-300">
                    <div className="p-2 bg-slate-900 rounded">★ Hello World (Lvl 1)</div>
                    <div className="p-2 bg-slate-900 rounded">★ Blueprint Pioneer (Lvl 2)</div>
                    <div className="p-2 bg-slate-900 rounded">★ Diamond Decider (Lvl 3)</div>
                    <div className="p-2 bg-slate-900 rounded">★ Loop Vanguard (Lvl 10)</div>
                    <div className="p-2 bg-slate-900 rounded">★ Stack Master (Lvl 12)</div>
                    <div className="p-2 bg-slate-900 rounded">★ Queue Dispatcher (Lvl 13)</div>
                    <div className="p-2 bg-slate-900 rounded">★ Pointer Weaver (Lvl 15)</div>
                    <div className="p-2 bg-slate-900 rounded">★ Logarithmic Ranger (Lvl 17)</div>
                    <div className="p-2 bg-slate-900 rounded">★ Dijkstra Navigator (Lvl 23)</div>
                    <div className="p-2 bg-slate-900 rounded">★ Asymptotic Titan (Lvl 29)</div>
                    <div className="p-2 bg-slate-900 rounded">★ Grand Architect (Lvl 30)</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs font-mono font-bold text-emerald-400">OFFICIAL PNG CERTIFICATE EXPORT</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Once you complete the trials, you receive an official, high-resolution (2400 x 1600 px) Certificate of
                    Algorithmic Mastery. It features your custom coder name, completion date, star rating, cryptographic seal
                    hash, and authorized signature by **Kapil - Knowledge Multiverse Architect**.
                  </p>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenCertificate();
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs font-mono shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Award className="w-4 h-4" />
                    <span>Preview &amp; Download Certificate (PNG)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
