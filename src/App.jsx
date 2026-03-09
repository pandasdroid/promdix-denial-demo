import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Denials from './pages/Denials';
import Appeals from './pages/Appeals';
import Analytics from './pages/Analytics';
import AIWriter from './pages/AIWriter';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const PAGE_META = {
  '/':          { title: 'Dashboard',         subtitle: 'Real-time denial management overview' },
  '/denials':   { title: 'Denial Tracker',    subtitle: 'Track, filter, and manage all denied claims' },
  '/appeals':   { title: 'Appeal Management', subtitle: 'Appeal pipeline and workflow management' },
  '/analytics': { title: 'Analytics',         subtitle: 'Comprehensive denial and recovery analytics' },
  '/ai-writer': { title: 'AI Appeal Writer',  subtitle: 'Generate professional appeal letters with AI' },
  '/reports':   { title: 'Reports',           subtitle: 'Generate and download management reports' },
  '/settings':  { title: 'Settings',          subtitle: 'Configure your denial management platform' },
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const meta = PAGE_META[location.pathname] || PAGE_META['/'];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64 min-w-0">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/denials" element={<Denials />} />
            <Route path="/appeals" element={<Appeals />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai-writer" element={<AIWriter />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
