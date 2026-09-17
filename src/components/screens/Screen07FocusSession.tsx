import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Pause, Play, CheckCircle2, ArrowRight, Check } from 'lucide-react';
import { FocusTimer } from '../ui/FocusTimer';
import { PrimaryButton, SecondaryButton } from '../ui/Buttons';
import { CatIllustration } from '../cat/CatIllustration';

export const Screen07FocusSession: React.FC = () => {
  const {
    focusSession,
    pauseFocus,
    resumeFocus,
    finishFocus,
    resetFocus,
    startFocus,
    navigateTo,
    toggleSubtask,
    openRecommendation,
  } = useApp();

  if (!focusSession) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="font-mono text-xs text-[#6F6D67] mb-3">No active focus session.</p>
        <SecondaryButton onClick={() => navigateTo('home')}>Back to Home</SecondaryButton>
      </div>
    );
  }

  // If focus session finished, show Completion State!
  if (focusSession.isFinished) {
    return (
      <div className="flex flex-col h-full overflow-y-auto px-5 pt-5 pb-8 justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between py-1">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1.5 font-mono text-xs text-[#A09E97] hover:text-[#F1EFE8] transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Home</span>
          </button>
        </div>

        {/* Completion Card */}
        <div className="flex flex-col items-center text-center my-auto py-6">
          <div className="w-12 h-12 rounded-full bg-[#B7D96B]/15 border border-[#B7D96B]/30 flex items-center justify-center text-[#B7D96B] mb-4">
            <Check size={24} strokeWidth={3} />
          </div>

          <h2 className="text-2xl font-semibold text-[#F1EFE8] tracking-tight">
            Nice. Done.
          </h2>
          <p className="text-sm font-medium text-[#A09E97] mt-1">
            {focusSession.taskTitle}
          </p>

          {/* Time statistics */}
          <div className="w-full max-w-xs bg-[#141413] border border-[#292925] rounded-xl p-4 mt-6 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[#A09E97]">
              <span>Estimated</span>
              <span className="text-[#F1EFE8]">{focusSession.estimatedMinutes} min</span>
            </div>
            <div className="flex items-center justify-between text-[#A09E97]">
              <span>Actual</span>
              <span className="text-[#B7D96B] font-medium">{focusSession.actualMinutes} min</span>
            </div>
          </div>

          {/* Celebratory Cat */}
          <div className="mt-6 flex flex-col items-center">
            <CatIllustration
              pose="completed"
              size={82}
              interactive
              showCaption
              captionText="Great! <3"
              onTap={openRecommendation}
            />
          </div>

          {/* What's next suggestion */}
          <div className="w-full max-w-xs bg-[#181817] border border-[#292925] rounded-xl p-3.5 mt-6 text-left">
            <span className="font-mono text-[10px] text-[#6F6D67] uppercase tracking-wider block mb-1">
              What's next?
            </span>
            <div className="flex items-center justify-between text-xs font-medium text-[#F1EFE8]">
              <span>→ Write README</span>
              <span className="font-mono text-[#A09E97]">~25 min</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-4">
          <PrimaryButton
            fullWidth
            onClick={() => startFocus('task-readme')}
            icon={<ArrowRight size={14} />}
          >
            Start next
          </PrimaryButton>
          <SecondaryButton fullWidth onClick={() => navigateTo('home')}>
            Back to Home
          </SecondaryButton>
        </div>
      </div>
    );
  }

  // Active Focus Session
  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 pt-3 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="flex items-center gap-1.5 font-mono text-xs text-[#A09E97] hover:text-[#F1EFE8] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>{focusSession.projectName || 'Spawn'}</span>
        </button>
      </div>

      {/* Main Task Title */}
      <div className="mt-2 text-center">
        <h1 className="font-mono text-xs font-semibold tracking-wider text-[#A09E97] uppercase">
          {focusSession.taskTitle}
        </h1>
      </div>

      {/* Dominant Circular Progress Timer */}
      <div className="flex justify-center my-3">
        <FocusTimer
          remainingSeconds={focusSession.remainingSeconds}
          totalSeconds={focusSession.totalSeconds}
          isRunning={focusSession.isRunning}
          size={220}
        />
      </div>

      {/* Task & Project Metadata Badges */}
      <div className="flex items-center justify-center gap-2 mb-6 font-mono text-xs">
        <span className="px-2.5 py-1 rounded-md bg-[#141413] border border-[#292925] text-[#F1EFE8]">
          {focusSession.taskTitle}
        </span>
        <span className="px-2.5 py-1 rounded-md bg-[#141413] border border-[#292925] text-[#A09E97]">
          {focusSession.projectName}
        </span>
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-3 mb-6">
        <SecondaryButton
          fullWidth
          onClick={focusSession.isRunning ? pauseFocus : resumeFocus}
          icon={focusSession.isRunning ? <Pause size={14} /> : <Play size={14} />}
        >
          {focusSession.isRunning ? 'Pause' : 'Resume'}
        </SecondaryButton>

        <PrimaryButton
          fullWidth
          onClick={finishFocus}
          icon={<CheckCircle2 size={15} />}
        >
          Finish
        </PrimaryButton>
      </div>

      {/* "What's left" subtasks */}
      <div className="bg-[#141413] border border-[#292925] rounded-xl p-4 mb-4">
        <span className="font-mono text-[11px] font-semibold text-[#A09E97] uppercase tracking-wider block mb-2.5">
          What's left
        </span>

        <div className="space-y-2">
          {focusSession.subtasks.map((sub) => (
            <div
              key={sub.id}
              onClick={() => toggleSubtask(sub.id)}
              className="flex items-center gap-2.5 text-xs text-[#F1EFE8] cursor-pointer hover:text-white transition-colors"
            >
              <div
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-colors ${
                  sub.completed
                    ? 'bg-[#B7D96B] border-[#B7D96B] text-[#0D0D0C]'
                    : 'border-[#383832]'
                }`}
              >
                {sub.completed && <Check size={10} strokeWidth={3} />}
              </div>
              <span className={sub.completed ? 'line-through text-[#6F6D67]' : ''}>
                {sub.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Spacer & Bottom Cat with "focus mode on" */}
      <div className="flex-1 flex justify-end items-end pr-2 pt-2">
        <div className="flex items-center gap-2">
          <span className="font-hand text-sm text-[#F06A3A] tracking-wide whitespace-nowrap">
            focus mode on
          </span>
          <CatIllustration
            pose="focus"
            size={56}
            interactive
            onTap={openRecommendation}
          />
        </div>
      </div>
    </div>
  );
};
