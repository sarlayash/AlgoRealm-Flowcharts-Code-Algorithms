import React from 'react';
import { Volume2, VolumeX, Music, Award, Map, Play, Shield, BookOpen } from 'lucide-react';
import { sound } from '../services/sound';
import { PlayerProfile } from '../types/game';

interface HeaderProps {
  currentView: 'TITLE' | 'GAME' | 'MAP' | 'GUIDE' | 'BADGES' | 'CERTIFICATE';
  setCurrentView: (view: 'TITLE' | 'GAME' | 'MAP' | 'GUIDE' | 'BADGES' | 'CERTIFICATE') => void;
  profile: PlayerProfile | null;
  onUpdateSound: (soundOn: boolean, musicOn: boolean) => void;
  onOpenCertificate: () => void;
  onOpenBadges: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  profile,
  onUpdateSound,
  onOpenCertificate,
  onOpenBadges,
}) => {
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
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => {
          sound.playClick();
          setCurrentView(profile ? 'GAME' : 'TITLE');
        }}
        className="text-lg font-bold tracking-tight text-white hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
      >
        <span className="w-2.5 h-2.5 bg-indigo-500 rotate-45 inline-block"></span>
        <span>AlgoRealm</span>
      </button>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
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

      {/* Zone 3: 1 primary action / audio controls */}
      <div className="flex items-center gap-3 shrink-0">
        {profile && (
          <div className="hidden sm:flex items-center gap-2 border border-slate-800 bg-slate-900/80 px-2.5 py-1 rounded-md text-xs font-mono text-slate-300">
            <span className="text-indigo-400 font-semibold">{profile.name}</span>
            <span className="text-slate-600">·</span>
            <span className="text-amber-400 font-semibold">
              {Object.values(profile.stars).reduce((a, b) => a + b, 0)} ★
            </span>
          </div>
        )}

        {profile && (
          <div className="flex items-center gap-1">
            <button
              onClick={toggleSfx}
              title={profile.soundEnabled ? 'Mute SFX' : 'Enable SFX'}
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

        <button
          onClick={() => {
            sound.playClick();
            onOpenCertificate();
          }}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm flex items-center gap-1.5"
        >
          <Award className="w-3.5 h-3.5" />
          <span>PNG Certificate</span>
        </button>
      </div>
    </header>
  );
};
