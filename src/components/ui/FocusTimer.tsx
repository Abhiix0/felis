import React from 'react';

interface FocusTimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  size?: number;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({
  remainingSeconds,
  totalSeconds,
  isRunning,
  size = 210,
}) => {
  const strokeWidth = 5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="relative flex items-center justify-center my-4" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="rotate-[-90deg] overflow-visible"
        aria-hidden="true"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1F1F1C"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Active progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F06A3A"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-500 ease-linear"
        />
      </svg>

      {/* Central Time Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-mono text-4xl font-semibold tracking-tight text-[#F1EFE8]">
          {formattedTime}
        </span>
        <span className="font-mono text-[11px] text-[#6F6D67] mt-1 tracking-wider uppercase">
          {isRunning ? 'FOCUSING' : remainingSeconds === 0 ? 'COMPLETED' : 'PAUSED'}
        </span>
      </div>
    </div>
  );
};
