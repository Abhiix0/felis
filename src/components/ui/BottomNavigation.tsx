import React from 'react';
import { MainTab } from '../../types';
import { Home, FolderClosed, Radio, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: MainTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home size={18} strokeWidth={2} />,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <FolderClosed size={18} strokeWidth={2} />,
    },
    {
      id: 'radar',
      label: 'Radar',
      icon: <Radio size={18} strokeWidth={2} />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User size={18} strokeWidth={2} />,
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="w-full bg-[#0D0D0C]/95 backdrop-blur-md border-t border-[#1D1D1A] px-4 pt-2.5 pb-5 flex items-center justify-around shrink-0 z-20"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors duration-150 cursor-pointer ${
              isActive ? 'text-[#F06A3A]' : 'text-[#6F6D67] hover:text-[#A09E97]'
            }`}
          >
            {tab.icon}
            <span
              className={`font-mono text-[10px] tracking-tight transition-colors duration-150 ${
                isActive ? 'text-[#F06A3A] font-semibold' : 'text-[#6F6D67]'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
