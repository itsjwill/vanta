import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import React from "react";

const CAPABILITIES = [
  { name: "Voice Cloning", detail: "GPT-SoVITS  /  54K stars" },
  { name: "AI Avatars", detail: "SadTalker  /  7K stars" },
  { name: "Auto Captions", detail: "Whisper  /  word-level" },
  { name: "Video Generation", detail: "Open-Sora  /  text to video" },
  { name: "AI Music", detail: "ACE-Step  /  free Suno alt" },
  { name: "Background Removal", detail: "imgly  /  client-side" },
  { name: "Visual Editor", detail: "react-video-editor  /  CapCut clone" },
  { name: "Particle Effects", detail: "tsparticles  /  8K stars" },
];

export const FeatureCards: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ paddingLeft: 200, paddingRight: 200, justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 120 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontFamily: '"Courier New", Courier, monospace', color: `rgba(255,255,255,${interpolate(frame, [0, 12], [0, 0.3], { extrapolateRight: "clamp" })})`, letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 32 }}>
            included integrations
          </div>

          {CAPABILITIES.map((cap, i) => {
            const delay = 6 + i * 4;
            const lineReveal = interpolate(frame, [delay, delay + 10], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const rowOpacity = interpolate(frame, [delay, delay + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            return (
              <div key={cap.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 12, marginBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.04)", opacity: rowOpacity, clipPath: `inset(0 ${100 - lineReveal}% 0 0)` }}>
                <span style={{ fontSize: 18, fontWeight: 400, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: "rgba(255,255,255,0.8)" }}>{cap.name}</span>
                <span style={{ fontSize: 12, fontFamily: '"Courier New", Courier, monospace', color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>{cap.detail}</span>
              </div>
            );
          })}
        </div>

        <div style={{ width: 400, display: "flex", flexDirection: "column", justifyContent: "center", opacity: interpolate(frame, [30, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontSize: 64, fontWeight: 100, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: "rgba(255,255,255,0.9)", lineHeight: 1.1 }}>40+</div>
          <div style={{ fontSize: 14, fontFamily: '"Courier New", Courier, monospace', color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginTop: 8 }}>open source repos</div>

          <div style={{ fontSize: 64, fontWeight: 100, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: "rgba(255,180,100,0.8)", lineHeight: 1.1, marginTop: 36 }}>$0</div>
          <div style={{ fontSize: 14, fontFamily: '"Courier New", Courier, monospace', color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginTop: 8 }}>replaces $100+/mo in saas tools</div>

          <div style={{ marginTop: 48, opacity: interpolate(frame, [55, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <div style={{ fontSize: 14, fontFamily: '"Courier New", Courier, monospace', color: "rgba(255,180,100,0.5)", letterSpacing: "0.08em" }}>github.com/itsjwill/vanta</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
