import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, GitMerge, CheckCircle, ShieldAlert } from 'lucide-react';

const AIAnalystPanel = ({ insights }) => {
  const getInsightIcon = (type) => {
    switch (type) {
      case 'trend':
        return <TrendingUp size={16} className="text-blue-600" />;
      case 'anomaly':
        return <AlertTriangle size={16} className="text-amber-600" />;
      case 'correlation':
        return <GitMerge size={16} className="text-purple-600" />;
      case 'cluster':
        return <CheckCircle size={16} className="text-emerald-600" />;
      default:
        return <Sparkles size={16} className="text-blue-600" />;
    }
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'trend':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'anomaly':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'correlation':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'cluster':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="report-card p-6 bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 tracking-tight">AI Executive Summary</h3>
            <p className="text-xs text-slate-500">Automated narrative & statistical findings</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Verified Python
        </span>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        {insights && insights.length > 0 ? (
          insights.map((insight, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-lg bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getInsightIcon(insight.type)}
                  <h4 className="text-sm font-semibold text-slate-900">{insight.title}</h4>
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getBadgeStyle(insight.type)}`}>
                  {insight.type}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 pl-6">
                {insight.description}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-400 text-sm">
            No automated findings identified.
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Computed on full dataset</span>
        <span>Every number verifiable</span>
      </div>
    </div>
  );
};

export default AIAnalystPanel;
