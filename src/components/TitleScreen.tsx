import React, { useState } from 'react';
import { Play, Sparkles, Volume2, Shield, Award, RotateCcw } from 'lucide-react';
import { AVATARS } from '../data/avatars';
import { PlayerProfile } from '../types/game';
import { sound } from '../services/sound';

interface TitleScreenProps {
  existingProfile: PlayerProfile | null;
  onStartGame: (name: string, avatarId: string) => void;
  onContinue: () => void;
  onResetProfile: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  existingProfile,
  onStartGame,
  onContinue,
  onResetProfile,
}) => {
  const [name, setName] = useState(existingProfile?.name || '');
  const [selectedAvatarId, setSelectedAvatarId] = useState(existingProfile?.avatarId || AVATARS[0].id);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name to register your algorithmic coder journey.');
      sound.playFailure();
      return;
    }
    sound.playClick();
    sound.playSuccess();
    onStartGame(name.trim(), selectedAvatarId);
  };

  const selectedAvatar = AVATARS.find((a) => a.id === selectedAvatarId) || AVATARS[0];

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden bg-slate-950">
      {/* Background Algorithmic Matrix Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-3xl z-10 space-y-8">
        {/* Main Title Banner */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-widest text-indigo-400">
            <span>ALGORITHMIC ADVENTURE</span>
            <span aria-hidden="true">·</span>
            <span>30 PROGRESSIVE LEVELS</span>
            <span aria-hidden="true">·</span>
            <span>PNG CERTIFICATION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Algo<span className="text-indigo-400">Realm</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto">
            A visual, interactive video game exploring programming foundations, flowchart logic,
            data structures, and computational algorithms from zero to grandmaster.
          </p>
        </div>

        {/* Existing Player Quick Continue Card */}
        {existingProfile && (
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-xs text-slate-400">WELCOME BACK, CODER</div>
              <div className="text-xl font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                <span>{existingProfile.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Level {existingProfile.unlockedLevel} / 30
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>{existingProfile.completedLevels.length} Completed</span>
                <span>·</span>
                <span className="text-amber-400 font-semibold">
                  {Object.values(existingProfile.stars).reduce((a, b) => a + b, 0)} Stars
                </span>
                <span>·</span>
                <span>{existingProfile.badges.length} Badges</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onContinue();
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md transition-all flex items-center gap-2 text-sm whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Continue Journey</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset your saved progress and start fresh?')) {
                    onResetProfile();
                  }
                }}
                title="Start a new profile"
                className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* New Journey / Setup Form */}
        <form
          onSubmit={handleStart}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-6 shadow-xl"
        >
          <div className="space-y-2">
            <label htmlFor="playerName" className="block text-sm font-semibold text-slate-200">
              Coder Name
            </label>
            <input
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrorMsg('');
              }}
              placeholder="e.g. Ada Lovelace, Alan Turing, Nexus..."
              maxLength={26}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base transition-all font-mono"
            />
            {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
          </div>

          {/* Avatar Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200">
              Select Logic Hero Avatar
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AVATARS.map((avatar) => {
                const isSelected = selectedAvatarId === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedAvatarId(avatar.id);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/40'
                    }`}
                  >
                    {/* Bespoke Vector Avatar Face */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-inner"
                      style={{
                        borderColor: avatar.color,
                        backgroundColor: `${avatar.color}15`,
                      }}
                    >
                      <AvatarSvg type={avatar.id} color={avatar.color} />
                    </div>

                    <div className="text-center w-full">
                      <div className="text-xs font-bold text-white truncate">{avatar.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{avatar.title}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-400 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-300">{selectedAvatar.name}:</span>{' '}
              {selectedAvatar.description}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
          >
            <Sparkles className="w-5 h-5" />
            <span>{existingProfile ? 'Update & Start Trial' : 'Begin 30-Level Journey'}</span>
          </button>
        </form>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
              <Play className="w-4 h-4" />
              <span>Interactive Gameplay</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Not a dry text quiz! Drive robotic rovers, wire flowchart conduits, manipulate LIFO stacks, and calibrate sorting cranes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Shield className="w-4 h-4" />
              <span>14 Unlockable Badges</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Earn rare achievements as you master decision diamonds, escape infinite loops, and crack logarithmic binary searches.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Award className="w-4 h-4" />
              <span>PNG Certificate Export</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Earn your personalized Certificate of Algorithmic Mastery with official hash verification, downloadable directly in PNG format.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AvatarSvg: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  if (type === 'turing') {
    return (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <circle cx="8" cy="11" r="1.5" fill={color} />
        <circle cx="16" cy="11" r="1.5" fill={color} />
        <line x1="8" y1="15" x2="16" y2="15" strokeLinecap="round" />
        <line x1="12" y1="2" x2="12" y2="5" />
      </svg>
    );
  }
  if (type === 'byte') {
    return (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <circle cx="12" cy="12" r="8" />
        <circle cx="9" cy="10" r="1.5" fill={color} />
        <circle cx="15" cy="10" r="1.5" fill={color} />
        <path d="M8 15s1.5 2 4 2 4-2 4-2" strokeLinecap="round" />
        <path d="M4 8l3-3M20 8l-3-3" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'nova') {
    return (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <polygon points="12 2 15 8 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 8" fill={`${color}30`} />
        <circle cx="12" cy="12" r="3" fill={color} />
      </svg>
    );
  }
  // Default: Ada
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="8" r="4" fill={`${color}20`} />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M9 7h6M12 4v6" strokeLinecap="round" />
    </svg>
  );
};
