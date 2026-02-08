import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import React from "react";

const BAR_DATA = [
  { label: "Voice Clone", value: 92, color: "#6366f1" },
  { label: "AI Avatar", value: 87, color: "#8b5cf6" },
  { label: "Auto-Caption", value: 95, color: "#a855f7" },
  { label: "Particles", value: 78, color: "#c084fc" },
  { label: "Data Viz", value: 84, color: "#d946ef" },
  { label: "Waveform", value: 90, color: "#ec4899" },
];

export const DataVizScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        padding: 80,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 100,
          opacity: titleOpacity,
          fontSize: 48,
          fontWeight: 700,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: "white",
          textAlign: "center",
          width: "100%",
        }}
      >
        Integrated AI Capabilities
      </div>

      {/* Bar chart */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 40,
          height: 500,
          marginTop: 60,
        }}
      >
        {BAR_DATA.map((bar, i) => {
          const delay = i * 5;
          const barSpring = spring({
            frame: frame - delay - 10,
            fps,
            config: { damping: 15, stiffness: 120, mass: 0.8 },
          });

          const barHeight = barSpring * bar.value * 4;

          // Counter animation
          const displayValue = Math.round(barSpring * bar.value);

          return (
            <div
              key={bar.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Value label */}
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  color: bar.color,
                  opacity: barSpring,
                }}
              >
                {displayValue}%
              </span>

              {/* Bar */}
              <div
                style={{
                  width: 80,
                  height: barHeight,
                  borderRadius: 8,
                  background: `linear-gradient(180deg, ${bar.color}, ${bar.color}88)`,
                  boxShadow: `0 0 30px ${bar.color}44`,
                  transition: "height 0.1s ease-out",
                }}
              />

              {/* Label */}
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  textAlign: "center",
                  width: 100,
                  opacity: barSpring,
                }}
              >
                {bar.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Animated stat line */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          display: "flex",
          gap: 60,
          opacity: interpolate(frame, [60, 75], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {[
          { label: "Open Source Repos", value: "40+" },
          { label: "Combined Stars", value: "250K+" },
          { label: "Cost to You", value: "$0" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 42,
                fontWeight: 800,
                color: "white",
                fontFamily: "monospace",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.5)",
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                marginTop: 4,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
