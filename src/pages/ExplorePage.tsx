import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CAR_MODELS } from '../data/modelsData';
import { ModelCard3D } from '../components/ModelCard3D';

export const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Formula 1' | 'Hypercar' | 'GT3 Racing' | 'Supertruck'>('All');

  const filteredModels = useMemo(() => {
    return CAR_MODELS.filter((car) => {
      const matchesCategory = activeCategory === 'All' || car.category === activeCategory;
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        car.name.toLowerCase().includes(query) ||
        car.shortName.toLowerCase().includes(query) ||
        car.headline.toLowerCase().includes(query) ||
        car.description.toLowerCase().includes(query) ||
        car.engine.name.toLowerCase().includes(query) ||
        car.highlights.some((h) => h.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Search & Hero Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[rgba(17,23,25,0.06)] border border-[rgba(17,23,25,0.10)] mb-3"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-teal uppercase">
            3D AERODYNAMIC SEARCH & DISCOVERY
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-condensed font-black text-4xl sm:text-6xl md:text-7xl uppercase text-[#151A1C] tracking-tight leading-[0.95]"
        >
          EXPLORE THE{' '}
          <span className="bg-gradient-to-r from-accent-teal via-[#2BE7D6] to-accent-teal bg-clip-text text-transparent">
            ARCHIVES
          </span>
        </motion.h1>

        <p className="text-xs sm:text-sm text-[#5E686B] mt-4 max-w-lg mx-auto font-normal leading-relaxed">
          Search across chassis codes, world record lap times, powertrain configurations, and aerodynamic components.
        </p>

        {/* Search Bar Input */}
        <div className="mt-8 relative max-w-xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, engine, DAS, hybrid, top speed..."
              className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white border border-[rgba(17,23,25,0.14)] text-sm text-[#111719] placeholder-[#5E686B]/60 focus:outline-none focus:border-accent-teal focus:ring-4 focus:ring-accent-teal/15 transition-all shadow-sm"
            />
            {/* Search Icon */}
            <svg
              className="w-5 h-5 text-[#5E686B] absolute left-4 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-xs font-mono text-[#5E686B] hover:text-[#111719]"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {(['All', 'Formula 1', 'Hypercar', 'GT3 Racing', 'Supertruck'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                  activeCategory === cat
                    ? 'bg-[#151A1C] text-white shadow-md'
                    : 'bg-white/80 border border-[rgba(17,23,25,0.10)] text-[#5E686B] hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results Count */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-[rgba(17,23,25,0.08)]">
        <span className="text-xs font-mono font-bold text-[#5E686B] uppercase tracking-wider">
          SHOWING {filteredModels.length} OF {CAR_MODELS.length} 3D MODELS
        </span>
        <span className="text-[11px] font-mono text-accent-teal font-bold uppercase">
          REAL-TIME 3D RENDERING ACTIVE
        </span>
      </div>

      {/* Models Showcase Cards */}
      {filteredModels.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl p-8 max-w-md mx-auto">
          <p className="text-sm text-[#5E686B] font-mono">NO MODELS MATCHED YOUR SEARCH.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All');
            }}
            className="mt-4 px-5 py-2 rounded-full bg-[#151A1C] text-white text-xs font-bold uppercase"
          >
            RESET SEARCH
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModels.map((car, idx) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-[rgba(17,23,25,0.12)] hover:border-accent-teal/60 transition-all shadow-sm hover:shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[rgba(17,23,25,0.06)] text-[#151A1C] uppercase">
                    {car.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-accent-teal">
                    {car.year} // {car.code}
                  </span>
                </div>

                {/* 3D Preview */}
                <div className="rounded-xl overflow-hidden border border-[rgba(17,23,25,0.08)] mb-4 bg-white/50">
                  <ModelCard3D
                    modelPath={car.modelPath}
                    scale={car.scale * 0.72}
                    rotationOffset={car.rotationOffset}
                  />
                </div>

                <h3 className="font-condensed font-black text-2xl text-[#151A1C] uppercase tracking-tight group-hover:text-accent-teal transition-colors">
                  {car.name}
                </h3>

                <p className="text-xs text-[#5E686B] mt-2 line-clamp-2 leading-relaxed">
                  {car.description}
                </p>

                {/* Quick Spec Strip */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[rgba(17,23,25,0.08)] text-center">
                  <div className="p-2 rounded bg-white/70">
                    <span className="text-[8px] font-mono text-[#5E686B] block">TOP SPEED</span>
                    <span className="font-mono font-bold text-xs text-[#151A1C]">{car.performance.topSpeed}</span>
                  </div>
                  <div className="p-2 rounded bg-white/70">
                    <span className="text-[8px] font-mono text-[#5E686B] block">0-100</span>
                    <span className="font-mono font-bold text-xs text-[#151A1C]">{car.performance.acceleration}</span>
                  </div>
                  <div className="p-2 rounded bg-white/70">
                    <span className="text-[8px] font-mono text-[#5E686B] block">POWER</span>
                    <span className="font-mono font-bold text-xs text-accent-teal">{car.engine.horsepower.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[rgba(17,23,25,0.08)] flex items-center space-x-3">
                <Link
                  to={`/models/${car.id}`}
                  className="flex-1 py-2.5 rounded-xl bg-[#151A1C] hover:bg-[#00A99D] text-white text-xs font-bold tracking-wider uppercase text-center transition-colors shadow-sm"
                >
                  VIEW 3D MODEL &rarr;
                </Link>
                <Link
                  to="/performance"
                  className="p-2.5 rounded-xl border border-[rgba(17,23,25,0.12)] bg-white/80 hover:bg-white text-xs font-bold text-[#151A1C] uppercase"
                  title="Compare Performance"
                >
                  STATS
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Featured Categorical Curations */}
      <div className="mt-20 pt-12 border-t border-[rgba(17,23,25,0.10)]">
        <h3 className="font-condensed font-black text-3xl uppercase text-[#151A1C] tracking-tight mb-8">
          CURATED MOTORSPORT BENCHMARKS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl glass-panel border border-[rgba(17,23,25,0.12)] flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono text-accent-teal font-bold tracking-widest uppercase block mb-1">
                HISTORIC RECORD // MONZA 264.362 KM/H
              </span>
              <h4 className="font-condensed font-black text-2xl text-[#151A1C] uppercase">
                THE FASTEST F1 LAP EVER RECORDED
              </h4>
              <p className="text-xs text-[#5E686B] mt-2 leading-relaxed">
                Lewis Hamilton’s 2020 Italian Grand Prix pole lap in the Mercedes-AMG F1 W11 stands as the fastest average speed lap in 74 years of Formula 1 World Championship history.
              </p>
            </div>
            <Link
              to="/models/w11"
              className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-accent-teal uppercase hover:underline mt-4"
            >
              <span>EXPLORE F1 W11 3D MODEL</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-[rgba(17,23,25,0.12)] flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono text-accent-teal font-bold tracking-widest uppercase block mb-1">
                GREEN HELL RECORD // 6:30.705 MIN
              </span>
              <h4 className="font-condensed font-black text-2xl text-[#151A1C] uppercase">
                NÜRBURGRING PRODUCTION CAR KING
              </h4>
              <p className="text-xs text-[#5E686B] mt-2 leading-relaxed">
                Equipped with active aerodynamics, DRS, and an actual Mercedes-AMG Formula 1 V6 Turbo Hybrid power unit, the AMG ONE is the undisputed fastest street-legal production car on Earth.
              </p>
            </div>
            <Link
              to="/models/amg-one"
              className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-accent-teal uppercase hover:underline mt-4"
            >
              <span>EXPLORE AMG ONE 3D MODEL</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
