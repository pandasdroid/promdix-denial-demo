import { ChevronRight } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { ALL_DENIALS, formatCurrency } from '../data/mockData';

const PIPELINE = [
  { count: 147, label: 'Pending Review', color: 'bg-amber-400' },
  { count: 234, label: 'Appeal Drafted', color: 'bg-blue-500' },
  { count: 312, label: 'Under Payer Review', color: 'bg-indigo-500' },
  { count: 199, label: 'Resolved', color: 'bg-emerald-500' },
];

export default function Appeals() {
  const appeals = ALL_DENIALS
    .filter(d => ['appealed', 'under_review', 'pending'].includes(d.status))
    .slice(0, 9);

  return (
    <div className="animate-fade-up">
      {/* Pipeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          {PIPELINE.map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto sm:flex-1">
              <div className="flex-1 text-center py-2 sm:py-0">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{stage.count}</div>
                <div className="text-[11px] text-slate-500 font-medium mt-1">{stage.label}</div>
                <div className={`h-1 ${stage.color} rounded-full mt-3`} style={{ width: `${100 - i * 15}%`, margin: '12px auto 0' }} />
              </div>
              {i < PIPELINE.length - 1 && (
                <ChevronRight size={18} className="text-slate-300 hidden sm:block shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Appeal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {appeals.map(d => {
          const deadline = new Date(d.date);
          deadline.setDate(deadline.getDate() + 30);
          const daysLeft = Math.max(0, Math.ceil((deadline - new Date()) / 864e5));
          const urgency = daysLeft < 10 ? 'text-red-500' : daysLeft < 20 ? 'text-amber-500' : 'text-emerald-500';

          return (
            <div key={d.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-mono text-xs text-indigo-600 font-medium">{d.claim_id}</div>
                  <div className="font-semibold text-slate-900 mt-1">{d.patient}</div>
                </div>
                <StatusBadge status={d.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100">
                <MetaItem label="Payer" value={d.payer} />
                <MetaItem label="Amount" value={formatCurrency(d.amount)} bold />
                <MetaItem label="Denial Reason" value={d.reason} />
                <MetaItem label="Deadline" value={`${daysLeft} days left`} className={urgency} />
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 px-3 py-2 text-xs font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                  AI Draft
                </button>
                <button className="flex-1 px-3 py-2 text-xs font-medium border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetaItem({ label, value, bold, className = '' }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">{label}</div>
      <div className={`text-xs mt-0.5 ${bold ? 'font-semibold text-slate-800' : 'text-slate-600'} ${className}`}>{value}</div>
    </div>
  );
}
