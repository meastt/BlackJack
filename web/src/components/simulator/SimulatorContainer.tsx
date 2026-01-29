'use client';

import { useState } from 'react';
import FullSimulator from './FullSimulator';
import SpeedCountDrill from './SpeedCountDrill';

type DrillType = 'full-simulator' | 'speed-count' | 'true-count';

export default function SimulatorContainer() {
  const [selectedDrill, setSelectedDrill] = useState<DrillType>('full-simulator');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Card Counting Simulator
          </h1>
          <p className="text-xl text-secondary">
            Practice your card counting skills directly in your browser
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedDrill('full-simulator')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedDrill === 'full-simulator'
                  ? 'bg-primary text-white shadow-[0_0_20px_rgba(255,45,124,0.6)]'
                  : 'bg-surface text-secondary hover:text-white'
              }`}
            >
              Full Simulator
            </button>
            <button
              onClick={() => setSelectedDrill('speed-count')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedDrill === 'speed-count'
                  ? 'bg-primary text-white shadow-[0_0_20px_rgba(255,45,124,0.6)]'
                  : 'bg-surface text-secondary hover:text-white'
              }`}
            >
              Speed Count Drill
            </button>
            <button
              onClick={() => setSelectedDrill('true-count')}
              className={`px-6 py-3 rounded-lg font-medium transition-all opacity-50 cursor-not-allowed ${
                selectedDrill === 'true-count'
                  ? 'bg-primary text-white'
                  : 'bg-surface text-secondary'
              }`}
              disabled
            >
              True Count Drill
              <span className="ml-2 text-xs">(Coming Soon)</span>
            </button>
          </div>
        </div>

        <div className="animate-fade-in">
          {selectedDrill === 'full-simulator' && <FullSimulator />}
          {selectedDrill === 'speed-count' && <SpeedCountDrill />}
          {selectedDrill === 'true-count' && <div className="text-center text-secondary">Coming soon...</div>}
        </div>
      </div>
    </div>
  );
}
