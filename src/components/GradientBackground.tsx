import { AbsoluteFill, interpolate, random } from "remotion";
import React from "react";

interface GradientBackgroundProps {
  frame: number;
}

/**
 * Cinematic background — near-black with warm undertones,
 * subtle grain texture, no generic purple gradients.
 */
export const GradientBackground: React.FC<GradientBackgroundProps> = ({ frame }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Warm ambient light — asymmetric, like a real set */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,160,60,0.06) 0%, transparent 70%)",
          top: -200,
          right: -100,
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,220,180,0.04) 0%, transparent 70%)",
          bottom: -150,
          left: -50,
          filter: "blur(60px)",
        }}
      />

      {/* Film grain — makes it feel analog, not digital */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.035 }}>
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            seed={Math.floor(frame * 0.5)}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* Vignette — heavier than before, more cinematic */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Thin horizontal rule — production design detail */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 120,
          right: 120,
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,${
            interpolate(frame, [0, 30], [0, 0.08], { extrapolateRight: "clamp" })
          }), transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
