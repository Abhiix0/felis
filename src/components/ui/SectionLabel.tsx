import React from 'react';

interface SectionLabelProps {
  children: React.ReactNode;
  rightElement?: React.ReactNode;
  variant?: 'default' | 'accent' | 'muted';
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  children,
  rightElement,
  variant = 'muted',
  className = '',
}) => {
  const colorClass =
    variant === 'accent'
      ? 'text-[#F06A3A]'
      : variant === 'default'
      ? 'text-[#A09E97]'
      : 'text-[#6F6D67]';

  return (
    <div className={`flex items-center justify-between py-1 ${className}`}>
      <span
        className={`font-mono text-[11px] font-semibold tracking-wider uppercase ${colorClass}`}
      >
        {children}
      </span>
      {rightElement && (
        <span className="font-mono text-[11px] text-[#6F6D67] font-medium tracking-wide">
          {rightElement}
        </span>
      )}
    </div>
  );
};
