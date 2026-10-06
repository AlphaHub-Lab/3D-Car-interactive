export interface Viewpoint {
  id: number;
  name: string;
  code: string;
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export const VIEWPOINTS: Viewpoint[] = [
  {
    id: 0,
    name: "FRONT 3/4",
    code: "CAM-01 / FRONT-QTR",
    position: [4.1, 1.4, 3.8],
    target: [-0.3, 0.25, 0.2],
    fov: 38,
  },
  {
    id: 1,
    name: "SIDE PROFILE",
    code: "CAM-02 / PROFILE",
    position: [5.2, 0.85, 0.0],
    target: [-0.2, 0.3, 0.0],
    fov: 36,
  },
  {
    id: 2,
    name: "REAR 3/4 DRS",
    code: "CAM-03 / REAR-AERO",
    position: [-3.8, 1.5, -3.6],
    target: [-0.2, 0.35, -0.6],
    fov: 38,
  },
  {
    id: 3,
    name: "COCKPIT",
    code: "CAM-04 / CELL-CLOSEUP",
    position: [0.1, 1.65, 0.85],
    target: [0.0, 0.45, 0.15],
    fov: 42,
  },
];
