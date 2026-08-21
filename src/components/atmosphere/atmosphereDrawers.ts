import type { AtmosphereDrawFn } from "./types";

/**
 * "Field glow" — 3 large soft radial gradients drifting slowly around the
 * center. Reads as a faint, breathing light source rather than a moving
 * shape. Best on hero images and centered subjects.
 */
export const drawGlow: AtmosphereDrawFn = (ctx, { time, width, height, alpha, seed }) => {
  ctx.clearRect(0, 0, width, height);
  const t = time * 0.00006;
  const blobCount = 4;

  for (let i = 0; i < blobCount; i++) {
    const phase = t + i * 2.1 + seed;
    const cx = width * (0.5 + 0.34 * Math.cos(phase * 0.7));
    const cy = height * (0.5 + 0.34 * Math.sin(phase * 0.9));
    const r = Math.max(width, height) * (0.3 + 0.05 * Math.sin(phase * 1.3));

    // A plateau (rather than a pure center-to-edge falloff) keeps the blob
    // reading as a soft patch of light instead of a tiny hot dot that
    // vanishes against a dark, low-contrast photograph — but capped well
    // below full alpha so overlapping blobs can't compound into a wash.
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
    gradient.addColorStop(0.5, `rgba(255,255,255,${alpha * 0.55})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
};

/**
 * "Topographic mesh" — a handful of horizontal contour lines that wobble
 * gently, like elevation lines breathing. Reads as measured/technical
 * rather than organic. Best on object/artifact photography.
 */
export const drawMesh: AtmosphereDrawFn = (ctx, { time, width, height, alpha, seed }) => {
  ctx.clearRect(0, 0, width, height);
  const t = time * 0.00004;
  const rows = 10;
  const step = Math.max(6, width / 60);

  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = Math.max(1.5, width / 380);

  for (let row = 0; row < rows; row++) {
    const baseY = (height / rows) * (row + 0.5);
    ctx.beginPath();
    for (let x = 0; x <= width; x += step) {
      const wobble = Math.sin(x * 0.02 + t * 6 + row * 1.3 + seed) * (height * 0.02);
      const y = baseY + wobble;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
};

/**
 * "Scan drift" — a soft horizontal band that travels the full height of the
 * image on a long, slow loop. Reads as a passive scanning pass rather than
 * a loading indicator as long as the cycle stays well above ~8s.
 */
export const drawScan: AtmosphereDrawFn = (ctx, { time, width, height, alpha, seed }) => {
  ctx.clearRect(0, 0, width, height);
  const cycleMs = 14000;
  const progress = ((time + seed * 1000) % cycleMs) / cycleMs;
  const bandY = height * progress;
  const bandHeight = height * 0.18;

  const gradient = ctx.createLinearGradient(0, bandY - bandHeight, 0, bandY + bandHeight);
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.4, `rgba(255,255,255,${alpha})`);
  gradient.addColorStop(0.6, `rgba(255,255,255,${alpha})`);
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, bandY - bandHeight, width, bandHeight * 2);
};

export const ATMOSPHERE_DRAWERS: Record<"glow" | "mesh" | "scan", AtmosphereDrawFn> = {
  glow: drawGlow,
  mesh: drawMesh,
  scan: drawScan,
};
