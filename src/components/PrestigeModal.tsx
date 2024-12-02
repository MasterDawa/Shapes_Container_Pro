import React from 'react';
import { X, Trophy } from 'lucide-react';
import { formatNumber } from '../utils';

interface PrestigeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrestige: () => void;
  currentMultiplier: number;
  nextMultiplier: number;
}

export function PrestigeModal({
  isOpen,
  onClose,
  onPrestige,
  currentMultiplier,
  nextMultiplier,
}: PrestigeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl max-w-md w-full shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Prestige</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white/80"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <p className="text-white/90">
              Prestige will reset your progress but grant you a permanent production multiplier!
            </p>
            
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/90">Current Multiplier: {formatNumber(currentMultiplier)}x</p>
              <p className="text-sm text-emerald-400">
                Next Multiplier: {formatNumber(nextMultiplier)}x
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/90"
              >
                Cancel
              </button>
              <button
                onClick={onPrestige}
                className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors text-emerald-400"
              >
                Prestige
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

