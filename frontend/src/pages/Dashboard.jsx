import React, { useState, useMemo } from 'react';
import { 
  UploadCloud, Sparkles, AlertCircle, Database, ShieldCheck, 
  Target, Activity, CheckCircle2, ArrowRight, FileSpreadsheet, 
  Layers, BarChart2, PieChart, FileText, Check, Cpu, Filter, 
  Lock, Zap, HelpCircle, ChevronDown, ChevronUp, Stethoscope, 
  Users, ShoppingBag, TrendingUp, BarChart3
} from 'lucide-react';
import axios from 'axios';
import Header from '../components/layout/Header';
import KPICard from '../components/dashboard/KPICard';
import DynamicChart from '../components/dashboard/DynamicChart';
import AIAnalystPanel from '../components/dashboard/AIAnalystPanel';
import AskAIPanel from '../components/dashboard/AskAIPanel';
import DataExplorer from '../components/dashboard/DataExplorer';

const UploadScreen = ({ onUploadStart, onUploadSuccess, onUploadError, onSampleSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;
    onUploadStart();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTimeout(() => onUploadSuccess(response.data), 800);
    } catch (error) {
      onUploadError(error.response?.data?.detail || 'An error occurred while processing the dataset.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const sampleDatasets = [
    {
      id: 'ecommerce',
      title: 'E-commerce Sales',
      category: 'Retail / Sales',
      icon: ShoppingBag,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      badge: '120 rows · 7 features',
      metrics: 'Revenue, Category, Discounts, Customer Ratings'
    },
    {
      id: 'saas',
      title: 'SaaS Growth & Churn',
      category: 'Subscription / Finance',
      icon: TrendingUp,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      badge: '120 rows · 6 features',
      metrics: 'Monthly Recurring Revenue (MRR), CAC, Churn %'
    },
    {
      id: 'healthcare',
      title: 'Patient Clinical Vitals',
      category: 'Healthcare / Medical',
      icon: Stethoscope,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      badge: '120 patients · 8 features',
      metrics: 'Systolic BP, Fasting Glucose, BMI, Readmission'
    },
    {
      id: 'hr',
      title: 'Workforce Attrition',
      category: 'Human Resources',
      icon: Users,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      badge: '120 employees · 7 features',
      metrics: 'Salary, Department, Tenure, Attrition Risk'
    }
  ];

  const faqs = [
    {
      q: "How does InsightX handle an unseen dataset during judging?",
      a: "InsightX is strictly domain-agnostic. It never expects specific column names like 'sales' or 'patient_id'. Instead, its Column Type Classifier inspects data signatures, formats, and cardinality to categorize columns into Temporal, Continuous Numeric, Categorical, Boolean, or High-Cardinality Identifiers, automatically adapting cleaning and modeling to whatever data is uploaded."
    },
    {
      q: "What machine learning models are executed under the hood?",
      a: "The engine runs real-time unsupervised K-Means Clustering with automated standard scaling and optimal K-selection to uncover latent customer or record segments. In parallel, it executes 1.5× Interquartile Range (IQR) outlier detection to flag anomalous records across multi-dimensional features."
    },
    {
      q: "How does the system decide which visualizations to render?",
      a: "The Visualization Recommendation Engine matches detected data properties to verified chart specifications: temporal columns trigger Area/Line trends, low-cardinality categoricals trigger aggregated Bar distribution charts, continuous numeric columns trigger Binned Histograms, and correlated feature pairs generate Scatter charts with Pearson r coefficients."
    },
    {
      q: "Is any data uploaded to external cloud services?",
      a: "No. All ingestion, cleaning, statistics, and machine learning occur purely in-memory on the backend FastAPI instance. No records leave your local machine or are stored in external databases."
    }
  ];

  return (
    <div id="top" className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-24">
      {/* Workflow pill banner */}
      <div className="flex justify-center mb-7">
        <div className="inline-flex items-center gap-2 sm:gap-4 px-5 py-2 rounded-full bg-white/95 border border-blue-200/80 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs backdrop-blur-md">
          <span className="flex items-center gap-1.5 text-blue-700">
            <FileSpreadsheet size={16} className="text-emerald-600" />
            <span>Raw Records</span>
          </span>
          <span className="text-slate-300">➔</span>
          <span className="flex items-center gap-1.5 text-blue-700">
            <Cpu size={16} className="text-blue-600" />
            <span>Automated AI Engine</span>
          </span>
          <span className="text-slate-300">➔</span>
          <span className="flex items-center gap-1.5 text-blue-700">
            <BarChart2 size={16} className="text-indigo-600" />
            <span>Interactive Visualizations</span>
          </span>
        </div>
      </div>

      {/* Main Headline with larger, bolder typography */}
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h1 className="hero-headline text-4xl sm:text-6xl font-black tracking-tight leading-[1.12] mb-5 text-black dark:text-white">
          <span className="block text-black dark:text-white">
            Autonomous Data Intelligence.
          </span>
          <span className="block text-black dark:text-white">
            Drop Any Dataset. Discover the Story.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-medium">
          From uncleaned spreadsheets to complete verified reports in seconds. Dynamically cleans data, detects anomalies, segments clusters, and renders interactive Recharts.
        </p>
      </div>

      {/* Centered Large Upload Dropzone */}
      <div className="max-w-2xl mx-auto mb-10">
        <div 
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-3xl p-12 sm:p-16 text-center transition-all bg-white/95 backdrop-blur-md cursor-pointer ${
            dragActive 
              ? 'border-blue-500 bg-blue-50/70 scale-[1.01]' 
              : 'border-blue-200/90 hover:border-blue-400 hover:bg-white shadow-sm hover:shadow-md'
          }`}
        >
          <input 
            type="file" 
            accept=".csv, .xlsx, .xls, .json, .tsv"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center pointer-events-none">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center mb-6 shadow-xs border border-blue-100">
              <UploadCloud size={42} />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              <span className="text-blue-600 hover:underline">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-slate-500 mb-5">
              Supports CSV, Excel (.xlsx, .xls), JSON, or TSV spreadsheets
            </p>
            <div className="inline-flex items-center gap-3 text-xs sm:text-sm text-slate-400 font-medium">
              <span>Domain-agnostic</span>
              <span>·</span>
              <span>Automated imputation</span>
              <span>·</span>
              <span>Verified computations</span>
            </div>
          </div>
        </div>

        {/* Security & Capability Badges Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Security</span>
            <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1.5 mt-1">
              <Lock size={14} className="text-emerald-600" />
              In-Memory Privacy
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Latency</span>
            <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1.5 mt-1">
              <Zap size={14} className="text-amber-500" />
              Sub-1.5s Speed
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">ML Engines</span>
            <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1.5 mt-1">
              <Cpu size={14} className="text-blue-600" />
              K-Means + IQR
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Visuals</span>
            <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1.5 mt-1">
              <BarChart3 size={14} className="text-purple-600" />
              Recharts Spec
            </span>
          </div>
        </div>
      </div>

      {/* Feature 1: Interactive Rich Sample Datasets Grid */}
      <div id="samples" className="mt-16 pt-8 scroll-mt-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Try a Realistic Domain Dataset
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 font-medium">
            Click any card to immediately evaluate the autonomous profiling, cleaning, and visualizations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sampleDatasets.map((sample) => {
            const Icon = sample.icon;
            return (
              <div
                key={sample.id}
                onClick={() => onSampleSelect(sample.id)}
                className="report-card p-6 bg-white/95 hover:border-blue-300 hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl border ${sample.color}`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {sample.category}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {sample.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {sample.metrics}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm text-blue-600 font-bold">
                  <span className="text-xs text-slate-400 font-normal">{sample.badge}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Run Analysis ➔
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature 2: 4-Pillar Autonomous Capability Architecture (With enhanced font sizes) */}
      <div id="capabilities" className="mt-20 pt-16 border-t border-slate-200/80 dark:border-slate-800 scroll-mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Engineered for Any Unseen Dataset
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-2 font-medium">
            Four autonomous intelligence layers that guarantee robust analysis without manual setup
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="report-card p-6 bg-white/95 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-2xs">
                01
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl mb-2">
                Schema Inference
              </h3>
              <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Detects temporal patterns, numerical ranges, unique IDs, and categoricals using heuristics without relying on predefined naming conventions.
              </p>
            </div>
          </div>

          <div className="report-card p-6 bg-white/95 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-2xs">
                02
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl mb-2">
                Hygiene & Audit
              </h3>
              <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Automatically handles missing values with statistical median/mode imputation, removes duplicate records, and outputs a 0–100% data health score.
              </p>
            </div>
          </div>

          <div className="report-card p-6 bg-white/95 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-2xs">
                03
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl mb-2">
                ML & Statistics
              </h3>
              <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Calculates Pearson correlation matrices, applies 1.5× IQR outlier boundaries, and executes unsupervised K-Means clustering.
              </p>
            </div>
          </div>

          <div className="report-card p-6 bg-white/95 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-2xs">
                04
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl mb-2">
                Verified Reports
              </h3>
              <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Assembles findings into an executive report with interactive Recharts, plain-English Q&A, and print-ready PDF export.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 3: Hackathon Evaluation FAQ Accordion (With enhanced font sizes) */}
      <div id="faqs" className="mt-20 pt-16 border-t border-slate-200/80 dark:border-slate-800 max-w-4xl mx-auto scroll-mt-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-bold mb-3 border border-blue-100 dark:border-blue-900/60">
            <HelpCircle size={15} />
            <span>Hackathon Evaluation Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 font-medium">
            Technical architecture and evaluation details for judges
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="report-card bg-white/95 overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {expandedFaq === idx ? (
                  <ChevronUp size={18} className="text-blue-600 shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-slate-400 shrink-0" />
                )}
              </button>

              {expandedFaq === idx && (
                <div className="px-5 sm:px-6 pb-6 text-sm sm:text-[15px] text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProcessingScreen = () => {
  return (
    <div className="max-w-md mx-auto py-28 px-4 text-center">
      <div className="w-20 h-20 mx-auto mb-6 relative flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
        <Sparkles className="absolute text-blue-600" size={26} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Dataset...</h2>
      <p className="text-sm text-slate-500 mb-6">Running automated profiling, data quality audit, and ML modeling</p>

      <div className="report-card p-6 bg-white/95 text-left space-y-3.5 text-sm">
        <div className="flex items-center gap-2.5 text-slate-700 font-medium">
          <Check size={16} className="text-emerald-500 shrink-0" />
          <span>Inspecting column schema & inferring data types</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-700 font-medium">
          <Check size={16} className="text-emerald-500 shrink-0" />
          <span>Cleaning nulls and calculating data health score</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-700 font-medium">
          <Check size={16} className="text-emerald-500 shrink-0" />
          <span>Computing IQR outliers & correlation matrices</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-600 font-medium animate-pulse">
          <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0"></div>
          <span>Synthesizing visualizations and executive narrative...</span>
        </div>
      </div>
    </div>
  );
};

const DashboardView = ({ data, onReset }) => {
  const { metadata, data_quality, charts, insights, analytics, explorer_data, filename } = data;
  const [activeSegmentFilter, setActiveSegmentFilter] = useState('all');

  // Find categorical columns to provide dynamic segment filtering
  const categoricalCols = useMemo(() => {
    return metadata.columns?.filter(c => c.type === 'categorical') || [];
  }, [metadata]);

  // Extract distinct values from the first categorical column
  const primaryCat = categoricalCols.length > 0 ? categoricalCols[0].column : null;
  const filterOptions = useMemo(() => {
    if (!primaryCat || !explorer_data) return [];
    const setVals = new Set(explorer_data.map(r => r[primaryCat]).filter(Boolean));
    return Array.from(setVals);
  }, [primaryCat, explorer_data]);

  // Dynamic filtered records
  const filteredExplorerData = useMemo(() => {
    if (activeSegmentFilter === 'all' || !primaryCat) return explorer_data;
    return explorer_data.filter(r => String(r[primaryCat]) === activeSegmentFilter);
  }, [activeSegmentFilter, primaryCat, explorer_data]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Report Document Header */}
      <div className="report-card bg-white/95 overflow-hidden border border-blue-200/80 shadow-md">
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              <FileSpreadsheet size={15} className="text-blue-600" />
              <span>Automated Analysis Report · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {filename?.replace(/\.[^/.]+$/, '').replace(/_/g, ' ').toUpperCase() || 'DATASET'} ANALYSIS
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <span>Source: <strong className="text-slate-700 dark:text-slate-200 font-mono">{filename}</strong></span>
              <span>·</span>
              <span>Processed: <strong className="text-slate-700 dark:text-slate-200">{metadata.overview.num_rows.toLocaleString()} rows</strong></span>
              <span>·</span>
              <span>Dimensions: <strong className="text-slate-700 dark:text-slate-200">{metadata.overview.num_cols} features</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Health Score</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{data_quality.quality_score}/100</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/80 shadow-2xs">
              <ShieldCheck size={26} />
            </div>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800 p-6 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Records</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{metadata.overview.num_rows.toLocaleString()}</p>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block font-medium">Full dataset analyzed</span>
          </div>

          <div className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Data Quality Score</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{data_quality.quality_score}%</p>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block font-medium">{data_quality.missing_values_handled} missing values fixed</span>
          </div>

          <div className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Statistical Anomalies</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{analytics.outliers?.total_anomalies || 0}</p>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1 block">Detected via 1.5× IQR</span>
          </div>

          <div className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Feature Dimensions</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{metadata.overview.num_cols}</p>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block font-medium">{metadata.overview.column_types?.numeric || 0} numeric · {metadata.overview.column_types?.categorical || 0} category</span>
          </div>
        </div>
      </div>

      {/* Feature: Dynamic Segment Slicing & Filter Toolbar */}
      {filterOptions.length > 0 && (
        <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 backdrop-blur-xs flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-blue-600" />
            <span className="font-bold text-slate-800">Filter Segment by {primaryCat}:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveSegmentFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                activeSegmentFilter === 'all' 
                  ? 'bg-blue-600 text-white shadow-2xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Records
            </button>
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveSegmentFilter(opt)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  activeSegmentFilter === opt 
                    ? 'bg-blue-600 text-white shadow-2xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Q&A ("Ask in Plain English") */}
      <AskAIPanel metadata={metadata} analytics={analytics} />

      {/* Visualizations & AI Narrative Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visualizations Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Interactive Visualizations</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Toggle chart types or download chart data</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{charts.length} automated specifications</span>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {charts.map((chart) => (
              <DynamicChart key={chart.id} config={chart} />
            ))}
            {charts.length === 0 && (
              <div className="col-span-12 report-card p-10 text-center text-slate-400 bg-white dark:bg-slate-900">
                No suitable chart configurations could be automatically derived.
              </div>
            )}
          </div>
        </div>

        {/* AI Executive Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Executive Findings</h2>
          </div>
          <AIAnalystPanel insights={insights} />
        </div>
      </div>

      {/* Data Quality & Hygiene Card */}
      <div className="report-card p-6 bg-white/95">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <ShieldCheck size={20} className="text-emerald-600" />
          Data Health & Hygiene Audit
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-medium block">Duplicates Removed</span>
            <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">{data_quality.duplicates_removed}</span>
          </div>
          <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-medium block">Missing Values Handled</span>
            <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">{data_quality.missing_values_handled}</span>
          </div>
          <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-medium block">Columns Evaluated</span>
            <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">{data_quality.columns_processed}</span>
          </div>
          <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-medium block">Anomaly Records</span>
            <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">{analytics.outliers?.total_anomalies || 0}</span>
          </div>
        </div>
      </div>

      {/* Interactive Data Explorer */}
      <DataExplorer data={filteredExplorerData} columns={metadata.columns} />
    </div>
  );
};

const Dashboard = () => {
  const [appState, setAppState] = useState('upload'); 
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleUploadStart = () => {
    setAppState('processing');
    setError(null);
  };

  const handleUploadSuccess = (responseData) => {
    setData(responseData);
    setAppState('dashboard');
  };

  const handleUploadError = (errMsg) => {
    setError(errMsg);
    setAppState('error');
  };

  const handleSampleSelect = async (sampleType) => {
    handleUploadStart();
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/sample/${sampleType}`);
      setTimeout(() => handleUploadSuccess(response.data), 800);
    } catch (err) {
      handleUploadError("Failed to generate sample dataset analysis.");
    }
  };

  const handleReset = () => {
    setData(null);
    setAppState('upload');
  };

  return (
    <div className="min-h-screen app-bg flex flex-col">
      <Header 
        onReset={handleReset} 
        hasData={!!data} 
        onSelectSample={handleSampleSelect}
        filename={data?.filename}
      />

      <main className="flex-1">
        {appState === 'upload' && (
          <UploadScreen 
            onUploadStart={handleUploadStart} 
            onUploadSuccess={handleUploadSuccess} 
            onUploadError={handleUploadError} 
            onSampleSelect={handleSampleSelect}
          />
        )}
        {appState === 'processing' && <ProcessingScreen />}
        {appState === 'dashboard' && data && <DashboardView data={data} onReset={handleReset} />}
        {appState === 'error' && (
          <div className="max-w-md mx-auto py-24 text-center px-4">
            <div className="w-18 h-18 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100">
              <AlertCircle size={36} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Processing Error</h3>
            <p className="text-sm text-slate-600 mb-6">{error}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              Try Another File
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xs py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-sm text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="InsightX Logo" className="h-7 w-auto object-contain drop-shadow-xs" />
            <span className="font-bold text-slate-800 dark:text-slate-200">InsightX</span>
            <span className="text-xs text-slate-400">· Autonomous Data Intelligence</span>
          </div>
          <div className="text-xs text-slate-400">
            Automated Insight Analyst · Built for Autonomous Discovery on Unseen Datasets
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
