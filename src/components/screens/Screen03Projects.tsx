import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectCard } from '../ui/ProjectCard';
import { Project } from '../../types';
import { Search, Plus, X } from 'lucide-react';
import { Screen09EmptyStates } from './Screen09EmptyStates';

export const Screen03Projects: React.FC = () => {
  const { projects, navigateTo, createProject } = useApp();
  const [showSearch, setShowSearch] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(filterText.toLowerCase()) ||
    p.description.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleSelectProject = (project: Project) => {
    navigateTo('project_detail', { projectId: project.id });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    createProject(newProjectName.trim(), newProjectDesc.trim() || 'New Development Project', ['TypeScript']);
    setNewProjectName('');
    setNewProjectDesc('');
    setShowCreateModal(false);
  };

  if (projects.length === 0) {
    return <Screen09EmptyStates stateType="projects" onAction={() => setShowCreateModal(true)} />;
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 pt-3 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <h1 className="text-xl font-semibold text-[#F1EFE8] tracking-tight">
          Projects
        </h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-[#A09E97] hover:text-[#F1EFE8] rounded-lg transition-colors cursor-pointer"
            aria-label="Search projects"
          >
            <Search size={17} />
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#181817] hover:bg-[#20201E] border border-[#292925] text-xs font-medium text-[#F1EFE8] transition-colors cursor-pointer"
          >
            <Plus size={13} className="text-[#F06A3A]" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Optional Search Bar */}
      {showSearch && (
        <div className="relative my-2">
          <input
            type="text"
            placeholder="Search projects..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full px-3 py-2 bg-[#141413] border border-[#292925] rounded-lg text-xs text-[#F1EFE8] placeholder-[#6F6D67] focus:outline-none focus:border-[#F06A3A] transition-colors"
            autoFocus
          />
          {filterText && (
            <button
              type="button"
              onClick={() => setFilterText('')}
              className="absolute right-2.5 top-2.5 text-[#6F6D67] hover:text-[#A09E97]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Projects List */}
      <div className="flex flex-col gap-3.5 mt-3">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={handleSelectProject}
          />
        ))}

        {filteredProjects.length === 0 && (
          <div className="text-center py-8 text-xs font-mono text-[#6F6D67]">
            No projects matching "{filterText}"
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#141413] border border-[#292925] rounded-xl p-5 w-full max-w-xs shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#F1EFE8]">Create New Project</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#6F6D67] hover:text-[#F1EFE8]"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-mono text-[#A09E97] mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#181817] border border-[#292925] rounded-lg text-xs text-[#F1EFE8] focus:outline-none focus:border-[#F06A3A]"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[#A09E97] mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Developer tool / CLI"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#181817] border border-[#292925] rounded-lg text-xs text-[#F1EFE8] focus:outline-none focus:border-[#F06A3A]"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-lg bg-[#181817] text-xs text-[#A09E97] border border-[#292925]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-[#F06A3A] text-xs font-semibold text-[#0D0D0C]"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
