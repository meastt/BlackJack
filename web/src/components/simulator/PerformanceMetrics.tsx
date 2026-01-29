'use client';

interface PerformanceMetricsProps {
  correctAnswers: number;
  totalAnswers: number;
  accuracy: number;
  cardsDealt: number;
  timeElapsed: number;
  cardsPerMinute: number;
  currentStreak: number;
  bestStreak: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function PerformanceMetrics({
  correctAnswers,
  totalAnswers,
  accuracy,
  cardsDealt,
  timeElapsed,
  cardsPerMinute,
  currentStreak,
  bestStreak,
}: PerformanceMetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        label="Accuracy"
        value={totalAnswers > 0 ? `${accuracy}%` : '-'}
        subtitle={`${correctAnswers}/${totalAnswers}`}
        color="primary"
      />
      <MetricCard
        label="Speed"
        value={cardsPerMinute > 0 ? `${cardsPerMinute}` : '-'}
        subtitle="cards/min"
        color="cyan"
      />
      <MetricCard
        label="Cards"
        value={cardsDealt.toString()}
        subtitle={formatTime(timeElapsed)}
        color="green"
      />
      <MetricCard
        label="Streak"
        value={currentStreak.toString()}
        subtitle={`Best: ${bestStreak}`}
        color="purple"
      />
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  subtitle: string;
  color: 'primary' | 'cyan' | 'green' | 'purple';
}

function MetricCard({ label, value, subtitle, color }: MetricCardProps) {
  const colorClasses = {
    primary: 'border-primary text-primary',
    cyan: 'border-accent-cyan text-accent-cyan',
    green: 'border-accent-green text-accent-green',
    purple: 'border-purple-500 text-purple-500',
  };

  return (
    <div className={`card p-4 border-2 ${colorClasses[color]}`}>
      <div className="text-sm text-secondary uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="text-3xl font-bold mb-1">
        {value}
      </div>
      <div className="text-xs text-secondary">
        {subtitle}
      </div>
    </div>
  );
}
