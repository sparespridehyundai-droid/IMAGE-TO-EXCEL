
import React, { useState, useEffect } from 'react';
import { RepairOrderData } from '../types';
import { FileDown, Trash2, CheckCircle, FileText, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
import { exportToExcel } from '../services/excelService';
import { FIELD_MAPPING } from '../constants';

interface DataPreviewProps {
  results: { id: string; data: RepairOrderData; thumbnail: string }[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ results, onRemove, onClearAll }) => {
  const [editableResults, setEditableResults] = useState(results);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setEditableResults(results);
    if (results.length > 0 && !expandedId) {
      setExpandedId(results[0].id);
    }
  }, [results]);

  const handleUpdateField = (id: string, key: string, value: string) => {
    setEditableResults(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, data: { ...item.data, [key]: value } };
      }
      return item;
    }));
  };

  const handleExportAll = () => {
    exportToExcel(editableResults.map(r => r.data));
  };

  if (editableResults.length === 0) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-3xl border border-gray-200 shadow-xl gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-green-600 p-3 rounded-2xl shadow-lg shadow-green-100">
            <CheckCircle className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Full Extraction Complete</h2>
            <p className="text-sm text-gray-500">All details mapped into a 6-column Excel template.</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={onClearAll}
            className="px-6 py-3 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition-all"
          >
            Clear All
          </button>
          <button
            onClick={handleExportAll}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-all active:scale-95"
          >
            <FileDown size={20} />
            Download Full Data (6 Cols)
          </button>
        </div>
      </div>

      {/* Record Cards */}
      <div className="space-y-4">
        {editableResults.map((result) => (
          <div key={result.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header / Summary */}
            <div 
              className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200">
                  <img src={result.thumbnail} className="w-full h-full object-cover" alt="Thumbnail" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">RO: {result.data.roNo || 'N/A'}</h3>
                  <p className="text-xs text-gray-500 uppercase font-black tracking-widest">
                    {result.data.ownerName || 'Unknown Customer'} • {result.data.regNo || 'No Plate'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemove(result.id); }}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                {expandedId === result.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </div>
            </div>

            {/* Expanded Content (The "Details" Grid) */}
            {expandedId === result.id && (
              <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                  {FIELD_MAPPING.map((field) => (
                    <div key={field.key} className="flex flex-col gap-1 group/field">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        {field.label}
                        <Edit3 size={10} className="opacity-0 group-hover/field:opacity-100 transition-opacity" />
                      </label>
                      <input
                        type="text"
                        value={(result.data as any)[field.key] || ''}
                        onChange={(e) => handleUpdateField(result.id, field.key, e.target.value)}
                        className="bg-gray-50 border-none focus:ring-2 focus:ring-blue-400 rounded-lg px-3 py-2 text-sm font-bold text-gray-800 outline-none transition-all"
                        placeholder="Not found..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
