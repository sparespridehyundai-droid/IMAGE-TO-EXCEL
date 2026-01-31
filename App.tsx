
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Uploader } from './components/Uploader';
import { DataPreview } from './components/DataPreview';
import { extractRepairOrderData } from './services/geminiService';
import { RepairOrderData } from './types';
import { AlertCircle, FileText } from 'lucide-react';

interface ProcessedResult {
  id: string;
  data: RepairOrderData;
  thumbnail: string;
}

const App: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleBatchProcess = async (base64Array: string[]) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const newResults: ProcessedResult[] = [];
      
      // Process files one by one to avoid overwhelming the API rate limits
      // and to ensure better error handling per file.
      for (const base64 of base64Array) {
        try {
          const data = await extractRepairOrderData(base64);
          newResults.push({
            id: Math.random().toString(36).substr(2, 9),
            data,
            thumbnail: base64
          });
        } catch (err) {
          console.error("Error processing one of the files", err);
          // We continue with other files even if one fails
        }
      }

      if (newResults.length === 0 && base64Array.length > 0) {
        throw new Error("Could not extract data from any of the provided images. Please check image quality.");
      }

      setResults(prev => [...newResults, ...prev]);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during extraction.");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeResult = (id: string) => {
    setResults(prev => prev.filter(r => r.id !== id));
  };

  const clearAll = () => {
    setResults([]);
  };

  return (
    <Layout>
      <div className="space-y-10 pb-20">
        <section className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-bold mb-2">
            <FileText size={16} />
            <span>GDMS 2.0 AUTOMATION</span>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
            Image to <span className="text-blue-600">Smart Excel</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Batch process your repair order screenshots. Upload multiple images, and we'll organize them all into a perfectly formatted, single-sheet Excel workbook.
          </p>
        </section>

        {error && (
          <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4 animate-in fade-in duration-300">
            <AlertCircle className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <Uploader onUpload={handleBatchProcess} isLoading={isProcessing} />

        {results.length > 0 && (
          <DataPreview 
            results={results} 
            onRemove={removeResult} 
            onClearAll={clearAll} 
          />
        )}
        
        {results.length === 0 && !isProcessing && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 font-bold text-2xl">1</div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Select Multiple</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Choose all screenshots you want to process at once. Our AI handles the batch.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-5 font-bold text-2xl">2</div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">AI Vision</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Gemini scans every image, identifying RO Numbers, VINs, and financial data automatically.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 font-bold text-2xl">3</div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Unified Sheet</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Download one single Excel file containing data from all your images in perfect rows.</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
