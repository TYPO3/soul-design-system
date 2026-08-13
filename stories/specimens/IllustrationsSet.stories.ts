/* The illustration set, together rather than one card at a time.

   The story proves the two constraints that disappear when an image is seen
   alone: all eight belong to one visual language, and the same PNG remains in
   place when the surrounding surface changes mode. The filenames stay under
   the images because this is also the picker for future card stories. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard, indent, spec, specRule } from '../lib/specimen.ts';

const IMAGES: readonly { file: string; subject: string }[] = [
  { file: 'tool-source-answer.png', subject: 'person at a computer' },
  { file: 'tool-package-registry.png', subject: 'physical card index' },
  { file: 'tool-external-path.png', subject: 'one external cable' },
  { file: 'tool-changelog-history.png', subject: 'historical strata' },
  { file: 'tool-registration.png', subject: 'module outside its socket' },
  { file: 'tool-written-record.png', subject: 'lamp and folded sheet' },
  { file: 'tool-search.png', subject: 'search ring and cards' },
  { file: 'tool-compare.png', subject: 'two material swatches' },
];

const RULES: readonly string[] = [
  '<b>One file in both modes.</b> The surrounding surface changes; the illustration does not.',
  '<b>1200 × 750 PNG.</b> Wide enough for a card, with crop-safe space around one subject.',
  '<b>Five to eight broad silhouettes.</b> At most two flat tones per object and one contained halftone field.',
  '<b>One small orange detail.</b> Everything else stays inside the neutral system palette.',
];

const image = ({ file, subject }: (typeof IMAGES)[number]): string => `<figure style="margin:0; min-width:0;">
  <img src="../assets/placeholders/${file}" width="1200" height="750" alt="" style="display:block; width:100%; height:auto; border:1px solid var(--border-subtle);" />
  <figcaption style="display:flex; justify-content:space-between; gap:8px; margin-top:6px;">
    <span class="spec-cap">${file}</span>
    <span class="spec-note" style="text-align:right;">${subject}</span>
  </figcaption>
</figure>`;

const meta: Meta = {
  title: 'Specimens/Illustrations/The set',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/illustrations-set.card.html',
      group: 'Illustrations',
      name: 'The set',
      subtitle: 'Eight mode-neutral editorial images — broad shapes, one halftone field, one accent',
      theme: 'both',
      viewport: '1400x700',
      bodyClass: 'spec-sunken',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  spec(
    [
      `<div style="display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px 12px;">\n${indent(IMAGES.map(image).join('\n'), 2)}\n</div>`,
      `<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:18px; border-top:1px solid var(--border-subtle); padding-top:14px;">\n${indent(RULES.map(specRule).join('\n'), 2)}\n</div>`,
    ],
    { gap: '18px' },
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
