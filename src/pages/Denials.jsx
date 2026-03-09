import { useState, useMemo } from 'react';
import { Download, Lightbulb, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { ALL_DENIALS, PAYER_LIST, REASON_LIST, formatCurrency, formatDate } from '../data/mockData';

const PAGE_SIZE = 15;

export default function Denials() {
  const [status, setStatus] = useState('');
  const [payer, setPayer] = useState('');
  const [reason, setReason] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());

  const filtered = useMemo(() => {
    return ALL_DENIALS.filter(d => {
      if (status && d.status !== status) return false;
      if (payer && d.payer !== payer) return false;
      if (reason && d.reason !== reason) return false;
      return true;
    });
  }, [status, payer, reason]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleAll = () => {
    if (selected.size === pageData.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(pageData.map(d => d.id)));
    }
  };

  const toggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  return (
    <div className="animate-fade-up">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
        <div className="flex flex-wrap gap-3">
          <FilterSelect label="Status" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="appealed">Appealed</option>
            <option value="under_review">Under Review</option>
            <option value="recovered">Recovered</option>
            <option value="written_off">Written Off</option>
          </FilterSelect>
          <FilterSelect label="Payer" value={payer} onChange={e => { setPayer(e.target.value); setPage(1); }}>
            <option value="">All Payers</option>
            {PAYER_LIST.map(p => <option key={p}>{p}</option>)}
          </FilterSelect>
          <FilterSelect label="Denial Reason" value={reason} onChange={e => { setReason(e.target.value); setPage(1); }}>
            <option value="">All Reasons</option>
            {REASON_LIST.map(r => <option key={r}>{r}</option>)}
          </FilterSelect>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={14} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
            <Lightbulb size={14} /> AI Appeal
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="w-10 px-4 py-3"><input type="checkbox" checked={selected.size === pageData.length && pageData.length > 0} onChange={toggleAll} className="rounded accent-indigo-500" /></th>
                {['Claim ID', 'Patient', 'Payer', 'CPT', 'Amount', 'Denial Reason', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map(d => (
                <tr key={d.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.has(d.id)} onChange={() => toggle(d.id)} className="rounded accent-indigo-500" /></td>
                  <td className="px-4 py-3 font-mono text-xs text-indigo-600 font-medium whitespace-nowrap">{d.claim_id}</td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{d.patient}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{d.payer}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{d.cpt_code}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-800">{formatCurrency(d.amount)}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{d.reason}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{formatDate(d.date)}</td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" title="View">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="AI Appeal">
                        <Lightbulb size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
        <span className="text-xs text-slate-500">
          Showing <strong>{(page-1)*PAGE_SIZE+1}-{Math.min(page*PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong> denials
        </span>
        <div className="flex gap-1">
          <PgBtn disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14} /></PgBtn>
          {pageRange(page, totalPages).map((p, i) =>
            p === '...' ? <span key={i} className="px-2 py-1 text-xs text-slate-400">...</span>
              : <PgBtn key={i} active={p === page} onClick={() => setPage(p)}>{p}</PgBtn>
          )}
          <PgBtn disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14} /></PgBtn>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, children }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
      <select value={value} onChange={onChange} className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs text-slate-700 min-w-[150px] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all">
        {children}
      </select>
    </div>
  );
}

function PgBtn({ children, active, disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors
        ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  );
}

function pageRange(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}
