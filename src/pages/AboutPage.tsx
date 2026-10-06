import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ModelCard3D } from '../components/ModelCard3D';

interface ComponentSpotlight {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  materials: string;
  tolerance: string;
  imageAlt: string;
}

const SPOTLIGHTS: ComponentSpotlight[] = [
  {
    id: 'chassis',
    name: 'Molded Carbon-Fiber Monocoque',
    subtitle: 'SAFETY CELL & SURVIVAL CELL',
    description:
      'Constructed with high-modulus carbon fiber layered with Nomex honeycomb core and Zylon ballistic intrusion panels, tested to withstand 250kN lateral crush forces and 45G deceleration impacts.',
    materials: 'High-Modulus Toray Carbon Fiber, Kevlar, Nomex Honeycomb, Titanium',
    tolerance: '±0.02 mm surface precision',
    imageAlt: 'Monocoque',
  },
  {
    id: 'aerodynamics',
    name: 'Ground Effect Venturi Underfloor',
    subtitle: 'DOWNFORCE GENERATION SYSTEM',
    description:
      'Engineered to produce over 60% of the total vehicle downforce without creating turbulent drag wake. Dual underfloor Venturi tunnels generate severe low-pressure suction under Bernoulli principles.',
    materials: 'Autoclaved Solid Carbon Laminate with Inconel heat shielding',
    tolerance: 'Aerodynamic deflection under 0.8 mm at 300 km/h',
    imageAlt: 'Venturi Diffuser',
  },
  {
    id: 'powertrain',
    name: 'Mercedes-AMG M14 E Performance Hybrid',
    subtitle: '1.6L V6 TURBOCHARGED PU',
    description:
      'Delivers unmatched thermal efficiency exceeding 50%. The split-turbocharger layout connects the compressor and turbine via a central shaft driven by a 125,000 RPM MGU-H electric motor.',
    materials: 'Bespoke Aluminum-Lithium alloy block, 3D printed steel pistons, Inconel exhaust',
    tolerance: 'Engineered for 15,000 RPM continuous operation',
    imageAlt: 'Power Unit',
  },
  {
    id: 'halo',
    name: 'Grade 5 Titanium Halo Structure',
    subtitle: 'DRIVER COCKPIT PROTECTION',
    description:
      'Weighing only 7 kilograms, the titanium Halo can sustain the weight of two London double-decker buses (12 tonnes) before yielding, clad in an aerodynamic carbon fiber fairing.',
    materials: 'Ti-6Al-4V Aerospace Grade 5 Titanium',
    tolerance: '116 kN vertical test load rating',
    imageAlt: 'Titanium Halo',
  },
];

