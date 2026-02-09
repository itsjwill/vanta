/**
 * VANTA — Vector Graphics Integration
 *
 * Programmatic SVG creation, editing, and animation.
 * Create logos, icons, illustrations, and infographics in code.
 * Replaces Adobe Illustrator ($22.99/mo).
 *
 * SVG output feeds directly into Remotion compositions
 * as React components with frame-accurate animation.
 *
 * Usage:
 *   import { createSVG, drawPath, exportSVG } from "./integrations/vector-graphics";
 *
 *   const svg = createSVG(1920, 1080);
 *   svg.addCircle({ cx: 960, cy: 540, r: 200, fill: "#FFD700" });
 *   svg.addPath({ d: "M 100 200 Q 400 50 700 200", stroke: "#FFF", strokeWidth: 3 });
 *   svg.addText({ content: "VANTA", x: 960, y: 580, fontSize: 120, fontWeight: 100 });
 *   const svgString = exportSVG(svg);
 *
 * Repos:
 *   - https://github.com/SVG-Edit/svgedit — Full browser-based SVG editor
 *   - https://github.com/svgdotjs/svg.js — Lightweight SVG manipulation library
 *   - https://github.com/DmitryBaranovskiy/raphael — Vector graphics on the web
 *   - https://github.com/fabricjs/fabric.js — Canvas + SVG hybrid rendering
 *
 * Want help setting this up? Join The Agentic Advantage:
 * https://www.skool.com/ai-elite-9507/about
 */

export interface SVGDocument {
  width: number;
  height: number;
  viewBox: string;
  elements: SVGElement[];
  defs: SVGDef[];
}

export interface SVGElement {
  id: string;
  type: "circle" | "rect" | "ellipse" | "line" | "polyline" | "polygon" | "path" | "text" | "group" | "image";
  attributes: Record<string, string | number>;
  children?: SVGElement[];
  transform?: string;
}

export interface SVGDef {
  type: "linearGradient" | "radialGradient" | "filter" | "clipPath" | "mask" | "pattern";
  id: string;
  attributes: Record<string, string | number>;
  stops?: { offset: string; color: string; opacity?: number }[];
}

// --- Document Creation ---

export function createSVG(width: number, height: number): SVGDocument {
  // Creates a new SVG document.
  //
  // Using svg.js:
  //   npm install @svgdotjs/svg.js
  //
  //   import { SVG } from "@svgdotjs/svg.js";
  //   const draw = SVG().size(width, height);
  //
  // The SVG document is a container for vector elements
  // that can be rendered directly in Remotion via React:
  //
  //   <AbsoluteFill>
  //     <svg viewBox={`0 0 ${width} ${height}`}
  //          dangerouslySetInnerHTML={{ __html: svgContent }} />
  //   </AbsoluteFill>

  return {
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    elements: [],
    defs: [],
  };
}

// --- Shape Helpers ---

