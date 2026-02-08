import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import React from "react";

/**
 * Particle field — sparse, drifting dots with thin connection lines.
 * Feels like a constellation map, not a screensaver.
 * Fewer particles, more intentional movement.
 */

interface Particle {
  x: number;
  y: number;
  size: number;
  drift: number;
  phase: number;
  brightness: number;
}

function seed(n: number): number {
  const x = Math.sin(n * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    x: seed(i * 5 + 1) * 1920,
    y: seed(i * 5 + 2) * 1080,
    size: seed(i * 5 + 3) * 2 + 1,
    drift: seed(i * 5 + 4) * 0.4 + 0.1,
    phase: seed(i * 5 + 5) * Math.PI * 2,
    brightness: seed(i * 5 + 6) * 0.4 + 0.15,
  }));
}

const DOTS = makeParticles(50);

export const ParticleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const fadeIn = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {DOTS.map((p, i) => {
          const px = p.x + Math.sin(p.phase + t * p.drift) * 30;
          const py = p.y + Math.cos(p.phase + t * p.drift * 0.7) * 20;

          return DOTS.slice(i + 1, i + 4).map((p2, j) => {
            const p2x = p2.x + Math.sin(p2.phase + t * p2.drift) * 30;
            const p2y = p2.y + Math.cos(p2.phase + t * p2.drift * 0.7) * 20;
            const dist = Math.hypot(px - p2x, py - p2y);
            if (dist > 280) return null;

            const alpha = interpolate(dist, [0, 280], [0.12, 0], {
              extrapolateRight: "clamp",
            });

            return (
              <line
                key={`c-${i}-${j}`}
                x1={px} y1={py} x2={p2x} y2={p2y}
                stroke={`rgba(255,255,255,${alpha})`}
                strokeWidth={0.5}
              />
            );
          });
        })}

        {DOTS.map((p, i) => {
          const px = p.x + Math.sin(p.phase + t * p.drift) * 30;
          const py = p.y + Math.cos(p.phase + t * p.drift * 0.7) * 20;

          return (
            <circle
              key={`d-${i}`}
              cx={px} cy={py}
              r={p.size}
              fill={`rgba(255,255,255,${p.brightness})`}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
