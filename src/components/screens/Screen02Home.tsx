import React from 'react';
import { useApp } from '../../context/AppContext';
import { SignalRail } from '../ui/SignalRail';
import { SectionLabel } from '../ui/SectionLabel';
import { PrimaryButton, OutlineButton } from '../ui/Buttons';
import { TaskRow } from '../ui/TaskRow';
import { CatIllustration } from '../cat/CatIllustration';
import { CatChatTrigger } from '../ui/CatChatTrigger';
import { Clock, Calendar, ArrowRight, Plus, Menu } from 'lucide-react';

export const Screen02Home: React.FC = () => {
  const {
    tasks,
    recommendation,
    toggleTask,
    navigateTo,
    openRecommendation,
    openShellDrawer,
    startFocus,
  } = useApp();

  // Tasks for Today: filter tasks scheduled or due today
  const todayTasks = tasks.slice(0, 4);
  const completedCount = todayTasks.filter((t) => t.completed).length;

  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 pt-3 pb-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between py-1">
        <span className="font-mono text-[10px] text-[#A09E97] tracking-wider uppercase">
          THURSDAY, 17 SEPTEMBER
        </span>
        <button
          type="button"
          onClick={openShellDrawer}
          className="p-1.5 text-[#6F6D67] hover:text-[#F1EFE8] rounded-lg transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={16} />
        </button>
      </div>

      {/* Greeting + Cat */}
      <div className="flex items-start justify-between mt-2 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#F1EFE8] tracking-tight leading-none">
            Good morning,
          </h1>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#F06A3A] tracking-tight mt-0.5">
            Abhi
          </h1>
          <p className="text-xs text-[#A09E97] mt-2 font-normal">
            You have {todayTasks.length} things to work on today.
          </p>
        </div>

        {/* Orange line-art cat with handwritten speech bubble */}
        <div className="relative shrink-0 -mt-1 mr-1">
          <div className="absolute -top-3 -right-2 transform translate-x-1 font-hand text-xs text-[#F06A3A] whitespace-nowrap">
            let's do this &lt;3
          </div>
          <CatIllustration
            pose="recommendation"
            size={68}
            interactive
            onTap={openRecommendation}
          />
        </div>
      </div>

      {/* Recommendation Card ("DO THIS NOW") */}
      <div className="relative bg-[#181817] border border-[#292925] rounded-xl overflow-hidden shadow-md mb-6">
        <div className="flex">
          {/* Iconic Vertical Orange Signal Rail */}
          <SignalRail height="h-auto" />

          {/* Card Body */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] font-semibold text-[#F06A3A] tracking-wider uppercase">
                DO THIS NOW
              </span>

              <h2 className="text-base font-semibold text-[#F1EFE8] mt-1 leading-snug">
                {recommendation.title}
              </h2>

              <span className="font-mono text-xs text-[#A09E97] mt-0.5 block">
                {recommendation.projectName}
              </span>

              {/* Metadata tags */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 font-mono text-[11px] text-[#6F6D67]">
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-[#A09E97]" />
                  <span>~{recommendation.estimatedMinutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} className="text-[#A09E97]" />
                  <span>Due tomorrow</span>
                  <span>·</span>
                  <span className="text-[#F06A3A]">High priority</span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-4 flex justify-end">
              <PrimaryButton
                onClick={() => startFocus(recommendation.taskId)}
                icon={<ArrowRight size={14} />}
                className="px-5 py-2 text-xs"
              >
                Start
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY section */}
      <div className="flex flex-col mb-4">
        <SectionLabel
          rightElement={`${completedCount} / ${todayTasks.length}`}
        >
          TODAY
        </SectionLabel>

        <div className="mt-1 divide-y divide-[#1D1D1A]">
          {todayTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onSelect={() => startFocus(task.id)}
              variant="compact"
            />
          ))}
        </div>

        {/* Add task button */}
        <div className="mt-3">
          <OutlineButton
            fullWidth
            onClick={() => navigateTo('add_task')}
            icon={<Plus size={14} />}
          >
            Add task
          </OutlineButton>
        </div>
      </div>

      {/* Spacing push */}
      <div className="flex-1 min-h-[16px]" />

      {/* Bottom "What should I work on?" entry with doodle cat */}
      <div className="mt-auto pt-2">
        <CatChatTrigger
          onClick={openRecommendation}
          withCat
        />
      </div>
    </div>
  );
};
