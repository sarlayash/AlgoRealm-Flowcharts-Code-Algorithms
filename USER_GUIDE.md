# AlgoRealm: Comprehensive Learner's Handbook

Welcome to **AlgoRealm: Flowcharts, Code & Algorithms**! This guide is designed for beginner students to intermediate computer science learners to help you understand the core computational concepts behind all 30 levels.

---

## Table of Contents
1. [Game Overview & How to Play](#1-game-overview--how-to-play)
2. [Flowchart Shape Standards & Geometry](#2-flowchart-shape-standards--geometry)
3. [The Three Fundamental Logic Constructs](#3-the-three-fundamental-logic-constructs)
4. [Variables & Memory Registers](#4-variables--memory-registers)
5. [Data Structures Visual Primer](#5-data-structures-visual-primer)
6. [Search & Sort Algorithms](#6-search--sort-algorithms)
7. [Graph & Tree Traversal](#7-graph--tree-traversal)
8. [Dynamic Programming & Recursion](#8-dynamic-programming--recursion)
9. [Big-O Computational Complexity Reference](#9-big-o-computational-complexity-reference)
10. [Achieving 3 Stars & Official PNG Certification](#10-achieving-3-stars--official-png-certification)

---

## 1. Game Overview & How to Play

AlgoRealm features **30 interactive levels** distributed across 6 distinct realms:

| Realm | Title | Levels | Core Focus |
|---|---|---|---|
| **Realm 1** | **Logic Genesis** | Levels 1–5 | Sequential commands, flowchart basics, decision diamonds, while loops, variable registers |
| **Realm 2** | **Control Flow Citadel** | Levels 6–10 | Nested loops, environmental sensors, boolean operators (AND, OR, NOT), switch routers, infinite loop debugging |
| **Realm 3** | **Data Structure Caverns** | Levels 11–15 | Arrays & indexing, LIFO Stacks, FIFO Queues, Hash Tables & buckets, Linked List pointer chains |
| **Realm 4** | **Algorithm Arenas** | Levels 16–20 | Linear Search vs. Binary Search, Bubble Sort crane, Selection Sort harvester, Merge Sort divide-and-conquer |
| **Realm 5** | **Graph & Memory Labyrinths** | Levels 21–25 | Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra's shortest path, BST In-Order traversal, Heap memory pointers |
| **Realm 6** | **Grand Master Synthesis** | Levels 26–30 | Recursive mirror leaps, Dynamic Programming min-cost vault, Bitwise laser masks, Big-O race, Master Algorithm Architect |

### Scoring & Star Rating
- **3 Gold Stars**: Complete the level within the **Optimal Step Target**.
- **2 Stars**: Solved within $\le \text{Optimal} + 3$ steps.
- **1 Star**: Solved with extra trial steps.
- You can replay any level anytime to optimize your solution and earn 3 stars!

---

## 2. Flowchart Shape Standards & Geometry

A flowchart is a formal diagram representing an algorithm's sequence of steps. Each geometric shape has a precise, standardized meaning:

| Shape | Visual Form | Official Name | Function in Code |
|---|---|---|---|
| **Oval / Stadium** | `( START )` / `( END )` | **Terminal** | Defines where the program execution starts and halts. |
| **Rectangle** | `[ X = X + 1 ]` | **Process** | Actions, calculations, variable assignments, and movements. |
| **Diamond** | `< Is Wall Ahead? >` | **Decision** | Conditional test with two exits: **Yes (True)** and **No (False)**. |
| **Parallelogram** | `/ Read Sensor /` | **Input / Output** | Reading external data or displaying outputs to the user. |
| **Arrow** | `↓` or `→` | **Flow Line** | Dictates the direction of instruction execution. Loops branch backwards! |

---

## 3. The Three Fundamental Logic Constructs

According to the **Böhm–Jacopini Theorem (1966)**, any computable program can be expressed using only three structures:

### 1. Sequence
Instructions execute one after another in order from top to bottom:
```
FORWARD
COLLECT
TURN_RIGHT
FORWARD
```

### 2. Selection (Conditionals)
The computer makes decisions based on conditions:
```typescript
if (sensor.hasWallAhead()) {
  turnRight();
} else {
  stepForward();
}
```

### 3. Iteration (Loops)
Repetition saves instruction space:
```typescript
while (position !== goal) {
  stepForward();
}
```
> **⚠️ Infinite Loop Warning (Level 10):**
> A `while` loop must update its control variable (e.g., `Counter--`). If the condition never turns `false`, the program hangs in an infinite loop!

---

## 4. Variables & Memory Registers

A variable is a symbolic label for a memory cell. In AlgoRealm:
- Variable `X` or `Crystals` tracks collected gems.
- **Security Doors** evaluate conditions like `Door Requirement: X >= 3`. The barrier only drops when register `X` contains 3 or more energy charges.

---

## 5. Data Structures Visual Primer

### Array (Level 11)
- **Concept**: Contiguous memory slots with index numbers starting at 0.
- **Access Time**: $O(1)$ constant time: $\text{Address} = \text{Base} + i \times \text{Size}$.

### Stack — LIFO (Level 12)
- **Concept**: **Last-In, First-Out**. The last item pushed to the top is the first item popped out.
- **Real-World Uses**: Function call stack, Undo/Redo operations (`Ctrl+Z`), syntax bracket matching.

### Queue — FIFO (Level 13)
- **Concept**: **First-In, First-Out**. First item enqueued is the first item dequeued.
- **Real-World Uses**: Operating system CPU schedulers, printer job spoolers, network packet buffers.

### Hash Map (Level 14)
- **Concept**: Uses a mathematical hash function (e.g., $\text{ASCII\_SUM}(Key) \pmod 4$) to map strings to numerical bucket indices.
- **Lookup Time**: Average $O(1)$ instant retrieval.

### Linked List (Level 15)
- **Concept**: Non-contiguous memory cells connected via memory pointers (`Node -> Next -> Next -> NULL`).

---

## 6. Search & Sort Algorithms

### Linear Search vs. Binary Search (Levels 16 & 17)
- **Linear Search**: Scans index by index. Requires $O(n)$ time.
- **Binary Search**: Requires sorted data. Inspects $\text{Mid} = (\text{Low} + \text{High}) / 2$. Discards half the entire array on each comparison, locating values in $O(\log n)$!
  - 1 item out of 1,000,000 is found in at most **20 comparisons**!

### Comparison Sorting (Levels 18, 19 & 20)
- **Bubble Sort ($O(n^2)$)**: Compares adjacent pairs and swaps them if out of order until values "bubble" to the top.
- **Selection Sort ($O(n^2)$)**: Scans the unsorted array to find the minimum element, then places it at index $i$. Makes fewer total memory writes than Bubble Sort.
- **Merge Sort ($O(n \log n)$)**: Divide-and-conquer strategy that divides the list into halves, sorts them recursively, and merges the sorted halves.

---

## 7. Graph & Tree Traversal

- **BFS (Breadth-First Search - Level 21)**: Explores concentric radial waves using a FIFO queue. Guarantees the shortest path on unweighted graphs.
- **DFS (Depth-First Search - Level 22)**: Explores deep paths using a LIFO call stack before backtracking. Used in maze solving and topological sorting.
- **Dijkstra's Algorithm (Level 23)**: Discovers the absolute minimum cumulative weight path across weighted network nodes.
- **Binary Search Tree In-Order (Level 24)**: Visits **Left Subtree → Root → Right Subtree**. Yields values in strictly sorted ascending order in $O(n)$ time!

---

## 8. Dynamic Programming & Recursion

- **Recursion (Level 26)**: A function calling itself with smaller parameters until hitting a **base case** (e.g. Fibonacci $F(n) = F(n-1) + F(n-2)$).
- **Dynamic Programming (Level 27)**: Solves complex optimization problems by breaking them into overlapping subproblems and storing the best intermediate answers (**memoization**).

---

## 9. Big-O Computational Complexity Reference

Big-O measures how algorithm runtime and memory grow as input size $N$ increases:

| Complexity | Name | Operations for $N = 1,000,000$ | Practical Verdict |
|---|---|---|---|
| **$O(1)$** | Constant | 1 operation | Instantaneous |
| **$O(\log n)$** | Logarithmic | ≈ 20 operations | Blazing fast (Binary Search) |
| **$O(n)$** | Linear | 1,000,000 operations | Good for simple iterations |
| **$O(n \log n)$** | Linearithmic | ≈ 20,000,000 ops | Optimal comparison sort (Merge Sort) |
| **$O(n^2)$** | Quadratic | 1,000,000,000,000 ops | Unacceptable for large $N$ |
| **$O(2^n)$** | Exponential | Impractical | Freezes CPU |

---

## 10. Achieving 3 Stars & Official PNG Certification

1. **Earn 3 Stars on All Levels**: Keep your command list concise. Use loops instead of duplicate forward commands!
2. **Unlock All 14 Badges**: Including *Blueprint Cartographer*, *Diamond Decider*, *Stack Master*, *Logarithmic Ranger*, and *Asymptotic Titan*.
3. **Official PNG Certificate**:
   - Access the Certificate tab at any time.
   - Enter your preferred legal or gamer name.
   - Click **"Download in PNG Format"** to save your crisp **2400 × 1600 px** official credential to your local drive!
