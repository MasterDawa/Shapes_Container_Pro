import React, { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';

// Inline interface to replace external types
interface Achievement {
  name: string;
  icon: keyof typeof Icons;
  reward?: {
    value: number;
    type: string;
  };
}

interface AchievementPopupProps {
  achievement: Achievement;
  onComplete: () => void;
}

export function AchievementPopup({ achievement, onComplete }: AchievementPopupProps) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = Icons[achievement.icon];

  useEffect(() => {
    // Set a timer to auto-close the popup after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 5000);

    // Clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [onComplete]);

  // If not visible, return null to remove from DOM
  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onComplete();
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-emerald-500/20 backdrop-blur-sm text-white px-6 py-4 rounded-lg shadow-lg animate-slide-in z-50">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Icon className="w-6 h-6 text-emerald-400" />
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
          onClick={handleClose}
          className="text-white/60 hover:text-white/80 font-bold"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}