import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskRow } from '../ui/TaskRow';
import { CatIllustration } from '../cat/CatIllustration';
import { Search, Plus, X } from 'lucide-react';
import { Screen09EmptyStates } from './Screen09EmptyStates';

export const Screen05Tasks: React.FC = () => {
  const { tasks, toggleTask, navigateTo, startFocus, openRecommendation } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.projectName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (tasks.length === 0) {
    return <Screen09EmptyStates stateType="tasks" onAction={() => navigateTo('add_task')} />;
  }

  return (
    <div className="relative flex flex-col h-full overflow-y-auto px-5 pt-3 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <h1 className="text-xl font-semibold text-[#F1EFE8] tracking-tight">
          Tasks
        </h1>

        <button
          type="button"
          onClick={() => setSearchOpen(!searchOpen)}
          className="p-2 text-[#A09E97] hover:text-[#F1EFE8] rounded-lg transition-colors cursor-pointer"
          aria-label="Search tasks"
        >
          <Search size={17} />
        </button>
      </div>

      {/* Search Input Bar */}
      {searchOpen && (
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search tasks or projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-[#141413] border border-[#292925] rounded-lg text-xs text-[#F1EFE8] placeholder-[#6F6D67] focus:outline-none focus:border-[#F06A3A] transition-colors"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-[#6F6D67] hover:text-[#A09E97]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Segmented Filter Pills */}
      <div className="flex items-center gap-2 my-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-[#1D1D1A] border-[#383832] text-[#F1EFE8] font-medium'
              : 'border-transparent text-[#6F6D67] hover:text-[#A09E97]'
          }`}
        >
          All {tasks.length}
        </button>

        <button
          type="button"
          onClick={() => setFilter('active')}
          className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            filter === 'active'
              ? 'bg-[#1D1D1A] border-[#383832] text-[#F1EFE8] font-medium'
              : 'border-transparent text-[#6F6D67] hover:text-[#A09E97]'
          }`}
        >
          Active {activeCount}
        </button>

        <button
          type="button"
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            filter === 'completed'
              ? 'bg-[#1D1D1A] border-[#383832] text-[#F1EFE8] font-medium'
              : 'border-transparent text-[#6F6D67] hover:text-[#A09E97]'
          }`}
        >
          Completed {completedCount}
        </button>
      </div>

      {/* Task List */}
      <div className="mt-2 divide-y divide-[#1D1D1A]">
        {filteredTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onSelect={() => startFocus(task.id)}
            variant="detailed"
          />
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-10 text-xs font-mono text-[#6F6D67]">
            {filter === 'active'
              ? 'No active tasks left'
              : filter === 'completed'
              ? 'No completed tasks yet'
              : 'No tasks found'}
          </div>
        )}
      </div>

      {/* Floating Orange + FAB & Purring Cat in Bottom Right Corner */}
      <div className="fixed bottom-20 right-6 flex items-end gap-2.5 z-30 pointer-events-auto">
        <CatIllustration
          pose="purr"
          size={52}
          interactive
          onTap={openRecommendation}
          className="mb-1"
        />

        <button
          type="button"
          onClick={() => navigateTo('add_task')}
          className="w-12 h-12 rounded-full bg-[#F06A3A] hover:bg-[#D9572D] active:scale-95 text-[#0D0D0C] flex items-center justify-center shadow-lg transition-transform cursor-pointer"
          aria-label="Add new task"
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
