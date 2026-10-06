export interface Callout {
  id: string;
  label: string;
  sublabel?: string;
  stat?: string;
  telemetryValue: string;
  telemetryUnit: string;
  description: string;
  anchor3D: [number, number, number]; // local-space point on the normalized car mesh
  meshNames: string[]; // mesh names or substring matches to apply teal rim highlight
  cameraViewpoint?: number; // 0: Front 3/4, 1: Side, 2: Rear 3/4, 3: Cockpit
}

export const CALLOUTS: Callout[] = [
  {
    id: "wing",
    label: "AERODYNAMIC FRONT WING",
    sublabel: "CASCADE FLAP COMPLEX",
    stat: "0.33 / 1.85",
    telemetryValue: "1842.60",
    telemetryUnit: "N (VORTEX DOWNFORCE)",
    description: "Four-tier carbon wing elements channeling outwash around the front Pirelli tires to feed the underfloor Venturi tunnels.",
    anchor3D: [0.0, 0.22, 2.1],
    meshNames: ["FWING_STICKERS", "Object_410"],
    cameraViewpoint: 0,
  },
  {
    id: "susp",
    label: "PUSH-ROD SUSPENSION",
    sublabel: "INBOARD HEAVE DAMPER",
    stat: "12.4 MM TRAVEL",
    telemetryValue: "420.15",
    telemetryUnit: "HZ (WHEEL FREQUENCY)",
    description: "Anti-dive geometry push-rod layout engineered to maintain stable aerodynamic platform height under heavy braking.",
    anchor3D: [0.55, 0.38, 0.95],
    meshNames: ["RF_DOWN_SUSP", "RF_UP_SUSP", "LF_DOWN_SUSP", "LF_UP_SUSP", "LF_CALIPER", "RF_CALIPER"],
    cameraViewpoint: 0,
  },
  {
    id: "halo",
    label: "TITANIUM HALO COCKPIT",
    sublabel: "GRADE 5 STRUCTURAL CAGE",
    stat: "125 KN LOAD",
    telemetryValue: "7.00",
    telemetryUnit: "KG (CHASSIS CELL)",
    description: "Monolithic curved titanium bar capable of withstanding 12 tons of vertical and lateral impact energy.",
    anchor3D: [0.0, 0.72, -0.15],
    meshNames: ["HALO001", "HALO_CAMERA", "HALO_STICKERS"],
    cameraViewpoint: 1,
  },
  {
    id: "drs",
    label: "DRAG REDUCTION SYSTEM (DRS)",
    sublabel: "HYDRAULIC ACTUATOR FLAP",
    stat: "85 MM GAP",
    telemetryValue: "1534.38",
    telemetryUnit: "N (DRAG REDUCTION)",
    description: "Electronically-triggered hydraulic ram raising the upper rear wing flap to dump aerodynamic drag on straightaways.",
    anchor3D: [0.0, 0.98, -2.05],
    meshNames: ["DRS_157", "DRS_SYSTEM_158", "FLAP_DRS001_160", "R_WING001_162"],
    cameraViewpoint: 2,
  },
  {
    id: "diff",
    label: "GROUND EFFECT DIFFUSER",
    sublabel: "VENTURI EXPANSION TUNNEL",
    stat: "0.33 / 1.85",
    telemetryValue: "3480.95",
    telemetryUnit: "N (LOW PRESSURE SEAL)",
    description: "High-expansion rear diffuser creating intense ground effect suction beneath the car floor without penalizing straight-line drag.",
    anchor3D: [-0.48, 0.12, -1.85],
    meshNames: ["GEARBOX_0", "EXHAUST_156", "LED_GEARS_9"],
    cameraViewpoint: 2,
  },
  {
    id: "cockpit",
    label: "CARBON STEERING WHEEL",
    sublabel: "OLED DISPLAY & MULTI-SWITCH",
    stat: "28 ROTARY DIALS",
    telemetryValue: "98.4",
    telemetryUnit: "% (B-MIG BRAKE BIAS)",
    description: "Bespoke carbon fiber control nexus giving Lewis & George complete real-time mapping over differential, energy deployment, and brake balance.",
    anchor3D: [0.0, 0.52, 0.26],
    meshNames: ["STEER_HR", "g_Steer_Metal", "COCKPIT_MAIN"],
    cameraViewpoint: 3,
  },
];
