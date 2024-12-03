import React from 'react';
import { Trash2, Clock, Trophy } from 'lucide-react';
import { formatNumber } from '../utils';

interface SavesListProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (save: GameSave) => void;
  onDelete: (timestamp: number) => void;
}

interface GameSave {
  timestamp: number;
  shapes: {
    earned: number;
  };
  prestigePoints: number;
  stats: {
    timePlayed: number;
  };
  version: string;
}

export function SavesList({ isOpen, onClose, onLoad, onDelete }: SavesListProps) {
  const [saves, setSaves] = React.useState<GameSave[]>([]);

  React.useEffect(() => {
    // Load all saves with 'gameState' prefix
    const savedGames: GameSave[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('gameState')) {
        try {
          const save = JSON.parse(localStorage.getItem(key) || '');
          savedGames.push({
            ...save,
            timestamp: parseInt(key.replace('gameState_', ''))
          });
        } catch (e) {
          console.error('Failed to parse save:', e);
        }
      }
    }
    setSaves(savedGames.sort((a, b) => b.timestamp - a.timestamp));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900/95 rounded-xl max-w-2xl w-full shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Load Game</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white/80"
            >
              ×
            </button>
          </div>

          {saves.length === 0 ? (
            <p className="text-center text-gray-400">No saved games found</p>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {saves.map((save) => (
                <div
                  key={save.timestamp}
                  className="bg-white/5 rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-white/90">
                        {new Date(save.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/80">
                          {formatNumber(save.shapes.earned)} shapes
                        </span>
                      </div>
                      <div className="text-purple-400">
                        {save.prestigePoints} prestige points
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => onLoad(save)}
                      className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => onDelete(save.timestamp)}
                      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 