import React from 'react';
import { Trophy } from 'lucide-react';
import { formatNumber } from '../utils';

interface PrestigeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrestige: () => void;
  currentMultiplier: number;
  nextMultiplier: number;
  omegaUnlocked: boolean;
  requiredAmount?: number;
  currentAmount?: number;
}

export function PrestigeModal({
  isOpen,
  onClose,
  onPrestige,
  currentMultiplier,
  nextMultiplier,
  omegaUnlocked = false,
  requiredAmount = 0,
  currentAmount = 0,
}: PrestigeModalProps) {
  if (!isOpen) return null;

  const canPrestige = omegaUnlocked || (currentAmount >= requiredAmount);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl max-w-md w-full shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Trophy className={`w-5 h-5 ${omegaUnlocked ? 'text-purple-400' : 'text-yellow-400'}`} />
              <h2 className="text-xl font-bold text-white">
                {omegaUnlocked ? 'Omega Prestige' : 'Prestige'}
              </h2>
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
              {omegaUnlocked 
                ? "Omega Prestige grants exponentially higher multipliers but requires more resources!"
                : "Prestige will reset your progress but grant you a permanent production multiplier!"}
            </p>
            
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/90">
                Current Multiplier: {formatNumber(currentMultiplier)}x
              </p>
              <p className={`text-sm ${omegaUnlocked ? 'text-purple-400' : 'text-emerald-400'}`}>
                Next Multiplier: {formatNumber(nextMultiplier)}x
              </p>
              {!omegaUnlocked && requiredAmount > 0 && (
                <p className="text-sm text-white/70 mt-2">
                  Progress: {formatNumber(currentAmount)} / {formatNumber(requiredAmount)}
                </p>
              )}
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
                disabled={!canPrestige}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  canPrestige
                    ? omegaUnlocked
                      ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                    : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                }`}
              >
                {omegaUnlocked ? 'Omega Prestige' : 'Prestige'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

