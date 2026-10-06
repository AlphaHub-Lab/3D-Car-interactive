import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ModelCard3D } from '../components/ModelCard3D';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine mode from route path or prop
  const isSignupPath = location.pathname === '/signup' || initialMode === 'signup';
  const [isLogin, setIsLogin] = useState<boolean>(!isSignupPath);

  useEffect(() => {
    setIsLogin(location.pathname !== '/signup');
  }, [location.pathname]);

  const [email, setEmail] = useState<string>('driver@mercedesamg.com');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [name, setName] = useState<string>('Lewis Hamilton');

  // Cinematic 4.5-second launch animation state
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [launchSpeed, setLaunchSpeed] = useState<number>(0);
  const [launchStage, setLaunchStage] = useState<string>('SYSTEM CHECK');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLaunching(true);

    // Timeline for the 4.5 second launch animation
    // 0 - 1.5s: Launch Control Staging
    setLaunchStage('LAUNCH CONTROL STAGED: 12,500 RPM');
    setLaunchSpeed(0);

    // 1.0s: Clutch Drop & Traction Acceleration
    const speedInterval = setInterval(() => {
      setLaunchSpeed((prev) => {
        if (prev >= 352) {
          clearInterval(speedInterval);
          return 352;
        }
        return prev + 12;
      });
    }, 100);

    setTimeout(() => {
      setLaunchStage('CLUTCH RELEASE // MAXIMUM HYBRID TORQUE DEPLOYED');
    }, 1400);

    setTimeout(() => {
      setLaunchStage('DRS OPEN // TERMINAL VELOCITY: 352 KM/H');
    }, 2800);

    setTimeout(() => {
      setLaunchStage('AUTHENTICATED // ENTERING MERCEDES-AMG PIT WALL');
    }, 4000);

    // Complete launch at 4.5 seconds and redirect to home
    setTimeout(() => {
      clearInterval(speedInterval);
      localStorage.setItem('amg_authenticated_user', JSON.stringify({ email, name: isLogin ? 'Lewis Hamilton' : name }));
      navigate('/');
    }, 4500);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 flex items-center justify-center relative overflow-hidden">
      {/* 4.5-Second Speed Launch Overlay */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#111719]/95 backdrop-blur-2xl text-white select-none overflow-hidden"
          >
            {/* Speed warp lines effect */}
            <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_80%)]" />
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-gradient-to-t from-transparent via-[#00A99D] to-white"
                  style={{
                    width: '2px',
                    height: `${120 + Math.random() * 200}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: ['-100%', '200%'],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.3 + Math.random() * 0.4,
                    ease: 'linear',
                  }}
                />
              ))}
            </div>

            {/* Launch Content */}
            <div className="relative z-10 text-center max-w-xl mx-auto px-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-accent-teal/80 flex items-center justify-center shadow-[0_0_30px_rgba(0,169,157,0.6)]"
              >
                <span className="w-4 h-4 rounded-full bg-accent-teal animate-ping" />
              </motion.div>

              <span className="text-xs font-mono font-bold tracking-[0.3em] text-accent-teal uppercase block mb-2">
                {launchStage}
              </span>

              <div className="flex items-baseline justify-center space-x-2 my-4">
                <motion.span
                  key={launchSpeed}
                  className="font-condensed font-black text-8xl sm:text-9xl tracking-tight text-white"
                >
                  {launchSpeed}
                </motion.span>
                <span className="font-mono text-xl text-accent-teal font-bold">KM/H</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-6 border border-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-teal via-[#2BE7D6] to-white"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4.5, ease: 'easeInOut' }}
                />
              </div>

              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                HOLD ON — LAUNCHING 3D COCKPIT EXPERIENCE...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Authentication Container */}
      <div className="w-full max-w-4xl glass-panel rounded-3xl p-6 sm:p-10 border border-[rgba(17,23,25,0.12)] shadow-2xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/90">
        {/* Left Column: Form (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-accent-teal uppercase">
                MERCEDES-AMG TELEMETRY ACCESS
              </span>
            </div>
            <h2 className="font-condensed font-black text-3xl sm:text-4xl uppercase text-[#151A1C]">
              {isLogin ? 'DRIVER LOGIN' : 'CREATE ACCOUNT'}
            </h2>
            <p className="text-xs text-[#5E686B] mt-1">
              {isLogin
                ? 'Sign in to access race telemetry, vehicle setups, and CAD digital twins.'
                : 'Join the Mercedes-AMG engineering community and unlock custom aerodynamics.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6 border border-[rgba(17,23,25,0.06)]">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                isLogin ? 'bg-white text-[#151A1C] shadow-sm' : 'text-[#5E686B] hover:text-[#151A1C]'
              }`}
            >
              LOG IN
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                !isLogin ? 'bg-white text-[#151A1C] shadow-sm' : 'text-[#5E686B] hover:text-[#151A1C]'
              }`}
            >
              SIGN UP
            </button>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-mono font-bold text-[#5E686B] uppercase mb-1">
                  FULL NAME / DRIVER CALLSIGN
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[rgba(17,23,25,0.12)] bg-white text-[#151A1C] text-sm focus:border-accent-teal focus:ring-1 focus:ring-accent-teal outline-none transition-colors font-medium"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono font-bold text-[#5E686B] uppercase mb-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[rgba(17,23,25,0.12)] bg-white text-[#151A1C] text-sm focus:border-accent-teal focus:ring-1 focus:ring-accent-teal outline-none transition-colors font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-mono font-bold text-[#5E686B] uppercase">
                  SECURITY KEY / PASSWORD
                </label>
                {isLogin && (
                  <a href="#reset" className="text-[10px] font-mono text-accent-teal hover:underline">
                    FORGOT KEY?
                  </a>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[rgba(17,23,25,0.12)] bg-white text-[#151A1C] text-sm focus:border-accent-teal focus:ring-1 focus:ring-accent-teal outline-none transition-colors font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#151A1C] hover:bg-accent-teal text-white font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-md hover:shadow-teal-glow cursor-pointer mt-4 flex items-center justify-center space-x-2"
            >
              <span>{isLogin ? 'ENGAGE LAUNCH & LOG IN' : 'REGISTER & LAUNCH'}</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#5E686B]">
            Protected by Mercedes-AMG High Performance Powertrains Telemetry Gateway.
          </div>
        </div>

        {/* Right Column: 3D Car Showcase (6 cols) */}
        <div className="lg:col-span-6 bg-gradient-to-b from-[#F4F6F5] to-[#E5EAE8] rounded-2xl p-6 border border-[rgba(17,23,25,0.08)] flex flex-col justify-between h-full min-h-[380px]">
          <div>
            <span className="text-[10px] font-mono font-bold text-accent-teal uppercase tracking-widest block mb-1">
              STANDBY VEHICLE // PIT BOX 1
            </span>
            <h3 className="font-condensed font-black text-2xl uppercase text-[#151A1C]">
              MERCEDES-AMG F1 W14
            </h3>
            <span className="text-xs text-[#5E686B]">Submitting credentials initiates speed launch sequence.</span>
          </div>

          {/* Micro 3D Viewport */}
          <div className="h-[240px] w-full relative my-2">
            <ModelCard3D modelPath="/models/mercedes_w14.glb" scaleFactor={3.2} />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#5E686B] border-t border-[rgba(17,23,25,0.08)] pt-3">
            <span>READY TO ACCELERATE</span>
            <span className="text-accent-teal font-bold">1,025 HP ON TAP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
