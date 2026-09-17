'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { QuestionCard } from './QuestionCard';
import {
  QUESTIONS,
  SECTIONS,
  TONE_BORDER,
  answeredCount,
  formatAnswers,
  type Answers,
} from '@/lib/brief';

const STORAGE_KEY = 'dr-brief-lellouche-v1';

/** Warp-field walls and their beams — the real mechanism from the
    reference (21st.dev/@nyxbui/components/warp-background): four
    planes, each hinged 90° away via perspective/rotateX (see .warp-wall*
    in globals.css), so a beam's plain upward motion along its own wall
    projects as a diagonal comet streak once seen through the outer
    perspective. beamsPerSide=3 and beamSize=5% are the reference's own
    defaults (read from its live DOM), so 3 beams/wall here too — the
    earlier 2/wall just looked sparser than the real thing. Brand tones
    cycle in for colour instead of the reference's random-per-mount hue;
    delay/duration staggered so they don't rise in lockstep. */
const WARP_WALLS = ['top', 'bottom', 'left', 'right'] as const;

const WARP_BEAMS = [
  { wall: 'top', x: 8, width: 5, ar: 3, tone: 'accent', delay: 0, duration: 5 },
  { wall: 'top', x: 42, width: 5, ar: 6, tone: 'piano-text', delay: 1.6, duration: 5 },
  { wall: 'top', x: 78, width: 5, ar: 4, tone: 'both', delay: 3.2, duration: 5 },
  { wall: 'bottom', x: 12, width: 5, ar: 5, tone: 'both', delay: 0.6, duration: 5 },
  { wall: 'bottom', x: 48, width: 5, ar: 2, tone: 'accent', delay: 2.2, duration: 5 },
  { wall: 'bottom', x: 82, width: 5, ar: 7, tone: 'piano-text', delay: 3.8, duration: 5 },
  { wall: 'left', x: 15, width: 5, ar: 4, tone: 'piano-text', delay: 1.2, duration: 5 },
  { wall: 'left', x: 50, width: 5, ar: 8, tone: 'both', delay: 2.8, duration: 5 },
  { wall: 'left', x: 85, width: 5, ar: 3, tone: 'accent', delay: 4.4, duration: 5 },
  { wall: 'right', x: 18, width: 5, ar: 6, tone: 'accent', delay: 0.3, duration: 5 },
  { wall: 'right', x: 52, width: 5, ar: 5, tone: 'both', delay: 1.8, duration: 5 },
  { wall: 'right', x: 88, width: 5, ar: 2, tone: 'piano-text', delay: 3.4, duration: 5 },
] as const;

/** Restores only values that still exist in the current question set. */
function reconcile(raw: unknown): Answers {
  if (!raw || typeof raw !== 'object') return {};
  const stored = raw as Record<string, unknown>;
  const out: Answers = {};

  for (const q of QUESTIONS) {
    const value = stored[String(q.n)];
    if (q.kind === 'free') {
      if (typeof value === 'string') out[q.n] = value;
      continue;
    }
    if (!Array.isArray(value)) continue;
    const valid = value.filter((v): v is string => typeof v === 'string' && q.options.includes(v));
    if (valid.length) out[q.n] = q.kind === 'radio' ? valid.slice(0, 1) : valid;
  }
  return out;
}

