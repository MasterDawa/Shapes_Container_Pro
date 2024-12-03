import React, { useState } from 'react';
import { Trophy, Save, PlayCircle, ArrowLeft } from 'lucide-react';
import { formatNumber } from '../utils';
import { SavesList } from './SavesList';

interface MainMenuProps {
  isOpen: boolean;
  onNewGame: () => void;
  onLoadGame: () => void;
  onClose: () => void;
  onReturnToGame: () => void;
  highScores: HighScore[];
  hasCurrentGame: boolean;
}

interface HighScore {
  date: string;
  shapes: number;
  prestigePoints: number;
  timePlayed: number;
}

export function MainMenu({ 
  isOpen, 
  onNewGame, 
  onLoadGame, 
  onClose,
  onReturnToGame,
  highScores = [],
  hasCurrentGame = false
}: MainMenuProps) {
  const [showSavesList, setShowSavesList] = useState(false);

  if (!isOpen) return null;

  if (showSavesList) {
    return (
      <SavesList
        isOpen={true}
        onClose={() => setShowSavesList(false)}
        onLoad={onLoadGame}
        onDelete={(timestamp) => {
          localStorage.removeItem(`gameState_${timestamp}`);
          setShowSavesList(false);
          setTimeout(() => setShowSavesList(true), 0);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-gray-900/95 rounded-xl max-w-2xl w-full shadow-lg">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-blue-400">
            Idle Shapes Container
          </h1>
          
          <div className="grid grid-cols-1 gap-4 mb-8">
            {hasCurrentGame && (
              <button
                onClick={onReturnToGame}
                className="p-6 bg-green-500/20 hover:bg-green-500/30 rounded-xl transition-colors flex items-center gap-3"
              >
                <ArrowLeft className="w-8 h-8 text-green-400" />
                <span className="text-green-400 font-bold">Return to Current Game</span>
              </button>
            )}

            <button
              onClick={onNewGame}
              className="p-6 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-xl transition-colors flex items-center gap-3"
            >
              <PlayCircle className="w-8 h-8 text-emerald-400" />
              <span className="text-emerald-400 font-bold">New Game</span>
            </button>
            
            <button
              onClick={() => setShowSavesList(true)}
              className="p-6 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl transition-colors flex items-center gap-3"
            >
              <Save className="w-8 h-8 text-blue-400" />
              <span className="text-blue-400 font-bold">Load Game</span>
            </button>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">High Scores</h2>
            </div>
            
            <div className="space-y-2">
              {highScores.length === 0 ? (
                <p className="text-gray-400 text-center">No high scores yet!</p>
              ) : (
                highScores.map((score, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white/5 rounded-lg p-3"
                  >
                    <div>
                      <p className="text-white/90">{new Date(score.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-400">
                        Time Played: {Math.floor(score.timePlayed / 60)}m
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/90">{formatNumber(score.shapes)} shapes</p>
                      <p className="text-sm text-purple-400">
                        {score.prestigePoints} prestige points
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 