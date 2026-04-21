import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import CameraScreen from './screens/CameraScreen';

export type ScreenType = 'Home' | 'SignUp' | 'SignIn' | 'Welcome' | 'Camera';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('Home');
  const [username, setUsername] = useState<string>('');

  const navigate = (screen: ScreenType) => setCurrentScreen(screen);

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center font-sans tracking-tight text-slate-800">
      <div className="w-full h-screen sm:h-[850px] sm:max-h-screen sm:w-[400px] bg-white sm:border-x sm:border-slate-200 shadow-[0_2px_4px_rgba(0,0,0,0.1)] overflow-hidden relative flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {currentScreen === 'Home' && <HomeScreen onNavigate={navigate} />}
          {currentScreen === 'SignUp' && <SignUpScreen onNavigate={navigate} />}
          {currentScreen === 'SignIn' && <SignInScreen onNavigate={navigate} setUsername={setUsername} />}
          {currentScreen === 'Welcome' && <WelcomeScreen onNavigate={navigate} username={username} />}
          {currentScreen === 'Camera' && <CameraScreen onNavigate={navigate} />}
        </div>
      </div>
    </div>
  );
}
