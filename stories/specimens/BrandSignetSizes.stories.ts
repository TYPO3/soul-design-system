/* Three optical sizes, three files.

   The mark is redrawn per size rather than scaled, each in a box of its own
   size — 32, 24, 16 — so one unit is one pixel and every straight edge lands on
   a whole one. Between a size and its multiples it is a vector like any other,
   and the edges go grey. The card references the shipped files rather than
   pasting their geometry, which would be a second copy to keep in step. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';

/** The Dev Companion mark, from the file, at one size. */
const at = (variant: 'l' | 'm' | 's', size: number, label = String(size)): string =>
  `<div style="display:flex; flex-direction:column; align-items:center; gap:7px;"><svg class="sds-signet" width="${size}" height="${size}" aria-hidden="true"><use href="../assets/dev-companion-signet-${variant}.svg#art"></use></svg><span style="font-family:var(--font-mono); font-size:10px; color:var(--text-muted);">${label}</span></div>`;

const heading = (title: string, aside: string): string =>
  `<div style="display:flex; align-items:baseline; gap:12px; padding-bottom:9px; margin-bottom:14px; border-bottom:1px solid var(--border-subtle);">
      <span style="font-size:14px; font-weight:600;">${title}</span><span style="font-size:12px; color:var(--text-muted);">${aside}</span>
    </div>`;

const row = (marks: string, note: string): string =>
  `<div style="display:flex; align-items:center; gap:26px; flex-wrap:wrap;">${marks}<div class="spec-note" style="max-width:44ch;">${note}</div></div>`;

/** The card, as it is drawn. */
const CARD = `<div class="spec" style="--spec-gap:24px">

  <div class="spec-note" style="max-width:76ch;">
    Drawn on the Dev&nbsp;Companion mark, which is a worked example and not the
    system's own. The steps are what this card documents &#8212; a drawing per size,
    each one on the pixel grid of that size, and what each step costs the interior.
    Every mark in the family takes them, including
    <span class="sds-mono">design-system-signet-*.svg</span>.
  </div>

  <div>
    ${heading('Naive scaling', 'one drawing at every size &#8212; what goes wrong')}
    ${row(
      at('l', 64) + at('l', 32) + at('l', 24) + at('l', 16),
      'True at 32 and at 64, and nowhere between. At 24 the two-unit stroke lands on one and a half device pixels, so every line gets one hard edge and one soft one; at 16 the interior closes up and the three lines merge.',
    )}
  </div>

  <div>
    ${heading('Optical sizes', 'a drawing per size &#8212; 16&#8239;px is the floor')}
    <div style="display:flex; flex-direction:column; gap:20px;">
      ${row(
        at('l', 96) + at('l', 64) + at('l', 32),
        '<span class="sds-mono">L &#183; drawn at 32</span><br />Stroke 2, marker 10 &#215; 13, three lines. The full statement, and it holds at 32, 64 and 96.',
      )}
      ${row(
        at('m', 48) + at('m', 24),
        '<span class="sds-mono">M &#183; drawn at 24</span><br />Stroke 2 again, which in a smaller box is a heavier mark. The faint middle line goes: it was the one carrying the least.',
      )}
      ${row(
        at('s', 32) + at('s', 16),
        '<span class="sds-mono">S &#183; drawn at 16 &#183; favicon</span><br />Stroke 1, because sixteen pixels have nowhere to put two. The lines keep the ink the M is drawn with, so the mark gets heavier as the box shrinks rather than fainter.<br /><span style="color:var(--text-accent-quiet);">16&#8239;px is the minimum. Below it, use the wordmark alone.</span>',
      )}
    </div>
  </div>

  <div>
    ${heading('Three files', 'one per drawn size &#8212; the same way favicons are shipped')}
    <div style="display:flex; align-items:center; gap:26px; flex-wrap:wrap;">
      ${at('l', 32, 'signet-l &#183; 32')}
      ${at('m', 24, 'signet-m &#183; 24')}
      ${at('s', 16, 'signet-s &#183; 16')}
      <div class="spec-note" style="max-width:44ch;">Media queries inside one SVG only see their own viewport when the file is linked, and not reliably across renderers &#8212; so the size is chosen where it is known: at the link.<br /><br /><span class="spec-cap">&lt;link rel="icon" sizes="16x16" href="signet-s.svg"&gt;</span><br /><br />Every box is square, so one number sizes it and there is no aspect to state twice.</div>
    </div>
  </div>

</div>`;

const meta: Meta = {
  title: 'Specimens/Brand/Signet — sizes',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/brand-signet-sizes.card.html',
      group: 'Brand',
      name: 'Signet — sizes',
      subtitle: 'A drawing per size, each on that size’s pixel grid — the size is chosen at the link',
      viewport: '700x937',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string => CARD;

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
