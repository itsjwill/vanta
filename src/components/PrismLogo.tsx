import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import React from "react";

export const PrismLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.8 },
  });

  const glowPulse = Math.sin(frame * 0.1) * 0.3 + 0.7;

  const subtitleOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      {/* Prism triangle */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          marginBottom: 30,
        }}
      >
        <svg width={200} height={200} viewBox="0 0 200 200">
          <defs>
            <linearGradient id="prismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <filter id="logoGlow">
              <feGaussianBlur stdDeviation={8 * glowPulse} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Triangle prism shape */}
          <polygon
            points="100,15 185,170 15,170"
            fill="none"
            stroke="url(#prismGrad)"
            strokeWidth={4}
            filter="url(#logoGlow)"
          />
          {/* Inner light beam */}
          <line
            x1={80}
            y1={90}
            x2={160}
            y2={140}
            stroke="white"
            strokeWidth={2}
            opacity={0.6}
          />
          {/* Dispersed rainbow lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={155 + i * 3}
              y1={130 + i * 8}
              x2={190}
              y2={120 + i * 12}
              stroke={`hsl(${i * 60 + 0}, 80%, 65%)`}
              strokeWidth={2}
              opacity={interpolate(frame, [15 + i * 3, 25 + i * 3], [0, 0.8], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
            />
          ))}
        </svg>
      </div>

      {/* Logo text */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.15em",
          }}
        >
          PRISM
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 300,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.5em",
            marginTop: -5,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          STUDIO
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 25,
          opacity: subtitleOpacity,
          fontSize: 20,
          fontWeight: 400,
          color: "rgba(255,255,255,0.6)",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          letterSpacing: "0.1em",
        }}
      >
        The AI-Powered Video Engine
      </div>
    </AbsoluteFill>
  );
};
