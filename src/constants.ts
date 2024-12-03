import { Building, Upgrade, Achievement } from './types';
import Decimal from 'decimal.js';
import { toDecimal } from './utils/decimal';

export const BUILDINGS: Building[] = [
  {
    id: 'box',
    name: 'Shape Box',
    description: 'A basic container that produces shapes slowly',
    basePrice: 10,
    baseProduction: 0.1,
    currentLevel: 0,
    maxLevel: 100,
    prestigeLevel: 0,
    prestigeRank: 'A',
    color: 'blue',
    baseUnlockAt: 0,
    unlockAt: 0,
    production: 0.1,
    owned: 0,
    upgrades: [],
    baseCost: 10,
    currentCost: 10
  },
  {
    id: 'crate',
    name: 'Shape Crate',
    description: 'A larger container with improved production',
    basePrice: 100,
    baseProduction: 1,
    currentLevel: 0,
    maxLevel: 100,
    prestigeLevel: 0,
    prestigeRank: 'A',
    color: 'emerald',
    baseUnlockAt: 250,
    unlockAt: 250,
    production: 1,
    owned: 0,
    upgrades: [],
    baseCost: 100,
    currentCost: 100
  },
  {
    id: 'vault',
    name: 'Shape Vault',
    description: 'A secure facility for mass shape production',
    basePrice: 2500,
    baseProduction: 10,
    currentLevel: 0,
    maxLevel: 100,
    prestigeLevel: 0,
    prestigeRank: 'A',
    color: 'purple',
    baseUnlockAt: 2500,
    unlockAt: 2500,
    production: 10,
    owned: 0,
    upgrades: [],
    baseCost: 2500,
    currentCost: 2500
  },
  {
    id: 'warehouse',
    name: 'Shape Warehouse',
    description: 'Industrial-scale shape manufacturing',
    basePrice: 1e4,
    baseProduction: 50,
    currentLevel: 0,
    maxLevel: 100,
    prestigeLevel: 0,
    prestigeRank: 'A',
    color: 'amber',
    baseUnlockAt: 4000,
    unlockAt: 4000,
    production: 50,
    owned: 0,
    upgrades: [],
    baseCost: 1e4,
    currentCost: 1e4
  },
  {
    id: 'factory',
    name: 'Shape Factory',
    description: 'Automated shape production facility',
    basePrice: 1e5,
    baseProduction: 250,
    currentLevel: 0,
    maxLevel: 100,
    prestigeLevel: 0,
    prestigeRank: 'A',
    color: 'rose',
    baseUnlockAt: 20000,
    unlockAt: 20000,
    production: 250,
    owned: 0,
    upgrades: [],
    baseCost: 1e5,
    currentCost: 1e5
  },
  {
    id: 'megaplex',
    name: 'Shape Megaplex',
    description: 'Massive shape production complex',
    basePrice: 1e6,
    baseUnlockAt: 100000,
    production: 1e3,
    owned: 0,
    unlockAt: 100000,
    color: 'indigo',
    upgrades: [],
    baseCost: 1e6,
    currentCost: 1e6
  },
  {
    id: 'citadel',
    name: 'Shape Citadel',
    description: 'Fortress of infinite shape creation',
    basePrice: 1e8,
    baseUnlockAt: 500000,
    production: 1e4,
    owned: 0,
    unlockAt: 500000,
    color: 'cyan',
    upgrades: [],
    baseCost: 1e8,
    currentCost: 1e8
  },
  {
    id: 'nexus',
    name: 'Shape Nexus',
    description: 'Interdimensional shape generation hub',
    basePrice: 1e10,
    baseUnlockAt: 2000000,
    production: 1e5,
    owned: 0,
    unlockAt: 2000000,
    color: 'fuchsia',
    upgrades: [],
    baseCost: 1e10,
    currentCost: 1e10
  },
  {
    id: 'dimension',
    name: 'Shape Dimension',
    description: 'Pocket universe of pure shape energy',
    basePrice: 1e12,
    baseUnlockAt: 10000000,
    production: 1e6,
    owned: 0,
    unlockAt: 10000000,
    color: 'lime',
    upgrades: [],
    baseCost: 1e12,
    currentCost: 1e12
  },
  {
    id: 'multiverse',
    name: 'Shape Multiverse',
    description: 'Infinite realities of shape creation',
    basePrice: 1e15,
    baseUnlockAt: 50000000,
    production: 1e8,
    owned: 0,
    unlockAt: 50000000,
    color: 'orange',
    upgrades: [],
    baseCost: 1e15,
    currentCost: 1e15
  },
  {
    id: 'quantum',
    name: 'Quantum Engine',
    description: 'Harness quantum mechanics for shapes',
    basePrice: 1e18,
    baseUnlockAt: 200000000,
    production: 1e10,
    owned: 0,
    unlockAt: 200000000,
    color: 'teal',
    upgrades: [],
    baseCost: 1e18,
    currentCost: 1e18
  },
  {
    id: 'celestial',
    name: 'Celestial Forge',
    description: 'Cosmic shape creation matrix',
    basePrice: 1e21,
    baseUnlockAt: 1000000000,
    production: 1e12,
    owned: 0,
    unlockAt: 1000000000,
    color: 'pink',
    upgrades: [],
    baseCost: 1e21,
    currentCost: 1e21
  },
  {
    id: 'infinity',
    name: 'Infinity Matrix',
    description: 'Boundless shape generation system',
    basePrice: 1e24,
    baseUnlockAt: 5000000000,
    production: 1e15,
    owned: 0,
    unlockAt: 5000000000,
    color: 'violet',
    upgrades: [],
    baseCost: 1e24,
    currentCost: 1e24
  },
  {
    id: 'eternal',
    name: 'Eternal Core',
    description: 'Timeless shape manifestation',
    basePrice: 1e27,
    baseUnlockAt: 25000000000,
    production: 1e18,
    owned: 0,
    unlockAt: 25000000000,
    color: 'sky',
    upgrades: [],
    baseCost: 1e27,
    currentCost: 1e27
  },
  {
    id: 'omega',
    name: 'Omega Singularity',
    description: 'Ultimate shape creation power',
    basePrice: 1e30,
    baseUnlockAt: 100000000000,
    production: 1e21,
    owned: 0,
    unlockAt: 100000000000,
    color: 'red',
    upgrades: [],
    baseCost: 1e30,
    currentCost: 1e30
  }
];

