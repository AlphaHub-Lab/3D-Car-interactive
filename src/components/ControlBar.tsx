import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCalloutStore } from '../store/useCalloutStore';

export const ControlBar: React.FC = () => {
  const {
    scrollProgress,
    isAutoCruising,
    toggleAutoCruising,
    activeCallout,
    setStatScreenPos,
  } = useCalloutStore();

  const statRef = useRef<HTMLDivElement>(null);

  // Measure stat readout position for the diagonal SVG leader line
  useEffect(() => {
    const updateStatPos = () => {
      if (statRef.current) {
        const rect = statRef.current.getBoundingClientRect();
        setStatScreenPos({
          x: rect.left,
          y: rect.top + rect.height / 2,
        });
      }
    };

    updateStatPos();
    window.addEventListener('resize', updateStatPos);
    return () => window.removeEventListener('resize', updateStatPos);
  }, [setStatScreenPos]);

  // Handle scrubber drag / change -> scrub window scroll position directly
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0) {
      window.scrollTo({
        top: val * maxScroll,
        behavior: 'auto',
      });
    }
  };

  // Determine stage caption based on scrollProgress
  let stageNumber = '01';
  let stageName = 'HERO OVERVIEW';
  if (scrollProgress < 0.14) {
    stageNumber = '01';
    stageName = 'HERO OVERVIEW';
  } else if (scrollProgress < 0.30) {
    stageNumber = '02';
    stageName = 'FRONT WING';
  } else if (scrollProgress < 0.48) {
    stageNumber = '03';
    stageName = 'PUSH-ROD SUSPENSION';
  } else if (scrollProgress < 0.64) {
    stageNumber = '04';
    stageName = 'COCKPIT & HALO';
  } else if (scrollProgress < 0.78) {
    stageNumber = '05';
    stageName = 'REAR WING DRS';
  } else if (scrollProgress < 0.90) {
    stageNumber = '06';
    stageName = 'GROUND EFFECT DIFFUSER';
  } else {
    stageNumber = '06';
    stageName = 'FULL VEHICLE REVEAL';
  }

  const scrollPercentage = Math.round(scrollProgress * 100);

  return (
    <footer className="fixed bottom-6 left-0 right-0 z-30 px-6 md:px-12 flex items-center justify-between pointer-events-none select-none">
      {/* Left: Play/Pause Auto-Cruise Button & Scroll Stage Caption */}
      <div className="flex items-center space-x-3.5 pointer-events-auto">
        <button
          onClick={toggleAutoCruising}
          title={isAutoCruising ? 'Pause auto-cruise' : 'Start auto-cruise preview'}
          className="w-8 h-8 rounded-full border border-[rgba(17,23,25,0.14)] bg-text-primary/5 hover:border-accent-teal hover:bg-text-primary/10 flex items-center justify-center text-text-primary transition-all duration-200 active:scale-90"
        >
          {isAutoCruising ? (
            // Pause icon
            <svg className="w-3.5 h-3.5 text-accent-teal" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            // Play icon
            <svg className="w-3.5 h-3.5 text-text-primary ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        <div className="flex flex-col">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider text-text-primary">
            <span className="text-accent-teal font-bold">
              {stageNumber} / 06
            </span>
            <span className="text-text-secondary/40">·</span>
            <span className="text-text-primary font-bold uppercase tracking-wider">
              {stageName}
            </span>
          </div>
          <span className="text-[9px] font-mono text-text-secondary tracking-widest uppercase">
            {isAutoCruising ? 'AUTO CRUISE PREVIEW' : 'SCROLL DRIVEN'} · {scrollPercentage}%
          </span>
        </div>
      </div>

      {/* Center: Horizontal Scrubber Track (0 -> 100% scroll progress) */}
      <div className="hidden sm:flex flex-col items-center pointer-events-auto">
        <div className="flex items-center justify-between w-48 md:w-64 mb-1 text-[9px] font-mono text-text-secondary tracking-widest uppercase">
          <span>0%</span>
          <span className="text-accent-teal font-semibold">{scrollPercentage}%</span>
          <span>100%</span>
        </div>

        <div className="relative w-48 md:w-64 flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={scrollProgress}
            onChange={handleScrubberChange}
            className="w-full h-2 bg-[rgba(17,23,25,0.16)] rounded-full appearance-none cursor-pointer focus:outline-none"
          />
        </div>
      </div>

      {/* Right: Live Numeric Telemetry Readout (Connected to highlighted part) */}
      <div
        ref={statRef}
        className="glass-panel-subtle rounded-lg px-4 py-2 border border-[rgba(17,23,25,0.10)] flex items-center space-x-3 pointer-events-auto"
      >
        <div className="w-1.5 h-6 bg-accent-teal rounded-full shadow-teal-sm animate-pulse" />
        
        <div className="flex flex-col text-right">
          <div className="flex items-center space-x-2 justify-end">
            <span className="text-[9px] font-mono tracking-widest text-text-secondary uppercase">
              {activeCallout.telemetryUnit}
            </span>
          </div>

          <motion.div
            key={activeCallout.telemetryValue}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono font-bold text-lg md:text-xl text-text-primary tracking-wider flex items-center justify-end space-x-1"
          >
            <span className="text-accent-teal drop-shadow-[0_0_8px_rgba(0,169,157,0.4)]">
              {activeCallout.telemetryValue}
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