export const AboutPage: React.FC = () => {
  const [activeSpotlight, setActiveSpotlight] = useState<string>('chassis');
  const activeComp = SPOTLIGHTS.find((s) => s.id === activeSpotlight) || SPOTLIGHTS[0];

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[rgba(17,23,25,0.06)] border border-[rgba(17,23,25,0.10)] mb-3"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-teal uppercase">
            ENGINEERING HERITAGE & ARCHITECTURE
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-condensed font-black text-4xl sm:text-6xl md:text-7xl uppercase text-[#151A1C] tracking-tight leading-[0.95]"
        >
          THE PURSUIT OF{' '}
          <span className="bg-gradient-to-r from-accent-teal via-[#2BE7D6] to-accent-teal bg-clip-text text-transparent">
            PERFECTION
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-sm text-[#5E686B] mt-4 max-w-xl mx-auto leading-relaxed font-normal"
        >
          Born from Brackley chassis design and Brixworth high-performance powertrains. Discover the materials, aerodynamics, and CAD digital twins that power world championships.
        </motion.p>
      </div>

      {/* Hero 3D Component Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-center">
        {/* Left: 3D Interactive Model Showcase */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-[rgba(17,23,25,0.12)] shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-accent-teal uppercase">
                CAD DIGITAL TWIN // FULL VEHICLE ASSEMBLY
              </span>
              <h2 className="font-condensed font-black text-2xl sm:text-3xl text-[#151A1C] uppercase">
                MERCEDES-AMG F1 W14 E PERFORMANCE
              </h2>
            </div>
            <Link
              to="/models/w14"
              className="px-4 py-1.5 rounded-lg bg-[#151A1C] hover:bg-accent-teal text-white font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300"
            >
              LAUNCH FULL 3D
            </Link>
          </div>

          <div className="h-[300px] sm:h-[380px] w-full rounded-xl overflow-hidden bg-gradient-to-b from-white to-[#EEF2F0] border border-[rgba(17,23,25,0.06)] relative">
            <ModelCard3D modelPath="/models/mercedes_w14.glb" scaleFactor={3.2} />
            <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-md px-3 py-1 rounded-md border border-[rgba(17,23,25,0.10)] text-[10px] font-mono text-[#5E686B]">
              ROTATABLE 3D CAD ENVIRONMENT
            </div>
          </div>
        </div>

        {/* Right: Interactive Component Selector */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-[rgba(17,23,25,0.08)]">
            {SPOTLIGHTS.map((comp) => (
              <button
                key={comp.id}
                onClick={() => setActiveSpotlight(comp.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeSpotlight === comp.id
                    ? 'bg-[#151A1C] text-accent-teal'
                    : 'bg-white/70 text-[#5E686B] hover:text-[#151A1C]'
                }`}
              >
                {comp.id}
              </button>
            ))}
          </div>

          <motion.div
            key={activeComp.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel rounded-2xl p-6 border border-[rgba(17,23,25,0.12)] shadow-sm"
          >
            <span className="text-[10px] font-mono font-bold tracking-widest text-accent-teal uppercase block mb-1">
              {activeComp.subtitle}
            </span>
            <h3 className="font-condensed font-black text-2xl sm:text-3xl text-[#151A1C] uppercase mb-4">
              {activeComp.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#5E686B] leading-relaxed mb-6">
              {activeComp.description}
            </p>

            <div className="space-y-3 border-t border-[rgba(17,23,25,0.08)] pt-4">
              <div>
                <span className="text-[10px] font-mono text-[#5E686B] uppercase block">
                  PRIMARY COMPOSITES & METALS
                </span>
                <span className="text-xs font-mono font-bold text-[#151A1C]">
                  {activeComp.materials}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#5E686B] uppercase block">
                  MANUFACTURING TOLERANCE
                </span>
                <span className="text-xs font-mono font-bold text-accent-teal">
                  {activeComp.tolerance}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Editorial History & Championship Legacy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="glass-panel rounded-2xl p-6 border border-[rgba(17,23,25,0.12)]">
          <span className="font-condensed font-black text-5xl text-accent-teal block mb-1">8</span>
          <span className="font-mono text-xs font-bold text-[#151A1C] uppercase tracking-wider block mb-2">
            CONSECUTIVE WORLD TITLES
          </span>
          <p className="text-xs text-[#5E686B] leading-relaxed">
            Record-setting reign from 2014 through 2021 as the undisputed champions of Formula 1 hybrid engineering, winning 8 consecutive FIA World Constructors' Championships.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-[rgba(17,23,25,0.12)]">
          <span className="font-condensed font-black text-5xl text-[#151A1C] block mb-1">125+</span>
          <span className="font-mono text-xs font-bold text-[#151A1C] uppercase tracking-wider block mb-2">
            GRAND PRIX VICTORIES
          </span>
          <p className="text-xs text-[#5E686B] leading-relaxed">
            Over one hundred and twenty-five Grand Prix victories achieved across six continents, establishing benchmarks in reliability, aerodynamic efficiency, and tactical pit execution.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-[rgba(17,23,25,0.12)]">
          <span className="font-condensed font-black text-5xl text-accent-teal block mb-1">&gt;50%</span>
          <span className="font-mono text-xs font-bold text-[#151A1C] uppercase tracking-wider block mb-2">
            THERMAL EFFICIENCY
          </span>
          <p className="text-xs text-[#5E686B] leading-relaxed">
            Breaking historical barriers on the Brixworth dyno by turning over 50 percent of the chemical fuel energy into usable kinetic energy through advanced turbo-hybrid recovery.
          </p>
        </div>
      </div>

      {/* The 3D Web Technology Platform */}
      <div className="glass-panel rounded-2xl p-8 border border-[rgba(17,23,25,0.12)] mb-16 shadow-sm">
        <div className="max-w-3xl mb-8">
          <span className="text-[10px] font-mono font-bold tracking-widest text-accent-teal uppercase block mb-1">
            DIGITAL TWIN ENGINE
          </span>
          <h3 className="font-condensed font-black text-3xl sm:text-4xl text-[#151A1C] uppercase mb-4">
            BUILT WITH REAL-TIME WEB GRAPHICS
          </h3>
          <p className="text-xs sm:text-sm text-[#5E686B] leading-relaxed">
            This showcase leverages bleeding-edge WebGL graphics running client-side at 60+ FPS on all devices. Real-time physically based materials (PBR) simulate authentic carbon weave, metallic clearcoat reflection, and studio radiosity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl bg-white border border-[rgba(17,23,25,0.08)]">
            <span className="text-xs font-mono font-bold text-[#151A1C] block mb-1">THREE.JS / R3F</span>
            <p className="text-[11px] text-[#5E686B]">
              Declarative 3D scene graphs, custom camera rigs, and high-performance glTF asset pipelines.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[rgba(17,23,25,0.08)]">
            <span className="text-xs font-mono font-bold text-[#151A1C] block mb-1">CONTACT SHADOWS</span>
            <p className="text-[11px] text-[#5E686B]">
              Soft ground contact ambient occlusion for seamless integration with the Pearl White studio environment.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[rgba(17,23,25,0.08)]">
            <span className="text-xs font-mono font-bold text-[#151A1C] block mb-1">STATE-DRIVEN SCROLL</span>
            <p className="text-[11px] text-[#5E686B]">
              Single source of truth scroll progress driving multi-stage camera sweeps and 3D callout tracking.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[rgba(17,23,25,0.08)]">
            <span className="text-xs font-mono font-bold text-[#151A1C] block mb-1">FRAMER MOTION</span>
            <p className="text-[11px] text-[#5E686B]">
              Fluid micro-interactions, hardware-accelerated transforms, and high-fidelity typography transitions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
