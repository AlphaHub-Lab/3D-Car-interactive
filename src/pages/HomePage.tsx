import React, { Suspense, useEffect } from 'react';
import { HeroText } from '../components/HeroText';
import { ViewpointRail } from '../components/ViewpointRail';
import { CarViewerCanvas } from '../scene/CarViewerCanvas';
import { CalloutLabel } from '../components/CalloutLabel';
import { LeaderLineOverlay } from '../components/LeaderLineOverlay';
import { ControlBar } from '../components/ControlBar';
import { CanvasLoader } from '../components/CanvasLoader';
import { useCalloutStore } from '../store/useCalloutStore';

import { CAR_MODELS } from '../data/modelsData';

export const HomePage: React.FC = () => {
  const { setTargetScrollProgress, setActiveCar } = useCalloutStore();

  useEffect(() => {
    setActiveCar(CAR_MODELS[0]);
  }, [setActiveCar]);

  // Scroll listener for hero 3D interactive story
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
        setTargetScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setTargetScrollProgress]);

  return (
    <div className="relative w-full bg-bg-primary text-text-primary">
      {/* 1. Fixed Pinned Viewport Container with Pearl White Luxury Studio Radial Glow */}
      <div
        className="fixed inset-0 w-screen h-screen overflow-hidden select-none z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 48%, rgba(255, 255, 255, 1) 0%, rgba(245, 248, 247, 0.98) 35%, rgba(229, 234, 232, 0.95) 70%, rgba(244, 246, 245, 1) 100%)',
        }}
      >
        {/* 3D Scene Layer with Suspense Loader */}
        <Suspense fallback={<CanvasLoader />}>
          <CarViewerCanvas />
        </Suspense>

        {/* SVG Leader Lines & Pulsing Dot Overlay */}
        <LeaderLineOverlay />

        {/* 2D Callout Card Overlay */}
        <CalloutLabel />

        {/* Hero Interactive Elements (with 100% scroll reveal) */}
        <HeroText />
        <ViewpointRail />
        <ControlBar />
      </div>

      {/* 2. Scroll Story Track (550vh provides generous, smooth physical scroll space) */}
      <div className="relative w-full h-[550vh] pointer-events-none" aria-hidden="true" />
    </div>
  );
};
