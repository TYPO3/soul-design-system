/* States and motion.

   The states of one control in a row, and the rule they share: colour and
   border change, nothing moves and nothing bounces. 140ms with an ease-out —
   long enough to be seen, short enough that it is not being waited for.

   Every one of them is the real control in the real state. A still cannot
   hover and cannot hold focus, so those two carry the declarations their own
   rule in `components.css` sets and nothing besides — no font, no padding, no
   border of this card's own. `disabled` needs none of that: the attribute is
   the state, and `:disabled` draws it. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';

/** What `.sds-btn--secondary:hover` and `:focus-visible` set, in that order. */
const HOVER = 'background:var(--surface-raised); border-color:var(--text-muted);';
const FOCUS = 'outline:var(--border-emphasis) solid var(--accent); outline-offset:2px; box-shadow:0 0 0 3px var(--accent-ring);';

/** The card, as it is drawn. There is no pressed state in this system, so
    there is none on the card: the accent-filled control is a variant, which
    is a decision about the action and not a state it passes through. */
const CARD = `<div class="spec-pad" style="display:flex; gap:14px; align-items:center;">
  <button type="button" class="sds-btn sds-btn--secondary">rest</button>
  <button type="button" class="sds-btn sds-btn--secondary" style="${HOVER}">hover</button>
  <button type="button" class="sds-btn sds-btn--secondary" style="${FOCUS}">focus</button>
  <button type="button" class="sds-btn sds-btn--secondary" disabled>disabled</button>
  <span class="spec-lbl" style="margin-left:auto;">140ms · ease-out</span>
</div>`;

const meta: Meta = {
  title: 'Specimens/Brand/States & motion',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/brand-motion.card.html',
      group: 'Brand',
      name: 'States & motion',
      subtitle: 'Colour and border only — nothing moves position, nothing bounces',
      viewport: '700x90',
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
