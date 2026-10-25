import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Award,
  Map,
  Play,
  Shield,
  BookOpen,
  LogOut,
  RotateCcw,
  User,
  ChevronDown,
} from 'lucide-react';
import { sound } from '../services/sound';
import { PlayerProfile } from '../types/game';
import { LiveClock } from './LiveClock';

interface HeaderProps {
  currentView: 'TITLE' | 'GAME' | 'MAP' | 'GUIDE' | 'BADGES' | 'CERTIFICATE';
  setCurrentView: (view: 'TITLE' | 'GAME' | 'MAP' | 'GUIDE' | 'BADGES' | 'CERTIFICATE') => void;
  profile: PlayerProfile | null;
  onUpdateSound: (soundOn: boolean, musicOn: boolean) => void;
  onOpenCertificate: () => void;
  onOpenBadges: () => void;
  onLogoff?: () => void;
  onResetProgress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  profile,
  onUpdateSound,
  onOpenCertificate,
  onOpenBadges,
  onLogoff,
  onResetProgress,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSfx = () => {
    if (!profile) return;
    const nextVal = !profile.soundEnabled;
    sound.setSoundMuted(!nextVal);
    sound.playClick();
    onUpdateSound(nextVal, profile.musicEnabled);
  };

  const toggleMusic = () => {
    if (!profile) return;
    const nextVal = !profile.musicEnabled;
    sound.setMusicMuted(!nextVal);
    sound.playClick();
    onUpdateSound(profile.soundEnabled, nextVal);
  };

  return (
    <header className="flex items-center justify-between gap-6 px-6 py-3 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Brand Wordmark & Kapil Signature Tag */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => {
            sound.playClick();
            setCurrentView(profile ? 'GAME' : 'TITLE');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-indigo-400 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer"
        >
          <span className="w-2.5 h-2.5 bg-indigo-500 rotate-45 inline-block"></span>
          <span>AlgoRealm</span>
        </button>

        <span className="text-slate-600">·</span>

        <span className="text-[11px] font-mono font-medium text-amber-400/90 whitespace-nowrap hidden sm:inline">
          Powered by Kapil
        </span>
      </div>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => {
            sound.playClick();
            if (profile) setCurrentView('GAME');
          }}
          disabled={!profile}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentView === 'GAME' ? 'text-indigo-400' : ''
          } ${!profile ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <Play className="w-4 h-4" />
          <span>Active Trial</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            if (profile) setCurrentView('MAP');
          }}
          disabled={!profile}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentView === 'MAP' ? 'text-indigo-400' : ''
          } ${!profile ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <Map className="w-4 h-4" />
          <span>Realm Map (30)</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setCurrentView('GUIDE');
          }}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentView === 'GUIDE' ? 'text-indigo-400' : ''
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Learner Guide</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenBadges();
          }}
          disabled={!profile}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentView === 'BADGES' ? 'text-indigo-400' : ''
          } ${!profile ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <Shield className="w-4 h-4" />
          <span>Badges ({profile?.badges.length || 0})</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenCertificate();
          }}
          disabled={!profile}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentView === 'CERTIFICATE' ? 'text-indigo-400' : ''
          } ${!profile ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <Award className="w-4 h-4" />
          <span>Certificate</span>
        </button>
      </nav>

      {/* Zone 3: Live Clock, Audio Controls, User Menu, and Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Live Real-Time Clock */}
        <div className="hidden xl:flex items-center border border-slate-800 bg-slate-900/60 px-2.5 py-1 rounded-md">
          <LiveClock showIcon={true} />
        </div>

        {/* Audio Toggles */}
        {profile && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={toggleSfx}
              title={profile.soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {profile.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleMusic}
              title={profile.musicEnabled ? 'Stop Synth Ambient' : 'Play Synth Ambient'}
              className={`p-1.5 rounded-md hover:bg-slate-800 transition-colors ${
                profile.musicEnabled ? 'text-indigo-400' : 'text-slate-500'
              }`}
            >
              <Music className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Profile Dropdown with Logoff & Reset Options */}
        {profile && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 border border-slate-800 bg-slate-900/90 hover:bg-slate-800/80 px-2.5 py-1.5 rounded-md text-xs font-mono text-slate-300 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-white font-semibold max-w-[90px] truncate">{profile.name}</span>
              <span className="text-amber-400 font-bold">
                {Object.values(profile.stars).reduce((a, b) => a + b, 0)}★
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs font-mono space-y-1 animate-in fade-in duration-150">
                <div className="p-2 border-b border-slate-800 text-slate-400">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">Active Coder</div>
                  <div className="text-white font-bold truncate text-sm mt-0.5">{profile.name}</div>
                  <div className="text-[11px] text-amber-400 mt-0.5">
                    Level {profile.unlockedLevel} / 30 · {profile.completedLevels.length} Cleared
                  </div>
                </div>

                {onLogoff && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsMenuOpen(false);
                      onLogoff();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Log Off / Switch Coder</span>
                  </button>
                )}

                {onResetProgress && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsMenuOpen(false);
                      if (confirm('Reset all saved level progress, stars, and badges? This cannot be undone.')) {
                        onResetProgress();
                      }
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reset Journey Progress</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Primary CTA: PNG Certificate */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenCertificate();
          }}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Award className="w-3.5 h-3.5" />
          <span>PNG Certificate</span>
        </button>
      </div>
    </header>
  );
};
