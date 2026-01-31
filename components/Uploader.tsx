
import React, { useRef, useState, useEffect } from 'react';
import { Upload, Loader2, Files, Clipboard, Camera, Monitor, X, Plus, Sparkles } from 'lucide-react';

interface UploaderProps {
  onProcess: (base64Array: string[]) => void;
  isLoading: boolean;
}

export const Uploader: React.FC<UploaderProps> = ({ onProcess, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stagedImages, setStagedImages] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Handle Paste Events
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isLoading) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setStagedImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setStagedImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const captureScreen = async () => {
    try {
      const captureStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = captureStream;
      video.onloadedmetadata = () => {
        video.play();
        setTimeout(() => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0);
          const base64 = canvas.toDataURL('image/png');
          setStagedImages(prev => [...prev, base64]);
          captureStream.getTracks().forEach(track => track.stop());
        }, 500);
      };
    } catch (err) {
      console.error("Screen capture failed", err);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setShowCamera(true);
    } catch (err) {
      alert("Camera error: " + err);
    }
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      setStagedImages(prev => [...prev, canvas.toDataURL('image/png')]);
      stopCamera();
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
    setShowCamera(false);
  };

  const removeStaged = (index: number) => {
    setStagedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcessAll = () => {
    if (stagedImages.length > 0) {
      onProcess(stagedImages);
      setStagedImages([]);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {showCamera ? (
        <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl h-[400px] animate-in zoom-in duration-300">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-6 inset-x-0 flex justify-center gap-4">
            <button onClick={takePhoto} className="bg-white text-black px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform">Take Snapshot</button>
            <button onClick={stopCamera} className="bg-red-500 text-white px-8 py-3 rounded-full font-bold shadow-xl">Close</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Action Buttons Area */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-1">Source Options</h3>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-full flex items-center gap-3 bg-blue-50 text-blue-700 p-4 rounded-2xl font-bold hover:bg-blue-100 transition-all group"
              >
                <Files className="group-hover:scale-110 transition-transform" />
                <span>Upload Files</span>
                <span className="ml-auto text-[10px] bg-blue-200/50 px-2 py-1 rounded-md">MULTI</span>
              </button>
              
              <button 
                onClick={captureScreen}
                disabled={isLoading}
                className="w-full flex items-center gap-3 bg-gray-50 text-gray-700 p-4 rounded-2xl font-bold hover:bg-gray-100 transition-all group"
              >
                <Monitor className="group-hover:scale-110 transition-transform" />
                <span>Screen Capture</span>
              </button>

              <button 
                onClick={startCamera}
                disabled={isLoading}
                className="w-full flex items-center gap-3 bg-gray-50 text-gray-700 p-4 rounded-2xl font-bold hover:bg-gray-100 transition-all group"
              >
                <Camera className="group-hover:scale-110 transition-transform" />
                <span>Use Camera</span>
              </button>

              <div className="pt-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200">
                  <Clipboard size={14} className="text-gray-400" />
                  <span>Tip: Press Ctrl+V to paste</span>
                </div>
              </div>
            </div>

            {stagedImages.length > 0 && (
              <button 
                onClick={handleProcessAll}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white p-5 rounded-3xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {isLoading ? 'Processing...' : `Process ${stagedImages.length} Image${stagedImages.length > 1 ? 's' : ''}`}
              </button>
            )}
          </div>

          {/* Staging Gallery Area */}
          <div className="lg:col-span-8">
            <div className={`
              h-full min-h-[300px] rounded-3xl border-2 border-dashed transition-all flex flex-col
              ${stagedImages.length > 0 ? 'bg-white border-blue-200' : 'bg-gray-50 border-gray-200 items-center justify-center'}
            `}>
              {stagedImages.length === 0 ? (
                <div className="text-center p-12">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <Plus className="text-gray-300" />
                  </div>
                  <p className="text-xl font-black text-gray-800 tracking-tight">Image Staging Area</p>
                  <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto mt-2">Add images from any source above. They will appear here before you start the AI extraction.</p>
                </div>
              ) : (
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-gray-800 text-lg">Batch Queue ({stagedImages.length})</h3>
                    <button onClick={() => setStagedImages([])} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg">Clear Queue</button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                    {stagedImages.map((img, idx) => (
                      <div key={idx} className="group relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <img src={img} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeStaged(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                          <X size={12} />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                          <span className="text-[10px] text-white font-bold">IMAGE #{idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <input 
        type="file" 
        className="hidden" 
        multiple
        accept="image/*" 
        onChange={handleFileChange}
        ref={fileInputRef}
      />
    </div>
  );
};
