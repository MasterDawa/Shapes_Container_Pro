import React from 'react';
import { Achievement } from '../types';

interface AchievementsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  unlockedAchievements: Set<string>;
}

export function AchievementsPanel({ 
  isOpen, 
  onClose, 
  achievements, 
  unlockedAchievements 
}: AchievementsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Achievements</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-4">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg ${
                unlockedAchievements.has(achievement.id)
                  ? 'bg-green-500/20'
                  : 'bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  unlockedAchievements.has(achievement.id)
                    ? 'bg-green-500'
                    : 'bg-gray-600'
                }`}>
                  {unlockedAchievements.has(achievement.id) ? '✓' : '?'}
                </div>
                <div>
                  <h3 className="font-bold">{achievement.name}</h3>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}