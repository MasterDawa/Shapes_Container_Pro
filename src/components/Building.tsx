import React from 'react';
import { Building as BuildingType } from '../types';
import { formatNumber } from '../utils';
import { formatDecimal } from '../utils/decimal';
import { Box, Package, Warehouse, Factory, Building2, Cpu, Globe2, Boxes, Hexagon, Infinity, Zap, Star, Compass, Gem, Crown } from 'lucide-react';
import Decimal from 'decimal.js';
import { calculateBuildingProduction, calculateBuildingCost, canPrestigeBuilding, getNextPrestigeRank } from '../constants';
import { Button } from './Button';

const icons = {
  box: Box,
  crate: Package,
  vault: Building2,
  warehouse: Warehouse,
  factory: Factory,
  megaplex: Boxes,
  citadel: Globe2,
  nexus: Hexagon,
  dimension: Compass,
  multiverse: Globe2,
  quantum: Cpu,
  celestial: Star,
  infinity: Infinity,
  eternal: Gem,
  omega: Crown,
};

const colorVariants = {
  blue: 'bg-blue-500/55 hover:bg-blue-500/65',
  emerald: 'bg-emerald-500/55 hover:bg-emerald-500/65',
  purple: 'bg-purple-500/55 hover:bg-purple-500/65',
  amber: 'bg-amber-500/55 hover:bg-amber-500/65',
  rose: 'bg-rose-500/55 hover:bg-rose-500/65',
  indigo: 'bg-indigo-500/55 hover:bg-indigo-500/65',
  cyan: 'bg-cyan-500/55 hover:bg-cyan-500/65',
  fuchsia: 'bg-fuchsia-500/55 hover:bg-fuchsia-500/65',
  lime: 'bg-lime-500/55 hover:bg-lime-500/65',
  orange: 'bg-orange-500/55 hover:bg-orange-500/65',
  teal: 'bg-teal-500/55 hover:bg-teal-500/65',
  pink: 'bg-pink-500/55 hover:bg-pink-500/65',
  violet: 'bg-violet-500/55 hover:bg-violet-500/65',
  sky: 'bg-sky-500/55 hover:bg-sky-500/65',
  red: 'bg-red-500/55 hover:bg-red-500/65',
  slate: 'bg-slate-500/55 hover:bg-slate-500/65',
  zinc: 'bg-zinc-500/55 hover:bg-zinc-500/65',
  neutral: 'bg-neutral-500/55 hover:bg-neutral-500/65',
  stone: 'bg-stone-500/55 hover:bg-stone-500/65',
  yellow: 'bg-yellow-500/55 hover:bg-yellow-500/65',
  green: 'bg-green-500/55 hover:bg-green-500/65',
  gray: 'bg-gray-500/55 hover:bg-gray-500/65',
  warmGray: 'bg-warmGray-500/55 hover:bg-warmGray-500/65',
  trueGray: 'bg-trueGray-500/55 hover:bg-trueGray-500/65',
  coolGray: 'bg-coolGray-500/55 hover:bg-coolGray-500/65',
};

interface BuildingProps {
  building: BuildingType;
  canAfford: boolean;
  onClick: () => void;
  currentShapes: number;
  soundEnabled?: boolean;
}

export function Building({ building, canAfford, onClick, currentShapes, soundEnabled = true }: BuildingProps) {
  const Icon = icons[building.id as keyof typeof icons] || Box;
  const price = calculateBuildingCost(building);
  const colorClass = colorVariants[building.color as keyof typeof colorVariants] || colorVariants.blue;
  const isLocked = building.unlockAt > currentShapes;
  const canBuy = canAfford && !isLocked;
  
  const currentProduction = calculateBuildingProduction(building);
  const nextLevelProduction = calculateBuildingProduction({
    ...building,
    currentLevel: building.currentLevel + 1,
    owned: (building.owned || 0) + 1
  });

  return (
    <Button
      onClick={onClick}
      disabled={!canBuy}
      soundEnabled={soundEnabled}
      className={`
        w-full p-4 rounded-xl transition-all duration-200 flex items-center gap-3
        ${isLocked 
          ? 'bg-gray-800/50 cursor-not-allowed opacity-75'
          : canBuy
            ? `${colorClass} cursor-pointer transform hover:scale-[1.02]`
            : 'bg-white/35 cursor-not-allowed opacity-50'
        } backdrop-blur-sm shadow-lg
      `}
    >
      <div className={`p-2 ${isLocked ? 'bg-gray-700/50' : colorClass} rounded-lg`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 text-left">
        <div className="flex justify-between items-baseline">
          <div>
            <h3 className="font-bold text-white text-base">
              {building.name} [{building.prestigeRank}]
            </h3>
            <p className="text-xs text-white/60">
              Level ({building.currentLevel}/{building.maxLevel})
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm text-white/80">
              Cost: {formatDecimal(price)}
            </span>
            <p className="text-xs text-white/60">
              Owned: {building.owned}
            </p>
          </div>
        </div>
        
        <p className="text-xs text-white/90 mt-1">{building.description}</p>
        
        {isLocked ? (
          <p className="text-xs text-red-400 mt-1">
            Unlocks at {formatDecimal(new Decimal(building.unlockAt))} shapes
          </p>
        ) : (
          <div className="mt-1">
            <p className="text-xs text-white/80">
              Current: {formatDecimal(currentProduction)}/s
            </p>
            <p className="text-xs text-green-400">
              Next Level: {formatDecimal(nextLevelProduction)}/s
            </p>
          </div>
        )}
      </div>
    </Button>
  );
}