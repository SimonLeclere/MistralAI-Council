import { PIXEL_FONT } from './pixelFont';

export const BAYER_MATRIX = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export type Color = { r: number; g: number; b: number };

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function calcNoise(nx: number, ny: number, time: number, scale: number) {
  const flow1 = Math.sin(nx * (6 * scale) + time) * Math.cos(ny * (4 * scale) + time * 0.7);
  const flow2 = Math.sin(nx * (3 * scale) - time * 0.5 + ny * (5 * scale)) * 0.5;
  const flow3 = Math.cos(nx * (8 * scale) + ny * (3 * scale) + time * 1.2) * 0.3;
  const flow4 = Math.sin((nx + ny) * (10 * scale) + time * 0.3) * 0.2;

  let noise = (flow1 + flow2 + flow3 + flow4) * 0.5 + 0.5;

  const angle = Math.atan2(ny - 0.5, nx - 0.5);
  const dist = Math.sqrt((nx - 0.5) ** 2 + (ny - 0.5) ** 2);
  const swirl = Math.sin(dist * 10 - time * 2 + angle * 3) * 0.15;
  noise += swirl;

  return clamp01(noise);
}

export function paletteFromNoise(noise: number, threshold: number, color1: Color, color2: Color, color3: Color) {
  let r = 0;
  let g = 0;
  let b = 0;

  if (noise < 0.33) {
    const t = noise < threshold * 0.33 ? 0 : 1;
    r = color2.r + (color1.r - color2.r) * t;
    g = color2.g + (color1.g - color2.g) * t;
    b = color2.b + (color1.b - color2.b) * t;
  } else if (noise < 0.66) {
    const t = (noise - 0.33) / 0.33 < threshold ? 0 : 1;
    r = color1.r + (color3.r - color1.r) * t;
    g = color1.g + (color3.g - color1.g) * t;
    b = color1.b + (color3.b - color1.b) * t;
  } else {
    const t = (noise - 0.66) / 0.34 < threshold ? 0 : 1;
    r = color3.r * (1 - t * 0.1);
    g = color3.g * (1 - t * 0.1);
    b = color3.b * (1 - t * 0.1);
  }

  return { r, g, b };
}

export function applyGradient(r: number, g: number, b: number, worldX: number, time: number, globalY: number, coloredHeight: number, threshold: number) {
  const wave = Math.sin(worldX * 0.01 + time) * 20 + Math.sin(worldX * 0.02 - time * 0.8) * 10;
  const gradientHeight = 120;
  const fadeStart = coloredHeight - gradientHeight / 2 + wave;

  if (globalY > fadeStart) {
    const fadeProgress = Math.min(1, (globalY - fadeStart) / gradientHeight);

    if (fadeProgress > threshold * 0.9 + 0.05) {
      return { r: 250, g: 250, b: 250 };
    } else {
      const tint = fadeProgress * 0.6;
      r = r + (255 - r) * tint;
      g = g + (255 - g) * tint;
      b = b + (255 - b) * tint;
      return { r, g, b };
    }
  }

  return { r, g, b };
}

export const getTextPixel = (
  px: number,
  py: number,
  text: string,
  startY: number,
  pixelSize: number,
  viewportWidth: number
) => {
  if (!text) return false;

  const charWidth = 5;
  const charHeight = 7;
  const charSpacing = 1;
  const totalCharWidth = (charWidth + charSpacing) * pixelSize;
  const textWidth = text.length * totalCharWidth;
  const startX = (viewportWidth - textWidth) / 2;

  if (py < startY || py >= startY + charHeight * pixelSize) return false;
  if (px < startX || px >= startX + textWidth) return false;

  const relX = px - startX;
  const relY = py - startY;
  const charIndex = Math.floor(relX / totalCharWidth);
  const charPixelX = Math.floor((relX % totalCharWidth) / pixelSize);
  const charPixelY = Math.floor(relY / pixelSize);

  if (charPixelX >= charWidth) return false;

  const char = text[charIndex]?.toUpperCase() || ' ';
  const charData = PIXEL_FONT[char] || PIXEL_FONT[' '];

  if (!charData || charPixelY >= charData.length) return false;

  const bit = (charData[charPixelY] >> (4 - charPixelX)) & 1;
  return bit === 1;
};
