import React, { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import type { Achievement } from '../types';

interface AchievementPopupProps {
  achievement: Achievement;
  onComplete: () => void;
}

export function AchievementPopup({ achievement, onComplete }: AchievementPopupProps) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = (Icons as any)[achievement.icon];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-emerald-500/20 backdrop-blur-sm text-white px-6 py-4 rounded-lg shadow-lg animate-slide-in z-50">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            {Icon && <Icon className="w-6 h-6 text-emerald-400" />}
          </div>
          <div>
            <h3 className="font-bold">Achievement Unlocked!</h3>
            <p className="text-sm text-white/80">{achievement.name}</p>
            {achievement.reward && (
              <p className="text-xs text-emerald-400">
                Reward: {achievement.reward.value}x {achievement.reward.type} bonus
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onComplete();
          }}
          className="text-white/60 hover:text-white/80 font-bold"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}