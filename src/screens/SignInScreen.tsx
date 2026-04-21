import { useState } from 'react';
import { ScreenType } from '../App';
import { ArrowLeft, User, Lock } from 'lucide-react';

interface Props {
  onNavigate: (screen: ScreenType) => void;
  setUsername: (username: string) => void;
}

export default function SignInScreen({ onNavigate, setUsername }: Props) {
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  const handleLogin = () => {
    if (!inputUsername.trim() || !inputPassword.trim()) {
      alert('Please fill out both fields.');
      return;
    }

    const storedUsersInfo = localStorage.getItem('otoscope_users');
    const users = storedUsersInfo ? JSON.parse(storedUsersInfo) : {};

    const dbPassword = users[inputUsername.toLowerCase()];
    if (!dbPassword) {
      alert('Account Not Found. Please Sign Up First.');
      return;
    }

    if (dbPassword !== inputPassword) {
      alert('Wrong Password.');
      return;
    }

    setUsername(inputUsername);
    onNavigate('Welcome');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="flex items-center p-4 bg-sky-500 text-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => onNavigate('Home')}
          className="p-2 -ml-2 rounded-lg hover:bg-sky-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="ml-2 text-lg font-bold">Sign In</h2>
      </header>

      <div className="p-6 flex flex-col gap-6 mt-4">
        <div className="flex flex-col gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-slate-50 text-slate-800 focus:bg-white"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 mt-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-slate-50 text-slate-800 focus:bg-white"
                placeholder="Enter your password"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogin}
          className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold text-sm transition-all shadow-sm"
        >
          Login
        </button>
      </div>
    </div>
  );
}
