import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CAR_MODELS } from '../data/modelsData';

interface TechItem {
  id: string;
  title: string;
  code: string;
  category: string;
  summary: string;
  displacement: string;
  rpm: string;
  horsepower: string;
  thermalEfficiency: string;
  equippedModelIds: string[];
  keyFeatures: string[];
  diagramDescription: string;
}

const TECHNOLOGIES: TechItem[] = [
  {
    id: 'm14-engine',
    title: 'MERCEDES-AMG M14 E PERFORMANCE POWERTRAIN',
    code: 'PU-M14 / GEN-2 HYBRID',
    category: 'Formula 1 Power Unit',
    summary: 'The pinnacle of high-efficiency motorsport internal combustion. A 1.6-liter turbocharged 90° V6 ICE integrated with an MGU-K crankshaft energy recovery unit and an ultra-high-speed MGU-H exhaust generator spinning up to 125,000 RPM.',
    displacement: '1,600 cc (90° V6)',
    rpm: '15,000 RPM Redline',
    horsepower: '1,020+ HP Total Combined',
    thermalEfficiency: 'Over 50% Peak Thermal Efficiency',
    equippedModelIds: ['w14'],
    keyFeatures: [
      'Pneumatic valve return system rated to 15,000 RPM',
      'Split-turbo architecture with shaft-coupled electric MGU-H',
      'Direct cylinder petrol injection at 500 bar pressure',
      'Carbon composite air intake plenum with variable velocity stacks',
    ],
    diagramDescription: 'Direct-drive MGU-K recovery unit provides 120 kW (161 HP) directly into the crankshaft, eliminating turbo lag while harvesting braking energy under deceleration.',
  },
  {
    id: 'm11-das',
    title: 'MERCEDES-AMG M11 EQ POWER+ & DUAL-AXIS STEERING (DAS)',
    code: 'PU-M11 / DAS-EQ',
    category: 'Formula 1 Record Drivetrain',
    summary: 'The legendary power unit that powered the fastest lap in Formula 1 history at Monza (264.362 km/h average speed), paired with revolutionary Dual-Axis Steering (DAS) allowing real-time toe alignment by pulling and pushing the steering column.',
    displacement: '1,600 cc Turbo Hybrid',
    rpm: '15,000 RPM Redline',
    horsepower: '1,050+ HP Peak Qualifying Mode',
    thermalEfficiency: '50.3% World-Record Thermal Efficiency',
    equippedModelIds: ['w11'],
    keyFeatures: [
      'Hydraulic Dual-Axis Steering mechanism altering front toe in real time',
      'Monza qualifying party mode engine mapping delivering maximum ERS deployment',
      'Titanium-cased 8-speed carbon cassette gearbox',
      'Ultra-compact sidepod heat exchanger cooling network',
    ],
    diagramDescription: 'Dual-Axis Steering (DAS) straightens front tire toe on straights to reduce rolling friction and warm tires evenly, returning to negative toe on corner entry.',
  },
  {
    id: 'amg-one-quad',
    title: 'FORMULA 1 V6 QUAD-ELECTRIC ROAD HYBRID DRIVE',
    code: 'E-PERF / 4-MOTOR ARCHITECTURE',
    category: 'Hypercar Powertrain',
    summary: 'Direct transfer of Mercedes-AMG Petronas Formula 1 championship technology into a street-legal hypercar. Combines the 1.6-liter F1 V6 turbo with four electric motors (two on the front axle for torque-vectoring AWD, one on the turbocharger, one on the crankshaft).',
    displacement: '1,599 cc V6 Turbocharged',
    rpm: '11,000 RPM Road Limit',
    horsepower: '1,063 HP Combined System Output',
    thermalEfficiency: '47.5% Production Car Record',
    equippedModelIds: ['amg-one'],
    keyFeatures: [
      'Twin electric front-axle motors (2x 120 kW) enabling fully electric torque vectoring',
      'Electrically-assisted turbocharger (MGU-H) eliminating turbo lag entirely',
      'Direct liquid-cooled 800V high-density battery pack',
      'Push-rod coilover suspension with automated ground clearance lowering in Race Plus mode',
    ],
    diagramDescription: 'Front axle electric motors allow torque vectoring on individual front wheels while the F1 V6 and rear MGU-K unleash 1,063 HP to all four wheels.',
  },
  {
    id: 'ground-effect',
    title: 'GROUND EFFECT VENTURI TUNNELS & UNDERFLOOR VORTEX SEALING',
    code: 'AERO-TUNNEL / 3D DOWNFORCE',
    category: 'Aerodynamic Architecture',
    summary: '3D contoured Venturi floor tunnels channeling massive volumes of air beneath the car to create a low-pressure suction zone (Bernoulli principle), producing tons of cornering downforce without the severe drag penalty of large upper wings.',
    displacement: 'Venturi Underfloor',
    rpm: 'Active Suction Flow',
    horsepower: '18,400 N Peak Suction Force',
    thermalEfficiency: 'Low-Drag Downforce Ratio',
    equippedModelIds: ['w14'],
    keyFeatures: [
      'Twin curved Venturi tunnels with floor edge vortex generators',
      'Up-swept rear diffuser expanding air volume to draw ground suction',
      'High-stiffness carbon floor stays preventing aerodynamic stall',
      'Hydraulic Drag Reduction System (DRS) shedding upper wing profile on straights',
    ],
    diagramDescription: 'Constricting underfloor airflow accelerates air velocity, dropping pressure according to Bernoulli equation to pull the car into the asphalt.',
  },
  {
    id: 'fury-v8',
    title: 'HENNESSEY "FURY" 6.6L TWIN-TURBOCHARGED V8',
    code: 'FURY-V8 / 1817-BHP',
    category: 'Hypercar Combustion Engine',
    summary: 'Custom-built pushrod 90° V8 with precision billet aluminum block, extreme-duty forged titanium valves, and twin ball-bearing ceramic turbochargers running 1.52 bar boost to produce 1,817 horsepower and 1,193 lb-ft of torque.',
    displacement: '6,555 cc (6.6L V8)',
    rpm: '8,500 RPM Redline',
    horsepower: '1,817 HP @ 8,000 RPM',
    thermalEfficiency: 'High-Velocity Scavenging',
    equippedModelIds: ['hennessey-f5'],
    keyFeatures: [
      'Precision CNC-machined billet aluminum engine block with steel cylinder sleeves',
      'High-flow multi-stage dry sump lubrication system',
      'Ceramic-coated ball-bearing turbochargers with 3D-printed titanium compressor wheels',
      'CIMA 7-speed longitudinal paddle-shift transmission',
    ],
    diagramDescription: 'Massive dual intercoolers drop charge air temperatures to near-ambient before forced induction into high-flow billet cylinder heads.',
  },
  {
    id: 'raptor-predator',
    title: 'FORD 5.2L SUPERCHARGED PREDATOR V8 & FOX LIVE VALVE DAMPING',
    code: 'PREDATOR-SC / LIVE-VALVE',
    category: 'High-Performance Supertruck',
    summary: 'The most powerful engine ever fitted to an F-150 Raptor. 5.2-liter cross-plane V8 force-fed by a 2.65L Eaton roots supercharger, paired with electronically controlled dual-valve FOX internal bypass dampers continuously scanning desert terrain 500 times per second.',
    displacement: '5,163 cc Supercharged V8',
    rpm: '7,000 RPM Limit',
    horsepower: '720 HP @ 6,650 RPM',
    thermalEfficiency: 'High-Scavenge Desert Airflow',
    equippedModelIds: ['ford-raptor-r'],
    keyFeatures: [
      '2.65-liter Eaton TVS supercharger generating 12 psi boost',
      'Cast stainless steel exhaust manifolds with active dual valve acoustic bypass',
      'FOX Live Valve dual-valve electronic internal bypass shocks with 330mm wheel travel',
      'Forged aluminum front control arms and heavy-duty 5-link rear coil-spring suspension',
    ],
    diagramDescription: 'Live Valve sensors read steering angle, vehicle pitch, and suspension travel, adjusting hydraulic damping in real time for optimal desert landing control.',
  },
  {
    id: 'porsche-boxer',
    title: 'PORSCHE 4.2L NATURALLY ASPIRATED FLAT-SIX & SWAN-NECK AERO',
    code: '992-BOXER / 4.2L RACE',
    category: 'FIA GT3 Homologated Powertrain',
    summary: 'The ultimate evolution of Porsche Motorsport naturally aspirated engineering. Displacing 4.2 liters with an astronomical 9,400 RPM redline, paired with top-mounted swan-neck carbon wing brackets ensuring undisturbed bottom-surface aerodynamic low pressure.',
    displacement: '4,194 cc Boxer-6',
    rpm: '9,400 RPM Peak Cutoff',
    horsepower: '565 HP @ 9,250 RPM',
    thermalEfficiency: 'Naturally Aspirated Resonance Tuning',
    equippedModelIds: ['porsche-992-gt3-r'],
    keyFeatures: [
      'Direct fuel injection with 6 individual throttle butterfly valves',
      'Dry-sump lubrication with high-capacity centrifugal oil de-aerator',
      'Inverted swan-neck rear wing mount maximizing wing suction surface area',
      'Elevated Venturi front and rear underfloor aerodynamic channeling',
    ],
    diagramDescription: 'Swan-neck top brackets eliminate airflow turbulence on the wing underside where 70% of downforce suction is generated.',
  },
  {
    id: 'bmw-p58',
    title: 'BMW P58 3.0L M TWINPOWER TURBO INLINE-6 & EVO AERO PACKAGE',
    code: 'BMW-P58 / EVO-AERO',
    category: 'GT3 Competition Architecture',
    summary: 'BMW M Motorsport\'s latest straight-six racing engine featuring mono-scroll twin turbochargers, dry sump oil scavenge, and newly refined EVO-spec aerodynamic canards that channel laminar air directly to front brake cooling ducts.',
    displacement: '2,993 cc Inline-6',
    rpm: '7,500 RPM Limit',
    horsepower: 'Up to 590 HP (BoP Adjustable)',
    thermalEfficiency: 'Twin-Scroll Air-to-Water Intercooled',
    equippedModelIds: ['bmw-m4-gt3-evo'],
    keyFeatures: [
      'High-rigidity closed-deck aluminum cylinder block with wire-arc sprayed bores',
      'Xtrac 6-speed sequential transaxle with paddle shift pneumatic actuator',
      'EVO aerodynamic front canards and enlarged brake cooling ducts',
      'Adjustable high-camber rear wing with replaceable Gurney flaps',
    ],
    diagramDescription: 'Front aero canards generate localized high pressure to force cooling air across massive carbon-ceramic brakes while stabilizing front axle downforce.',
  },
];

