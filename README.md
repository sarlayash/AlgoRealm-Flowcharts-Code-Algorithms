# AlgoRealm: Flowcharts, Code & Algorithms

[![Deploy to GitHub Pages](https://github.com/sarlayash/AlgoRealm-Flowcharts-Code-Algorithms/actions/workflows/deploy.yml/badge.svg)](https://github.com/sarlayash/AlgoRealm-Flowcharts-Code-Algorithms/actions/workflows/deploy.yml)
[![Live Game](https://img.shields.io/badge/Live-Play%20Game-indigo.svg)](https://sarlayash.github.io/AlgoRealm-Flowcharts-Code-Algorithms/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> An interactive, 30-level video game web application that teaches programming fundamentals, flowchart architecture, data structures, and computational algorithms—from basics to advanced. Includes 14 unlockable achievement badges and an official high-resolution Certificate of Algorithmic Mastery downloadable directly in **PNG format**.

---

## 🎮 The Gameplay Experience

AlgoRealm is not a passive quiz or text-based question app. It is a **full-fledged video game**:
- **Rover Logic Grid Engine**: Program and guide algorithmic rovers across grid dungeons with directional orientations, sensors, lasers, doors, and energy crystals.
- **Live Flowchart Execution Tracer**: Real-time animated flowchart diagram tracing execution with standard geometric nodes (terminal start/end ovals, process rectangles, decision diamonds) with a pulsing execution token.
- **Interactive Flowchart Blueprint Wire**: Assemble flowchart nodes into logic blueprints to pass automated unit testing harnesses.
- **Algorithm Playgrounds**:
  - **Binary Search Radar**: Lock onto target frequencies in $O(\log n)$ comparisons.
  - **Bubble Sort Crane**: Swap adjacent weight canisters with animated mechanical cranes.
  - **Selection Sort Harvester**: Locate minimum elements and partition sorted subarrays.
  - **LIFO Stack Tower**: Push energy blocks and pop in reverse order.
  - **FIFO Queue Pipeline**: Dispatch jobs in precise arrival order.
  - **Dijkstra Shortest Path Router**: Calculate cumulative edge resistance across graph grids.
  - **BST Rune In-Order Collector**: Collect runes in ascending mathematical order.
  - **Dynamic Programming Stone Jumper**: Memoize transitions to minimize total energy spent.
  - **Big-O Asymptotic Time Race**: Choose optimal time complexities to beat countdown limits.
- **Synthesized Web Audio Engine**: Retro 8-bit sound effects (steps, turns, gem pickups, flowchart ticks, fanfares, buzzers, and ambient synth arpeggiator) running 100% client-side with no external audio dependencies.

---

## 🗺️ The 30 Algorithmic Levels

### Realm 1: Logic Genesis (Levels 1–5)
- **Level 1**: *Hello World: The First Sequence* — Sequential command execution
- **Level 2**: *The Flowchart Blueprint* — Constructing Start, Process, Input/Output, and End nodes
- **Level 3**: *The Decision Diamond* — If-Else conditional branching based on sensor inputs
- **Level 4**: *Loop of Eternity* — While loops and iteration to avoid redundant code
- **Level 5**: *The Variable Crystal* — Registers, state modification, and unlock conditions

### Realm 2: Control Flow Citadel (Levels 6–10)
- **Level 6**: *Nested Matrix Patrol* — Outer and inner loop sweeps
- **Level 7**: *The While Sensor Sentinel* — Environmental collision avoidance & corner turns
- **Level 8**: *The Boolean Logic Gate Matrix* — Compound truth tables (AND, OR, NOT)
- **Level 9**: *Switch Router: Packet Dispatch* — Multi-way case branching
- **Level 10**: *Infinite Loop Escape* — Loop invariants and bugfix deconstruction

### Realm 3: Data Structure Caverns (Levels 11–15)
- **Level 11**: *The Array Conveyor Belt* — Zero-indexed contiguous memory access
- **Level 12**: *The LIFO Stack Tower* — Last-In, First-Out push & pop mechanics
- **Level 13**: *The FIFO Queue Pipeline* — First-In, First-Out task dispatching
- **Level 14**: *The Hash Map Key Vault* — Hash functions ($ASCII \% 4$) and bucket allocation
- **Level 15**: *The Linked List Pointer Bridge* — Singly linked nodes and pointer references

### Realm 4: Algorithm Arenas (Levels 16–20)
- **Level 16**: *The Linear Search Scan* — Sequential probing in $O(n)$
- **Level 17**: *The Binary Search Radar* — Logarithmic range splitting in $O(\log n)$
- **Level 18**: *The Bubble Sort Crane* — Adjacent comparison & swapping in $O(n^2)$
- **Level 19**: *The Selection Sort Harvester* — Minimum finding and position swapping
- **Level 20**: *Divide & Conquer: The Merge Bridge* — Merging two sorted subarrays in $O(n \log n)$

### Realm 5: Graph & Memory Labyrinths (Levels 21–25)
- **Level 21**: *Breadth-First Search (BFS)* — Level-order radial wavefront navigation
- **Level 22**: *Depth-First Search (DFS)* — Branch exploration & call-stack backtracking
- **Level 23**: *Dijkstra’s Shortest Energy Path* — Priority queue weighted graph routing
- **Level 24**: *The Binary Search Tree Rune Collector* — BST In-Order traversal (Left → Root → Right)
- **Level 25**: *The Memory Allocator & Garbage Collector* — Heap allocation, NULL checks, and free

### Realm 6: Grand Master Synthesis (Levels 26–30)
- **Level 26**: *The Recursive Mirror Maze* — Fibonacci base cases and recursive steps
- **Level 27**: *The Dynamic Programming Vault* — Min-cost path memoization
- **Level 28**: *The Bitwise Laser Array* — Bit masks (`&`, `|`, `^`) and binary flag checking
- **Level 29**: *The Big-O Asymptotic Time Race* — Scalability showdown ($O(\log n)$ vs $O(n^2)$)
- **Level 30**: *The Grand Algorithm Architect* — Synthesizing flowcharts, variables, loops, arrays, and sensors into the master compiler engine

---

## 🏆 Badges & Official Certificate

- **14 Unlockable Badges**: Common, Rare, Epic, and Legendary achievements with sound chimes and trophies.
- **Official Certificate of Algorithmic Mastery**:
  - Dynamically drawn on an ultra-high-resolution HTML5 Canvas (**2400 × 1600 px**).
  - Contains candidate name, conferral date, stars earned, levels cleared, cryptographic seal hash ID, and official signatures.
  - **Direct PNG Export**: One-click download button saves the certificate as a PNG file directly to the user's computer or mobile device.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Audio**: Web Audio API (real-time procedural oscillator synthesizer)
- **Visuals & Exports**: HTML5 Canvas API (direct high-resolution rasterization to PNG)
- **Build Tool**: Vite 8
- **CI/CD**: GitHub Actions deploying to GitHub Pages

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/sarlayash/AlgoRealm-Flowcharts-Code-Algorithms.git
cd AlgoRealm-Flowcharts-Code-Algorithms

# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

---

## 📄 License

Licensed under the [Apache 2.0 License](LICENSE).
