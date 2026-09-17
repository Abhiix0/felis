import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, FolderClosed, Radio, User, Terminal, X } from 'lucide-react';
import { CatIllustration } from '../cat/CatIllustration';
import { CatChatTrigger } from '../ui/CatChatTrigger';

interface Screen01ShellProps {
  isDrawerMode?: boolean;
}

export const Screen01Shell: React.FC<Screen01ShellProps> = ({ isDrawerMode = false }) => {
  const { navigateTo, closeShellDrawer, openRecommendation } = useApp();

  const handleNav = (tab: 'home' | 'projects' | 'radar' | 'profile') => {
    navigateTo(tab);
    if (isDrawerMode) closeShellDrawer();
  };

  return (
    <div className="flex flex-col h-full w-full justify-between p-6 bg-[#0D0D0C]">
      {/* Top section */}
      <div className="flex flex-col">
        {/* User profile header */}
        <div className="flex items-center justify-between pb-8 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#181817] border border-[#292925] flex items-center justify-center text-[#F06A3A]">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#F1EFE8] leading-tight">
                Abhi
              </h2>
              <span className="font-mono text-xs text-[#6F6D67] tracking-tight">
                Personal OS
              </span>
            </div>
          </div>

          {isDrawerMode && (
            <button
              type="button"
              onClick={closeShellDrawer}
              className="p-2 text-[#6F6D67] hover:text-[#F1EFE8] transition-colors rounded-lg"
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-[#181817] border border-[#292925] text-[#F06A3A] font-medium text-sm transition-colors text-left"
          >
            <Home size={18} strokeWidth={2.2} />
            <span className="font-medium">Home</span>
          </button>

          <button
            type="button"
            onClick={() => handleNav('projects')}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-[#A09E97] hover:text-[#F1EFE8] hover:bg-[#141413] font-normal text-sm transition-colors text-left"
          >
            <FolderClosed size={18} />
            <span>Projects</span>
          </button>

          <button
            type="button"
            onClick={() => handleNav('radar')}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-[#A09E97] hover:text-[#F1EFE8] hover:bg-[#141413] font-normal text-sm transition-colors text-left"
          >
            <Radio size={18} />
            <span>Radar</span>
          </button>

          <button
            type="button"
            onClick={() => handleNav('profile')}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-[#A09E97] hover:text-[#F1EFE8] hover:bg-[#141413] font-normal text-sm transition-colors text-left"
          >
            <User size={18} />
            <span>Profile</span>
          </button>
        </nav>
      </div>

      {/* Middle & Lower: Handwritten doodle note & sitting cat */}
      <div className="my-auto py-6 flex flex-col items-start pl-2">
        <div className="font-hand text-2xl text-[#F1EFE8]/80 leading-snug tracking-wide mb-3">
          Small steps.
          <br />
          Big things.
        </div>
        <div className="pl-4">
          <CatIllustration
            pose="idle"
            size={74}
            interactive
            onTap={openRecommendation}
          />
        </div>
      </div>

      {/* Bottom command entry */}
      <div className="pt-4 pb-2">
        <CatChatTrigger
          onClick={openRecommendation}
          dotIndicator
        />
      </div>
    </div>
  );
};
