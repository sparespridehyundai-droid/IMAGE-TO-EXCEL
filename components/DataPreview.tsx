
import React from 'react';
import { RepairOrderData } from '../types';
import { FileDown, Table as TableIcon, Trash2, Eye, CheckCircle } from 'lucide-react';
import { exportToExcel } from '../services/excelService';

interface DataPreviewProps {
  results: { id: string; data: RepairOrderData; thumbnail: string }[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ results, onRemove, onClearAll }) => {
  const handleExportAll = () => {
    exportToExcel(results.map(r => r.data));
  };

  const handleExportSingle = (data: RepairOrderData) => {
    exportToExcel([data]);
  };

  if (results.length === 0) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-3xl border border-gray-200 shadow-xl gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-2xl">
            <CheckCircle className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Processed {results.length} Image{results.length > 1 ? 's' : ''}</h2>
            <p className="text-sm text-gray-500">Data is ready for Excel export</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={onClearAll}
            className="flex-1 md:flex-none px-6 py-3 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition-all border border-gray-200"
          >
            Clear All
          </button>
          <button
            onClick={handleExportAll}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-all active:scale-95"
          >
            <FileDown size={20} />
            Download Combined Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {results.map((result) => (
          <div key={result.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
            <div className="w-full md:w-32 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              <img src={result.thumbnail} alt="Preview" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">R/O Number</p>
                <p className="font-bold text-gray-800">{result.data.roNo || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Vehicle</p>
                <p className="font-bold text-gray-800">{result.data.regNo || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Customer</p>
                <p className="font-bold text-gray-800 truncate">{result.data.ownerName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Amt</p>
                <p className="font-bold text-blue-600">{result.data.totalAmt || '₹0.00'}</p>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
              <button 
                onClick={() => handleExportSingle(result.data)}
                className="flex-1 md:flex-none p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center gap-2 font-semibold"
                title="Download Single Excel"
              >
                <FileDown size={18} />
                <span className="md:hidden">Export</span>
              </button>
              <button 
                onClick={() => onRemove(result.id)}
                className="flex-1 md:flex-none p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2 font-semibold"
                title="Remove"
              >
                <Trash2 size={18} />
                <span className="md:hidden">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
