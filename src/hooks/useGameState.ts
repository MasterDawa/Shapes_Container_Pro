import { useState, useEffect } from 'react';
import { Building, Upgrade, Stats, Resource } from '../types';

export interface GameState {
  shapes: Resource;
  goldenContainers: Resource;
  buildings: Building[];
  upgrades: Upgrade[];
  clickPower: number;
  unlockedAchievements: string[];
  prestigePoints: number;
  prestigeMultiplier: number;
  stats: Stats;
  lastSaveTime: number;
  version: string;
}

export function useGameState() {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved ? JSON.parse(saved) : true;
  });

  const [musicEnabled, setMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('musicEnabled', JSON.stringify(musicEnabled));
  }, [musicEnabled]);

  return {
    soundEnabled,
    setSoundEnabled,
    musicEnabled,
    setMusicEnabled,
  };
}