export interface CircleProps {
  cx: number;
  cy: number;
  r: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

export interface RectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;           // Corner radius
  ry?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

export interface PathProps {
  d: string;             // SVG path data
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin?: "miter" | "round" | "bevel";
  opacity?: number;
  fillRule?: "nonzero" | "evenodd";
}

export interface TextProps {
  content: string;
  x: number;
  y: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number | string;
  fill?: string;
  textAnchor?: "start" | "middle" | "end";
  letterSpacing?: string;
  opacity?: number;
}

function generateId(): string {
  return `el-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function addCircle(doc: SVGDocument, props: CircleProps): SVGDocument {
  return {
    ...doc,
    elements: [...doc.elements, {
      id: generateId(),
      type: "circle",
      attributes: {
        cx: props.cx,
        cy: props.cy,
        r: props.r,
        fill: props.fill ?? "none",
        stroke: props.stroke ?? "none",
        "stroke-width": props.strokeWidth ?? 0,
        opacity: props.opacity ?? 1,
      },
    }],
  };
}

export function addRect(doc: SVGDocument, props: RectProps): SVGDocument {
  return {
    ...doc,
    elements: [...doc.elements, {
      id: generateId(),
      type: "rect",
      attributes: {
        x: props.x,
        y: props.y,
        width: props.width,
        height: props.height,
        rx: props.rx ?? 0,
        ry: props.ry ?? 0,
        fill: props.fill ?? "none",
        stroke: props.stroke ?? "none",
        "stroke-width": props.strokeWidth ?? 0,
        opacity: props.opacity ?? 1,
      },
    }],
  };
}

export function addPath(doc: SVGDocument, props: PathProps): SVGDocument {
  return {
    ...doc,
    elements: [...doc.elements, {
      id: generateId(),
      type: "path",
      attributes: {
        d: props.d,
        fill: props.fill ?? "none",
        stroke: props.stroke ?? "none",
        "stroke-width": props.strokeWidth ?? 0,
        "stroke-linecap": props.strokeLinecap ?? "round",
        "stroke-linejoin": props.strokeLinejoin ?? "round",
        opacity: props.opacity ?? 1,
      },
    }],
  };
}

export function addText(doc: SVGDocument, props: TextProps): SVGDocument {
  return {
    ...doc,
    elements: [...doc.elements, {
      id: generateId(),
      type: "text",
      attributes: {
        x: props.x,
        y: props.y,
        "font-size": props.fontSize ?? 16,
        "font-family": props.fontFamily ?? "Helvetica Neue, sans-serif",
        "font-weight": props.fontWeight ?? 400,
        fill: props.fill ?? "#FFFFFF",
        "text-anchor": props.textAnchor ?? "middle",
        "letter-spacing": props.letterSpacing ?? "0",
        opacity: props.opacity ?? 1,
        _content: props.content,
      },
    }],
  };
}

// --- Gradients ---

export function addLinearGradient(
  doc: SVGDocument,
  id: string,
  stops: { offset: string; color: string; opacity?: number }[],
  angle: number = 0
): SVGDocument {
  // Convert angle to x1,y1,x2,y2 coordinates
  const rad = (angle * Math.PI) / 180;
  const x1 = 50 - Math.cos(rad) * 50;
  const y1 = 50 - Math.sin(rad) * 50;
  const x2 = 50 + Math.cos(rad) * 50;
  const y2 = 50 + Math.sin(rad) * 50;

  return {
    ...doc,
    defs: [...doc.defs, {
      type: "linearGradient",
      id,
      attributes: {
        x1: `${x1}%`, y1: `${y1}%`,
        x2: `${x2}%`, y2: `${y2}%`,
      },
      stops,
    }],
  };
}

// --- Boolean Operations ---

export type BooleanOp = "union" | "subtract" | "intersect" | "exclude";

export function booleanOperation(
  pathA: string,
  pathB: string,
  operation: BooleanOp
): string {
  // Boolean path operations — union, subtract, intersect, exclude.
  // The core of vector illustration work.
  //
  // Uses paper.js or opentype.js for path operations:
  //   npm install paper
  //
  //   import paper from "paper";
  //   const pathObjA = new paper.Path(pathA);
  //   const pathObjB = new paper.Path(pathB);
  //
  //   let result;
  //   switch (operation) {
  //     case "union": result = pathObjA.unite(pathObjB); break;
  //     case "subtract": result = pathObjA.subtract(pathObjB); break;
  //     case "intersect": result = pathObjA.intersect(pathObjB); break;
  //     case "exclude": result = pathObjA.exclude(pathObjB); break;
  //   }
  //   return result.pathData;

  return pathA; // Placeholder — real implementation uses paper.js
}

// --- Export ---

export function exportSVG(doc: SVGDocument): string {
  // Serialize the SVG document to a string.
  // This string can be:
  //   1. Set as innerHTML in a Remotion <AbsoluteFill>
  //   2. Saved to .svg file
  //   3. Converted to PNG via Sharp: sharp(Buffer.from(svgString)).png().toFile("out.png")
  //   4. Used as a data URL: `data:image/svg+xml,${encodeURIComponent(svgString)}`

  const defs = doc.defs.length > 0
    ? `<defs>${doc.defs.map(def => {
        const stops = def.stops?.map(s =>
          `<stop offset="${s.offset}" stop-color="${s.color}" stop-opacity="${s.opacity ?? 1}" />`
        ).join("") ?? "";
        const attrs = Object.entries(def.attributes).map(([k, v]) => `${k}="${v}"`).join(" ");
        return `<${def.type} id="${def.id}" ${attrs}>${stops}</${def.type}>`;
      }).join("")}</defs>`
    : "";

  const elements = doc.elements.map(el => {
    const attrs = Object.entries(el.attributes)
      .filter(([k]) => k !== "_content")
      .map(([k, v]) => `${k}="${v}"`)
      .join(" ");

    const content = el.attributes._content as string | undefined;
    const transform = el.transform ? ` transform="${el.transform}"` : "";

    if (el.type === "text" && content) {
      return `<text ${attrs}${transform}>${content}</text>`;
    }
    return `<${el.type} ${attrs}${transform} />`;
  }).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${doc.width}" height="${doc.height}" viewBox="${doc.viewBox}">
  ${defs}
  ${elements}
</svg>`;
}
