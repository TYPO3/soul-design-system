/* Focus, as the States guideline shows it.

   The controls are the system's own markup, which is the whole point of a card
   about a state: a hand-built box wearing a ring says nothing about what the
   system does to a button. What a still cannot have is the pseudo-class, so
   `:focus-visible`'s own declarations are written onto them and nothing else
   is — the field is not even that, `is-focused` being a class the sheet
   defines. This is also where the `outline`/`outline-offset`/halo triple is
   read, so it is written out beside them. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/icon.ts';
import { type IconId } from '../../packages/frontend/src/components/icon.ts';
import { dsCard, indent, NNBSP, part, spec } from '../lib/specimen.ts';

/** The ring, written as `:focus-visible` writes it in `components.css` and
    not a value further. It said 5px here while the rule says 3, which is what
    a second copy of a value does the moment nobody is comparing them. */
const RING =
  'outline:var(--border-emphasis) solid var(--accent); outline-offset:var(--focus-offset); box-shadow:0 0 0 var(--focus-halo) var(--accent-ring); border-radius:var(--radius-control);';

/* Explicitly 16: these sit in 13–14px text, and an unsized icon follows the
   text it is in — the floor is the point on a card about controls. */
const icon = (name: IconId): string => part(html`<sds-icon name="${name}" size="16"></sds-icon>`);

/* The controls are the system's own, in the state the system names. Only the
   pseudo-class is written out, because a card is opened without a script and
   is never focused — the field does not even need that much: `is-focused` is
   a real class, and what it draws is the rule's own. */
const controls = (): string =>
  `<button type="button" class="sds-btn sds-btn--primary" style="${RING}"><span class="sds-btn__label">Install the server</span></button>
<button type="button" class="sds-btn sds-btn--secondary" style="${RING}">${icon('actions-duplicate')}<span class="sds-btn__label">Copy</span></button>
<span class="sds-field is-focused">${icon('actions-search')}<span class="sds-input">icon lookup</span></span>
<a href="#" class="sds-link" style="${RING}">typo3_server_scope</a>`;

const rules = (): string =>
  `<div class="spec-note" style="max-width:42ch;">The ring is the same on every control, and written once: <span class="spec-cap">--border-emphasis</span> of <span class="spec-cap">--accent</span>, standing <span class="spec-cap">--focus-offset</span> off the box, plus a halo <span class="spec-cap">--focus-halo</span> wide in <span class="spec-cap">--accent-ring</span> &#8212; 2, 2 and 3${NNBSP}px. A field that already has an accent border keeps the halo alone.</div>
<div class="spec-note" style="max-width:38ch;"><span class="sds-mono">:focus-visible</span>, never <span class="spec-cap">:focus</span> — a mouse click should not light the ring. Focus order follows the source. Nothing in this system is reachable by pointer only.</div>`;

const meta: Meta = {
  title: 'Specimens/States/Focus & keyboard',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/states-focus.card.html',
      group: 'States',
      name: 'Focus & keyboard',
      subtitle: 'One ring, everywhere — 2px accent plus a 3px halo, never a colour change alone',
      viewport: '700x214',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  spec(
    [
      `<div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">\n${indent(controls(), 2)}\n</div>`,
      `<div style="border-top:1px solid var(--border-subtle); padding-top:14px; display:flex; gap:30px; flex-wrap:wrap;">\n${indent(rules(), 2)}\n</div>`,
    ],
    { gap: '18px' },
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
