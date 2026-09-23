/* One 16:9 frame of a deck.

   The markup lives in `src/components/slide.ts`. No `parameters.dsCard`: a
   slide is a whole surface, and the ten under `Slides/` are its layouts. This
   is the element alone, one story per kind, so the frame stands without a
   deck around it. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/slide.ts';
import '../../packages/frontend/src/components/surface.ts';
import { type SlideProps } from '../../packages/frontend/src/components/slide.ts';
import { DECK, OUTLINE } from '../lib/deck.ts';

export const sdsSlide = ({ kind, ground, eyebrow, heading, lead, note, number, sections, current, body }: SlideProps) =>
  html`<sds-slide
    kind="${kind ?? 'content'}"
    ground="${ground ?? 'paper'}"
    eyebrow="${eyebrow ?? ''}"
    heading="${heading ?? ''}"
    lead="${lead ?? ''}"
    note="${note ?? ''}"
    number="${number ?? ''}"
    signet="${kind === 'cover' || kind === 'closing' ? DECK.signetLarge : DECK.signet}"
    brand="${DECK.brand}"
    product="${DECK.product}"
    sections="${JSON.stringify(sections ?? [])}"
    current="${current ?? 0}"
    fit
  >${body ?? ''}</sds-slide>`;

const meta: Meta<SlideProps> = {
  title: 'Components/Content/Slide',
  tags: ['autodocs', '!dev'],
  /* The stage is the window's height, as it is under `Slides/`. A padded
     canvas adds its padding to that, and the stage scrolls. */
  parameters: { layout: 'fullscreen' },
  render: (args) => sdsSlide(args),
  argTypes: {
    kind: { control: 'select', options: ['cover', 'section', 'statement', 'content', 'closing'] },
    ground: { control: 'select', options: ['paper', 'terminal'] },
    eyebrow: { control: 'text' },
    heading: { control: 'text' },
    lead: { control: 'text' },
    note: { control: 'text' },
    number: { control: 'text' },
    current: { control: 'number' },
  },
  args: {
    kind: 'content',
    heading: 'Three places for every component',
    number: '03',
  },
};

export default meta;
type Story = StoryObj<SlideProps>;

/** A content slide: the title at the h2 step and at the top margin, the body
    between it and the foot, and the foot pinned. What stands between the
    tags is the system's elements at the page's size, which the frame draws
    at twice that. */
export const Default: Story = {
  args: {
    body: html`<sds-surface
      label="Story"
      heading="Every element has one"
      body="The source of every specimen card. Edit the story, never the card."
    ></sds-surface>`,
  },
};

/** The first slide, on the other ground of the deck. The lockup stands at
    the foot alone, one step up from the page's. */
export const Cover: Story = {
  args: {
    kind: 'cover',
    ground: 'terminal',
    eyebrow: 'Design system · 2026',
    heading: 'One system, every surface',
    lead: 'Custom elements, tokens and the class layer they emit.',
    number: '',
  },
};

/** A divider carries the deck's outline and marks its own entry, the way a
    bar marks the active item. */
export const Section: Story = {
  args: {
    kind: 'section',
    eyebrow: 'Section 02 of 04',
    heading: 'What it consists of',
    number: '02',
    sections: OUTLINE,
    current: 1,
  },
};

/** One sentence, centred, and where it is from under it. */
export const Statement: Story = {
  args: {
    kind: 'statement',
    heading: 'A shadow says a surface has left the page, and nothing else says it.',
    note: 'Non-negotiable · docs/design-system/index.rst',
    number: '',
  },
};

/** The last slide, on paper like the deck, with the cover's lockup. */
export const Closing: Story = {
  args: {
    kind: 'closing',
    heading: 'Start from a layout',
    lead: 'Open the one nearest the job and keep its shell.',
    number: '',
  },
};
