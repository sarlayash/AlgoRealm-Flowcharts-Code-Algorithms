import React from 'react';
import { Github, Award, Map, BookOpen, Shield, LogOut, RotateCcw, Sparkles } from 'lucide-react';
import { LiveClock } from './LiveClock';
import { sound } from '../services/sound';
import { PlayerProfile } from '../types/game';

interface FooterProps {
  profile: PlayerProfile | null;
  onNavigate: (view: 'TITLE' | 'GAME' | 'MAP' | 'GUIDE') => void;
  onOpenCertificate: () => void;
  onOpenBadges: () => void;
  onLogoff: () => void;
  onResetProgress: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  profile,
  onNavigate,
  onOpenCertificate,
  onOpenBadges,
  onLogoff,
  onResetProgress,
}) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-md mt-auto text-slate-400 text-xs">
      {/* Top Footer Strip: Branding, Live Clock, and Status */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Brand & Creator Bio (FAANG Standard Clean Hierarchy) */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-indigo-500 rotate-45 inline-block"></span>
            <span className="text-base font-extrabold tracking-tight text-white font-sans">
              AlgoRealm
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono font-semibold text-amber-400">
              Powered by Kapil
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            High-performance algorithmic video game platform built to FAANG engineering standards.
            Master 30 progressive levels spanning sequential logic, flowcharts, data structures,
            graph traversals, and computational Big-O optimization.
          </p>

          <div className="pt-1 flex items-center gap-3">
            <LiveClock showIcon={true} />
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="md:col-span-4 space-y-2.5">
          <div className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Curriculum &amp; Tools
          </div>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('MAP');
                }}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Map className="w-3.5 h-3.5 text-indigo-400" />
                <span>30-Level Realm Overworld</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('GUIDE');
                }}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Learner's Handbook &amp; Guide</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenBadges();
                }}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Trophy Hall ({profile?.badges.length || 0} Badges)</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenCertificate();
                }}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Download PNG Certificate</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Session Management & Quick Actions */}
        <div className="md:col-span-3 space-y-2.5">
          <div className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Coder Profile &amp; Control
          </div>

          {profile ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
                  <span>{profile.name}</span>
                  <span className="text-[10px] text-amber-400">
                    {Object.values(profile.stars).reduce((a, b) => a + b, 0)} ★
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Level {profile.unlockedLevel} of 30 Unlocked
                </div>
              </div>

              <div className="flex flex-col gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onLogoff();
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-xs font-mono flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <LogOut className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Log Off / Switch Coder</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Save &amp; Exit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (confirm('Are you sure you want to reset all game progress, levels, and stars? This cannot be undone.')) {
                      onResetProgress();
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800 text-slate-400 hover:text-rose-300 rounded-lg text-xs font-mono flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reset Journey Progress</span>
                  </span>
                  <span className="text-[10px] text-rose-500/80 font-mono">Wipe Data</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-mono">
              No active profile. Register your name on the home screen to begin.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Copyright & Attribution */}
      <div className="border-t border-slate-900 bg-slate-950 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} AlgoRealm · Architected &amp; Engineered by{' '}
            <span className="text-amber-400 font-bold">Kapil</span>.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>All Systems Operational</span>
            </span>
            <a
              href="https://github.com/sarlayash/AlgoRealm-Flowcharts-Code-Algorithms"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
