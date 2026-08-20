/**
 * One requestAnimationFrame loop shared by every mounted AtmosphereCanvas.
 * Cost stays roughly O(1) regardless of how many images are on the page —
 * a grid of 30 cards drives the same single RAF tick as one hero image.
 */

type FrameCallback = (time: number) => void;

class AtmosphereScheduler {
  private callbacks = new Map<symbol, FrameCallback>();
  private rafId: number | null = null;

  register(id: symbol, cb: FrameCallback) {
    this.callbacks.set(id, cb);
    this.ensureLoop();
  }

  unregister(id: symbol) {
    this.callbacks.delete(id);
    if (this.callbacks.size === 0 && this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private ensureLoop() {
    if (this.rafId !== null) return;
    const tick = (time: number) => {
      this.callbacks.forEach((cb) => cb(time));
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }
}

export const atmosphereScheduler = new AtmosphereScheduler();
