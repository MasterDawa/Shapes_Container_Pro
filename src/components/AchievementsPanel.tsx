import React from 'react';
import { Trophy } from 'lucide-react';
import { Achievement } from '../types';
import * as Icons from 'lucide-react';

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
    <div className="fixed right-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-sm shadow-lg transform transition-transform duration-300 ease-in-out z-40">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Achievements</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white/80"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          {achievements.map(achievement => {
            const Icon = Icons[achievement.icon as keyof typeof Icons];
            const isUnlocked = unlockedAchievements.has(achievement.id);

            return (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg ${
                  isUnlocked 
                    ? 'bg-white/15 text-white' 
                    : 'bg-white/5 text-white/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isUnlocked ? 'bg-yellow-500/20' : 'bg-white/10'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isUnlocked ? 'text-yellow-400' : 'text-white/40'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{achievement.name}</h3>
                    <p className="text-sm text-white/60">{achievement.description}</p>
                    {achievement.reward && isUnlocked && (
                      <p className="text-xs text-yellow-400/80 mt-1">
                        {achievement.reward.value}x {achievement.reward.type} bonus
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}