export function BriefForm() {
  const [answers, setAnswers] = useState<Answers>({});
  const [note, setNote] = useState('Enregistré sur cet appareil au fur et à mesure.');
  const [fallbackText, setFallbackText] = useState('');
  const hydrated = useRef(false);

  /* Restore after mount so server and client HTML match. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAnswers(reconcile(JSON.parse(raw)));
    } catch {
      /* private mode, corrupt payload — start empty */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* quota or private mode — the copy fallback still works */
    }
  }, [answers]);

  const done = answeredCount(answers);
  const text = useMemo(() => formatAnswers(answers), [answers]);

  const setAnswer = useCallback((n: number, next: string[] | string) => {
    setAnswers((prev) => ({ ...prev, [n]: next }));
  }, []);

  const copy = useCallback(async () => {
    if (!text) {
      setNote("Coche au moins une réponse avant de copier.");
      return;
    }
    setFallbackText(text);
    try {
      await navigator.clipboard.writeText(text);
      setNote('Copié. Colle-les dans un message et envoie-les moi. Merci !');
    } catch {
      setNote('Sélectionne le texte ci-dessous et copie-le.');
    }
  }, [text]);

  return (
    <main className="mx-auto max-w-[40rem] px-5 pt-10 pb-8">
      {/* Progress: fixed, thin, fills. The only always-visible chrome. */}
      <div
        className="fixed inset-x-0 top-0 z-50 h-[3px] bg-white/[0.07]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={QUESTIONS.length}
        aria-valuenow={done}
        aria-label="Progression"
      >
        <div
          className="rail-fill h-full bg-accent"
          style={{ transform: `scaleX(${done / QUESTIONS.length})` }}
        />
      </div>

      <header className="relative isolate mb-9">
        {/* Actual waves, not a conveyor belt: a big, slow, four-crest curve
            (period 400, amplitude 60 — the first version was nearly flat,
            which is why it read as thin lines sliding rather than
            undulating). Reused via <use> at staggered y/x offsets for
            several strands, and — the other half of the "sliding lines"
            problem — each strand runs the SAME loop at a DIFFERENT speed,
            so they drift in and out of phase with each other over time
            instead of marching in rigid lockstep like a single object. Two
            identical 800-wide (= two-period) tiles in one path; translating
            by exactly one tile still loops each strand with no seam,
            regardless of its own speed. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-20 w-full opacity-[0.6] sm:h-28"
          viewBox="0 0 1600 160"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-grad-from)" />
              <stop offset="50%" stopColor="var(--color-grad-to)" />
              <stop offset="100%" stopColor="var(--color-grad-from)" />
            </linearGradient>
            <path
              id="wave-strand"
              d="M0,80 Q100,20 200,80 T400,80 T600,80 T800,80 T1000,80 T1200,80 T1400,80 T1600,80"
              fill="none"
              stroke="url(#wave-grad)"
              strokeLinecap="round"
            />
          </defs>
          {[
            { dy: -44, dx: 0, opacity: 0.22, width: 1.5, duration: 23 },
            { dy: -22, dx: -100, opacity: 0.34, width: 2, duration: 28 },
            { dy: 0, dx: -220, opacity: 0.65, width: 2.75, duration: 19 },
            { dy: 22, dx: -320, opacity: 0.4, width: 2, duration: 25 },
            { dy: 44, dx: -420, opacity: 0.26, width: 1.5, duration: 31 },
            { dy: 60, dx: -540, opacity: 0.16, width: 1.25, duration: 17 },
          ].map((strand) => (
            <use
              key={strand.dy}
              href="#wave-strand"
              className="wave-path"
              style={
                {
                  animationDuration: `${strand.duration}s`,
                  // Baked into the keyframes below, not the SVG `transform`
                  // attribute — the animation's CSS `transform` would
                  // otherwise win the cascade and silently erase this
                  // per-strand offset every frame.
                  '--wx': `${strand.dx}px`,
                  '--wy': `${strand.dy + 80}px`,
                } as CSSProperties
              }
              opacity={strand.opacity}
              strokeWidth={strand.width}
            />
          ))}
        </svg>

        <p className="mb-5 text-[0.8125rem] tracking-[0.02em] text-ink-faint">Ailive.fr — Emmanuel</p>
        <h1 className="display bg-gradient-to-br from-grad-from to-grad-to bg-clip-text text-[1.9375rem] text-transparent sm:text-[2.25rem]">
          Tes deux sites, en deux minutes
        </h1>
        <p className="mt-3 text-[0.9375rem] text-ink-dim">
          J&rsquo;ai regardé le site du cabinet et insidemysoul.com, et prérempli ce que j&rsquo;ai pu.{' '}
          <b className="font-semibold text-ink">Il ne reste que des cases à cocher</b> — et on gagne une heure de
          réunion.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {QUESTIONS.map((question) => {
          const section = SECTIONS.find((s) => s.before === question.n);
          return (
            <div key={question.n} className="contents">
              {section && (
                <div
                  className={[
                    'mt-6 rounded-lg border-l-[3px] bg-white/[0.035] px-4 py-3.5',
                    TONE_BORDER[section.tone],
                  ].join(' ')}
                >
                  <h2 className="display text-[1.3125rem] text-ink">{section.heading}</h2>
                  <p className="mt-0.5 text-sm text-ink-dim">{section.blurb}</p>
                </div>
              )}
              <QuestionCard question={question} value={answers[question.n]} onChange={(next) => setAnswer(question.n, next)} />
            </div>
          );
        })}

        {/* Back in normal flow, not fixed/sticky — appears once, after the
            last question, the way a form's submit control normally does. */}
        <div className="bar mt-6 p-3.5">
          <div className="mb-2.5 px-1 text-center text-[0.8125rem] text-ink-dim">
            <span className="tabular-nums text-ink">{done}</span> sur {QUESTIONS.length}
          </div>

          <p className="mb-2.5 text-center text-[0.8125rem] text-ink-faint" role="status" aria-live="polite">
            {note}
          </p>

          <button type="button" onClick={() => void copy()} className="btn-primary mx-auto block w-fit px-10 py-3 text-base">
            Copier mes réponses
          </button>

          <p className="mt-2.5 text-center text-[0.8125rem] text-ink-faint">
            Colle-les dans un message et envoie-les moi.
          </p>
        </div>

        {/* The one moment the page gets to be a little spectacular — the
            copied-text fallback framed by the actual warp-background
            mechanism (real CSS 3D, see .warp3d/.warp-wall* in
            globals.css), in the three brand tones instead of the
            reference's random hue. Reduced-motion freezes the beams. */}
        {fallbackText && (
          <div className="warp-field mt-4 p-8 sm:p-12">
            <div className="warp3d" aria-hidden="true">
              {WARP_WALLS.map((wall) => (
                <div key={wall} className={`warp-wall warp-wall-${wall}`}>
                  {WARP_BEAMS.filter((beam) => beam.wall === wall).map((beam, i) => (
                    <span
                      key={i}
                      className="warp-beam"
                      style={
                        {
                          '--bx': `${beam.x}%`,
                          '--bw': `${beam.width}%`,
                          '--bar': beam.ar,
                          '--bc': `var(--color-${beam.tone})`,
                          '--bd': `${beam.delay}s`,
                          '--bdur': `${beam.duration}s`,
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
            <textarea
              readOnly
              aria-label="Vos réponses"
              className="field min-h-[13rem] font-mono text-[0.84rem] text-ink-dim"
              value={fallbackText}
              onFocus={(event) => event.currentTarget.select()}
            />
          </div>
        )}
      </div>
    </main>
  );
}
