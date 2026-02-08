import { AbsoluteFill, interpolate } from "remotion";
import React from "react";

interface GradientBackgroundProps {
  frame: number;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ frame }) => {
  // Slowly rotating gradient
  const angle = interpolate(frame, [0, 450], [135, 225]);
  const hue1 = interpolate(frame, [0, 450], [220, 280]);
  const hue2 = interpolate(frame, [0, 450], [260, 340]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg,
          hsl(${hue1}, 40%, 8%) 0%,
          hsl(${hue2 - 40}, 30%, 5%) 50%,
          hsl(${hue2}, 35%, 10%) 100%)`,
      }}
    >
      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.5,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
