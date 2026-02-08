import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import React from "react";

interface KineticTextProps {
  text?: string;
  subtitle?: string;
}

export const KineticText: React.FC<KineticTextProps> = ({
  text = "PRISM STUDIO",
  subtitle = "Video creation, reimagined.",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const letters = text.split("");

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      {/* Main text — each letter animates in with spring */}
      <div
        style={{
          display: "flex",
          gap: 4,
          perspective: "1000px",
        }}
      >
        {letters.map((letter, i) => {
          const delay = i * 2;

          const y = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 200, mass: 0.5 },
          });

          const rotateX = interpolate(y, [0, 1], [90, 0]);
          const opacity = interpolate(y, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          });

          // Color shift across the word
          const hue = interpolate(i, [0, letters.length - 1], [200, 280]);

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontSize: 120,
                fontWeight: 900,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
                color: `hsl(${hue}, 80%, 70%)`,
                opacity,
                transform: `rotateX(${rotateX}deg)`,
                textShadow: `0 0 40px hsla(${hue}, 80%, 60%, 0.5)`,
                letterSpacing: letter === " " ? "0.3em" : "0.05em",
                minWidth: letter === " " ? "0.4em" : undefined,
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>

      {/* Subtitle fades in after main text */}
      <div
        style={{
          marginTop: 30,
          opacity: interpolate(frame, [40, 55], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          transform: `translateY(${interpolate(frame, [40, 55], [20, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px)`,
        }}
      >
        <span
          style={{
            fontSize: 36,
            fontWeight: 300,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: "rgba(255, 255, 255, 0.7)",
            letterSpacing: "0.15em",
          }}
        >
          {subtitle}
        </span>
      </div>

      {/* Animated underline */}
      <div
        style={{
          marginTop: 20,
          height: 3,
          borderRadius: 2,
          background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)",
          width: interpolate(frame, [50, 75], [0, 600], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
