import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, SlidersHorizontal, Terminal, Plus, GitBranch, Layers } from 'lucide-react';
import { SectionLabel } from '../ui/SectionLabel';
import { TaskRow } from '../ui/TaskRow';
import { OutlineButton } from '../ui/Buttons';
import { CatIllustration } from '../cat/CatIllustration';

export const Screen04ProjectDetail: React.FC = () => {
  const {
    projects,
    tasks,
    selectedProjectId,
    navigateTo,
    toggleTask,
    startFocus,
    openRecommendation,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'tasks'>('tasks');

  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Tasks belonging to this project
  const projectTasks = tasks.filter((t) => t.projectId === project?.id || t.projectName === project?.name);
  const activeTasks = projectTasks.filter((t) => !t.completed);
  const completedTasks = projectTasks.filter((t) => t.completed);

  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 pt-3 pb-6">
      {/* Top Bar with back link */}
      <div className="flex items-center justify-between py-2">
        <button
          type="button"
          onClick={() => navigateTo('projects')}
          className="flex items-center gap-2 text-xs font-mono text-[#A09E97] hover:text-[#F1EFE8] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Projects</span>
        </button>

        <button
          type="button"
          className="p-1 text-[#6F6D67] hover:text-[#A09E97] rounded-md transition-colors"
          aria-label="Filter"
        >
          <SlidersHorizontal size={15} />
        </button>
      </div>

      {/* Project Hero Header */}
      <div className="flex items-start gap-4 mt-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-[#181817] border border-[#292925] flex items-center justify-center shrink-0">
          <Terminal size={22} className="text-[#F06A3A]" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-[#F1EFE8] leading-tight">
            {project?.name || 'Spawn'}
          </h1>
          <span className="text-xs text-[#A09E97] mt-0.5">
            {project?.description || 'Developer CLI'}
          </span>
          <div className="flex items-center gap-1.5 mt-1 font-mono text-[11px] text-[#6F6D67]">
            <span>{project?.stack?.[0] || 'Python'}</span>
            <span>·</span>
            <span>{project?.stack?.[1] || 'Backend'}</span>
          </div>
        </div>
      </div>

      {/* Tabs: Overview | Tasks */}
      <div className="flex border-b border-[#1D1D1A] mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-center text-xs font-mono transition-colors relative cursor-pointer ${
            activeTab === 'overview'
              ? 'text-[#F06A3A] font-medium'
              : 'text-[#6F6D67] hover:text-[#A09E97]'
          }`}
        >
          Overview
          {activeTab === 'overview' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F06A3A]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-2 text-center text-xs font-mono transition-colors relative cursor-pointer ${
            activeTab === 'tasks'
              ? 'text-[#F06A3A] font-medium'
              : 'text-[#6F6D67] hover:text-[#A09E97]'
          }`}
        >
          Tasks
          {activeTab === 'tasks' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F06A3A]" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'tasks' ? (
        <div className="flex flex-col flex-1">
          {/* Active Tasks Group */}
          <div className="mb-4">
            <SectionLabel rightElement={String(activeTasks.length)}>
              ACTIVE
            </SectionLabel>
            <div className="mt-1 divide-y divide-[#1D1D1A]">
              {activeTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onSelect={() => startFocus(task.id)}
                  variant="simple"
                  showChevron
                />
              ))}

              {activeTasks.length === 0 && (
                <div className="py-4 text-center font-mono text-xs text-[#6F6D67]">
                  No active tasks
                </div>
              )}
            </div>
          </div>

          {/* Completed Tasks Group */}
          {completedTasks.length > 0 && (
            <div className="mb-4">
              <SectionLabel rightElement={String(completedTasks.length)}>
                COMPLETED
              </SectionLabel>
              <div className="mt-1 divide-y divide-[#1D1D1A]">
                {completedTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    variant="simple"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Add Task Button */}
          <div className="mt-2 mb-6">
            <OutlineButton
              fullWidth
              onClick={() => navigateTo('add_task')}
              icon={<Plus size={14} />}
            >
              Add task
            </OutlineButton>
          </div>

          {/* Spacer & Bottom Cat Illustration in corner */}
          <div className="flex-1 flex justify-end items-end pr-2 pt-2">
            <CatIllustration
              pose="idle"
              size={56}
              interactive
              onTap={openRecommendation}
            />
          </div>
        </div>
      ) : (
        /* Overview Tab */
        <div className="flex flex-col gap-4 text-xs">
          <div className="bg-[#141413] border border-[#292925] rounded-xl p-4">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-[#A09E97] mb-2">
              Architecture & Stack
            </h3>
            <p className="text-[#A09E97] leading-relaxed mb-3">
              Lightweight CLI tool scaffolded in Python for generating unified developer project structures, environment orchestration, and configuration scaffolds.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded bg-[#1D1D1A] border border-[#292925] font-mono text-[10px] text-[#F1EFE8] flex items-center gap-1">
                <GitBranch size={10} className="text-[#F06A3A]" /> main branch
              </span>
              <span className="px-2 py-1 rounded bg-[#1D1D1A] border border-[#292925] font-mono text-[10px] text-[#F1EFE8] flex items-center gap-1">
                <Layers size={10} className="text-[#A09E97]" /> Python 3.12
              </span>
            </div>
          </div>

          <div className="bg-[#141413] border border-[#292925] rounded-xl p-4">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-[#A09E97] mb-2">
              Progress & Completion
            </h3>
            <div className="flex items-center justify-between font-mono text-xs text-[#A09E97] mb-2">
              <span>{completedTasks.length} / {projectTasks.length} tasks completed</span>
              <span className="text-[#F06A3A] font-semibold">{project?.progressPercent || 80}%</span>
            </div>
            <div className="w-full bg-[#1D1D1A] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#F06A3A] h-full rounded-full"
                style={{ width: `${project?.progressPercent || 80}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
