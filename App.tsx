
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Uploader } from './components/Uploader';
import { DataPreview } from './components/DataPreview';
import { extractRepairOrderData } from './services/geminiService';
import { RepairOrderData } from './types';
import { AlertCircle, FileSpreadsheet, Sparkles, Layers, Info, History } from 'lucide-react';

interface ProcessedResult {
  id: string;
  data: RepairOrderData;
  thumbnail: string;
  verified?: boolean;
}

const STORAGE_KEY = 'gdms_extractor_batch_v1';

const App: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load from Persistence
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setResults(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved results", e);
      }
    }
  }, []);

  // Save to Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  }, [results]);

  const handleProcessBatch = async (base64Array: string[]) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const newResults: ProcessedResult[] = [];
      
      for (const base64 of base64Array) {
        try {
          const data = await extractRepairOrderData(base64);
          newResults.push({
            id: Math.random().toString(36).substr(2, 9),
            data,
            thumbnail: base64,
            verified: false
          });
        } catch (err) {
          console.error("Extraction error for image", err);
        }
      }

      if (newResults.length === 0 && base64Array.length > 0) {
        throw new Error("Gemini AI couldn't read these images. Please ensure documents are bright, clear, and flat.");
      }

      setResults(prev => [...newResults, ...prev]);
    } catch (err: any) {
      setError(err.message || "A system error occurred. Please refresh and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeResult = (id: string) => {
    setResults(prev => prev.filter(r => r.id !== id));
  };

  const clearAllResults = () => {
    if (window.confirm("Are you sure you want to clear this entire batch? This action cannot be undone.")) {
      setResults([]);
    }
  };

  return (
    <Layout>
      <div className="space-y-12 pb-24 max-w-7xl mx-auto">
        {/* Pro Hero Section */}
        <section className="text-center space-y-6 pt-12 pb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-blue-600/10 text-blue-700 px-5 py-2 rounded-full text-[10px] font-black tracking-[0.2em] shadow-sm uppercase flex items-center gap-2">
              <Sparkles size={14} className="animate-pulse" />
              Next-Gen Document Intelligence
            </div>
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">
            Scale your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Workflow.</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Turn massive stacks of repair orders into structured data in seconds. 
            Automate your Excel entry with high-precision Vision AI.
          </p>
        </section>

        {/* Global Alerts */}
        {error && (
          <div className="max-w-4xl mx-auto bg-red-50 border-2 border-red-100 text-red-700 px-8 py-5 rounded-[2rem] flex items-center gap-6 animate-in zoom-in duration-300 shadow-xl shadow-red-100/50">
            <div className="bg-red-500 p-2 rounded-xl text-white">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="font-black uppercase text-xs tracking-widest mb-1">System Exception</p>
              <p className="text-sm font-bold opacity-80">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto font-black text-xs hover:underline">Dismiss</button>
          </div>
        )}

        {/* Multi-Source Uploader */}
        <div className="max-w-6xl mx-auto">
          <Uploader onProcess={handleProcessBatch} isLoading={isProcessing} />
        </div>

        {/* Dynamic Preview Section */}
        {results.length > 0 ? (
          <div className="max-w-[1400px] mx-auto space-y-8 mt-16 pt-16 border-t border-slate-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3 text-blue-600">
                  <Layers size={24} />
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Current Processing Queue</h2>
                </div>
                <p className="text-slate-500 font-medium ml-9">Review and verify each document before the final export.</p>
              </div>
              <div className="flex items-center gap-4 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
                <History className="text-slate-400 ml-2" size={18} />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Auto-Saved Locally</span>
              </div>
            </div>
            
            <DataPreview 
              results={results} 
              onRemove={removeResult} 
              onClearAll={clearAllResults}
              onUpdateResults={setResults}
            />
          </div>
        ) : !isProcessing && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pt-16 border-t border-slate-100 px-4">
            <div className="group space-y-4">
              <div className="w-16 h-16 bg-white shadow-xl shadow-slate-200/50 border border-slate-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 transition-transform group-hover:-translate-y-2">
                <Sparkles size={32} />
              </div>
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">1. Intelligence</h3>
              <p className="text-sm text-slate-400 font-semibold leading-relaxed">Gemini 3.0 Pro Vision analyzes forms with sub-millimeter precision, reading both typed and handwritten fields.</p>
            </div>
            <div className="group space-y-4">
              <div className="w-16 h-16 bg-white shadow-xl shadow-slate-200/50 border border-slate-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 transition-transform group-hover:-translate-y-2">
                <Info size={32} />
              </div>
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">2. Verification</h3>
              <p className="text-sm text-slate-400 font-semibold leading-relaxed">Our split-screen validator lets you cross-check extracted data against the original image for 100% data integrity.</p>
            </div>
            <div className="group space-y-4">
              <div className="w-16 h-16 bg-white shadow-xl shadow-slate-200/50 border border-slate-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 transition-transform group-hover:-translate-y-2">
                <FileSpreadsheet size={32} />
              </div>
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">3. Integration</h3>
              <p className="text-sm text-slate-400 font-semibold leading-relaxed">Export a master Excel file containing every detail from every form, perfectly formatted for your backend systems.</p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-white/60 backdrop-blur-xl z-[100] flex items-center justify-center animate-in fade-in duration-500">
            <div className="text-center space-y-8 max-w-sm px-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="text-blue-600 animate-pulse" size={24} />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Analyzing Batch...</h2>
                <p className="text-slate-500 font-bold leading-relaxed">
                  Our neural network is mapping every coordinate on your GDMS forms. This takes about 5-8 seconds per image.
                </p>
              </div>
              <div className="pt-4 flex justify-center gap-1.5">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
