/* A document from somewhere else, in a frame this page controls.

   The markup lives in `src/components/embed.ts`. No `parameters.dsCard`: what
   this decides is how a frame behaves at widths a card cannot have, and a
   picture at one fixed viewport shows two boxes and none of the point. Read
   the stories by dragging the frame narrower.

   Every `src` is a document this repository serves: a story reaching a video
   host would fetch it in every run, on a machine that may have no network. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/embed.ts';
import { type EmbedProps } from '../../src/components/embed.ts';

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

/* Storybook serves the screens at the path their own links climb from, which
   is why this is `/screens/…` and not the directory they are kept in. */
const SCREEN = {
  src: '/screens/landing.html',
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
    map or anything else with no size of its own wants: the player is as wide
    as there is room for, and never wider than that. */
export const Default: Story = { args: SCREEN };

/** The size it was made for, and no other: a card declares the viewport it was
    measured at, and this is that number. Narrower, the frame scrolls rather
    than reflowing — a specimen at a width nothing checked documents a layout
    that may not exist. */
export const Fixed: Story = {
  args: {
    src: '/guidelines/colors-surfaces.card.html',
    label: 'The surface planes, in both modes',
    /* Cleared, and not merely left out: Storybook merges a story's arguments
       over the ones the file declares, so an unset key here is the shape the
       story above asked for. A size beside a ratio is a caller with two
       answers to one question, and the ratio is the one that wins. */
    ratio: '',
    width: 700,
    height: 260,
    caption: 'Surfaces · 700x260',
  },
};

/** Without a caption. Allowed, and the frame still has a name: `label`
    becomes the frame's accessible name, which is all a screen reader has to
    say what it is about to enter. */
export const Uncaptioned: Story = {
  args: { src: SCREEN.src, label: SCREEN.label, ratio: SCREEN.ratio, caption: '' },
};

/** The frame a renderer wrote, kept. A generator shipping HTML writes the
    `<iframe>` so the reader has the document before any script runs, and the
    element lifts that node rather than writing a second one — fetched once, and
    the caption placed where the component puts captions. */
export const Given: Story = {
  render: () => html`<sds-embed width="700" height="240"
    ><iframe src="/guidelines/colors-borders.card.html" width="700" height="240" title="The border tokens"></iframe
    ><div class="sds-embed__caption">Borders · <span class="sds-mono">700x240</span></div></sds-embed
  >`,
};

/** Two frames in a column, which is what a page of them looks like. The gap
    between them is the document's and not the embed's — see `document.css`. */
export const InAColumn: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`<div class="sds-prose" style="padding:var(--space-6); max-width:900px">
    ${sdsEmbed({ ...SCREEN, caption: 'The landing screen, at the shape it was drawn for.' })}
    ${sdsEmbed({
      src: '/guidelines/type-scale.card.html',
      label: 'The type scale',
      width: 700,
      height: 230,
      caption: 'Type scale · 700x230',
    })}
  </div>`,
};
