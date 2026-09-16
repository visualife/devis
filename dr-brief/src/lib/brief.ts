/**
 * Source of truth for the brief. Wording comes verbatim from the validated
 * brief-lellouche.html — do not rewrite it here.
 *
 * `**…**` inside `known` marks the <b> runs of the original markup.
 */

export type Tone = 'cabinet' | 'piano';

type Base = {
  n: number;
  /** data-name in the original — this is the label that reaches the email. */
  field: string;
  title: string;
  tone: Tone;
  hint?: string;
  known?: string;
};

export type Question =
  | (Base & { kind: 'radio' | 'check'; options: string[] })
  | (Base & { kind: 'free'; placeholder: string });

export type Section = {
  id: string;
  heading: string;
  blurb: string;
  tone: Tone;
  /** The section card is rendered just before this question number. */
  before: number;
};

export const SECTIONS: Section[] = [
  { id: 'cabinet', heading: 'Le cabinet', blurb: 'Neuf questions sur ton site professionnel.', tone: 'cabinet', before: 1 },
  { id: 'piano', heading: 'Le piano', blurb: 'Cinq questions. La première décide de tout le reste.', tone: 'piano', before: 10 },
  { id: 'deux', heading: 'Les deux', blurb: 'Trois dernières.', tone: 'cabinet', before: 15 },
];

export const QUESTIONS: Question[] = [
  {
    n: 1, field: 'Formule Webdentiste', tone: 'cabinet', kind: 'radio',
    title: "Ton abonnement actuel, c'est lequel ?",
    known: 'Ton site est hébergé chez **Webdentiste**. Deux formules : Classique **113 €/mois**, Premium **170 €/mois**.',
    options: ['Classique', 'Premium', 'Je ne sais plus'],
  },
  {
    n: 2, field: 'Engagement', tone: 'cabinet', kind: 'radio',
    title: "Tu es engagé jusqu'à quand ?",
    hint: "Ça me sert à caler la mise en ligne pour t'éviter de payer deux fois.",
    options: ['Sans engagement', 'Encore quelques mois', 'À vérifier'],
  },
  {
    n: 3, field: 'Domaine cabinet', tone: 'cabinet', kind: 'radio',
    title: 'Tu as une adresse internet à toi pour le cabinet ?',
    known: "L'adresse actuelle, **dr-patrick-lellouche.chirurgiens-dentistes.fr**, appartient à Webdentiste — elle ne peut pas être transférée.",
    options: ["Oui, j'en ai une", 'Non', 'Aucune idée'],
  },
  {
    n: 4, field: 'Doctolib', tone: 'cabinet', kind: 'radio',
    title: 'On garde Doctolib ?',
    options: ['Oui, on garde', "J'aimerais m'en passer", 'À discuter'],
  },
  {
    n: 5, field: 'Contenus cabinet', tone: 'cabinet', kind: 'radio',
    title: "Tes articles et cas cliniques, c'est toi qui les as écrits ?",
    hint: "Si c'est du contenu fourni par Webdentiste, il ne pourra pas être repris.",
    options: ["C'est moi", 'Fourni par eux', 'Un peu des deux'],
  },
  {
    n: 6, field: 'Vidéos', tone: 'cabinet', kind: 'check',
    title: 'Quelles vidéos te seraient le plus utiles ?',
    hint: 'Tes vidéos actuelles appartiennent à Webdentiste, on les remplace.',
    options: ["Pose d'implant", 'Facettes', 'Aligneurs', 'Couronne / bridge', 'Hygiène, brossage', 'Suites opératoires', 'Présentation du cabinet'],
  },
  {
    n: 7, field: 'Soins prioritaires', tone: 'cabinet', kind: 'check',
    title: 'Quels soins veux-tu mettre en avant ?',
    known: "J'ai relevé sur ton site : **implants**, **esthétique**, **orthodontie adulte**.",
    options: ['Implants', 'Esthétique', 'Orthodontie adulte', 'Soins courants', 'Urgences'],
  },
  {
    n: 8, field: 'Reproches cabinet', tone: 'cabinet', kind: 'check',
    title: "Qu'est-ce qui te gêne dans le site du cabinet ?",
    options: ['Il fait daté', 'Mal sur mobile', 'Trop lent', 'Compliqué à modifier', 'Pas assez visible sur Google', 'Il ne me ressemble pas'],
  },
  {
    n: 9, field: 'Mise à jour cabinet', tone: 'cabinet', kind: 'radio',
    title: 'Qui mettra le site du cabinet à jour ?',
    options: ['Moi', 'Mon assistante', 'Emmanuel'],
  },
  {
    n: 10, field: 'Place du piano', tone: 'piano', kind: 'radio',
    title: "Le piano, c'est quoi pour toi aujourd'hui ?",
    options: ['Une passion, rien de plus', 'Ça me fait jouer de temps en temps', 'Une vraie deuxième activité'],
  },
  {
    n: 11, field: 'Où tu joues', tone: 'piano', kind: 'check',
    title: 'Tu joues où ?',
    options: ['Fêtes et célébrations', 'Mariages', 'Concerts', 'En studio', "Composition pour l'image", 'Chez moi surtout'],
  },
  {
    n: 12, field: 'Objectif site piano', tone: 'piano', kind: 'check',
    title: 'Le site piano doit servir à quoi ?',
    known: "insidemysoul.com te présente aujourd'hui comme **compositeur de musique de film**. Toujours d'actualité ?",
    options: ["Qu'on me contacte pour jouer", 'Partager ma musique', 'Une trace, pour moi', 'Décrocher des compositions'],
  },
  {
    n: 13, field: 'Domaine piano', tone: 'piano', kind: 'radio',
    title: 'insidemysoul.com est bien à ton nom ?',
    options: ['Oui', 'Chez un ancien prestataire', 'Aucune idée'],
  },
  {
    n: 14, field: 'Enregistrements', tone: 'piano', kind: 'radio',
    title: 'Tes enregistrements, tu les as en bonne qualité ?',
    known: 'Le site date de **2015** et ne propose que des **extraits** — les fichiers en ligne sont sans doute compressés.',
    options: ['Oui, tout', 'Une partie', 'Il faut que je cherche'],
  },
  {
    n: 15, field: 'Langues', tone: 'cabinet', kind: 'check',
    title: 'Anglais, espagnol ?',
    known: 'Le site du cabinet a **une page** dans chaque langue ; insidemysoul est bilingue.',
    options: ['Cabinet en anglais', 'Cabinet en espagnol', 'Piano en anglais', 'Français partout, ça suffit'],
  },
  {
    n: 16, field: 'Photos', tone: 'cabinet', kind: 'check',
    title: "Les photos, je m'en occupe",
    known: "Tu m'as très bien soigné — je te fais **les photos en cadeau**. Prise de vue pro au Nikon D800 sur trépied, à ma prochaine consultation. Le cabinet, et toi au piano si tu veux.",
    options: ['Le cabinet', 'Moi au piano', "J'ai déjà les miennes"],
  },
  {
    n: 17, field: 'Remarques', tone: 'cabinet', kind: 'free',
    title: 'Autre chose ?',
    placeholder: 'Un site que tu aimes, une contrainte, une idée…',
  },
];

