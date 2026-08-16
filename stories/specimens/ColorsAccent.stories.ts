/* The accent, and the three values around it.

   One accent, and the card exists to say how narrow that is: TYPO3 orange
   marks the active nav item, the shell prompt and the wordmark pipe, and
   nothing else. The other three are what the accent becomes where it cannot
   be itself — hovered, set as text on paper, or reduced to a hairline. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard, indent, specPad, specRow } from '../lib/specimen.ts';

/** A tall chip with its name and value under it — the accent is shown large
    because it is the one colour the system spends. */
interface Column {
  /** What paints the chip: a token, or a literal where the value belongs to
      the mode this card is not being shown in. */
  paint: string;
  name: string;
  hex: string;
}

const COLUMNS: readonly Column[] = [
  { paint: 'var(--accent)', name: '--accent', hex: '#FF8700' },
  { paint: 'var(--accent-hover)', name: '--accent-hover', hex: '#FFA338' },
  /* Literal, and deliberately: this is the link colour on paper, and the card
     is dark. A token here would draw the dark value and name the light one. */
  { paint: '#B35A00', name: '--text-link (light)', hex: '#B35A00' },
  { paint: 'var(--border-accent-quiet)', name: '--border-accent-quiet', hex: '#4A4437' },
];

const MONO = 'font-family:var(--font-mono); font-size:11px;';

const column = ({ paint, name, hex }: Column): string =>
  `<div style="display:flex; flex-direction:column; gap:7px; min-width:104px;">
  <div style="height:46px; background:${paint}; border:1px solid var(--border-subtle);"></div>
  <div style="${MONO} color:var(--text-primary);">${name}</div>
  <div style="${MONO} color:var(--text-muted);">${hex}</div>
</div>`;

const meta: Meta = {
  title: 'Specimens/Colours/Accent',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/colors-accent.card.html',
      group: 'Colors',
      name: 'Accent',
      subtitle: 'TYPO3 orange is the only accent — used sparingly',
      viewport: '700x137',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  specPad([specRow([indent(COLUMNS.map(column).join('\n'), 0)])]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
