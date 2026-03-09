import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FileX2, Shield, BarChart3, Lightbulb,
  Download, Settings, X
} from 'lucide-react';

const NAV = [
  { section: 'MAIN', items: [
    { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/denials',   icon: FileX2,          label: 'Denial Tracker', badge: '892', badgeColor: 'bg-red-500/15 text-red-400' },
    { to: '/appeals',   icon: Shield,          label: 'Appeals',        badge: '67%', badgeColor: 'bg-emerald-500/15 text-emerald-400' },
    { to: '/analytics', icon: BarChart3,       label: 'Analytics' },
  ]},
  { section: 'TOOLS', items: [
    { to: '/ai-writer', icon: Lightbulb, label: 'AI Appeal Writer', badge: 'AI', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
    { to: '/reports',   icon: Download,  label: 'Reports' },
    { to: '/settings',  icon: Settings,  label: 'Settings' },
  ]},
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 border-r border-white/5
        flex flex-col transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:z-30
      `}>
        {/* Brand */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg viewBox="0 0 20 20" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10l3 3 5-5" />
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-bold text-slate-100 tracking-tight">DenialIQ</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">by Promdix</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 text-slate-500 hover:text-slate-300">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          {NAV.map(section => (
            <div key={section.section} className="mb-2">
              <div className="px-5 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-[.1em]">
                {section.section}
              </div>
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) => `
                    group flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-[13px] font-medium
                    transition-colors duration-150 relative
                    ${isActive
                      ? 'bg-indigo-500/10 text-indigo-300'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-indigo-500 rounded-r" />
                      )}
                      <item.icon size={18} className={`shrink-0 ${isActive ? 'text-indigo-400' : 'opacity-60 group-hover:opacity-100'}`} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-xs font-semibold">
              PM
            </div>
            <div>
              <div className="text-[13px] font-medium text-slate-200">Promdix Admin</div>
              <div className="text-[10px] text-slate-500">Administrator</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
