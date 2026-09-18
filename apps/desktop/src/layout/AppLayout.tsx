import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, FolderKanban, CheckSquare, Radio, Plus } from 'lucide-react';
import { useDesktopApp } from '../context/DesktopAppContext';
import { CommandKModal } from '../components/CommandKModal';

export const AppLayout: React.FC = () => {
  const { projects, setIsCommandKOpen } = useDesktopApp();

  const navItemStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 12px',
    borderRadius: 6,
    color: isActive ? '#F1EFE8' : '#A09E97',
    backgroundColor: isActive ? '#181817' : 'transparent',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: isActive ? 600 : 400,
    border: isActive ? '1px solid #292925' : '1px solid transparent',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0D0D0C', color: '#F1EFE8', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          borderRight: '1px solid #1D1D1A',
          backgroundColor: '#111110',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 12px',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingLeft: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F06A3A' }} />
            <span style={{ fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '0.1em', fontSize: 14 }}>
              FELIS OS
            </span>
          </div>
          <button
            onClick={() => setIsCommandKOpen(true)}
            style={{
              background: '#181817',
              border: '1px solid #292925',
              color: '#A09E97',
              borderRadius: 4,
              padding: '2px 6px',
              fontSize: 10,
              fontFamily: 'monospace',
              cursor: 'pointer',
            }}
          >
            ⌘K
          </button>
        </div>

        {/* Main Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 24 }}>
          <NavLink to="/" style={navItemStyle}>
            <Home size={16} color="#F06A3A" />
            <span>Home</span>
          </NavLink>
          <NavLink to="/projects" style={navItemStyle}>
            <FolderKanban size={16} color="#F59E0B" />
            <span>Projects</span>
          </NavLink>
          <NavLink to="/tasks" style={navItemStyle}>
            <CheckSquare size={16} color="#10B981" />
            <span>Tasks</span>
          </NavLink>
          <NavLink to="/radar" style={navItemStyle}>
            <Radio size={16} color="#3B82F6" />
            <span>Radar</span>
          </NavLink>
        </nav>

        {/* Projects Sublist */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#6F6D67', textTransform: 'uppercase' }}>
              Projects ({projects.length})
            </span>
            <button
              onClick={() => setIsCommandKOpen(true)}
              style={{ background: 'none', border: 'none', color: '#6F6D67', cursor: 'pointer' }}
            >
              <Plus size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {projects.map((p) => (
              <NavLink
                key={p.id}
                to={`/projects?id=${p.id}`}
                style={({ isActive }) => ({
                  padding: '6px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  color: isActive ? '#F1EFE8' : '#A09E97',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                })}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                {p.stats && (
                  <span style={{ fontSize: 10, color: '#6F6D67', fontFamily: 'monospace' }}>
                    {p.stats.activeTasks}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Sync Status Footer */}
        <div style={{ paddingTop: 12, borderTop: '1px solid #1D1D1A', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6F6D67' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#B7D96B' }} />
          <span>Synced with FELIS Cloud</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', boxSizing: 'border-box' }}>
        <Outlet />
      </main>

      {/* Command K Modal */}
      <CommandKModal />
    </div>
  );
};
