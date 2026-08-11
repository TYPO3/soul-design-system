/* Three weights of voice, plus the link colour.

   Primary is the answer, secondary is what qualifies it, muted is what the
   machine noted in passing — and each is shown at the size it is actually
   set at, because a colour read at one size is a different colour at
   another. The sample text says what the register is for rather than
   repeating the token name beside it. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard, specPad } from '../lib/specimen.ts';

interface Voice {
  size: number;
  token: string;
  hex: string;
  sample: string;
  /** The link is an anchor, because a link that cannot be opened is a colour
      swatch pretending to be one. */
  link?: boolean;
}

const VOICES: readonly Voice[] = [
  { size: 19, token: '--text-primary', hex: '#EDE9E2', sample: 'Answers with their source attached' },
  { size: 17, token: '--text-secondary', hex: '#A9A299', sample: 'Version-bound knowledge that needs nothing running' },
  { size: 15, token: '--text-muted', hex: '#878076', sample: 'stdio · php 8.2+' },
  { size: 15, token: '--text-link', hex: '#FFA338', sample: 'typo3_server_scope', link: true },
];

const line = ({ size, token, hex, sample, link }: Voice): string => {
  const style = `font-size:${size}px; color:var(${token});`;
  const text = link ? `<a href="#" style="${style}">${sample}</a>` : `<span style="${style}">${sample}</span>`;
  return `<div style="display:flex; align-items:baseline; gap:14px;">${text}<span class="spec-cap">${token} · ${hex}</span></div>`;
};

const meta: Meta = {
  title: 'Specimens/Colours/Text',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/colors-text.card.html',
      group: 'Colors',
      name: 'Text',
      subtitle: 'Three weights of voice, plus the link colour',
      viewport: '700x160',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  specPad(VOICES.map(line), 'display:flex; flex-direction:column; gap:9px;');

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
