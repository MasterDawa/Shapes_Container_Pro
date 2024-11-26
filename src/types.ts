export interface Building {
  id: string;
  name: string;
  namePlural: string;
  description: string;
  basePrice: number;
  production: number;
  owned: number;
  unlockAt: number;
  color: string;
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
  icon: string;
  reward?: {
    type: 'production' | 'click' | 'golden' | 'hybrid';
    value: number;
  };
}