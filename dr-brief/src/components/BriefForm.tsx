'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Glass, type GlassHandle } from './Glass';
import { QuestionCard } from './QuestionCard';
import {
  QUESTIONS,
  SECTIONS,
  answeredCount,
  formatAnswers,
  type Answers,
} from '@/lib/brief';

const STORAGE_KEY = 'dr-brief-lellouche-v1';
const API = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/dr-brief`;

/* The bar is the one surface with live text scrolling underneath it, so it
   carries more smoke than the cards: legible even where the backdrop blur is
   weak. Tint is left at the default so the engine's dark-appearance swap
   applies (DARK_TINT 20,24,34 at x1.75). The engine fades the tint down the
   surface (x1.2 top -> x0.85 bottom), so the density is set by what the BOTTOM
   edge needs — that is where the status line sits and where text behind it was
   showing through. */
const BAR = {
  material: 'thick',
  borderRadius: 18,
  appearance: 'dark',
  tintOpacity: 0.3,
  elevation: 1.3,
  chromaticAberration: 0.18,
  quality: 'high',
} as const;

const PANEL = {
  material: 'regular',
  borderRadius: 18,
  appearance: 'dark',
  elevation: 1.1,
  quality: 'high',
} as const;

type Status = 'idle' | 'sending' | 'sent' | 'error';

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
  const [status, setStatus] = useState<Status>('idle');
  const [note, setNote] = useState('Enregistré sur cet appareil au fur et à mesure.');
  const [fallbackText, setFallbackText] = useState('');
  const hydrated = useRef(false);
  const barRef = useRef<GlassHandle>(null);
  const panelRef = useRef<GlassHandle>(null);
  const honeypot = useRef<HTMLInputElement>(null);

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

  const send = useCallback(async () => {
    if (!text) {
      setNote("Coche au moins une réponse avant d'envoyer.");
      return;
    }
    setStatus('sending');
    setNote('Envoi…');

    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          text,
          // Honeypot travels with the payload; a real person leaves it empty.
          entreprise: honeypot.current?.value ?? '',
        }),
      });
      if (!response.ok) throw new Error(String(response.status));

      // The one orchestrated moment: the bar springs away, then the
      // confirmation panel springs in on mount. Both bail out cleanly under
      // prefers-reduced-motion inside the engine.
      await barRef.current?.animateOut();
      setStatus('sent');
    } catch {
      setStatus('error');
      setNote("L'envoi a échoué. Utilise « Copier à la place » — rien n'est perdu.");
      setFallbackText(text);
    }
  }, [answers, text]);

  useEffect(() => {
    if (status === 'sent') panelRef.current?.animateIn();
  }, [status]);

  if (status === 'sent') {
    return (
      <main className="mx-auto flex min-h-dvh max-w-[40rem] items-center px-5 py-16">
        <Glass className="w-full" contentClassName="p-7 sm:p-9" config={PANEL} press={false} ref={panelRef}>
          <p className="text-sm text-accent">Bien reçu</p>
          <h1 className="display mt-2 text-[1.75rem] text-ink">Merci, c&rsquo;est envoyé.</h1>
          <p className="mt-3 text-[0.9375rem] text-ink-dim">
            J&rsquo;ai tes réponses. On gagne une heure de réunion — je te réponds vite.
          </p>
          <p className="mt-6 text-sm text-ink-faint">
            Tes réponses restent enregistrées sur cet appareil si tu veux les relire.
          </p>
        </Glass>
      </main>
    );
  }

  return (
    <main className={`mx-auto max-w-[40rem] px-5 pt-10 pb-8 ${status === 'sending' ? 'sending' : ''}`}>
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
        <h1 className="display text-[1.9375rem] text-ink sm:text-[2.25rem]">Tes deux sites, en deux minutes</h1>
        <p className="mt-3 text-[0.9375rem] text-ink-dim">
          J&rsquo;ai regardé le site du cabinet et insidemysoul.com, et prérempli ce que j&rsquo;ai pu.{' '}
          <b className="font-semibold text-ink">Il ne reste que des cases à cocher</b> — et on gagne une heure de
          réunion.
        </p>
      </header>

      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <div className="hp" aria-hidden="true">
          <label htmlFor="entreprise">Entreprise</label>
          <input id="entreprise" name="entreprise" type="text" tabIndex={-1} autoComplete="off" ref={honeypot} />
        </div>

        {QUESTIONS.map((question) => {
          const section = SECTIONS.find((s) => s.before === question.n);
          return (
            <div key={question.n} className="contents">
              {section && (
                <div
                  className={[
                    'mt-6 rounded-lg border-l-[3px] bg-white/[0.035] px-4 py-3.5',
                    section.tone === 'piano' ? 'border-piano' : 'border-accent',
                  ].join(' ')}
                >
                  <h2 className="text-[1.1875rem] font-semibold tracking-[-0.01em] text-ink">{section.heading}</h2>
                  <p className="mt-0.5 text-sm text-ink-dim">{section.blurb}</p>
                </div>
              )}
              <QuestionCard question={question} value={answers[question.n]} onChange={(next) => setAnswer(question.n, next)} />
            </div>
          );
        })}

        <Glass
          as="div"
          ref={barRef}
          className="sticky bottom-4 z-40 mt-6"
          contentClassName="p-3.5"
          config={BAR}
          press={false}
        >
          {/* The bar is pinned for the whole page, so it stays to three short
              rows — on a 380px phone a taller one eats a quarter of the screen. */}
          <div className="mb-2.5 flex items-baseline justify-between gap-3 px-1">
            <span className="text-[0.8125rem] text-ink-dim">
              <span className="tabular-nums text-ink">{done}</span> sur {QUESTIONS.length}
            </span>
            <button
              type="button"
              onClick={() => void copy()}
              className="rounded-md text-[0.8125rem] font-medium text-ink-faint underline decoration-white/25 underline-offset-4 transition-colors duration-150 hover:text-ink hover:decoration-white/50"
            >
              Copier à la place
            </button>
          </div>

          {/* The status line goes ABOVE the button, not below it. The tint fades
              toward the bottom of the surface, so the lowest band is the one
              place page text still reads through — and the opaque teal button
              is the only child that can cover it. */}
          <p className="mb-2.5 text-center text-[0.8125rem] text-ink-faint" role="status" aria-live="polite">
            {note}
          </p>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full rounded-[10px] bg-accent px-4 py-3.5 text-base font-semibold text-accent-ink transition-[filter] duration-150 hover:brightness-[1.07] disabled:cursor-progress disabled:brightness-90"
          >
            {status === 'sending' ? 'Envoi…' : 'Envoyer mes réponses'}
          </button>
        </Glass>
      </form>

      {fallbackText && (
        <textarea
          readOnly
          aria-label="Vos réponses"
          className="field mt-4 min-h-[13rem] font-mono text-[0.84rem] text-ink-dim"
          value={fallbackText}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
    </main>
  );
}
