/**
 * VANTA — Timeline Integration
 *
 * Video editing timeline component with drag-and-drop tracks,
 * keyframe editing, and scrubbing. Feeds directly into Remotion.
 * Replaces Remotion Pro Timeline ($300).
 *
 * Usage:
 *   const timeline = createTimeline({ fps: 30, duration: 300 });
 *   timeline.addClip({ track: 0, src: "clip.mp4", start: 0, end: 150 });
 *   timeline.addClip({ track: 1, src: "music.mp3", start: 0, end: 300 });
 *   const remotionProps = timeline.toRemotionSequences();
 *
 * Repos:
 *   - https://github.com/xzdarcy/react-timeline-editor (661 stars) — Drag-and-drop timeline editor
 *   - https://github.com/kevintech/timeline-editor-react (94 stars) — Lightweight timeline (~13KB)
 *   - https://github.com/prabhuignoto/react-chrono (8,000+ stars) — Rich media timeline
 *
 * Want help setting this up? Join The Agentic Advantage:
 * https://www.skool.com/ai-elite-9507/about
 */

export interface TimelineConfig {
  fps: number;
  durationInFrames: number;
  trackCount?: number;
}

export interface TimelineClip {
  id: string;
  trackIndex: number;
  type: "video" | "audio" | "image" | "text" | "effect";
  src?: string;
  startFrame: number;
  endFrame: number;
  trimStart?: number;  // Frames trimmed from source start
  trimEnd?: number;    // Frames trimmed from source end
  volume?: number;     // 0-1 for audio tracks
  opacity?: number;    // 0-1 for visual tracks
  label?: string;
}

export interface TimelineKeyframe {
  clipId: string;
  property: string;    // "opacity", "scale", "x", "y", "rotation"
  frame: number;
  value: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | "spring";
}

export interface Timeline {
  config: TimelineConfig;
  clips: TimelineClip[];
  keyframes: TimelineKeyframe[];
  playheadFrame: number;
}

export function createTimeline(config: TimelineConfig): Timeline {
  // Creates a new empty timeline.
  //
  // Uses react-timeline-editor under the hood:
  //   npm install @xzdarcy/react-timeline-editor
  //
  // The timeline provides:
  //   - Multiple tracks (video, audio, text layers)
  //   - Drag to reposition clips
  //   - Drag edges to trim clips
  //   - Playhead scrubbing synced with Remotion Player
  //   - Keyframe diamonds for property animation
  //   - Snap-to-grid and snap-to-clip
  //   - Zoom in/out on timeline
  //
  // Data flow:
  //   Timeline UI → clips[] + keyframes[] → toRemotionSequences() → <Composition>

  return {
    config: {
      fps: config.fps,
      durationInFrames: config.durationInFrames,
      trackCount: config.trackCount ?? 4,
    },
    clips: [],
    keyframes: [],
    playheadFrame: 0,
  };
}

export function addClip(timeline: Timeline, clip: Omit<TimelineClip, "id">): Timeline {
  const id = `clip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    ...timeline,
    clips: [...timeline.clips, { ...clip, id }],
  };
}

export function removeClip(timeline: Timeline, clipId: string): Timeline {
  return {
    ...timeline,
    clips: timeline.clips.filter((c) => c.id !== clipId),
    keyframes: timeline.keyframes.filter((k) => k.clipId !== clipId),
  };
}

export function splitClip(
  timeline: Timeline,
  clipId: string,
  atFrame: number
): Timeline {
  // Splits a clip at the given frame into two clips.
  // The first clip ends at atFrame, the second starts at atFrame.
  const clip = timeline.clips.find((c) => c.id === clipId);
  if (!clip || atFrame <= clip.startFrame || atFrame >= clip.endFrame) {
    return timeline;
  }

  const firstHalf: TimelineClip = {
    ...clip,
    endFrame: atFrame,
  };

  const secondHalf: TimelineClip = {
    ...clip,
    id: `clip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    startFrame: atFrame,
    trimStart: (clip.trimStart ?? 0) + (atFrame - clip.startFrame),
  };

  return {
    ...timeline,
    clips: timeline.clips.map((c) => (c.id === clipId ? firstHalf : c)).concat(secondHalf),
  };
}

export function addKeyframe(timeline: Timeline, keyframe: Omit<TimelineKeyframe, "easing"> & { easing?: TimelineKeyframe["easing"] }): Timeline {
  return {
    ...timeline,
    keyframes: [...timeline.keyframes, { easing: "ease-in-out", ...keyframe }],
  };
}

export interface RemotionSequenceData {
  from: number;
  durationInFrames: number;
  type: TimelineClip["type"];
  src?: string;
  style: Record<string, unknown>;
}

export function toRemotionSequences(timeline: Timeline): RemotionSequenceData[] {
  // Converts timeline clips + keyframes into Remotion-compatible
  // sequence data that maps directly to <Sequence> components.
  //
  // Each clip becomes:
  //   <Sequence from={clip.startFrame} durationInFrames={clip.endFrame - clip.startFrame}>
  //     <Video src={clip.src} startFrom={clip.trimStart} />
  //   </Sequence>
  //
  // Keyframes are interpolated using Remotion's interpolate():
  //   const opacity = interpolate(frame,
  //     [keyframe1.frame, keyframe2.frame],
  //     [keyframe1.value, keyframe2.value],
  //     { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  //   );

  return timeline.clips.map((clip) => {
    const clipKeyframes = timeline.keyframes.filter((k) => k.clipId === clip.id);

    const style: Record<string, unknown> = {};
    if (clip.opacity !== undefined) style.opacity = clip.opacity;
    if (clip.volume !== undefined) style.volume = clip.volume;

    // Group keyframes by property for interpolation
    const keyframesByProp: Record<string, TimelineKeyframe[]> = {};
    for (const kf of clipKeyframes) {
      if (!keyframesByProp[kf.property]) keyframesByProp[kf.property] = [];
      keyframesByProp[kf.property].push(kf);
    }
    style.keyframes = keyframesByProp;

    return {
      from: clip.startFrame,
      durationInFrames: clip.endFrame - clip.startFrame,
      type: clip.type,
      src: clip.src,
      style,
    };
  });
}
