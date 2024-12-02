import React, { useState, useEffect, useCallback } from 'react';
import { Settings, HelpCircle, Trophy } from 'lucide-react';
import { Building } from './components/Building';
import { Upgrade } from './components/Upgrade';
import { ResourceDisplay } from './components/ResourceDisplay';
import { LuckyShape } from './components/LuckyShape';
import { Toast } from './components/Toast';
import { HelpModal } from './components/HelpModal';
import { AchievementsPanel } from './components/AchievementsPanel';
import { OptionsModal } from './components/OptionsModal';
import { AchievementPopup } from './components/AchievementPopup';
import { useAudio } from './services/AudioService';
import { BUILDINGS, UPGRADES, ACHIEVEMENTS } from './constants';
import { Building as BuildingType, Resource, Upgrade as UpgradeType, Achievement } from './types';
import { formatNumber, chance } from './utils';

const GAME_VERSION = "1.0.0";

const PRESTIGE_REQUIREMENTS = {
  1: 1e6,   // 1 million
  2: 1e9,   // 1 billion
  3: 1e12,  // 1 trillion
  4: 1e15,  // 1 quadrillion
  5: 1e18   // 1 quintillion
};

function App() {
  // Game state
  const [shapes, setShapes] = useState<Resource>({ amount: 0, earned: 0, perSecond: 0 });
  const [goldenContainers, setGoldenContainers] = useState<Resource>({ amount: 0, earned: 0, perSecond: 0 });
  const [buildings, setBuildings] = useState<BuildingType[]>(BUILDINGS);
  const [upgrades, setUpgrades] = useState<UpgradeType[]>(UPGRADES);
  const [clickPower, setClickPower] = useState(1);
  const [isShapePressed, setIsShapePressed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  
  // New state for prestige and stats
  const [prestigePoints, setPrestigePoints] = useState(0);
  const [prestigeMultiplier, setPrestigeMultiplier] = useState(1);
  const [stats, setStats] = useState({
    totalClicks: 0,
    timePlayed: 0,
    highestShapes: 0,
    totalPrestiges: 0,
    goldenContainers: 0
  });

  const { playClickSound } = useAudio(soundEnabled, musicEnabled);

  // Calculate total production per second with prestige multiplier
  useEffect(() => {
    const baseProduction = buildings.reduce((total, building) => {
      return total + building.production * building.owned;
    }, 0);

    const productionMultiplier = upgrades
      .filter(u => u.purchased && (u.type === 'production' || u.type === 'hybrid'))
      .reduce((total, upgrade) => total * upgrade.multiplier, 1) * prestigeMultiplier;

    setShapes(prev => ({
      ...prev,
      perSecond: baseProduction * productionMultiplier
    }));
  }, [buildings, upgrades, prestigeMultiplier]);

  // Production tick with performance optimization
  useEffect(() => {
    let lastUpdate = performance.now();
    let frameId: number;

    const updateProduction = () => {
      const now = performance.now();
      const delta = (now - lastUpdate) / 1000;
      lastUpdate = now;
      
      setShapes(prev => ({
        ...prev,
        amount: prev.amount + prev.perSecond * delta,
        earned: prev.earned + prev.perSecond * delta
      }));

      // Update time played
      setStats(prev => ({
        ...prev,
        timePlayed: prev.timePlayed + delta
      }));

      frameId = requestAnimationFrame(updateProduction);
    };

    frameId = requestAnimationFrame(updateProduction);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Save game state with versioning
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const gameState = {
        shapes,
        goldenContainers,
        buildings,
        upgrades,
        clickPower,
        unlockedAchievements: Array.from(unlockedAchievements),
        prestigePoints,
        prestigeMultiplier,
        stats,
        lastSaveTime: Date.now(),
        version: GAME_VERSION
      };
      localStorage.setItem('gameState', JSON.stringify(gameState));
    }, 300);

    return () => clearInterval(saveInterval);
  }, [shapes, goldenContainers, buildings, upgrades, clickPower, unlockedAchievements, prestigePoints, prestigeMultiplier, stats]);

  // Load game state with offline progress
  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      
      // Version check
      if (parsed.version !== GAME_VERSION) {
        setToast("Game updated! Some features may have changed.");
      }

      // Load saved state
      setShapes(parsed.shapes);
      setGoldenContainers(parsed.goldenContainers);
      setBuildings(parsed.buildings);
      setUpgrades(parsed.upgrades);
      setClickPower(parsed.clickPower);
      setUnlockedAchievements(new Set(parsed.unlockedAchievements));
      setPrestigePoints(parsed.prestigePoints || 0);
      setPrestigeMultiplier(parsed.prestigeMultiplier || 1);
      setStats(parsed.stats || {
        totalClicks: 0,
        timePlayed: 0,
        highestShapes: 0,
        totalPrestiges: 0,
        goldenContainers: 0
      });

      // Calculate offline progress
      const timeDiff = (Date.now() - parsed.lastSaveTime) / 1000;
      if (timeDiff > 0) {
        const offlineProgress = parsed.shapes.perSecond * timeDiff;
        setShapes(prev => ({
          ...prev,
          amount: prev.amount + offlineProgress,
          earned: prev.earned + offlineProgress
        }));
        setToast(`Welcome back! Earned ${formatNumber(offlineProgress)} shapes while away`);
      }
    }
  }, []);

  // Achievement checker
  useEffect(() => {
    if (shapes.earned >= 1e6) checkAchievement('millionaire');
    if (stats.totalClicks >= 1000) checkAchievement('dedicated');
    if (prestigePoints >= 1) checkAchievement('transcended');
  }, [shapes.earned, stats.totalClicks, prestigePoints]);

  // Game handlers
  const handleShapeClick = useCallback(() => {
    playClickSound();
    setIsShapePressed(true);
    setTimeout(() => setIsShapePressed(false), 100);

    const clickMultiplier = upgrades
      .filter(u => u.purchased && (u.type === 'click' || u.type === 'hybrid'))
      .reduce((total, upgrade) => total * upgrade.multiplier, 1) * prestigeMultiplier;

    const buildingBonus = upgrades.find(u => u.id === 'click4')?.purchased
      ? buildings.reduce((total, building) => total + building.owned * 0.01, 1)
      : 1;

    const totalClickPower = clickPower * clickMultiplier * buildingBonus;

    setShapes(prev => ({
      ...prev,
      amount: prev.amount + totalClickPower,
      earned: prev.earned + totalClickPower
    }));

    setStats(prev => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      highestShapes: Math.max(prev.highestShapes, shapes.amount + totalClickPower)
    }));

    if (upgrades.find(u => u.id === 'golden1')?.purchased && chance(1)) {
      handleCollectLuckyShape(1, true);
    }
  }, [clickPower, upgrades, buildings, playClickSound, shapes.amount, prestigeMultiplier]);

  const handleBuyBuilding = useCallback((building: BuildingType) => {
    const price = building.basePrice * Math.pow(1.15, building.owned);
    
    if (shapes.amount >= price) {
      setShapes(prev => ({
        ...prev,
        amount: prev.amount - price
      }));

      setBuildings(prev =>
        prev.map(b =>
          b.id === building.id
            ? { ...b, owned: b.owned + 1 }
            : b
        )
      );
    }
  }, [shapes]);

  const handleBuyUpgrade = useCallback((upgrade: UpgradeType) => {
    if (shapes.amount >= upgrade.price && !upgrade.purchased) {
      setShapes(prev => ({
        ...prev,
        amount: prev.amount - upgrade.price
      }));

      setUpgrades(prev =>
        prev.map(u =>
          u.id === upgrade.id
            ? { ...u, purchased: true }
            : u
        )
      );

      setToast(`Upgrade purchased: ${upgrade.name}`);
    }
  }, [shapes]);

  const handlePrestige = () => {
    // Calculate total production value needed for prestige
    const prestigeRequirement = PRESTIGE_REQUIREMENTS[prestigeLevel + 1] || Infinity;
    
    if (totalProduction >= prestigeRequirement) {
      setPrestigeLevel(prev => prev + 1);
      setGlobalMultiplier(prev => prev * PRESTIGE_MULTIPLIERS[`tier${prestigeLevel + 1}`]);
      
      // Reset buildings but keep multipliers
      setBuildings(prevBuildings => 
        prevBuildings.map(building => ({
          ...building,
          owned: 0
        }))
      );
      
      // Reset total production
      setTotalProduction(0);
      setScore(0);
    }
  };

  const handleCollectLuckyShape = useCallback((amount: number, isGolden: boolean) => {
    if (isGolden) {
      setGoldenContainers(prev => ({
        ...prev,
        amount: prev.amount + amount,
        earned: prev.earned + amount
      }));
      setStats(prev => ({
        ...prev,
        goldenContainers: prev.goldenContainers + amount
      }));
      setToast(`Found ${amount} golden container${amount > 1 ? 's' : ''}!`);
    } else {
      const bonus = amount * prestigeMultiplier;
      setShapes(prev => ({
        ...prev,
        amount: prev.amount + bonus,
        earned: prev.earned + bonus
      }));
      setToast(`Lucky shape grants ${formatNumber(bonus)} shapes!`);
    }
  }, [prestigeMultiplier]);

  const checkAchievement = useCallback((id: string) => {
    if (!unlockedAchievements.has(id)) {
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (achievement) {
        setUnlockedAchievements(prev => new Set([...prev, id]));
        setCurrentAchievement(achievement);
        setToast(`Achievement unlocked: ${achievement.name}`);
      }
    }
  }, [unlockedAchievements]);

  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      localStorage.removeItem('gameState');
      window.location.reload();
    }
  }, []);

  // Add state for prestige level and multipliers
  const [prestigeLevel, setPrestigeLevel] = useState(0);
  const [globalMultiplier, setGlobalMultiplier] = useState(1);

  // Function to check if building should be unlocked
  const isBuildingUnlocked = (building: Building) => {
    if (!building.unlockAt) return true;
    return totalProduction >= building.unlockAt;
  };

  // Function to check if upgrade is available
  const isUpgradeUnlocked = (building: Building, upgrade: BuildingUpgrade) => {
    return building.owned >= upgrade.unlockAt;
  };

  // Update click power calculation
  useEffect(() => {
    // Base click power starts at 1
    let newClickPower = 1;
    
    // Add bonuses from upgrades
    const upgradeBonus = upgrades
      .filter(u => u.purchased && (u.type === 'click' || u.type === 'hybrid'))
      .reduce((total, upgrade) => total * upgrade.multiplier, 1);
    
    // Add building bonus if click4 upgrade is purchased
    const buildingBonus = upgrades.find(u => u.id === 'click4')?.purchased
      ? buildings.reduce((total, building) => total + building.owned * 0.01, 1)
      : 1;
    
    // Calculate final click power
    newClickPower = newClickPower * upgradeBonus * buildingBonus;
    
    // Update state
    setClickPower(newClickPower);
  }, [buildings, upgrades]);

  // Auto-clicker functionality
  const [autoClickerActive, setAutoClickerActive] = useState(false);

  useEffect(() => {
    let lastAutoClick = performance.now();
    let frameId: number;

    const updateAutoClick = () => {
      const now = performance.now();
      const delta = (now - lastAutoClick) / 1000;
      
      if (delta >= 0.1) { // Auto-click every 100ms
        lastAutoClick = now;
        handleShapeClick();
      }

      frameId = requestAnimationFrame(updateAutoClick);
    };

    if (autoClickerActive) {
      frameId = requestAnimationFrame(updateAutoClick);
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [autoClickerActive, handleShapeClick]);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <ResourceDisplay
              resource={shapes}
              name="Shapes"
              showEarned
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrestige}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={Math.floor(Math.log10(shapes.earned / 1e12)) <= 0}
            >
              Prestige ({Math.max(0, Math.floor(Math.log10(shapes.earned / 1e12)))} points)
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <HelpCircle className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowOptions(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowAchievements(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Trophy className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="grid grid-cols-[300px_1fr_300px] gap-8 items-start">
          {/* Buildings Column */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold mb-4">Buildings</h2>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {buildings
                .filter(building => building.unlockAt <= shapes.earned)
                .map(building => (
                  <Building
                    key={building.id}
                    building={building}
                    canAfford={shapes.amount >= building.basePrice * Math.pow(1.15, building.owned)}
                    onClick={() => handleBuyBuilding(building)}
                  />
                ))}
            </div>
          </div>

          {/* Central Area */}
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <button
              onClick={handleShapeClick}
              className={`transform transition-all duration-100 ${
                isShapePressed ? 'scale-95' : 'scale-100 hover:scale-105'
              }`}
            >
              <div className="w-40 h-40 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-32 h-32 bg-blue-500/30 rounded-lg flex items-center justify-center animate-pulse">
                  <div className="w-24 h-24 bg-blue-500/40 rounded-md" />
                </div>
              </div>
            </button>
            
            {/* Stats display */}
            <div className="mt-4 space-y-1 text-center text-sm text-blue-300/80">
              <div>Click Power: {formatNumber(clickPower * prestigeMultiplier)}</div>
              <div>Total Clicks: {formatNumber(stats.totalClicks)}</div>
              <div>Time Played: {Math.floor(stats.timePlayed / 60)} minutes</div>
              <div>Prestige Points: {prestigePoints}</div>
            </div>
          </div>

          {/* Upgrades Column */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold mb-4">Upgrades</h2>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {upgrades
                .filter(upgrade => !upgrade.purchased && upgrade.unlockAt <= shapes.earned)
                .map(upgrade => (
                  <Upgrade
                    key={upgrade.id}
                    upgrade={upgrade}
                    canAfford={shapes.amount >= upgrade.price}
                    onClick={() => handleBuyUpgrade(upgrade)}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals and Notifications */}
      <LuckyShape
        onCollect={handleCollectLuckyShape}
        hasClover={upgrades.find(u => u.id === 'golden1')?.purchased ?? false}
        hasDimensionalRifts={upgrades.find(u => u.id === 'golden3')?.purchased ?? false}
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      <OptionsModal
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
        onReset={handleReset}
        soundEnabled={soundEnabled}
        musicEnabled={musicEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        onToggleMusic={() => setMusicEnabled(prev => !prev)}
      />

      <AchievementsPanel
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        achievements={ACHIEVEMENTS}
        unlockedAchievements={unlockedAchievements}
      />

      {toast && (
        <Toast
          message={toast}
          onClose={() => setToast(null)}
        />
      )}

      {currentAchievement && (
        <AchievementPopup
          achievement={currentAchievement}
          onComplete={() => setCurrentAchievement(null)}
        />
      )}
    </div>
  );
}

export default App;
