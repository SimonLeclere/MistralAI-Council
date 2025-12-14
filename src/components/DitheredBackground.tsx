"use client";

import { useEffect, useRef } from "react";

import {
  BAYER_MATRIX,
  calcNoise,
  paletteFromNoise,
  applyGradient,
  getTextPixel,
} from "@/lib/dither";

const LOADING_REVEAL_TEXTS = [
  "SUMMONING THE COUNCIL",
  "CONSULTING THE ARCHIVES",
  "REFINING THE ANSWERS",
  "FORGING A SYNTHESIS",
];

interface DitheredBackgroundProps {
  scale?: number; // Scale of the noise pattern
  blockSize?: number; // Size of each pixel block in screen pixels
  isLoading?: boolean; // loading state
  coloredRatio?: number; // Ratio of the screen height that is colored (0 to 1)
  revealText?: string; // user's question to reveal under the gradient once the data is loaded
  textYPosition?: number; // Fixed Y position for text in pixels
  gradientTargetY?: number; // Target Y position for gradient when data is loaded
}

export default function DitheredBackground({
  scale = 1.7,
  blockSize = 4,
  isLoading = false,
  coloredRatio = 0.5,
  revealText = "",
  textYPosition,
  gradientTargetY,
}: DitheredBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollYRef = useRef(0);
  const pageHeightRef = useRef(0);
  const viewportSizeRef = useRef({ width: 0, height: 0 });
  const loadingTextStateRef = useRef({
    index: 0,
    lastSwapAtMs: 0,
    wasHidden: false,
  });

  const stateRef = useRef({
    isLoading,
    coloredRatio,
    revealText,
    loadingProgress: coloredRatio,
    targetProgress: coloredRatio,
    textYPosition: textYPosition ?? 0,
    gradientTargetY: gradientTargetY ?? 0,
  });

  useEffect(() => {
    stateRef.current.isLoading = isLoading;
    stateRef.current.revealText = revealText;
    stateRef.current.textYPosition = textYPosition ?? 0;
    stateRef.current.gradientTargetY = gradientTargetY ?? 0;

    if (!gradientTargetY) {
      stateRef.current.targetProgress = isLoading ? 0.65 : coloredRatio;
    }
  }, [isLoading, coloredRatio, revealText, textYPosition, gradientTargetY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let lastFrameAtMs = 0;
    let imageData: ImageData | null = null;
    let data: Uint8ClampedArray | null = null;

    const resize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      viewportSizeRef.current.width = viewportWidth;
      viewportSizeRef.current.height = viewportHeight;

      // Render at low resolution (1 canvas pixel == 1 block), then upscale via CSS
      canvas.width = Math.ceil(viewportWidth / blockSize);
      canvas.height = Math.ceil(viewportHeight / blockSize);
      ctx.imageSmoothingEnabled = false;

      imageData = ctx.createImageData(canvas.width, canvas.height);
      data = imageData.data;

      pageHeightRef.current = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        window.innerHeight
      );
    };

    resize();
    window.addEventListener("resize", resize);

    const updateScroll = () => {
      scrollYRef.current = window.scrollY || window.pageYOffset || 0;
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.body);

    const animate = (nowMs: number) => {
      if (!lastFrameAtMs) lastFrameAtMs = nowMs;
      const dtMs = Math.min(50, nowMs - lastFrameAtMs);
      lastFrameAtMs = nowMs;
      time += (dtMs / 1000) * 0.48;

      const state = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;
      const viewportWidth = viewportSizeRef.current.width || window.innerWidth;
      const viewportHeight =
        viewportSizeRef.current.height || window.innerHeight;
      const pageHeight =
        pageHeightRef.current ||
        Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          window.innerHeight
        );
      const scrollY = scrollYRef.current;

      if (!imageData || !data) {
        // Can happen briefly before the first resize() initializes buffers.
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Calculate target based on gradientTargetY or ratio
      if (state.gradientTargetY > 0) {
        state.targetProgress = state.gradientTargetY / pageHeight;
      } else if (state.isLoading) {
        state.targetProgress = 0.5 + ((Math.sin(time * 2) + 1) / 2) * 0.3;
      }

      state.loadingProgress +=
        (state.targetProgress - state.loadingProgress) * 0.05;

      const color1 = { r: 240, g: 88, b: 34 };
      const color2 = { r: 220, g: 70, b: 20 };
      const color3 = { r: 255, g: 120, b: 60 };

      const coloredHeight = pageHeight * state.loadingProgress;

      const textPixelSize = blockSize * 2;
      const textStartY =
        state.textYPosition > 0 ? state.textYPosition : viewportHeight * 0.55;

      // Decide which text to render in the cutout.
      // While loading, rotate through loading texts, but only swap when the text area is fully white (white-on-white).
      let activeRevealText = state.revealText;

      if (state.isLoading) {
        const centerX = viewportWidth * 0.5;
        const waveAtCenter =
          Math.sin(centerX * 0.01 + time) * 20 +
          Math.sin(centerX * 0.02 - time * 0.8) * 10;
        const gradientHeight = 120;
        const fadeStartAtCenter =
          coloredHeight - gradientHeight / 2 + waveAtCenter;
        const textGlobalY = textStartY + scrollY;

        const isTextFullyInWhite =
          textGlobalY > fadeStartAtCenter + gradientHeight;
        const nowMs = performance.now();
        const loadingState = loadingTextStateRef.current;

        if (isTextFullyInWhite) {
          const shouldSwap =
            !loadingState.wasHidden || nowMs - loadingState.lastSwapAtMs > 900;
          if (shouldSwap) {
            loadingState.index =
              (loadingState.index + 1) % LOADING_REVEAL_TEXTS.length;
            loadingState.lastSwapAtMs = nowMs;
          }
        }

        loadingState.wasHidden = isTextFullyInWhite;
        activeRevealText =
          LOADING_REVEAL_TEXTS[loadingState.index] ??
          LOADING_REVEAL_TEXTS[0] ??
          "";
      }

      for (let y = 0; y < height; y++) {
        const worldY = y * blockSize;
        const globalY = worldY + scrollY;
        const by = Math.floor(globalY / blockSize) & 3;

        for (let x = 0; x < width; x++) {
          const worldX = x * blockSize;
          const nx = (worldX / viewportWidth) * scale;
          const ny = (globalY / pageHeight) * scale;

          const noise = calcNoise(nx, ny, time, scale);
          const threshold = BAYER_MATRIX[by][x & 3] / 16;

          let { r, g, b } = paletteFromNoise(
            noise,
            threshold,
            color1,
            color2,
            color3
          );

          const isTextPixel =
            activeRevealText &&
            getTextPixel(
              worldX,
              globalY,
              activeRevealText,
              textStartY,
              textPixelSize,
              viewportWidth
            );

          if (isTextPixel) {
            r = 250;
            g = 250;
            b = 250;
          } else {
            const applied = applyGradient(
              r,
              g,
              b,
              worldX,
              time,
              globalY,
              coloredHeight,
              threshold
            );
            r = applied.r;
            g = applied.g;
            b = applied.b;
          }

          const i = (y * width + x) * 4;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [scale, blockSize]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ imageRendering: "pixelated", pointerEvents: "none" }}
    />
  );
}
