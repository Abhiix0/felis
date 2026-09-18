import React, { useState, useEffect } from 'react';
import { useDesktopApp } from '../context/DesktopAppContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, Play, Pause } from 'lucide-react';

export const FocusPage: React.FC = () => {
  const { tasks, completeFocus, completeTask } = useDesktopApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const taskId = searchParams.get('taskId');

  const task = tasks.find((t) => t.id === taskId);
  const [secondsRemaining, setSecondsRemaining] = useState((task?.estimate_minutes || 25) * 60);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((s) => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = async () => {
    if (task) {
      await completeTask(task.id);
    }
    completeFocus();
    navigate('/');
  };

  if (!task) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <h2>No active focus task</h2>
        <button onClick={() => navigate('/')} style={{ marginTop: 16 }}>Go to Home</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center' }}>
      <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#F06A3A', letterSpacing: '0.1em', marginBottom: 12 }}>
        FOCUS SESSION IN PROGRESS
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 600, color: '#F1EFE8', marginBottom: 32 }}>
        {task.title}
      </h1>

      {/* Big Countdown Timer */}
      <div
        style={{
          fontSize: 72,
          fontFamily: 'monospace',
          fontWeight: 'bold',
          color: '#F1EFE8',
          marginBottom: 40,
        }}
      >
        {formatTime(secondsRemaining)}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
        <button
          onClick={() => setIsRunning((r) => !r)}
          style={{
            backgroundColor: '#181817',
            border: '1px solid #292925',
            color: '#F1EFE8',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          <span>{isRunning ? 'Pause' : 'Resume'}</span>
        </button>

        <button
          onClick={handleFinish}
          style={{
            backgroundColor: '#B7D96B',
            color: '#0D0D0C',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Check size={16} />
          <span>Complete Task</span>
        </button>

        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #383832',
            color: '#A09E97',
            borderRadius: 8,
            padding: '12px 16px',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Abandon
        </button>
      </div>
    </div>
  );
};
