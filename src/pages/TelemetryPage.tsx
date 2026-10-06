import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TrackProfile {
  id: string;
  name: string;
  country: string;
  length: string;
  turns: number;
  lapRecord: string;
}

const TRACKS: TrackProfile[] = [
  {
    id: 'silverstone',
    name: 'Silverstone Circuit',
    country: 'United Kingdom',
    length: '5.891 km',
    turns: 18,
    lapRecord: '1:27.097 (Max Verstappen, 2020)',
  },
  {
    id: 'spa',
    name: 'Circuit de Spa-Francorchamps',
    country: 'Belgium',
    length: '7.004 km',
    turns: 19,
    lapRecord: '1:46.286 (Valtteri Bottas, 2018)',
  },
  {
    id: 'monza',
    name: 'Autodromo Nazionale Monza',
    country: 'Italy',
    length: '5.793 km',
    turns: 11,
    lapRecord: '1:21.046 (Rubens Barrichello, 2004)',
  },
];

export const TelemetryPage: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState<string>('silverstone');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [lapProgress, setLapProgress] = useState<number>(34); // 0 to 100%

  // Simulation loop for live telemetry playback
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setLapProgress((prev) => (prev >= 100 ? 0 : Number((prev + 0.35).toFixed(2))));
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Derived telemetry based on lap position (sinusoidal track approximation)
  const angle = (lapProgress / 100) * Math.PI * 4;
  const isBraking = Math.sin(angle) < -0.4;
  const isFullThrottle = Math.sin(angle) > 0.3;

  const currentSpeed = Math.round(
    isBraking
      ? 110 + Math.abs(Math.sin(angle)) * 60
      : isFullThrottle
      ? 280 + Math.sin(angle) * 65
      : 195 + Math.cos(angle) * 45
  );

  const throttlePct = isBraking ? 0 : isFullThrottle ? 100 : Math.round(40 + Math.sin(angle) * 40);
  const brakePct = isBraking ? Math.round(75 + Math.abs(Math.sin(angle)) * 25) : 0;
  const currentGear = Math.max(2, Math.min(8, Math.round(currentSpeed / 45)));
  const currentRpm = Math.min(14800, Math.round(8500 + (currentSpeed % 55) * 110));
  const steerAngle = Math.round(Math.cos(angle * 1.5) * 48);
  const lateralG = (Math.sin(angle * 1.5) * 4.4).toFixed(1);
  const longitudinalG = isBraking ? (-4.2).toFixed(1) : isFullThrottle ? (+1.8).toFixed(1) : (+0.3).toFixed(1);

  // Tire temperatures (°C)
  const flTemp = Math.round(102 + Math.sin(angle) * 6);
  const frTemp = Math.round(105 + Math.cos(angle) * 8);
  const rlTemp = Math.round(98 + Math.sin(angle * 1.2) * 5);
  const rrTemp = Math.round(101 + Math.cos(angle * 1.2) * 7);

  // Sector and Lap time calculation
  const sector = lapProgress < 33 ? 'SECTOR 1' : lapProgress < 66 ? 'SECTOR 2' : 'SECTOR 3';
  const simulatedSeconds = (lapProgress / 100) * 87.42;
  const mins = Math.floor(simulatedSeconds / 60);
  const secs = (simulatedSeconds % 60).toFixed(3);
  const formattedLapTime = `${mins}:${secs.padStart(6, '0')}`;

  const track = TRACKS.find((t) => t.id === selectedTrack) || TRACKS[0];

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
            MERCEDES-AMG TRACKSIDE TELEMETRY LAB
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-condensed font-black text-4xl sm:text-6xl md:text-7xl uppercase text-[#151A1C] tracking-tight leading-[0.95]"
        >
          LIVE TELEMETRY{' '}
          <span className="bg-gradient-to-r from-accent-teal via-[#2BE7D6] to-accent-teal bg-clip-text text-transparent">
            STREAM
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-sm text-[#5E686B] mt-4 max-w-xl mx-auto leading-relaxed font-normal"
        >
          Real-time high-frequency telemetry feeds sampled at 1,000 Hz: throttle and brake traces, 4-wheel tire core temperatures, ERS deployment, and lateral friction vectoring.
        </motion.p>
      </div>

      {/* Track Profile Selector */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {TRACKS.map((t) => {
          const isSelected = selectedTrack === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTrack(t.id)}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider transition-all duration-300 uppercase cursor-pointer flex items-center space-x-3 border ${
                isSelected
                  ? 'bg-[#151A1C] text-white border-[#151A1C] shadow-lg'
                  : 'bg-white/80 hover:bg-white text-[#5E686B] border-[rgba(17,23,25,0.12)] hover:border-accent-teal/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-accent-teal animate-pulse' : 'bg-gray-300'}`} />
              <span>{t.name}</span>
              <span className="text-[10px] opacity-60">({t.length})</span>
            </button>
          );
        })}
      </div>

      {/* Active Track Metadata */}
      <div className="text-center mb-8 text-xs font-mono text-[#5E686B]">
        <span>LOCATION: {track.country.toUpperCase()}</span>
        <span className="mx-2 text-accent-teal">•</span>
        <span>TURNS: {track.turns}</span>
        <span className="mx-2 text-accent-teal">•</span>
        <span>RECORD: {track.lapRecord}</span>
      </div>

      {/* Telemetry Control Bar (Play / Pause / Scrubber / Delta) */}
      <div className="glass-panel rounded-2xl p-6 border border-[rgba(17,23,25,0.12)] mb-10 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-11 h-11 rounded-xl bg-[#151A1C] hover:bg-accent-teal text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            <div>
              <span className="text-[10px] font-mono font-bold text-accent-teal uppercase block">
                {sector} // LAP 24 OF 52
              </span>
              <span className="font-condensed font-black text-2xl text-[#151A1C]">
                TIME: {formattedLapTime}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#5E686B] uppercase block">DELTA TO POLE</span>
              <span className="font-mono font-bold text-base text-accent-teal">-0.148s</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#5E686B] uppercase block">AIR / TRACK TEMP</span>
              <span className="font-mono font-bold text-base text-[#151A1C]">24°C / 38°C</span>
            </div>
          </div>
        </div>

        {/* Scrubber slider */}
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={lapProgress}
          onChange={(e) => setLapProgress(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-teal"
        />
        <div className="flex justify-between text-[10px] font-mono text-[#5E686B] mt-1">
          <span>START / FINISH</span>
          <span>SECTOR 1 (33%)</span>
          <span>SECTOR 2 (66%)</span>
          <span>FLYING LAP END</span>
        </div>
      </div>

      {/* Main Gauges Grid: Speed, RPM, Gear, Throttle, Brake */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {/* Speed */}
        <div className="glass-panel rounded-2xl p-5 border border-[rgba(17,23,25,0.12)]">
          <span className="text-[10px] font-mono font-bold text-[#5E686B] uppercase block mb-1">
            GROUND SPEED
          </span>
          <span className="font-condensed font-black text-4xl sm:text-5xl text-[#151A1C]">
            {currentSpeed}
          </span>
          <span className="text-xs font-mono text-[#5E686B] ml-1">KM/H</span>
        </div>

        {/* Gear */}
        <div className="glass-panel rounded-2xl p-5 border border-[rgba(17,23,25,0.12)]">
          <span className="text-[10px] font-mono font-bold text-[#5E686B] uppercase block mb-1">
            TRANSMISSION
          </span>
          <span className="font-condensed font-black text-4xl sm:text-5xl text-accent-teal">
            GEAR {currentGear}
          </span>
          <span className="text-xs font-mono text-[#5E686B] block mt-1">8-SPEED SEAMLESS</span>
        </div>

        {/* RPM */}
        <div className="glass-panel rounded-2xl p-5 border border-[rgba(17,23,25,0.12)]">
          <span className="text-[10px] font-mono font-bold text-[#5E686B] uppercase block mb-1">
            ENGINE TACHOMETER
          </span>
          <span className="font-condensed font-black text-3xl sm:text-4xl text-[#151A1C]">
            {currentRpm.toLocaleString()}
          </span>
          <span className="text-xs font-mono text-[#5E686B] ml-1">RPM</span>
        </div>

        {/* Throttle */}
        <div className="glass-panel rounded-2xl p-5 border border-[rgba(17,23,25,0.12)]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-mono font-bold text-[#5E686B] uppercase">THROTTLE</span>
            <span className="font-mono text-xs font-bold text-accent-teal">{throttlePct}%</span>
          </div>
          <div className="w-full bg-gray-200 h-4 rounded-md overflow-hidden mt-3">
            <div
              className="bg-accent-teal h-full transition-all duration-75"
              style={{ width: `${throttlePct}%` }}
            />
          </div>
        </div>

        {/* Brake */}
        <div className="glass-panel rounded-2xl p-5 border border-[rgba(17,23,25,0.12)]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-mono font-bold text-[#5E686B] uppercase">BRAKE PRESSURE</span>
            <span className="font-mono text-xs font-bold text-red-500">{brakePct}%</span>
          </div>
          <div className="w-full bg-gray-200 h-4 rounded-md overflow-hidden mt-3">
            <div
              className="bg-red-500 h-full transition-all duration-75"
              style={{ width: `${brakePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Advanced Telemetry Diagnostics: Tire Temps & Friction Circle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Left 6 cols: 4-Wheel Tire Diagnostics */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 sm:p-8 border border-[rgba(17,23,25,0.12)] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-condensed font-black text-2xl text-[#151A1C] uppercase">
              PIRELLI P-ZERO TIRE CORE TEMPS
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-teal/10 text-accent-teal font-bold uppercase">
              C3 SOFT COMPOUND
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Front Left */}
            <div className="p-4 rounded-xl bg-white border border-[rgba(17,23,25,0.08)]">
              <span className="text-[10px] font-mono font-bold text-[#5E686B] uppercase block mb-1">
                FRONT LEFT (FL)
              </span>
              <span className="font-condensed font-black text-3xl text-[#151A1C]">{flTemp}°C</span>
              <div className="text-[10px] font-mono text-accent-teal mt-1">21.5 PSI • OPTIMAL</div>
            </div>

            {/* Front Right */}
            <div className="p-4 rounded-xl bg-white border border-[rgba(17,23,25,0.08)]">
              <span className="text-[10px] font-mono font-bold text-[#5E686B] uppercase block mb-1">
                FRONT RIGHT (FR)
              </span>
              <span className="font-condensed font-black text-3xl text-[#151A1C]">{frTemp}°C</span>
              <div className="text-[10px] font-mono text-accent-teal mt-1">21.7 PSI • OPTIMAL</div>
            </div>

            {/* Rear Left */}
            <div className="p-4 rounded-xl bg-white border border-[rgba(17,23,25,0.08)]">
              <span className="text-[10px] font-mono font-bold text-[#5E686B] uppercase block mb-1">
                REAR LEFT (RL)
              </span>
              <span className="font-condensed font-black text-3xl text-[#151A1C]">{rlTemp}°C</span>
              <div className="text-[10px] font-mono text-accent-teal mt-1">19.2 PSI • OPTIMAL</div>
            </div>

            {/* Rear Right */}
            <div className="p-4 rounded-xl bg-white border border-[rgba(17,23,25,0.08)]">
              <span className="text-[10px] font-mono font-bold text-[#5E686B] uppercase block mb-1">
                REAR RIGHT (RR)
              </span>
              <span className="font-condensed font-black text-3xl text-[#151A1C]">{rrTemp}°C</span>
              <div className="text-[10px] font-mono text-accent-teal mt-1">19.4 PSI • OPTIMAL</div>
            </div>
          </div>
        </div>

        {/* Right 6 cols: G-Force Friction Circle & Steering Angle */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 sm:p-8 border border-[rgba(17,23,25,0.12)] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-condensed font-black text-2xl text-[#151A1C] uppercase">
              LATERAL & LONGITUDINAL G-CIRCLE
            </h3>
            <span className="text-[10px] font-mono font-bold text-accent-teal">
              STEER: {steerAngle}°
            </span>
          </div>

          <div className="flex items-center justify-around">
            {/* G-Circle Radar representation */}
            <div className="relative w-44 h-44 rounded-full border-2 border-[rgba(17,23,25,0.12)] flex items-center justify-center bg-white shadow-inner">
              <div className="w-32 h-32 rounded-full border border-dashed border-gray-300" />
              <div className="w-20 h-20 rounded-full border border-dashed border-gray-300" />
              <div className="absolute w-full h-[1px] bg-gray-300" />
              <div className="absolute h-full w-[1px] bg-gray-300" />

              {/* Dynamic G Point */}
              <motion.div
                className="absolute w-4 h-4 rounded-full bg-accent-teal border-2 border-white shadow-md"
                animate={{
                  x: Number(lateralG) * 12,
                  y: -Number(longitudinalG) * 12,
                }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              />
            </div>

            {/* Readouts */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-[#5E686B] uppercase block">LATERAL G-FORCE</span>
                <span className="font-condensed font-black text-3xl text-[#151A1C]">{lateralG} G</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#5E686B] uppercase block">LONGITUDINAL G</span>
                <span className="font-condensed font-black text-3xl text-[#151A1C]">{longitudinalG} G</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#5E686B] uppercase block">ERS STATE OF CHARGE</span>
                <span className="font-condensed font-black text-2xl text-accent-teal">84% (3.36 MJ)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
