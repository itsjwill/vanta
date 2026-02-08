import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import React from "react";

const BAR_COUNT = 48;

function seed(n: number): number {
  const x = Math.sin(n * 12345.6789) * 43758.5453;
  return x - Math.floor(x);
}

export const WaveformScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", top: 120, left: 200, opacity: interpolate(frame, [0, 18], [0, 0.3], { extrapolateRight: "clamp" }) }}>
        <div style={{ fontSize: 12, fontFamily: '"Courier New", Courier, monospace', color: "rgba(255,255,255,0.3)", letterSpacing: "0.35em", textTransform: "uppercase" }}>
          audio-reactive
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        {Array.from({ length: BAR_COUNT }, (_, i) => {
          const f1 = Math.sin(t * 3.2 + i * 0.25) * 0.4 + 0.4;
          const f2 = Math.sin(t * 5.8 + i * 0.12) * 0.25 + 0.25;
          const f3 = Math.sin(t * 1.6 + i * 0.4) * 0.15 + 0.15;
          const noise = seed(Math.floor(t * 8) * 100 + i) * 0.1;
          const amplitude = Math.min(1, (f1 + f2 + f3 + noise) / 1.2);
          const barHeight = amplitude * 200 + 4;
          const entrance = interpolate(frame - i * 0.3, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const isHot = amplitude > 0.6;
          const barColor = isHot ? `rgba(255,170,80,${0.5 + amplitude * 0.4})` : `rgba(255,255,255,${0.08 + amplitude * 0.15})`;

          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{ width: 12, height: (barHeight / 2) * entrance, borderRadius: 6, background: barColor }} />
              <div style={{ width: 12, height: (barHeight / 2) * entrance, borderRadius: 6, background: barColor }} />
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", bottom: 140, left: 200, right: 200, display: "flex", justifyContent: "space-between", alignItems: "flex-end", opacity: interpolate(frame, [25, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <div style={{ fontSize: 18, fontWeight: 300, color: "rgba(255,255,255,0.6)", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
          Beat-synced visuals from any audio source
        </div>
        <div style={{ fontSize: 11, fontFamily: '"Courier New", Courier, monospace', color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em" }}>
          wavesurfer.js / vanta
        </div>
      </div>
    </AbsoluteFill>
  );
};
