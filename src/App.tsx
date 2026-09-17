import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { NotebookBackground } from './components/ui/NotebookBackground';
import { BottomNavigation } from './components/ui/BottomNavigation';
import { Screen01Shell } from './components/screens/Screen01Shell';
import { Screen02Home } from './components/screens/Screen02Home';
import { Screen03Projects } from './components/screens/Screen03Projects';
import { Screen04ProjectDetail } from './components/screens/Screen04ProjectDetail';
import { Screen05Tasks } from './components/screens/Screen05Tasks';
import { Screen06AddTask } from './components/screens/Screen06AddTask';
import { Screen07FocusSession } from './components/screens/Screen07FocusSession';
import { Screen08RecommendationModal } from './components/screens/Screen08RecommendationModal';
import { Screen09EmptyStates } from './components/screens/Screen09EmptyStates';
import { Screen10StatesGallery } from './components/screens/Screen10StatesGallery';
import { ScreenRadar } from './components/screens/ScreenRadar';
import { ScreenProfile } from './components/screens/ScreenProfile';
import { Wifi, Battery, Smartphone, Maximize2, LayoutGrid } from 'lucide-react';
import { ScreenRoute } from './types';

const WIREFRAME_SCREENS: { id: ScreenRoute; label: string; number: string }[] = [
  { id: 'shell_drawer', label: 'App Shell', number: '01' },
  { id: 'home', label: 'Home', number: '02' },
  { id: 'projects', label: 'Projects', number: '03' },
  { id: 'project_detail', label: 'Project Detail', number: '04' },
  { id: 'tasks', label: 'Tasks', number: '05' },
  { id: 'add_task', label: 'Add Task', number: '06' },
  { id: 'focus_session', label: 'Focus Session', number: '07' },
  { id: 'what_should_i_do', label: 'What Should I Do?', number: '08' },
  { id: 'empty_states', label: 'Empty States', number: '09' },
  { id: 'state_gallery', label: 'System States', number: '10' },
];

