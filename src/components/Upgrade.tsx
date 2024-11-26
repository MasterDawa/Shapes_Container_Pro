import React from 'react';
import { Upgrade as UpgradeType } from '../types';
import { formatNumber } from '../utils';
import { Zap, Crown, Coins, Sparkles } from 'lucide-react';

const icons = {
  click: Zap,
  production: Coins,
  golden: Crown,
  hybrid: Sparkles, // Added hybrid type icon
};

interface UpgradeProps {
  upgrade: UpgradeType;
  canAfford: boolean;
  onClick: () => void;
}

export function Upgrade({ upgrade, canAfford, onClick }: UpgradeProps) {
  const Icon = icons[upgrade.type as keyof typeof icons];

  if (upgrade.purchased) return null;

  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
        canAfford
          ? 'bg-emerald-500/45 hover:bg-emerald-500/55 cursor-pointer transform hover:scale-[1.02]'
          : 'bg-white/35 cursor-not-allowed opacity-50'
      }`}
    >
      <div className="p-2 bg-white/20 rounded-lg">
        <Icon className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="flex-1 text-left">
        <div className="flex justify-between items-baseline">
          <h3 className="font-bold text-white text-sm">{upgrade.name}</h3>
          <span className="text-xs text-white/60">{formatNumber(upgrade.price)}</span>
        </div>
        <p className="text-xs text-white/80">{upgrade.description}</p>
      </div>
    </button>
  );
}