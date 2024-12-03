import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { chance } from '../utils';

interface LuckyShapeProps {
  onCollect: (amount: number, isBonus: boolean, multiplier?: number, duration?: number) => void;
  hasClover: boolean;
  hasDimensionalRifts: boolean;
}

interface Position {
  x: number;
  y: number;
}

export function LuckyShape({ onCollect, hasClover, hasDimensionalRifts }: LuckyShapeProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isCollected, setIsCollected] = useState(false);
  const [spawnTimer, setSpawnTimer] = useState<number>(0);

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (!isVisible && !isCollected) {
        // Increase spawn chance (original rate)
        const baseChance = 0.09; // 10% base chance per second
        const bonusChance = hasClover ? 0.1 : 0; // +10% with clover upgrade
        const totalChance = baseChance + bonusChance;

        if (Math.random() < totalChance) {
          const newPosition = getRandomPosition(hasDimensionalRifts);
          setPosition(newPosition);
          setIsVisible(true);
          setSpawnTimer(0);
        }
      } else if (isVisible) {
        setSpawnTimer(prev => {
          if (prev >= 5) { // Disappear after 5 seconds
            setIsVisible(false);
            setIsCollected(false);
            return 0;
          }
          return prev + 1;
        });
      }
    }, 1000); // Check every second

    return () => clearInterval(spawnInterval);
  }, [isVisible, isCollected, hasClover, hasDimensionalRifts]);

  const handleClick = () => {
    // Determine reward type
    const isMultiplierBonus = Math.random() < 0.3; // 30% chance for multiplier bonus

    if (isMultiplierBonus) {
      // Random multiplier (x5, x10, or x15) for 10 seconds
      const multipliers = [5, 10, 15];
      const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
      onCollect(0, true, multiplier, 10);
    } else {
      // Random shapes between 1 and 10000
      const amount = Math.floor(Math.random() * 100) + 1;
      onCollect(amount, false);
    }

    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed z-40 animate-sparkle"
      style={{
        left: position!.x,
        top: position!.y,
        transform: hasDimensionalRifts ? `rotate(${Math.random() * 360}deg)` : undefined
      }}
    >
      <Star className="w-8 h-8 text-yellow-400 drop-shadow-glow" />
    </button>
  );
}

function getRandomPosition(allowFullScreen: boolean = false): Position {
  const padding = 100; // Keep shapes away from edges
  const maxWidth = window.innerWidth - padding * 2;
  const maxHeight = window.innerHeight - padding * 2;

  if (allowFullScreen) {
    // Can spawn anywhere on screen
    return {
      x: padding + Math.random() * maxWidth,
      y: padding + Math.random() * maxHeight
    };
  } else {
    // Original spawn logic (right side only)
    return {
      x: window.innerWidth - padding - Math.random() * (maxWidth / 3),
      y: padding + Math.random() * maxHeight
    };
  }
}