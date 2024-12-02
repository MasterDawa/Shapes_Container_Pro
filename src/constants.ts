import { Building, Upgrade, Achievement } from './types';

export const BUILDINGS: Building[] = [
  {
    id: 'box',
    name: 'Shape Box',
    namePlural: 'Shape Boxes',
    description: 'A basic container that produces shapes slowly',
    basePrice: 15,
    production: 0.1,
    owned: 0,
    unlockAt: 0,
    color: 'blue'
  },
  {
    id: 'crate',
    name: 'Shape Crate',
    namePlural: 'Shape Crates',
    description: 'A larger container with improved production',
    basePrice: 100,
    production: 0.5,
    owned: 0,
    unlockAt: 100,
    color: 'emerald'
  },
  {
    id: 'vault',
    name: 'Shape Vault',
    namePlural: 'Shape Vaults',
    description: 'A secure facility for mass shape production',
    basePrice: 600,
    production: 5,
    owned: 0,
    unlockAt: 600,
    color: 'purple'
  },
  {
    id: 'warehouse',
    name: 'Shape Warehouse',
    namePlural: 'Shape Warehouses',
    description: 'Industrial-scale shape manufacturing',
    basePrice: 4000,
    production: 12,
    owned: 0,
    unlockAt: 4000,
    color: 'amber'
  },
  {
    id: 'factory',
    name: 'Shape Factory',
    namePlural: 'Shape Factories',
    description: 'Automated shape production facility',
    basePrice: 20000,
    production: 90,
    owned: 0,
    unlockAt: 20000,
    color: 'rose'
  },
  {
    id: 'megaplex',
    name: 'Shape Megaplex',
    namePlural: 'Shape Megaplexes',
    description: 'Massive shape production complex',
    basePrice: 100000,
    production: 500,
    owned: 0,
    unlockAt: 100000,
    color: 'indigo'
  },
  {
    id: 'citadel',
    name: 'Shape Citadel',
    namePlural: 'Shape Citadels',
    description: 'Fortress of infinite shape creation',
    basePrice: 500000,
    production: 2500,
    owned: 0,
    unlockAt: 500000,
    color: 'cyan'
  },
  {
    id: 'nexus',
    name: 'Shape Nexus',
    namePlural: 'Shape Nexi',
    description: 'Interdimensional shape generation hub',
    basePrice: 2000000,
    production: 10000,
    owned: 0,
    unlockAt: 2000000,
    color: 'fuchsia'
  },
  {
    id: 'dimension',
    name: 'Shape Dimension',
    namePlural: 'Shape Dimensions',
    description: 'Pocket universe of pure shape energy',
    basePrice: 10000000,
    production: 50000,
    owned: 0,
    unlockAt: 10000000,
    color: 'lime'
  },
  {
    id: 'multiverse',
    name: 'Shape Multiverse',
    namePlural: 'Shape Multiverses',
    description: 'Infinite realities of shape creation',
    basePrice: 50000000,
    production: 250000,
    owned: 0,
    unlockAt: 50000000,
    color: 'orange'
  },
  {
    id: 'quantum',
    name: 'Quantum Engine',
    namePlural: 'Quantum Engines',
    description: 'Harness quantum mechanics for shapes',
    basePrice: 200000000,
    production: 1000000,
    owned: 0,
    unlockAt: 200000000,
    color: 'teal'
  },
  {
    id: 'celestial',
    name: 'Celestial Forge',
    namePlural: 'Celestial Forges',
    description: 'Cosmic shape creation matrix',
    basePrice: 1000000000,
    production: 5000000,
    owned: 0,
    unlockAt: 1000000000,
    color: 'pink'
  },
  {
    id: 'infinity',
    name: 'Infinity Matrix',
    namePlural: 'Infinity Matrices',
    description: 'Boundless shape generation system',
    basePrice: 5000000000,
    production: 25000000,
    owned: 0,
    unlockAt: 5000000000,
    color: 'violet'
  },
  {
    id: 'eternal',
    name: 'Eternal Core',
    namePlural: 'Eternal Cores',
    description: 'Timeless shape manifestation',
    basePrice: 25000000000,
    production: 100000000,
    owned: 0,
    unlockAt: 25000000000,
    color: 'sky'
  },
  {
    id: 'omega',
    name: 'Omega Singularity',
    namePlural: 'Omega Singularities',
    description: 'Ultimate shape creation power',
    basePrice: 100000000000,
    production: 500000000,
    owned: 0,
    unlockAt: 100000000000,
    color: 'red'
  }
];

