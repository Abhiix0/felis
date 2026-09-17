import React from 'react';
import { Project } from '../../types';
import { Terminal, Database, Cloud, FileCode, MoreVertical } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const renderIcon = () => {
    switch (project.iconType) {
      case 'terminal':
        return <Terminal size={18} className="text-[#F06A3A]" />;
      case 'database':
        return <Database size={18} className="text-[#F1EFE8]" />;
      case 'cloud':
        return <Cloud size={18} className="text-[#F1EFE8]" />;
      default:
        return <FileCode size={18} className="text-[#F1EFE8]" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(project)}
      className="w-full bg-[#141413] hover:bg-[#181817] border border-[#292925] hover:border-[#383832] rounded-xl p-4 transition-all duration-150 cursor-pointer group shadow-sm"
    >
      {/* Top row: Icon + Name + Menu */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#1D1D1A] border border-[#292925] flex items-center justify-center shrink-0">
            {renderIcon()}
          </div>
          <div>
            <h3 className="text-base font-medium text-[#F1EFE8] group-hover:text-white transition-colors">
              {project.name}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="text-[#6F6D67] hover:text-[#A09E97] p-1 rounded-md transition-colors"
          aria-label="Project actions"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-[#A09E97] mt-3 font-normal">
        {project.description}
      </p>

      {/* Task statistics */}
      <div className="flex items-center gap-2 mt-3 font-mono text-xs text-[#6F6D67]">
        <span>{project.totalTasks} tasks</span>
        <span>|</span>
        <span className="text-[#A09E97]">{project.activeTasks} active</span>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mt-3 pt-1">
        <div className="flex-1">
          <ProgressBar percent={project.progressPercent} height="h-1.5" />
        </div>
        <span className="font-mono text-xs text-[#A09E97] shrink-0 font-medium">
          {project.progressPercent}%
        </span>
      </div>
    </div>
  );
};
