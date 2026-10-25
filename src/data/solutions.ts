import { LevelSolution } from '../types/game';

export const LEVEL_SOLUTIONS: Record<number, LevelSolution> = {
  1: {
    explanation: 'Step forward to the crystal, collect it, move forward once more, turn right 90°, and advance 2 steps straight into the goal terminal.',
    gridCommands: ['FORWARD', 'COLLECT', 'FORWARD', 'TURN_RIGHT', 'FORWARD', 'FORWARD'],
  },
  2: {
    explanation: 'Standard flowchart sequence: 1) Read Input Number (I/O) -> 2) Calculate: Energy = Input * 2 (Process) -> 3) Display: Energy Output (I/O) -> End.',
    flowchartSlots: {
      slot_1: 'node_p2',
      slot_2: 'node_p1',
      slot_3: 'node_p3',
    },
  },
  3: {
    explanation: 'Conditional routing: Move forward, turn left into the crystal alcove, collect the gem, turn around, return to the main hallway, turn left, and walk straight to the goal.',
    gridCommands: ['FORWARD', 'TURN_LEFT', 'FORWARD', 'COLLECT', 'TURN_RIGHT', 'TURN_RIGHT', 'FORWARD', 'TURN_LEFT', 'FORWARD', 'FORWARD'],
  },
  4: {
    explanation: 'Instead of writing 6 separate forward instructions, use the WHILE_NOT_GOAL looping construct to step continuously until the goal portal is reached.',
    gridCommands: ['WHILE_NOT_GOAL'],
  },
  5: {
    explanation: 'Advance forward through the 3 crystal nodes, collecting each to increment Register X to 3. The security barrier req >= 3 unlocks, allowing you to turn right into the exit.',
    gridCommands: ['FORWARD', 'COLLECT', 'FORWARD', 'COLLECT', 'FORWARD', 'COLLECT', 'TURN_RIGHT', 'FORWARD', 'FORWARD'],
  },
  6: {
    explanation: 'Nested matrix sweep: Step forward, collect gem, turn left, step up a row, turn right, and repeat this zigzag sweep until you reach the upper goal balcony.',
    gridCommands: ['FORWARD', 'COLLECT', 'TURN_LEFT', 'FORWARD', 'TURN_RIGHT', 'FORWARD', 'COLLECT', 'TURN_LEFT', 'FORWARD', 'TURN_RIGHT', 'FORWARD', 'COLLECT', 'TURN_LEFT', 'FORWARD'],
  },
  7: {
    explanation: 'Sensor guard: Move forward along the corridor. At each corner, the IF_WALL_AHEAD sensor automatically pivots the rover right 90°, preventing boundary crashes.',
    gridCommands: ['FORWARD', 'FORWARD', 'IF_WALL_AHEAD', 'FORWARD', 'FORWARD', 'IF_WALL_AHEAD', 'FORWARD', 'FORWARD'],
  },
  8: {
    explanation: 'Compound Boolean Logic: Slot 1 tests if (Sensor_A AND Sensor_B) is active. If not, Slot 2 tests if Override Key is provided. If verified, Slot 3 unlocks the security airlock door.',
    flowchartSlots: {
      slot_1: 'b_dec1',
      slot_2: 'b_dec2',
      slot_3: 'b_proc',
    },
  },
  9: {
    explanation: 'Switch Router: Case 1 checks Type == 1 (HTTP Port 80), Case 2 checks Type == 2 (HTTPS Port 443), and the default fallback routes to Backup Port 8080.',
    flowchartSlots: {
      slot_1: 'sw_1',
      slot_2: 'sw_2',
      slot_3: 'sw_def',
    },
  },
  10: {
    explanation: 'Infinite Loop Debugger: On each iteration, you must decrement the loop counter (X--) alongside collecting the crystals so the condition reaches zero and halts cleanly.',
    gridCommands: ['FORWARD', 'COLLECT', 'DECREMENT_VARIABLE', 'FORWARD', 'FORWARD', 'COLLECT', 'DECREMENT_VARIABLE', 'FORWARD'],
  },
  11: {
    explanation: 'Array Memory Access: Step sequentially through the indexed array conveyor [0, 1, 2, 3, 4], collecting the data payload gems at Arr[2] and Arr[4].',
    gridCommands: ['FORWARD', 'FORWARD', 'COLLECT', 'FORWARD', 'FORWARD', 'COLLECT', 'FORWARD'],
  },
  12: {
    explanation: 'Stack (LIFO): Push stones 10, 25, 40 into the tower. Then execute POP() three times: stones exit in reverse order [40, 25, 10] to balance the reactor.',
    algoStepsDescription: [
      'Click Push(10)',
      'Click Push(25)',
      'Click Push(40)',
      'Click POP() to extract Stone 40',
      'Click POP() to extract Stone 25',
      'Click POP() to extract Stone 10',
    ],
  },
  13: {
    explanation: 'Queue (FIFO): Enqueue jobs 101, 102, 103, 104 in order of arrival. Then dequeue them one by one from the front of the line.',
    algoStepsDescription: [
      'Enqueue jobs 101, 102, 103, 104',
      'Click DEQUEUE() to process Job 101',
      'Click DEQUEUE() to process Job 102',
      'Click DEQUEUE() to process Job 103',
      'Click DEQUEUE() to process Job 104',
    ],
  },
  14: {
    explanation: 'Hash Map: Insert keys ADMIN, CIPHER, AUTH, ROOT. The hash function ASCII_SUM(Key) % 4 maps each key into its corresponding bucket in O(1) time.',
    algoStepsDescription: [
      'Click Insert Key "ADMIN"',
      'Click Insert Key "CIPHER"',
      'Click Insert Key "AUTH"',
      'Click Insert Key "ROOT"',
    ],
  },
  15: {
    explanation: 'Linked List Pointers: Connect the memory addresses sequentially: Head (0x10) -> Node A (0x24) -> Node B (0x3C) -> Tail (0x50) -> NULL.',
    algoStepsDescription: [
      'Click "Link Next" on Head',
      'Click "Link Next" on Node A',
      'Click "Link Next" on Node B',
    ],
  },
  16: {
    explanation: 'Linear Search: Step forward sequentially along the memory cells until finding Target Key 42 at index 3, then collect it and proceed to the exit.',
    gridCommands: ['FORWARD', 'FORWARD', 'FORWARD', 'COLLECT', 'FORWARD', 'FORWARD', 'FORWARD'],
  },
  17: {
    explanation: 'Binary Search: Inspect the midpoint value. Mid index 5 holds value 47, which matches the target immediately in O(log n) time!',
    algoStepsDescription: [
      'Click "Probe Mid & Discard Half"',
      'Mid (47) == Target (47). Target locked immediately in O(log n)!',
    ],
  },
  18: {
    explanation: 'Bubble Sort Crane: Compare adjacent canister pairs. Whenever the left value is greater than the right value, click "Swap Elements" until sorted [10, 20, 30, 40, 50].',
    algoStepsDescription: [
      'Compare adjacent canisters',
      'Click Swap when Left > Right',
      'Advance pairs until all elements are in ascending order',
    ],
  },
  19: {
    explanation: 'Selection Sort: Scan the unsorted section for the minimum element: 11 (swap to pos 0), 12 (swap to pos 1), 22 (pos 2), 25 (pos 3), 64.',
    algoStepsDescription: [
      'Click Rune 11 (minimum of unsorted list)',
      'Click Rune 12',
      'Click Rune 22',
      'Click Rune 25',
      'Click Rune 64 - Sort complete!',
    ],
  },
  20: {
    explanation: 'Merge Sort: Compare Left[i] <= Right[j]. If true, append Left[i] to merged; otherwise append Right[j] to merged.',
    flowchartSlots: {
      slot_1: 'm_dec',
      slot_2: 'm_left',
      slot_3: 'm_right',
    },
  },
  21: {
    explanation: 'Breadth-First Search: Take the shortest radial path: 2 steps forward, turn right, 1 step forward, turn left, 2 steps forward to the power station.',
    gridCommands: ['FORWARD', 'FORWARD', 'TURN_RIGHT', 'FORWARD', 'TURN_LEFT', 'FORWARD', 'FORWARD'],
  },
  22: {
    explanation: 'Depth-First Search: Move forward, turn left down the dead-end branch to collect the gem, turn around (two turns), backtrack to the junction, turn left, and exit.',
    gridCommands: ['FORWARD', 'TURN_LEFT', 'FORWARD', 'COLLECT', 'TURN_LEFT', 'TURN_LEFT', 'FORWARD', 'TURN_LEFT', 'FORWARD', 'FORWARD'],
  },
  23: {
    explanation: 'Dijkstra Shortest Path: Route power from A to B (cost 3), then from B to D (cost 2). Total cumulative cost is 5, strictly cheaper than path A-C-D (cost 7).',
    algoStepsDescription: [
      'Click "Conduit A → B (Cost 3)"',
      'Click "Conduit B → D (Cost 2) [Goal]" - Total Cost: 5 (Optimal)',
    ],
  },
  24: {
    explanation: 'BST In-Order Traversal: In-order traversal visits Left Subtree -> Root -> Right Subtree, harvesting values in strictly ascending numerical order.',
    algoStepsDescription: [
      'Click Rune 5 (Leftmost leaf)',
      'Click Rune 10 (Left child root)',
      'Click Rune 15 (Right child of 10)',
      'Click Rune 20 (Tree root)',
      'Click Rune 30 (Right subtree) - Traversal complete!',
    ],
  },
  25: {
    explanation: 'Memory Safety: Check if pointer != NULL -> Read data buffer at address -> Call free(ptr) and set ptr = NULL to prevent memory leaks.',
    flowchartSlots: {
      slot_1: 'mem_chk',
      slot_2: 'mem_read',
      slot_3: 'mem_free',
    },
  },
  26: {
    explanation: 'Recursive Mirror: Leap according to Fibonacci sequence: 1 forward step and collect F(1)=1, 1 forward step and collect F(2)=1, 2 forward steps to reach F(3)=2 at the gate.',
    gridCommands: ['FORWARD', 'COLLECT', 'FORWARD', 'COLLECT', 'FORWARD', 'FORWARD', 'FORWARD'],
  },
  27: {
    explanation: 'Dynamic Programming: Bypass high-cost traps (Cost 100) by taking 2-stone leaps over pillars 1 and 5 to minimize cumulative energy.',
    algoStepsDescription: [
      'Click "Jump 2 Stones" (Skips trap Pillar 1)',
      'Click "Jump 1 Stone" to Pillar 3',
      'Click "Jump 1 Stone" to Pillar 4',
      'Click "Jump 2 Stones" (Skips trap Pillar 5) - Sanctuary reached with minimal cost!',
    ],
  },
  28: {
    explanation: 'Bitwise Masking: Apply bitwise mask (Input & 0b0100) -> Check if Mask != 0 -> Enable Reactor Laser Core.',
    flowchartSlots: {
      slot_1: 'bit_mask',
      slot_2: 'bit_chk',
      slot_3: 'bit_act',
    },
  },
  29: {
    explanation: 'Big-O Complexity: For N = 1,000,000 items, O(log N) logarithmic search completes in ~20 operations, beating the countdown timer easily.',
    algoStepsDescription: [
      'Select "O(log N) - Logarithmic (Binary Search Tree Query)"',
    ],
  },
  30: {
    explanation: 'Grand Architect Synthesis: Move through the master matrix collecting all 3 variable prisms. Once Crystals reach 3, the security gate drops, allowing passage to the final goal portal.',
    gridCommands: ['FORWARD', 'COLLECT', 'FORWARD', 'FORWARD', 'COLLECT', 'TURN_RIGHT', 'FORWARD', 'FORWARD', 'COLLECT', 'TURN_RIGHT', 'FORWARD', 'FORWARD'],
  },
};
