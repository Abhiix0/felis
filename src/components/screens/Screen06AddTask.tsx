import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Sparkles, Folder, Calendar, Clock, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { PrimaryButton } from '../ui/Buttons';
import { CatIllustration } from '../cat/CatIllustration';

export const Screen06AddTask: React.FC = () => {
  const { navigateTo, createTask, projects, openRecommendation } = useApp();

  const [inputTitle, setInputTitle] = useState('Finish Spawn README by Friday');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced fields (or parsed defaults)
  const [selectedProject, setSelectedProject] = useState('Spawn');
  const [selectedDueDate, setSelectedDueDate] = useState('Due Friday');
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('high');

  // Simple deterministic parser based on user input
  const parseInput = (text: string) => {
    let proj = 'Spawn';
    let due = 'Due Friday';
    let dur = 30;
    let pri: 'low' | 'medium' | 'high' = 'high';

    const lower = text.toLowerCase();
    if (lower.includes('ucdp')) proj = 'UCDP';
    else if (lower.includes('preflight')) proj = 'Preflight';

    if (lower.includes('today')) due = 'Today';
    else if (lower.includes('tomorrow')) due = 'Due tomorrow';
    else if (lower.includes('friday')) due = 'Due Friday';
    else if (lower.includes('monday')) due = 'Due Monday';

    if (lower.includes('15 min') || lower.includes('15m')) dur = 15;
    else if (lower.includes('45 min') || lower.includes('45m')) dur = 45;
    else if (lower.includes('hour') || lower.includes('60 min')) dur = 60;

    if (lower.includes('urgent') || lower.includes('high')) pri = 'high';
    else if (lower.includes('low')) pri = 'low';
    else if (lower.includes('medium')) pri = 'medium';

    setSelectedProject(proj);
    setSelectedDueDate(due);
    setSelectedDuration(dur);
    setSelectedPriority(pri);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputTitle(val);
    parseInput(val);
  };

  const handleAddTask = () => {
    if (!inputTitle.trim()) return;
    createTask(
      inputTitle.trim(),
      selectedProject,
      selectedPriority,
      selectedDueDate,
      selectedDuration
    );
    navigateTo('tasks');
  };

  return (
    <div className="relative flex flex-col h-full overflow-y-auto px-5 pt-3 pb-8">
      {/* Back link */}
      <div className="flex items-center py-2">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2 text-xs font-mono text-[#A09E97] hover:text-[#F1EFE8] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Main heading */}
      <h1 className="text-2xl font-semibold text-[#F1EFE8] tracking-tight mt-3 mb-4">
        Add something to work on
      </h1>

      {/* Large text input */}
      <div className="mb-4">
        <input
          type="text"
          value={inputTitle}
          onChange={handleInputChange}
          placeholder="e.g. Finish Spawn README by Friday"
          className="w-full px-4 py-3.5 bg-[#141413] border border-[#292925] focus:border-[#F06A3A] rounded-xl text-sm text-[#F1EFE8] placeholder-[#6F6D67] outline-none transition-colors"
          autoFocus
        />
      </div>

      {/* AI Parsed Result Preview */}
      {inputTitle.trim().length > 0 && (
        <div className="bg-[#141413] border border-[#292925] rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#A09E97] mb-3">
            <Sparkles size={13} className="text-[#F06A3A]" />
            <span>AI understands it.</span>
          </div>

          <div className="space-y-2 font-mono text-xs text-[#F1EFE8]">
            {/* Project */}
            <div className="flex items-center gap-2.5">
              <Folder size={13} className="text-[#6F6D67]" />
              <span>{selectedProject}</span>
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-2.5">
              <Calendar size={13} className="text-[#6F6D67]" />
              <span>{selectedDueDate}</span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2.5">
              <Clock size={13} className="text-[#6F6D67]" />
              <span>~{selectedDuration} min</span>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-2.5 pt-0.5">
              <AlertCircle size={13} className="text-[#F06A3A]" />
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-[#F06A3A]/15 text-[#F06A3A] border border-[#F06A3A]/30">
                {selectedPriority} priority
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Primary Action Button */}
      <PrimaryButton
        fullWidth
        onClick={handleAddTask}
        className="py-3 text-sm font-semibold tracking-tight mb-4"
      >
        Add Task
      </PrimaryButton>

      {/* Advanced (optional) accordion */}
      <div className="border border-[#1D1D1A] rounded-xl overflow-hidden mb-6">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-3.5 bg-[#141413]/50 hover:bg-[#141413] text-xs font-mono text-[#A09E97] transition-colors cursor-pointer"
        >
          <span>Advanced (optional)</span>
          {showAdvanced ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {showAdvanced && (
          <div className="p-3.5 bg-[#141413] space-y-3 border-t border-[#1D1D1A]">
            <div>
              <label className="block font-mono text-[10px] text-[#6F6D67] uppercase mb-1">
                Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full bg-[#181817] border border-[#292925] rounded-lg px-2.5 py-1.5 text-xs text-[#F1EFE8] outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-[10px] text-[#6F6D67] uppercase mb-1">
                Priority
              </label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((pri) => (
                  <button
                    key={pri}
                    type="button"
                    onClick={() => setSelectedPriority(pri)}
                    className={`flex-1 py-1 rounded border text-xs font-mono capitalize transition-colors ${
                      selectedPriority === pri
                        ? 'bg-[#F06A3A]/20 border-[#F06A3A] text-[#F06A3A]'
                        : 'border-[#292925] text-[#6F6D67]'
                    }`}
                  >
                    {pri}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spacer & Peeking Cat in bottom right */}
      <div className="flex-1 flex justify-end items-end pr-3">
        <CatIllustration
          pose="peek"
          size={58}
          interactive
          onTap={openRecommendation}
        />
      </div>
    </div>
  );
};
