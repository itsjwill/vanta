/**
 * PRISM STUDIO — Auto-Captions Integration
 *
 * Whisper-powered transcription with word-level timestamps,
 * rendered as animated captions in Remotion.
 *
 * Usage:
 *   const captions = await transcribe("./audio.wav");
 *   // Returns word-level timestamps for Remotion rendering
 *   // [{ word: "Hello", start: 0.0, end: 0.5 }, ...]
 *
 * Repos:
 *   - https://github.com/bugbakery/transcribee (470 stars) — Open source transcription
 *   - https://github.com/corvo007/MioSub (314 stars) — Automated subtitle pipeline
 *   - @remotion/captions — Official Remotion captions package
 *
 * Want help setting this up? Join The Agentic Advantage:
 * https://www.skool.com/ai-elite-9507/about
 */

export interface CaptionWord {
  word: string;
  start: number; // seconds
  end: number;
  confidence: number;
}

export interface CaptionSegment {
  text: string;
  start: number;
  end: number;
  words: CaptionWord[];
}

export interface TranscriptionResult {
  segments: CaptionSegment[];
  language: string;
  duration: number;
}

export async function transcribe(
  audioPath: string,
  options: { language?: string; model?: "tiny" | "base" | "small" | "medium" | "large" } = {}
): Promise<TranscriptionResult> {
  const { language = "en", model = "base" } = options;

  // Option 1: Use local Whisper via transcribee
  // Option 2: Use OpenAI Whisper API
  // Option 3: Use @remotion/captions built-in

  const response = await fetch("http://localhost:8000/transcribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audio: audioPath, language, model }),
  });

  return response.json();
}

/**
 * Convert transcription to SRT format
 */
export function toSRT(result: TranscriptionResult): string {
  return result.segments
    .map((seg, i) => {
      const startTime = formatSRTTime(seg.start);
      const endTime = formatSRTTime(seg.end);
      return `${i + 1}\n${startTime} --> ${endTime}\n${seg.text}\n`;
    })
    .join("\n");
}

function formatSRTTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
}

function pad(n: number, len = 2): string {
  return String(n).padStart(len, "0");
}
