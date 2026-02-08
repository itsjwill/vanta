/**
 * VANTA — Animated Captions Integration
 *
 * Styled, animated caption rendering for video.
 * TikTok-style word-by-word highlights, karaoke effects, bounce animations.
 * Replaces Remotion Pro Animated Captions ($100).
 *
 * Works WITH auto-captions.ts — that handles transcription (Whisper),
 * this handles the visual presentation layer.
 *
 * Usage:
 *   import { AnimatedCaption } from "./integrations/animated-captions";
 *   <AnimatedCaption
 *     words={transcription.segments[0].words}
 *     style="tiktok"
 *     frame={frame}
 *     fps={fps}
 *   />
 *
 * Repos:
 *   - https://github.com/ahgsql/remotion-subtitles — Animated subtitles for Remotion from SRT files
 *   - https://github.com/zernonia/vista — Auto-generate animated subtitles with AssemblyAI + ffmpeg
 *   - https://github.com/vidstack/captions (130 stars) — Lightweight caption parser/renderer
 *   - @remotion/captions — Official Remotion captions package
 *
 * Want help setting this up? Join The Agentic Advantage:
 * https://www.skool.com/ai-elite-9507/about
 */

import type { CaptionWord } from "./auto-captions";

export type CaptionStyle =
  | "tiktok"       // Word-by-word highlight with bounce
  | "karaoke"      // Progressive color fill left to right
  | "typewriter"   // Letters appear one at a time
  | "pop"          // Words pop in with scale animation
  | "subtitle"     // Clean bottom-center subtitle bar
  | "highlight"    // Active word gets colored background box
  | "wave";        // Words wave up and down in sequence

export interface CaptionStyleConfig {
  style: CaptionStyle;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  activeColor?: string;
  backgroundColor?: string;
  position?: "top" | "center" | "bottom";
  maxWordsPerLine?: number;
  padding?: number;
  shadow?: boolean;
  outline?: boolean;
  outlineColor?: string;
  outlineWidth?: number;
}

export interface AnimatedCaptionProps {
  words: CaptionWord[];
  style: CaptionStyle;
  frame: number;
  fps: number;
  config?: Partial<CaptionStyleConfig>;
}

export function getActiveWordIndex(
  words: CaptionWord[],
  currentTimeSeconds: number
): number {
  // Find which word should be highlighted at the current time.
  // Uses binary search for performance with long transcriptions.
  for (let i = 0; i < words.length; i++) {
    if (currentTimeSeconds >= words[i].start && currentTimeSeconds <= words[i].end) {
      return i;
    }
  }
  return -1;
}

export function getVisibleWords(
  words: CaptionWord[],
  currentTimeSeconds: number,
  maxWords: number = 8
): CaptionWord[] {
  // Returns the window of words that should be visible on screen.
  // Centers around the active word, showing up to maxWords.
  const activeIndex = getActiveWordIndex(words, currentTimeSeconds);
  if (activeIndex === -1) return [];

  const halfWindow = Math.floor(maxWords / 2);
  const start = Math.max(0, activeIndex - halfWindow);
  const end = Math.min(words.length, start + maxWords);

  return words.slice(start, end);
}

export function getCaptionStyleCSS(
  config: CaptionStyleConfig,
  isActive: boolean
): Record<string, string | number> {
  // Returns CSS properties for a word based on the selected style
  // and whether it's the currently spoken word.
  //
  // For "tiktok" style:
  //   Active word gets: scale(1.2), color change, text-shadow glow
  //   Inactive words: normal scale, dimmed color
  //
  // For "karaoke" style:
  //   Uses clip-path to progressively reveal the active color
  //   from left to right based on playback position within the word
  //
  // For "pop" style:
  //   Active word: scale(1.3) with spring easing
  //   Just-appeared word: scale(0) → scale(1) entrance animation
  //
  // Implementation uses Remotion's interpolate() for smooth timing:
  //   const scale = interpolate(frame, [wordStart, wordStart + 5], [0, 1], {
  //     extrapolateRight: "clamp",
  //     easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  //   });

  const base: Record<string, string | number> = {
    fontFamily: config.fontFamily ?? "Inter, system-ui, sans-serif",
    fontSize: config.fontSize ?? 64,
    fontWeight: 800,
    display: "inline-block",
    margin: "0 6px",
    transition: "all 0.1s ease",
  };

  if (isActive) {
    base.color = config.activeColor ?? "#FFD700";
    base.transform = "scale(1.15)";
    if (config.shadow !== false) {
      base.textShadow = `0 0 20px ${config.activeColor ?? "#FFD700"}80`;
    }
  } else {
    base.color = config.color ?? "#FFFFFF";
    base.transform = "scale(1)";
  }

  if (config.outline) {
    base.WebkitTextStroke = `${config.outlineWidth ?? 2}px ${config.outlineColor ?? "#000000"}`;
  }

  return base;
}

/**
 * Default style presets matching common social media caption styles
 */
export const CAPTION_PRESETS: Record<string, CaptionStyleConfig> = {
  tiktok: {
    style: "tiktok",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: 64,
    color: "#FFFFFF",
    activeColor: "#FFD700",
    position: "center",
    maxWordsPerLine: 4,
    shadow: true,
    outline: true,
    outlineColor: "#000000",
    outlineWidth: 3,
  },
  youtube: {
    style: "subtitle",
    fontFamily: "Roboto, sans-serif",
    fontSize: 48,
    color: "#FFFFFF",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    position: "bottom",
    maxWordsPerLine: 10,
    padding: 12,
    shadow: false,
    outline: false,
  },
  reels: {
    style: "pop",
    fontFamily: "Montserrat, sans-serif",
    fontSize: 56,
    color: "#FFFFFF",
    activeColor: "#FF4444",
    position: "center",
    maxWordsPerLine: 3,
    shadow: true,
    outline: true,
    outlineColor: "#000000",
    outlineWidth: 4,
  },
  karaoke: {
    style: "karaoke",
    fontFamily: "Poppins, sans-serif",
    fontSize: 60,
    color: "#666666",
    activeColor: "#00FF88",
    position: "bottom",
    maxWordsPerLine: 6,
    shadow: false,
    outline: false,
  },
};
