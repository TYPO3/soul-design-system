/* A document from somewhere else, in a frame this page controls.

   The markup lives in `src/components/embed.ts`. No `parameters.dsCard`. What
   this decides is how a frame behaves at widths a card cannot have. A
   picture at one fixed viewport shows two boxes and none of the point. Read
   the stories with the frame dragged narrower.

   Every `src` is a document this repository serves. A story that reaches a
   video host fetches it in every run, on a machine that can have no network. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/embed.ts';
import { type EmbedProps } from '../../packages/frontend/src/components/embed.ts';

const sdsEmbed = ({ src, label, ratio, width, height, caption, allow, allowfullscreen }: EmbedProps) =>
  html`<sds-embed
    src="${src}"
    label="${label}"
    ratio="${ratio ?? ''}"
    width="${width ?? 0}"
    height="${height ?? 0}"
    caption="${caption ?? ''}"
    allow="${allow ?? ''}"
    ?allowfullscreen="${allowfullscreen ?? false}"
  ></sds-embed>`;

/* Storybook serves the screens at the depth of their storage, so their own
   links climb to the right place. And relative to the preview page, because
   the built Storybook sits below the documentation, where a root path names
   somebody else's root. */
const SCREEN = {
  src: 'specimens/screens/landing.html',
  label: 'The landing screen, rendered',
  ratio: '16 / 9',
  caption: 'A frame that holds its shape shows the same thing in a column of any width.',
};

const meta: Meta<EmbedProps> = {
  title: 'Components/Embed',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsEmbed(args),
  argTypes: {
    src: { control: 'text' },
    label: { control: 'text' },
    ratio: { control: 'text' },
    width: { control: 'number' },
    height: { control: 'number' },
    caption: { control: 'text' },
    allow: { control: 'text' },
    allowfullscreen: { control: 'boolean' },
  },
  args: SCREEN,
};

export default meta;
type Story = StoryObj<EmbedProps>;

/** Fills the column and holds `16 / 9` while it does. This is what a video, a
    map or anything else with no size of its own wants. The player is as wide
    as there is room for, and never wider than that. */
export const Default: Story = { args: SCREEN };

/** The size it exists for, and no other: a card declares the viewport of its
    measurement, and this is that number. Narrower, the frame scrolls rather
    than reflows — a specimen at a width nothing checked documents a layout
    that can not exist. */
export const Fixed: Story = {
  args: {
    src: 'specimens/guidelines/colors-surfaces.card.html',
    label: 'The surface planes, in both modes',
    /* Cleared, and not merely left out. Storybook merges a story's arguments
       over the ones the file declares, so an unset key here is the shape the
       story above asked for. A size beside a ratio is a caller with two
       answers to one question, and the ratio is the one that wins. */
    ratio: '',
    width: 700,
    height: 260,
    caption: 'Surfaces · 700x260',
  },
};

/** Without a caption. Permitted, and the frame still has a name. `label`
    becomes the frame's accessible name, which is all a screen reader has to
    say what it is about to enter. */
export const Uncaptioned: Story = {
  args: { src: SCREEN.src, label: SCREEN.label, ratio: SCREEN.ratio, caption: '' },
};

/** The frame a renderer wrote, kept. A generator that ships HTML writes the
    `<iframe>` so the reader has the document before any script runs. The
    element lifts that node rather than writes a second one — fetched once,
    and the caption where the component puts captions. */
export const Given: Story = {
  render: () => html`<sds-embed width="700" height="240"
    ><iframe src="specimens/guidelines/colors-borders.card.html" width="700" height="240" title="The border tokens"></iframe
    ><div class="sds-embed__caption">Borders · <span class="sds-mono">700x240</span></div></sds-embed
  >`,
};

/** Two frames in a column, which is what a page of them looks like. The gap
    between them is the flow contract's and not the embed's. */
export const InAColumn: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`<div class="sds-prose" style="padding:var(--space-6); max-width:900px">
    ${sdsEmbed({ ...SCREEN, caption: 'The landing screen, at the shape it was drawn for.' })}
    ${sdsEmbed({
      src: 'specimens/guidelines/type-scale.card.html',
      label: 'The type scale',
      width: 700,
      height: 230,
      caption: 'Type scale · 700x230',
    })}
  </div>`,
};
