import React from 'react';
import { Task } from '../../types';
import { Check, ChevronRight } from 'lucide-react';

interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  onSelect?: (task: Task) => void;
  variant?: 'compact' | 'detailed' | 'simple';
  showChevron?: boolean;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onToggle,
  onSelect,
  variant = 'compact',
  showChevron = false,
}) => {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(task.id);
  };

  const isCompleted = task.completed;

  if (variant === 'simple') {
    return (
      <div
        onClick={() => onSelect?.(task)}
        className="flex items-center justify-between py-2.5 px-1 border-b border-[#1D1D1A] last:border-b-0 group hover:bg-[#141413]/50 transition-colors duration-150 cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={handleCheckboxClick}
            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all duration-150 cursor-pointer ${
              isCompleted
                ? 'bg-[#B7D96B] border-[#B7D96B] text-[#0D0D0C]'
                : 'border-[#383832] hover:border-[#F06A3A] bg-transparent'
            }`}
            aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            {isCompleted && <Check size={11} strokeWidth={3} />}
          </button>
          <span
            className={`text-sm truncate transition-colors duration-150 ${
              isCompleted ? 'line-through text-[#6F6D67]' : 'text-[#F1EFE8]'
            }`}
          >
            {task.title}
          </span>
        </div>
        {showChevron && (
          <ChevronRight size={14} className="text-[#6F6D67] shrink-0" />
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div
        onClick={() => onSelect?.(task)}
        className="flex items-center justify-between py-3 px-2 border-b border-[#1D1D1A] hover:bg-[#141413]/40 transition-colors duration-150 cursor-pointer"
      >
        <div className="flex items-start gap-3.5 min-w-0">
          <button
            type="button"
            onClick={handleCheckboxClick}
            className={`w-4 h-4 mt-0.5 rounded-full flex items-center justify-center shrink-0 border transition-all duration-150 cursor-pointer ${
              isCompleted
                ? 'bg-[#B7D96B] border-[#B7D96B] text-[#0D0D0C]'
                : 'border-[#383832] hover:border-[#F06A3A] bg-transparent'
            }`}
            aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            {isCompleted && <Check size={11} strokeWidth={3} />}
          </button>
          <div className="flex flex-col min-w-0">
            <span
              className={`text-sm font-medium leading-tight truncate transition-colors duration-150 ${
                isCompleted ? 'line-through text-[#6F6D67]' : 'text-[#F1EFE8]'
              }`}
            >
              {task.title}
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-xs text-[#6F6D67]">
              <span>{task.projectName}</span>
              <span>·</span>
              <span
                className={
                  task.priority === 'high'
                    ? 'text-[#F06A3A]'
                    : task.priority === 'medium'
                    ? 'text-[#A09E97]'
                    : 'text-[#6F6D67]'
                }
              >
                {isCompleted ? 'Completed' : task.priority === 'high' ? 'High' : 'Medium'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="font-mono text-xs text-[#A09E97]">
            {task.dueDate}
          </span>
          {showChevron && (
            <ChevronRight size={14} className="text-[#6F6D67]" />
          )}
        </div>
      </div>
    );
  }

  // Compact variant (Home screen)
  return (
    <div
      onClick={() => onSelect?.(task)}
      className="flex items-center justify-between py-2 px-1 border-b border-[#1A1A17] last:border-b-0 hover:bg-[#141413]/50 transition-colors duration-150 cursor-pointer"
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={handleCheckboxClick}
          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all duration-150 cursor-pointer ${
            isCompleted
              ? 'bg-[#B7D96B] border-[#B7D96B] text-[#0D0D0C]'
              : 'border-[#383832] hover:border-[#F06A3A] bg-transparent'
          }`}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {isCompleted && <Check size={11} strokeWidth={3} />}
        </button>
        <span
          className={`text-sm truncate transition-colors duration-150 ${
            isCompleted ? 'line-through text-[#6F6D67]' : 'text-[#F1EFE8]'
          }`}
        >
          {task.title}
        </span>
      </div>

      <div className="shrink-0 font-mono text-xs text-[#6F6D67]">
        {task.scheduledTime || task.completedAt || '12:00'}
      </div>
    </div>
  );
};
