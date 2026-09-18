import React, { useState } from 'react';
import { useDesktopApp } from '../context/DesktopAppContext';
import { X, CornerDownLeft } from 'lucide-react';

export const CommandKModal: React.FC = () => {
  const { isCommandKOpen, setIsCommandKOpen, createTask, projects } = useDesktopApp();
  const [input, setInput] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  if (!isCommandKOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await createTask(input.trim(), selectedProjectId || undefined, priority);
    setInput('');
    setIsCommandKOpen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(4px)',
      }}
      onClick={() => setIsCommandKOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 540,
          backgroundColor: '#141413',
          border: '1px solid #292925',
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: '#A09E97', fontFamily: 'monospace' }}>
            QUICK ADD TASK <span style={{ color: '#F06A3A' }}>(Ctrl+K)</span>
          </div>
          <button
            onClick={() => setIsCommandKOpen(false)}
            style={{ background: 'none', border: 'none', color: '#6F6D67', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            autoFocus
            placeholder="e.g. Implement login endpoint !high 45m"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#0D0D0C',
              border: '1px solid #292925',
              borderRadius: 8,
              padding: '12px 14px',
              color: '#F1EFE8',
              fontSize: 14,
              fontFamily: 'monospace',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: 12,
            }}
          />

          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: '#181817',
                border: '1px solid #292925',
                borderRadius: 6,
                padding: '8px 10px',
                color: '#F1EFE8',
                fontSize: 12,
                outline: 'none',
              }}
            >
              <option value="">No Project (Standalone)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              style={{
                backgroundColor: '#181817',
                border: '1px solid #292925',
                borderRadius: 6,
                padding: '8px 10px',
                color: priority === 'high' ? '#F06A3A' : priority === 'medium' ? '#F59E0B' : '#A09E97',
                fontSize: 12,
                outline: 'none',
              }}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#6F6D67' }}>Press Enter to save</span>
            <button
              type="submit"
              style={{
                backgroundColor: '#F06A3A',
                color: '#0D0D0C',
                border: 'none',
                borderRadius: 6,
                padding: '8px 14px',
                fontWeight: 600,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
              }}
            >
              <span>Add Task</span>
              <CornerDownLeft size={13} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