export const UPGRADES: Upgrade[] = [
  {
    id: 'click1',
    name: 'Better Clicks',
    description: 'Double your click power',
    price: 100,
    type: 'click',
    multiplier: 2,
    purchased: false,
    unlockAt: 100
  },
  {
    id: 'prod1',
    name: 'Enhanced Production',
    description: 'Double all shape production',
    price: 500,
    type: 'production',
    multiplier: 2,
    purchased: false,
    unlockAt: 500
  },
  {
    id: 'golden1',
    name: 'Lucky Clover',
    description: 'Quadruple rewards from lucky shapes',
    price: 1000,
    type: 'golden',
    multiplier: 4,
    purchased: false,
    unlockAt: 1000
  },
  {
    id: 'click2',
    name: 'Power Clicks',
    description: 'Triple your click power',
    price: 5000,
    type: 'click',
    multiplier: 3,
    purchased: false,
    unlockAt: 5000
  },
  {
    id: 'prod2',
    name: 'Turbo Production',
    description: 'Triple all shape production',
    price: 10000,
    type: 'production',
    multiplier: 3,
    purchased: false,
    unlockAt: 10000
  },
  {
    id: 'golden2',
    name: 'Golden Touch',
    description: 'Double chance for golden containers',
    price: 25000,
    type: 'golden',
    multiplier: 2,
    purchased: false,
    unlockAt: 25000
  },
  {
    id: 'golden3',
    name: 'Dimensional Rifts',
    description: 'Lucky shapes can now appear from any direction',
    price: 100000,
    type: 'golden',
    multiplier: 1.5,
    purchased: false,
    unlockAt: 100000
  },
  {
    id: 'click4',
    name: 'Shape Resonance',
    description: 'Each owned building adds 1% to click power',
    price: 250000,
    type: 'click',
    multiplier: 1.01,
    purchased: false,
    unlockAt: 250000
  },
  {
    id: 'prod4',
    name: 'Quantum Entanglement',
    description: 'Golden containers boost production by 10% each',
    price: 500000,
    type: 'production',
    multiplier: 1.1,
    purchased: false,
    unlockAt: 500000
  },
  {
    id: 'hybrid1',
    name: 'Synergy Matrix',
    description: 'Production and click power boost each other by 5%',
    price: 1000000,
    type: 'hybrid',
    multiplier: 1.05,
    purchased: false,
    unlockAt: 1000000
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'firstBox',
    name: 'Box Collector',
    description: 'Buy your first Shape Box',
    icon: 'Box',
    reward: { type: 'production', value: 1.1 }
  },
  {
    id: 'tenBoxes',
    name: 'Box Enthusiast',
    description: 'Own 10 Shape Boxes',
    icon: 'Package',
    reward: { type: 'production', value: 1.2 }
  },
  {
    id: 'firstGolden',
    name: 'Golden Touch',
    description: 'Collect your first Golden Container',
    icon: 'Crown',
    reward: { type: 'golden', value: 1.5 }
  },
  {
    id: 'speedDemon',
    name: 'Speed Demon',
    description: 'Reach 100 shapes per second',
    icon: 'Zap',
    reward: { type: 'production', value: 1.5 }
  },
  {
    id: 'millionaire',
    name: 'Shape Millionaire',
    description: 'Have 1,000,000 shapes at once',
    icon: 'Trophy',
    reward: { type: 'click', value: 2 }
  },
  {
    id: 'collector',
    name: 'Master Collector',
    description: 'Own at least one of each building',
    icon: 'Award',
    reward: { type: 'production', value: 2 }
  },
  {
    id: 'upgrader',
    name: 'Upgrade Master',
    description: 'Purchase 5 different upgrades',
    icon: 'Star',
    reward: { type: 'hybrid', value: 1.5 }
  },
  {
    id: 'goldenHoard',
    name: 'Golden Hoard',
    description: 'Have 100 Golden Containers at once',
    icon: 'GemIcon',
    reward: { type: 'golden', value: 2 }
  },
  {
    id: 'dedicated',
    name: 'Dedicated Clicker',
    description: 'Click 1,000 times'
  },
  {
    id: 'transcended',
    name: 'Transcended',
    description: 'Perform your first prestige',
    icon: 'Sparkles'
  }
];