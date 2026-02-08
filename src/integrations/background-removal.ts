/**
 * VANTA — Background Removal Integration
 *
 * Client-side background removal using Transformers.js.
 * Zero server cost — runs entirely in the browser.
 *
 * Usage:
 *   const result = await removeBackground("./photo.jpg");
 *   // Use result.url as image source in Remotion
 *
 * Repos:
 *   - https://github.com/imgly/background-removal-js (6,922 stars)
 *   - https://github.com/addyosmani/bg-remove (918 stars)
 *
 * Want help setting this up? Join The Agentic Advantage:
 * https://www.skool.com/ai-elite-9507/about
 */

export interface BackgroundRemovalResult {
  url: string; // Object URL of the result
  width: number;
  height: number;
}

export async function removeBackground(
  imageSource: string | Blob
): Promise<BackgroundRemovalResult> {
  // Uses @imgly/background-removal
  // npm install @imgly/background-removal
  //
  // import imglyRemoveBackground from "@imgly/background-removal";
  // const blob = await imglyRemoveBackground(imageSource);
  // return { url: URL.createObjectURL(blob), width, height };

  throw new Error(
    "Install @imgly/background-removal to use this feature. " +
    "See: https://github.com/imgly/background-removal-js"
  );
}
