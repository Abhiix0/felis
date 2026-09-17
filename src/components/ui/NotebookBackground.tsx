import React from 'react';

interface NotebookBackgroundProps {
  children: React.ReactNode;
  className?: string;
  subtle?: boolean;
}

export const NotebookBackground: React.FC<NotebookBackgroundProps> = ({
  children,
  className = '',
  subtle = false,
}) => {
  return (
    <div
      className={`relative w-full h-full bg-[#0D0D0C] text-[#F1EFE8] overflow-hidden ${className}`}
    >
      {/* Subtle Notebook Ruling/Grid */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          subtle ? 'notebook-grid-subtle' : 'notebook-grid'
        } opacity-70`}
        aria-hidden="true"
      />

      {/* Very faint dark vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(24,24,23,0.3)_0%,_rgba(13,13,12,0.85)_100%)]"
        aria-hidden="true"
      />

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};
