import React from 'react';
import { Star, Lock, CheckCircle2, ChevronRight, Trophy, Zap, Award } from 'lucide-react';
import { LevelDefinition, PlayerProfile } from '../types/game';
import { sound } from '../services/sound';

interface OverworldMapProps {
  levels: LevelDefinition[];
  profile: PlayerProfile;
  onSelectLevel: (levelId: number) => void;
  onOpenCertificate: () => void;
}

export const OverworldMap: React.FC<OverworldMapProps> = ({
  levels,
  profile,
  onSelectLevel,
  onOpenCertificate,
}) => {
  const realms = [
    { number: 1, name: 'Logic Genesis', desc: 'Sequential commands, flowchart basics, decision diamonds, variables', color: 'from-blue-600 to-indigo-600' },
    { number: 2, name: 'Control Flow Citadel', desc: 'Nested loops, while sensor mazes, boolean logic, infinite loop escape', color: 'from-indigo-600 to-purple-600' },
    { number: 3, name: 'Data Structure Caverns', desc: 'Arrays, LIFO stacks, FIFO queues, hash tables, linked list pointers', color: 'from-purple-600 to-pink-600' },
    { number: 4, name: 'Algorithm Arenas', desc: 'Linear vs binary search, bubble sort crane, selection sort, divide & conquer', color: 'from-emerald-600 to-teal-600' },
    { number: 5, name: 'Graph & Memory Labyrinths', desc: 'BFS & DFS exploration, Dijkstra shortest path, BST in-order, memory pointers', color: 'from-amber-600 to-orange-600' },
    { number: 6, name: 'Grand Master Synthesis', desc: 'Recursive mirrors, dynamic programming, bitwise laser arrays, Big-O race, Master Architect', color: 'from-rose-600 to-amber-600' },
  ];

  const totalStars = Object.values(profile.stars).reduce((a, b) => a + b, 0);
  const maxPossibleStars = 30 * 3;
  const progressPercent = Math.round((profile.completedLevels.length / 30) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Overworld Map Header & Stats */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
            ALGORITHM ARCHITECT OVERWORLD
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            The 30 Algorithmic Realms
          </h2>
          <p className="text-sm text-slate-400">
            Guide your algorithmic hero across all 6 worlds from basic logic gates to asymptotic optimization.
          </p>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-white">
              {profile.completedLevels.length} / 30
            </div>
            <div className="text-xs text-slate-400">Levels Cleared</div>
          </div>

          <div className="h-8 w-px bg-slate-800"></div>

          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-amber-400 flex items-center justify-center gap-1">
              <span>{totalStars}</span>
              <span className="text-sm">★</span>
            </div>
            <div className="text-xs text-slate-400">Stars Earned</div>
          </div>

          <div className="h-8 w-px bg-slate-800"></div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenCertificate();
            }}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Certificate</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Overall Progression</span>
          <span className="font-mono text-indigo-300 font-semibold">{progressPercent}% Conquered</span>
        </div>
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Realms Grid */}
      <div className="space-y-12">
        {realms.map((realm) => {
          const realmLevels = levels.filter((lvl) => lvl.realmNumber === realm.number);
          const realmCompleted = realmLevels.filter((lvl) =>
            profile.completedLevels.includes(lvl.id)
          ).length;

          return (
            <div key={realm.number} className="space-y-4">
              {/* Realm Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${realm.color} flex items-center justify-center text-white font-bold text-sm shadow-sm`}
                  >
                    {realm.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Realm {realm.number}: {realm.name}</span>
                      {realmCompleted === realmLevels.length && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </h3>
                    <p className="text-xs text-slate-400">{realm.desc}</p>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-400 self-start sm:self-auto">
                  {realmCompleted} / {realmLevels.length} Cleared
                </div>
              </div>

              {/* Levels Nodes in Realm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {realmLevels.map((lvl) => {
                  const isUnlocked = lvl.id <= profile.unlockedLevel;
                  const isCompleted = profile.completedLevels.includes(lvl.id);
                  const stars = profile.stars[lvl.id] || 0;
                  const isBoss = lvl.id % 5 === 0;

                  return (
                    <button
                      key={lvl.id}
                      disabled={!isUnlocked}
                      onClick={() => {
                        sound.playClick();
                        onSelectLevel(lvl.id);
                      }}
                      className={`relative p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 min-h-[140px] cursor-pointer ${
                        !isUnlocked
                          ? 'border-slate-800/60 bg-slate-950/40 opacity-50 cursor-not-allowed'
                          : isCompleted
                          ? 'border-indigo-500/40 bg-slate-900/80 hover:border-indigo-400 hover:bg-slate-900'
                          : 'border-amber-500/50 bg-indigo-950/20 hover:border-amber-400 hover:bg-indigo-950/40 ring-1 ring-amber-500/30 glow-active'
                      }`}
                    >
                      {/* Top Row: Level number & Status */}
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                              isBoss
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            L{lvl.id}
                          </span>
                          {isBoss && (
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                          )}
                        </div>

                        {!isUnlocked ? (
                          <Lock className="w-4 h-4 text-slate-600" />
                        ) : isCompleted ? (
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3].map((starIdx) => (
                              <Star
                                key={starIdx}
                                className={`w-3.5 h-3.5 ${
                                  starIdx <= stars
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-700'
                                }`}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] font-semibold text-amber-400 font-mono">
                            READY
                          </span>
                        )}
                      </div>

                      {/* Middle: Title & Concept */}
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-white leading-tight line-clamp-2">
                          {lvl.title}
                        </div>
                        <div className="text-[11px] text-indigo-300/80 font-mono truncate">
                          {lvl.concept}
                        </div>
                      </div>

                      {/* Bottom Mode Indicator */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                        <span>
                          {lvl.mode === 'GRID_BOT'
                            ? 'Rover Grid'
                            : lvl.mode === 'FLOWCHART_BUILDER'
                            ? 'Flowchart'
                            : 'Algo Arena'}
                        </span>
                        {isUnlocked && (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
