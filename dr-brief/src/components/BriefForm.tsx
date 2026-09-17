'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { QuestionCard } from './QuestionCard';
import {
  QUESTIONS,
  SECTIONS,
  TONE_BORDER,
  TONE_TEXT,
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
    perspective. The reference itself carries more beams and a warmer
    mix than the three brand tones alone (yellow/orange in the rotation
    alongside green/purple/cyan) — 5 beams/wall (20 total) cycling
    through all five, evenly spaced so no wall reads mono-colour.
    Delay/duration staggered so they don't rise in lockstep. */
const WARP_WALLS = ['top', 'bottom', 'left', 'right'] as const;

const WARP_TONES = ['accent', 'piano-text', 'both', 'warp-yellow', 'warp-orange'] as const;

const WARP_BEAMS = WARP_WALLS.flatMap((wall, wi) =>
  WARP_TONES.map((tone, ti) => ({
    wall,
    x: 8 + ti * 21,
    width: 6,
    ar: 3 + ((wi * WARP_TONES.length + ti) % 6),
    tone,
    delay: ((wi * WARP_TONES.length + ti) * 0.8) % 5,
    duration: 5,
  })),
);

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

      <header className="mb-9">
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
                  {/* Alternates with the H1 across the page's four titles:
                      H1 (Nunito) -> cabinet (Cinzel) -> piano (Nunito) ->
                      deux (Cinzel). */}
                  <h2
                    className={`${section.id === 'piano' ? 'display' : 'display-alt'} ${TONE_TEXT[section.tone]} text-[1.3125rem]`}
                  >
                    {section.heading}
                  </h2>
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
          <div className="warp-field mt-4 p-12 sm:p-20">
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