export const CLIENT = 'Dr Patrick Lellouche';
export const MAIL_SUBJECT = 'Brief sites — Dr Lellouche';

/** Answers keyed by question number: string for `free`, string[] otherwise. */
export type Answers = Record<number, string[] | string>;

/**
 * Rebuilds the plain-text block the original page produced, in question order.
 * Returns null when nothing has been filled in — the caller treats that as
 * "nothing to send".
 */
export function formatAnswers(answers: Answers): string | null {
  const lines: string[] = [`Réponses — ${CLIENT}`, ''];
  let free = '';

  for (const q of QUESTIONS) {
    const value = answers[q.n];
    if (q.kind === 'free') {
      free = typeof value === 'string' ? value.trim() : '';
      continue;
    }
    const picked = Array.isArray(value) ? value.filter(Boolean) : [];
    if (picked.length) lines.push(`${q.field} : ${picked.join(', ')}`);
  }

  if (free) lines.push('', `Remarques : ${free}`);
  return lines.length === 2 ? null : lines.join('\n');
}

/** How many of the 17 questions carry an answer. Drives the progress rail. */
export function answeredCount(answers: Answers): number {
  return QUESTIONS.reduce((total, q) => {
    const value = answers[q.n];
    if (q.kind === 'free') return total + (typeof value === 'string' && value.trim() ? 1 : 0);
    return total + (Array.isArray(value) && value.length ? 1 : 0);
  }, 0);
}
