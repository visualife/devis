import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { CLIENT, MAIL_SUBJECT, formatAnswers, type Answers } from '@/lib/brief';

export const runtime = 'nodejs';

const MAX_BODY = 20_000;
const MAX_FREE = 4_000;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Rebuild the summary from the structured answers rather than trusting the
 * `text` the client sends — the client copy is a convenience, not the source.
 */
function sanitize(raw: unknown): Answers {
  if (!raw || typeof raw !== 'object') return {};
  const out: Answers = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const n = Number(key);
    if (!Number.isInteger(n)) continue;
    if (typeof value === 'string') {
      out[n] = value.slice(0, MAX_FREE);
    } else if (Array.isArray(value)) {
      out[n] = value.filter((v): v is string => typeof v === 'string').map((v) => v.slice(0, 200));
    }
  }
  return out;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) {
      return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 });
  }

  const payload = (body ?? {}) as Record<string, unknown>;

  // Honeypot. Answer 200 so a bot learns nothing, but send nothing.
  if (typeof payload.entreprise === 'string' && payload.entreprise.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const answers = sanitize(payload.answers);
  const text = formatAnswers(answers);
  if (!text) {
    return NextResponse.json({ error: 'empty' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BRIEF_TO ?? 'infusionbio@gmail.com';
  const from = process.env.BRIEF_FROM ?? 'onboarding@resend.dev';

  if (!apiKey) {
    // Misconfiguration, not the visitor's fault — the client falls back to
    // "Copier à la place" on any non-2xx, so nothing is lost.
    console.error('[dr-brief] RESEND_API_KEY is not set');
    return NextResponse.json({ error: 'not_configured' }, { status: 500 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: to,
      subject: MAIL_SUBJECT,
      text,
      html: `<pre style="font:14px/1.6 ui-monospace,Menlo,monospace;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
    });

    if (error) {
      console.error('[dr-brief] resend error', error);
      return NextResponse.json({ error: 'send_failed' }, { status: 502 });
    }
  } catch (cause) {
    console.error('[dr-brief] resend threw', cause);
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, client: CLIENT });
}
