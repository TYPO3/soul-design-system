/* One 16:9 frame of a deck.

   The markup lives in `src/components/slide.ts`. No `parameters.dsCard`: a
   slide is a whole surface, and the stories under `Slides/` are its layouts.
   This is the element alone, one story for each kind and each layout of a
   figure, so the frame stands without a deck around it. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/slide.ts';
import '../../packages/frontend/src/components/surface.ts';
import { type SlideProps } from '../../packages/frontend/src/components/slide.ts';
import '../../packages/frontend/src/components/facts.ts';
import { OUTLINE, place, slide } from '../lib/deck.ts';

/* The element alone, written as the layouts write it: the settings as
   attributes, what it says and shows in its regions. */
export const sdsSlide = ({ body, ...props }: SlideProps) => slide(props, body as TemplateResult | undefined);

const meta: Meta<SlideProps> = {
  title: 'Components/Content/Slide',
  tags: ['autodocs', '!dev'],
  /* The stage is the window's height, as it is under `Slides/`. A padded
     canvas adds its padding to that, and the stage scrolls. */
  parameters: { layout: 'fullscreen' },
  render: (args) => sdsSlide(args),
  argTypes: {
    kind: { control: 'select', options: ['cover', 'speaker', 'section', 'statement', 'content', 'closing', 'figure'] },
    src: { control: 'text' },
    portrait: { control: 'text' },
    layout: { control: 'select', options: ['wide', 'full', 'row', 'text-start'] },
    bleed: { control: 'boolean' },
    plain: { control: 'boolean' },
    framed: { control: 'boolean' },
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
    eyebrow: place(1),
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
    body: html`<sds-surface><span slot="label">Story</span><span slot="heading">Every element has one</span>The source of every specimen card. Edit the story, never the card.</sds-surface>`,
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
    eyebrow: place(3),
    heading: 'Start from a layout',
    lead: 'Open the one nearest the job and keep its shell.',
    number: '',
  },
};

/** One who speaks. The name stands at the display step and the role as the
    lead. The portrait stands in its region, to every edge of its column. */
export const Speaker: Story = {
  args: {
    kind: 'speaker',
    eyebrow: place(0),
    heading: 'Benjamin Kott',
    lead: 'Maintainer · Soul Design System',
    portrait: 'assets/portraits/benjamin-kott.png',
    alt: 'Benjamin Kott, drawn: cap, beard, hands in the pockets',
    body: html`<p>Answers for the tokens, the elements and the gate that holds them together.</p>`,
    number: '02',
  },
};

/** A picture, `wide`: under the head, inside the margin, from its top left
    corner. Its author draws it for the room, with no head of its own. The
    note under the title is optional. */
export const Figure: Story = {
  args: {
    kind: 'figure',
    eyebrow: place(2),
    heading: 'One key for two languages',
    note: 'The German call fills the slot, and the English call answers from it, in German.',
    src: 'assets/diagrams/slide-lookup.svg',
    alt: 'A German call writes the slot of a key. An English call for the same key reads it and answers in German.',
    number: '07',
  },
};

/** `full`: the picture takes nearly the whole frame. Only the count shows,
    on a plate, and the head stays for a reader who hears the slide. */
export const FigureFull: Story = {
  name: 'Figure, full',
  args: {
    kind: 'figure',
    layout: 'full',
    eyebrow: place(1),
    heading: 'The system at a glance',
    src: 'assets/diagrams/system-overview.svg',
    alt: 'The client, the app subprocess and the local sources sit inside the machine; one read-only path crosses to official services outside.',
    number: '05',
  },
};

/** `row` with `framed`: pictures side by side, each on its plane under its
    word, with its caption. */
export const FigureRow: Story = {
  name: 'Figure, row',
  args: {
    kind: 'figure',
    layout: 'row',
    framed: true,
    eyebrow: place(2),
    heading: 'One key for two languages',
    drawings: [
      { src: 'assets/diagrams/slide-cache-write.svg', alt: 'The German call writes the slot of its key.', label: 'A call writes', caption: 'The first call fills the slot in the language it names.' },
      { src: 'assets/diagrams/slide-cache-slots.svg', alt: 'Three slots of the array, one for each key.', label: 'The key holds no language', caption: 'One slot for each key, whatever language the next call names.' },
      { src: 'assets/diagrams/slide-cache-read.svg', alt: 'The English call reads the same slot and answers in German.', label: 'The next call reads it', caption: 'The English call answers in German. The key must name both.' },
    ],
    number: '10',
  },
};

/** `text-start`: a column of text at the start, the picture beside it. */
export const FigureTextStart: Story = {
  name: 'Figure, text start',
  args: {
    kind: 'figure',
    layout: 'text-start',
    eyebrow: place(2),
    heading: 'Five sources',
    src: 'assets/diagrams/slide-sources.svg',
    alt: 'Five sources against what the machine has to run. Bundled knowledge and the checkout need nothing. Packages need files on disk, the installation a booted site, the network outbound reach.',
    body: html`<p>Each source needs a part of the machine before it answers.</p><ul class="sds-list"><li>Bundled knowledge needs nothing.</li><li>Packages need files on disk.</li><li>The installation needs a booted site.</li></ul>`,
    number: '06',
  },
};

/** `bleed`: beside its text, a screenshot fills its column to the edges of
    the frame, as a portrait does. The count keeps its place over it, on a
    plate. */
export const FigureBleed: Story = {
  name: 'Figure, bleed',
  args: {
    kind: 'figure',
    layout: 'text-start',
    bleed: true,
    eyebrow: place(2),
    heading: 'The status page',
    src: 'assets/screenshots/status-sources.png',
    alt: 'The status page at the table of six sources.',
    body: html`<sds-facts><dt>Row</dt><dd>one source</dd><dt>Badge</dt><dd>what it does now</dd><dt>Checked</dt><dd>when it last answered</dd></sds-facts>`,
    number: '08',
  },
};

/** `plain`: the foot without the lockup. The count stays where it stands on
    every other slide. */
export const Plain: Story = {
  args: {
    plain: true,
    body: html`<p>A slide whose corner a picture needs, or a run that needs no mark.</p>`,
    number: '12',
  },
};
