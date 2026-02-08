import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import React from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  opacity: number;
  hue: number;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    x: seededRandom(i * 3 + 1) * 1920,
    y: seededRandom(i * 3 + 2) * 1080,
    size: seededRandom(i * 3 + 3) * 6 + 2,
    speed: seededRandom(i * 7 + 4) * 3 + 0.5,
    angle: seededRandom(i * 7 + 5) * Math.PI * 2,
    opacity: seededRandom(i * 7 + 6) * 0.6 + 0.2,
    hue: seededRandom(i * 7 + 7) * 60 + 200, // Blue-purple range
  }));
}

const PARTICLES = generateParticles(120);

export const ParticleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Entrance: particles fly in from center
  const spread = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="particleGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Connection lines between nearby particles */}
        {PARTICLES.map((p, i) => {
          const px =
            960 + (p.x - 960 + Math.cos(p.angle + t * p.speed) * 80) * spread;
          const py =
            540 + (p.y - 540 + Math.sin(p.angle + t * p.speed) * 80) * spread;

          return PARTICLES.slice(i + 1, i + 5).map((p2, j) => {
            const p2x =
              960 +
              (p2.x - 960 + Math.cos(p2.angle + t * p2.speed) * 80) * spread;
            const p2y =
              540 +
              (p2.y - 540 + Math.sin(p2.angle + t * p2.speed) * 80) * spread;
            const dist = Math.hypot(px - p2x, py - p2y);
            if (dist > 200) return null;

            const lineOpacity = interpolate(dist, [0, 200], [0.3, 0], {
              extrapolateRight: "clamp",
            });

            return (
              <line
                key={`line-${i}-${j}`}
                x1={px}
                y1={py}
                x2={p2x}
                y2={p2y}
                stroke={`hsla(${p.hue}, 80%, 70%, ${lineOpacity * spread})`}
                strokeWidth={0.5}
              />
            );
          });
        })}

        {/* Particles */}
        {PARTICLES.map((p, i) => {
          const px =
            960 + (p.x - 960 + Math.cos(p.angle + t * p.speed) * 80) * spread;
          const py =
            540 + (p.y - 540 + Math.sin(p.angle + t * p.speed) * 80) * spread;

          const pulse = Math.sin(t * 2 + i) * 0.3 + 0.7;

          return (
            <circle
              key={`p-${i}`}
              cx={px}
              cy={py}
              r={p.size * pulse}
              fill={`hsla(${p.hue + t * 10}, 80%, 70%, ${p.opacity * spread})`}
              filter="url(#glow)"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
