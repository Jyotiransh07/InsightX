import React, { useState, useEffect } from 'react';
import { Printer, RefreshCw, Sparkles, Sun, Moon, ExternalLink } from 'lucide-react';

const Header = ({ onReset, hasData, onSelectSample, filename }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial preference - default to light
    const savedTheme = localStorage.getItem('insightx_theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('insightx_theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('insightx_theme', 'dark');
      setIsDark(true);
    }
  };

  const printReport = () => {
    window.print();
  };

  const scrollToSection = (id) => {
    if (hasData) {
      onReset();
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center w-auto lg:w-1/4">
          <div 
            onClick={() => { onReset(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <img 
              src="/logo.png" 
              alt="InsightX Logo" 
              className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-xs" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">InsightX</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80">
                  AI Analyst
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Centered Navigation Menu Links */}
        <nav className="hidden lg:flex items-center justify-center gap-2 flex-1">
          <button
            onClick={() => { onReset(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="px-4 py-2 rounded-lg text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('samples')}
            className="px-4 py-2 rounded-lg text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            Datasets
          </button>
          <button
            onClick={() => scrollToSection('capabilities')}
            className="px-4 py-2 rounded-lg text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            Capabilities
          </button>
          <button
            onClick={() => scrollToSection('faqs')}
            className="px-4 py-2 rounded-lg text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            FAQs
          </button>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
          >
            <span>API Docs</span>
            <ExternalLink size={14} className="opacity-60" />
          </a>
        </nav>

        {/* Right: Actions & Dark/Light Theme Switcher */}
        <div className="flex items-center justify-end gap-3 w-auto lg:w-1/4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 transition-colors cursor-pointer shadow-2xs"
            title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {isDark ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} className="text-slate-600" />
            )}
          </button>

          {hasData && (
            <>
              <button
                onClick={printReport}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                title="Print or Save PDF"
              >
                <Printer size={15} />
                <span className="hidden sm:inline">Export PDF</span>
              </button>

              <button
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>New Dataset</span>
              </button>
            </>
          )}

          {!hasData && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <Sparkles size={14} className="text-blue-500" />
              <span>Verified Engine</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
