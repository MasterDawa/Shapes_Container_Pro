import React from 'react';
import { X, Volume2, Music, RotateCcw, Save, LogOut, ArrowLeft } from 'lucide-react';
import { useAudio } from '../services/AudioService';
import { Button } from './Button';

interface OptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  onSave: () => void;
  onExitToMenu: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export function OptionsModal({
  isOpen,
  onClose,
  onReset,
  onSave,
  onExitToMenu,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
}: OptionsModalProps) {
  const { playClickSound } = useAudio(soundEnabled, musicEnabled);

  const handleToggleSound = () => {
    playClickSound();
    onToggleSound();
  };

  const handleToggleMusic = () => {
    playClickSound();
    onToggleMusic();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6">Options</h2>
        
        <div className="space-y-4">
          <Button
            onClick={handleToggleSound}
            className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            soundEnabled={soundEnabled}
          >
            Sound Effects: {soundEnabled ? 'On' : 'Off'}
          </Button>
          
          <Button
            onClick={handleToggleMusic}
            className="w-full p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            soundEnabled={soundEnabled}
          >
            Music: {musicEnabled ? 'On' : 'Off'}
          </Button>
          
          <div className="pt-4 border-t border-white/10">
            <Button
              onClick={onSave}
              className="w-full p-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors flex items-center gap-3"
              soundEnabled={soundEnabled}
            >
              <Save className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400">Save Game</span>
            </Button>

            <Button
              onClick={onExitToMenu}
              className="w-full mt-2 p-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors flex items-center gap-3"
              soundEnabled={soundEnabled}
            >
              <LogOut className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400">Exit to Menu</span>
            </Button>

            <Button
              onClick={onClose}
              className="w-full mt-2 p-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors flex items-center gap-3"
              soundEnabled={soundEnabled}
            >
              <ArrowLeft className="w-5 h-5 text-green-400" />
              <span className="text-green-400">Back to Game</span>
            </Button>

            <Button
              onClick={onReset}
              className="w-full mt-4 p-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors flex items-center gap-3"
              soundEnabled={soundEnabled}
            >
              <RotateCcw className="w-5 h-5 text-red-400" />
              <span className="text-red-400">Reset Progress</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}