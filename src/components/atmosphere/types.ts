export type AtmosphereIntensity = "low" | "medium" | "high";

export type AtmosphereMode = "glow" | "mesh" | "scan";

export interface AtmosphereDrawArgs {
  time: number;
  width: number;
  height: number;
  alpha: number;
  seed: number;
}

export type AtmosphereDrawFn = (
  ctx: CanvasRenderingContext2D,
  args: AtmosphereDrawArgs
) => void;
