import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalloutStore } from '../store/useCalloutStore';
import { getCalloutCardPosition } from '../utils/calloutMath';

export const CalloutLabel: React.FC = () => {
  const { activeCallout, calloutScreenPos, calloutVisible } = useCalloutStore();

  if (!calloutVisible || !calloutScreenPos || !calloutScreenPos.visible) {
    return null;
  }

  const { targetX, targetY } = getCalloutCardPosition(
    calloutScreenPos.x,
    calloutScreenPos.y,
    window.innerWidth,
    window.innerHeight
  );

  return (
    <div
      className="fixed top-0 left-0 z-30 pointer-events-none"
      style={{
        transform: `translate3d(${targetX}px, ${targetY}px, 0)`,
        transition: 'transform 0.12s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCallout.id}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-[270px] glass-panel rounded-xl p-4 shadow-2xl border border-[rgba(17,23,25,0.12)] border-l-2 border-l-accent-teal pointer-events-auto backdrop-blur-xl"
        >
          {/* Card Header & Telemetry Index */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-mono tracking-widest text-accent-teal font-bold uppercase flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" />
              <span>DIAGNOSTIC TELEMETRY</span>
            </span>
            {activeCallout.stat && (
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[rgba(17,23,25,0.06)] text-text-primary border border-[rgba(17,23,25,0.10)] font-bold">
                {activeCallout.stat}
              </span>
            )}
          </div>

          {/* Main Label Title */}
          <h2 className="text-xs md:text-sm font-black font-sans tracking-f1-tracking uppercase text-text-primary leading-tight">
            {activeCallout.label}
          </h2>

          {activeCallout.sublabel && (
            <p className="text-[10px] font-mono tracking-widest text-text-secondary uppercase mt-0.5">
              {activeCallout.sublabel}
            </p>
          )}

          {/* Technical Description */}
          <p className="text-[11px] text-text-secondary leading-relaxed mt-2.5 border-t border-[rgba(17,23,25,0.10)] pt-2 font-normal">
            {activeCallout.description}
          </p>

          {/* Micro Telemetry Footer */}
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-[rgba(17,23,25,0.08)] text-[9px] font-mono">
            <span className="text-text-secondary uppercase">LIVE COMPONENT LOAD</span>
            <span className="text-accent-teal font-bold tracking-wider">
              {activeCallout.telemetryValue}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
