import React from 'react';
import { useProgress } from '@react-three/drei';
import { motion } from 'framer-motion';

export const CanvasLoader: React.FC = () => {
  const { progress } = useProgress();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary select-none">
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2be7d6_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-8">
        {/* Mercedes 3-Point Star Logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          className="w-16 h-16 rounded-full border border-accent-teal/40 flex items-center justify-center mb-6 shadow-teal-glow"
        >
          <svg
            className="w-10 h-10 text-accent-teal"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          >
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="4" />
            <line x1="50" y1="50" x2="50" y2="8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <line x1="50" y1="50" x2="86.4" y2="71" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <line x1="50" y1="50" x2="13.6" y2="71" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </motion.div>

        {/* Title */}
        <h2 className="font-condensed font-black text-2xl tracking-wider text-text-primary uppercase mb-1">
          MERCEDES-AMG PETRONAS
        </h2>
        <span className="text-[11px] font-mono tracking-[0.25em] text-accent-teal font-bold uppercase mb-6">
          W14 E PERFORMANCE // TELEMETRY LINK
        </span>

        {/* Technical Progress Bar */}
        <div className="w-full h-1.5 bg-[rgba(17,23,25,0.10)] rounded-full overflow-hidden mb-3 relative">
          <motion.div
            className="h-full bg-accent-teal shadow-teal-glow"
            style={{ width: `${Math.max(5, progress)}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>

        {/* Diagnostic Status Readout */}
        <div className="flex items-center justify-between w-full text-[10px] font-mono text-text-secondary">
          <span>
            {progress < 40
              ? 'PARSING AERODYNAMIC MESHES...'
              : progress < 80
              ? 'CONFIGURING VENTURI GROUND EFFECT...'
              : 'CALIBRATING TELEMETRY SENSORS...'}
          </span>
          <span className="text-accent-teal font-bold">{progress.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};
