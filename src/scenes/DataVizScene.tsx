import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import React from "react";

const DATA = [
  { label: "voice cloning", value: 92 },
  { label: "talking avatars", value: 87 },
  { label: "auto captions", value: 95 },
  { label: "image editing", value: 91 },
  { label: "video generation", value: 78 },
  { label: "transitions", value: 88 },
];

export const DataVizScene: React.FC = () => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [0, 15], [0, 0.3], {
    extrapolateRight: "clamp",
  });

  const counterVal = Math.min(40, Math.round(interpolate(frame, [20, 55], [0, 40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })));

  return (
    <AbsoluteFill style={{ paddingLeft: 200, paddingRight: 200, justifyContent: "center" }}>
      <div
        style={{
          fontSize: 12,
          fontFamily: '"Courier New", Courier, monospace',
          color: `rgba(255,255,255,${labelOpacity})`,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          marginBottom: 40,
        }}
      >
        integration readiness
      </div>

      {DATA.map((item, i) => {
        const delay = 8 + i * 5;
        const barWidth = interpolate(frame, [delay, delay + 22], [0, item.value], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const rowOpacity = interpolate(frame, [delay, delay + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div key={item.label} style={{ display: "flex", alignItems: "center", marginBottom: 18, opacity: rowOpacity }}>
            <div style={{ width: 200, fontSize: 14, fontFamily: '"Courier New", Courier, monospace', color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em", textAlign: "right", paddingRight: 24 }}>
              {item.label}
            </div>
            <div style={{ flex: 1, height: 20, background: "rgba(255,255,255,0.03)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${barWidth}%`, background: "linear-gradient(90deg, rgba(255,180,100,0.7), rgba(255,140,60,0.5))", borderRadius: 2 }} />
            </div>
            <div style={{ width: 60, textAlign: "right", fontSize: 14, fontFamily: '"Courier New", Courier, monospace', color: "rgba(255,180,100,0.7)" }}>
              {Math.round(barWidth)}%
            </div>
          </div>
        );
      })}

      <div style={{ display: "flex", gap: 80, marginTop: 50, opacity: interpolate(frame, [55, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        {[
          { value: `${counterVal}+`, label: "open source repos" },
          { value: "250K+", label: "combined github stars" },
          { value: "$0", label: "total cost" },
        ].map((stat) => (
          <div key={stat.label}>
            <div style={{ fontSize: 32, fontWeight: 200, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: "rgba(255,255,255,0.85)" }}>{stat.value}</div>
            <div style={{ fontSize: 11, fontFamily: '"Courier New", Courier, monospace', color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
