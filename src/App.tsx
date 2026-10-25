/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlayerProfile } from './types/game';
import { LEVELS } from './data/levels';
import { BADGES } from './data/badges';
import { AVATARS } from './data/avatars';
import { Header } from './components/Header';
import { TitleScreen } from './components/TitleScreen';
import { OverworldMap } from './components/OverworldMap';
import { GameView } from './components/GameView';
import { BadgesModal } from './components/BadgesModal';
import { CertificateModal } from './components/CertificateModal';
import { VictoryModal } from './components/VictoryModal';
import { sound } from './services/sound';

const STORAGE_KEY = 'algorealm_player_profile_v1';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load profile from storage:', e);
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<'TITLE' | 'GAME' | 'MAP'>('TITLE');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);

  // Modals
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [victoryState, setVictoryState] = useState<{
    isOpen: boolean;
    levelId: number;
    stars: number;
    stepsUsed: number;
    newBadgeTitles: string[];
  }>({
    isOpen: false,
    levelId: 1,
    stars: 3,
    stepsUsed: 0,
    newBadgeTitles: [],
  });

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (profile) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      } catch (e) {
        console.error('Failed to save profile:', e);
      }
    }
  }, [profile]);

  // Handle Starting a new game
  const handleStartGame = (name: string, avatarId: string) => {
    const newProfile: PlayerProfile = {
      name,
      avatarId,
      unlockedLevel: 1,
      stars: {},
      bestSteps: {},
      completedLevels: [],
      badges: [],
      totalScore: 0,
      startedAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString(),
      soundEnabled: true,
      musicEnabled: false,
    };

    setProfile(newProfile);
    setActiveLevelId(1);
    setCurrentView('GAME');
  };

  const handleContinue = () => {
    if (!profile) return;
    setActiveLevelId(profile.unlockedLevel || 1);
    setCurrentView('GAME');
  };

  const handleResetProfile = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
    setCurrentView('TITLE');
    setActiveLevelId(1);
  };

  const handleSoundUpdate = (soundOn: boolean, musicOn: boolean) => {
    if (!profile) return;
    setProfile({
      ...profile,
      soundEnabled: soundOn,
      musicEnabled: musicOn,
    });
  };

  const handleSelectLevel = (levelId: number) => {
    setActiveLevelId(levelId);
    setCurrentView('GAME');
  };

  // Called when level puzzle is solved
  const handleLevelComplete = (levelId: number, stepsUsed: number) => {
    if (!profile) return;
    const currentLevel = LEVELS.find((l) => l.id === levelId) || LEVELS[0];

    // Calculate stars: 3 stars if steps <= optimalSteps, 2 if <= optimal + 3, else 1
    let starsEarned = 1;
    if (stepsUsed <= currentLevel.optimalSteps) {
      starsEarned = 3;
    } else if (stepsUsed <= currentLevel.optimalSteps + 3) {
      starsEarned = 2;
    }

    const prevStars = profile.stars[levelId] || 0;
    const bestStars = Math.max(prevStars, starsEarned);

    const prevCompleted = profile.completedLevels.includes(levelId);
    const nextCompletedLevels = prevCompleted
      ? profile.completedLevels
      : [...profile.completedLevels, levelId];

    const nextUnlockedLevel = Math.max(
      profile.unlockedLevel,
      levelId < 30 ? levelId + 1 : 30
    );

    // Check Badges
    const newlyUnlockedBadgeIds: string[] = [];
    BADGES.forEach((b) => {
      if (!profile.badges.includes(b.id)) {
        if (b.requiredLevel === levelId) {
          newlyUnlockedBadgeIds.push(b.id);
        }
      }
    });

    const nextBadges = [...profile.badges, ...newlyUnlockedBadgeIds];
    const newBadgeTitles = newlyUnlockedBadgeIds
      .map((id) => BADGES.find((b) => b.id === id)?.title || '')
      .filter(Boolean);

    if (newlyUnlockedBadgeIds.length > 0) {
      sound.playBadge();
    }

    const updatedProfile: PlayerProfile = {
      ...profile,
      unlockedLevel: nextUnlockedLevel,
      stars: {
        ...profile.stars,
        [levelId]: bestStars,
      },
      bestSteps: {
        ...profile.bestSteps,
        [levelId]: Math.min(profile.bestSteps[levelId] || stepsUsed, stepsUsed),
      },
      completedLevels: nextCompletedLevels,
      badges: nextBadges,
      totalScore: profile.totalScore + starsEarned * 100,
      lastPlayedAt: new Date().toISOString(),
      completedAt:
        nextCompletedLevels.length >= 30 ? new Date().toISOString() : profile.completedAt,
    };

    setProfile(updatedProfile);

    // Open Victory celebration modal
    setVictoryState({
      isOpen: true,
      levelId,
      stars: starsEarned,
      stepsUsed,
      newBadgeTitles,
    });
  };

  const currentLevelDef = LEVELS.find((l) => l.id === activeLevelId) || LEVELS[0];
  const totalStarsEarned = profile
    ? Object.values(profile.stars).reduce((a, b) => a + b, 0)
    : 0;
  const completedCount = profile ? profile.completedLevels.length : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Contract Navigation */}
      <Header
        currentView={currentView}
        setCurrentView={(v) => {
          if (v === 'BADGES') {
            setIsBadgesOpen(true);
          } else if (v === 'CERTIFICATE') {
            setIsCertificateOpen(true);
          } else {
            setCurrentView(v);
          }
        }}
        profile={profile}
        onUpdateSound={handleSoundUpdate}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
      />

      {/* Main Views */}
      <main className="flex-1">
        {currentView === 'TITLE' || !profile ? (
          <TitleScreen
            existingProfile={profile}
            onStartGame={handleStartGame}
            onContinue={handleContinue}
            onResetProfile={handleResetProfile}
          />
        ) : currentView === 'MAP' ? (
          <OverworldMap
            levels={LEVELS}
            profile={profile}
            onSelectLevel={handleSelectLevel}
            onOpenCertificate={() => setIsCertificateOpen(true)}
          />
        ) : (
          <GameView
            level={currentLevelDef}
            profile={profile}
            onLevelComplete={handleLevelComplete}
            onGoToMap={() => setCurrentView('MAP')}
            onSelectLevel={handleSelectLevel}
          />
        )}
      </main>

      {/* Badges Trophy Hall Modal */}
      {profile && (
        <BadgesModal
          isOpen={isBadgesOpen}
          onClose={() => setIsBadgesOpen(false)}
          profile={profile}
        />
      )}

      {/* Official Certificate Modal with PNG export */}
      {profile && (
        <CertificateModal
          isOpen={isCertificateOpen}
          onClose={() => setIsCertificateOpen(false)}
          profile={profile}
          totalStarsEarned={totalStarsEarned}
          completedCount={completedCount}
          onUpdateName={(newName) => {
            setProfile({ ...profile, name: newName });
          }}
        />
      )}

      {/* Level Victory Celebration Modal */}
      <VictoryModal
        isOpen={victoryState.isOpen}
        level={LEVELS.find((l) => l.id === victoryState.levelId) || LEVELS[0]}
        starsEarned={victoryState.stars}
        stepsUsed={victoryState.stepsUsed}
        unlockedBadgeTitles={victoryState.newBadgeTitles}
        onNextLevel={() => {
          setVictoryState((prev) => ({ ...prev, isOpen: false }));
          if (victoryState.levelId < 30) {
            setActiveLevelId(victoryState.levelId + 1);
          } else {
            setIsCertificateOpen(true);
          }
        }}
        onReplayLevel={() => {
          setVictoryState((prev) => ({ ...prev, isOpen: false }));
        }}
        onGoToMap={() => {
          setVictoryState((prev) => ({ ...prev, isOpen: false }));
          setCurrentView('MAP');
        }}
        onOpenCertificate={() => {
          setVictoryState((prev) => ({ ...prev, isOpen: false }));
          setIsCertificateOpen(true);
        }}
      />
    </div>
  );
}
