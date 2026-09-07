import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const KPICard = ({ title, value, subValue, trend, trendLabel, icon: Icon, badgeColor }) => {
  return (
    <div className="report-card p-5 relative overflow-hidden bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow transition-all">
      <div className="flex justify-between items-start mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
            <Icon size={18} />
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</h3>
        {subValue && <span className="text-sm font-medium text-slate-400">{subValue}</span>}
      </div>
      
      {(trend || trendLabel) && (
        <div className="mt-3 flex items-center gap-2">
          {trend === 'up' && (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              <TrendingUp size={12} />
              {trendLabel}
            </span>
          )}
          {trend === 'down' && (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
              <TrendingDown size={12} />
              {trendLabel}
            </span>
          )}
          {trend === 'neutral' && (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              <Minus size={12} />
              {trendLabel}
            </span>
          )}
          {!trend && trendLabel && (
            <span className="text-xs font-medium text-slate-500">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default KPICard;
