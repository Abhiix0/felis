import React, { useState } from 'react';
import { useDesktopApp } from '../context/DesktopAppContext';
import { CheckCircle2, Circle } from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { tasks, completeTask, setIsCommandKOpen } = useDesktopApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  const filtered = tasks.filter((t) => {
    if (filter === 'pending') return t.status !== 'completed';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#F1EFE8', margin: 0 }}>Tasks</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['pending', 'all', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                backgroundColor: filter === f ? '#181817' : 'transparent',
                border: filter === f ? '1px solid #292925' : '1px solid transparent',
                color: filter === f ? '#F1EFE8' : '#6F6D67',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: 12,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {f}
            </button>
          ))}
          <button
            onClick={() => setIsCommandKOpen(true)}
            style={{
              backgroundColor: '#F06A3A',
              color: '#0D0D0C',
              border: 'none',
              borderRadius: 6,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Add Task (⌘K)
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((t) => (
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
                  background: 'none',
                  border: 'none',
                  color: t.status === 'completed' ? '#B7D96B' : '#6F6D67',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
              >
                {t.status === 'completed' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              </button>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  fontSize: 11,
                  color: t.priority === 'high' ? '#F06A3A' : t.priority === 'medium' ? '#F59E0B' : '#6F6D67',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                }}
              >
                {t.priority}
              </span>
              {t.estimate_minutes && (
                <span style={{ fontSize: 11, color: '#6F6D67', fontFamily: 'monospace' }}>
                  {t.estimate_minutes}m
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
