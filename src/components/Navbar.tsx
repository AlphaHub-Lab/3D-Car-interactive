import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const leftNav = [
    { label: 'MODELS', path: '/models' },
    { label: 'TECHNOLOGY', path: '/technology' },
    { label: 'EXPLORE', path: '/explore' },
    { label: 'PERFORMANCE', path: '/performance' },
  ];

  const rightNav = [
    { label: 'ABOUT', path: '/about' },
    { label: 'EXCHANGE', path: '/exchange' },
    { label: 'TELEMETRY', path: '/telemetry' },
    { label: 'LOG IN', path: '/login' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-20 px-6 md:px-12 flex items-center justify-between border-b border-[rgba(17,23,25,0.07)] bg-white/70 backdrop-blur-xl shadow-[0_1px_20px_rgba(17,23,25,0.03)] transition-all duration-300">
      {/* Brand Identity: Mercedes 3-Pointed Star & AMG wordmark */}
      <Link to="/" className="flex items-center space-x-4 group cursor-pointer select-none">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full border border-[rgba(17,23,25,0.12)] bg-gradient-to-b from-white to-[#E5EAE8] shadow-sm transition-all duration-300 group-hover:border-accent-teal/60 group-hover:shadow-[0_0_15px_rgba(0,169,157,0.25)]">
          {/* Mercedes 3-Pointed Star SVG */}
          <svg
            className="w-6 h-6 text-[#151A1C] transition-colors duration-300 group-hover:text-accent-teal"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
          >
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="4" />
            <line x1="50" y1="50" x2="50" y2="8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <line x1="50" y1="50" x2="86.4" y2="71" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <line x1="50" y1="50" x2="13.6" y2="71" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-condensed font-black tracking-wider text-xl text-[#151A1C] tracking-widest">
              ///AMG
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#00A99D]/10 text-[#00A99D] font-mono font-bold tracking-widest border border-[#00A99D]/20">
              PETRONAS
            </span>
          </div>
          <span className="text-[9px] tracking-[0.25em] text-[#5E686B] uppercase font-mono font-medium">
            Formula One Team
          </span>
        </div>
      </Link>

      {/* Center Nav Links - Hidden on Mobile */}
      <nav className="hidden lg:flex items-center space-x-8">
        {leftNav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs font-semibold tracking-[0.14em] transition-colors relative py-1 group uppercase ${
                isActive ? 'text-[#151A1C] font-bold' : 'text-[#5E686B] hover:text-[#111719]'
              }`}
            >
              {item.label}
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-[#00A99D] rounded-full transition-all duration-300 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Right Controls & CTA */}
      <div className="flex items-center space-x-6">
        <nav className="hidden xl:flex items-center space-x-6">
          {rightNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`text-xs font-semibold tracking-[0.14em] transition-colors py-1 group uppercase relative ${
                  isActive ? 'text-[#151A1C] font-bold' : 'text-[#5E686B] hover:text-[#111719]'
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#00A99D] rounded-full transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Explore More CTA - Carbon Pill with Petronas Teal Hover */}
        <Link to="/explore">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="relative px-5 py-2.5 rounded-full bg-[#151A1C] hover:bg-[#00A99D] text-white font-bold text-xs tracking-[0.12em] shadow-[0_4px_16px_rgba(21,26,28,0.18)] hover:shadow-teal-glow transition-all duration-300 flex items-center space-x-2 uppercase border border-[#151A1C]/20 cursor-pointer"
          >
            <span>EXPLORE MORE</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.button>
        </Link>
      </div>
    </header>
  );
};
