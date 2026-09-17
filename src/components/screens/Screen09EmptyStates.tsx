import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CatIllustration } from '../cat/CatIllustration';
import { PrimaryButton } from '../ui/Buttons';
import { Plus, Search } from 'lucide-react';

interface Screen09EmptyStatesProps {
  stateType?: 'projects' | 'tasks' | 'all_completed';
  onAction?: () => void;
}

export const Screen09EmptyStates: React.FC<Screen09EmptyStatesProps> = ({
  stateType: initialType = 'projects',
  onAction,
}) => {
  const { navigateTo, resetToDefaultData } = useApp();
  const [currentType, setCurrentType] = useState<'projects' | 'tasks' | 'all_completed'>(initialType);

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (currentType === 'projects') {
      navigateTo('projects');
    } else {
      navigateTo('add_task');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 pt-3 pb-8">
      {/* Header matching wireframe */}
      <div className="flex items-center justify-between py-2">
        <h1 className="text-xl font-semibold text-[#F1EFE8] tracking-tight">
          {currentType === 'projects' ? 'Projects' : 'Tasks'}
        </h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-[#A09E97] rounded-lg"
            aria-label="Search"
          >
            <Search size={17} />
          </button>

          <button
            type="button"
            onClick={handleAction}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#181817] border border-[#292925] text-xs font-medium text-[#F1EFE8]"
          >
            <Plus size={13} className="text-[#F06A3A]" />
            <span>New {currentType === 'projects' ? 'Project' : 'Task'}</span>
          </button>
        </div>
      </div>

      {/* Variation switcher tab */}
      <div className="flex gap-2 my-2 p-1 bg-[#141413] border border-[#292925] rounded-lg text-[11px] font-mono">
        <button
          type="button"
          onClick={() => setCurrentType('projects')}
          className={`flex-1 py-1 rounded transition-colors ${
            currentType === 'projects'
              ? 'bg-[#1D1D1A] text-[#F06A3A] font-semibold'
              : 'text-[#6F6D67] hover:text-[#A09E97]'
          }`}
        >
          No Projects
        </button>
        <button
          type="button"
          onClick={() => setCurrentType('tasks')}
          className={`flex-1 py-1 rounded transition-colors ${
            currentType === 'tasks'
              ? 'bg-[#1D1D1A] text-[#F06A3A] font-semibold'
              : 'text-[#6F6D67] hover:text-[#A09E97]'
          }`}
        >
          No Tasks
        </button>
        <button
          type="button"
          onClick={() => setCurrentType('all_completed')}
          className={`flex-1 py-1 rounded transition-colors ${
            currentType === 'all_completed'
              ? 'bg-[#1D1D1A] text-[#F06A3A] font-semibold'
              : 'text-[#6F6D67] hover:text-[#A09E97]'
          }`}
        >
          All Clear
        </button>
      </div>

      {/* Main Empty State Content */}
      <div className="flex flex-col items-center justify-center text-center my-auto py-8">
        {/* Sleeping Cat illustration on closed notebook */}
        <div className="mb-4">
          <CatIllustration
            pose={currentType === 'all_completed' ? 'focus' : 'empty'}
            size={currentType === 'all_completed' ? 88 : 130}
            interactive={false}
          />
        </div>

        {currentType === 'projects' && (
          <>
            <h2 className="text-xl font-semibold text-[#F1EFE8] tracking-tight">
              No projects yet
            </h2>
            <p className="text-xs text-[#A09E97] mt-1.5 max-w-[240px] leading-relaxed font-normal">
              Create your first project to start organizing your work.
            </p>
            <div className="mt-5">
              <PrimaryButton onClick={handleAction} icon={<Plus size={15} />}>
                New Project
              </PrimaryButton>
            </div>
          </>
        )}

        {currentType === 'tasks' && (
          <>
            <h2 className="text-xl font-semibold text-[#F1EFE8] tracking-tight">
              Nothing here.
            </h2>
            <p className="text-xs text-[#A09E97] mt-1.5 max-w-[240px] leading-relaxed font-normal">
              Add something to work on.
            </p>
            <div className="mt-5">
              <PrimaryButton onClick={handleAction} icon={<Plus size={15} />}>
                Add task
              </PrimaryButton>
            </div>
          </>
        )}

        {currentType === 'all_completed' && (
          <>
            <h2 className="text-xl font-semibold text-[#F1EFE8] tracking-tight">
              All clear.
            </h2>
            <p className="text-xs text-[#A09E97] mt-1.5 max-w-[240px] leading-relaxed font-normal">
              Nothing left for now. Time to rest or plan ahead.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={resetToDefaultData}
                className="px-3 py-2 rounded-lg bg-[#181817] border border-[#292925] text-xs font-mono text-[#A09E97] hover:text-[#F1EFE8]"
              >
                Reset Demo Tasks
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
