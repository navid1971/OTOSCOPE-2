import { useState } from 'react';
import { ScreenType } from '../App';
import { ArrowLeft, User, Lock } from 'lucide-react';

interface Props {
  onNavigate: (screen: ScreenType) => void;
}

export default function SignUpScreen({ onNavigate }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateAccount = () => {
    if (!username.trim() || !password.trim()) {
      alert('Please fill out both Username and Password fields.');
      return;
    }

    const storedUsersInfo = localStorage.getItem('otoscope_users');
    const users = storedUsersInfo ? JSON.parse(storedUsersInfo) : {};

    if (users[username.toLowerCase()]) {
      alert('Username already exists. Please choose a different one.');
      return;
    }

    users[username.toLowerCase()] = password;
    localStorage.setItem('otoscope_users', JSON.stringify(users));
    
    alert('Account created successfully!');
    onNavigate('Home');
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
        <h2 className="ml-2 text-lg font-bold">Sign Up</h2>
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-slate-50 text-slate-800 focus:bg-white"
                placeholder="Choose a username"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-slate-50 text-slate-800 focus:bg-white"
                placeholder="Create a password"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleCreateAccount}
          className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold text-sm transition-all shadow-sm"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
