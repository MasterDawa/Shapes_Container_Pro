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
import { BUILDINGS, UPGRADES, ACHIEVEMENTS, calculateBuildingProduction, calculateUnlockCost, calculateUpgradeCost, calculateBuildingCost, calculateUpgradeMultiplier } from './constants';
import { formatNumber, chance } from './utils';
import { PrestigeModal } from './components/PrestigeModal';
import { MainMenu } from './components/MainMenu';
import { SavesList } from './components/SavesList';
import backgroundImage from '@/assets/background.png';
import { ShapeButton } from './components/ShapeButton';
import Decimal from 'decimal.js';
import { formatDecimal } from './utils/decimal';
import { GameCore } from './components/GameCore';
import { Resource, Building as BuildingType, Upgrade as UpgradeType, Achievement, HighScore, GameSave } from './types';

const GAME_VERSION = "1.0.0";

const PRESTIGE_REQUIREMENTS = {
  1: 1e6,   // 1 million
  2: 1e9,   // 1 billion
  3: 1e12,  // 1 trillion
  4: 1e15,  // 1 quadrillion
  5: 1e18   // 1 quintillion
};

// Add this helper function
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

function App() {
  // Game state
  const [shapes, setShapes] = useState<Resource>({
    amount: new Decimal(0),
    earned: new Decimal(0),
    perSecond: new Decimal(0)
  });
  const [buildings, setBuildings] = useState<BuildingType[]>(() => 
    BUILDINGS.map(building => ({
      ...building,
      currentLevel: 0,
      maxLevel: 100,
      prestigeLevel: 0,
      production: building.baseProduction || 0,
      owned: 0,
      baseUnlockAt: building.baseUnlockAt || 0,
      unlockAt: building.unlockAt || 0
    }))
  );
  const [upgrades, setUpgrades] = useState<UpgradeType[]>(() => 
    UPGRADES.map(upgrade => ({
      ...upgrade,
      currentLevel: 0,
      maxLevel: 50,
      purchased: false,
      multiplier: upgrade.baseMultiplier
    }))
  );
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
    luckyShapesClicked: 0
  });

  const { playClickSound } = useAudio(soundEnabled, musicEnabled);

  // Calculate total production per second with prestige multiplier
  useEffect(() => {
    const totalProduction = buildings.reduce((total, building) => {
      const buildingProduction = calculateBuildingProduction(building);
      return total.plus(buildingProduction);
    }, new Decimal(0));

    // Apply upgrades and prestige multiplier
    const productionMultiplier = upgrades
      .filter(u => u.purchased || u.currentLevel > 0)  // Check both conditions
      .filter(u => u.type === 'production' || u.type === 'hybrid')
      .reduce((total, upgrade) => total * upgrade.multiplier, 1) * prestigeMultiplier;

    setShapes(prev => ({
      ...prev,
      perSecond: totalProduction.times(productionMultiplier)
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
        amount: prev.amount.plus(prev.perSecond.times(delta)),
        earned: prev.earned.plus(prev.perSecond.times(delta))
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
        buildings,
        upgrades: upgrades.map(u => ({
          ...u,
          maxLevel: 50  // Ensure maxLevel is preserved when saving
        })),
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
  }, [shapes, buildings, upgrades, clickPower, unlockedAchievements, prestigePoints, prestigeMultiplier, stats]);

  // Load game state with offline progress
  useEffect(() => {
    const isClient = typeof window !== 'undefined';

    if (isClient) {
      const savedState = localStorage.getItem('gameState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        
        // Version check
        if (parsed.version !== GAME_VERSION) {
          setToast("Game updated! Some features may have changed.");
        }

        // Load saved state
        setShapes({
          amount: new Decimal(parsed.shapes.amount),
          earned: new Decimal(parsed.shapes.earned),
          perSecond: new Decimal(parsed.shapes.perSecond)
        });
        setBuildings(parsed.buildings);
        
        // Ensure upgrades have correct maxLevel when loading
        setUpgrades(parsed.upgrades.map((u: UpgradeType) => ({
          ...u,
          maxLevel: 50,  // Force maxLevel to 50
          currentLevel: Math.min(u.currentLevel, 50)  // Ensure currentLevel doesn't exceed maxLevel
        })));

        setClickPower(parsed.clickPower);
        setUnlockedAchievements(new Set(parsed.unlockedAchievements));
        setPrestigePoints(parsed.prestigePoints || 0);
        setPrestigeMultiplier(parsed.prestigeMultiplier || 1);
        setStats(parsed.stats || {
          totalClicks: 0,
          timePlayed: 0,
          highestShapes: 0,
          totalPrestiges: 0,
          luckyShapesClicked: 0
        });

        // Calculate offline progress
        const timeDiff = (Date.now() - parsed.lastSaveTime) / 1000;
        if (timeDiff > 0) {
          const offlineProgress = new Decimal(parsed.shapes.perSecond).times(timeDiff);
          setShapes(prev => ({
            ...prev,
            amount: prev.amount.plus(offlineProgress),
            earned: prev.earned.plus(offlineProgress)
          }));
          setToast(`Welcome back! Earned ${formatNumber(offlineProgress)} shapes while away`);
        }
      }
    }
  }, []);

  // Achievement checker
  useEffect(() => {
    const gameState = {
      shapes,
      buildings,
      upgrades,
      stats,
      prestigePoints,
      prestigeMultiplier
    };

    ACHIEVEMENTS.forEach(achievement => {
      if (!unlockedAchievements.has(achievement.id) && achievement.condition(gameState)) {
        checkAchievement(achievement.id);
      }
    });
  }, [shapes, buildings, upgrades, stats, prestigePoints, prestigeMultiplier]);

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

    const totalClickPower = new Decimal(clickPower)
      .times(clickMultiplier)
      .times(buildingBonus);

    setShapes(prev => ({
      ...prev,
      amount: prev.amount.plus(totalClickPower),
      earned: prev.earned.plus(totalClickPower)
    }));

    setStats(prev => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      highestShapes: Decimal.max(
        new Decimal(prev.highestShapes),
        shapes.amount.plus(totalClickPower)
      ).toNumber()
    }));

    if (upgrades.find(u => u.id === 'golden1')?.purchased && chance(1)) {
      handleCollectLuckyShape(1, true);
    }
  }, [clickPower, upgrades, buildings, playClickSound, shapes.amount, prestigeMultiplier]);

  const handleBuyBuilding = useCallback((building: BuildingType) => {
    const price = calculateBuildingCost(building);
    
    if (shapes.amount.gte(price) && building.currentLevel < building.maxLevel) {
      // Deduct the cost
      setShapes(prev => ({
        ...prev,
        amount: prev.amount.minus(price)
      }));

      // Update the building
      setBuildings(prev =>
        prev.map(b =>
          b.id === building.id
            ? {
                ...b,
                currentLevel: b.currentLevel + 1,
                owned: (b.owned || 0) + 1,  // Make sure owned is initialized
                production: calculateBuildingProduction({
                  ...b,
                  currentLevel: b.currentLevel + 1,
                  owned: (b.owned || 0) + 1
                }).toNumber()
              }
            : b
        )
      );

      // Play sound effect
      playClickSound();
    }
  }, [shapes.amount, playClickSound]);

  const handleBuyUpgrade = useCallback((upgrade: UpgradeType) => {
    const cost = upgrade.currentCost;
    
    if (shapes.amount.gte(cost) && upgrade.currentLevel < upgrade.maxLevel) {
      setShapes(prev => ({
        ...prev,
        amount: prev.amount.minus(cost)
      }));

      setUpgrades(prev =>
        prev.map(u =>
          u.id === upgrade.id
            ? {
                ...u,
                currentLevel: u.currentLevel + 1,
                currentCost: calculateUpgradeCost({
                  ...u,
                  currentLevel: u.currentLevel + 1
                }),
                multiplier: calculateUpgradeMultiplier({
                  ...u,
                  currentLevel: u.currentLevel + 1
                })
              }
            : u
        )
      );

      playClickSound();
    }
  }, [shapes.amount, playClickSound]);

  const handlePrestige = () => {
    if (shapes.earned.gte(1e12)) { // 1 trillion shapes required
      setShowPrestigeModal(true);
    }
  };

  const handleConfirmPrestige = () => {
    const prestigePoints = Math.floor(Math.log10(shapes.earned.div(1e12).toNumber()));

    setBuildings(prevBuildings => 
      prevBuildings.map(building => ({
        ...building,
        currentLevel: 0,
        prestigeLevel: building.prestigeLevel + 1,
        unlockAt: calculateUnlockCost({
          ...building,
          prestigeLevel: building.prestigeLevel + 1
        }),
        production: calculateBuildingProduction({
          ...building,
          currentLevel: 0,
          prestigeLevel: building.prestigeLevel + 1
        })
      }))
    );
    
    setUpgrades(prevUpgrades =>
      prevUpgrades.map(upgrade => ({
        ...upgrade,
        currentLevel: 0,
        currentCost: upgrade.baseCost,
        purchased: false
      }))
    );
    
    // Reset shapes but keep prestige stats
    setShapes({
      amount: new Decimal(0),
      earned: new Decimal(0),
      perSecond: new Decimal(0)
    });
    
    setPrestigePoints(prev => prev + prestigePoints);
    setPrestigeMultiplier(prev => prev * (1 + prestigePoints * 0.1));
  };

  const [activeMultiplier, setActiveMultiplier] = useState<{value: number, endTime: number} | null>(null);

  // Add this effect to handle temporary multipliers
  useEffect(() => {
    if (activeMultiplier && Date.now() >= activeMultiplier.endTime) {
      setActiveMultiplier(null);
    }

    const interval = setInterval(() => {
      if (activeMultiplier && Date.now() >= activeMultiplier.endTime) {
        setActiveMultiplier(null);
        setToast('Click power multiplier expired!');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeMultiplier]);

  const handleCollectLuckyShape = useCallback((amount: number, isBonus: boolean, multiplier?: number, duration?: number) => {
    // Increment lucky shapes clicked counter
    setStats(prev => ({
      ...prev,
      luckyShapesClicked: prev.luckyShapesClicked + 1
    }));

    if (isBonus && multiplier && duration) {
      // Handle temporary click multiplier
      setActiveMultiplier({
        value: multiplier,
        endTime: Date.now() + duration * 1000
      });
      setToast(`Lucky shape grants ${multiplier}x click power for ${duration} seconds!`);
    } else {
      // Handle shape reward
      const bonus = amount * prestigeMultiplier;
      setShapes(prev => ({
        ...prev,
        amount: prev.amount.plus(bonus),
        earned: prev.earned.plus(bonus)
      }));
      setToast(`Lucky shape grants ${formatNumber(bonus)} shapes!`);
    }
  }, [prestigeMultiplier]);

  // Update click power calculation to include temporary multiplier
  const calculateClickPower = useCallback(() => {
    let power = clickPower * prestigeMultiplier;
    
    if (activeMultiplier) {
      power *= activeMultiplier.value;
    }
    
    return power;
  }, [clickPower, prestigeMultiplier, activeMultiplier]);

  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);

  const checkAchievement = useCallback((id: string) => {
    if (!unlockedAchievements.has(id)) {
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (achievement && achievement.reward) {
        setUnlockedAchievements(prev => new Set([...prev, id]));
        setAchievementQueue(prev => [...prev, achievement]);
        
        // Apply achievement reward
        switch (achievement.reward.type) {
          case 'production':
            setPrestigeMultiplier(prev => prev * achievement.reward!.value);
            break;
          case 'click':
            setClickPower(prev => prev * achievement.reward!.value);
            break;
          case 'golden':
            // Add golden container bonus logic
            break;
          case 'hybrid':
            setPrestigeMultiplier(prev => prev * achievement.reward!.value);
            setClickPower(prev => prev * achievement.reward!.value);
            break;
        }

        // Save achievement timestamp
        const timestamp = Date.now();
        localStorage.setItem(`achievement_${id}`, timestamp.toString());
        
        setToast(`Achievement unlocked: ${achievement.name}!`);
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

  // Add state for prestige modal
  const [showPrestigeModal, setShowPrestigeModal] = useState(false);

  // Add state for main menu
  const [showMainMenu, setShowMainMenu] = useState(true);
  const [highScores, setHighScores] = useState<HighScore[]>(() => {
    const saved = localStorage.getItem('highScores');
    return saved ? JSON.parse(saved) : [];
  });

  // Add autosave effect
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const gameState = {
        shapes,
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
      console.log('Game autosaved');
    }, 30000); // 30 seconds

    return () => clearInterval(saveInterval);
  }, [shapes, buildings, upgrades, clickPower, unlockedAchievements, prestigePoints, prestigeMultiplier, stats]);

  // Add handlers for main menu
  const handleNewGame = useCallback(() => {
    // Reset all state to initial values
    setShapes({
      amount: new Decimal(0),
      earned: new Decimal(0),
      perSecond: new Decimal(0)
    });
    
    setBuildings(BUILDINGS.map(building => ({
      ...building,
      currentLevel: 0,
      maxLevel: 100,
      prestigeLevel: 0,
      prestigeRank: 'A',
      production: building.baseProduction || 0,
      owned: 0,
      baseUnlockAt: building.baseUnlockAt || 0,
      unlockAt: building.unlockAt || 0
    })));
    
    setUpgrades(UPGRADES.map(upgrade => ({
      ...upgrade,
      purchased: false,
      currentLevel: 0,
      maxLevel: 1,
      currentCost: upgrade.price,
      baseCost: upgrade.price
    })));
    
    setClickPower(1);
    setPrestigePoints(0);
    setPrestigeMultiplier(1);
    
    setStats({
      totalClicks: 0,
      timePlayed: 0,
      highestShapes: 0,
      totalPrestiges: 0,
      luckyShapesClicked: 0
    });
    
    setUnlockedAchievements(new Set());
    setCurrentAchievement(null);
    
    // Save current game as high score if it qualifies
    if (shapes.earned.gt(0)) {
      const newHighScore: HighScore = {
        date: new Date().toISOString(),
        shapes: shapes.earned.toNumber(),
        prestigePoints: prestigePoints,
        timePlayed: stats.timePlayed
      };
      
      setHighScores(prev => {
        const newScores = [...prev, newHighScore]
          .sort((a, b) => b.shapes - a.shapes)
          .slice(0, 10); // Keep top 10
        localStorage.setItem('highScores', JSON.stringify(newScores));
        return newScores;
      });
    }
    
    // Clear game save
    localStorage.removeItem('gameState');
    
    // Close menu and show toast
    setShowMainMenu(false);
    setToast('New game started!');
  }, [shapes.earned, prestigePoints, stats.timePlayed]);

  const handleLoadGame = () => {
    try {
      const savedState = localStorage.getItem('gameState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        setShapes({
          amount: new Decimal(parsed.shapes.amount),
          earned: new Decimal(parsed.shapes.earned),
          perSecond: new Decimal(parsed.shapes.perSecond)
        });
        setBuildings(parsed.buildings || []);
        setUpgrades(parsed.upgrades || []);
      }
    } catch (error) {
      console.error('Error loading game:', error);
    }
    setShowMainMenu(false);
  };

  const saveHighScore = () => {
    const newScore = {
      date: new Date().toISOString(),
      shapes: shapes.earned.toNumber(),
      prestigePoints,
      timePlayed: stats.timePlayed
    };

    setHighScores(prev => {
      const newScores = [...prev, newScore]
        .sort((a, b) => b.shapes - a.shapes)
        .slice(0, 10); // Keep top 10 scores
      localStorage.setItem('highScores', JSON.stringify(newScores));
      return newScores;
    });
  };

  // Add new handlers
  const handleSaveGame = () => {
    const gameState = {
      shapes,
      buildings,
      upgrades,
      clickPower,
      unlockedAchievements: Array.from(unlockedAchievements),
      prestigePoints,
      prestigeMultiplier,
      stats,
      version: GAME_VERSION
    };
    const timestamp = Date.now();
    localStorage.setItem(`gameState_${timestamp}`, JSON.stringify(gameState));
    setToast('Game saved successfully!');
  };

  const handleExitToMenu = () => {
    handleSaveGame(); // Auto-save before exiting
    setShowOptions(false);
    setShowMainMenu(true);
  };

  // Add these handlers
  const handleLoadSave = (save: GameSave) => {
    setShapes({
      amount: new Decimal(save.shapes.amount),
      earned: new Decimal(save.shapes.earned),
      perSecond: new Decimal(save.shapes.perSecond)
    });
    setBuildings(save.buildings);
    setUpgrades(save.upgrades);
    setPrestigePoints(save.prestigePoints);
    setPrestigeMultiplier(save.prestigeMultiplier || 1);
    setStats(save.stats);
    setShowMainMenu(false);
  };

  const handleDeleteSave = (timestamp: number) => {
    if (window.confirm('Are you sure you want to delete this save?')) {
      localStorage.removeItem(`gameState_${timestamp}`);
      setToast('Save deleted successfully');
    }
  };

  // Add this near the top of your App component
  const isClient = typeof window !== 'undefined';

  // When accessing localStorage
  useEffect(() => {
    if (!isClient) return;

    const loadGame = async () => {
      try {
        const savedState = safeLocalStorage.getItem('gameState');
        if (savedState) {
          const parsed = JSON.parse(savedState);
          // Load saved state
          setShapes({
            amount: new Decimal(parsed.shapes.amount),
            earned: new Decimal(parsed.shapes.earned),
            perSecond: new Decimal(parsed.shapes.perSecond)
          });
          setBuildings(parsed.buildings || []);
          setUpgrades(parsed.upgrades || []);
        }
      } catch (error) {
        console.error('Error loading game:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGame();
  }, []);

  // Add this state to track if there's a current game
  const [hasCurrentGame, setHasCurrentGame] = useState(false);

  // Update useEffect to check for current game
  useEffect(() => {
    const hasGame = shapes.earned.toNumber() > 0 || buildings.some(b => b.owned > 0);
    setHasCurrentGame(hasGame);
  }, [shapes.earned.toNumber(), buildings]);

  // Add handler for returning to game
  const handleReturnToGame = () => {
    setShowMainMenu(false);
  };

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  // Add loading effect
  useEffect(() => {
    const loadGame = async () => {
      try {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
          const parsed = JSON.parse(savedState);
          // Load saved state
          setShapes({
            amount: new Decimal(parsed.shapes.amount),
            earned: new Decimal(parsed.shapes.earned),
            perSecond: new Decimal(parsed.shapes.perSecond)
          });
          setBuildings(parsed.buildings || []);
          setUpgrades(parsed.upgrades || []);
          // ... load other state
        }
      } catch (error) {
        console.error('Error loading game:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGame();
  }, []);

  // Add loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const omegaBuilding = buildings.find((b) => b.id === 'omega');
  const isOmegaUnlocked = omegaBuilding ? omegaBuilding.owned > 0 : false;

  return (
    <>
      <MainMenu
        isOpen={showMainMenu}
        onNewGame={handleNewGame}
        onLoadGame={handleLoadGame}
        onClose={() => setShowMainMenu(false)}
        onReturnToGame={handleReturnToGame}
        highScores={highScores}
        hasCurrentGame={hasCurrentGame}
      />
      <div className="background-image" />
      <div className="game-container text-white relative">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm z-50">
          <div className="container mx-auto px-4 py-2 flex justify-end items-center">
            <div className="flex items-center gap-2">
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
        <div className="container mx-auto px-4 pt-32 pb-8">
          <div className="grid grid-cols-[350px_1fr_350px] gap-8 items-start">
            {/* Buildings Column */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold mb-4">Buildings</h2>
              <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2">
                {buildings
                  .map(building => (
                    <Building
                      key={building.id}
                      building={building}
                      canAfford={shapes.amount.gte(calculateBuildingCost(building))}
                      onClick={() => handleBuyBuilding(building)}
                      currentShapes={shapes.earned.toNumber()}
                    />
                  ))}
              </div>
            </div>

            {/* Central Game Area */}
            <GameCore
              onShapeClick={handleShapeClick}
              isShapePressed={isShapePressed}
              clickPower={calculateClickPower()}
              stats={stats}
              shapes={shapes}
              soundEnabled={soundEnabled}
              onPrestige={handlePrestige}
              canPrestige={shapes.earned.gte(1e12)}
              prestigePoints={Math.max(0, Math.floor(Math.log10(shapes.earned.div(1e12).toNumber())))}
            />

            {/* Upgrades Column */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold mb-4">Upgrades</h2>
              <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2">
                {upgrades
                  .filter(upgrade => upgrade.unlockAt <= shapes.earned.toNumber())
                  .map(upgrade => (
                    <Upgrade
                      key={upgrade.id}
                      upgrade={upgrade}
                      canAfford={shapes.amount.gte(upgrade.currentCost)}
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
          onSave={handleSaveGame}
          onExitToMenu={handleExitToMenu}
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

        <PrestigeModal
          isOpen={showPrestigeModal}
          onClose={() => setShowPrestigeModal(false)}
          onPrestige={handleConfirmPrestige}
          currentMultiplier={prestigeMultiplier}
          nextMultiplier={prestigeMultiplier * (1 + Math.floor(shapes.earned.div(1e12).log(10)) * 0.1)}
          omegaUnlocked={isOmegaUnlocked}
          requiredAmount={new Decimal(1e12)}
          currentAmount={shapes.earned}
        />

        {toast && (
          <Toast
            message={toast}
            onClose={() => setToast(null)}
          />
        )}

        {achievementQueue.length > 0 && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <AchievementPopup
              achievement={achievementQueue[0]}
              onComplete={() => setAchievementQueue(prev => prev.slice(1))}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
