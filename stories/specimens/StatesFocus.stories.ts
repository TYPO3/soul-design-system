/* Focus, as the States guideline shows it.

   The one card that may not use the components it documents. A focus ring
   exists only while something has focus, and a card is opened without a script
   and never focused — so the ring is drawn here, on plain markup, at the values
   `components.css` sets. Handing it to `sds-button` would produce three
   controls at rest. That is also why the numbers are written out: this is where
   the `outline`/`outline-offset`/halo triple is read. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../src/components/icon.ts';
import { type IconId } from '../../src/components/icon.ts';
import { dsCard, indent, NNBSP, part, spec } from '../lib/specimen.ts';

/** The ring, as every control gets it. */
const RING = 'outline:2px solid var(--accent); outline-offset:2px; box-shadow:0 0 0 5px var(--accent-ring);';

/* Explicitly 16: these sit in 13–14px text, and an unsized icon follows the
   text it is in — the floor is the point on a card about controls. */
const icon = (name: IconId): string => part(html`<sds-icon name="${name}" size="16"></sds-icon>`);

const controls = (): string =>
  `<button style="font-family:var(--font-sans); font-size:14px; font-weight:600; color:var(--text-on-accent); background:var(--accent); border:none; border-radius:var(--radius-control); padding:8px 15px; ${RING} cursor:pointer;">Install the server</button>
<span style="display:inline-flex; align-items:center; gap:8px; font-family:var(--font-mono); font-size:13px; color:var(--text-primary); border:1px solid var(--border-strong); border-radius:var(--radius-control); padding:6px 11px; ${RING}">${icon('actions-duplicate')}Copy</span>
<span style="display:inline-flex; align-items:center; gap:8px; background:var(--surface-sunken); border:1px solid var(--accent); border-radius:var(--radius-control); padding:7px 11px; box-shadow:0 0 0 3px var(--accent-ring); color:var(--text-muted);">${icon('actions-search')}<span style="font-size:14px; color:var(--text-primary);">icon lookup</span><span style="width:1.5px; height:15px; background:var(--accent);"></span></span>
<a href="#" style="font-size:15px; color:var(--text-link); outline:2px solid var(--accent); outline-offset:3px; border-radius:2px;">typo3_server_scope</a>`;

const rules = (): string =>
  `<div class="spec-note" style="max-width:42ch;">The ring is the same on every control: <span class="sds-mono">outline: 2px solid var(--accent)</span> with <span class="sds-mono">outline-offset: 2px</span>, plus a 3–5${NNBSP}px halo in <span class="spec-cap">--accent-ring</span>. A field that already has an accent border keeps the halo alone.</div>
<div class="spec-note" style="max-width:38ch;"><span class="sds-mono">:focus-visible</span>, never <span class="spec-cap">:focus</span> — a mouse click should not light the ring. Focus order follows the source. Nothing in this system is reachable by pointer only.</div>`;

const meta: Meta = {
  title: 'Specimens/States/Focus & keyboard',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/states-focus.card.html',
      group: 'States',
      name: 'Focus & keyboard',
      subtitle: 'One ring, everywhere — 2px accent plus a 3px halo, never a colour change alone',
      viewport: '700x230',
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
