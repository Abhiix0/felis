import React, { useState } from 'react';
import { useDesktopApp } from '../context/DesktopAppContext';
import { useSearchParams } from 'react-router-dom';
import { Plus, Folder, CheckSquare } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { projects, tasks, createProject, completeTask, setIsCommandKOpen } = useDesktopApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('id') || projects[0]?.id;

  const [newProjectName, setNewProjectName] = useState('');
  const [showAddProject, setShowAddProject] = useState(false);

  const selectedProject = projects.find((p) => p.id === selectedId);
  const projectTasks = tasks.filter((t) => t.project_id === selectedId);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    await createProject(newProjectName.trim());
    setNewProjectName('');
    setShowAddProject(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32, maxWidth: 1000, margin: '0 auto' }}>
      {/* Left List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#F1EFE8', margin: 0 }}>Projects</h2>
          <button
            onClick={() => setShowAddProject((prev) => !prev)}
            style={{
              backgroundColor: '#181817',
              border: '1px solid #292925',
              color: '#F1EFE8',
              borderRadius: 6,
              padding: '4px 8px',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
            }}
          >
            <Plus size={13} />
            <span>New</span>
          </button>
        </div>

        {showAddProject && (
          <form onSubmit={handleCreateProject} style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Project name..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#141413',
                border: '1px solid #F06A3A',
                borderRadius: 6,
                padding: '8px 10px',
                color: '#F1EFE8',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {projects.map((p) => {
            const isSelected = p.id === selectedId;
            return (
              <div
                key={p.id}
                onClick={() => setSearchParams({ id: p.id })}
                style={{
                  backgroundColor: isSelected ? '#181817' : '#141413',
                  border: isSelected ? '1px solid #F06A3A' : '1px solid #1D1D1A',
                  borderRadius: 8,
                  padding: '12px 14px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 500, color: '#F1EFE8', marginBottom: 4 }}>{p.name}</div>
                {p.stats && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#A09E97' }}>
                    <span>{p.stats.progressPercent}% complete</span>
                    <span>•</span>
                    <span>{p.stats.activeTasks} active</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Detail */}
      <div>
        {selectedProject ? (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 600, color: '#F1EFE8', margin: '0 0 6px 0' }}>
                {selectedProject.name}
              </h1>
              {selectedProject.description && (
                <p style={{ fontSize: 13, color: '#A09E97', margin: 0 }}>{selectedProject.description}</p>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#F1EFE8' }}>
                Tasks ({projectTasks.length})
              </span>
              <button
                onClick={() => setIsCommandKOpen(true)}
                style={{
                  backgroundColor: '#F06A3A',
                  color: '#0D0D0C',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Add Task (⌘K)
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {projectTasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    backgroundColor: '#141413',
                    border: '1px solid #1D1D1A',
                    borderRadius: 8,
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                      onClick={() => completeTask(t.id)}
                      style={{
                        background: t.status === 'completed' ? '#B7D96B' : 'none',
                        border: '1px solid #383832',
                        borderRadius: 4,
                        width: 18,
                        height: 18,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 14,
                        color: t.status === 'completed' ? '#6F6D67' : '#F1EFE8',
                        textDecoration: t.status === 'completed' ? 'line-through' : 'none',
                      }}
                    >
                      {t.title}
                    </span>
                  </div>
                  {t.estimate_minutes && (
                    <span style={{ fontSize: 12, color: '#6F6D67', fontFamily: 'monospace' }}>
                      {t.estimate_minutes}m
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ color: '#6F6D67', textAlign: 'center', marginTop: 80 }}>No project selected</div>
        )}
      </div>
    </div>
  );
};
