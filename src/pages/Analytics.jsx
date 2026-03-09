import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ChartCard from '../components/ChartCard';

Chart.register(...registerables);

function useChart(ref, config) {
  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, config);
    return () => chart.destroy();
  }, []);
}

const tf = { font: { family: "'Inter',sans-serif", size: 10 }, color: '#94a3b8' };
const tip = { backgroundColor: '#1e293b', padding: 10, cornerRadius: 8 };

export default function Analytics() {
  const recoveryRef = useRef(null);
  const specialtyRef = useRef(null);
  const successRef = useRef(null);
  const revenueRef = useRef(null);

  useChart(recoveryRef, {
    type: 'bar',
    data: {
      labels: ['United', 'Aetna', 'BCBS', 'Cigna', 'Medicare', 'Humana', 'Anthem', 'Kaiser'],
      datasets: [
        { label: 'Recovered', data: [72,65,78,58,82,61,69,74], backgroundColor: 'rgba(16,185,129,.8)', borderRadius: 4, borderSkipped: false },
        { label: 'Written Off', data: [28,35,22,42,18,39,31,26], backgroundColor: 'rgba(239,68,68,.2)', borderRadius: 4, borderSkipped: false },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { x: { grid: { display: false }, stacked: true, ticks: tf }, y: { stacked: true, max: 100, ticks: { ...tf, callback: v => v + '%' }, grid: { color: 'rgba(0,0,0,.03)' } } },
      plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyleWidth: 8, padding: 16, font: { size: 10 } } }, tooltip: { ...tip, callbacks: { label: c => ` ${c.dataset.label}: ${c.parsed.y}%` } } },
    },
  });

  useChart(specialtyRef, {
    type: 'polarArea',
    data: {
      labels: ['Cardiology','Orthopedics','Radiology','Lab Services','Emergency','Surgery'],
      datasets: [{ data: [156,134,118,98,87,72], backgroundColor: ['rgba(239,68,68,.7)','rgba(59,130,246,.7)','rgba(245,158,11,.7)','rgba(16,185,129,.7)','rgba(139,92,246,.7)','rgba(236,72,153,.7)'], borderWidth: 0 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, pointStyleWidth: 8, padding: 12, font: { size: 10 } } }, tooltip: tip },
      scales: { r: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { display: false } } },
    },
  });

  useChart(successRef, {
    type: 'bar',
    data: {
      labels: ['Authorization','Coding Error','Timely Filing','Duplicate','Medical Necessity','Eligibility'],
      datasets: [{
        label: 'Win Rate', data: [74,82,45,68,56,71],
        backgroundColor: ctx => { const v = ctx.parsed?.y; return v >= 70 ? 'rgba(16,185,129,.8)' : v >= 50 ? 'rgba(245,158,11,.8)' : 'rgba(239,68,68,.8)'; },
        borderRadius: 6, borderSkipped: false, maxBarThickness: 32,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { x: { grid: { display: false }, ticks: { ...tf, font: { size: 9 } } }, y: { max: 100, ticks: { ...tf, callback: v => v + '%' }, grid: { color: 'rgba(0,0,0,.03)' } } },
      plugins: { legend: { display: false }, tooltip: { ...tip, callbacks: { label: c => ` Win Rate: ${c.parsed.y}%` } } },
    },
  });

  const months = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
  useChart(revenueRef, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        { label: 'Cumulative ($K)', data: [98,210,335,468,612,748,892,1028,1178,1324,1456,1580], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,.06)', fill: true, tension: .4, borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: '#6366f1', pointBorderColor: '#fff', pointBorderWidth: 2, yAxisID: 'y' },
        { label: 'Monthly ($K)', data: [98,112,125,133,144,136,144,136,150,146,132,124], backgroundColor: 'rgba(16,185,129,.6)', type: 'bar', borderRadius: 4, borderSkipped: false, maxBarThickness: 24, yAxisID: 'y1' },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { grid: { display: false }, ticks: tf },
        y: { position: 'left', grid: { color: 'rgba(0,0,0,.03)' }, ticks: { ...tf, callback: v => '$' + v + 'K' } },
        y1: { position: 'right', grid: { display: false }, ticks: { ...tf, callback: v => '$' + v + 'K' } },
      },
      plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyleWidth: 8, padding: 16, font: { size: 10 } } }, tooltip: { ...tip, callbacks: { label: c => ` ${c.dataset.label}: $${c.parsed.y}K` } } },
    },
  });

  return (
    <div className="animate-fade-up">
      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
        <AnalyticKpi label="Total Denied Amount" value="$2,847,320" sub="+$124K vs last month" subColor="text-emerald-500" />
        <AnalyticKpi label="Total Recovered" value="$1,916,407" valueColor="text-emerald-600" sub="67.3% recovery rate" subColor="text-emerald-500" />
        <AnalyticKpi label="Net Write-Off" value="$930,913" valueColor="text-red-500" sub="32.7% of denials" subColor="text-red-500" />
        <AnalyticKpi label="Avg Denial Value" value="$3,192" sub="Per denied claim" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-5">
        <ChartCard title="Recovery Rate by Payer" subtitle="Percentage of denied amount recovered" className="lg:col-span-3">
          <div className="h-64"><canvas ref={recoveryRef} /></div>
        </ChartCard>
        <ChartCard title="Denial by Specialty" subtitle="Claims denied by specialty" className="lg:col-span-2">
          <div className="h-64"><canvas ref={specialtyRef} /></div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <ChartCard title="Appeal Success by Reason" subtitle="Win rate per denial reason" className="lg:col-span-2">
          <div className="h-64"><canvas ref={successRef} /></div>
        </ChartCard>
        <ChartCard title="Revenue Recovery Timeline" subtitle="Cumulative revenue recovered over time" className="lg:col-span-3">
          <div className="h-64"><canvas ref={revenueRef} /></div>
        </ChartCard>
      </div>
    </div>
  );
}

function AnalyticKpi({ label, value, valueColor = '', sub, subColor = 'text-slate-500' }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="text-[11px] text-slate-500 font-medium mb-2">{label}</div>
      <div className={`text-xl sm:text-2xl font-bold tracking-tight ${valueColor || 'text-slate-900'}`}>{value}</div>
      <div className={`text-[11px] font-medium mt-1.5 ${subColor}`}>{sub}</div>
    </div>
  );
}
