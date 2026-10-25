import { HeroAvatar } from '../types/game';

export const AVATARS: HeroAvatar[] = [
  {
    id: 'ada',
    name: 'Ada the Compiler',
    title: 'Flowchart Tactician',
    description: 'Master of structured logic, conditional branches, and analytical loops.',
    color: '#6366f1', // indigo
    secondaryColor: '#a855f7',
    svgHead: 'ADA',
  },
  {
    id: 'turing',
    name: 'Turing the Automaton',
    title: 'State Machine Sentinel',
    description: 'Formed from brass and quantum registers, capable of infinite state transitions.',
    color: '#06b6d4', // cyan
    secondaryColor: '#3b82f6',
    svgHead: 'TURING',
  },
  {
    id: 'byte',
    name: 'Byte the Cyber Rover',
    title: 'Recursive Scout',
    description: 'Swift agile rover that excels in graph pathfinding and stack memory navigation.',
    color: '#10b981', // emerald
    secondaryColor: '#14b8a6',
    svgHead: 'BYTE',
  },
  {
    id: 'nova',
    name: 'Nova the Syntax Knight',
    title: 'Algorithm Vanguard',
    description: 'Wields the blade of Big-O optimality, carving through complex time bounds.',
    color: '#f59e0b', // amber
    secondaryColor: '#ef4444',
    svgHead: 'NOVA',
  },
];
