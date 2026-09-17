import React from 'react';
import { useApp } from '../../context/AppContext';
import { Terminal, Moon, Bell, Shield, ChevronRight, Sliders } from 'lucide-react';
import { CatIllustration } from '../cat/CatIllustration';

export const ScreenProfile: React.FC = () => {
  const { openRecommendation, resetToDefaultData, setEmptyProjects, setEmptyTasks } = useApp();

  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 pt-3 pb-8">
      {/* Header */}
      <div className="py-2">
        <h1 className="text-xl font-semibold text-[#F1EFE8] tracking-tight">
          Profile
        </h1>
      </div>

      {/* Profile Card */}
      <div className="flex items-center gap-4 bg-[#141413] border border-[#292925] rounded-xl p-4 my-3">
        <div className="w-12 h-12 rounded-xl bg-[#181817] border border-[#292925] flex items-center justify-center text-[#F06A3A] shrink-0">
          <Terminal size={22} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[#F1EFE8] leading-tight">
            Abhi
          </h2>
          <span className="font-mono text-xs text-[#A09E97]">
            Personal OS
          </span>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="mt-4">
        <span className="font-mono text-[11px] font-semibold text-[#6F6D67] uppercase tracking-wider block mb-2 px-1">
          Preferences
        </span>

        <div className="bg-[#141413] border border-[#292925] rounded-xl divide-y divide-[#1D1D1A]">
          <div className="flex items-center justify-between p-3.5 text-xs text-[#F1EFE8]">
            <div className="flex items-center gap-2.5">
              <Moon size={15} className="text-[#A09E97]" />
              <span>Theme: Dark Notebook</span>
            </div>
            <span className="font-mono text-[11px] text-[#F06A3A]">Active</span>
          </div>

          <div className="flex items-center justify-between p-3.5 text-xs text-[#F1EFE8]">
            <div className="flex items-center gap-2.5">
              <Bell size={15} className="text-[#A09E97]" />
              <span>Quiet Notifications</span>
            </div>
            <span className="font-mono text-[11px] text-[#A09E97]">Enabled</span>
          </div>

          <div className="flex items-center justify-between p-3.5 text-xs text-[#F1EFE8]">
            <div className="flex items-center gap-2.5">
              <Shield size={15} className="text-[#A09E97]" />
              <span>Local Storage Only</span>
            </div>
            <span className="font-mono text-[11px] text-[#B7D96B]">Active</span>
          </div>
        </div>
      </div>

      {/* Prototype Demo Helpers */}
      <div className="mt-6">
        <span className="font-mono text-[11px] font-semibold text-[#6F6D67] uppercase tracking-wider block mb-2 px-1">
          Prototype Data Tools
        </span>

        <div className="bg-[#141413] border border-[#292925] rounded-xl p-3 space-y-2 font-mono text-xs">
          <button
            type="button"
            onClick={resetToDefaultData}
            className="w-full text-left py-2 px-3 rounded-lg bg-[#181817] hover:bg-[#20201E] text-[#F1EFE8] flex items-center justify-between transition-colors"
          >
            <span>Reset Demo Data</span>
            <ChevronRight size={14} className="text-[#6F6D67]" />
          </button>
          <button
            type="button"
            onClick={setEmptyProjects}
            className="w-full text-left py-2 px-3 rounded-lg bg-[#181817] hover:bg-[#20201E] text-[#A09E97] flex items-center justify-between transition-colors"
          >
            <span>Test Empty Projects View</span>
            <ChevronRight size={14} className="text-[#6F6D67]" />
          </button>
          <button
            type="button"
            onClick={setEmptyTasks}
            className="w-full text-left py-2 px-3 rounded-lg bg-[#181817] hover:bg-[#20201E] text-[#A09E97] flex items-center justify-between transition-colors"
          >
            <span>Test Empty Tasks View</span>
            <ChevronRight size={14} className="text-[#6F6D67]" />
          </button>
        </div>
      </div>

      {/* Bottom Cat */}
      <div className="mt-auto pt-6 flex justify-center">
        <CatIllustration
          pose="idle"
          size={50}
          interactive
          onTap={openRecommendation}
        />
      </div>
    </div>
  );
};
