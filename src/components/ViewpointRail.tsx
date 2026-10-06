import React from 'react';
import { motion } from 'framer-motion';
import { useCalloutStore } from '../store/useCalloutStore';
import { VIEWPOINTS } from '../data/viewpoints';

export const ViewpointRail: React.FC = () => {
  const { viewpointIndex, scrollToViewpoint } = useCalloutStore();

  const handlePrev = () => {
    const prev = (viewpointIndex - 1 + VIEWPOINTS.length) % VIEWPOINTS.length;
    scrollToViewpoint(prev);
  };

  const handleNext = () => {
    const next = (viewpointIndex + 1) % VIEWPOINTS.length;
    scrollToViewpoint(next);
  };

  return (
    <div className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center select-none pointer-events-auto">
      {/* Top indicator caption */}
      <span className="text-[9px] font-mono tracking-[0.25em] text-text-secondary uppercase rotate-180 [writing-mode:vertical-lr] mb-4">
        PERSPECTIVE
      </span>

      {/* Viewpoint Rail Container */}
      <div className="relative flex flex-col items-center justify-between h-36 py-2">
        {/* Background Vertical Line */}
        <div className="absolute top-0 bottom-0 w-[1px] bg-[rgba(17,23,25,0.16)]" />

        {/* Viewpoint Dots */}
        {VIEWPOINTS.map((vp) => {
          const isActive = viewpointIndex === vp.id;
          return (
            <button
              key={vp.id}
              onClick={() => scrollToViewpoint(vp.id)}
              title={vp.name}
              className="relative z-10 flex items-center justify-center group py-1"
            >
              {/* Dot marker */}
              <motion.div
                animate={{
                  scale: isActive ? 1.4 : 1,
                  backgroundColor: isActive ? '#00A99D' : 'rgba(17, 23, 25, 0.22)',
                  boxShadow: isActive ? '0 0 10px rgba(43, 231, 214, 0.30)' : 'none',
                }}
                transition={{ duration: 0.3 }}
                className="w-2 h-2 rounded-full cursor-pointer transition-all duration-200 group-hover:bg-text-primary"
              />

              {/* Tooltip on hover */}
              <div className="absolute left-6 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap bg-bg-panel/95 border border-[rgba(17,23,25,0.12)] px-2.5 py-1 rounded text-[10px] font-mono tracking-widest text-text-primary shadow-lg">
                <span className="text-accent-teal font-bold mr-1">0{vp.id + 1}</span>
                {vp.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation Arrows Below the Rail */}
      <div className="flex flex-col items-center space-y-2 mt-4">
        {/* Previous Viewpoint Button */}
        <button
          onClick={handlePrev}
          title="Previous viewpoint"
          className="w-7 h-7 rounded-full flex items-center justify-center border border-[rgba(17,23,25,0.14)] bg-text-primary/5 text-text-secondary hover:text-accent-teal hover:border-accent-teal/40 hover:bg-text-primary/10 transition-all duration-200 active:scale-95"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Next Viewpoint Button */}
        <button
          onClick={handleNext}
          title="Next viewpoint"
          className="w-7 h-7 rounded-full flex items-center justify-center border border-[rgba(17,23,25,0.14)] bg-text-primary/5 text-text-secondary hover:text-accent-teal hover:border-accent-teal/40 hover:bg-text-primary/10 transition-all duration-200 active:scale-95"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};
