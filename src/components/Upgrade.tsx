import React from 'react';
import type { Upgrade as UpgradeType } from '../types';
import { formatNumber } from '../utils';
import { Mouse, Zap, Star, Sparkles } from 'lucide-react';
import { Button } from './Button';

const upgradeIcons = {
  click: Mouse,
  production: Zap,
  golden: Star,
  hybrid: Sparkles
};

const upgradeColors = {
  click: 'from-blue-500/20 to-blue-600/20 border-blue-500/50',
  production: 'from-green-500/20 to-green-600/20 border-green-500/50',
  golden: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/50',
  hybrid: 'from-purple-500/20 to-purple-600/20 border-purple-500/50'
};

interface UpgradeProps {
  upgrade: UpgradeType;
  canAfford: boolean;
  onClick: () => void;
  soundEnabled?: boolean;
}

export function Upgrade({ upgrade, canAfford, onClick, soundEnabled = true }: UpgradeProps) {
  console.log('Upgrade props:', upgrade);
  const Icon = upgradeIcons[upgrade.type];
  const colorClass = upgradeColors[upgrade.type];
  const progress = (upgrade.currentLevel / upgrade.maxLevel) * 100;
  const nextMultiplier = upgrade.baseMultiplier * (1 + (upgrade.currentLevel + 1));
  const isMaxed = upgrade.currentLevel >= upgrade.maxLevel;

  return (
    <Button
      onClick={onClick}
      disabled={!canAfford || upgrade.currentLevel >= upgrade.maxLevel}
      soundEnabled={soundEnabled}
      className={`
        w-full p-4 rounded-xl
        bg-gradient-to-br ${colorClass}
        backdrop-blur-sm
        border border-opacity-20
        transition-all duration-200
        relative
        overflow-hidden
        ${upgrade.currentLevel >= upgrade.maxLevel 
          ? 'opacity-50 cursor-not-allowed' 
          : canAfford
            ? 'hover:scale-[1.02] cursor-pointer'
            : 'opacity-75 cursor-not-allowed'
        }
      `}
    >
      {/* Progress bar */}
      <div
        className="absolute inset-0 bg-white/5"
        style={{ width: `${progress}%` }}
      />

      <div className="relative flex items-start gap-4">
        <div className={`p-3 rounded-lg bg-${upgrade.type}-500/20`}>
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1 text-left">
          <div className="flex justify-between items-baseline">
            <h3 className="font-bold text-white">
              {upgrade.name} ({upgrade.currentLevel}/{upgrade.maxLevel})
            </h3>
            <span className="text-sm text-white/80">
              {isMaxed ? 'MAXED' : `Cost: ${formatNumber(upgrade.currentCost)}`}
            </span>
          </div>
          
          <p className="text-xs text-white/60 mt-1">
            {upgrade.description}
          </p>

          <div className="mt-2 text-xs">
            <span className="text-white/80">
              Current: {formatNumber(upgrade.multiplier)}x
            </span>
            {!isMaxed && (
              <span className="text-green-400 ml-2">
                Next: {formatNumber(nextMultiplier)}x
              </span>
            )}
          </div>
        </div>
      </div>
    </Button>
  );
}