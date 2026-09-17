import React from 'react';

interface ProgressBarProps {
  percent: number;
  className?: string;
  height?: string;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  className = '',
  height = 'h-1.5',
  color = '#F06A3A',
}) => {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  return (
    <div
      className={`w-full bg-[#1F1F1C] rounded-full overflow-hidden ${height} ${className}`}
      role="progressbar"
      aria-valuenow={clampedPercent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-all duration-300 ease-out"
        style={{
          width: `${clampedPercent}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
};
