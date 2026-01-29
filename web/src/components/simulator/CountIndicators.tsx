'use client';

interface CountIndicatorsProps {
  runningCount: number;
  trueCount: number;
  decksRemaining: number;
  showRunningCount: boolean;
  showTrueCount: boolean;
  showDecksRemaining: boolean;
}

export default function CountIndicators({
  runningCount,
  trueCount,
  decksRemaining,
  showRunningCount,
  showTrueCount,
  showDecksRemaining,
}: CountIndicatorsProps) {
  if (!showRunningCount && !showTrueCount && !showDecksRemaining) {
    return null;
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-bold mb-4 text-center">Count Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {showRunningCount && (
          <div className="text-center p-4 rounded-lg bg-surface border border-primary/30">
            <div className="text-sm text-secondary mb-1">Running Count</div>
            <div className={`text-4xl font-bold ${
              runningCount > 0 ? 'text-accent-green' :
              runningCount < 0 ? 'text-red-500' :
              'text-secondary'
            }`}>
              {runningCount > 0 ? '+' : ''}{runningCount}
            </div>
          </div>
        )}

        {showTrueCount && (
          <div className="text-center p-4 rounded-lg bg-surface border border-accent-cyan/30">
            <div className="text-sm text-secondary mb-1">True Count</div>
            <div className={`text-4xl font-bold ${
              trueCount > 0 ? 'text-accent-green' :
              trueCount < 0 ? 'text-red-500' :
              'text-secondary'
            }`}>
              {trueCount > 0 ? '+' : ''}{trueCount}
            </div>
          </div>
        )}

        {showDecksRemaining && (
          <div className="text-center p-4 rounded-lg bg-surface border border-purple-500/30">
            <div className="text-sm text-secondary mb-1">Decks Remaining</div>
            <div className="text-4xl font-bold text-purple-400">
              {decksRemaining.toFixed(1)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
