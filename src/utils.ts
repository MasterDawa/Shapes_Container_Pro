export function formatNumber(num: number): string {
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

export function chance(percentage: number): boolean {
  return Math.random() * 100 < percentage;
}

export const BUILDINGS: Building[] = [
  // Tier 1 (Early Game)
  {
    id: 'box',
    name: 'Box',
    description: 'A simple box that generates resources',
    basePrice: 10,
    production: 0.1,
    color: 'blue',
    upgrades: [
      {
        id: 'box-1',
        name: 'Bigger Boxes',
        description: 'Double box production',
        cost: 100,
        multiplier: 2,
        purchased: false,
        unlockAt: 10
      },
      // Add more upgrades...
    ]
  },
  // ... existing buildings ...
  
  // New High-Tier Buildings
  {
    id: 'starforge',
    name: 'Star Forge',
    description: 'Harness the power of stars',
    basePrice: 1e15,
    production: 1e12,
    color: 'yellow',
    unlockAt: 1e14,
    upgrades: [
      {
        id: 'starforge-1',
        name: 'Stellar Enhancement',
        description: '5x Star Forge production',
        cost: 1e17,
        multiplier: 5,
        purchased: false,
        unlockAt: 5
      }
    ]
  },
  // Add more new buildings...
];

// Add upgrade tiers that scale with progress
export const UPGRADE_TIERS = [
  { threshold: 10, multiplier: 2, cost: 100 },
  { threshold: 25, multiplier: 3, cost: 1000 },
  { threshold: 50, multiplier: 5, cost: 10000 },
  { threshold: 100, multiplier: 10, cost: 100000 },
  { threshold: 250, multiplier: 25, cost: 1000000 },
  // Add more tiers...
];

// Prestige system multipliers
export const PRESTIGE_MULTIPLIERS = {
  tier1: 1.5,
  tier2: 2,
  tier3: 3,
  tier4: 5,
  tier5: 10
};