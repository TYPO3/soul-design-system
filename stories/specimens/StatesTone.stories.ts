/* A status on a word, as the States guideline shows it.

   `sds-badge` is the mark on a thing — a row, a card, a heading — and it draws
   a box. In the middle of a sentence or a table cell that box is furniture, so
   the three colours the palette means something with are also available on
   their own: the colour, and nothing else.

   Shown beside the badge rather than alone, because what a reader has to be
   able to tell is which of the two a case wants. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/badge.ts';
import { dsCard, DIVIDER, part, spec, specCap } from '../lib/specimen.ts';

/** In a line of prose, where a box would stop the reading. */
const inASentence = (): string =>
  part(html`<p>
  Four files stand <span class="sds-warn">uncommitted</span>, one source is
  <span class="sds-error">unreachable</span>, and the other five are
  <span class="sds-ok">answering</span>.
</p>`);

/** In a cell, where the count is the thing and the box would be wider than it. */
const inACell = (): string =>
  part(html`<table class="sds-table sds-table--compact">
  <thead><tr><th>Subject</th><th class="sds-td-end">When</th></tr></thead>
  <tbody>
    <tr><td>Uncommitted changes <span class="sds-warn">4 files</span></td><td class="sds-td-end">now</td></tr>
    <tr><td>Remove falsely committed files</td><td class="sds-td-end">11 days ago</td></tr>
  </tbody>
</table>`);

/** And the box, for the thing it is the mark on. */
const asAMark = (): string =>
  part(html`<div class="sds-row">
  <sds-badge label="answering" tone="ok"></sds-badge>
  <sds-badge label="slow · 2.4 s" tone="warn"></sds-badge>
  <sds-badge label="unreachable" tone="error"></sds-badge>
</div>`);

const meta: Meta = {
  title: 'Specimens/States/Status on a word',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/states-tone.card.html',
      group: 'States',
      name: 'Status on a word',
      subtitle: 'The three status colours without the box — and the badge, for what the box is for',
      viewport: '700x345',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  spec([
    specCap('.sds-ok .sds-warn .sds-error — the colour on a word, in prose'),
    inASentence(),
    specCap('and in a cell, where a pill would be wider than the count it marks', DIVIDER),
    inACell(),
    specCap('sds-badge — the mark on a thing, which is what the box is for', DIVIDER),
    asAMark(),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
