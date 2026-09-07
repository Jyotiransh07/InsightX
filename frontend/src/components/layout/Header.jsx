import React from 'react';
import { BarChart2, FileText, Printer, RefreshCw, Sparkles } from 'lucide-react';

const Header = ({ onReset, hasData, onSelectSample, filename }) => {
  const printReport = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div 
            onClick={onReset}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
              <BarChart2 size={19} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">InsightX</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  AI Analyst
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Sample Selector if on upload screen or header */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Try sample:</span>
          <button
            onClick={() => onSelectSample('ecommerce')}
            className="px-2.5 py-1 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50/50 transition-colors font-medium cursor-pointer"
          >
            E-commerce
          </button>
          <button
            onClick={() => onSelectSample('saas')}
            className="px-2.5 py-1 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50/50 transition-colors font-medium cursor-pointer"
          >
            SaaS Metrics
          </button>
          <button
            onClick={() => onSelectSample('hr')}
            className="px-2.5 py-1 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50/50 transition-colors font-medium cursor-pointer"
          >
            HR Workforce
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {hasData && (
            <>
              <button
                onClick={printReport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                title="Print or Save PDF"
              >
                <Printer size={14} />
                <span className="hidden sm:inline">Export PDF</span>
              </button>

              <button
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>New Dataset</span>
              </button>
            </>
          )}

          {!hasData && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Sparkles size={14} className="text-blue-600" />
              <span>Free, Instant, Verified</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
