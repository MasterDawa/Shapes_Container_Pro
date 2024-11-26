import React from 'react';
import { X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800/90 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto backdrop-blur-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">How to Play</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          <div className="space-y-6 text-white/90">
            <section>
              <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
              <p>1. Click the shape button in the center to earn shapes</p>
              <p>2. Collect 15 shapes to buy your first Shape Box</p>
              <p>3. Purchase buildings to start auto-generating shapes</p>
              <p>4. Buy upgrades to increase your production and clicking power</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Buildings</h3>
              <p className="mb-2">Buildings automatically produce shapes over time. Each tier produces more shapes but costs more:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>• Shape Box (15) - 0.1/s</p>
                  <p>• Shape Crate (100) - 0.5/s</p>
                  <p>• Shape Vault (600) - 5/s</p>
                  <p>• Shape Warehouse (4K) - 12/s</p>
                  <p>• Shape Factory (20K) - 90/s</p>
                  <p>• Shape Megaplex (100K) - 500/s</p>
                  <p>• Shape Citadel (500K) - 2.5K/s</p>
                  <p>• Shape Nexus (2M) - 10K/s</p>
                </div>
                <div>
                  <p>• Shape Dimension (10M) - 50K/s</p>
                  <p>• Shape Multiverse (50M) - 250K/s</p>
                  <p>• Quantum Engine (200M) - 1M/s</p>
                  <p>• Celestial Forge (1B) - 5M/s</p>
                  <p>• Infinity Matrix (5B) - 25M/s</p>
                  <p>• Eternal Core (25B) - 100M/s</p>
                  <p>• Omega Singularity (100B) - 500M/s</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Prestige System</h3>
              <p>When you reach certain milestones, you can prestige to reset your progress in exchange for permanent bonuses:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All buildings and shapes are reset</li>
                <li>Gain a permanent production multiplier</li>
                <li>Unlock new upgrades and achievements</li>
                <li>Each prestige level makes progression faster</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Achievements</h3>
              <p>Complete achievements to earn permanent bonuses:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Production multipliers boost all shape generation</li>
                <li>Golden bonuses increase rare container chances</li>
                <li>Prestige bonuses improve future prestige rewards</li>
                <li>Some achievements are hidden - discover them as you play!</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Special Features</h3>
              <p>• Lucky shapes appear randomly - click them for bonus rewards!</p>
              <p>• Golden containers provide powerful boosts</p>
              <p>• Progress saves automatically every 30 seconds</p>
              <p>• Each building has a unique color and style</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}