'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { LiquidGlassEngine, type LiquidGlassConfig } from 'quick-liquid';

/**
 * Chromium is the only engine that actually *renders* `backdrop-filter: url()`.
 *
 * The engine's own capability probe reads computed style, and WebKit reports
 * the url() back happily — so the engine keeps the SVG path and WebKit then
 * drops the whole filter chain on the floor, taking `blur()` and `saturate()`
 * with it. Measured: with a striped backdrop behind a card, Chromium renders a
 * smooth frost while WebKit leaves the stripes razor sharp straight through the
 * card. Unreadable under the sticky action bar.
 *
 * `navigator.userAgentData` is implemented only by Chromium, which makes it a
 * cheap discriminator that fails in the safe direction: an engine we cannot
 * identify gets the CSS path, which is blur + saturate + tint + rim and still
 * looks like glass.
 */
let cssOnly: boolean | null = null;

function forceCssRefraction(): boolean {
  if (cssOnly !== null) return cssOnly;
  const brands = (navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } })
    .userAgentData?.brands;
  cssOnly = !(Array.isArray(brands) && brands.some((b) => /Chromium/i.test(b.brand)));
  return cssOnly;
}

export type GlassHandle = {
  engine: LiquidGlassEngine | null;
  jiggle: (intensity?: number) => void;
  animateIn: (delay?: number) => void;
  animateOut: () => Promise<void>;
};

type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  config: Partial<LiquidGlassConfig>;
  /** Spring press feedback. Pass false for surfaces that are not tappable. */
  press?: { scale?: number; squish?: number } | false;
  as?: ElementType;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
  /** Skip the engine entirely (keeps the painted fallback card). */
  disabled?: boolean;
};

/**
 * A single liquid-glass surface.
 *
 * We drive `LiquidGlassEngine` directly rather than using `quick-liquid/react`
 * so the host can be told when the engine has taken over: `.ql-ready` drops the
 * painted fallback background. That background has to exist for the no-JS pass,
 * and it has to be gone before the engine runs — a background on the host is
 * what the lens layer would sample instead of the page behind it.
 *
 * The `.ql-content` wrapper is rendered here rather than injected, so the server
 * HTML already matches the structure the engine expects (it reuses an existing
 * `:scope > .ql-content` instead of creating its own).
 */
export const Glass = forwardRef<GlassHandle, Props>(function Glass(
  { config, press, as: Tag = 'div', className = '', contentClassName = '', children, disabled, ...rest },
  ref,
) {
  const hostRef = useRef<HTMLElement | null>(null);
  const engineRef = useRef<LiquidGlassEngine | null>(null);

  // Config is inlined at call sites, so compare by value, not identity.
  const configKey = useMemo(() => JSON.stringify(config), [config]);
  const pressKey = useMemo(() => JSON.stringify(press ?? false), [press]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || disabled) return;

    const resolved: Partial<LiquidGlassConfig> = JSON.parse(configKey);
    if (forceCssRefraction()) resolved.refractionMode = 'css';

    const engine = new LiquidGlassEngine(host, resolved);
    engineRef.current = engine;
    host.classList.add('ql-ready');

    const pressConfig = JSON.parse(pressKey);
    if (pressConfig) engine.enableLiquidPress(pressConfig);

    return () => {
      engine.destroy();
      engineRef.current = null;
      host.classList.remove('ql-ready');
    };
  }, [configKey, pressKey, disabled]);

  useImperativeHandle(ref, () => ({
    get engine() {
      return engineRef.current;
    },
    jiggle: (intensity?: number) => engineRef.current?.jiggle(intensity),
    animateIn: (delay?: number) => engineRef.current?.animateIn(delay),
    animateOut: () => engineRef.current?.animateOut() ?? Promise.resolve(),
  }));

  const Host = Tag as ElementType;

  return (
    <Host ref={hostRef} className={`glass ${className}`} {...rest}>
      <div className={`ql-content ${contentClassName}`}>{children}</div>
    </Host>
  );
});
