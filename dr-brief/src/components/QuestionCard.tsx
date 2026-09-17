'use client';

import { TONE_BORDER, TONE_TEXT, type Question } from '@/lib/brief';

/** Renders the `**bold**` runs of the original copy. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) =>
        i % 2 === 1 ? (
          <b key={i} className="font-medium text-ink">
            {part}
          </b>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function Chip({
  question,
  label,
  checked,
  onPick,
}: {
  question: Question;
  label: string;
  checked: boolean;
  onPick: () => void;
}) {
  const tone = question.tone;
  const multi = question.kind === 'check';

  return (
    <label
      className={[
        'opt chip inline-flex items-center px-3.5 py-2.5',
        `chip-${tone}`,
        checked ? 'chip-selected' : '',
      ].join(' ')}
    >
      <input
        type={multi ? 'checkbox' : 'radio'}
        name={`q${question.n}`}
        value={label}
        checked={checked}
        className="sr-only"
        onChange={onPick}
      />
      <span className="opt-label text-[0.9375rem] font-normal text-ink">{label}</span>
    </label>
  );
}

export function QuestionCard({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string[] | string | undefined;
  onChange: (next: string[] | string) => void;
}) {
  const picked = Array.isArray(value) ? value : [];
  const accentText = TONE_TEXT[question.tone];

  return (
    <section
      className={`card card-${question.tone} scroll-mt-6 p-5 sm:p-6`}
      aria-labelledby={`q${question.n}-title`}
    >
      <div className="flex items-baseline gap-3">
        <span className={`min-w-[1.25rem] shrink-0 text-[0.8125rem] tabular-nums ${accentText}`}>
          {question.n}
        </span>
        <h2 id={`q${question.n}-title`} className="text-[1.0625rem] font-normal tracking-[-0.01em] text-ink">
          {question.title}
        </h2>
      </div>

      {question.hint && (
        <p className="mt-1.5 ml-[2.0625rem] max-sm:ml-0 text-sm text-ink-dim">{question.hint}</p>
      )}

      {question.known && (
        <p
          className={[
            'mt-3 ml-[2.0625rem] max-sm:ml-0 rounded-r-md border-l-2 py-2.5 pr-3.5 pl-3.5 text-sm text-ink-dim',
            TONE_BORDER[question.tone],
            'bg-white/[0.045]',
          ].join(' ')}
        >
          <Rich text={question.known} />
        </p>
      )}

      <div className="mt-3.5 ml-[2.0625rem] max-sm:ml-0">
        {question.kind === 'free' ? (
          <textarea
            rows={3}
            className="field"
            placeholder={question.placeholder}
            aria-label={question.title}
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : (
          <div role={question.kind === 'radio' ? 'radiogroup' : 'group'} aria-labelledby={`q${question.n}-title`} className="flex flex-wrap gap-2">
            {question.options.map((label) => {
              const checked = picked.includes(label);
              return (
                <Chip
                  key={label}
                  question={question}
                  label={label}
                  checked={checked}
                  onPick={() => {
                    if (question.kind === 'radio') {
                      onChange([label]);
                      return;
                    }
                    onChange(checked ? picked.filter((p) => p !== label) : [...picked, label]);
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
