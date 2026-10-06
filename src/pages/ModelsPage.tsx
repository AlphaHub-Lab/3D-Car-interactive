import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CAR_MODELS } from '../data/modelsData';
import { ModelCard3D } from '../components/ModelCard3D';

export const ModelsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredCars = useMemo(() => {
    if (selectedCategory === 'All') return CAR_MODELS;
    return CAR_MODELS.filter((car) => car.category === selectedCategory);
  }, [selectedCategory]);

  const categories = ['All', 'Formula 1', 'Hypercar', 'GT3 Racing', 'Supertruck'];

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[rgba(17,23,25,0.06)] border border-[rgba(17,23,25,0.10)] mb-3"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-teal uppercase">
            COMPLETE 3D PERFORMANCE FLEET DIRECTORY
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-condensed font-black text-4xl sm:text-6xl md:text-7xl uppercase text-[#151A1C] tracking-tight leading-[0.95]"
        >
          SELECT YOUR{' '}
          <span className="bg-gradient-to-r from-accent-teal via-[#2BE7D6] to-accent-teal bg-clip-text text-transparent">
            3D MACHINE
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-sm text-[#5E686B] mt-4 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Explore Formula 1 world-championship aerodynamics, 1,817 HP twin-turbo hypercars, FIA GT3 endurance homologations, and supercharged Baja trucks. Every machine features identical real-time scroll telemetry, PBR material inspection, and interactive 3D aerodynamic diagnostics.
        </motion.p>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-[#151A1C] text-white shadow-md'
                  : 'bg-white/80 border border-[rgba(17,23,25,0.10)] text-[#5E686B] hover:bg-white hover:text-[#151A1C]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCars.map((car, index) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * index, duration: 0.5 }}
            className="group glass-panel rounded-2xl p-6 flex flex-col justify-between border border-[rgba(17,23,25,0.12)] hover:border-accent-teal/60 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden"
          >
            {/* Top Badge & Year */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded bg-[rgba(17,23,25,0.06)] text-[#151A1C] text-[10px] font-mono font-bold tracking-widest border border-[rgba(17,23,25,0.10)] uppercase">
                  {car.category}
                </span>
                <span className="text-xs font-mono font-bold text-accent-teal">
                  {car.year} // {car.code}
                </span>
              </div>

              {/* 3D Interactive Card Canvas with auto-rotation */}
              <div className="mb-5 rounded-xl overflow-hidden border border-[rgba(17,23,25,0.08)] bg-white/50">
                <ModelCard3D
                  modelPath={car.modelPath}
                  scale={car.scale * 0.72}
                  rotationOffset={car.rotationOffset}
                />
              </div>

              {/* Model Title */}
              <h2 className="font-condensed font-black text-2xl uppercase text-[#151A1C] tracking-tight group-hover:text-accent-teal transition-colors leading-tight">
                {car.name}
              </h2>

              <p className="text-[11px] text-[#5E686B] font-mono uppercase tracking-wider mt-1 text-accent-teal font-semibold">
                {car.headline}
              </p>

              <p className="text-xs text-[#5E686B] mt-3 leading-relaxed">
                {car.description}
              </p>

              {/* Performance Key Specs Grid */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-[rgba(17,23,25,0.08)]">
                <div className="p-2.5 rounded-lg bg-white/60 border border-[rgba(17,23,25,0.06)]">
                  <span className="text-[9px] font-mono text-[#5E686B] block uppercase">TOP SPEED</span>
                  <span className="font-mono font-bold text-sm text-[#151A1C]">{car.performance.topSpeed}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/60 border border-[rgba(17,23,25,0.06)]">
                  <span className="text-[9px] font-mono text-[#5E686B] block uppercase">0-100 KM/H</span>
                  <span className="font-mono font-bold text-sm text-[#151A1C]">{car.performance.acceleration}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/60 border border-[rgba(17,23,25,0.06)]">
                  <span className="text-[9px] font-mono text-[#5E686B] block uppercase">HORSEPOWER</span>
                  <span className="font-mono font-bold text-sm text-[#00A99D]">{car.engine.horsepower}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/60 border border-[rgba(17,23,25,0.06)]">
                  <span className="text-[9px] font-mono text-[#5E686B] block uppercase">DOWNFORCE</span>
                  <span className="font-mono font-bold text-sm text-[#151A1C]">{car.performance.downforce}</span>
                </div>
              </div>

              {/* Highlights Pill Array */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {car.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/80 border border-[rgba(17,23,25,0.08)] text-[#5E686B]"
                  >
                    + {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="mt-8 pt-4 border-t border-[rgba(17,23,25,0.08)] flex flex-col space-y-2">
              <Link
                to={`/models/${car.id}`}
                className="w-full py-3 rounded-xl bg-[#151A1C] hover:bg-[#00A99D] text-white font-bold text-xs tracking-[0.14em] uppercase transition-all duration-300 shadow-md hover:shadow-teal-glow flex items-center justify-center space-x-2 text-center"
              >
                <span>LAUNCH 3D SHOWCASE</span>
                <span>&rarr;</span>
              </Link>
              <Link
                to="/technology"
                className="w-full py-2 rounded-xl border border-[rgba(17,23,25,0.12)] bg-white/50 hover:bg-white text-[#151A1C] font-semibold text-[11px] tracking-[0.12em] uppercase transition-all text-center"
              >
                VIEW ENGINE TECHNOLOGY
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ModelsPage;
