import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import React from "react";

/**
 * Logo reveal — minimal V mark + wordmark.
 * Two converging lines form the V, then text wipes in.
 */
export const VantaLogo: React.FC = () => {
  const frame = useCurrentFrame();

  // V mark — two lines converge
  const leftLine = interpolate(frame, [6, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightLine = interpolate(frame, [12, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Warm glow at the vertex of the V
  const glowOpacity = interpolate(frame, [30, 45], [0, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text wipe-in (left to right mask)
  const textReveal = interpolate(frame, [24, 52], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline fades in last
  const taglineOpacity = interpolate(frame, [48, 68], [0, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Thin accent line under tagline
  const lineWidth = interpolate(frame, [55, 75], [0, 120], {
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
      <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
        {/* V mark — two converging lines */}
        <svg width={120} height={120} viewBox="0 0 200 200">
          {/* Left stroke of V */}
          <line
            x1={40} y1={40} x2={100} y2={160}
            stroke="rgba(255,255,255,0.85)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray={170}
            strokeDashoffset={170 * (1 - leftLine)}
          />
          {/* Right stroke of V */}
          <line
            x1={160} y1={40} x2={100} y2={160}
            stroke="rgba(255,255,255,0.85)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray={170}
            strokeDashoffset={170 * (1 - rightLine)}
          />
          {/* Warm glow at vertex */}
          <circle
            cx={100} cy={160} r={4}
            fill={`rgba(255,170,80,${glowOpacity})`}
          />
        </svg>

        {/* Text block */}
        <div>
          {/* Main title with clip mask reveal */}
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: 80,
                fontWeight: 100,
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                color: "rgba(255,255,255,0.95)",
                letterSpacing: "0.28em",
                clipPath: `inset(0 ${100 - textReveal}% 0 0)`,
              }}
            >
              VANTA
            </div>
          </div>

          {/* Tagline — delayed, understated */}
          <div
            style={{
              fontSize: 12,
              fontWeight: 400,
              fontFamily: '"Courier New", Courier, monospace',
              color: `rgba(255,255,255,${taglineOpacity})`,
              letterSpacing: "0.35em",
              marginTop: 10,
              textTransform: "uppercase",
            }}
          >
            open source video engine
          </div>

          {/* Warm accent line */}
          <div
            style={{
              marginTop: 16,
              height: 1,
              width: lineWidth,
              background: "rgba(255,170,80,0.35)",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
