/* The note that stands at the foot of a document, and the mark in the text that
   sends a reader to one.

   One shape and one name: a citation is a note whose label carries a work's
   name rather than a number, which is content and not a second look — the card
   shows both so that is visible. What it has to show is that the label hangs
   beside the text rather than above it, so a column of them lines up on one
   edge, and the arrival, because a stack of alike rows is the one place a
   reader needs telling where they landed. That last one is drawn by hand:
   `:target` needs an address, and a card is opened without one. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { DIVIDER, dsCard, specCap, specCol, specLbl, specPad } from '../lib/specimen.ts';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

const COLUMN =
  'flex:1; min-width:0; display:flex; flex-direction:column; gap:10px; font-size:var(--font-size-body); line-height:var(--leading-body); color:var(--text-secondary);';

const MARK = `<p style="margin:0;">A statement that needs a source
  <sup>[<a class="sds-link" href="#">1</a>]</sup>, and one that cites a
  work <sup>[<a class="sds-link" href="#">CIT2026</a>]</sup>.</p>`;

const FOOTNOTE = `<div class="sds-footnote">
  <div class="sds-footnote__label">[1]</div>
  <div class="sds-footnote__content"><p>The note itself, at the foot of the document.</p></div>
</div>`;

const CITATION = `<div class="sds-footnote">
  <div class="sds-footnote__label">[CIT2026]</div>
  <div class="sds-footnote__content"><p>A work being cited, named rather than numbered.</p></div>
</div>`;

/* The arrival, with the property the state assigns set by hand — a card has no
   address for `:target` to match. */
const ARRIVED = `<div class="sds-footnote" style="--sds-footnote-label-ink: var(--text-accent-quiet);">
  <div class="sds-footnote__label">[2]</div>
  <div class="sds-footnote__content"><p>The one the mark sent the reader to.</p></div>
</div>`;

const meta: Meta = {
  title: 'Specimens/Type/Notes',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/type-notes.card.html',
      group: 'Type',
      name: 'Notes at the foot',
      subtitle: 'sds-footnote: the label beside the text, a named one, and the note it sent you to',
      viewport: '700x285',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  specPad(
    [
      specCol([specLbl('IN THE TEXT'), MARK], COLUMN),
      specCol(
        [
          specCol([specLbl('AT THE FOOT'), FOOTNOTE, CITATION], COLUMN),
          specCol([specLbl('ARRIVED AT'), ARRIVED], COLUMN),
        ],
        'display:flex; gap:20px; align-items:flex-start;',
      ),
      specCap(
        'label --font-mono at 0.9em · gap --space-2 · the arrival is the accent, the mark every landing on this system makes',
        DIVIDER,
      ),
    ],
    'display:flex; flex-direction:column; gap:14px;',
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
