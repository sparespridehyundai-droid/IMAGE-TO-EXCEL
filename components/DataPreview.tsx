
import React, { useState, useEffect } from 'react';
import { RepairOrderData } from '../types';
import { FileDown, Trash2, CheckCircle, Edit3, ChevronDown, ChevronUp, Eye, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { exportToExcel } from '../services/excelService';
import { FIELD_MAPPING } from '../constants';

interface DataPreviewProps {
  results: { id: string; data: RepairOrderData; thumbnail: string; verified?: boolean }[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onUpdateResults: (updated: any[]) => void;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ results, onRemove, onClearAll, onUpdateResults }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpdateField = (id: string, key: string, value: string) => {
    const updated = results.map(item => {
      if (item.id === id) {
        return { ...item, data: { ...item.data, [key]: value }, verified: false };
      }
      return item;
    });
    onUpdateResults(updated);
  };

  const toggleVerify = (id: string) => {
    const updated = results.map(item => {
      if (item.id === id) {
        return { ...item, verified: !item.verified };
      }
      return item;
    });
    onUpdateResults(updated);
  };

  const handleExportAll = () => {
    exportToExcel(results.map(r => r.data));
  };

  const filteredResults = results.filter(r => 
    r.data.roNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.data.ownerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.data.regNo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (results.length === 0) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Dynamic Control Panel */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 p-6 md:p-8 flex flex-col lg:flex-row items-center gap-6">
        <div className="flex-1 flex flex-col md:flex-row items-center gap-6 w-full">
          <div className="bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-200 shrink-0">
            <CheckCircle className="text-white w-8 h-8" />
          </div>
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Review Extraction</h2>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
              <span>{results.filter(r => r.verified).length} Verified</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>{results.length} Total Records</span>
            </div>
          </div>
          <div className="relative w-full md:max-w-xs ml-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search RO, Name..."
              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 w-full lg:w-auto">
          <button
            onClick={onClearAll}
            className="px-6 py-4 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
          >
            Clear Batch
          </button>
          <button
            onClick={handleExportAll}
            className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-slate-300 transition-all active:scale-95 group"
          >
            <FileDown size={22} className="group-hover:translate-y-0.5 transition-transform" />
            Download 6-Column Excel
          </button>
        </div>
      </div>

      {/* Verification List */}
      <div className="grid gap-4">
        {filteredResults.map((result) => (
          <div 
            key={result.id} 
            className={`
              bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden
              ${expandedId === result.id ? 'ring-4 ring-blue-50 border-blue-200' : 'border-slate-200 shadow-sm hover:shadow-md'}
              ${result.verified ? 'bg-green-50/20 border-green-100' : ''}
            `}
          >
            {/* Condensed Header */}
            <div 
              className="p-5 flex flex-col md:flex-row items-center gap-4 cursor-pointer"
              onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}
            >
              <div className="relative shrink-0">
                <div className="w-16 h-12 md:w-20 md:h-14 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                  <img src={result.thumbnail} className="w-full h-full object-cover" alt="Source" />
                </div>
                {result.verified && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 border-2 border-white shadow-lg">
                    <CheckCircle2 size={14} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">R/O Number</span>
                  <p className="font-bold text-slate-900 truncate">{result.data.roNo || '???'}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reg No</span>
                  <p className="font-bold text-slate-900 truncate">{result.data.regNo || '???'}</p>
                </div>
                <div className="col-span-2 space-y-0.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Name</span>
                  <p className="font-bold text-slate-900 truncate">{result.data.ownerName || 'Unidentified'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleVerify(result.id); }}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                    ${result.verified ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'}
                  `}
                >
                  {result.verified ? 'Verified' : 'Verify Now'}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemove(result.id); }}
                  className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Side-by-Side Validation Panel */}
            {expandedId === result.id && (
              <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-slate-100 h-[500px] animate-in slide-in-from-top-4">
                {/* Visual Viewport */}
                <div className="bg-slate-900 p-6 flex flex-col gap-4 overflow-hidden relative group/view">
                  <div className="flex items-center justify-between text-white/50 text-xs font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Eye size={14} />
                      Original Document Source
                    </div>
                  </div>
                  <div className="flex-1 relative overflow-auto rounded-2xl border border-white/10 bg-black/40 p-2 custom-scrollbar">
                    <img 
                      src={result.thumbnail} 
                      className="max-w-none min-w-full w-auto h-auto transition-transform cursor-zoom-in" 
                      alt="Full Source" 
                    />
                  </div>
                  <div className="absolute bottom-10 right-10 flex gap-2 opacity-0 group-hover/view:opacity-100 transition-opacity">
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] font-bold border border-white/20">
                      Scroll to zoom & explore
                    </div>
                  </div>
                </div>

                {/* Field Editor */}
                <div className="bg-white p-6 overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Edit3 size={18} />
                      <h4 className="font-black text-sm uppercase tracking-widest">Data Correction</h4>
                    </div>
                    {Object.values(result.data).some(v => !v) && (
                      <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1 rounded-full text-[10px] font-bold border border-amber-100">
                        <AlertCircle size={12} /> Missing Data Detected
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    {FIELD_MAPPING.map((field) => (
                      <div key={field.key} className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          value={(result.data as any)[field.key] || ''}
                          onChange={(e) => handleUpdateField(result.id, field.key, e.target.value)}
                          className={`
                            w-full bg-slate-50 border-2 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none transition-all
                            ${!(result.data as any)[field.key] ? 'border-amber-100 bg-amber-50/30' : 'border-transparent focus:border-blue-500 focus:bg-white'}
                          `}
                          placeholder={`Enter ${field.label}...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
