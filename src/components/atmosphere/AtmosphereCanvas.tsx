import { useEffect, useRef } from "react";
import { atmosphereScheduler } from "./atmosphereScheduler";
import { ATMOSPHERE_DRAWERS } from "./atmosphereDrawers";
import type { AtmosphereIntensity, AtmosphereMode } from "./types";

interface AtmosphereCanvasProps {
  mode: AtmosphereMode;
  intensity: AtmosphereIntensity;
  /** Visible in viewport AND motion allowed. False = fully paused, no RAF cost. */
  active: boolean;
  /** Offsets the animation phase so identical cards in a grid don't sync up. */
  seed?: number;
}

const INTENSITY_ALPHA: Record<AtmosphereIntensity, number> = {
  low: 0.1,
  medium: 0.18,
  high: 0.3,
};

export function AtmosphereCanvas({ mode, intensity, active, seed = 0 }: AtmosphereCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const idRef = useRef(Symbol("atmosphere-canvas"));

  // Keep the backing store sized to the container, capped at 2x DPR so a
  // grid of cards on a 3x-retina display doesn't blow the fill-rate budget.
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = ATMOSPHERE_DRAWERS[mode];
    const alpha = INTENSITY_ALPHA[intensity];
    const id = idRef.current;

    atmosphereScheduler.register(id, (time) => {
      draw(ctx, { time, width: canvas.width, height: canvas.height, alpha, seed });
    });

    return () => {
      atmosphereScheduler.unregister(id);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [mode, intensity, active, seed]);

  return <canvas ref={canvasRef} className="atmosphere-canvas" aria-hidden="true" />;
}
