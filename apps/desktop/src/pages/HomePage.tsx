import React from 'react';
import { useDesktopApp } from '../context/DesktopAppContext';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { recommendation, tasks, completeTask, startFocus } = useDesktopApp();
  const navigate = useNavigate();

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  const incompleteTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#A09E97', textTransform: 'uppercase', marginBottom: 4 }}>
          {dateStr}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#F1EFE8', margin: 0 }}>
          Good day, Developer
        </h1>
      </div>

      {/* "DO THIS NOW" Recommendation Card */}
      {recommendation ? (
        <div
          style={{
            backgroundColor: '#141413',
            border: '1px solid #F06A3A',
            borderRadius: 12,
            padding: 24,
            marginBottom: 36,
            boxShadow: '0 8px 24px rgba(240, 106, 58, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Sparkles size={15} color="#F06A3A" />
            <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 600, color: '#F06A3A', letterSpacing: '0.05em' }}>
              RECOMMENDED NEXT ACTION • SCORE: {recommendation.score}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#F1EFE8', margin: '0 0 8px 0' }}>
                {recommendation.title}
              </h2>
              {recommendation.project_name && (
                <div style={{ fontSize: 12, color: '#A09E97', marginBottom: 12 }}>
                  Project: <span style={{ color: '#F1EFE8' }}>{recommendation.project_name}</span>
                </div>
              )}

              {/* Signals */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {recommendation.signals.map((s, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: 11,
                      backgroundColor: '#1D1D1A',
                      border: '1px solid #292925',
                      padding: '4px 8px',
                      borderRadius: 4,
                      color: '#A09E97',
                    }}
                  >
                    +{s.value} {s.reason}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                startFocus(recommendation.task_id);
                navigate(`/focus?taskId=${recommendation.task_id}`);
              }}
              style={{
                backgroundColor: '#F06A3A',
                color: '#0D0D0C',
                border: 'none',
                borderRadius: 8,
                padding: '12px 20px',
                fontWeight: 600,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Play size={14} fill="#0D0D0C" />
              <span>Start Focus ({recommendation.estimated_minutes}m)</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: '#141413',
            border: '1px dashed #292925',
            borderRadius: 12,
            padding: 32,
            textAlign: 'center',
            marginBottom: 36,
          }}
        >
          <div style={{ color: '#F1EFE8', fontSize: 16, fontWeight: 500, marginBottom: 4 }}>No pending tasks</div>
          <div style={{ color: '#6F6D67', fontSize: 13 }}>You're all caught up. Press ⌘K to capture new work.</div>
        </div>
      )}

      {/* Task Sections: Today & Backlog */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Active Tasks */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#F1EFE8' }}>
              Active Queue ({incompleteTasks.length})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {incompleteTasks.slice(0, 6).map((t) => (
              <div
                key={t.id}
                style={{
                  backgroundColor: '#141413',
                  border: '1px solid #1D1D1A',
                  borderRadius: 8,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, overflow: 'hidden' }}>
                  <button
                    onClick={() => completeTask(t.id)}
                    style={{
                      background: 'none',
                      border: '1px solid #383832',
                      borderRadius: 4,
                      width: 16,
                      height: 16,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  />
                  <span style={{ fontSize: 13, color: '#F1EFE8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.title}
                  </span>
                </div>
                {t.estimate_minutes && (
                  <span style={{ fontSize: 11, color: '#6F6D67', fontFamily: 'monospace' }}>
                    {t.estimate_minutes}m
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recently Completed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#A09E97' }}>
              Recently Completed ({completedTasks.length})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {completedTasks.slice(0, 6).map((t) => (
              <div
                key={t.id}
                style={{
                  backgroundColor: '#111110',
                  border: '1px solid #181817',
                  borderRadius: 8,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  opacity: 0.6,
                }}
              >
                <CheckCircle2 size={16} color="#B7D96B" />
                <span style={{ fontSize: 13, color: '#A09E97', textDecoration: 'line-through' }}>
                  {t.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
