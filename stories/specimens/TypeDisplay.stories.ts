/* Display and headings.

   Source Sans 3 at 600, tracked in as it grows: display is −0.03em, a heading
   −0.015em, and body copy none at all. One display per page — a second one is
   two first impressions.

   Every value comes from a token, so the specimen cannot drift from the scale
   it documents. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard, specCap, specPad } from '../lib/specimen.ts';

const DISPLAY =
  'font-size:var(--font-size-display); line-height:var(--leading-display); letter-spacing:var(--tracking-display); font-weight:var(--weight-semibold);';
const H2 =
  'font-size:var(--font-size-h2); line-height:var(--leading-heading); letter-spacing:var(--tracking-heading); font-weight:var(--weight-semibold); margin-top:6px;';

const meta: Meta = {
  title: 'Specimens/Type/Display & headings',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/type-display.card.html',
      group: 'Type',
      name: 'Display & headings',
      subtitle: 'Source Sans 3, 600, tight tracking — one per page',
      viewport: '700x178',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  specPad([
    `<div style="${DISPLAY}">It answers before</div>`,
    `<div style="${H2}">Three audiences, one server</div>`,
    specCap('--font-size-display / --font-size-h2 · 58 / 34 px · 600 · -0.03em / -0.015em', 'margin-top:12px;'),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
