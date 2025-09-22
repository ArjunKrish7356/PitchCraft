"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

type BlobSpec = {
  seed: number;
  hue: number;
  sizeRem: number; // size in rem for consistent scaling
  blurPx: number;
  opacity: number;
};

// Small deterministic RNG based on a seed
function seededRand(
  seedRef: React.MutableRefObject<number>,
  min: number,
  max: number
) {
  // Simple pseudo-random number generator for deterministic results
  const x = Math.sin(seedRef.current++) * 10000;
  const frac = x - Math.floor(x);
  return min + frac * (max - min);
}

// One physics-updated blob with wrap-around bounds
function SpaceBlob({
  spec,
  containerRef,
}: {
  spec: BlobSpec;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);

  const seedRef = useRef(spec.seed);
  const pos = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const rotPhase = useRef(seededRand(seedRef, 0, Math.PI * 2));
  const scalePhase = useRef(seededRand(seedRef, 0, Math.PI * 2));
  const [initialized, setInitialized] = useState(false);

  // Memoize size in pixels to avoid recalculating it on every frame or render.
  // This also handles server-side rendering gracefully.
  const sizePx = useMemo(() => {
    if (typeof window === "undefined") return spec.sizeRem * 16; // Default for SSR
    const baseFont =
      parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return spec.sizeRem * baseFont;
  }, [spec.sizeRem]);

  // Initialize position/velocity once we know the container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (w === 0 || h === 0) return;

    // Prefer initial positions inside the current viewport so blobs are visible immediately
    const viewportH = typeof window !== "undefined" ? window.innerHeight : h;
    const initYMax = Math.min(h, viewportH);
    pos.current.x = seededRand(seedRef, 0, w);
    pos.current.y = seededRand(seedRef, 0, initYMax);

    // Slightly faster initial speed
    const speed = seededRand(seedRef, 20, 50);
    const theta = seededRand(seedRef, 0, Math.PI * 2);
    vel.current.x = Math.cos(theta) * speed;
    vel.current.y = Math.sin(theta) * speed;

    x.set(pos.current.x);
    y.set(pos.current.y);
    scale.set(1);
    rotate.set(0);
    setInitialized(true);
  }, [containerRef, scale, sizePx, x, y]);

  useAnimationFrame((t, deltaMs) => {
    if (!initialized) return;
    const el = containerRef.current;
    if (!el) return;

    const w = el.clientWidth;
    const h = el.clientHeight;
    const dt = Math.min(0.05, deltaMs / 1000); // Clamp large frames
    const time = t / 1000;

    // Faster drift: slightly higher frequency and amplitude
    const ax = Math.sin(time * 0.22 + spec.seed) * 8;
    const ay = Math.cos(time * 0.28 + spec.seed * 1.3) * 8;
    vel.current.x += ax * dt;
    vel.current.y += ay * dt;

    // Clamp speed to a moderately fast ambient range
    const speed = Math.hypot(vel.current.x, vel.current.y);
    const minSpeed = 18;
    const maxSpeed = 70;
    if (speed < minSpeed) {
      const f = (minSpeed + 1e-6) / (speed + 1e-6);
      vel.current.x *= f;
      vel.current.y *= f;
    } else if (speed > maxSpeed) {
      const f = maxSpeed / speed;
      vel.current.x *= f;
      vel.current.y *= f;
    }

    pos.current.x += vel.current.x * dt;
    pos.current.y += vel.current.y * dt;

    // Wrap around bounds with a margin equal to blob radius
    const margin = sizePx * 0.5;
    if (pos.current.x > w + margin) pos.current.x = -margin;
    if (pos.current.x < -margin) pos.current.x = w + margin;
    if (pos.current.y > h + margin) pos.current.y = -margin;
    if (pos.current.y < -margin) pos.current.y = h + margin;

    // Slower, more subtle oscillations for scale and rotation
    const s = 1 + 0.08 * Math.sin(time * 0.3 + scalePhase.current);
    const r = 20 * Math.sin(time * 0.25 + rotPhase.current);

    x.set(pos.current.x);
    y.set(pos.current.y);
    scale.set(s);
    rotate.set(r);
  });

  const color = `hsl(${spec.hue} 80% 80% / ${spec.opacity})`;

  return (
    <motion.div
      className="absolute top-0 left-0 rounded-full mix-blend-multiply pointer-events-none will-change-transform"
      style={{
        width: sizePx,
        height: sizePx,
        background: color,
        filter: `blur(${spec.blurPx}px)`,
        x,
        y,
        scale,
        rotate,
        // Center the transform origin
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
}

export default function AnimatedGradientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Exactly three blobs, sized to comfortably fit in view
  const blobs = useMemo<BlobSpec[]>(
    () => [
      { seed: 11, hue: 248, sizeRem: 24, blurPx: 60, opacity: 0.5 },
      { seed: 23, hue: 275, sizeRem: 20, blurPx: 55, opacity: 0.48 },
      { seed: 37, hue: 230, sizeRem: 26, blurPx: 65, opacity: 0.52 },
    ],
    []
  );

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0">
        {blobs.map((spec) => (
          <SpaceBlob key={spec.seed} spec={spec} containerRef={containerRef} />
        ))}
      </div>
    </div>
  );
}
