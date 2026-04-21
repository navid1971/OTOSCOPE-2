import { ScreenType } from '../App';
import { Stethoscope } from 'lucide-react';

interface Props {
  onNavigate: (screen: ScreenType) => void;
}

export default function HomeScreen({ onNavigate }: Props) {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-sky-500 text-white flex items-center justify-between px-6 py-4 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <h1 className="text-2xl font-extrabold tracking-tight m-0">
          OTOSCOPE <span className="font-light text-sm opacity-80 ml-2">v1.0.4-PRO</span>
        </h1>
      </header>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex flex-col gap-6 w-full mt-auto">
          <div>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Project Credits</h3>
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-xs text-slate-600 font-medium leading-relaxed">
              <p className="font-semibold text-slate-800 mb-2">Design & Engineering</p>
              <p>1. Md. Azraful Islam Khan</p>
              <p>2. Jasim Uddin</p>
              <p className="mt-1 text-slate-400 italic">Department of Biomedical Engineering</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => onNavigate('SignUp')}
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold text-sm transition-all shadow-sm"
            >
              Sign Up
            </button>
            <button 
              onClick={() => onNavigate('SignIn')}
              className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold text-sm transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
