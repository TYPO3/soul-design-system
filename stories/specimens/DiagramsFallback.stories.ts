/* The fallback chain, drawn as a sequence rather than a flowchart.

   The claim is that the fallback covers less, so the drawing gives coverage a
   length: one square per entry the registry could return, and the gap in the
   third row is the shortfall at its real size. A decision diamond would have
   said the same thing in words. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';
import { figureCard } from '../lib/figure.ts';

const NOTES = [
  '<b>What the rules had to survive here:</b> a fallback chain is naturally a flowchart — decision diamond, two branches, four arrows. Redrawn, the sequence is the reading order and the registry itself is drawn: <b>one square per entry it could return</b>. The gap in the third row is the shortfall, at its real size.',
  '<b>Where status colour replaces the accent.</b> This drawing is about a degraded answer, so the gap carries <span class="spec-cap">--status-warn</span> and orange stays out of the chart entirely. A diagram gets one emphasis, never two.',
];

const meta: Meta = {
  title: 'Specimens/Diagrams/Fallback',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/diagrams-fallback.card.html',
      group: 'Diagrams',
      name: 'Fallback — a sequence without a flowchart',
      subtitle: 'Length is coverage, so the shortfall is visible before it is read',
      theme: 'both',
      viewport: '1400x1027',
      bodyClass: 'spec-sunken',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  figureCard(
    {
      file: 'installation-fallback.svg',
      alt: 'Three paths to an installation-bound answer; the fallback covers less of the registry and the gap is drawn.',
    },
    NOTES,
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
