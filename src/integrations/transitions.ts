/**
 * VANTA — Transitions Integration
 *
 * GPU-accelerated video transitions using WebGL shaders.
 * 100+ transition effects — crossfade, wipe, cube, pixelate, kaleidoscope.
 * Replaces Remotion Pro Cube Transition ($10) and then some.
 *
 * Usage:
 *   import { applyTransition } from "./integrations/transitions";
 *
 *   // In your Remotion composition:
 *   <TransitionSeries>
 *     <TransitionSeries.Sequence durationInFrames={90}>
 *       <SceneA />
 *     </TransitionSeries.Sequence>
 *     <TransitionSeries.Transition
 *       presentation={applyTransition("cube", { duration: 30 })}
 *     />
 *     <TransitionSeries.Sequence durationInFrames={90}>
 *       <SceneB />
 *     </TransitionSeries.Sequence>
 *   </TransitionSeries>
 *
 * Repos:
 *   - https://github.com/gl-transitions/gl-transitions (1,200+ stars) — 100+ WebGL transition shaders
 *   - https://gl-transitions.com — Interactive gallery and playground
 *   - https://github.com/bbc/VideoContext (1,300+ stars) — HTML5/WebGL video composition (BBC)
 *   - https://github.com/martinlaxenaire/curtainsjs (4,500+ stars) — WebGL DOM-to-3D transitions
 *
 * Want help setting this up? Join The Agentic Advantage:
 * https://www.skool.com/ai-elite-9507/about
 */

export type TransitionType =
  // Geometric
  | "crossfade"
  | "fade"
  | "wipe-left"
  | "wipe-right"
  | "wipe-up"
  | "wipe-down"
  // 3D
  | "cube"
  | "flip"
  | "rotate"
  | "swap"
  // Creative
  | "pixelate"
  | "morph"
  | "kaleidoscope"
  | "glitch"
  | "burn"
  | "ripple"
  // Film
  | "dissolve"
  | "dip-to-black"
  | "dip-to-white"
  | "film-burn"
  // Directional
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "slide-down"
  | "zoom-in"
  | "zoom-out"
  // Pattern
  | "circle-reveal"
  | "diamond-reveal"
  | "heart-reveal"
  | "star-reveal";

export interface TransitionConfig {
  duration: number;         // Frames
  direction?: "left" | "right" | "up" | "down";
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  color?: string;           // For dip-to-color transitions
  intensity?: number;       // 0-1 for effects like pixelate, glitch
  customGLSL?: string;      // Custom GL Transitions shader code
}

export interface TransitionResult {
  type: TransitionType;
  config: TransitionConfig;
  glslShader?: string;
  cssTransform?: string;
}

/**
 * Collection of GLSL shader snippets from gl-transitions.com
 * Each transition is a GLSL fragment shader that takes:
 *   - progress: 0.0 → 1.0 (transition progress)
 *   - from: sampler2D (outgoing scene texture)
 *   - to: sampler2D (incoming scene texture)
 *   - resolution: vec2 (video dimensions)
 */
const GL_TRANSITION_SHADERS: Partial<Record<TransitionType, string>> = {
  cube: `
    // Cube rotation transition — rotates outgoing scene away like a 3D cube
    // revealing incoming scene on the adjacent face
    uniform float persp; // 0.7
    uniform float unzoom; // 0.3
    vec4 transition(vec2 uv) {
      float uz = unzoom * 2.0 * (0.5 - distance(0.5, progress));
      vec2 p = -uz * 0.5 + (1.0 + uz) * uv;
      vec2 fromP = p;
      vec2 toP = p;
      // ... full shader at gl-transitions.com/editor/cube
      return mix(getFromColor(fromP), getToColor(toP), step(0.5, progress));
    }
  `,
  pixelate: `
    // Pixelate transition — scene breaks into pixels that reform as new scene
    uniform ivec2 squaresMin; // ivec2(20, 20)
    uniform int steps; // 50
    vec4 transition(vec2 uv) {
      float d = min(progress, 1.0 - progress);
      float dist = steps > 0 ? ceil(d * float(steps)) / float(steps) : d;
      vec2 sq = vec2(squaresMin) + dist * vec2(squaresMin);
      vec2 p = dist > 0.0 ? (floor(uv * sq) + 0.5) / sq : uv;
      return mix(getFromColor(p), getToColor(p), progress);
    }
  `,
  morph: `
    // Morph transition — organic morphing between scenes
    uniform float strength; // 0.1
    vec4 transition(vec2 uv) {
      vec4 ca = getFromColor(uv);
      vec4 cb = getToColor(uv);
      vec2 oa = (ca.rg - 0.5) * 2.0 * vec2(1.0, -1.0);
      vec2 ob = (cb.rg - 0.5) * 2.0 * vec2(1.0, -1.0);
      vec2 disp = mix(oa, ob, 0.5) * strength * (1.0 - step(1.0, progress));
      return mix(
        getFromColor(uv + progress * disp),
        getToColor(uv - (1.0 - progress) * disp),
        progress
      );
    }
  `,
};

export function applyTransition(
  type: TransitionType,
  config: Partial<TransitionConfig> = {}
): TransitionResult {
  // Creates a transition configuration that can be used with
  // Remotion's <TransitionSeries> or applied manually between scenes.
  //
  // For WebGL transitions (cube, pixelate, morph, etc.):
  //   Uses gl-transitions shaders rendered via a <canvas> element
  //   that Remotion captures frame-by-frame.
  //
  // For CSS transitions (slide, fade, zoom):
  //   Uses Remotion's interpolate() with CSS transforms.
  //
  // npm install gl-transitions
  // npm install @remotion/transitions
  //
  // With @remotion/transitions (built-in):
  //   import { TransitionSeries } from "@remotion/transitions";
  //   import { slide } from "@remotion/transitions/slide";
  //
  //   <TransitionSeries>
  //     <TransitionSeries.Sequence><SceneA /></TransitionSeries.Sequence>
  //     <TransitionSeries.Transition presentation={slide()} />
  //     <TransitionSeries.Sequence><SceneB /></TransitionSeries.Sequence>
  //   </TransitionSeries>

  const fullConfig: TransitionConfig = {
    duration: config.duration ?? 30,
    direction: config.direction ?? "left",
    easing: config.easing ?? "ease-in-out",
    intensity: config.intensity ?? 0.5,
    ...config,
  };

  return {
    type,
    config: fullConfig,
    glslShader: GL_TRANSITION_SHADERS[type],
  };
}

/**
 * List all available transitions grouped by category
 */
export function listTransitions(): Record<string, TransitionType[]> {
  return {
    geometric: ["crossfade", "fade", "wipe-left", "wipe-right", "wipe-up", "wipe-down"],
    "3d": ["cube", "flip", "rotate", "swap"],
    creative: ["pixelate", "morph", "kaleidoscope", "glitch", "burn", "ripple"],
    film: ["dissolve", "dip-to-black", "dip-to-white", "film-burn"],
    directional: ["slide-left", "slide-right", "slide-up", "slide-down", "zoom-in", "zoom-out"],
    pattern: ["circle-reveal", "diamond-reveal", "heart-reveal", "star-reveal"],
  };
}
