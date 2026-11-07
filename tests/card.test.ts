/* A card's first lines: a sign with no words beside it stands on the line of
   the glyph. Measured, because a hole over a title is no error in the markup. */

import { expect, test } from 'vitest';
import { box, q, write } from './lib/frame.ts';

const middle = (el: Element): number => box(el).top + box(el).height / 2;

test('a sign and a glyph share one line, and the sign stands beside the glyph', async () => {
  await write('<div style="width:300px"><sds-card id="c" heading="T" body="B" icon="actions-cog" sign="yes"></sds-card></div>');
  const glyph = q('#c .sds-card__icon svg');
  const sign = q('#c .sds-card__sign');
  expect(Math.abs(middle(glyph) - middle(sign))).toBeLessThanOrEqual(1);
  expect(box(sign).left).toBeGreaterThanOrEqual(box(glyph).right);
  expect(box(sign).left - box(glyph).right).toBeLessThan(32);
  expect(document.querySelectorAll('#c .sds-card__body > .sds-row')).toHaveLength(1);
});

test('with words on the label line the sign stays there, under the glyph', async () => {
  await write('<sds-card id="c" heading="T" body="B" icon="actions-cog" sign="yes" label="Chapter"></sds-card>');
  expect(q('#c .sds-card__sign').parentElement?.querySelector('.sds-label')).not.toBeNull();
  expect(document.querySelector('#c .sds-card__lead')).toBeNull();
});

test('with no glyph the sign keeps a line of its own', async () => {
  await write('<sds-card id="c" heading="T" body="B" sign="no"></sds-card>');
  expect(document.querySelector('#c .sds-card__lead')).toBeNull();
  expect(q('#c .sds-card__sign')).not.toBeNull();
});
