import { 
  Square, Triangle, Circle, Star, Heart, 
  Gem, Crown, Zap, Diamond, Hexagon 
} from 'lucide-react';
import type { ClickerIcon } from '../types';

export const DEFAULT_CLICKER: ClickerIcon = {
  id: 'basic_circle',
  name: 'Basic Circle',
  rarity: 'common',
  component: Circle,
  description: 'A simple circle shape',
  unlocked: true,
  dropRate: 100
};

export const CLICKER_ICONS: ClickerIcon[] = [DEFAULT_CLICKER, /* ... other clickers */];

// Add more rare clickers with unique effects... 