import React from 'react';
import { X } from 'lucide-react';
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
      <div className="bg-gray-800 rounded-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Prestige</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          <div className="space-y-4 text-white/90">
            <p>
              Prestige will reset your progress but grant you a permanent production multiplier!
            </p>
            
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm">Current Multiplier: {formatNumber(currentMultiplier)}x</p>
              <p className="text-sm text-emerald-400">
                Next Multiplier: {formatNumber(nextMultiplier)}x
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
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