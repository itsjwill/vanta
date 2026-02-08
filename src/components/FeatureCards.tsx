import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import React from "react";

const FEATURES = [
  { icon: "🎙", title: "Voice Cloning", desc: "Clone any voice in 60 seconds", color: "#6366f1" },
  { icon: "🧑", title: "AI Avatars", desc: "Photo → talking presenter", color: "#8b5cf6" },
  { icon: "💬", title: "Auto Captions", desc: "Whisper-powered subtitles", color: "#a855f7" },
  { icon: "✨", title: "Particle FX", desc: "GPU-accelerated effects", color: "#c084fc" },
  { icon: "📊", title: "Data → Video", desc: "Spreadsheet to narrated video", color: "#d946ef" },
  { icon: "🎵", title: "AI Music", desc: "Custom soundtracks on demand", color: "#ec4899" },
];

export const FeatureCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
          top: 80,
          textAlign: "center",
          width: "100%",
          opacity: interpolate(frame, [0, 15], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Everything. In One Engine.
        </div>
      </div>

      {/* Feature grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 30,
          justifyContent: "center",
          maxWidth: 1200,
          marginTop: 40,
        }}
      >
        {FEATURES.map((feat, i) => {
          const delay = 8 + i * 4;
          const cardSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 150, mass: 0.6 },
          });

          return (
            <div
              key={feat.title}
              style={{
                width: 340,
                padding: 30,
                borderRadius: 16,
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${feat.color}33`,
                backdropFilter: "blur(10px)",
                transform: `translateY(${(1 - cardSpring) * 40}px)`,
                opacity: cardSpring,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>{feat.icon}</div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: feat.color,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  marginBottom: 6,
                }}
              >
                {feat.title}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {feat.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          textAlign: "center",
          width: "100%",
          opacity: interpolate(frame, [50, 65], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "16px 48px",
            borderRadius: 50,
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            fontSize: 24,
            fontWeight: 700,
            color: "white",
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            boxShadow: "0 0 40px rgba(99, 102, 241, 0.4)",
          }}
        >
          github.com/itsjwill/prism-studio
        </div>
      </div>
    </AbsoluteFill>
  );
};
