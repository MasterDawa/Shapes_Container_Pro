export type BuildingId =
  // Existing buildings
  | 'box' | 'crate' | 'vault' | 'warehouse' | 'factory' 
  | 'megaplex' | 'citadel' | 'nexus' | 'dimension' | 'multiverse'
  | 'quantum' | 'celestial' | 'infinity' | 'eternal' | 'omega'
  // New buildings
  | 'starforge' | 'nebula' | 'galaxy' | 'universe' | 'multiverse'
  | 'timeloop' | 'paradox' | 'reality' | 'existence' | 'omnipotence';

export type ColorVariant = keyof typeof colorVariants;

export interface Building {
  id: BuildingId;
  name: string;
  description: string;
  basePrice: number;
  production: number;
  owned: number;
  color: ColorVariant;
  unlockAt?: number; // Production threshold to unlock this building
  upgrades?: BuildingUpgrade[];
}

export interface BuildingUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  multiplier: number;
  purchased: boolean;
  unlockAt: number; // Number of buildings owned to unlock this upgrade
}

export interface Resource {
  amount: number;
  earned: number;
  perSecond: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'click' | 'production' | 'golden' | 'hybrid';
  multiplier: number;
  purchased: boolean;
  unlockAt: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
}

export interface Stats {
  totalClicks: number;
  timePlayed: number;
  highestShapes: number;
  totalPrestiges: number;
}