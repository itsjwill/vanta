import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import React from "react";

interface KineticTextProps {
  text?: string;
  subtitle?: string;
}

/**
 * Typography scene — left-aligned, mixed weights, wipe reveals.
 * No bouncing springs. Clean mask animations with offset timing.
 */
export const KineticText: React.FC<KineticTextProps> = ({
  text = "CREATE VIDEOS",
  subtitle = "with code, AI, and imagination",
}) => {
  const frame = useCurrentFrame();

  const words = text.split(" ");

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        paddingLeft: 200,
        paddingRight: 200,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontFamily: '"Courier New", Courier, monospace',
          color: `rgba(255,255,255,${interpolate(frame, [5, 18], [0, 0.35], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })})`,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        what you can build
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        {words.map((word, i) => {
          const delay = 10 + i * 8;
          const reveal = interpolate(frame, [delay, delay + 14], [0, 100], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div key={i} style={{ overflow: "hidden" }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: 96,
                  fontWeight: i === 0 ? 100 : 700,
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  color: "rgba(255,255,255,0.92)",
                  letterSpacing: "-0.02em",
                  clipPath: `inset(0 ${100 - reveal}% 0 0)`,
                }}
              >
                {word}
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 20,
          transform: `translateY(${interpolate(frame, [35, 52], [14, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px)`,
          opacity: interpolate(frame, [35, 52], [0, 0.45], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 300,
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.06em",
          }}
        >
          {subtitle}
        </span>
      </div>

      <div
        style={{
          marginTop: 28,
          height: 1,
          background: "rgba(255,180,100,0.4)",
          width: interpolate(frame, [45, 70], [0, 180], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
