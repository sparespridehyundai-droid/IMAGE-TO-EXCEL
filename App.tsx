
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Uploader } from './components/Uploader';
import { DataPreview } from './components/DataPreview';
import { extractRepairOrderData } from './services/geminiService';
import { RepairOrderData } from './types';
import { AlertCircle, FileSpreadsheet, Sparkles, Layers } from 'lucide-react';

interface ProcessedResult {
  id: string;
  data: RepairOrderData;
  thumbnail: string;
}

const App: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleProcessBatch = async (base64Array: string[]) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const newResults: ProcessedResult[] = [];
      
      // Process sequential so we don't overwhelm anything, or in parallel for speed
      // Sequential is safer for demo purposes with Gemini API rate limits
      for (const base64 of base64Array) {
        try {
          const data = await extractRepairOrderData(base64);
          newResults.push({
            id: Math.random().toString(36).substr(2, 9),
            data,
            thumbnail: base64
          });
        } catch (err) {
          console.error("Extraction error for image", err);
          // We continue with others if one fails
        }
      }

      if (newResults.length === 0 && base64Array.length > 0) {
        throw new Error("Could not extract valid data from any of the provided images. Please check the image quality.");
      }

      setResults(prev => [...newResults, ...prev]);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during batch processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeResult = (id: string) => {
    setResults(prev => prev.filter(r => r.id !== id));
  };

  const clearAllResults = () => {
    setResults([]);
  };

  return (
    <Layout>
      <div className="space-y-12 pb-24">
        {/* Hero Section */}
        <section className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest mb-2 shadow-sm uppercase">
            <Sparkles size={12} />
            <span>AI Multi-Source Batching</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter">
            One Sheet, <span className="text-blue-600">All Data.</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Combine files, screenshots, and camera snaps into a single queue. We extract everything into one unified 6-column Excel file.
          </p>
        </section>

        {/* Error Alert */}
        {error && (
          <div className="max-w-3xl mx-auto bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="shrink-0 text-red-500" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Multi-Source Uploader */}
        <Uploader onProcess={handleProcessBatch} isLoading={isProcessing} />

        {/* Results / Preview Component */}
        {results.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Layers size={16} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Consolidated Batch</h2>
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{results.length} Records</span>
            </div>
            <DataPreview 
              results={results} 
              onRemove={removeResult} 
              onClearAll={clearAllResults} 
            />
          </div>
        )}
        
        {/* Empty State / Benefits */}
        {results.length === 0 && !isProcessing && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-gray-100">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-white shadow-md border border-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-2 text-blue-600">
                <Sparkles size={24} />
              </div>
              <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest text-center">AI Extraction</h3>
              <p className="text-sm text-gray-400 font-medium leading-snug">Gemini AI reads every field from your GDMS forms with high precision.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-white shadow-md border border-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-2 text-green-600">
                <FileSpreadsheet size={24} />
              </div>
              <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest text-center">Single Excel</h3>
              <p className="text-sm text-gray-400 font-medium leading-snug">No matter the source, all data is appended into one master spreadsheet.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-white shadow-md border border-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-2 text-orange-500">
                <Layers size={24} />
              </div>
              <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest text-center">6-Column Grid</h3>
              <p className="text-sm text-gray-400 font-medium leading-snug">Formatted in 3-pair rows for readability while maintaining 6 fixed columns.</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
