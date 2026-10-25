export type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';

export type ActionCommandType =
  | 'FORWARD'
  | 'TURN_LEFT'
  | 'TURN_RIGHT'
  | 'COLLECT'
  | 'IF_WALL_AHEAD'
  | 'IF_GEM_AHEAD'
  | 'WHILE_NOT_GOAL'
  | 'LOOP_START'
  | 'LOOP_END'
  | 'SET_VARIABLE'
  | 'INCREMENT_VARIABLE'
  | 'DECREMENT_VARIABLE'
  | 'SWAP'
  | 'PUSH'
  | 'POP';

export interface CommandBlock {
  id: string;
  type: ActionCommandType;
  label: string;
  iconName: string;
  color: string;
  param?: string | number;
  condition?: string;
  childCommands?: CommandBlock[];
}

export type LevelCategory =
  | 'SEQUENTIAL_LOGIC'
  | 'FLOWCHART_WIRING'
  | 'DECISION_BRANCHING'
  | 'LOOPING_CONSTRUCTS'
  | 'VARIABLES_MEMORY'
  | 'DATA_STRUCTURES'
  | 'SEARCH_ALGORITHMS'
  | 'SORTING_ALGORITHMS'
  | 'GRAPH_ALGORITHMS'
  | 'TREE_TRAVERSAL'
  | 'ADVANCED_SYNTHESIS';

export type GameMode =
  | 'GRID_BOT'
  | 'FLOWCHART_BUILDER'
  | 'ALGORITHM_ARENA';

export interface GridCell {
  x: number;
  y: number;
  type: 'EMPTY' | 'WALL' | 'GOAL' | 'GEM' | 'DOOR' | 'SWITCH' | 'SPIKE' | 'CONVEYOR';
  isCollected?: boolean;
  isOpen?: boolean;
  value?: number | string;
}

export interface FlowchartNode {
  id: string;
  type: 'START' | 'PROCESS' | 'DECISION' | 'INPUT_OUTPUT' | 'END';
  text: string;
  x?: number;
  y?: number;
  yesNext?: string;
  noNext?: string;
  next?: string;
  condition?: string;
  action?: string;
}

export interface FlowchartPuzzleConfig {
  nodes: FlowchartNode[];
  slotNodes?: {
    id: string;
    acceptedType: string;
    label: string;
    placedNodeId?: string;
  }[];
  paletteNodes: {
    id: string;
    type: 'PROCESS' | 'DECISION' | 'INPUT_OUTPUT';
    text: string;
    condition?: string;
    action?: string;
  }[];
  testCases: {
    input: any;
    expectedOutput: any;
    label: string;
  }[];
}

export interface AlgoArenaConfig {
  subType:
    | 'BINARY_SEARCH'
    | 'BUBBLE_SORT'
    | 'SELECTION_SORT'
    | 'STACK_LIFO'
    | 'QUEUE_FIFO'
    | 'HASH_MAP'
    | 'LINKED_LIST'
    | 'DIJKSTRA_GRAPH'
    | 'BST_TRAVERSAL'
    | 'DYNAMIC_PROGRAMMING'
    | 'BIG_O_RACE';
  targetValue?: number;
  initialArray?: number[];
  nodes?: { id: string; label: string; x: number; y: number; val?: number }[];
  edges?: { from: string; to: string; weight: number }[];
  startNodeId?: string;
  targetNodeId?: string;
}

export interface LevelSolution {
  explanation: string;
  gridCommands?: ActionCommandType[];
  flowchartSlots?: Record<string, string>;
  algoStepsDescription?: string[];
}

export interface LevelDefinition {
  id: number;
  title: string;
  realmNumber: number;
  realmName: string;
  category: LevelCategory;
  mode: GameMode;
  concept: string;
  description: string;
  instructions: string;
  hint: string;
  learningFact: string;
  optimalSteps: number;
  grid?: {
    width: number;
    height: number;
    cells: GridCell[];
    playerStart: { x: number; y: number; dir: Direction };
    targetGoal: { x: number; y: number };
    maxCodeBlocks?: number;
    allowedCommands: ActionCommandType[];
    defaultVariables?: Record<string, number>;
  };
  flowchartPuzzle?: FlowchartPuzzleConfig;
  algoArena?: AlgoArenaConfig;
  solution?: LevelSolution;
}

export interface PlayerProfile {
  name: string;
  avatarId: string;
  unlockedLevel: number;
  stars: Record<number, number>; // levelId -> stars (1-3)
  bestSteps: Record<number, number>;
  completedLevels: number[];
  badges: string[];
  totalScore: number;
  startedAt: string;
  lastPlayedAt: string;
  completedAt?: string;
  soundEnabled: boolean;
  musicEnabled: boolean;
}

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredLevel?: number;
  specialCondition?: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}

export interface HeroAvatar {
  id: string;
  name: string;
  title: string;
  description: string;
  color: string;
  secondaryColor: string;
  svgHead: string;
}
