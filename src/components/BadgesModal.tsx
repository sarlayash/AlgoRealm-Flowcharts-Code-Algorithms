import React from 'react';
import { X, Shield, Check, Lock, Sparkles, Award } from 'lucide-react';
import { BADGES } from '../data/badges';
import { PlayerProfile } from '../types/game';
import { sound } from '../services/sound';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  if (!isOpen) return null;

  const unlockedCount = profile.badges.length;
  const totalCount = BADGES.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Algorithmic Trophy Hall</h2>
              <div className="text-xs text-slate-400 mt-0.5">
                {unlockedCount} of {totalCount} Badges Unlocked
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = profile.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                  isUnlocked
                    ? 'border-indigo-500/40 bg-slate-950 shadow-md'
                    : 'border-slate-800/80 bg-slate-950/40 opacity-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold border ${
                      isUnlocked
                        ? 'border-indigo-500 bg-indigo-950/60 text-indigo-400 shadow-inner'
                        : 'border-slate-800 bg-slate-900 text-slate-600'
                    }`}
                  >
                    {isUnlocked ? <Sparkles className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      badge.rarity === 'LEGENDARY'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : badge.rarity === 'EPIC'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : badge.rarity === 'RARE'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {badge.rarity}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{badge.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">
                    {badge.requiredLevel ? `Unlocked at Lvl ${badge.requiredLevel}` : 'Special Award'}
                  </span>
                  {isUnlocked && (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Claimed</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
