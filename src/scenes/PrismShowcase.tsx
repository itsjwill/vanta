import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { ParticleScene } from "./ParticleScene";
import { KineticText } from "./KineticText";
import { DataVizScene } from "./DataVizScene";
import { WaveformScene } from "./WaveformScene";
import { PrismLogo } from "../components/PrismLogo";
import { FeatureCards } from "../components/FeatureCards";
import { GradientBackground } from "../components/GradientBackground";

/**
 * PRISM STUDIO — Hero Showcase Video
 *
 * 15-second cinematic demo showing what Prism can do.
 * Each scene transitions with a smooth wipe/fade.
 *
 * Timeline (at 30fps, 450 frames = 15 seconds):
 *   0-90    (0-3s)   — Logo reveal + particles
 *   90-180  (3-6s)   — Kinetic typography
 *   180-270 (6-9s)   — Data visualization
 *   270-360 (9-12s)  — Audio waveform
 *   360-450 (12-15s) — Feature cards + CTA
 */
export const PrismShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GradientBackground frame={frame} />

      {/* Scene 1: Logo Reveal (0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill
          style={{
            opacity: interpolate(frame, [80, 90], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <PrismLogo />
          <ParticleScene />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Kinetic Typography (3-6s) */}
      <Sequence from={90} durationInFrames={90}>
        <AbsoluteFill
          style={{
            opacity: interpolate(frame, [170, 180], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <KineticText text="CREATE VIDEOS" subtitle="with code, AI, and imagination" />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Data Visualization (6-9s) */}
      <Sequence from={180} durationInFrames={90}>
        <AbsoluteFill
          style={{
            opacity: interpolate(frame, [260, 270], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <DataVizScene />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 4: Audio Waveform (9-12s) */}
      <Sequence from={270} durationInFrames={90}>
        <AbsoluteFill
          style={{
            opacity: interpolate(frame, [350, 360], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <WaveformScene />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 5: Feature Cards + CTA (12-15s) */}
      <Sequence from={360} durationInFrames={90}>
        <FeatureCards />
      </Sequence>
    </AbsoluteFill>
  );
};
