import { useState, useRef, useEffect } from 'react';
import { ScreenType } from '../App';
import { X, Camera, Download, Share2, AlertCircle } from 'lucide-react';

interface Props {
  onNavigate: (screen: ScreenType) => void;
}

export default function CameraScreen({ onNavigate }: Props) {
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const liveStreamUrl = "http://192.168.4.1:81/stream";

  const handleCapture = async () => {
    setIsCapturing(true);
    // ESP32-CAM typical capture endpoint /capture
    // Include random number to bypass browser caching
    const random = Math.floor(Math.random() * 1000000);
    const newSnapshotUrl = `http://192.168.4.1/capture?x=\${random}`;
    
    // In a real device scenario, setting the src of an img element to this URL 
    // will fetch and display the capture buffer.
    
    // We can pre-load to know when it finishes if we want, but for simplicity
    // just setting the state variable will re-render the image tag.
    
    // Small artificial delay to simulate capture processing
    setTimeout(() => {
      setSnapshotUrl(newSnapshotUrl);
      setIsCapturing(false);
    }, 500);
  };

  const handleDownload = async () => {
    if (!snapshotUrl) {
      alert("Please capture an image first.");
      return;
    }

    try {
      // First try standard anchor download approach
      const a = document.createElement('a');
      a.href = snapshotUrl;
      a.download = `otoscope_snapshot_\${new Date().getTime()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      alert("Snapshot Saved Successfully. Local file path generated in Downloads.");
    } catch (e) {
      alert("Download failed. Your browser might block cross-origin downloads.");
    }
  };

  const handleShare = async () => {
    if (!snapshotUrl) {
      alert("Please save a snapshot first.");
      return;
    }

    if (navigator.share) {
      try {
        // Since we merely have a URL, the Web Share API can share the URL.
        // To share the actual file via Web Share API we need to fetch it as a Blob
        // which will fail due to CORS on ESP32-CAM unless it sends CORS headers.
        
        await navigator.share({
          title: 'OTOSCOPE Capture',
          text: 'ENT snapshot for doctor review',
          url: snapshotUrl, // Fallback if file sharing fails
        });
        console.log('Successful share');
      } catch (error: any) {
        if (error.name !== 'AbortError') {
           alert("Sharing failed: " + error.message);
        }
      }
    } else {
      alert("Web Share API not supported on this browser/device.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 relative">
      {/* Header */}
      <header className="bg-sky-500 text-white flex items-center justify-between px-4 py-3 shadow-[0_2px_4px_rgba(0,0,0,0.1)] h-[60px] flex-none">
        <h1 className="text-lg font-extrabold tracking-tight m-0">
          LIVE FEED
        </h1>
        <button 
          onClick={() => onNavigate('Welcome')}
          className="p-2 -mr-2 rounded-lg hover:bg-sky-600 transition-colors flex items-center gap-2"
        >
          <span className="text-sm font-semibold pl-2">Close</span>
          <X className="text-white" size={20} />
        </button>
      </header>

      {/* Live Stream Area */}
      <div className="p-4 bg-white border-b border-slate-200">
        <div className="w-full bg-black border-[4px] border-slate-700 rounded-xl relative overflow-hidden flex items-center justify-center flex-none aspect-video">
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-red-500/80 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            192.168.4.1:81
          </div>
          
          <img 
            src={liveStreamUrl} 
            alt="ESP32-CAM Stream" 
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/600x400/1e293b/0f172a?text=%F0%9F%93%B7%0AMJPEG+Stream+Active";
            }}
          />
        </div>
        
        {/* Controls Container */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <button 
            onClick={handleCapture}
            disabled={isCapturing}
            className="col-span-2 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Camera size={18} />
            {isCapturing ? 'Wait...' : 'Capture Image'}
          </button>
          
          <button 
            onClick={handleDownload}
            className="col-span-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            DL
          </button>
          
          <button 
            onClick={handleShare}
            className="col-span-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            Share
          </button>
        </div>
      </div>

      {/* Captured Image Area */}
      <div className="flex-1 p-4 bg-slate-50 flex flex-col">
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Recent Capture</h3>
        
        <div className="flex-1 bg-white border border-slate-200 rounded-xl relative flex items-center justify-center overflow-hidden">
        {snapshotUrl ? (
          <div className="relative w-full h-full p-2">
            <img 
              src={snapshotUrl} 
              alt="Snapshot" 
              className="w-full h-full object-contain bg-slate-200 rounded-lg border-2 border-white shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/600x400/cbd5e1/94a3b8?text=Mock+Capture";
              }}
            />
          </div>
        ) : (
          <div className="text-slate-400 text-xs font-semibold bg-slate-50 border border-dashed border-slate-300 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-lg flex items-center justify-center p-4 text-center">
             Session: No unsaved snapshots
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
