import React from 'react';
import { useCalloutStore } from '../store/useCalloutStore';
import { getCalloutCardPosition } from '../utils/calloutMath';

export const LeaderLineOverlay: React.FC = () => {
  const { calloutScreenPos, statScreenPos } = useCalloutStore();

  if (!calloutScreenPos || !calloutScreenPos.visible) {
    return null;
  }

  const { x: ax, y: ay } = calloutScreenPos;

  // Use the exact same position math as CalloutLabel
  const { targetX, targetY, cardWidth } = getCalloutCardPosition(
    ax,
    ay,
    window.innerWidth,
    window.innerHeight
  );

  // Determine which side of the card the line connects to
  const connectsToLeft = ax < targetX;
  const cx = connectsToLeft ? targetX : targetX + cardWidth;
  const cy = targetY + 36; // near top quarter of card

  // Mid-dogleg elbow point
  const midX = connectsToLeft ? cx - 20 : cx + 20;

  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none z-20"
      style={{ filter: 'drop-shadow(0 0 3px rgba(0, 169, 157, 0.3))' }}
    >
      <defs>
        {/* Teal glow filter */}
        <filter id="tealGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. Leader Line to Callout Card (Dogleg path) - Dark translucent charcoal */}
      <path
        d={`M ${ax} ${ay} L ${midX} ${cy} L ${cx} ${cy}`}
        fill="none"
        stroke="rgba(17, 23, 25, 0.38)"
        strokeWidth="1.2"
        strokeDasharray="4 2"
      />

      {/* 2. Diagonal Telemetry Leader Line to Bottom Right Stat Readout */}
      {statScreenPos && (
        <path
          d={`M ${ax} ${ay} L ${statScreenPos.x - 20} ${statScreenPos.y - 12} L ${statScreenPos.x} ${statScreenPos.y}`}
          fill="none"
          stroke="rgba(0, 169, 157, 0.35)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      )}

      {/* Pulsing Teal Dot at the 3D Anchor Point */}
      <g transform={`translate(${ax}, ${ay})`}>
        {/* Outer pulsating ring */}
        <circle r="8" fill="none" stroke="#2be7d6" strokeWidth="1" opacity="0.6">
          <animate
            attributeName="r"
            values="4;11;4"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0.1;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Solid Center Dot */}
        <circle r="3.5" fill="#00A99D" filter="url(#tealGlow)" />
        <circle r="1.5" fill="#ffffff" />
      </g>
    </svg>
  );
};
