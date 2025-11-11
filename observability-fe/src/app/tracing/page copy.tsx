"use client"

import React, { useState } from 'react';
import { Search, Filter, Star, ChevronDown, ExternalLink, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { mockTraces } from '@/data/mock_data/mock_data';

export default function TracesPage() {
  const [selectedTraces, setSelectedTraces] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [filterExpanded, setFilterExpanded] = useState(true);

  const totalPages = Math.ceil(mockTraces.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayedTraces = mockTraces.slice(startIndex, startIndex + rowsPerPage);

  const toggleSelectAll = () => {
    if (selectedTraces.length === displayedTraces.length) {
      setSelectedTraces([]);
    } else {
      setSelectedTraces(displayedTraces.map(t => t.id));
    }
  };

  const toggleSelectTrace = (id: string) => {
    setSelectedTraces(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex h-screen bg-[#0d1117] text-gray-100">

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
      
        {/* Page Header */}
        <div className="border-b border-gray-800 px-6 py-4">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            Tracing
            <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center text-xs text-gray-400">?</div>
          </h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 flex px-6">
          <button className="px-4 py-3 text-sm font-medium border-b-2 border-blue-500">
            Traces
          </button>
          <button className="px-4 py-3 text-sm text-gray-400 hover:text-gray-200">
            Observations
          </button>
        </div>

        {/* Toolbar */}
        {/* <div className="border-b border-gray-800 px-6 py-3 flex items-center gap-3">
          <button 
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded border border-gray-700 hover:bg-gray-800"
            onClick={() => setFilterExpanded(!filterExpanded)}
          >
            <Filter className="w-3.5 h-3.5" />
            {filterExpanded ? 'Hide' : 'Show'} filters
            <span className="bg-gray-700 px-1.5 rounded text-xs">1</span>
          </button>
          
          <div className="flex-1 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-gray-600"
            />
          </div>

          <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded border border-gray-700 hover:bg-gray-800">
            IDs / Names
            <div className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center text-xs">?</div>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded border border-gray-700 hover:bg-gray-800">
            1d
          </button>

          <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded border border-gray-700 hover:bg-gray-800">
            Past 1 day
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm rounded border border-gray-700 hover:bg-gray-800">
              Saved Views <span className="ml-1 text-gray-500">7</span>
            </button>
            <button className="px-3 py-1.5 text-sm rounded border border-gray-700 hover:bg-gray-800">
              Columns <span className="ml-1 text-gray-500">20/32</span>
            </button>
            <button className="p-1.5 rounded border border-gray-700 hover:bg-gray-800">
              <div className="w-4 h-4 border border-gray-500"></div>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {/* {filterExpanded && (
          <div className="border-b border-gray-800 px-6 py-3 bg-gray-900/50">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Environment</span>
                  <div className="flex items-center gap-2">
                    <button className="text-xs text-gray-400 hover:text-gray-200">Clear ×</button>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  <button className="px-3 py-1 text-sm rounded bg-gray-800 border border-gray-700">
                    SELECT
                  </button>
                  <button className="px-3 py-1 text-sm rounded hover:bg-gray-800 text-gray-400">
                    TEXT
                  </button>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <input type="checkbox" className="rounded" />
                    default
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-200">
                    <input type="checkbox" className="rounded" checked readOnly />
                    langfuse-llm-as-a-judge
                  </label>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Trace Name</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex gap-2 mb-3">
                  <button className="px-3 py-1 text-sm rounded bg-gray-800 border border-gray-700">
                    SELECT
                  </button>
                  <button className="px-3 py-1 text-sm rounded hover:bg-gray-800 text-gray-400">
                    TEXT
                  </button>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  <label className="flex items-center gap-2 text-sm text-gray-200 justify-between">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" checked readOnly />
                      Execute evaluator: is_question
                    </div>
                    <span className="text-gray-500">37</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-200 justify-between">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" checked readOnly />
                      Execute evaluator: contains-...
                    </div>
                    <span className="text-gray-500">35</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-200 justify-between">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" checked readOnly />
                      Execute evaluator: is_same_l...
                    </div>
                    <span className="text-gray-500">35</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-200 justify-between">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" checked readOnly />
                      Execute evaluator: helpfulness
                    </div>
                    <span className="text-gray-500">35</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-200 justify-between">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" checked readOnly />
                      Execute evaluator: error-ana...
                    </div>
                    <span className="text-gray-500">35</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-200 justify-between">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" checked readOnly />
                      QA-Chatbot
                    </div>
                    <span className="text-gray-500">33</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-200 justify-between">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" checked readOnly />
                    </div>
                    <span className="text-gray-500">2</span>
                  </label>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Trace ID</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">User ID</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Session ID</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Metadata</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#0d1117] border-b border-gray-800">
              <tr>
                <th className="text-left p-3 font-medium w-10">
                  <input
                    type="checkbox"
                    checked={selectedTraces.length === displayedTraces.length}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="text-left p-3 font-medium w-10"></th>
                <th className="text-left p-3 font-medium">
                  <div className="flex items-center gap-1">
                    Timestamp
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Input</th>
                <th className="text-left p-3 font-medium">Output</th>
              </tr>
            </thead>
            <tbody>
              {displayedTraces.map((trace) => (
                <tr
                  key={trace.id}
                  className="border-b border-gray-800 hover:bg-gray-900/50 cursor-pointer"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedTraces.includes(trace.id)}
                      onChange={() => toggleSelectTrace(trace.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded"
                    />
                  </td>
                  <td className="p-3">
                    <Star className={`w-4 h-4 ${trace.bookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`} />
                  </td>
                  <td className="p-3 text-gray-400">
                    {trace.timestamp.toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    })}
                  </td>
                  <td className="p-3">{trace.name}</td>
                  <td className="p-3 text-gray-400 max-w-md truncate">{trace.input}</td>
                  <td className="p-3 text-gray-400 max-w-md truncate">{trace.output}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-gray-900 border border-gray-700 rounded px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}