import { FileText, DollarSign, BarChart3, Shield, Clock, AlertTriangle } from 'lucide-react';

const REPORTS = [
  { icon: FileText,        color: 'bg-blue-50 text-blue-500',      title: 'Monthly Denial Summary',    desc: 'Complete breakdown of denied claims, recovery rates, and financial impact for the current month.', date: 'March 1, 2026' },
  { icon: DollarSign,      color: 'bg-emerald-50 text-emerald-500', title: 'Revenue Recovery Report',   desc: 'Detailed revenue analysis showing recovered amounts by payer, specialty, and appeal type.', date: 'March 1, 2026' },
  { icon: BarChart3,       color: 'bg-indigo-50 text-indigo-500',   title: 'Payer Performance Analysis', desc: 'Comparative analysis of payer denial patterns, processing times, and appeal outcomes.', date: 'Feb 28, 2026' },
  { icon: Shield,          color: 'bg-amber-50 text-amber-500',     title: 'Compliance Audit Trail',    desc: 'HIPAA-compliant audit log of all denial management activities, appeals, and outcomes.', date: 'March 1, 2026' },
  { icon: Clock,           color: 'bg-teal-50 text-teal-600',       title: 'Aging AR Report',           desc: 'Accounts receivable aging analysis for denied claims with follow-up recommendations.', date: 'March 1, 2026' },
  { icon: AlertTriangle,   color: 'bg-red-50 text-red-500',         title: 'Root Cause Analysis',       desc: 'AI-driven analysis identifying systemic denial patterns and recommended process improvements.', date: 'Feb 25, 2026' },
];

export default function Reports() {
  return (
    <div className="animate-fade-up space-y-3">
      {REPORTS.map(r => (
        <div key={r.title} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm hover:border-slate-300 transition-all">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${r.color}`}>
            <r.icon size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-800">{r.title}</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{r.desc}</p>
            <span className="text-[10px] text-slate-400 mt-1.5 block">Last generated: {r.date}</span>
          </div>
          <button className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shrink-0">
            Generate
          </button>
        </div>
      ))}
    </div>
  );
}
