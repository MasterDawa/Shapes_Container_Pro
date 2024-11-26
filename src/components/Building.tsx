import React from 'react';
import { Building as BuildingType } from '../types';
import { formatNumber } from '../utils';
import { Box, Package, Warehouse, Factory, Building2, Cpu, Globe2, Boxes, Hexagon, Infinity, Zap, Star, Compass, Gem, Crown } from 'lucide-react';

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
};

interface BuildingProps {
  building: BuildingType;
  canAfford: boolean;
  onClick: () => void;
}

export function Building({ building, canAfford, onClick }: BuildingProps) {
  const Icon = icons[building.id as keyof typeof icons];
  const price = Math.floor(building.basePrice * Math.pow(1.15, building.owned));
  const colorClass = colorVariants[building.color as keyof typeof colorVariants];

  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      className={`w-full p-4 rounded-xl transition-all duration-200 flex items-center gap-3 ${
        canAfford
          ? `${colorClass} cursor-pointer transform hover:scale-[1.02]`
          : 'bg-white/35 cursor-not-allowed opacity-50'
      } backdrop-blur-sm shadow-lg`}
    >
      <div className={`p-2 ${colorClass} rounded-lg`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 text-left">
        <div className="flex justify-between items-baseline">
          <h3 className="font-bold text-white text-base">
            {building.name} ({building.owned})
          </h3>
          <span className="text-sm text-white/80">{formatNumber(price)}</span>
        </div>
        <p className="text-xs text-white/90">{building.description}</p>
        <p className="text-xs text-white/80">
          Producing {formatNumber(building.production * building.owned)}/s
        </p>
      </div>
    </button>
  );
}