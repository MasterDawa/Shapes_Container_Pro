import React from 'react';
import { ShapeButton } from './ShapeButton';
import { formatNumber } from '../utils';
import { Shield, Clock, Star, Zap, Trophy, Shapes } from 'lucide-react';
import { Resource } from '../types';
import { formatDecimal } from '../utils/decimal';

interface GameCoreProps {
  onShapeClick: () => void;
  isShapePressed: boolean;
  clickPower: number;
  stats: {
    totalClicks: number;
    timePlayed: number;
    luckyShapesClicked: number;
    prestigePoints: number;
  };
  shapes: Resource;
  soundEnabled?: boolean;
  onPrestige: () => void;
  canPrestige: boolean;
  prestigePoints: number;
}

export function GameCore({ 
  onShapeClick, 
  isShapePressed, 
  clickPower, 
  stats, 
  shapes, 
  soundEnabled,
  onPrestige,
  canPrestige,
  prestigePoints
}: GameCoreProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 bg-gradient-to-b from-gray-900/50 to-blue-900/30 rounded-2xl p-8 backdrop-blur-sm border border-blue-500/20 shadow-lg min-w-[900px] mt-32">
      <div className="flex items-center gap-12">
        {/* Left Stats */}
        <div className="flex flex-col gap-4 bg-black/40 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center gap-3">
            <Shapes className="w-6 h-6 text-[#00f3ff]" />
            <div className="flex flex-col">
              <span className="text-[#00f3ff] text-xl font-bold">
                {formatDecimal(shapes.amount)}
              </span>
              <span className="text-[#00f3ff]/70 text-sm">
                {formatDecimal(shapes.perSecond)}/s
              </span>
            </div>
          </div>
          <div className="w-full h-px bg-blue-500/20" />
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#00f3ff]" />
            <div className="flex flex-col">
              <span className="text-[#00f3ff] text-xl font-bold">
                {formatNumber(clickPower)}
              </span>
              <span className="text-[#00f3ff]/70 text-sm">
                Click Power
              </span>
            </div>
          </div>
        </div>

        {/* Center Shape Button */}
        <ShapeButton
          onClick={onShapeClick}
          isPressed={isShapePressed}
          clickPower={clickPower}
          soundEnabled={soundEnabled}
        />

        {/* Right Stats */}
        <div className="flex flex-col gap-4 bg-black/40 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-red-400" />
            <div className="flex flex-col">
              <span className="text-red-400 text-xl font-bold">
                {prestigePoints}
              </span>
              <span className="text-red-400/70 text-sm">
                Prestige Points
              </span>
            </div>
          </div>
          <div className="w-full h-px bg-red-500/20" />
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-red-400" />
            <div className="flex flex-col">
              <span className="text-red-400 text-xl font-bold">
                {formatDecimal(shapes.earned)}
              </span>
              <span className="text-red-400/70 text-sm">
                Total Earned
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Panel */}
      <div className="grid grid-cols-4 gap-4 w-full bg-black/40 rounded-xl p-4 border border-blue-500/20">
        <StatBox
          icon={<Zap className="w-6 h-6 text-[#00f3ff]" />}
          label="Total Clicks"
          value={formatNumber(stats.totalClicks)}
        />
        <StatBox
          icon={<Clock className="w-6 h-6 text-[#00f3ff]" />}
          label="Time Played"
          value={`${Math.floor(stats.timePlayed / 60)}m`}
        />
        <StatBox
          icon={<Trophy className="w-6 h-6 text-[#00f3ff]" />}
          label="Prestige Level"
          value={formatNumber(stats.prestigePoints)}
        />
        <StatBox
          icon={<Star className="w-6 h-6 text-[#00f3ff]" />}
          label="Lucky Shapes"
          value={formatNumber(stats.luckyShapesClicked)}
        />
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-2 bg-blue-500/5 rounded-lg border border-blue-500/10">
      {icon}
      <span className="text-[#00f3ff]/70 text-sm mt-1">{label}</span>
      <span className="text-[#00f3ff] text-lg font-bold">{value}</span>
    </div>
  );
} 