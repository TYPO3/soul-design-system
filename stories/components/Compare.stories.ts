/* Two pictures side by side, each with its claim.

   The markup lives in `src/components/compare.ts`. A concept shows what
   stands and what it proposes, and a reader reads the two against each
   other. Each half is `sds-figure`, under a word that says which is which.
   The words are the caller's. The card comes from `Specimen` below. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/compare.ts';
import { type CompareProps } from '../../packages/frontend/src/components/compare.ts';
import { dsCard, part, spec, specCap } from '../lib/specimen.ts';

export const sdsCompare = ({ before, after, beforeLabel, afterLabel, zoomable }: CompareProps) =>
  html`<sds-compare
    before-src="${before.src}"
    before-alt="${before.alt}"
    before-caption="${before.caption ?? ''}"
    after-src="${after.src}"
    after-alt="${after.alt}"
    after-caption="${after.caption ?? ''}"
    before-label="${beforeLabel ?? ''}"
    after-label="${afterLabel ?? ''}"
    ?zoomable="${zoomable ?? false}"
  ></sds-compare>`;

/* Written the way Storybook serves them, beside the preview page. A card or
   a screen gets the climb to the same files counted in on the way out. */

/** The two status pages of this system, as a concept reads them against
    each other. Exported so the concept page composes these. */
export const PAGES: CompareProps = {
  before: {
    src: 'assets/screenshots/status-sources.png',
    alt: 'The status page of dev-companion at the table of six sources. Each row names a source, its state as a badge, when it was last checked, and an Open button.',
    caption: 'The row says what the source does now, and nothing about the check before this one.',
  },
  after: {
    src: 'assets/screenshots/source-reads.png',
    alt: 'The page of the source docs.typo3.org at its lower half. An overview, then two folded rows under Earlier reads, then a note: this is a source, not a service.',
    caption: 'The page keeps the last read that ended and the one that stopped, and nothing before them.',
  },
  beforeLabel: 'The status page',
  afterLabel: 'The page of a source',
  zoomable: true,
};

const meta: Meta<CompareProps> = {
  title: 'Components/Compare',
  tags: ['autodocs', '!dev'],
  excludeStories: ['PAGES', 'sdsCompare', 'specimenHtml'],
  render: (args) => sdsCompare(args),
  argTypes: {
    beforeLabel: { control: 'text' },
    afterLabel: { control: 'text' },
    zoomable: { control: 'boolean' },
  },
  args: PAGES,
  parameters: {
    dsCard: dsCard({
      path: 'components/content/compare.card.html',
      name: 'Two pictures, read against each other',
      subtitle: 'Each a figure with its claim, under the word that says which is which',
      viewport: '900x420',
    }),
  },
};

export default meta;
type Story = StoryObj<CompareProps>;

/** Two pages side by side, each with its claim, under the words a paper
    gives them. `Before` and `After` are the words where nobody names them. */
export const Default: Story = {};

/** Without a press: two photographs that show whole in their halves. */
export const Still: Story = {
  args: { zoomable: false },
};

export const specimenHtml = (): string =>
  spec([
    part(sdsCompare(PAGES)),
    specCap('TWO PICTURES IN ONE ROW · EACH A FIGURE WITH ITS CLAIM · THE WORDS ARE THE CALLER’S'),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
