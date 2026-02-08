import { Composition } from "remotion";
import { VantaShowcase } from "./scenes/VantaShowcase";
import { ParticleScene } from "./scenes/ParticleScene";
import { KineticText } from "./scenes/KineticText";
import { DataVizScene } from "./scenes/DataVizScene";
import { WaveformScene } from "./scenes/WaveformScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main showcase — the hero video */}
      <Composition
        id="VantaShowcase"
        component={VantaShowcase}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Individual scenes for testing */}
      <Composition
        id="Particles"
        component={ParticleScene}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="KineticText"
        component={KineticText}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ text: "CREATE VIDEOS", subtitle: "with code, AI, and imagination" }}
      />
      <Composition
        id="DataViz"
        component={DataVizScene}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Waveform"
        component={WaveformScene}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
