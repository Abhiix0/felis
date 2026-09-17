import React from 'react';

interface SignalRailProps {
  className?: string;
  height?: string;
}

export const SignalRail: React.FC<SignalRailProps> = ({
  className = '',
  height = 'h-full',
}) => {
  return (
    <div
      className={`w-1 bg-[#F06A3A] rounded-full shrink-0 ${height} ${className}`}
      aria-hidden="true"
    />
  );
};
