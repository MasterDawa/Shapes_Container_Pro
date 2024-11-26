import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { chance } from '../utils';

interface LuckyShapeProps {
  onCollect: (amount: number, isGolden: boolean) => void;
  hasClover: boolean;
  hasDimensionalRifts?: boolean;
}

export function LuckyShape({ onCollect, hasClover, hasDimensionalRifts }: LuckyShapeProps) {
  const [position, setPosition] = useState({ left: '100%', top: '0%' });
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState<string>('left');

  useEffect(() => {
    const spawnShape = () => {
      if (!isVisible && chance(15)) { // Reduced frequency
        let startPos, endPos;
        
        if (hasDimensionalRifts) {
          // Random direction when dimensional rifts are unlocked
          const directions = [
            'left', 'right', 'top', 'bottom',
            'topleft', 'topright', 'bottomleft', 'bottomright'
          ];
          const newDirection = directions[Math.floor(Math.random() * directions.length)];
          setDirection(newDirection);

          switch (newDirection) {
            case 'left':
              startPos = { left: '100%', top: `${30 + Math.random() * 40}%` };
              endPos = { left: '-10%', top: startPos.top };
              break;
            case 'right':
              startPos = { left: '-10%', top: `${30 + Math.random() * 40}%` };
              endPos = { left: '100%', top: startPos.top };
              break;
            case 'top':
              startPos = { left: `${Math.random() * 100}%`, top: '-10%' };
              endPos = { left: startPos.left, top: '100%' };
              break;
            case 'bottom':
              startPos = { left: `${Math.random() * 100}%`, top: '100%' };
              endPos = { left: startPos.left, top: '-10%' };
              break;
            case 'topleft':
              startPos = { left: '100%', top: '-10%' };
              endPos = { left: '-10%', top: '100%' };
              break;
            case 'topright':
              startPos = { left: '-10%', top: '-10%' };
              endPos = { left: '100%', top: '100%' };
              break;
            case 'bottomleft':
              startPos = { left: '100%', top: '100%' };
              endPos = { left: '-10%', top: '-10%' };
              break;
            case 'bottomright':
              startPos = { left: '-10%', top: '100%' };
              endPos = { left: '100%', top: '-10%' };
              break;
            default:
              startPos = { left: '100%', top: `${30 + Math.random() * 40}%` };
              endPos = { left: '-10%', top: startPos.top };
          }
        } else {
          // Default left-to-right movement
          startPos = { left: '100%', top: `${30 + Math.random() * 40}%` };
          endPos = { left: '-10%', top: startPos.top };
        }
        
        setIsVisible(true);
        setPosition(startPos);
        
        setTimeout(() => {
          setPosition(endPos);
        }, 100);

        setTimeout(() => {
          setIsVisible(false);
        }, 8000);
      }
    };

    const interval = setInterval(spawnShape, 4000);
    return () => clearInterval(interval);
  }, [isVisible, hasDimensionalRifts]);

  const handleClick = () => {
    const boost = hasClover ? 4 : 1;
    
    if (chance(25)) {
      const baseAmount = Math.max(7, Math.random() * 180);
      const amount = Math.floor(baseAmount * boost);
      onCollect(amount, false);
    } else {
      const amount = Math.floor(1 * boost);
      onCollect(amount, true);
    }
    
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        left: position.left,
        top: position.top,
        transition: 'all 8s linear',
        transform: direction.includes('right') ? 'scaleX(-1)' : 'none',
      }}
      className="p-3 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-full backdrop-blur-sm"
    >
      <Sparkles className="w-6 h-6 text-yellow-400 animate-sparkle" />
    </button>
  );
}