import React, { useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, GitMerge, CheckCircle, Copy, Check, Filter } from 'lucide-react';

const AIAnalystPanel = ({ insights }) => {
  const [filterType, setFilterType] = useState('all');
  const [copied, setCopied] = useState(false);

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

  const copySummary = () => {
    if (!insights) return;
    const text = insights.map(i => `### ${i.title} (${i.type.toUpperCase()})\n${i.description}\n`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredInsights = (!insights || filterType === 'all')
    ? insights 
    : insights.filter(i => i.type === filterType);

  return (
    <div className="report-card p-6 bg-white border border-slate-200 rounded-xl shadow-xs h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">AI Executive Summary</h3>
            <p className="text-xs text-slate-500">Automated narrative & statistical findings</p>
          </div>
        </div>

        <button
          onClick={copySummary}
          title="Copy markdown summary"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
        >
          {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1 text-xs">
        {['all', 'trend', 'correlation', 'anomaly', 'cluster'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors capitalize cursor-pointer whitespace-nowrap ${
              filterType === t 
                ? 'bg-blue-600 text-white font-semibold' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t === 'all' ? 'All Insights' : `${t}s`}
          </button>
        ))}
      </div>

      {/* Findings List */}
      <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
        {filteredInsights && filteredInsights.length > 0 ? (
          filteredInsights.map((insight, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {getInsightIcon(insight.type)}
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{insight.title}</h4>
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
          <div className="text-center py-10 text-slate-400 text-xs">
            No insights found for this filter.
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Verified Python Pipeline</span>
        <span>Every number sourced</span>
      </div>
    </div>
  );
};

export default AIAnalystPanel;
