import React, { useState, useMemo } from 'react';
import { Table, Search, Download, ChevronLeft, ChevronRight, ArrowUpDown, Info, X } from 'lucide-react';

const DataExplorer = ({ data, columns }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortCol, setSortCol] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [showDictionary, setShowDictionary] = useState(false);

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  };

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    let list = [...data];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(row => 
        Object.values(row).some(val => 
          val !== null && val !== undefined && String(val).toLowerCase().includes(term)
        )
      );
    }

    if (sortCol) {
      list.sort((a, b) => {
        const valA = a[sortCol];
        const valB = b[sortCol];
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc 
          ? String(valA).localeCompare(String(valB)) 
          : String(valB).localeCompare(String(valA));
      });
    }

    return list;
  }, [data, searchTerm, sortCol, sortAsc]);

  const totalPages = Math.ceil((filteredData.length || 1) / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const exportCSV = () => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] ?? '')).join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned_dataset.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getColTypeBadge = (colName) => {
    const meta = columns?.find(c => c.column === colName);
    const type = meta?.type || 'text';
    const colors = {
      numeric: 'bg-blue-50 text-blue-700 border-blue-200',
      categorical: 'bg-purple-50 text-purple-700 border-purple-200',
      date: 'bg-amber-50 text-amber-700 border-amber-200',
      identifier: 'bg-slate-100 text-slate-600 border-slate-200'
    };
    return (
      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border uppercase tracking-wider ${colors[type] || colors.identifier}`}>
        {type}
      </span>
    );
  };

  if (!data || data.length === 0) {
    return null;
  }

  const colHeaders = Object.keys(data[0]);

  return (
    <div className="report-card p-6 bg-white border border-slate-200 rounded-xl shadow-xs relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            <Table size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">Cleaned Data Explorer</h3>
            <p className="text-xs text-slate-500">Search, sort, or inspect column schemas</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search rows..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-44 text-slate-800"
            />
          </div>

          <button
            onClick={() => setShowDictionary(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Info size={13} className="text-blue-600" />
            Schema Dict
          </button>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-100 rounded-lg">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              {colHeaders.map((header) => (
                <th 
                  key={header} 
                  onClick={() => handleSort(header)}
                  className="py-2.5 px-4 font-semibold text-slate-700 whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{header}</span>
                    {getColTypeBadge(header)}
                    <ArrowUpDown size={11} className={`text-slate-400 ${sortCol === header ? 'text-blue-600 font-bold' : ''}`} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                {colHeaders.map((header) => (
                  <td key={header} className="py-2 px-4 text-slate-600 font-mono whitespace-nowrap">
                    {row[header] === null || row[header] === undefined ? (
                      <span className="text-slate-300 italic">null</span>
                    ) : typeof row[header] === 'number' ? (
                      row[header].toLocaleString(undefined, { maximumFractionDigits: 2 })
                    ) : (
                      String(row[header])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Showing <strong className="text-slate-800">{Math.min(filteredData.length, (currentPage - 1) * rowsPerPage + 1)}</strong> to <strong className="text-slate-800">{Math.min(filteredData.length, currentPage * rowsPerPage)}</strong> of <strong className="text-slate-800">{filteredData.length}</strong> rows</span>
          <select 
            value={rowsPerPage} 
            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-700 bg-white"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="px-2 font-medium">Page {currentPage} of {totalPages || 1}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Schema Dictionary Modal */}
      {showDictionary && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Dataset Schema Dictionary</h3>
              </div>
              <button 
                onClick={() => setShowDictionary(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase">
                    <th className="py-2 px-3">Column Name</th>
                    <th className="py-2 px-3">Inferred Type</th>
                    <th className="py-2 px-3">Missing</th>
                    <th className="py-2 px-3">Unique</th>
                    <th className="py-2 px-3">Range (Min - Max)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {columns?.map((c) => (
                    <tr key={c.column} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-800 font-mono">{c.column}</td>
                      <td className="py-2 px-3">{getColTypeBadge(c.column)}</td>
                      <td className="py-2 px-3 text-slate-600">{c.missing} ({c.missing_percentage.toFixed(1)}%)</td>
                      <td className="py-2 px-3 text-slate-600">{c.unique}</td>
                      <td className="py-2 px-3 text-slate-600 font-mono">
                        {c.min !== undefined && c.max !== undefined && c.min !== null && c.max !== null 
                          ? `${c.min} → ${c.max}` 
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 text-right bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => setShowDictionary(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg cursor-pointer"
              >
                Close Dictionary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataExplorer;
