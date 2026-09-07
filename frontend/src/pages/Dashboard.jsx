import React, { useState } from 'react';
import { 
  UploadCloud, Sparkles, AlertCircle, Database, ShieldCheck, 
  Target, Activity, CheckCircle2, ArrowRight, FileSpreadsheet, 
  Layers, BarChart2, PieChart, FileText, Check 
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

  return (
    <div className="max-w-5xl mx-auto px-4 pt-10 pb-20">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
          <Sparkles size={13} />
          <span>Automated Data Analyst & Insight Engine</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-5">
          Analyze data with AI.<br />
          <span className="text-blue-600">Instant. Domain-Agnostic. Verified.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Drop any raw CSV or Excel dataset. The system dynamically profiles schema, cleans anomalies, performs statistical and machine learning modeling, and synthesizes interactive dashboards with plain-language findings.
        </p>
      </div>

      {/* Upload Dropzone */}
      <div className="max-w-2xl mx-auto mb-8">
        <div 
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all bg-white cursor-pointer ${
            dragActive 
              ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' 
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/60 shadow-xs'
          }`}
        >
          <input 
            type="file" 
            accept=".csv, .xlsx, .xls, .json, .tsv"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center pointer-events-none">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
              <UploadCloud size={32} />
            </div>
            <p className="text-base font-semibold text-slate-800 mb-1">
              <span className="text-blue-600 font-bold hover:underline">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500 mb-3">
              Supports CSV, Excel (.xlsx, .xls), JSON, and TSV spreadsheets
            </p>
            <div className="inline-flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <span>Automatic data cleaning</span>
              <span>·</span>
              <span>Unseen dataset ready</span>
              <span>·</span>
              <span>Local processing</span>
            </div>
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Try a sample:</span>
          <button 
            type="button"
            onClick={() => onSampleSelect('ecommerce')}
            className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/40 transition-colors cursor-pointer"
          >
            E-commerce Revenue
          </button>
          <button 
            type="button"
            onClick={() => onSampleSelect('saas')}
            className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/40 transition-colors cursor-pointer"
          >
            SaaS Growth Metrics
          </button>
          <button 
            type="button"
            onClick={() => onSampleSelect('hr')}
            className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/40 transition-colors cursor-pointer"
          >
            HR Employee Retention
          </button>
          <button 
            type="button"
            onClick={() => onSampleSelect('web')}
            className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/40 transition-colors cursor-pointer"
          >
            Web Traffic & Channels
          </button>
        </div>
      </div>

      {/* 3 Step Workflow Section like analyzedata.io */}
      <div className="mt-16 pt-12 border-t border-slate-200">
        <h2 className="text-center text-xl font-bold text-slate-900 mb-8">
          How InsightX Analyzes Any Unseen Dataset
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center mb-3">
              1
            </div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1.5">Intelligent Ingestion & Cleaning</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Detects date, numeric, categorical, and ID columns without hardcoding. Handles missing values with median/mode imputation and flags duplicates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center mb-3">
              2
            </div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1.5">Statistical & ML Modeling</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Computes descriptive metrics, Pearson correlation matrices, IQR anomaly detection, and automated K-Means customer/record segmentation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center mb-3">
              3
            </div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1.5">Dynamic Report & Plain-English Q&A</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automatically selects the best Recharts visualizations (Area, Bar, Histogram, Scatter), formulates an executive narrative, and answers plain-English questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProcessingScreen = () => {
  return (
    <div className="max-w-md mx-auto py-28 px-4 text-center">
      <div className="w-20 h-20 mx-auto mb-6 relative flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
        <Sparkles className="absolute text-blue-600" size={26} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Dataset...</h2>
      <p className="text-xs text-slate-500 mb-6">Running automated profiling, data quality audit, and ML modeling</p>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-left space-y-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Check size={14} className="text-emerald-500" />
          <span>Inspecting column schema & inferring data types</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <Check size={14} className="text-emerald-500" />
          <span>Cleaning nulls and calculating data health score</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <Check size={14} className="text-emerald-500" />
          <span>Computing IQR outliers & correlation matrices</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 animate-pulse">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          <span>Synthesizing visualizations and executive narrative...</span>
        </div>
      </div>
    </div>
  );
};

const DashboardView = ({ data, onReset }) => {
  const { metadata, data_quality, charts, insights, analytics, explorer_data, filename } = data;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Report Document Header like analyzedata.io */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="h-1.5 bg-blue-600" />
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              <FileSpreadsheet size={14} className="text-blue-600" />
              <span>Automated Analysis Report · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {filename?.replace(/\.[^/.]+$/, '').replace(/_/g, ' ').toUpperCase() || 'DATASET'} ANALYSIS
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
              <span>Source: <strong className="text-slate-700 font-mono">{filename}</strong></span>
              <span>·</span>
              <span>Processed: <strong className="text-slate-700">{metadata.overview.num_rows.toLocaleString()} rows</strong></span>
              <span>·</span>
              <span>Dimensions: <strong className="text-slate-700">{metadata.overview.num_cols} features</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Health Score</span>
              <span className="text-xl font-bold text-emerald-600">{data_quality.quality_score}/100</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 p-6 bg-slate-50/50">
          <div className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Records</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{metadata.overview.num_rows.toLocaleString()}</p>
            <span className="text-xs text-slate-500 mt-1 block">Full dataset analyzed</span>
          </div>

          <div className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Data Quality Score</p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">{data_quality.quality_score}%</p>
            <span className="text-xs text-slate-500 mt-1 block">{data_quality.missing_values_handled} missing values fixed</span>
          </div>

          <div className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Statistical Anomalies</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{analytics.outliers?.total_anomalies || 0}</p>
            <span className="text-xs text-amber-600 font-medium mt-1 block">Detected via 1.5× IQR</span>
          </div>

          <div className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Feature Dimensions</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{metadata.overview.num_cols}</p>
            <span className="text-xs text-slate-500 mt-1 block">{metadata.overview.column_types?.numeric || 0} numeric · {metadata.overview.column_types?.categorical || 0} category</span>
          </div>
        </div>
      </div>

      {/* Interactive Q&A ("Ask in Plain English") */}
      <AskAIPanel metadata={metadata} analytics={analytics} />

      {/* Visualizations & AI Narrative Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visualizations Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Interactive Visualizations</h2>
            <span className="text-xs text-slate-500">{charts.length} automated specifications</span>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {charts.map((chart) => (
              <DynamicChart key={chart.id} config={chart} />
            ))}
            {charts.length === 0 && (
              <div className="col-span-12 report-card p-10 text-center text-slate-400 bg-white">
                No suitable chart configurations could be automatically derived.
              </div>
            )}
          </div>
        </div>

        {/* AI Executive Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Executive Findings</h2>
          </div>
          <AIAnalystPanel insights={insights} />
        </div>
      </div>

      {/* Data Quality & Hygiene Card */}
      <div className="report-card p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-600" />
          Data Health & Hygiene Audit
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block">Duplicates Removed</span>
            <span className="text-base font-bold text-slate-800">{data_quality.duplicates_removed}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block">Missing Values Handled</span>
            <span className="text-base font-bold text-slate-800">{data_quality.missing_values_handled}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block">Columns Evaluated</span>
            <span className="text-base font-bold text-slate-800">{data_quality.columns_processed}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block">Anomaly Records</span>
            <span className="text-base font-bold text-slate-800">{analytics.outliers?.total_anomalies || 0}</span>
          </div>
        </div>
      </div>

      {/* Interactive Data Explorer */}
      <DataExplorer data={explorer_data} columns={metadata.columns} />
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
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
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Error</h3>
            <p className="text-xs text-slate-600 mb-6">{error}</p>
            <button 
              onClick={handleReset}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Try Another File
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          InsightX Automated Insight Analyst · Built for Autonomous Discovery on Unseen Datasets
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
