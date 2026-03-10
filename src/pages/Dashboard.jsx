import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import { FileText, XCircle, Shield, CheckCircle2, DollarSign, Clock } from 'lucide-react';
import KpiCard from '../components/KpiCard';
import ChartCard from '../components/ChartCard';
import StatusBadge from '../components/StatusBadge';
import { ALL_DENIALS, CHART_MONTHS, TREND_DATA, REASON_DATA, PAYER_DENIALS, formatCurrency, formatDate } from '../data/mockData';

Chart.register(...registerables);

function useChart(ref, config) {
  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, config);
    return () => chart.destroy();
  }, []);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const trendRef = useRef(null);
  const reasonRef = useRef(null);
  const payerRef = useRef(null);

  const chartDefaults = {
    font: { family: "'Inter', sans-serif", size: 11 },
    color: '#94a3b8',
  };

  useChart(trendRef, {
    type: 'line',
    data: {
      labels: CHART_MONTHS,
      datasets: [
        { label: 'Claims', data: TREND_DATA.claims, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.04)', fill: true, tension: .4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5 },
        { label: 'Denials', data: TREND_DATA.denials, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.04)', fill: true, tension: .4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5 },
        { label: 'Recovered', data: TREND_DATA.recovered, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.04)', fill: true, tension: .4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { grid: { display: false }, ticks: chartDefaults },
        y: { grid: { color: 'rgba(0,0,0,.03)' }, ticks: chartDefaults, beginAtZero: true },
      },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#1e293b', titleFont: { weight: 600 }, padding: 10, cornerRadius: 8, boxPadding: 4 },
      },
    },
  });

  useChart(reasonRef, {
    type: 'doughnut',
    data: {
      labels: REASON_DATA.labels,
      datasets: [{ data: REASON_DATA.values, backgroundColor: REASON_DATA.colors, borderWidth: 0, hoverOffset: 6, borderRadius: 3 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '68%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true, pointStyleWidth: 8, font: { size: 10 } } },
        tooltip: { backgroundColor: '#1e293b', padding: 10, cornerRadius: 8, callbacks: { label: c => ` ${c.label}: ${c.parsed}%` } },
      },
    },
  });

  useChart(payerRef, {
    type: 'bar',
    data: {
      labels: PAYER_DENIALS.labels,
      datasets: [{ data: PAYER_DENIALS.values, backgroundColor: PAYER_DENIALS.colors, borderRadius: 6, borderSkipped: false, maxBarThickness: 36 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, indexAxis: 'y',
      scales: {
        x: { grid: { color: 'rgba(0,0,0,.03)' }, ticks: chartDefaults },
        y: { grid: { display: false }, ticks: { ...chartDefaults, font: { size: 10 } } },
      },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#1e293b', padding: 10, cornerRadius: 8, callbacks: { label: c => ` ${c.parsed.x} denied claims` } },
      },
    },
  });

  const recent = ALL_DENIALS.slice(0, 6);

  return (
    <div className="animate-fade-up">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
        <KpiCard icon={FileText}      iconBg="bg-blue-50 text-blue-500"    label="Total Claims"       target={12847}  trend="up"   trendLabel="+12.3%" />
        <KpiCard icon={XCircle}        iconBg="bg-red-50 text-red-500"      label="Denial Rate"        target={8.2}    suffix="%" trend="down" trendLabel="-2.1%" />
        <KpiCard icon={Shield}         iconBg="bg-amber-50 text-amber-500"  label="Appeals Filed"      target={892}    trend="up"   trendLabel="+8.7%" />
        <KpiCard icon={CheckCircle2}   iconBg="bg-emerald-50 text-emerald-500" label="Recovery Rate"   target={67.3}   suffix="%" trend="up"   trendLabel="+5.4%" />
        <KpiCard icon={DollarSign}     iconBg="bg-indigo-100 text-indigo-600" label="Revenue Recovered" target={1.24} prefix="$" suffix="M" trend="up" trendLabel="+18.2%" highlight />
        <KpiCard icon={Clock}          iconBg="bg-teal-50 text-teal-600"   label="Avg. Resolution"    target={18}     suffix=" days" trend="down" trendLabel="-3 days" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-5">
        <ChartCard
          title="Denial Trends"
          subtitle="Monthly claims vs denials over 12 months"
          className="lg:col-span-3"
          legend={
            <div className="flex items-center gap-3 text-[10px] font-medium text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Claims</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Denials</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Recovered</span>
            </div>
          }
        >
          <div className="h-64"><canvas ref={trendRef} /></div>
        </ChartCard>

        <ChartCard title="Denial Reasons" subtitle="Top reasons by category" className="lg:col-span-2">
          <div className="h-64"><canvas ref={reasonRef} /></div>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <ChartCard title="Top Payers by Denial Volume" subtitle="Payer-specific denial analysis" className="lg:col-span-2">
          <div className="h-64"><canvas ref={payerRef} /></div>
        </ChartCard>

        <ChartCard
          title="Recent Denials"
          subtitle="Latest denied claims requiring attention"
          className="lg:col-span-3"
          noPad
          actions={
            <button onClick={() => navigate('/denials')} className="text-xs text-indigo-500 font-medium hover:text-indigo-700 transition-colors whitespace-nowrap">
              View All &rarr;
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {['Claim ID', 'Patient', 'Payer', 'Amount', 'Reason', 'Status'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(d => (
                  <tr key={d.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs text-indigo-600 font-medium">{d.claim_id}</td>
                    <td className="px-4 py-2.5 text-slate-700">{d.patient}</td>
                    <td className="px-4 py-2.5 text-slate-600 text-xs">{d.payer}</td>
                    <td className="px-4 py-2.5 font-mono font-semibold text-slate-800">{formatCurrency(d.amount)}</td>
                    <td className="px-4 py-2.5 text-slate-600 text-xs">{d.reason}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
