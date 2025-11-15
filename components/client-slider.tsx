"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useMotionValue, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ClientSliderProps = {
  children: React.ReactNode;
  className?: string;
  gap?: number; // px between logos
  speed?: number; // px per second
  speedOnHover?: number; // px per second when hovered
  pauseOnHover?: boolean;
};

export function ClientSlider({
  children,
  className,
  gap = 28,
  speed = 120,
  speedOnHover = 100,
  pauseOnHover = true,
}: ClientSliderProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const firstTrackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [runningSpeed, setRunningSpeed] = useState(speed);
  const controlsRef = useRef<any>(null);

  // Duplicate children once for seamless loop
  const items = useMemo(() => {
    const kids = Array.isArray(children) ? children : [children];
    return kids;
  }, [children]);

  // Measure the true width of the first track (not the viewport)
  useEffect(() => {
    const update = () => {
      const w = firstTrackRef.current?.scrollWidth ?? 0;
      setTrackWidth(w);
    };
    update();
    const ro = new ResizeObserver(update);
    if (firstTrackRef.current) ro.observe(firstTrackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [items]);

  // Run the marquee based on pixels-per-second so duration scales with content length
  useEffect(() => {
    if (!trackWidth || runningSpeed === 0) {
      controlsRef.current?.stop();
      return;
    }

    const distance = -trackWidth; // move left by exactly one set
    const duration = Math.max(0.001, Math.abs(distance) / runningSpeed); // s

    // Stop previous animation
    controlsRef.current?.stop();

    // Store current progress to resume smoothly
    const currentProgress = x.get();
    const progressRatio = currentProgress / distance;
    const remainingDistance = distance * (1 - Math.abs(progressRatio));

    // Start new animation from current position
    const controls = animate(x, [currentProgress, distance], {
      ease: "linear",
      duration: duration * (1 - Math.abs(progressRatio)),
      repeat: Infinity,
      repeatType: "loop",
      onRepeat: () => x.set(0),
    });

    controlsRef.current = controls;

    return () => controls.stop();
  }, [trackWidth, runningSpeed, x]);

  const hoverHandlers =
    speedOnHover || pauseOnHover
      ? {
          onMouseEnter: () => {
            if (pauseOnHover) setRunningSpeed(0);
            else if (speedOnHover) setRunningSpeed(speedOnHover);
          },
          onMouseLeave: () => setRunningSpeed(speed),
        }
      : {};

  return (
    <div
      ref={viewportRef}
      className={cn("relative w-full overflow-hidden", className)}
      {...hoverHandlers}
    >
      <motion.div
        style={{ x }}
        className="flex items-center"
        aria-label="Client logos marquee"
      >
        <div
          ref={firstTrackRef}
          className="flex flex-nowrap items-center will-change-transform"
          style={{ gap }}
        >
          {items.map((child, i) => (
            <div key={`a-${i}`} className="flex-none">
              {child}
            </div>
          ))}
        </div>

        <div
          className="flex flex-nowrap items-center will-change-transform"
          aria-hidden="true"
          style={{ gap }}
        >
          {items.map((child, i) => (
            <div key={`b-${i}`} className="flex-none">
              {child}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
