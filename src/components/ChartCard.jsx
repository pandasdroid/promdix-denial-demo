export default function ChartCard({ title, subtitle, legend, actions, children, noPad, className = '' }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow ${className}`}>
      <div className="flex items-start justify-between px-5 pt-5 pb-0">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {legend}
          {actions}
        </div>
      </div>
      <div className={noPad ? '' : 'p-4'}>
        {children}
      </div>
    </div>
  );
}
