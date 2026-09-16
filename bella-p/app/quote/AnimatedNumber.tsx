"use client";

import { useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

export function AnimatedNumber({
  value,
  format,
}: {
  value: number;
  format: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const spring = useSpring(value, { stiffness: 120, damping: 22, mass: 0.7 });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) ref.current.textContent = format(latest);
    });
    return unsubscribe;
  }, [spring, format]);

  return <span ref={ref}>{format(value)}</span>;
}
