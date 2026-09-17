import React from 'react';
import { useApp } from '../../context/AppContext';
import { CatIllustration } from '../cat/CatIllustration';
import { Radio, RefreshCw } from 'lucide-react';

export const ScreenRadar: React.FC = () => {
  const { openRecommendation } = useApp();

  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 pt-3 pb-8 justify-between">
      <div>
        <div className="flex items-center justify-between py-2">
          <h1 className="text-xl font-semibold text-[#F1EFE8] tracking-tight">
            Radar
          </h1>
          <button
            type="button"
            className="p-1.5 text-[#6F6D67] hover:text-[#A09E97] rounded-lg"
          >
            <Radio size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center my-auto py-12">
        <CatIllustration
          pose="idle"
          size={84}
          interactive
          onTap={openRecommendation}
        />
        <h2 className="text-lg font-semibold text-[#F1EFE8] mt-4 tracking-tight">
          Radar
        </h2>
        <p className="font-mono text-xs text-[#A09E97] mt-1.5 max-w-[220px] leading-relaxed">
          Technology updates will appear here.
        </p>
      </div>

      <div className="p-3.5 bg-[#141413] border border-[#292925] rounded-xl flex items-center justify-between font-mono text-xs text-[#6F6D67]">
        <span>Signal Status</span>
        <span className="text-[#B7D96B] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B7D96B] animate-pulse" />
          Listening
        </span>
      </div>
    </div>
  );
};
