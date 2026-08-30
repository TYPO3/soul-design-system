/* The set — a sample of it, drawn from the sprite.

   Whole categories ship, and the card shows enough of them to recognise the
   family and states the rule for the rest. The identifiers are TYPO3 core's
   own, which is the only reason this card can be a list of names: an agent
   that resolves `actions-search` through the tool gets the same string the
   design writes.

   The sample is `sds-icon` rather than pasted SVG paths, so adding one to the
   card is adding a word. `CATEGORIES` in `scripts/icons.ts` says which
   categories are here; no count is written down. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/icon.ts';
import { type IconId } from '../../packages/frontend/src/components/icon.ts';
import { dsCard, DIVIDER, indent, part, spec } from '../lib/specimen.ts';

/** The sample, in the order the set lists them. The `title` is what a reader
    hovering the card is after: the identifier, not a description of the
    drawing. */
const SAMPLE: readonly IconId[] = [
  'actions-arrow-right', 'actions-book', 'actions-check-circle', 'actions-check',
  'actions-chevron-down', 'actions-chevron-end', 'actions-chevron-start', 'actions-chevron-up',
  'actions-clock', 'actions-close', 'actions-code-commit', 'actions-code-compare',
  'actions-code-pull-request', 'actions-code', 'actions-cog', 'actions-database',
  'actions-debug', 'actions-document-edit', 'actions-duplicate', 'actions-exclamation-circle',
  'actions-exclamation-triangle', 'actions-extension', 'actions-filter', 'actions-globe',
  'actions-history', 'actions-info-circle', 'actions-link', 'actions-list',
  'actions-menu-alternative', 'actions-play', 'actions-question-circle', 'actions-refresh',
  'actions-search', 'actions-tag', 'actions-window-open',
  /* The other category, and the whole of it: one mark, which is what
     `.sds-spinner` turns wherever this system says work is happening. */
  'spinner-circle',
];

const GRID =
  'display:grid; grid-template-columns:repeat(12, 1fr); gap:15px 10px; align-items:center; justify-items:center; color:var(--text-secondary);';

const NOTE =
  'A category ships whole — <span class="sds-mono">actions</span> and <span class="sds-mono">spinner</span> are the ones here, and a sample of them is shown. ' +
  'The identifiers are the core’s own — <span class="sds-mono">actions-search</span>, <span class="sds-mono">spinner-circle</span> — ' +
  'so an agent resolving one through <span class="sds-mono">typo3_icon_lookup</span> gets the same name the design uses, and the first segment is the path: ' +
  '<span class="sds-mono">src/actions/actions-search.svg</span>, in the package or under <span class="sds-mono">cdn.jsdelivr.net/npm/@typo3/icons@5.0.3/src/</span>. ' +
  'Anything outside the shipped categories is fetched from there — never drawn locally, never taken from another set. ' +
  'Missing upstream too, it is contributed to <span class="sds-mono">TYPO3/TYPO3.Icons</span>.';

const meta: Meta = {
  title: 'Specimens/Icons/The set',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/icons-set.card.html',
      group: 'Icons',
      name: 'The set',
      subtitle: 'TYPO3.Icons — the core’s own, 16×16, solid, currentColor',
      viewport: '700x289',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  spec([
    `<div style="${GRID}">\n${indent(
      SAMPLE.map((name) => `<span title="${name}" style="display:flex">${part(html`<sds-icon name="${name}" size="16"></sds-icon>`)}</span>`).join('\n'),
      2,
    )}\n</div>`,
    `<div class="spec-note" style="${DIVIDER}">${NOTE}</div>`,
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
