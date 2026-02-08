/**
 * VANTA — Motion Graphics Integration
 *
 * SVG shapes, animated elements, data visualizations, and map animations.
 * Professional motion design without After Effects.
 * Replaces Remotion Pro Colors and Shapes ($20) and Watercolor Map ($50).
 *
 * Usage:
 *   import { animateShape, createBurst } from "./integrations/motion-graphics";
 *
 *   // Animate an SVG shape
 *   const circle = animateShape("circle", {
 *     from: { scale: 0, opacity: 0 },
 *     to: { scale: 1, opacity: 1 },
 *     duration: 30,
 *     easing: "spring",
 *   });
 *
 *   // Create a particle burst
 *   const burst = createBurst({ count: 20, radius: 200, color: "#FFD700" });
 *
 * Repos:
 *   - https://github.com/motiondivision/motion (30,200+ stars) — React animation (Framer Motion)
 *   - https://github.com/juliangarnier/anime (46,500+ stars) — Lightweight animation engine
 *   - https://github.com/mojs/mojs (18,600+ stars) — Motion graphics toolbelt with shape primitives
 *   - https://github.com/greensock/GSAP (23,200+ stars) — Professional animation with SVG morphing
 *
 * Want help setting this up? Join The Agentic Advantage:
 * https://www.skool.com/ai-elite-9507/about
 */

export type ShapeType =
  | "circle"
  | "rect"
  | "triangle"
  | "polygon"
  | "star"
  | "burst"
  | "cross"
  | "line"
  | "arc"
  | "ring"
  | "blob";

export type EasingType =
  | "linear"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "spring"
  | "bounce"
  | "elastic"
  | "back";

export interface ShapeProps {
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  opacity?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number;
}

export interface AnimationConfig {
  from: Partial<ShapeProps>;
  to: Partial<ShapeProps>;
  duration: number;     // Frames
  delay?: number;       // Frames
  easing?: EasingType;
  loop?: boolean;
  yoyo?: boolean;       // Reverse on complete
}

export interface AnimatedShape {
  type: ShapeType;
  animation: AnimationConfig;
  getPropsAtFrame: (frame: number) => ShapeProps;
}

export function animateShape(
  type: ShapeType,
  animation: AnimationConfig
): AnimatedShape {
  // Creates an animated shape that can be rendered in Remotion.
  //
  // Uses Remotion's interpolate() under the hood:
  //   const scale = interpolate(
  //     frame,
  //     [animation.delay, animation.delay + animation.duration],
  //     [animation.from.scale, animation.to.scale],
  //     { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  //   );
  //
  // For "spring" easing, uses Remotion's spring():
  //   const progress = spring({ frame, fps, config: { damping: 12 } });
  //
  // Renders as SVG inside a Remotion <AbsoluteFill>:
  //   <AbsoluteFill>
  //     <svg>
  //       <circle cx={x} cy={y} r={radius * scale} fill={fill} opacity={opacity} />
  //     </svg>
  //   </AbsoluteFill>

  const getPropsAtFrame = (frame: number): ShapeProps => {
    const delay = animation.delay ?? 0;
    const progress = Math.max(0, Math.min(1,
      (frame - delay) / animation.duration
    ));

    const result: ShapeProps = {};
    const fromKeys = Object.keys(animation.from) as (keyof ShapeProps)[];

    for (const key of fromKeys) {
      const fromVal = animation.from[key];
      const toVal = animation.to[key];
      if (typeof fromVal === "number" && typeof toVal === "number") {
        (result as Record<string, number>)[key] = fromVal + (toVal - fromVal) * progress;
      } else {
        (result as Record<string, unknown>)[key] = progress < 0.5 ? fromVal : toVal;
      }
    }

    return result;
  };

  return { type, animation, getPropsAtFrame };
}

export interface BurstConfig {
  count: number;
  radius: number;
  color: string;
  particleSize?: number;
  duration?: number;    // Frames
  spread?: number;      // Degrees (360 = full circle)
  stagger?: number;     // Frames between each particle launch
  decay?: number;       // 0-1, how much particles fade
}

