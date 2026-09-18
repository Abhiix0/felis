import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DesktopAppProvider } from './context/DesktopAppContext';
import { AppLayout } from './layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TasksPage } from './pages/TasksPage';
import { FocusPage } from './pages/FocusPage';
import { RadarPage } from './pages/RadarPage';

export default function App() {
  return (
    <DesktopAppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="focus" element={<FocusPage />} />
            <Route path="radar" element={<RadarPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DesktopAppProvider>
  );
}
