import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#F06A3A] hover:bg-[#D9572D] active:scale-[0.98] text-[#0D0D0C] font-semibold text-sm transition-all duration-150 shadow-sm cursor-pointer ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      <span>{children}</span>
      {icon && <span className="shrink-0">{icon}</span>}
    </button>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#181817] hover:bg-[#20201E] border border-[#292925] active:scale-[0.98] text-[#F1EFE8] font-medium text-sm transition-all duration-150 cursor-pointer ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0 text-[#A09E97]">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export const OutlineButton: React.FC<ButtonProps> = ({
  children,
  icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-transparent hover:bg-[#141413] border border-[#292925] border-dashed text-[#A09E97] hover:text-[#F1EFE8] text-xs font-mono transition-colors duration-150 cursor-pointer ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
