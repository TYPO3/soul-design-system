/* The worked example: one existing chart redrawn to the rules.

   Five answer sources against the machine state each one needs. What the card
   documents is the difference between the old drawing and this one — the five
   hues, the drop shadow and the 28px radius are gone, and the claim survived
   all three. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';
import { figureCard } from '../lib/figure.ts';

const NOTES = [
  '<b>One file, both modes.</b> Every colour is an attribute written as <span class="spec-cap">var(--token, #light)</span>, so the drawing takes the mode of the page it is referenced into and still renders on its own — in a README or a tab — as the light file it falls back to. What it cannot be is an <span class="spec-cap">&lt;img&gt;</span>: that renders in a document of its own, where no token is declared.',
  '<b>What changed against the existing set:</b> the five hues are gone, the drop shadow is gone, the 28px outer radius is gone, and every identifier moved to mono. The claim, the five names and the closing line are unchanged.',
];

const meta: Meta = {
  title: 'Specimens/Diagrams/Worked example',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/diagrams-example.card.html',
      group: 'Diagrams',
      name: 'Worked example',
      subtitle: 'answer-sources.svg, redrawn to the rules — one file, in both modes',
      theme: 'both',
      viewport: '1400x983',
      bodyClass: 'spec-sunken',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  figureCard(
    { file: 'answer-sources.svg', alt: 'Five answer sources plotted against the machine state each one requires.' },
    NOTES,
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
