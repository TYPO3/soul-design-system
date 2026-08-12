/* How an icon is used: the sizes, the colour, and the four that may stand
   alone.

   16px is the floor and the reason is the drawing itself — the icons are hinted
   for a 16-unit grid, so 18 and 22 land between grid lines and the shapes break
   down below 16. Colour is `currentColor` and nothing else.

   Every glyph is a name rather than a path, which is also the check: a name
   that does not exist throws when the card is generated. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../src/components/icon.ts';
import { type IconId } from '../../src/components/icon.ts';
import { dsCard, indent, NNBSP, part, spec } from '../lib/specimen.ts';

/* Always sized. Every glyph on this card is a standalone mark rather than
   one inside a line of text, and the card is about the three sizes. */
const icon = (name: IconId, size: 16 | 20 | 24 = 16): string =>
  part(html`<sds-icon name="${name}" size="${size}"></sds-icon>`);

/** In the colour it is being shown in. */
const tinted = (name: IconId, colour: string): string => `<span style="color:var(${colour});">${icon(name)}</span>`;

/* ------------------------------------------------------------- the sizes -- */

const SIZES = [24, 20, 16] as const;

const sizes = (): string =>
  `<span style="display:inline-flex; align-items:flex-end; gap:18px; color:var(--text-secondary);">
${indent(
    SIZES.map(
      (size) =>
        `<span style="display:flex; flex-direction:column; align-items:center; gap:6px;">${icon('actions-search', size)}<span class="spec-cap">${size}</span></span>`,
    ).join('\n'),
    2,
  )}
</span>`;

const SIZE_NOTE =
  'Three sizes: <strong style="color:var(--text-primary); font-weight:600;">16</strong> beside 15–17' +
  NNBSP +
  'px text, <strong style="color:var(--text-primary); font-weight:600;">20</strong> in toolbars and buttons, ' +
  '<strong style="color:var(--text-primary); font-weight:600;">24</strong> in empty states.<br />' +
  `<span style="color:var(--text-accent-quiet);">16${NNBSP}px is the floor.</span> ` +
  'TYPO3.Icons are hinted for a 16-unit grid and optimised for that size — below it the shapes break down, ' +
  'and 18 or 22 land between grid lines. Use 16, 20, 24, or a whole multiple.';

/* ----------------------------------------------------------- the colours -- */

/** Two registers, the accent, and the three status colours — which are the
    only ones that may appear on an icon at all. */
const COLOURS: readonly { name: IconId; colour: string }[] = [
  { name: 'actions-list', colour: '--text-secondary' },
  { name: 'actions-list', colour: '--text-muted' },
  { name: 'actions-list', colour: '--accent' },
  { name: 'actions-check-circle', colour: '--status-ok' },
  { name: 'actions-exclamation-triangle', colour: '--status-warn' },
  { name: 'actions-exclamation-circle', colour: '--status-error' },
];

const colours = (): string =>
  `<div style="display:flex; flex-direction:column; gap:9px;">
  <span class="spec-cap">COLOUR</span>
  <span style="display:inline-flex; align-items:center; gap:14px;">
${indent(COLOURS.map(({ name, colour }) => tinted(name, colour)).join('\n'), 4)}
  </span>
  <div class="spec-note" style="max-width:36ch;">Icons are <span class="sds-mono">currentColor</span>. Default is <span class="spec-cap">--text-secondary</span>; <span class="spec-cap">--accent</span> only on an active item; status colours only on status icons.</div>
</div>`;

/* --------------------------------------------------- standing on its own -- */

/** The four an answer may carry with no label beside it. Everything else
    gets words. */
const ALONE: readonly { name: IconId; says: string }[] = [
  { name: 'actions-check-circle', says: 'answered' },
  { name: 'actions-exclamation-triangle', says: 'version-bound — check the line' },
  { name: 'actions-exclamation-circle', says: 'the installation could not be booted' },
  { name: 'actions-info-circle', says: 'boundary, stated on purpose' },
];

const alone = (): string =>
  `<div style="display:flex; flex-direction:column; gap:9px;">
  <span class="spec-cap">MEANING WITHOUT A LABEL</span>
  <div style="display:flex; flex-direction:column; gap:7px;">
${indent(
    ALONE.map(
      ({ name, says }) =>
        `<span style="display:inline-flex; align-items:center; gap:8px;">${tinted(name, '--text-secondary')}<span class="sds-mono" style="color:var(--text-secondary);">${says}</span></span>`,
    ).join('\n'),
    4,
  )}
  </div>
  <div class="spec-note" style="max-width:36ch;">These four are the only icons allowed to stand alone. Everything else carries a label.</div>
</div>`;

/* ------------------------------------------------------ beside a label -- */

const CHIP = 'display:inline-flex; align-items:center; gap:8px; font-family:var(--font-mono); font-size:13px;';

const labelled = (): string =>
  `<span style="${CHIP} color:var(--text-on-accent); background:var(--accent); border-radius:var(--radius-control); padding:6px 11px;">${icon('actions-play')}Run the checks</span>
<span style="${CHIP} color:var(--text-primary); border:1px solid var(--border-strong); border-radius:var(--radius-control); padding:5px 10px;">${icon('actions-duplicate')}Copy</span>
<span style="display:inline-flex; align-items:center; gap:6px; font-size:14px; color:var(--text-link);">Read the tool surface ${icon('actions-arrow-right')}</span>
<span class="spec-note" style="max-width:24ch;">Icon before a label, 8${NNBSP}px gap — except a direction icon, which follows it.</span>`;

const meta: Meta = {
  title: 'Specimens/Icons/Usage',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/icons-usage.card.html',
      group: 'Icons',
      name: 'Usage',
      subtitle: '16px is the floor — sizes, colour, and icons that stand alone',
      viewport: '700x470',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  spec(
    [
      `<div style="display:flex; align-items:center; gap:34px; flex-wrap:wrap;">\n${indent(
        `${sizes()}\n<div class="spec-note" style="max-width:40ch;">${SIZE_NOTE}</div>`,
        2,
      )}\n</div>`,
      `<div style="border-top:1px solid var(--border-subtle); padding-top:16px; display:flex; gap:30px; flex-wrap:wrap;">\n${indent(
        `${colours()}\n${alone()}`,
        2,
      )}\n</div>`,
      `<div style="border-top:1px solid var(--border-subtle); padding-top:14px; display:flex; align-items:center; gap:24px; flex-wrap:wrap;">\n${indent(labelled(), 2)}\n</div>`,
    ],
    { gap: '20px' },
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
