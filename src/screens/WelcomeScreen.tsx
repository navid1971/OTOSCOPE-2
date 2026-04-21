import { useState } from 'react';
import { ScreenType } from '../App';
import { LogOut, Wifi, Camera as CameraIcon, AlertTriangle } from 'lucide-react';

interface Props {
  onNavigate: (screen: ScreenType) => void;
  username: string;
}

export default function WelcomeScreen({ onNavigate, username }: Props) {
  const [status, setStatus] = useState('Not connected');
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [simulateConnection, setSimulateConnection] = useState(false); // Helps testing in HTTPS environments
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsChecking(true);
    setStatus('Checking connection...');
    setConnectionError(null);
    
    if (simulateConnection) {
      setTimeout(() => {
        setIsConnected(true);
        setStatus('Device is ready for capture and live video');
        setIsChecking(false);
      }, 1000);
      return;
    }

    // Try an Image ping, which has slightly better behavior than fetch for edge cases.
    const img = new Image();
    let timeoutId: any;

    img.onload = () => {
      clearTimeout(timeoutId);
      setIsConnected(true);
      setStatus('Device is ready for capture and live video');
      setConnectionError(null);
      setIsChecking(false);
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      if (window.location.protocol === 'https:') {
         setIsConnected(true);
         setStatus('Ping bypassed (HTTPS connection)');
         setConnectionError('Browser security blocked the ping due to HTTPS. If the camera breaks, click the Padlock icon in your URL bar > Site Settings > Allow Insecure Content.');
      } else {
         setIsConnected(false);
         setStatus('Connection failed.');
         setConnectionError('Ensure you are connected to the correct ESP32 Wi-Fi network.');
      }
      setIsChecking(false);
    };

    img.src = `http://192.168.4.1/favicon.ico?x=\${Math.floor(Math.random() * 1000000)}`;

    timeoutId = setTimeout(() => {
      img.src = '';
      img.onerror = null;
      img.onload = null;
      if (window.location.protocol === 'https:') {
         setIsConnected(true);
         setStatus('Ping bypassed (HTTPS connection)');
         setConnectionError('Browser security blocked the ping due to HTTPS. If the camera breaks, click the Padlock icon in your URL bar > Site Settings > Allow Insecure Content.');
      } else {
         setIsConnected(false);
         setStatus('Connection timed out.');
         setConnectionError('Ensure you are successfully connected to the ESP Wi-Fi network (192.168.4.1).');
      }
      setIsChecking(false);
    }, 4000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-sky-500 text-white flex items-center justify-between px-6 py-4 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <h1 className="text-xl font-extrabold tracking-tight truncate pr-4 m-0">
          OTOSCOPE <span className="font-light text-sm opacity-80 mx-2">•</span> {username}
        </h1>
        <button 
          onClick={() => onNavigate('Home')}
          className="p-2 -mr-2 rounded-lg text-white hover:bg-sky-600 transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </header>

      <div className="flex-1 p-6 flex flex-col gap-8 justify-center items-center text-center">
        
        <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 \${isConnected ? 'border-green-500 bg-green-50 text-green-600' : 'border-slate-200 bg-white text-slate-400'} transition-all duration-300`}>
          <Wifi size={48} className={isChecking ? "animate-pulse" : ""} />
        </div>

        <div className="flex flex-col gap-2 relative">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Hardware Status</p>
          {isConnected && !status.includes('bypassed') ? (
            <div className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 mx-auto">
              <div className="w-2 h-2 rounded-full bg-green-500"></div> DEVICE READY: 192.168.4.1
            </div>
          ) : (
            <p className={`text-lg font-medium \${status.includes('failed') ? 'text-red-500' : (status.includes('bypassed') ? 'text-amber-500' : 'text-slate-800')}`}>
              {status}
            </p>
          )}
          {connectionError && (
            <div className={`mt-2 text-xs border p-3 rounded-lg flex items-start gap-2 text-left \${status.includes('bypassed') ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-red-600 bg-red-50 border-red-100'}`}>
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <p>{connectionError}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full mt-auto">
          <button 
            onClick={handleConnect}
            disabled={isChecking}
            className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold text-sm transition-all disabled:opacity-70"
          >
            {isChecking ? 'Connecting...' : 'Connect to Device'}
          </button>

          <label className="flex items-center gap-2 justify-center text-xs font-medium text-slate-500 cursor-pointer">
            <input 
              type="checkbox" 
              checked={simulateConnection}
              onChange={(e) => setSimulateConnection(e.target.checked)}
              className="rounded text-sky-500 focus:ring-sky-500"
            />
            Simulate Connection (Demo Mode)
          </label>

          {isConnected && (
            <button 
              onClick={() => onNavigate('Camera')}
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              <CameraIcon size={18} />
              Open Camera
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
