'use client';

import { CountingSystem } from '@card-counter-ai/shared';
import { GameSettings } from '@/hooks/useBlackjackGame';

interface GameSettingsProps {
  settings: GameSettings;
  onSettingsChange: (settings: Partial<GameSettings>) => void;
  disabled?: boolean;
}

export default function GameSettingsPanel({ settings, onSettingsChange, disabled = false }: GameSettingsProps) {
  return (
    <div className="card p-6 space-y-6">
      <h3 className="text-xl font-bold text-gradient mb-4">Game Settings</h3>

      {/* Deck Count */}
      <div>
        <label className="block text-sm font-medium mb-2">Number of Decks</label>
        <select
          value={settings.deckCount}
          onChange={(e) => onSettingsChange({ deckCount: parseInt(e.target.value, 10) })}
          disabled={disabled}
          className="w-full px-4 py-2 rounded bg-surface border border-white/20 focus:border-primary outline-none disabled:opacity-50"
        >
          {[1, 2, 4, 6, 8].map(count => (
            <option key={count} value={count}>{count} {count === 1 ? 'Deck' : 'Decks'}</option>
          ))}
        </select>
      </div>

      {/* Counting System */}
      <div>
        <label className="block text-sm font-medium mb-2">Counting System</label>
        <select
          value={settings.countingSystem}
          onChange={(e) => onSettingsChange({ countingSystem: e.target.value as CountingSystem })}
          disabled={disabled}
          className="w-full px-4 py-2 rounded bg-surface border border-white/20 focus:border-primary outline-none disabled:opacity-50"
        >
          <option value={CountingSystem.HI_LO}>Hi-Lo (Beginner)</option>
          <option value={CountingSystem.KO}>KO (Beginner)</option>
          <option value={CountingSystem.HI_OPT_I}>Hi-Opt I (Intermediate)</option>
          <option value={CountingSystem.HI_OPT_II}>Hi-Opt II (Advanced)</option>
          <option value={CountingSystem.OMEGA_II}>Omega II (Expert)</option>
          <option value={CountingSystem.ZEN}>Zen Count (Advanced)</option>
        </select>
      </div>

      {/* Penetration */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Shoe Penetration: {Math.round(settings.penetration * 100)}%
        </label>
        <input
          type="range"
          min="0.5"
          max="0.9"
          step="0.05"
          value={settings.penetration}
          onChange={(e) => onSettingsChange({ penetration: parseFloat(e.target.value) })}
          disabled={disabled}
          className="w-full disabled:opacity-50"
        />
        <div className="text-xs text-secondary mt-1">
          Percentage of shoe dealt before shuffle
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <h4 className="text-sm font-bold mb-3">Training Wheels</h4>
        <div className="space-y-2">
          <ToggleSwitch
            label="Show Count Values on Cards"
            checked={settings.showCountValues}
            onChange={(checked) => onSettingsChange({ showCountValues: checked })}
            disabled={disabled}
          />
          <ToggleSwitch
            label="Show Running Count"
            checked={settings.showRunningCount}
            onChange={(checked) => onSettingsChange({ showRunningCount: checked })}
            disabled={disabled}
          />
          <ToggleSwitch
            label="Show True Count"
            checked={settings.showTrueCount}
            onChange={(checked) => onSettingsChange({ showTrueCount: checked })}
            disabled={disabled}
          />
          <ToggleSwitch
            label="Show Decks Remaining"
            checked={settings.showDecksRemaining}
            onChange={(checked) => onSettingsChange({ showDecksRemaining: checked })}
            disabled={disabled}
          />
          <ToggleSwitch
            label="Show Betting Recommendation"
            checked={settings.showBettingRecommendation}
            onChange={(checked) => onSettingsChange({ showBettingRecommendation: checked })}
            disabled={disabled}
          />
          <ToggleSwitch
            label="Show Basic Strategy Hint"
            checked={settings.showBasicStrategy}
            onChange={(checked) => onSettingsChange({ showBasicStrategy: checked })}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ label, checked, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm text-secondary group-hover:text-white transition-colors">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${checked ? 'bg-primary' : 'bg-surface-border'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </label>
  );
}
