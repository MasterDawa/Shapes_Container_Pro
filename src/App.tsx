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

  const { playClickSound } = useAudio(soundEnabled, musicEnabled);

  // Calculate total production per second
  useEffect(() => {
    const baseProduction = buildings.reduce((total, building) => {
      return total + building.production * building.owned;
    }, 0);

    const productionMultiplier = upgrades
      .filter(u => u.purchased && (u.type === 'production' || u.type === 'hybrid'))
      .reduce((total, upgrade) => total * upgrade.multiplier, 1);

    setShapes(prev => ({
      ...prev,
      perSecond: baseProduction * productionMultiplier
    }));
  }, [buildings, upgrades]);

  // Production tick
  useEffect(() => {
    const interval = setInterval(() => {
      setShapes(prev => ({
        ...prev,
        amount: prev.amount + prev.perSecond / 10,
        earned: prev.earned + prev.perSecond / 10
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Save game state
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const gameState = {
        shapes,
        goldenContainers,
        buildings,
        upgrades,
        clickPower,
        unlockedAchievements: Array.from(unlockedAchievements)
      };
      localStorage.setItem('gameState', JSON.stringify(gameState));
    }, 30000);

    return () => clearInterval(saveInterval);
  }, [shapes, goldenContainers, buildings, upgrades, clickPower, unlockedAchievements]);

  // Load game state
  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      const {
        shapes: savedShapes,
        goldenContainers: savedGolden,
        buildings: savedBuildings,
        upgrades: savedUpgrades,
        clickPower: savedClickPower,
        unlockedAchievements: savedAchievements
      } = JSON.parse(savedState);

      setShapes(savedShapes);
      setGoldenContainers(savedGolden);
      setBuildings(savedBuildings);
      setUpgrades(savedUpgrades);
      setClickPower(savedClickPower);
      setUnlockedAchievements(new Set(savedAchievements));
    }
  }, []);

  // Game handlers
  const handleShapeClick = useCallback(() => {
    playClickSound();
    setIsShapePressed(true);
    setTimeout(() => setIsShapePressed(false), 100);

    const clickMultiplier = upgrades
      .filter(u => u.purchased && (u.type === 'click' || u.type === 'hybrid'))
      .reduce((total, upgrade) => total * upgrade.multiplier, 1);

    const buildingBonus = upgrades.find(u => u.id === 'click4')?.purchased
      ? buildings.reduce((total, building) => total + building.owned * 0.01, 1)
      : 1;

    const totalClickPower = clickPower * clickMultiplier * buildingBonus;

    setShapes(prev => ({
      ...prev,
      amount: prev.amount + totalClickPower,
      earned: prev.earned + totalClickPower
    }));

    if (upgrades.find(u => u.id === 'golden1')?.purchased && chance(1)) {
      handleCollectLuckyShape(1, true);
    }
  }, [clickPower, upgrades, buildings, playClickSound]);

  const handleBuyBuilding = useCallback((building: BuildingType) => {
    const price = Math.floor(building.basePrice * Math.pow(1.15, building.owned));
    
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

      if (building.owned === 0) {
        checkAchievement('firstBox');
      }
      if (building.id === 'box' && building.owned === 9) {
        checkAchievement('tenBoxes');
      }
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

      if (upgrades.filter(u => u.purchased).length === 4) {
        checkAchievement('upgrader');
      }
    }
  }, [shapes, upgrades]);

  const handleCollectLuckyShape = useCallback((amount: number, isGolden: boolean) => {
    if (isGolden) {
      setGoldenContainers(prev => ({
        ...prev,
        amount: prev.amount + amount,
        earned: prev.earned + amount
      }));
      setToast(`Found ${amount} golden container${amount > 1 ? 's' : ''}!`);
      
      if (goldenContainers.earned === 0) {
        checkAchievement('firstGolden');
      }
      if (goldenContainers.amount >= 100) {
        checkAchievement('goldenHoard');
      }
    } else {
      setShapes(prev => ({
        ...prev,
        amount: prev.amount + amount,
        earned: prev.earned + amount
      }));
      setToast(`Lucky shape grants ${formatNumber(amount)} shapes!`);
    }
  }, [goldenContainers]);

  const checkAchievement = useCallback((id: string) => {
    if (!unlockedAchievements.has(id)) {
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (achievement) {
        setUnlockedAchievements(prev => new Set([...prev, id]));
        setCurrentAchievement(achievement);
      }
    }
  }, [unlockedAchievements]);

  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      localStorage.removeItem('gameState');
      window.location.reload();
    }
  }, []);

  // Rest of the component remains the same...
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Previous JSX remains exactly the same... */}
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1579546929518-9e396f3cc809)',
        }}
      />
      
      {/* Game Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 flex justify-center items-center p-4">
          <div className="flex gap-4 items-center">
            <ResourceDisplay
              resource={shapes}
              name="Shapes"
              showEarned
            />
            <ResourceDisplay
              resource={goldenContainers}
              name="Golden"
            />
          </div>
        </div>

        {/* Menu Buttons */}
        <div className="fixed top-4 right-4 flex gap-2">
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