/* The two containers, in isolation, with nothing mixed in.

   This is what the rest is calibrated against. A demo page can be wrong in its
   markup and in the system at once and there is no telling which by looking —
   so the smallest case that shows a rhythm is the one that decides, and it
   holds nothing but the containers and the blocks in them. The numbers are in
   the caption, where the specimen chrome belongs.

   A column ranks what stands in it: every block carries its own step, and the
   one before a heading carries more. A stack does not rank anything — one
   distance, whatever it holds. That is the whole difference between them. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard, spec, specRow } from '../lib/specimen.ts';

const blocks = (): string =>
  `<p>A paragraph.</p>
    <p>And another.</p>
    <h3 class="sds-h3">A heading</h3>
    <p>Its text.</p>`;

const meta: Meta = {
  title: 'Specimens/Spacing/Containers',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/spacing-containers.card.html',
      group: 'Spacing',
      name: 'Containers',
      subtitle: 'A column ranks what is in it, a stack does not',
      viewport: '700x439',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  spec([
    specRow(
      [`<div class="sds-column">
    ${blocks()}
  </div>`],
      'column — 16 between blocks, 32 before a heading, 8 under one',
      { style: 'flex-direction: column; align-items: stretch;' },
    ),
    specRow(
      [`<div class="sds-stack">
    ${blocks()}
  </div>`],
      'stack — 16 throughout, whatever stands in it',
      { divided: true, style: 'flex-direction: column; align-items: stretch;' },
    ),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
