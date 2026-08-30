/* Loading, as the States guideline shows it.

   Two forms and the rule between them: a named wait, and skeleton rows where
   the shape is already known. The spinner and the skeleton are class-layer
   only — there is no element for either, because neither has anything to
   decide; what the card documents is when to reach for which.

   The glyph is the set's own `spinner-circle` — a faint ring and the arc that
   travels round it — turned by `.sds-spinner`, which spins whatever is put in
   it. Nothing here draws a mark of its own. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/icon.ts';
import { dsCard, DIVIDER, indent, NNBSP, part, spec } from '../lib/specimen.ts';

const BOX = 'flex:1; min-width:240px; border:1px solid var(--border-subtle); border-radius:var(--radius-card); padding:14px;';

const SPINNER = part(html`<sds-icon name="spinner-circle" size="16"></sds-icon>`);

/** A wait that says what is being waited on. */
const named = (): string =>
  `<div style="${BOX}">
  <div class="sds-loading"><span class="sds-spinner">${SPINNER}</span><span class="sds-loading__label">booting the installation…</span></div>
  <div class="spec-note" style="margin-top:8px;">Named work, with the thing being waited on in mono.</div>
</div>`;

/** Rows where the shape is known before the answer is. */
const skeleton = (): string =>
  `<div style="${BOX}">
  <div style="display:flex; flex-direction:column; gap:8px;">
    <span class="sds-skeleton" style="width:62%"></span>
    <span class="sds-skeleton" style="width:88%; animation-delay:0.15s"></span>
    <span class="sds-skeleton" style="width:44%; animation-delay:0.3s"></span>
  </div>
  <div class="spec-note" style="margin-top:10px;">Skeleton rows only where the shape is already known — a table, a list. Never for a single value.</div>
</div>`;

const meta: Meta = {
  title: 'Specimens/States/Loading',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/states-loading.card.html',
      group: 'States',
      name: 'Loading',
      subtitle: 'The server is a subprocess — say what is being waited on, not just that something is',
      viewport: '700x273',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  spec([
    `<div style="display:flex; gap:14px; flex-wrap:wrap; align-items:flex-start;">\n${indent([named(), skeleton()].join('\n'), 2)}\n</div>`,
    `<div class="spec-note" style="${DIVIDER} max-width:74ch;">Under 200${NNBSP}ms show nothing — a flash of skeleton is worse than a pause. Over 2${NNBSP}s the label has to say why: <span class="sds-mono">booting the installation</span>, <span class="sds-mono">reading packages instead</span>, <span class="sds-mono">searching docs.typo3.org</span>. This product answers from three sources; which one is running is the useful part.</div>`,
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
