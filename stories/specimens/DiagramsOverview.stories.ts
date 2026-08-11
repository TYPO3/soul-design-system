/* The system overview — the hardest case the drawing rules had to survive.

   An architecture map has no natural axis, so it is where the rules could
   have collapsed back into boxes and arrows. What carries the claim instead
   is containment: the boundary *is* the drawing, and one accented line
   crosses it. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';
import { figureCard } from '../lib/figure.ts';

const NOTES = [
  '<b>The hardest case.</b> An architecture map has no natural axis, so the rules could have collapsed back into boxes and arrows. What carries the meaning instead is <b>containment</b> — the boundary is the drawing, and everything inside it needs no explanation.',
  '<b>One accented element.</b> The single crossing line is the only orange in the drawing, and the only arrow that carries a label. Nodes outside the boundary are drawn with a dashed border, so “not on your machine” is a property of the shape, not of a legend.',
];

const meta: Meta = {
  title: 'Specimens/Diagrams/System overview',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/diagrams-overview.card.html',
      group: 'Diagrams',
      name: 'System overview — a map with no axis',
      subtitle: 'Containment carries the claim: one path crosses the boundary',
      theme: 'both',
      viewport: '1400x937',
      bodyClass: 'spec-sunken',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  figureCard(
    {
      file: 'system-overview.svg',
      alt: 'The client, the app subprocess and the local sources sit inside the machine; one read-only path crosses to official services outside.',
    },
    NOTES,
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
