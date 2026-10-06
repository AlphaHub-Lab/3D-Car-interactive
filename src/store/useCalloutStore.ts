import { create } from 'zustand';
import { CALLOUTS, Callout } from '../data/callouts';
import { VIEWPOINTS } from '../data/viewpoints';
import { CAR_MODELS, CarModelData } from '../data/modelsData';

interface CalloutState {
  activeCar: CarModelData;
  scrollProgress: number; // 0 to 1 (smoothed progress)
  targetScrollProgress: number; // 0 to 1 (raw window scroll)
  activeCalloutId: string;
  activeCallout: Callout;
  calloutVisible: boolean;
  viewpointIndex: number;
  isAutoCruising: boolean;
  calloutScreenPos: { x: number; y: number; visible: boolean } | null;
  statScreenPos: { x: number; y: number } | null;

  // Actions
  setActiveCar: (car: CarModelData) => void;
  setScrollProgress: (progress: number) => void;
  setTargetScrollProgress: (progress: number) => void;
  toggleAutoCruising: () => void;
  setIsAutoCruising: (cruising: boolean) => void;
  setActiveCalloutId: (id: string) => void;
  setViewpointIndex: (index: number) => void;
  scrollToProgress: (progress: number) => void;
  scrollToViewpoint: (index: number) => void;
  scrollToCallout: (id: string) => void;
  scrollToNext: () => void;
  setCalloutScreenPos: (pos: { x: number; y: number; visible: boolean } | null) => void;
  setStatScreenPos: (pos: { x: number; y: number } | null) => void;
}

// Stage scroll positions
export const STAGE_POSITIONS = {
  hero: 0.0,
  wing: 0.22,
  susp: 0.38,
  cockpit: 0.54,
  drs: 0.70,
  diff: 0.84,
  reveal: 1.0,
};

export const useCalloutStore = create<CalloutState>((set, get) => ({
  activeCar: CAR_MODELS[0],
  scrollProgress: 0,
  targetScrollProgress: 0,
  activeCalloutId: '',
  activeCallout: CAR_MODELS[0].callouts[0] || CALLOUTS[0],
  calloutVisible: false,
  viewpointIndex: 0,
  isAutoCruising: false,
  calloutScreenPos: null,
  statScreenPos: null,

  setActiveCar: (car: CarModelData) => {
    set({
      activeCar: car,
      activeCallout: car.callouts[0] || CALLOUTS[0],
    });
    get().setScrollProgress(get().scrollProgress);
  },

  setScrollProgress: (progress: number) => {
    const clamped = Math.max(0, Math.min(1, progress));
    const currentCar = get().activeCar || CAR_MODELS[0];
    const callouts = currentCar.callouts && currentCar.callouts.length >= 5
      ? currentCar.callouts
      : CALLOUTS;

    let activeId = '';
    let visible = true;
    let vpIndex = 0;

    if (clamped < 0.12) {
      // Hero opening view: pure natural car livery, no component highlighted
      activeId = '';
      visible = false;
      vpIndex = 0;
    } else if (clamped < 0.28) {
      activeId = callouts[0]?.id || 'wing';
      visible = true;
      vpIndex = 0;
    } else if (clamped < 0.46) {
      activeId = callouts[1]?.id || 'susp';
      visible = true;
      vpIndex = 0;
    } else if (clamped < 0.62) {
      activeId = callouts[2]?.id || 'cockpit';
      visible = true;
      vpIndex = 3;
    } else if (clamped < 0.76) {
      activeId = callouts[3]?.id || 'drs';
      visible = true;
      vpIndex = 2;
    } else if (clamped < 0.90) {
      activeId = callouts[4]?.id || 'diff';
      visible = true;
      vpIndex = 2;
    } else {
      // Final reveal
      activeId = callouts[2]?.id || 'cockpit';
      visible = false;
      vpIndex = 1;
    }

    const callout = callouts.find((c) => c.id === activeId) || callouts[0] || CALLOUTS[0];

    set({
      scrollProgress: clamped,
      activeCalloutId: activeId,
      activeCallout: callout as Callout,
      calloutVisible: visible,
      viewpointIndex: vpIndex,
    });
  },

  setTargetScrollProgress: (progress: number) => {
    set({ targetScrollProgress: Math.max(0, Math.min(1, progress)) });
  },

  toggleAutoCruising: () => {
    set((state) => ({ isAutoCruising: !state.isAutoCruising }));
  },

  setIsAutoCruising: (cruising: boolean) => {
    set({ isAutoCruising: cruising });
  },

  setActiveCalloutId: (id: string) => {
    const { scrollToCallout } = get();
    scrollToCallout(id);
  },

  setViewpointIndex: (index: number) => {
    const { scrollToViewpoint } = get();
    scrollToViewpoint(index);
  },

  scrollToProgress: (progress: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0) {
      window.scrollTo({
        top: progress * maxScroll,
        behavior: 'smooth',
      });
    }
  },

  scrollToViewpoint: (index: number) => {
    const { scrollToProgress } = get();
    const clamped = Math.max(0, Math.min(VIEWPOINTS.length - 1, index));
    if (clamped === 0) scrollToProgress(0.0);
    else if (clamped === 1) scrollToProgress(0.96);
    else if (clamped === 2) scrollToProgress(0.72);
    else if (clamped === 3) scrollToProgress(0.54);
  },

  scrollToCallout: (id: string) => {
    const { scrollToProgress, activeCar } = get();
    const callouts = activeCar?.callouts || CALLOUTS;
    if (callouts[0] && id === callouts[0].id) scrollToProgress(STAGE_POSITIONS.wing);
    else if (callouts[1] && id === callouts[1].id) scrollToProgress(STAGE_POSITIONS.susp);
    else if (callouts[2] && id === callouts[2].id) scrollToProgress(STAGE_POSITIONS.cockpit);
    else if (callouts[3] && id === callouts[3].id) scrollToProgress(STAGE_POSITIONS.drs);
    else if (callouts[4] && id === callouts[4].id) scrollToProgress(STAGE_POSITIONS.diff);
    else if (id === 'wing') scrollToProgress(STAGE_POSITIONS.wing);
    else if (id === 'susp') scrollToProgress(STAGE_POSITIONS.susp);
    else if (id === 'halo' || id === 'cockpit') scrollToProgress(STAGE_POSITIONS.cockpit);
    else if (id === 'drs') scrollToProgress(STAGE_POSITIONS.drs);
    else if (id === 'diff') scrollToProgress(STAGE_POSITIONS.diff);
  },

  scrollToNext: () => {
    const { scrollProgress, scrollToProgress } = get();
    if (scrollProgress < 0.12) scrollToProgress(STAGE_POSITIONS.wing);
    else if (scrollProgress < 0.28) scrollToProgress(STAGE_POSITIONS.susp);
    else if (scrollProgress < 0.46) scrollToProgress(STAGE_POSITIONS.cockpit);
    else if (scrollProgress < 0.62) scrollToProgress(STAGE_POSITIONS.drs);
    else if (scrollProgress < 0.76) scrollToProgress(STAGE_POSITIONS.diff);
    else if (scrollProgress < 0.90) scrollToProgress(STAGE_POSITIONS.reveal);
    else scrollToProgress(0.0);
  },

  setCalloutScreenPos: (pos) => set({ calloutScreenPos: pos }),
  setStatScreenPos: (pos) => set({ statScreenPos: pos }),
}));
