/* The worked example: one existing chart redrawn to the rules.

   Five answer sources against the machine state each one needs. What the card
   documents is the difference between the old drawing and this one — the five
   hues, the drop shadow and the 28px radius are gone, and the claim survived
   all three. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';
import { figurePair } from '../lib/figure.ts';

const NOTES = [
  '<b>Two files, not one.</b> A <span class="spec-cap">&lt;style&gt;</span> block inside an SVG is stripped by GitHub and ignored by most markdown pipelines, so a single self-switching file is not shippable. The pair is selected with <span class="spec-cap">&lt;picture&gt;</span>; every colour is an attribute, and the dark file is generated from the light one by a token swap.',
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
      subtitle: 'answer-sources.svg, redrawn to the rules — and shipped as a light/dark pair',
      theme: 'both',
      viewport: '1400x560',
      bodyClass: 'spec-sunken',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  figurePair(
    { file: 'answer-sources.svg', alt: 'Five answer sources plotted against the machine state each one requires.' },
    { file: 'answer-sources-dark.svg', alt: 'The same chart, dark.' },
    NOTES,
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
