import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CatIllustration } from '../cat/CatIllustration';
import { SecondaryButton } from '../ui/Buttons';
import { AlertCircle, Check, RotateCw, Loader2 } from 'lucide-react';

export const Screen10StatesGallery: React.FC = () => {
  const { navigateTo } = useApp();
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 pt-3 pb-8">
      {/* Header */}
      <div className="py-2 mb-2">
        <h1 className="text-xl font-semibold text-[#F1EFE8] tracking-tight">
          System States
        </h1>
        <p className="font-mono text-xs text-[#6F6D67] mt-0.5">
          Standardized state variations
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* 1. Loading State Card */}
        <div className="bg-[#141413] border border-[#292925] rounded-xl p-4 flex flex-col justify-between">
          <span className="font-mono text-[10px] text-[#A09E97] uppercase tracking-wider mb-3 block">
            Loading
          </span>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Loader2 size={22} className="text-[#6F6D67] animate-spin shrink-0" />
              <span className="text-xs text-[#A09E97] font-mono">
                Loading your projects...
              </span>
            </div>

            <CatIllustration pose="loading" size={48} interactive={false} />
          </div>
        </div>

        {/* 2. Error State Card */}
        <div className="bg-[#141413] border border-[#292925] rounded-xl p-4 flex flex-col justify-between">
          <span className="font-mono text-[10px] text-[#F06A3A] uppercase tracking-wider mb-2 block">
            Error
          </span>

          <div className="flex items-start justify-between">
            <div className="flex flex-col items-start pr-2">
              <div className="flex items-center gap-2 mb-1.5">
                <AlertCircle size={16} className="text-[#F06A3A] shrink-0" />
                <h3 className="text-sm font-semibold text-[#F1EFE8]">
                  Something went wrong.
                </h3>
              </div>
              <p className="text-xs text-[#A09E97] leading-relaxed mb-3">
                Couldn't load your projects. Please try again.
              </p>

              <SecondaryButton
                onClick={handleRetry}
                icon={<RotateCw size={12} className={retrying ? 'animate-spin' : ''} />}
                className="py-1.5 px-3 text-xs"
              >
                {retrying ? 'Retrying...' : 'Retry'}
              </SecondaryButton>
            </div>

            <div className="shrink-0 mt-1">
              <CatIllustration pose="error" size={54} interactive={false} />
            </div>
          </div>
        </div>

        {/* 3. Completed State Card */}
        <div className="bg-[#141413] border border-[#292925] rounded-xl p-4 flex flex-col justify-between">
          <span className="font-mono text-[10px] text-[#B7D96B] uppercase tracking-wider mb-2 block">
            Completed
          </span>

          <div className="flex items-start justify-between">
            <div className="flex flex-col items-start pr-2">
              <div className="w-7 h-7 rounded-full bg-[#B7D96B]/15 border border-[#B7D96B]/30 flex items-center justify-center text-[#B7D96B] mb-2">
                <Check size={14} strokeWidth={3} />
              </div>

              <h3 className="text-sm font-semibold text-[#F1EFE8]">
                Nice. Done.
              </h3>
              <p className="font-mono text-xs text-[#A09E97] mt-0.5 mb-3">
                Authentication tests
              </p>

              <SecondaryButton
                onClick={() => navigateTo('tasks')}
                className="py-1.5 px-3 text-xs"
              >
                View details
              </SecondaryButton>
            </div>

            <div className="shrink-0 relative">
              <div className="absolute -top-3.5 right-1 font-hand text-xs text-[#F06A3A]">
                Great!
              </div>
              <CatIllustration pose="completed" size={58} interactive={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
