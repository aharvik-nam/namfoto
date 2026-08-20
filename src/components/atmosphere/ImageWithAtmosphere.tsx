import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { AtmosphereCanvas } from "./AtmosphereCanvas";
import type { AtmosphereIntensity, AtmosphereMode } from "./types";
import "./image-with-atmosphere.css";

export interface ImageWithAtmosphereProps {
  src: string;
  alt: string;
  /** Overlay strength. Default "medium". */
  intensity?: AtmosphereIntensity;
  /** Visual direction. Default "glow". */
  mode?: AtmosphereMode;
  /** Small pointer-driven parallax on the overlay only, never the photo. */
  interactive?: boolean;
  /** What to show instead of the animated layer when the user prefers reduced motion. */
  reducedMotionFallback?: "static" | "none";
  aspectRatio?: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  /** Eager-load hint for above-the-fold / hero usage. */
  priority?: boolean;
  /** Optional caption/label layer, rendered above the overlay with pointer-events restored. */
  children?: ReactNode;
}

export function ImageWithAtmosphere({
  src,
  alt,
  intensity = "medium",
  mode = "glow",
  interactive = false,
  reducedMotionFallback = "static",
  aspectRatio,
  className = "",
  imgClassName = "",
  sizes,
  priority = false,
  children,
}: ImageWithAtmosphereProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // A stable per-instance seed so identical cards in a grid don't animate in lockstep.
  const seedRef = useRef(Math.random() * 1000);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(query.matches);
    const onChange = () => setPrefersReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.1,
      rootMargin: "80px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animationActive = inView && !prefersReducedMotion;
  const skipOverlay = prefersReducedMotion && reducedMotionFallback === "none";

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!interactive || prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x, y });
  }

  function handlePointerLeave() {
    setTilt({ x: 0, y: 0 });
  }

  const wrapperStyle: CSSProperties & Record<string, string | number | undefined> = {
    aspectRatio,
    "--atmosphere-tilt-x": `${tilt.x * 6}px`,
    "--atmosphere-tilt-y": `${tilt.y * 6}px`,
  };

  return (
    <div
      ref={wrapperRef}
      className={`atmosphere-wrapper atmosphere-${mode} atmosphere-${intensity} ${className}`}
      style={wrapperStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`atmosphere-image ${imgClassName}`}
      />

      <div className="atmosphere-tint" aria-hidden="true" />

      {!skipOverlay && (
        <div className="atmosphere-layer" aria-hidden="true">
          <AtmosphereCanvas mode={mode} intensity={intensity} active={animationActive} seed={seedRef.current} />
        </div>
      )}

      {children && <div className="atmosphere-content">{children}</div>}
    </div>
  );
}