const MainAppContent: React.FC = () => {
  const {
    currentRoute,
    activeTab,
    setActiveTab,
    navigateTo,
    isRecommendationOpen,
    isShellDrawerOpen,
    openRecommendation,
    closeShellDrawer,
  } = useApp();

  const [useDeviceFrame, setUseDeviceFrame] = useState(true);
  const [showScreenSelector, setShowScreenSelector] = useState(true);

  const renderActiveScreen = () => {
    switch (currentRoute) {
      case 'shell_drawer':
        return <Screen01Shell isDrawerMode={false} />;
      case 'home':
        return <Screen02Home />;
      case 'projects':
        return <Screen03Projects />;
      case 'project_detail':
        return <Screen04ProjectDetail />;
      case 'tasks':
        return <Screen05Tasks />;
      case 'add_task':
        return <Screen06AddTask />;
      case 'focus_session':
        return <Screen07FocusSession />;
      case 'what_should_i_do':
        return (
          <>
            <Screen02Home />
            <Screen08RecommendationModal />
          </>
        );
      case 'empty_states':
        return <Screen09EmptyStates />;
      case 'state_gallery':
        return <Screen10StatesGallery />;
      case 'radar':
        return <ScreenRadar />;
      case 'profile':
        return <ScreenProfile />;
      default:
        return <Screen02Home />;
    }
  };

  // Bottom navigation should be hidden on Focus, Add Task, and Drawer
  const showBottomNav =
    currentRoute !== 'focus_session' &&
    currentRoute !== 'add_task' &&
    currentRoute !== 'shell_drawer';

  return (
    <div className="min-h-screen w-full bg-[#070706] text-[#F1EFE8] flex flex-col items-center justify-start antialiased selection:bg-[#F06A3A] selection:text-[#0D0D0C]">
      {/* Top Prototype Wireframe Navigation Bar */}
      {showScreenSelector && (
        <header className="w-full bg-[#111110]/95 backdrop-blur-md border-b border-[#1D1D1A] px-3 py-2 z-40 shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F06A3A] animate-pulse" />
              <span className="font-mono text-xs font-semibold tracking-wider text-[#F1EFE8]">
                SPAWN MOBILE PROTOYPE
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#181817] text-[#A09E97] border border-[#292925]">
                Wireframe Accuracy
              </span>
            </div>

            {/* Quick Screen Picker */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
              {WIREFRAME_SCREENS.map((screen) => {
                const isSelected =
                  currentRoute === screen.id ||
                  (screen.id === 'what_should_i_do' && isRecommendationOpen);

                return (
                  <button
                    key={screen.id}
                    onClick={() => {
                      if (screen.id === 'what_should_i_do') {
                        openRecommendation();
                      } else {
                        navigateTo(screen.id);
                      }
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#F06A3A] text-[#0D0D0C] font-semibold'
                        : 'bg-[#181817] text-[#A09E97] hover:text-[#F1EFE8] border border-[#292925]'
                    }`}
                  >
                    <span className="opacity-75">{screen.number}</span>
                    <span>{screen.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setUseDeviceFrame(!useDeviceFrame)}
                className="px-2 py-1 rounded bg-[#181817] hover:bg-[#20201E] border border-[#292925] text-xs font-mono text-[#A09E97] hover:text-[#F1EFE8] flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Toggle Mobile Bezel Frame"
              >
                {useDeviceFrame ? <Maximize2 size={13} /> : <Smartphone size={13} />}
                <span>{useDeviceFrame ? 'Fluid' : 'Frame'}</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Viewport Container */}
      <main className="w-full flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
        {useDeviceFrame ? (
          /* Mobile Device Frame Mockup */
          <div className="relative w-full max-w-[400px] h-[844px] max-h-[92vh] bg-[#000000] rounded-[44px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_#292925] flex flex-col overflow-hidden ring-1 ring-[#1D1D1A]">
            {/* Phone Screen Outer Boundary */}
            <div className="relative w-full h-full bg-[#0D0D0C] rounded-[36px] overflow-hidden flex flex-col border border-[#1D1D1A]">
              {/* Dynamic Island / Status Bar */}
              <div className="w-full h-11 px-7 flex items-center justify-between z-30 shrink-0 bg-[#0D0D0C] text-[#F1EFE8] font-mono text-xs select-none">
                <span className="font-semibold text-xs tracking-tight">9:41</span>
                
                {/* Subtle camera punch / pill notch */}
                <div className="w-24 h-4 bg-[#000000] rounded-full border border-[#181817] flex items-center justify-center" />

                <div className="flex items-center gap-2 text-[#A09E97]">
                  <Wifi size={13} />
                  <Battery size={15} />
                </div>
              </div>

              {/* Mobile Content Canvas with Notebook Texture */}
              <NotebookBackground className="flex-1 min-h-0 flex flex-col">
                <div className="flex-1 overflow-hidden relative flex flex-col">
                  {renderActiveScreen()}

                  {/* Drawer shell overlay if opened */}
                  {isShellDrawerOpen && (
                    <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-xs flex">
                      <div className="w-4/5 h-full bg-[#0D0D0C] border-r border-[#292925] shadow-2xl">
                        <Screen01Shell isDrawerMode={true} />
                      </div>
                      <div
                        className="flex-1 h-full"
                        onClick={closeShellDrawer}
                      />
                    </div>
                  )}

                  {/* Recommendation Modal Overlay if opened */}
                  {isRecommendationOpen && <Screen08RecommendationModal />}
                </div>

                {/* Persistent Bottom Navigation */}
                {showBottomNav && (
                  <BottomNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                )}
              </NotebookBackground>

              {/* iOS / Android Home Indicator Bar */}
              <div className="w-full h-4 bg-[#0D0D0C] flex items-center justify-center shrink-0 z-30">
                <div className="w-32 h-1 bg-[#292925] rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Full Fluid Mobile View */
          <div className="w-full max-w-md h-[88vh] bg-[#0D0D0C] border border-[#292925] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            {/* Status Bar */}
            <div className="w-full h-9 px-5 flex items-center justify-between z-30 shrink-0 bg-[#0D0D0C] text-[#F1EFE8] font-mono text-xs select-none border-b border-[#1D1D1A]">
              <span className="font-semibold text-xs">9:41</span>
              <div className="flex items-center gap-2 text-[#A09E97]">
                <Wifi size={13} />
                <Battery size={14} />
              </div>
            </div>

            <NotebookBackground className="flex-1 min-h-0 flex flex-col">
              <div className="flex-1 overflow-hidden relative flex flex-col">
                {renderActiveScreen()}

                {isShellDrawerOpen && (
                  <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-xs flex">
                    <div className="w-4/5 h-full bg-[#0D0D0C] border-r border-[#292925] shadow-2xl">
                      <Screen01Shell isDrawerMode={true} />
                    </div>
                    <div className="flex-1 h-full" onClick={closeShellDrawer} />
                  </div>
                )}

                {isRecommendationOpen && <Screen08RecommendationModal />}
              </div>

              {showBottomNav && (
                <BottomNavigation
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              )}
            </NotebookBackground>
          </div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
