import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCalloutStore } from '../store/useCalloutStore';
import { CAR_MODELS, CarModelData } from '../data/modelsData';

interface HeroTextProps {
  car?: CarModelData;
  isModelViewer?: boolean;
}

export const HeroText: React.FC<HeroTextProps> = ({ car, isModelViewer = false }) => {
  const { scrollProgress, scrollToNext, activeCallout, calloutVisible, activeCar } = useCalloutStore();
  const currentCar = car || activeCar || CAR_MODELS[0];

  // Dim slightly as user scrolls deep into component inspections, fade out at end
  const isScrolled = scrollProgress > 0.15;
  const isAtEnd = scrollProgress >= 0.92;

  // Split title for styling
  const nameWords = currentCar.name.split(' ');
  const mainBrand = nameWords.slice(0, 2).join(' ');
  const modelSpec = nameWords.slice(2).join(' ') || currentCar.shortName;

  // Other models for the 100% reveal recommendations
  const otherCars = CAR_MODELS.filter((c) => c.id !== currentCar.id);

  return (
    <>
      {/* 1. Default Top-Left Hero Header */}
      <div
        className={`fixed top-20 md:top-24 left-6 md:left-12 z-30 pointer-events-none select-none max-w-md transition-all duration-500 ${
          isAtEnd ? 'opacity-0 pointer-events-none' : isScrolled ? 'opacity-40 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <div className="relative p-3 -m-3 rounded-xl bg-gradient-to-r from-[#F4F6F5]/85 via-[#F4F6F5]/35 to-transparent backdrop-blur-[2px]">
          {/* Back link when viewing specific model */}
          {isModelViewer && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-2 pointer-events-auto"
            >
              <Link
                to="/models"
                className="inline-flex items-center space-x-1.5 text-[9px] font-mono font-bold tracking-widest text-accent-teal uppercase hover:underline"
              >
                <span>&larr; BACK TO FLEET</span>
              </Link>
            </motion.div>
          )}

          {/* Editorial Subtitle Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center space-x-2 text-[9px] md:text-[10px] font-mono font-semibold tracking-[0.22em] text-accent-teal uppercase mb-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" />
            <span>
              {currentCar.category.toUpperCase()} // {currentCar.code}
            </span>
          </motion.div>

          {/* Compact Editorial Title */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-condensed font-black text-xl sm:text-2xl md:text-3xl leading-[0.95] tracking-tight uppercase text-[#111719]"
          >
            <span>{mainBrand}</span>
            <br />
            <span className="bg-gradient-to-r from-[#111719] via-[#111719] to-[#5E686B] bg-clip-text text-transparent">
              {modelSpec}
            </span>
          </motion.h1>

          {/* Teal Scan Line + Dynamic Stage Caption */}
          <div className="mt-2.5 flex items-center space-x-2.5">
            <span className="text-accent-teal text-xs font-black font-mono leading-none">
              +
            </span>
            <div className="relative w-16 md:w-24 h-[1.5px] bg-accent-teal/30 overflow-hidden rounded-full">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-accent-teal to-transparent shadow-teal-glow"
              />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-[0.14em] text-accent-teal uppercase">
              {calloutVisible && activeCallout ? activeCallout.label : 'SCROLL TO EXPLORE'}
            </span>
          </div>

          {/* Action Button: NEXT INSPECTION > */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-3 flex items-center space-x-2.5 pointer-events-auto"
          >
            <button
              onClick={scrollToNext}
              className="group flex items-center space-x-1.5 px-3 py-1 rounded-full border border-[rgba(17,23,25,0.14)] bg-text-primary/5 hover:bg-text-primary/10 hover:border-accent-teal/50 transition-all duration-200 backdrop-blur-sm active:scale-95 cursor-pointer"
            >
              <span className="text-[10px] font-semibold tracking-widest text-text-secondary group-hover:text-text-primary uppercase">
                NEXT INSPECTION
              </span>
              <span className="text-[10px] text-accent-teal group-hover:translate-x-0.5 transition-transform">
                &gt;
              </span>
            </button>

            <span className="text-[9px] font-mono text-text-secondary tracking-wider">
              SCROLL ↓
            </span>
          </motion.div>
        </div>
      </div>

      {/* 2. 100% Scroll Reveal: "FOR MORE, EXPLORE OUR OTHER MODELS" */}
      <AnimatePresence>
        {isAtEnd && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-20 md:top-24 z-40 flex flex-col items-center justify-center text-center px-6 pointer-events-auto select-none max-w-4xl mx-auto"
          >
            <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-[0.25em] text-accent-teal uppercase mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" />
              <span>THE FLEET CONTINUES // 3D HIGH-PERFORMANCE ARCHIVE</span>
            </div>

            <h2 className="font-condensed font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#151A1C] max-w-3xl leading-[0.95]">
              FOR MORE, EXPLORE OUR{' '}
              <span className="bg-gradient-to-r from-accent-teal via-[#2BE7D6] to-accent-teal bg-clip-text text-transparent">
                OTHER MODELS
              </span>
            </h2>

            <p className="text-[11px] sm:text-xs text-[#5E686B] max-w-xl mt-2 font-normal leading-relaxed">
              Experience all 7 vehicles in our championship fleet with real-time aerodynamics, telemetry diagnostics, and full interactive 3D scroll animations.
            </p>

            {/* Quick Switcher Carousel Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-2xl">
              {otherCars.map((c) => (
                <Link
                  key={c.id}
                  to={`/models/${c.id}`}
                  className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-accent-teal hover:text-white text-[#111719] border border-[rgba(17,23,25,0.12)] text-[10px] font-mono font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow-teal-sm active:scale-95"
                >
                  {c.shortName}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-3 mt-5">
              <Link
                to="/models"
                className="group px-6 py-2.5 rounded-full bg-[#151A1C] hover:bg-[#00A99D] text-white font-bold text-xs tracking-[0.14em] uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(21,26,28,0.20)] hover:shadow-teal-glow flex items-center space-x-2 active:scale-95"
              >
                <span>EXPLORE ALL 7 MODELS</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
              <Link
                to="/performance"
                className="px-5 py-2.5 rounded-full border border-[rgba(17,23,25,0.16)] bg-white/70 hover:bg-white text-[#111719] font-bold text-xs tracking-[0.12em] uppercase transition-all duration-300 backdrop-blur-sm shadow-sm active:scale-95"
              >
                PERFORMANCE RADAR
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
