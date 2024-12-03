import React from 'react';
import { useAudio } from '../services/AudioService';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  soundEnabled?: boolean;
}

export function Button({ onClick, soundEnabled = true, ...props }: ButtonProps) {
  const { playClickSound } = useAudio(soundEnabled, false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClickSound();
    onClick?.(e);
  };

  return <button {...props} onClick={handleClick} />;
} 