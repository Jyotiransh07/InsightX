import React, { useState, useMemo } from 'react';
import { Table, Search, Download, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const DataExplorer = ({ data, columns }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase();
    return data.filter(row => 
      Object.values(row).some(val => 
        val !== null && val !== undefined && String(val).toLowerCase().includes(term)
      )
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil((filteredData.length || 1) / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

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
    <div className="report-card p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            <Table size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 tracking-tight">Cleaned Data Explorer</h3>
            <p className="text-xs text-slate-500">Previewing first 100 sanitized and imputed records</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search records..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 text-slate-800"
            />
          </div>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
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
                <th key={header} className="py-2.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span>{header}</span>
                    {getColTypeBadge(header)}
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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-800">{Math.min(filteredData.length, (currentPage - 1) * rowsPerPage + 1)}</span> to <span className="font-semibold text-slate-800">{Math.min(filteredData.length, currentPage * rowsPerPage)}</span> of <span className="font-semibold text-slate-800">{filteredData.length}</span> rows
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
    </div>
  );
};

export default DataExplorer;
