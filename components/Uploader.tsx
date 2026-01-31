
import React, { useRef } from 'react';
import { Upload, Loader2, Files } from 'lucide-react';

interface UploaderProps {
  onUpload: (base64Array: string[]) => void;
  isLoading: boolean;
}

export const Uploader: React.FC<UploaderProps> = ({ onUpload, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const base64Promises = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      const base64s = await Promise.all(base64Promises);
      onUpload(base64s);
      
      // Clear input so same files can be uploaded again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative group">
        <label className={`
          flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-3xl bg-white transition-all cursor-pointer
          ${isLoading ? 'border-blue-200 cursor-not-allowed opacity-70' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/30'}
        `}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-10 text-center">
            {isLoading ? (
              <div className="flex flex-col items-center animate-pulse">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-xl font-bold text-gray-700">Analyzing Your Documents...</p>
                <p className="text-sm text-gray-500 mt-2">Gemini AI is reading and extracting data from all images</p>
              </div>
            ) : (
              <>
                <div className="p-5 bg-blue-50 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
                <p className="mb-2 text-2xl font-bold text-gray-800">Drop Images Here</p>
                <p className="text-sm text-gray-500 mb-6">Select one or multiple screenshots to convert them into a single Excel sheet.</p>
                <div className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200">
                  <Files size={18} />
                  Choose Files
                </div>
              </>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            multiple
            accept="image/*" 
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={isLoading}
          />
        </label>
      </div>
    </div>
  );
};
