import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ModelCard3D } from '../components/ModelCard3D';

interface AeroPreset {
  id: string;
  name: string;
  circuit: string;
  frontWing: number;
  rearWing: number;
  frontRideHeight: number;
  rearRideHeight: number;
  diffuserAngle: number;
  description: string;
}

const PRESETS: AeroPreset[] = [
  {
    id: 'monza',
    name: 'Monza Ultra-Low Drag',
    circuit: 'Autodromo Nazionale Monza',
    frontWing: 13,
    rearWing: 11,
    frontRideHeight: 22,
    rearRideHeight: 68,
    diffuserAngle: 42,
    description: 'Minimal wing skin area, DRS trimmed for maximum terminal velocity along the Rettifilo Tribuna straight.',
  },
  {
    id: 'monaco',
    name: 'Monaco Maximum Downforce',
    circuit: 'Circuit de Monaco',
    frontWing: 41,
    rearWing: 43,
    frontRideHeight: 18,
    rearRideHeight: 60,
    diffuserAngle: 90,
    description: 'Steepest aerodynamic cascade angles for maximum mechanical and aerodynamic bite through Casino Square and the Swimming Pool.',
  },
  {
    id: 'silverstone',
    name: 'Silverstone High-Speed Balance',
    circuit: 'Silverstone Circuit',
    frontWing: 27,
    rearWing: 29,
    frontRideHeight: 20,
    rearRideHeight: 64,
    diffuserAngle: 68,
    description: 'Tuned for flat-out lateral stability through Maggotts, Becketts, and Chapel complex without bottoming out under high aero load.',
  },
  {
    id: 'spa',
    name: 'Spa Sector Trade-Off',
    circuit: 'Circuit de Spa-Francorchamps',
    frontWing: 22,
    rearWing: 23,
    frontRideHeight: 21,
    rearRideHeight: 66,
    diffuserAngle: 55,
    description: 'Precision compromise balancing top speed on the Kemmel Straight with downforce required through Pouhon and Blanchimont.',
  },
];

