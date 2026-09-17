import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { CatIllustration } from '../cat/CatIllustration';

interface CatChatTriggerProps {
  onClick: () => void;
  withCat?: boolean;
  className?: string;
  dotIndicator?: boolean;
}

export const CatChatTrigger: React.FC<CatChatTriggerProps> = ({
  onClick,
  withCat = false,
  className = '',
  dotIndicator = false,
}) => {
  return (
    <div className={`flex items-end gap-2 ${className}`}>
      {withCat && (
        <div className="shrink-0 mb-0.5">
          <CatIllustration
            pose="idle"
            size={38}
            interactive
            onTap={onClick}
          />
        </div>
      )}

      <button
        type="button"
        onClick={onClick}
        className="flex-1 flex items-center justify-between px-3.5 py-2.5 bg-[#141413] hover:bg-[#181817] active:bg-[#111110] border border-[#292925] hover:border-[#383832] rounded-xl text-left transition-all duration-150 group cursor-pointer shadow-sm"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles size={14} className="text-[#F06A3A] shrink-0" />
          <span className="text-xs font-mono text-[#F1EFE8] group-hover:text-white tracking-tight">
            What should I work on?
          </span>
        </div>

        {dotIndicator ? (
          <div className="w-2 h-2 rounded-full bg-[#F06A3A] shrink-0" />
        ) : (
          <ChevronRight size={14} className="text-[#6F6D67] group-hover:text-[#A09E97] transition-colors shrink-0" />
        )}
      </button>
    </div>
  );
};
