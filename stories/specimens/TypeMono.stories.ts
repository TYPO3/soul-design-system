/* Mono, and the label register.

   Source Code Pro carries everything the machine reads, writes or names, at
   every size, and none of it is ever title-cased. The label register is the
   same face at 11px, tracked out and upper case, for the line *over* a group.

   The block at the bottom is drawn rather than composed from `sds-code`: what
   this documents is the face and the leading, and a code block would put its
   own frame and copy button in front of them. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard, specLbl, specPad } from '../lib/specimen.ts';

const NAME = 'font-family:var(--font-mono); font-size:26px; font-weight:500; letter-spacing:-0.01em;';
const BLOCK =
  'margin:0; font-family:var(--font-mono); font-size:var(--font-size-code); line-height:var(--leading-code); color:var(--text-secondary); background:var(--surface-sunken); border:1px solid var(--border-subtle); border-radius:var(--radius-card); padding:12px 14px;';

/* Written as one string with a real newline in it: the two lines are the
   content of a `<pre>`, and anything that indents them indents the output. */
const block = (): string =>
  `<pre style="${BLOCK}"><span style="color:var(--syntax-comment);"># clone, install once</span>
<span style="color:var(--accent);">$</span> composer install</pre>`;

const meta: Meta = {
  title: 'Specimens/Type/Mono & labels',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/type-mono.card.html',
      group: 'Type',
      name: 'Mono & labels',
      subtitle: 'Source Code Pro carries tool names, labels and every code block',
      viewport: '700x190',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  specPad(
    [
      `<div style="${NAME}">typo3_icon_lookup</div>`,
      specLbl('TOOL SURFACE · 11 px · 0.09em · uppercase'),
      block(),
    ],
    'display:flex; flex-direction:column; gap:12px;',
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
