import React from 'react';
import { X, Volume2, Music, RotateCcw } from 'lucide-react';

interface OptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export function OptionsModal({
  isOpen,
  onClose,
  onReset,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
}: OptionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800/90 rounded-xl max-w-md w-full backdrop-blur-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Options</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={onToggleSound}
              className="w-full p-3 rounded-lg bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-white" />
                <span className="text-white">Sound Effects</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                soundEnabled ? 'bg-emerald-500' : 'bg-gray-600'
              }`}>
                <div className={`w-6 h-6 rounded-full bg-white transform transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </div>
            </button>

            <button
              onClick={onToggleMusic}
              className="w-full p-3 rounded-lg bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-white" />
                <span className="text-white">Background Music</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                musicEnabled ? 'bg-emerald-500' : 'bg-gray-600'
              }`}>
                <div className={`w-6 h-6 rounded-full bg-white transform transition-transform ${
                  musicEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </div>
            </button>

            <button
              onClick={onReset}
              className="w-full p-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors flex items-center gap-3"
            >
              <RotateCcw className="w-5 h-5 text-red-400" />
              <span className="text-red-400">Reset Progress</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}