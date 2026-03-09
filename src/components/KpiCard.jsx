import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KpiCard({ icon: Icon, iconBg, label, target, prefix = '', suffix = '', trend, trendLabel, highlight }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated.current) {
        animated.current = true;
        const start = performance.now();
        const dur = 1000;
        const isFloat = target % 1 !== 0;
        function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(isFloat ? (target * eased).toFixed(1) : Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  const isUp = trend === 'up';

  return (
    <div ref={ref} className={`
      rounded-2xl border p-4 sm:p-5 flex flex-col gap-3 transition-all duration-200
      hover:shadow-md hover:-translate-y-0.5
      ${highlight
        ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-transparent text-white'
        : 'bg-white border-slate-200'}
    `}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? 'bg-white/15' : iconBg}`}>
        <Icon size={20} className={highlight ? 'text-white' : undefined} />
      </div>
      <div>
        <div className="text-2xl sm:text-[1.7rem] font-bold tracking-tight tabular-nums leading-none">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        <div className={`text-xs font-medium mt-1 ${highlight ? 'text-indigo-200' : 'text-slate-500'}`}>
          {label}
        </div>
      </div>
      <div className={`flex items-center gap-1 text-xs font-semibold ${isUp ? 'text-emerald-500' : 'text-emerald-500'}`}>
        {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span className={highlight ? 'text-cyan-200' : ''}>{trendLabel}</span>
      </div>
    </div>
  );
}
