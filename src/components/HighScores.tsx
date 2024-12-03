import React from 'react';
import { formatNumber } from '../utils';
import type { HighScore } from '../types';

interface HighScoresProps {
  scores: HighScore[];
}

export function HighScores({ scores }: HighScoresProps) {
  return (
    <div className="bg-gray-800/90 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">High Scores</h2>
      <div className="space-y-2">
        {scores.map((score, index) => (
          <div 
            key={`${score.date}-${index}`}
            className="flex justify-between items-center p-2 bg-gray-700/50 rounded"
          >
            <div className="flex items-center gap-2">
              <span className="text-amber-400">#{index + 1}</span>
              <span>{formatNumber(score.shapes)} shapes</span>
            </div>
            <div className="text-sm text-gray-400">
              {new Date(score.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 