/* Status and syntax, in both modes.

   These are the only colours in the system that mean something, and they are
   allowed in exactly three places: a code block, a badge, a result row. Never
   as page furniture — a colour that means "something is wrong" used as
   decoration is saying so about the page.

   Shown on the small chip, because none of them is ever a plane. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';
import { modes, swatch } from '../lib/swatch.ts';

const MARKS: readonly { token: string; light: string; dark: string }[] = [
  { token: '--status-ok', light: '#4F7A3A', dark: '#7FA96B' },
  { token: '--status-warn', light: '#986200', dark: '#D9A441' },
  { token: '--status-error', light: '#A33328', dark: '#D4685C' },
  { token: '--syntax-string', light: '#3F6B2B', dark: '#9CC27F' },
];

const row = (mode: 'light' | 'dark'): readonly string[] =>
  MARKS.map((m) => swatch({ token: m.token, hex: m[mode], style: `background:var(${m.token});`, small: true }));

const meta: Meta = {
  title: 'Specimens/Colours/Status & syntax',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/colors-status.card.html',
      group: 'Colors',
      name: 'Status & syntax',
      subtitle: 'Only ever inside code blocks, badges and result rows',
      theme: 'both',
      viewport: '700x230',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string => modes(row('light'), row('dark'));

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
