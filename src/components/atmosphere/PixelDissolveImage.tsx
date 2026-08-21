import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import "./pixel-dissolve.css";

export interface PixelDissolveImageProps {
  /** Crisp, original photograph. */
  src: string;
  /** Pre-pixelated / mosaic version of the same photograph. */
  pixelSrc: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  /** Wipe direction in degrees. Default reads roughly left-to-right, angled. */
  angle?: number;
  /** Seconds for one full sweep pass. */
  speed?: number;
  /** Scattered twinkling accent marks over the frame. */
  sparkles?: boolean;
  priority?: boolean;
}

function useInViewMotion() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(query.matches);
    const onChange = () => setPrefersReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
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

  return { ref, animate: inView && !prefersReducedMotion };
}

function SparkleField({ count = 16 }: { count?: number }) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 3 + Math.random() * 5,
        delay: Math.random() * 6,
        duration: 3 + Math.random() * 4,
      })),
    [count]
  );

  return (
    <div className="pixel-dissolve-sparkles" aria-hidden="true">
      {sparkles.map((s, i) => (
        <span
          key={i}
          className="pixel-dissolve-sparkle"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function PixelDissolveImage({
  src,
  pixelSrc,
  alt,
  aspectRatio,
  className = "",
  angle = 105,
  speed = 16,
  sparkles = true,
  priority = false,
}: PixelDissolveImageProps) {
  const { ref, animate } = useInViewMotion();

  const gradient = `linear-gradient(${angle}deg, transparent 0%, transparent 30%, black 55%, black 100%)`;
  const crispStyle: CSSProperties = {
    maskImage: gradient,
    WebkitMaskImage: gradient,
    animationDuration: `${speed}s`,
  };

  return (
    <div ref={ref} className={`pixel-dissolve ${className}`} style={{ aspectRatio }}>
      <img
        src={pixelSrc}
        alt=""
        aria-hidden="true"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="pixel-dissolve-base"
      />
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`pixel-dissolve-crisp ${animate ? "is-animating" : ""}`}
        style={crispStyle}
      />
      {sparkles && <SparkleField />}
    </div>
  );
}
