import React, { useState, useEffect } from 'react';
import { Circle, Square, Triangle, Octagon } from 'lucide-react';
import { useAudio } from '../services/AudioService';

const SHAPES = [Circle, Square, Triangle, Octagon];

interface ClickAnimation {
  id: number;
  amount: number;
  x: number;
  y: number;
}

interface ShapeButtonProps {
  onClick: () => void;
  isPressed: boolean;
  clickPower: number;
  soundEnabled?: boolean;
}

export function ShapeButton({ onClick, isPressed, clickPower, soundEnabled = true }: ShapeButtonProps) {
  const { playClickSound } = useAudio(soundEnabled, false);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [animations, setAnimations] = useState<ClickAnimation[]>([]);
  const [nextId, setNextId] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setAnimations(prev => [...prev, {
      id: nextId,
      amount: Math.floor(clickPower),
      x,
      y
    }]);
    setNextId(prev => prev + 1);

    // Cycle through shapes
    setCurrentShapeIndex(prev => (prev + 1) % SHAPES.length);

    playClickSound();
    onClick();
  };

  const CurrentShape = SHAPES[currentShapeIndex];

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`
          relative
          w-48 h-48
          rounded-full
          bg-gradient-to-br from-blue-400 to-blue-600
          hover:from-blue-300 hover:to-blue-500
          active:from-blue-500 active:to-blue-700
          transition-all duration-200
          shadow-lg hover:shadow-xl
          ${isPressed ? 'scale-95' : 'scale-100'}
          overflow-hidden
          group
        `}
      >
        <CurrentShape className="w-24 h-24 mx-auto text-white/90 transition-transform group-hover:scale-110" />
        
        {animations.map(({ id, amount, x, y }) => (
          <div
            key={id}
            className="absolute pointer-events-none animate-float-up select-none"
            style={{
              left: x,
              top: y,
              animation: 'float-up 1.5s ease-out forwards'
            }}
          >
            <span className="text-white font-bold text-lg">
              +{amount.toLocaleString()}
            </span>
          </div>
        ))}
      </button>
    </div>
  );
} 