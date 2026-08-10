/* The three planes: card, panel and sunken.

   The markup lives in `src/components/card.ts`. They differ only in fill,
   because the system has no shadows — a plane is told apart by its fill and
   a hairline and by nothing else.

   This file also generates `components/surfaces/surfaces.card.html`, which
   shows the planes *and* the overlays over them. One card, because the claim
   is about the pair: without a shadow an overlay needs a plane under it to
   be an overlay of anything. The overlays have their own stories in
   `Overlay.stories.ts`; the scene is imported from there rather than
   written twice. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../src/components/card.ts';
import { type SurfaceProps } from '../src/components/card.ts';
import { scene } from './Overlay.stories.ts';
import { dsCard, indent, part, px, spec, specCap } from './lib/specimen.ts';

const sdsSurface = ({ plane = 'card', title, body }: SurfaceProps) =>
  html`<sds-surface plane="${plane}" heading="${title}" .body="${body}"></sds-surface>`;

const meta: Meta<SurfaceProps> = {
  title: 'Components/Card',
  tags: ['autodocs'],
  /* Storybook treats every export as a story. These are the helpers the
     card generator and the sibling stories import. */
  excludeStories: ['specimenHtml'],
  render: (args) => sdsSurface(args),
  argTypes: {
    plane: { control: 'inline-radio', options: ['card', 'panel', 'sunken'] },
    title: { control: 'text' },
    body: { control: 'text' },
  },
  /* The narrow no-break space before a unit is the system's own typography —
     `6 px`, `560 PX` all set with U+202F so a number cannot be split from
     its unit across a line. It belongs in the copy, not in CSS. */
  args: { plane: 'card', title: 'Card', body: `Hairline border, ${px(6)} radius, no fill. The default container.` },
  parameters: {
    dsCard: dsCard({
      path: 'components/surfaces/surfaces.card.html',
      name: 'Card, panel, modal & drawer',
      subtitle: 'No shadows anywhere — a wash and a border do the separating',
      viewport: '700x420',
    }),
  },
};

export default meta;
type Story = StoryObj<SurfaceProps>;

/** A hairline and 6px, no fill — the default container. */
export const Card: Story = { args: { plane: 'card', title: 'Card', body: `Hairline border, ${px(6)} radius, no fill. The default container.` } };

/** A raised fill, for when it sits on the canvas and has to read as a plane. */
export const Panel: Story = { args: { plane: 'panel', title: 'Panel', body: 'Raised fill when it sits on the canvas and has to read as a plane.' } };

/** Machine output: code, logs, structured content. */
export const Sunken: Story = { args: { plane: 'sunken', title: 'Sunken', body: 'For machine output: code, logs, structured content.' } };

export const specimenHtml = (): string =>
  spec([
    `<div style="display:flex; gap:14px; flex-wrap:wrap;">\n${indent([Card, Panel, Sunken].map((s) => part(sdsSurface(s.args as SurfaceProps))).join('\n'), 2)}\n</div>`,
    `<div style="position:relative; height:210px; border:1px solid var(--border-subtle); border-radius:var(--radius-card); overflow:hidden; background:var(--surface-canvas);">\n${indent(part(scene()), 2)}\n</div>`,
    specCap(`OVERLAY --surface-overlay · MODAL CENTRED, MAX ${px(560, 'PX')} · DRAWER FROM THE RIGHT · NO SHADOW ON EITHER`),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
