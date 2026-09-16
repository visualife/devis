import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QUESTIONS, answeredCount, formatAnswers } from '../src/lib/brief.ts';

test('formatAnswers: nothing filled in yields null', () => {
  assert.equal(formatAnswers({}), null);
  assert.equal(formatAnswers({ 17: '   ' }), null);
});

test('formatAnswers: labels each line with the original data-name, in question order', () => {
  const text = formatAnswers({
    10: ['Une vraie deuxième activité'],
    1: ['Premium'],
    6: ["Pose d'implant", 'Facettes'],
  });

  assert.equal(
    text,
    [
      'Réponses — Dr Patrick Lellouche',
      '',
      'Formule Webdentiste : Premium',
      'Vidéos : Pose d\'implant, Facettes',
      'Place du piano : Une vraie deuxième activité',
    ].join('\n'),
  );
});

test('formatAnswers: the free field lands last, under its own heading', () => {
  const text = formatAnswers({ 4: ['Oui, on garde'], 17: '  Un site que j aime  ' });
  assert.equal(text, [
    'Réponses — Dr Patrick Lellouche',
    '',
    'Doctolib : Oui, on garde',
    '',
    'Remarques : Un site que j aime',
  ].join('\n'));
});

test('formatAnswers: empty selections never produce a bare label', () => {
  const text = formatAnswers({ 2: [], 3: ['Non'] });
  assert.equal(text, 'Réponses — Dr Patrick Lellouche\n\nDomaine cabinet : Non');
});

test('answeredCount tracks the progress rail', () => {
  assert.equal(answeredCount({}), 0);
  assert.equal(answeredCount({ 1: ['Premium'], 2: [] }), 1);
  assert.equal(answeredCount({ 1: ['Premium'], 17: 'hello' }), 2);
  assert.equal(answeredCount({ 17: '   ' }), 0);
});

test('every question carries a unique number and a field name', () => {
  const numbers = QUESTIONS.map((q) => q.n);
  assert.equal(new Set(numbers).size, QUESTIONS.length);
  assert.deepEqual(numbers, [...numbers].sort((a, b) => a - b));
  for (const q of QUESTIONS) assert.ok(q.field.length > 0, `q${q.n} has no field name`);
});
