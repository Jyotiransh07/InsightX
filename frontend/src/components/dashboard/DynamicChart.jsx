import React, { useState } from 'react';
import { 
  LineChart, Line, 
  AreaChart, Area, 
  BarChart, Bar, 
  ScatterChart, Scatter, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend 
} from 'recharts';
import { BarChart3, TrendingUp, ScatterChart as ScatterIcon, Layers, Download, SlidersHorizontal } from 'lucide-react';

const DynamicChart = ({ config }) => {
  const { title, subtitle, data, xAxis, yAxis, xCol, yCol, features, color = '#2563eb' } = config;
  // Feature: Interactive Chart Type Switching!
  const [currentType, setCurrentType] = useState(config.type || 'bar');
  const [showGrid, setShowGrid] = useState(true);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-xs z-50 backdrop-blur-xs">
          <p className="font-bold text-slate-800 dark:text-slate-100 mb-1.5">{label || payload[0]?.payload?.name || payload[0]?.payload?.range || ''}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color || color }} />
              <span className="text-slate-500 dark:text-slate-400">{entry.name || 'Value'}:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {typeof entry.value === 'number' ? entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const exportChartData = () => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
          No chart data available for this configuration.
        </div>
      );
    }

    switch (currentType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${config.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />}
              <XAxis dataKey={xAxis || 'date' || 'name'} stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey={yAxis || 'value'} 
                name={title}
                stroke={color} 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill={`url(#gradient-${config.id})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />}
              <XAxis dataKey={xAxis || 'date' || 'name'} stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey={yAxis || 'value'} name={title} stroke={color} strokeWidth={2.5} dot={{ r: 3, fill: color }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
      case 'histogram':
        const xKey = xAxis || (currentType === 'histogram' ? 'range' : 'name');
        const yKey = yAxis || (currentType === 'histogram' ? 'count' : 'value');
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />}
              <XAxis dataKey={xKey} stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={yKey} name={title} fill={color} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
              <XAxis dataKey="x" type="number" name={xCol} stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis dataKey="y" type="number" name={yCol} stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
              <Scatter name="Data Points" data={data} fill="#8b5cf6" opacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'cluster_scatter':
        const clusterPalette = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626'];
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
              <XAxis dataKey="x" type="number" name={features?.[0] || 'Feature 1'} stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis dataKey="y" type="number" name={features?.[1] || 'Feature 2'} stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
              <Scatter name="Clusters" data={data}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={clusterPalette[entry.cluster % clusterPalette.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );
        
      default:
        return (
          <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
            Visualizing data...
          </div>
        );
    }
  };

  const getIcon = () => {
    switch (currentType) {
      case 'area':
      case 'line':
        return <TrendingUp size={16} className="text-blue-600" />;
      case 'scatter':
        return <ScatterIcon size={16} className="text-purple-600" />;
      case 'cluster_scatter':
        return <Layers size={16} className="text-indigo-600" />;
      default:
        return <BarChart3 size={16} className="text-slate-600" />;
    }
  };

  const canToggleChartType = ['area', 'line', 'bar', 'histogram'].includes(config.type);

  return (
    <div className={`report-card p-5 bg-white dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs transition-colors ${config.gridArea || 'col-span-12'}`}>
      <div className="flex flex-wrap items-start justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            {getIcon()}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {/* Interactive Controls Toolbar */}
        <div className="flex items-center gap-2">
          {canToggleChartType && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
              <button
                onClick={() => setCurrentType('area')}
                className={`px-2.5 py-1 rounded-md cursor-pointer transition-all ${currentType === 'area' ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-2xs font-bold' : 'hover:text-slate-900 dark:hover:text-white'}`}
              >
                Area
              </button>
              <button
                onClick={() => setCurrentType('bar')}
                className={`px-2.5 py-1 rounded-md cursor-pointer transition-all ${currentType === 'bar' || currentType === 'histogram' ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-2xs font-bold' : 'hover:text-slate-900 dark:hover:text-white'}`}
              >
                Bar
              </button>
              <button
                onClick={() => setCurrentType('line')}
                className={`px-2.5 py-1 rounded-md cursor-pointer transition-all ${currentType === 'line' ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-2xs font-bold' : 'hover:text-slate-900 dark:hover:text-white'}`}
              >
                Line
              </button>
            </div>
          )}

          <button
            onClick={exportChartData}
            title="Download this chart's data"
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <Download size={15} />
          </button>
        </div>
      </div>

      {renderChart()}
    </div>
  );
};

export default DynamicChart;
