/* Bullets, numbers, and the list that is a list of links.

   What the card shows is the class layer on its own, which is what a screen
   gets: the marker, the indent at the marker's own width, and the muted marker
   colour. The air between the items is `.sds-list`, and it is on the first two
   columns only — a column of one-line links does not want it, which is why it
   is a class and not part of the reset.

   The lettered level is written with the `type` attribute a renderer emits for
   a source that said `a.`. It is the one thing on this card the system
   deliberately does not decide.

   Set at the body register with inline styles rather than by wrapping the
   columns in `.sds-prose`: that class brings a measure and the block rhythm
   with it, and what is being shown here is the list itself and not the
   document it usually stands in. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { DIVIDER, dsCard, specCap, specCol, specLbl, specPad } from '../lib/specimen.ts';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

const COLUMN =
  'flex:1; min-width:0; display:flex; flex-direction:column; gap:10px; font-size:var(--font-size-body); line-height:var(--leading-body); color:var(--text-secondary);';

const BULLETS = `<ul class="sds-list">
  <li>An item, and its text lines up with the paragraph above it
    <ul>
      <li>Nested, one step in</li>
    </ul>
  </li>
  <li>A second item</li>
</ul>`;

const NUMBERS = `<ol class="sds-list">
  <li>A step that is taken in order
    <ol type="a">
      <li>Lettered, because the source said so</li>
    </ol>
  </li>
  <li>A second step</li>
</ol>`;

const PLAIN = `<ul class="sds-list sds-list--plain">
  <li><a class="sds-link" href="#">Every item is a link</a></li>
  <li><a class="sds-link" href="#">so nothing is marked twice</a></li>
</ul>`;

const meta: Meta = {
  title: 'Specimens/Type/Lists',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/type-lists.card.html',
      group: 'Type',
      name: 'Lists',
      subtitle: 'Bullets and numbers indented by the marker; sds-list--plain for a list of links',
      viewport: '700x260',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  specPad(
    [
      specCol(
        [
          specCol([specLbl('BULLETS'), BULLETS], COLUMN),
          specCol([specLbl('NUMBERS'), NUMBERS], COLUMN),
          specCol([specLbl('LINKS'), PLAIN], COLUMN),
        ],
        'display:flex; gap:20px; align-items:flex-start;',
      ),
      specCap('indent --space-5 · marker --text-muted · .sds-list is the air between items', DIVIDER),
    ],
    'display:flex; flex-direction:column; gap:14px;',
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
