import { Menu, Search, Bell, Calendar } from 'lucide-react';

export default function Header({ title, subtitle, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
            <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search — hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 min-w-[240px] focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search claims, patients..."
              className="bg-transparent outline-none text-sm text-slate-700 w-full placeholder:text-slate-400"
            />
          </div>

          {/* Notification */}
          <button className="relative p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Bell size={17} className="text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          {/* Date picker */}
          <button className="hidden sm:flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Calendar size={14} className="text-slate-400" />
            Last 30 Days
          </button>
        </div>
      </div>
    </header>
  );
}