export const UPGRADES: Upgrade[] = [
  {
    id: 'click1',
    name: 'Better Clicking',
    description: 'Increase click power (2x per level)',
    baseCost: 100,
    currentCost: 100,
    price: 100,
    currentLevel: 0,
    maxLevel: 50,
    baseMultiplier: 2.0,
    multiplier: 2.0,
    type: 'click',
    unlockAt: 0,
    purchased: false
  },
  {
    id: 'production1',
    name: 'Enhanced Production',
    description: 'Increase all building production',
    baseCost: 500,
    currentCost: 500,
    price: 500,
    currentLevel: 0,
    maxLevel: 50,
    baseMultiplier: 2.0,
    multiplier: 2.0,
    type: 'production',
    unlockAt: 1000,
    purchased: false
  },
  {
    id: 'hybrid1',
    name: 'Synergy',
    description: 'Increase both clicking and production',
    baseCost: 2500,
    currentCost: 2500,
    price: 2500,
    currentLevel: 0,
    maxLevel: 50,
    baseMultiplier: 2.0,
    multiplier: 2.0,
    type: 'hybrid',
    unlockAt: 5000,
    purchased: false
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  // Basic Achievements
  {
    id: 'firstBox',
    name: 'Box Collector',
    description: 'Buy your first Shape Box',
    icon: 'Box',
    reward: { type: 'production', value: 1.1 },
    condition: (state) => state.buildings.find(b => b.id === 'box')?.currentLevel > 0
  },
  {
    id: 'tenBoxes',
    name: 'Box Enthusiast',
    description: 'Reach level 10 with Shape Box',
    icon: 'Package',
    reward: { type: 'production', value: 1.2 },
    condition: (state) => state.buildings.find(b => b.id === 'box')?.currentLevel >= 10
  },

  // Production Achievements
  {
    id: 'speedDemon',
    name: 'Speed Demon',
    description: 'Reach 100 shapes per second',
    icon: 'Zap',
    reward: { type: 'production', value: 1.5 },
    condition: (state) => state.shapes.perSecond >= 100
  },
  {
    id: 'productionMaster',
    name: 'Production Master',
    description: 'Reach 1,000,000 shapes per second',
    icon: 'Factory',
    reward: { type: 'production', value: 2 },
    condition: (state) => state.shapes.perSecond >= 1000000
  },

  // Wealth Achievements
  {
    id: 'millionaire',
    name: 'Shape Millionaire',
    description: 'Have 1,000,000 shapes at once',
    icon: 'Trophy',
    reward: { type: 'click', value: 2 },
    condition: (state) => state.shapes.amount >= 1000000
  },
  {
    id: 'billionaire',
    name: 'Shape Billionaire',
    description: 'Have 1,000,000,000 shapes at once',
    icon: 'Crown',
    reward: { type: 'production', value: 3 },
    condition: (state) => state.shapes.amount >= 1000000000
  },

  // Building Collection Achievements
  {
    id: 'collector',
    name: 'Master Collector',
    description: 'Own at least one of each building',
    icon: 'Award',
    reward: { type: 'production', value: 2 },
    condition: (state) => state.buildings.every(b => b.currentLevel > 0)
  },
  {
    id: 'maxedOut',
    name: 'Maxed Out',
    description: 'Get any building to max level',
    icon: 'Star',
    reward: { type: 'hybrid', value: 2 },
    condition: (state) => state.buildings.some(b => b.currentLevel >= b.maxLevel)
  },

  // Prestige Achievements
  {
    id: 'transcended',
    name: 'Transcended',
    description: 'Perform your first prestige',
    icon: 'Sparkles',
    reward: { type: 'hybrid', value: 1.5 },
    condition: (state) => state.stats.totalPrestiges > 0
  },
  {
    id: 'prestigeMaster',
    name: 'Prestige Master',
    description: 'Prestige 10 times',
    icon: 'Star',
    reward: { type: 'hybrid', value: 2 },
    condition: (state) => state.stats.totalPrestiges >= 10
  },

  // Time-based Achievements
  {
    id: 'dedicated',
    name: 'Dedicated Player',
    description: 'Play for 1 hour',
    icon: 'Clock',
    reward: { type: 'hybrid', value: 1.2 },
    condition: (state) => state.stats.timePlayed >= 3600
  },
  {
    id: 'veteran',
    name: 'Veteran Player',
    description: 'Play for 24 hours total',
    icon: 'Calendar',
    reward: { type: 'hybrid', value: 2 },
    condition: (state) => state.stats.timePlayed >= 86400
  },

  // Click Achievements
  {
    id: 'clickMaster',
    name: 'Click Master',
    description: 'Click 10,000 times',
    icon: 'MousePointer',
    reward: { type: 'click', value: 2 },
    condition: (state) => state.stats.totalClicks >= 10000
  },
  {
    id: 'clickLegend',
    name: 'Click Legend',
    description: 'Click 100,000 times',
    icon: 'MousePointer2',
    reward: { type: 'click', value: 3 },
    condition: (state) => state.stats.totalClicks >= 100000
  },

  // Lucky Shape Achievements
  {
    id: 'luckyClicker',
    name: 'Lucky Clicker',
    description: 'Click 1,000 lucky shapes',
    icon: 'Star',
    reward: { type: 'click', value: 1.5 },
    condition: (state) => state.stats.luckyShapesClicked >= 1000
  },
  {
    id: 'luckyMaster',
    name: 'Lucky Master',
    description: 'Click 10,000 lucky shapes',
    icon: 'Stars',
    reward: { type: 'hybrid', value: 2 },
    condition: (state) => state.stats.luckyShapesClicked >= 10000
  },
  {
    id: 'luckyLegend',
    name: 'Lucky Legend',
    description: 'Click 100,000 lucky shapes',
    icon: 'Sparkles',
    reward: { type: 'hybrid', value: 3 },
    condition: (state) => state.stats.luckyShapesClicked >= 100000
  }
];

export function calculateBuildingProduction(building: Building): Decimal {
  if (!building || typeof building.baseProduction === 'undefined') {
    return new Decimal(0);
  }

  // Base production per building owned
  let production = new Decimal(building.baseProduction).times(building.owned);

  // Level multiplier (x1.5 every 10 levels)
  const levelBonus = new Decimal(1.5).pow(Math.floor(building.currentLevel / 10));
  production = production.times(levelBonus);

  // Prestige bonus (1% per prestige)
  const prestigeMultiplier = new Decimal(1).plus(
    new Decimal(building.prestigeLevel).times(0.01)
  );
  production = production.times(prestigeMultiplier);

  return production;
}

export function calculateBuildingCost(building: Building): Decimal {
  // Base cost with slower growth (10% instead of 15%)
  const baseCost = new Decimal(building.basePrice);
  const levelCost = baseCost.times(
    new Decimal(1.10).pow(building.currentLevel)
  );

  // Additional 5% cost increase per prestige level
  const prestigeCost = levelCost.times(
    new Decimal(1.05).pow(building.prestigeLevel)
  );

  return prestigeCost;
}

export function canPrestigeBuilding(building: Building): boolean {
  return building.currentLevel >= 100;
}

export function getNextPrestigeRank(currentRank: string | undefined): string {
  if (!currentRank) return 'A';
  
  const baseRank = currentRank.charAt(0);
  const suffix = currentRank.slice(1);
  
  if (suffix === '') {
    return baseRank + 'a';
  }
  
  const lastChar = suffix.charAt(suffix.length - 1);
  if (lastChar === 'z') {
    return String.fromCharCode(baseRank.charCodeAt(0) + 1);
  }
  
  return baseRank + suffix.slice(0, -1) + String.fromCharCode(lastChar.charCodeAt(0) + 1);
}

export function calculateUpgradeCost(upgrade: Upgrade): number {
  return upgrade.baseCost * Math.pow(2, upgrade.currentLevel);
}

export function calculateUpgradeMultiplier(upgrade: Upgrade): number {
  return upgrade.baseMultiplier * (1 + upgrade.currentLevel);
}

export const calculateUnlockCost = (building: Building): number => {
  return building.baseUnlockAt * Math.pow(2.5, building.prestigeLevel);
};