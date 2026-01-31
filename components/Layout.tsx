
import React from 'react';
import { FileSpreadsheet, Image as ImageIcon, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-blue-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
            <FileSpreadsheet className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">GDMS PRO</h1>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">AI Enterprise Extractor</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="hidden lg:flex gap-8 text-xs font-black uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              <ImageIcon size={14}/> 1. Upload
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14}/> 2. Verify
            </span>
            <span className="flex items-center gap-2">
              <FileSpreadsheet size={14}/> 3. Export
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200 hidden md:block mx-2"></div>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
            <HelpCircle size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-10 px-6 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <ShieldCheck className="text-blue-600" size={20} />
              <span>Enterprise Data Privacy</span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Images are processed in real-time and are not stored permanently on our servers. 
              Data is kept locally in your browser for your security.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end text-sm font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
          <p>© 2024 GDMS Utility - Optimized for Gemini 2.5/3.0</p>
          <div className="flex items-center gap-1">
            Developed by <span className="text-slate-900 font-bold">World-Class Engineering</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
