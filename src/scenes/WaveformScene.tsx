import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import React from "react";

const BAR_COUNT = 64;

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12345.6789) * 43758.5453;
  return x - Math.floor(x);
}

export const WaveformScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 120,
          opacity: titleOpacity,
          fontSize: 48,
          fontWeight: 700,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: "white",
          textAlign: "center",
          width: "100%",
        }}
      >
        Audio-Reactive Visualization
      </div>

      {/* Waveform bars */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          height: 400,
        }}
      >
        {Array.from({ length: BAR_COUNT }, (_, i) => {
          // Simulate audio frequencies
          const freq1 = Math.sin(t * 4 + i * 0.3) * 0.5 + 0.5;
          const freq2 = Math.sin(t * 7 + i * 0.15) * 0.3 + 0.3;
          const freq3 = Math.sin(t * 2 + i * 0.5) * 0.2 + 0.2;
          const noise = seededRandom(Math.floor(t * 10) * 100 + i) * 0.15;

          const amplitude = (freq1 + freq2 + freq3 + noise) / 1.5;
          const barHeight = amplitude * 300 + 10;

          // Entrance animation
          const entrance = interpolate(frame - i * 0.5, [0, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Color: center bars are brighter
          const centerDist = Math.abs(i - BAR_COUNT / 2) / (BAR_COUNT / 2);
          const hue = interpolate(i, [0, BAR_COUNT], [200, 320]);

          return (
            <div
              key={i}
              style={{
                width: 20,
                height: barHeight * entrance,
                borderRadius: 10,
                background: `linear-gradient(180deg, hsla(${hue}, 80%, 70%, 0.9), hsla(${hue}, 60%, 40%, 0.4))`,
                boxShadow: `0 0 ${20 * amplitude}px hsla(${hue}, 80%, 60%, ${0.4 * amplitude})`,
              }}
            />
          );
        })}
      </div>

      {/* "Now Playing" text */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: interpolate(frame, [30, 45], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Powered by wavesurfer.js + Prism Studio
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "rgba(255,255,255,0.8)",
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Beat-synced visuals from any audio source
        </span>
      </div>
    </AbsoluteFill>
  );
};
