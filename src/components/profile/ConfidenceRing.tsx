export function ConfidenceRing({
  score,
  size = 120,
}: {
  score: number;
  size?: number;
}) {
  const pct = Math.round(score * 100);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score * circumference);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--hairline)"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--signal)"
          strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-medium text-ink">{pct}%</span>
        <span className="font-mono-ui text-[10px] uppercase tracking-wider text-graphite">
          confidence
        </span>
      </div>
    </div>
  );
}
