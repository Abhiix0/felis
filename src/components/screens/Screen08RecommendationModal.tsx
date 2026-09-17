import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Clock, Calendar, Check, ArrowRight } from 'lucide-react';
import { SignalRail } from '../ui/SignalRail';
import { PrimaryButton } from '../ui/Buttons';
import { CatIllustration } from '../cat/CatIllustration';

export const Screen08RecommendationModal: React.FC = () => {
  const {
    recommendation,
    closeRecommendation,
    startFocus,
  } = useApp();

  const handleStart = () => {
    startFocus(recommendation.taskId);
    closeRecommendation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xs transition-opacity duration-200">
      {/* Background click to dismiss */}
      <div
        className="absolute inset-0"
        onClick={closeRecommendation}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-sm bg-[#141413] border border-[#292925] rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl overflow-hidden flex flex-col">
        {/* Cat anchored on top edge */}
        <div className="absolute -top-7 right-8 pointer-events-none">
          <CatIllustration pose="recommendation" size={54} interactive={false} />
        </div>

        {/* Header & Close */}
        <div className="flex items-center justify-between pb-3">
          <button
            type="button"
            onClick={closeRecommendation}
            className="p-1.5 text-[#6F6D67] hover:text-[#F1EFE8] rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Title */}
        <div className="mb-4">
          <span className="font-mono text-[11px] font-semibold text-[#F06A3A] tracking-wider uppercase">
            WHAT SHOULD I DO?
          </span>
          <p className="text-xs text-[#A09E97] mt-0.5 font-normal">
            Based on your current work...
          </p>
        </div>

        {/* Single Focused Recommendation Card */}
        <div className="relative bg-[#181817] border border-[#292925] rounded-xl overflow-hidden mb-5">
          <div className="flex">
            {/* Orange Signal Rail */}
            <SignalRail height="h-auto" />

            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#F1EFE8] leading-tight">
                  {recommendation.title}
                </h3>
                <span className="font-mono text-xs text-[#A09E97] mt-0.5 block">
                  {recommendation.projectName}
                </span>

                <div className="flex flex-col gap-1.5 mt-3 font-mono text-xs text-[#6F6D67]">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#A09E97]" />
                    <span>{recommendation.dueDateLabel}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-[#A09E97]" />
                    <span>~{recommendation.estimatedMinutes} minutes</span>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className="mt-4 flex justify-end">
                <PrimaryButton
                  onClick={handleStart}
                  icon={<ArrowRight size={14} />}
                  className="px-5 py-2 text-xs"
                >
                  Start
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>

        {/* "Why this?" Section */}
        <div className="bg-[#111110] border border-[#1D1D1A] rounded-xl p-3.5 space-y-2">
          <span className="font-mono text-[10px] text-[#A09E97] font-semibold tracking-wider uppercase block">
            Why this?
          </span>
          <div className="space-y-1.5 font-mono text-xs text-[#F1EFE8]">
            {recommendation.reasonBullets.map((reason, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Check size={13} className="text-[#B7D96B] shrink-0" strokeWidth={2.5} />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