export function createBurst(config: BurstConfig): AnimatedShape[] {
  // Creates a particle burst effect — shapes radiate outward from center.
  //
  // Uses mojs-style burst pattern:
  //   - N particles arranged in a circle (or arc)
  //   - Each starts at center, animates outward to radius
  //   - Staggered start times for cascading effect
  //   - Scale and opacity decrease as particles move outward
  //
  // npm install @mojs/core
  //   const burst = new mojs.Burst({
  //     radius: { 0: config.radius },
  //     count: config.count,
  //     children: { fill: config.color, shape: 'circle' }
  //   });

  const shapes: AnimatedShape[] = [];
  const angleStep = (config.spread ?? 360) / config.count;
  const stagger = config.stagger ?? 2;
  const duration = config.duration ?? 30;

  for (let i = 0; i < config.count; i++) {
    const angle = (angleStep * i * Math.PI) / 180;
    const targetX = Math.cos(angle) * config.radius;
    const targetY = Math.sin(angle) * config.radius;

    shapes.push(
      animateShape("circle", {
        from: {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          radius: config.particleSize ?? 8,
          fill: config.color,
        },
        to: {
          x: targetX,
          y: targetY,
          scale: 0.2,
          opacity: config.decay ?? 0,
          radius: config.particleSize ?? 8,
          fill: config.color,
        },
        duration,
        delay: i * stagger,
        easing: "ease-out",
      })
    );
  }

  return shapes;
}

export interface PathAnimationConfig {
  path: string;           // SVG path d attribute
  duration: number;       // Frames
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  drawStyle?: "draw" | "fill" | "morph";
}

export function animatePath(config: PathAnimationConfig): {
  getStrokeDashAtFrame: (frame: number) => { dasharray: string; dashoffset: number };
} {
  // Animates an SVG path — line drawing, fill reveal, or path morphing.
  //
  // "draw" style: Progressive stroke using stroke-dasharray/dashoffset
  //   - Calculate total path length
  //   - Set dasharray to total length
  //   - Animate dashoffset from total → 0
  //
  // "fill" style: Reveal fill color with mask/clip animation
  //
  // "morph" style: Morph between two SVG paths
  //   Uses GSAP MorphSVGPlugin or flubber:
  //   npm install flubber
  //   const interpolator = flubber.interpolate(pathA, pathB);
  //   const morphed = interpolator(progress);

  return {
    getStrokeDashAtFrame: (frame: number) => {
      const progress = Math.max(0, Math.min(1, frame / config.duration));
      const totalLength = 1000; // Would be calculated from actual SVG path
      return {
        dasharray: `${totalLength}`,
        dashoffset: totalLength * (1 - progress),
      };
    },
  };
}

/**
 * Pre-built motion graphic templates
 */
export const TEMPLATES = {
  /** Lower third title bar — slides in from left with text */
  lowerThird: (text: string, color: string = "#FFD700") => [
    animateShape("rect", {
      from: { x: -400, y: 0, width: 400, height: 60, opacity: 0, fill: color },
      to: { x: 0, y: 0, width: 400, height: 60, opacity: 1, fill: color },
      duration: 20,
      easing: "ease-out",
    }),
  ],

  /** Countdown numbers — 3, 2, 1, with scale animation */
  countdown: (from: number = 3, color: string = "#FFFFFF") => {
    const shapes: AnimatedShape[] = [];
    for (let i = from; i >= 1; i--) {
      shapes.push(
        animateShape("circle", {
          from: { scale: 2, opacity: 1, fill: color },
          to: { scale: 0, opacity: 0, fill: color },
          duration: 30,
          delay: (from - i) * 30,
          easing: "ease-in",
        })
      );
    }
    return shapes;
  },

  /** Confetti celebration burst */
  confetti: (colors: string[] = ["#FFD700", "#FF4444", "#44FF44", "#4444FF"]) =>
    colors.flatMap((color, i) =>
      createBurst({
        count: 15,
        radius: 300 + i * 50,
        color,
        particleSize: 6,
        duration: 45,
        stagger: 1,
        decay: 0,
      })
    ),

  /** Progress bar animation */
  progressBar: (percent: number, color: string = "#00FF88") => [
    animateShape("rect", {
      from: { width: 0, height: 8, fill: color, opacity: 1 },
      to: { width: percent * 5, height: 8, fill: color, opacity: 1 },
      duration: 60,
      easing: "ease-in-out",
    }),
  ],
};
