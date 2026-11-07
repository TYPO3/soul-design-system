/* A card's first lines: a sign with no words beside it stands on the line of
   the glyph. Measured, because a hole over a title is no error in the markup. */

import { expect, test } from 'vitest';
import { box, q, write } from './lib/frame.ts';

const middle = (el: Element): number => box(el).top + box(el).height / 2;

test('the glyph stands at the left of the words, and the sign beside the title', async () => {
  await write('<div style="width:400px"><sds-card id="c" heading="T" body="B" icon="actions-cog" sign="yes"></sds-card></div>');
  const glyph = box(q('#c .sds-card__icon'));
  const title = box(q('#c .sds-card__title'));
  const text = box(q('#c .sds-card__text'));
  expect(title.left).toBeGreaterThanOrEqual(glyph.right);
  expect(text.left).toBeCloseTo(title.left, 0);
  expect(title.top).toBeLessThan(glyph.bottom);
  const sign = box(q('#c .sds-card__sign'));
  expect(sign.left).toBeGreaterThanOrEqual(title.right - 1);
  expect(Math.abs(middle(q('#c .sds-card__sign')) - middle(q('#c .sds-card__title')))).toBeLessThanOrEqual(4);
});

test('with words on the label line the sign stays there', async () => {
  await write('<sds-card id="c" heading="T" body="B" icon="actions-cog" sign="yes" label="Chapter"></sds-card>');
  expect(q('#c .sds-card__sign').parentElement?.querySelector('.sds-label')).not.toBeNull();
  expect(document.querySelector('#c .sds-card__lead')).toBeNull();
});

test('the label stands closer to the title than the title to its text', async () => {
  await write('<sds-card id="c" heading="T" body="B" label="Package"></sds-card>');
  const label = box(q('#c .sds-card__body > .sds-row'));
  const title = box(q('#c .sds-card__title'));
  const text = box(q('#c .sds-card__text'));
  expect(title.top - label.bottom).toBeLessThan(text.top - title.bottom);
});

test('with no glyph the words take the whole card', async () => {
  await write('<sds-card id="c" heading="T" body="B" sign="no"></sds-card>');
  expect(box(q('#c .sds-card__title')).left - box(q('#c .sds-card')).left).toBeLessThan(40);
  expect(q('#c .sds-card__sign')).not.toBeNull();
});

test('a surface draws its glyph at the left too', async () => {
  await write('<sds-surface id="s" heading="T" body="B" icon="actions-cog"></sds-surface>');
  expect(box(q('#s .sds-surface-title')).left).toBeGreaterThanOrEqual(box(q('#s .sds-surface-icon')).right);
});
