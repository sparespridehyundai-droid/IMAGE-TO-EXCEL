
import React from 'react';
import { FileSpreadsheet, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileSpreadsheet className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">GDMS 2.0 AI Extractor</h1>
            <p className="text-xs text-gray-500 font-medium">Image to Excel Converter</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <span className="flex items-center gap-1.5 text-blue-600"><ImageIcon size={16}/> Upload</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16}/> Extract</span>
            <span className="flex items-center gap-1.5"><FileSpreadsheet size={16}/> Export</span>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {children}
      </main>
      <footer className="bg-gray-100 border-t border-gray-200 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2024 GDMS Utility - Powered by Gemini AI</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
