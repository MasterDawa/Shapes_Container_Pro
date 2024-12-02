import React, { useState } from 'react';
import { Sparkles, Gift } from 'lucide-react';

// Utility function for chance (kept from previous implementation)
const chance = (probability: number) => Math.random() * 100 < probability;

interface LuckyShapeProps {
  onCollect: (amount: number, isGolden: boolean) => void;
  hasClover?: boolean;
  hasDimensionalRifts?: boolean;
}

// LuckyShape component remains the same as in the previous implementation
export function LuckyShape({ onCollect, hasClover = false, hasDimensionalRifts = false }: LuckyShapeProps) {
  const [position, setPosition] = useState({ left: '0%', top: '0%' });
  const [isVisible, setIsVisible] = useState(false);
  const [isInteractable, setIsInteractable] = useState(false);

  // Generate truly random spawn position
  const generateRandomPosition = React.useCallback(() => {
    const left = Math.random() * 90;
    const top = Math.random() * 90;
    return { left: `${left}%`, top: `${top}%` };
  }, []);

  // Spawn logic with improved randomness
  React.useEffect(() => {
    const spawnShape = () => {
      if (!isVisible && chance(25)) {
        const newPosition = generateRandomPosition();
        setPosition(newPosition);
        setIsVisible(true);
        setIsInteractable(false);

        const interactableTimeout = setTimeout(() => {
          setIsInteractable(true);
        }, 500);

        const despawnTimeout = setTimeout(() => {
          setIsVisible(false);
          setIsInteractable(false);
        }, 5000);

        return () => {
          clearTimeout(interactableTimeout);
          clearTimeout(despawnTimeout);
        };
      }
    };

    const interval = setInterval(spawnShape, Math.random() * 3000 + 2000);
    return () => clearInterval(interval);
  }, [isVisible, generateRandomPosition]);

  // Click handler with improved reward logic
  const handleClick = () => {
    if (!isInteractable) return;

    const boost = hasClover ? 4 : 1;
    
    if (chance(30)) {
      const baseAmount = Math.max(10, Math.random() * 250);
      const amount = Math.floor(baseAmount * boost);
      onCollect(amount, false);
    } else {
      const amount = Math.floor(5 * boost);
      onCollect(amount, true);
    }
    
    setIsVisible(false);
    setIsInteractable(false);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        left: position.left,
        top: position.top,
        zIndex: 50,
        cursor: isInteractable ? 'pointer' : 'default',
      }}
      className={`
        absolute 
        p-4 
        bg-yellow-500/30 
        hover:bg-yellow-500/50 
        rounded-full 
        backdrop-blur-sm 
        transition-all 
        duration-300 
        ${isInteractable ? 'scale-100 opacity-100' : 'scale-90 opacity-70'}
      `}
      disabled={!isInteractable}
    >
      <Sparkles 
        className={`
          w-8 h-8 
          text-yellow-400 
          animate-pulse 
          ${isInteractable ? 'text-yellow-500' : 'text-yellow-300'}
        `} 
      />
    </button>
  );
}

// Updated GameComponent with reward tracking and display
export function GameComponent() {
  const [totalRewards, setTotalRewards] = useState(0);
  const [goldenRewards, setGoldenRewards] = useState(0);
  const [rewardHistory, setRewardHistory] = useState<{amount: number, isGolden: boolean}[]>([]);

  const handleCollect = (amount: number, isGolden: boolean) => {
    // Update total rewards
    setTotalRewards(prev => prev + amount);

    // Track golden rewards
    if (isGolden) {
      setGoldenRewards(prev => prev + 1);
    }

    // Keep track of reward history (last 5 rewards)
    setRewardHistory(prev => {
      const updated = [...prev, { amount, isGolden }];
      return updated.slice(-5); // Keep only the last 5 rewards
    });

    // Optional console log for debugging
    console.log(`Collected ${amount} ${isGolden ? 'golden' : 'normal'} reward!`);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden p-4 bg-gray-100">
      {/* Rewards Dashboard */}
      <div className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50">
        <div className="flex items-center mb-2">
          <Gift className="mr-2 text-green-500" />
          <h2 className="text-xl font-bold">Rewards Dashboard</h2>
        </div>
        <div className="space-y-2">
          <p>Total Rewards: <span className="font-semibold">{totalRewards}</span></p>
          <p>Golden Rewards: <span className="font-semibold text-yellow-500">{goldenRewards}</span></p>
        </div>
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Recent Rewards:</h3>
          <ul>
            {rewardHistory.map((reward, index) => (
              <li 
                key={index} 
                className={`
                  ${reward.isGolden ? 'text-yellow-600' : 'text-gray-700'}
                  ${reward.isGolden ? 'font-bold' : ''}
                `}
              >
                {reward.amount} {reward.isGolden ? '(Golden!)' : ''}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lucky Shape spawner with clover bonus */}
      <LuckyShape 
        onCollect={handleCollect} 
        hasClover={true} 
        hasDimensionalRifts={false} 
      />
    </div>
  );
}