export const ExchangePage: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('silverstone');
  const [frontWing, setFrontWing] = useState<number>(27);
  const [rearWing, setRearWing] = useState<number>(29);
  const [frontRideHeight, setFrontRideHeight] = useState<number>(20);
  const [rearRideHeight, setRearRideHeight] = useState<number>(64);
  const [diffuserExpansion, setDiffuserExpansion] = useState<number>(68);
  const [setupName, setSetupName] = useState<string>('Custom Setup #1');
  const [savedSetups, setSavedSetups] = useState<Array<{ name: string; date: string; downforce: number }>>([
    { name: 'Factory Baseline 2023', date: 'Oct 24', downforce: 1450 },
    { name: 'Lewis Hamilton Silverstone Q3', date: 'Jul 08', downforce: 1490 },
    { name: 'George Russell Wet Setup', date: 'Aug 26', downforce: 1580 },
  ]);

  const applyPreset = (preset: AeroPreset) => {
    setSelectedPreset(preset.id);
    setFrontWing(preset.frontWing);
    setRearWing(preset.rearWing);
    setFrontRideHeight(preset.frontRideHeight);
    setRearRideHeight(preset.rearRideHeight);
    setDiffuserExpansion(preset.diffuserAngle);
    setSetupName(preset.name);
  };

  // Real-time calculated aerodynamics telemetry
  const totalWingAngle = frontWing + rearWing;
  const calculatedDownforce = Math.round(
    950 + totalWingAngle * 11.2 + diffuserExpansion * 3.5 - (frontRideHeight - 15) * 6
  );
  const calculatedDragCd = (0.68 + totalWingAngle * 0.0075 + diffuserExpansion * 0.0012).toFixed(3);
  const calculatedTopSpeed = Math.round(365 - totalWingAngle * 0.72 - diffuserExpansion * 0.12);
  const frontBalancePercent = (
    (frontWing / (frontWing + rearWing || 1)) * 100 * 0.92 +
    (rearRideHeight - frontRideHeight) * 0.15
  ).toFixed(1);

  const exportSetupJSON = () => {
    const setupData = {
      name: setupName,
      timestamp: new Date().toISOString(),
      vehicle: 'Mercedes-AMG F1 W14',
      parameters: {
        frontWingAngleDeg: frontWing,
        rearWingAngleDeg: rearWing,
        frontRideHeightMm: frontRideHeight,
        rearRideHeightMm: rearRideHeight,
        diffuserExpansionPct: diffuserExpansion,
      },
      calculatedTelemetry: {
        downforceKgAt250Kmh: calculatedDownforce,
        dragCoefficientCd: Number(calculatedDragCd),
        predictedTopSpeedKmh: calculatedTopSpeed,
        aeroBalanceFrontPct: Number(frontBalancePercent),
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(setupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${setupName.replace(/\s+/g, '_').toLowerCase()}_setup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const saveCurrentSetup = () => {
    setSavedSetups([
      { name: setupName, date: 'Just now', downforce: calculatedDownforce },
      ...savedSetups,
    ]);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[rgba(17,23,25,0.06)] border border-[rgba(17,23,25,0.10)] mb-3"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-teal uppercase">
            AERODYNAMICS & TELEMETRY SETUP HUB
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-condensed font-black text-4xl sm:text-6xl md:text-7xl uppercase text-[#151A1C] tracking-tight leading-[0.95]"
        >
          ENGINEERING{' '}
          <span className="bg-gradient-to-r from-accent-teal via-[#2BE7D6] to-accent-teal bg-clip-text text-transparent">
            EXCHANGE
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-sm text-[#5E686B] mt-4 max-w-xl mx-auto leading-relaxed font-normal"
        >
          Fine-tune front and rear wing flaps, Venturi diffuser expansions, and ground-clearance rake angles. Export machine-ready setup configurations or load factory championship profiles.
        </motion.p>
      </div>

      {/* Preset Profiles Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold tracking-widest text-[#5E686B] uppercase">
            CHAMPIONSHIP FACTORY PRESETS
          </span>
          <span className="text-[10px] font-mono text-accent-teal font-bold uppercase">
            BRACKLEY CFD VALIDATED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`p-4 rounded-xl text-left transition-all duration-300 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#151A1C] text-white border-[#151A1C] shadow-lg'
                    : 'bg-white hover:bg-gray-50 text-[#151A1C] border-[rgba(17,23,25,0.10)] hover:border-accent-teal/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isSelected ? 'text-accent-teal' : 'text-accent-teal'
                    }`}
                  >
                    {preset.circuit}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-accent-teal' : 'bg-gray-300'}`} />
                </div>
                <h4 className="font-condensed font-black text-lg uppercase mb-1">{preset.name}</h4>
                <p className={`text-[11px] line-clamp-2 ${isSelected ? 'text-gray-300' : 'text-[#5E686B]'}`}>
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Setup Tuning Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Left 7 Cols: Interactive Tuning Sliders */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-[rgba(17,23,25,0.12)] shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(17,23,25,0.08)]">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-accent-teal uppercase block">
                ACTIVE VEHICLE SETUP
              </span>
              <input
                type="text"
                value={setupName}
                onChange={(e) => setSetupName(e.target.value)}
                className="font-condensed font-black text-2xl text-[#151A1C] uppercase bg-transparent border-b border-transparent hover:border-gray-300 focus:border-accent-teal outline-none transition-colors"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={saveCurrentSetup}
                className="px-3 py-1.5 rounded-lg bg-white border border-[rgba(17,23,25,0.12)] text-[#151A1C] font-mono text-[11px] font-bold hover:border-accent-teal transition-colors cursor-pointer"
              >
                SAVE SETUP
              </button>
              <button
                onClick={exportSetupJSON}
                className="px-3 py-1.5 rounded-lg bg-[#151A1C] hover:bg-accent-teal text-white font-mono text-[11px] font-bold transition-colors cursor-pointer flex items-center space-x-1"
              >
                <span>EXPORT JSON</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Front Wing Flap */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="font-bold text-[#151A1C]">FRONT WING FLAP ANGLE</span>
                <span className="text-accent-teal font-bold">{frontWing}°</span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                value={frontWing}
                onChange={(e) => setFrontWing(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-teal"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#5E686B] mt-1">
                <span>10° LOW DRAG</span>
                <span>45° MAXIMUM BITE</span>
              </div>
            </div>

            {/* Rear Wing Flap */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="font-bold text-[#151A1C]">REAR WING MAINPLANE ANGLE</span>
                <span className="text-accent-teal font-bold">{rearWing}°</span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                value={rearWing}
                onChange={(e) => setRearWing(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-teal"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#5E686B] mt-1">
                <span>10° SLIPSTREAM TRIM</span>
                <span>45° HIGH REAR DOWNFORCE</span>
              </div>
            </div>

            {/* Front Ride Height */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="font-bold text-[#151A1C]">FRONT RIDE HEIGHT (GROUND CLEARANCE)</span>
                <span className="text-accent-teal font-bold">{frontRideHeight} mm</span>
              </div>
              <input
                type="range"
                min="15"
                max="35"
                value={frontRideHeight}
                onChange={(e) => setFrontRideHeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-teal"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#5E686B] mt-1">
                <span>15 mm GROUND SKIMMING</span>
                <span>35 mm HIGH RAKE / RAIN</span>
              </div>
            </div>

            {/* Rear Ride Height */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="font-bold text-[#151A1C]">REAR RIDE HEIGHT</span>
                <span className="text-accent-teal font-bold">{rearRideHeight} mm</span>
              </div>
              <input
                type="range"
                min="50"
                max="80"
                value={rearRideHeight}
                onChange={(e) => setRearRideHeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-teal"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#5E686B] mt-1">
                <span>50 mm LOW RAKE</span>
                <span>80 mm AGGRESSIVE RAKE</span>
              </div>
            </div>

            {/* Diffuser Throat Expansion */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="font-bold text-[#151A1C]">UNDERFLOOR DIFFUSER EXPANSION</span>
                <span className="text-accent-teal font-bold">{diffuserExpansion}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={diffuserExpansion}
                onChange={(e) => setDiffuserExpansion(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-teal"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#5E686B] mt-1">
                <span>20% SEALED THROAT</span>
                <span>100% MAXIMUM VENTURI EXPANSION</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Real-time Telemetry Calculations */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="glass-panel rounded-2xl p-6 border border-[rgba(17,23,25,0.12)]">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#5E686B] uppercase block mb-1">
              PREDICTED DOWNFORCE @ 250 KM/H
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="font-condensed font-black text-5xl sm:text-6xl text-accent-teal">
                {calculatedDownforce}
              </span>
              <span className="font-mono text-sm text-[#5E686B]">KG</span>
            </div>
            <p className="text-xs text-[#5E686B] mt-2">
              Total vertical force pressing tires into the tarmac at high velocity.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel rounded-2xl p-5 border border-[rgba(17,23,25,0.12)]">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#5E686B] uppercase block mb-1">
                TOP SPEED
              </span>
              <span className="font-condensed font-black text-3xl sm:text-4xl text-[#151A1C]">
                {calculatedTopSpeed}
              </span>
              <span className="font-mono text-xs text-[#5E686B] ml-1">KM/H</span>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-[rgba(17,23,25,0.12)]">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#5E686B] uppercase block mb-1">
                DRAG COEFF (CD)
              </span>
              <span className="font-condensed font-black text-3xl sm:text-4xl text-[#151A1C]">
                {calculatedDragCd}
              </span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-[rgba(17,23,25,0.12)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#5E686B] uppercase">
                AERO BALANCE RATIO
              </span>
              <span className="font-mono text-xs font-bold text-accent-teal">
                {frontBalancePercent}% FRONT / {(100 - Number(frontBalancePercent)).toFixed(1)}% REAR
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
              <div
                className="bg-accent-teal h-full transition-all duration-200"
                style={{ width: `${frontBalancePercent}%` }}
              />
              <div
                className="bg-[#151A1C] h-full transition-all duration-200"
                style={{ width: `${100 - Number(frontBalancePercent)}%` }}
              />
            </div>
            <p className="text-[11px] text-[#5E686B] mt-2">
              45-48% front balance provides sharp turn-in response; &gt;52% risks high-speed oversteer.
            </p>
          </div>

          {/* 3D Model Quick Preview */}
          <div className="h-[180px] rounded-xl overflow-hidden bg-gradient-to-b from-white to-[#EEF2F0] border border-[rgba(17,23,25,0.08)] relative">
            <ModelCard3D modelPath="/models/mercedes_w14.glb" scaleFactor={3.2} />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/80 font-mono text-[9px] text-[#151A1C] border border-[rgba(17,23,25,0.10)]">
              LIVE CAD SIMULATION
            </div>
          </div>
        </div>
      </div>

      {/* Community & Team Saved Configurations Table */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-[rgba(17,23,25,0.12)] shadow-sm">
        <h3 className="font-condensed font-black text-2xl text-[#151A1C] uppercase mb-4">
          SAVED TELEMETRY & SETUP VAULT
        </h3>
        <div className="divide-y divide-[rgba(17,23,25,0.08)]">
          {savedSetups.map((setup, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#151A1C] block">{setup.name}</span>
                <span className="text-[11px] font-mono text-[#5E686B]">Recorded: {setup.date}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-mono text-xs text-accent-teal font-bold">
                  {setup.downforce} kg Downforce
                </span>
                <button
                  onClick={() => setSetupName(setup.name)}
                  className="text-xs font-mono font-bold text-[#151A1C] hover:text-accent-teal uppercase cursor-pointer"
                >
                  LOAD
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