export const TechnologyPage: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<TechItem>(TECHNOLOGIES[0]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[rgba(17,23,25,0.06)] border border-[rgba(17,23,25,0.10)] mb-3"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-teal uppercase">
            ENGINEERING & POWERTRAIN ARCHIVES
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-condensed font-black text-4xl sm:text-6xl md:text-7xl uppercase text-[#151A1C] tracking-tight leading-[0.95]"
        >
          FORMULA 1{' '}
          <span className="bg-gradient-to-r from-accent-teal via-[#2BE7D6] to-accent-teal bg-clip-text text-transparent">
            TECHNOLOGY
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-sm text-[#5E686B] mt-4 max-w-xl mx-auto leading-relaxed font-normal"
        >
          From split-turbo MGU-H heat harvesting to revolutionary Dual-Axis Steering and 4-motor hybrid all-wheel drive, explore the exact powertrains equipped in our 3D fleet.
        </motion.p>
      </div>

      {/* Main Technology Two-Column Interactive View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Technology Selector List */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#5E686B] uppercase">
            SELECT POWERTRAIN MODULE ({TECHNOLOGIES.length})
          </span>

          {TECHNOLOGIES.map((tech) => {
            const isSelected = selectedTech.id === tech.id;
            return (
              <button
                key={tech.id}
                onClick={() => setSelectedTech(tech)}
                className={`text-left p-5 rounded-2xl transition-all duration-300 border flex flex-col cursor-pointer ${
                  isSelected
                    ? 'glass-panel border-accent-teal/80 shadow-md bg-white/95 translate-x-1.5'
                    : 'bg-white/60 border-[rgba(17,23,25,0.08)] hover:bg-white/85 hover:border-[rgba(17,23,25,0.16)]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-mono font-bold text-accent-teal tracking-widest uppercase">
                    {tech.code}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[rgba(17,23,25,0.06)] text-[#151A1C] uppercase font-semibold">
                    {tech.category}
                  </span>
                </div>

                <h3 className="font-condensed font-black text-lg text-[#151A1C] uppercase tracking-tight leading-snug">
                  {tech.title}
                </h3>

                <p className="text-[11px] text-[#5E686B] mt-1 line-clamp-2">
                  {tech.summary}
                </p>

                {/* Equipped Models Quick Link Badges */}
                <div className="mt-3 pt-3 border-t border-[rgba(17,23,25,0.06)] flex items-center space-x-2">
                  <span className="text-[9px] font-mono text-[#5E686B] uppercase">EQUIPPED IN:</span>
                  {tech.equippedModelIds.map((mId) => {
                    const car = CAR_MODELS.find((c) => c.id === mId);
                    return car ? (
                      <span
                        key={mId}
                        className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-accent-teal/10 text-accent-teal border border-accent-teal/20 uppercase"
                      >
                        {car.shortName}
                      </span>
                    ) : null;
                  })}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Technology Deep-Dive Panel */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-[rgba(17,23,25,0.12)] shadow-xl relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[rgba(17,23,25,0.08)] gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-accent-teal tracking-widest uppercase block mb-1">
                ENGINEERING SPECIFICATION // {selectedTech.code}
              </span>
              <h2 className="font-condensed font-black text-2xl sm:text-3xl text-[#151A1C] uppercase tracking-tight">
                {selectedTech.title}
              </h2>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-accent-teal/10 text-accent-teal text-xs font-mono font-bold text-center border border-accent-teal/20 self-start">
              {selectedTech.horsepower}
            </div>
          </div>

          {/* Technical Summary */}
          <p className="text-xs sm:text-sm text-[#5E686B] mt-5 leading-relaxed">
            {selectedTech.summary}
          </p>

          {/* 4 Metric Telemetry Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div className="p-3 rounded-xl bg-white/70 border border-[rgba(17,23,25,0.08)]">
              <span className="text-[9px] font-mono text-[#5E686B] block uppercase">DISPLACEMENT</span>
              <span className="font-mono font-bold text-xs text-[#151A1C] mt-1 block">{selectedTech.displacement}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/70 border border-[rgba(17,23,25,0.08)]">
              <span className="text-[9px] font-mono text-[#5E686B] block uppercase">ENGINE SPEED</span>
              <span className="font-mono font-bold text-xs text-[#151A1C] mt-1 block">{selectedTech.rpm}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/70 border border-[rgba(17,23,25,0.08)]">
              <span className="text-[9px] font-mono text-[#5E686B] block uppercase">POWER OUTPUT</span>
              <span className="font-mono font-bold text-xs text-accent-teal mt-1 block">{selectedTech.horsepower}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/70 border border-[rgba(17,23,25,0.08)]">
              <span className="text-[9px] font-mono text-[#5E686B] block uppercase">THERMAL EFFICIENCY</span>
              <span className="font-mono font-bold text-xs text-[#151A1C] mt-1 block">{selectedTech.thermalEfficiency}</span>
            </div>
          </div>

          {/* Key Engineering Innovations */}
          <div className="mt-6 pt-6 border-t border-[rgba(17,23,25,0.08)]">
            <h4 className="text-xs font-mono font-bold tracking-widest text-[#151A1C] uppercase mb-3">
              KEY AERODYNAMIC & THERMAL INNOVATIONS
            </h4>
            <ul className="space-y-2.5">
              {selectedTech.keyFeatures.map((feat, i) => (
                <li key={i} className="flex items-start space-x-2.5 text-xs text-[#5E686B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-teal mt-1.5 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Operational Principle Box */}
          <div className="mt-6 p-4 rounded-xl bg-[rgba(17,23,25,0.04)] border border-[rgba(17,23,25,0.08)]">
            <span className="text-[9px] font-mono font-bold text-accent-teal uppercase tracking-widest block mb-1">
              OPERATIONAL DYNAMICS
            </span>
            <p className="text-xs text-[#5E686B] leading-relaxed">
              {selectedTech.diagramDescription}
            </p>
          </div>

          {/* HYPERLINKS TO EQUIPPED MODELS (Requirement 3) */}
          <div className="mt-8 pt-6 border-t border-[rgba(17,23,25,0.08)]">
            <h4 className="text-xs font-mono font-bold tracking-widest text-[#151A1C] uppercase mb-4">
              MODELS EQUIPPED WITH THIS ENGINE / AERODYNAMICS
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedTech.equippedModelIds.map((mId) => {
                const car = CAR_MODELS.find((c) => c.id === mId);
                if (!car) return null;
                return (
                  <Link
                    key={car.id}
                    to={`/models/${car.id}`}
                    className="group p-4 rounded-xl bg-white border border-[rgba(17,23,25,0.12)] hover:border-accent-teal hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-mono text-accent-teal font-bold tracking-wider uppercase block">
                        {car.category} // {car.year}
                      </span>
                      <h5 className="font-condensed font-black text-lg text-[#151A1C] group-hover:text-accent-teal uppercase transition-colors">
                        {car.name}
                      </h5>
                      <span className="text-[10px] text-[#5E686B] font-mono">
                        {car.performance.topSpeed} · {car.performance.acceleration}
                      </span>
                    </div>

                    <span className="w-8 h-8 rounded-full bg-[#151A1C] group-hover:bg-[#00A99D] text-white flex items-center justify-center text-xs transition-colors flex-shrink-0 ml-3">
                      &rarr;
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
