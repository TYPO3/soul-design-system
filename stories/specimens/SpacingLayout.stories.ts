/* The layout frame.

   The three measurements a page is built on, drawn once: a 210px tool rail, a
   1200px page measure, and the 48px gutter between the page and the screen.
   The rail's width comes from the token rather than from the number, so the
   drawing moves when the system does.

   A frame rather than a page: the layout classes are documented by the pages
   themselves, under `Pages` — what this card is for is the measurements they
   are all built on. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';

const MONO = 'font-family:var(--font-mono); font-size:12px;';

const rail = (): string =>
  `<div style="border-right:1px solid var(--border-subtle); background:var(--surface-raised); padding:12px; display:flex; flex-direction:column; gap:7px;">
  <span class="spec-lbl">TOOL SURFACE</span>
  <span style="${MONO} background:var(--accent); color:var(--text-on-accent); padding:3px 7px; align-self:flex-start;">typo3_rule_lookup</span>
  <span style="${MONO} color:var(--text-secondary); padding:3px 7px;">typo3_hint_lookup</span>
</div>`;

const column = (): string =>
  `<div style="padding:14px 18px;">
  <div style="font-family:var(--font-mono); font-size:18px; color:var(--text-primary);">typo3_rule_lookup</div>
  <div style="height:1px; background:var(--border-subtle); margin:12px 0;"></div>
  <div class="spec-cap" style="font-size:11px;">--width-sidebar 210 · --gutter-page 48 · --width-page 1200</div>
</div>`;

const meta: Meta = {
  title: 'Specimens/Spacing/Layout frame',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/spacing-layout.card.html',
      group: 'Spacing',
      name: 'Layout frame',
      subtitle: '210px tool rail, 1200px page measure, 48px page gutter',
      viewport: '700x152',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  `<div style="padding:16px 20px;">
  <div style="border:1px solid var(--border-subtle); display:grid; grid-template-columns:var(--width-sidebar) 1fr; height:120px;">
${[rail(), column()].map((s) => s.split('\n').map((l) => `    ${l}`).join('\n')).join('\n')}
  </div>
</div>`;

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
