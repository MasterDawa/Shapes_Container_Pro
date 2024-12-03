import Decimal from 'decimal.js';

export type BuildingId =
  // Existing buildings
  | 'box' | 'crate' | 'vault' | 'warehouse' | 'factory' 
  | 'megaplex' | 'citadel' | 'nexus' | 'dimension' | 'multiverse'
  | 'quantum' | 'celestial' | 'infinity' | 'eternal' | 'omega'
  // New buildings
  | 'starforge' | 'nebula' | 'galaxy' | 'universe' | 'multiverse'
  | 'timeloop' | 'paradox' | 'reality' | 'existence' | 'omnipotence';

export const colorVariants = {
  blue: 'bg-blue-500/55 hover:bg-blue-500/65',
  // ... rest of the color variants
};

export type ColorVariant = keyof typeof colorVariants;

export interface Building {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  baseProduction: number;
  currentLevel: number;
  maxLevel: number;
  prestigeLevel: number;
  prestigeRank: string;
  color: string;
  unlockAt: number;
  baseUnlockAt: number;
  production: number;
  owned: number;
  upgrades: Upgrade[];
  baseCost: number;
  currentCost: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  currentCost: number;
  price: number;
  currentLevel: number;
  maxLevel: number;
  baseMultiplier: number;
  multiplier: number;
  type: 'click' | 'production' | 'golden' | 'hybrid';
  unlockAt: number;
  purchased: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward?: {
    type: 'production' | 'click' | 'golden' | 'hybrid';
    value: number;
  };
  condition: (state: GameState) => boolean;
}

export interface Stats {
  totalClicks: number;
  timePlayed: number;
  highestShapes: number;
  totalPrestiges: number;
  luckyShapesClicked: number;
}

export interface Resource {
  amount: Decimal;
  earned: Decimal;
  perSecond: Decimal;
}

export interface GameSave {
  timestamp: number;
  shapes: Resource;
  buildings: Building[];
  upgrades: Upgrade[];
  prestigePoints: number;
  prestigeMultiplier: number;
  stats: Stats;
  version: string;
}

export interface HighScore {
  date: string;
  shapes: number;
  prestigePoints: number;
  timePlayed: number;
}

export const PRESTIGE_RANKS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export interface GameState {
  shapes: Resource;
  buildings: Building[];
  upgrades: Upgrade[];
  stats: Stats;
  prestigePoints: number;
  prestigeMultiplier: number;
}

export interface ClickerIcon {
  id: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  component: React.ComponentType<any> | React.ComponentType<any>[];
  description: string;
  unlocked: boolean;
  dropRate: number;
  animation?: string;
  effects?: {
    type: 'particle' | 'trail' | 'sound' | 'visual';
    config: any;
  }[];
}