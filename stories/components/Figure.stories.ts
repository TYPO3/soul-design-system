/* A picture and the claim it makes.

   The markup lives in `src/components/figure.ts`. No `parameters.dsCard`: the
   diagram cards under `Guidelines → Diagrams` document the drawings, and this
   documents the frame around one.

   Two stories carry the point, both read by switching modes: the drawing is one
   file referenced into the page and arrives in the mode it was placed in, and
   the photograph is linked and the same in both. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/figure.ts';
import { type FigureProps } from '../../src/components/figure.ts';

const sdsFigure = ({ src, alt, caption, zoomable = false }: FigureProps) =>
  html`<sds-figure src="${src}" alt="${alt}" .caption="${caption ?? ''}" ?zoomable="${zoomable}"></sds-figure>`;

/* Storybook serves `assets/` at `/assets`; a page under `screens/` reaches the
   same files at `../assets`. The path is the caller's, which is why this
   element takes one rather than deriving it. */
const SOURCES = {
  src: '/assets/diagrams/answer-sources.svg',
  alt: 'The five sources a tool can answer from, plotted against how much of the machine has to be running.',
  caption: 'Every source declares a precondition, so an answer is known to be reachable before the question is asked.',
};

const meta: Meta<FigureProps> = {
  title: 'Components/Figure',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsFigure(args),
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    caption: { control: 'text' },
    zoomable: { control: 'boolean' },
  },
  args: SOURCES,
};

export default meta;
type Story = StoryObj<FigureProps>;

/** One file, in both modes. Switch the mode in the toolbar: the drawing does
    not change file, it changes colour — it is referenced into this page and
    reads the same tokens the page does. */
export const Default: Story = { args: SOURCES };

/** A raster image in the same frame: no viewBox to be had, so it is linked
    rather than referenced, and nothing is lost — there is nothing in a
    photograph for a mode to change. Not `zoomable`: the trigger earns its place
    where a drawing is wider than its column, and this is shown whole. */
export const Photograph: Story = {
  args: {
    src: '/assets/placeholders/tool-search.png',
    alt: 'A cut-paper magnifier lying across three overlapping paper squares, one of them a field of halftone dots, with a single orange ring at the end of the handle.',
    caption: 'One prompt makes the whole set, so a new subject joins the others instead of starting a second style.',
  },
};

/** Without a caption. Allowed, and almost never right: a picture whose point
    has to be inferred means something different to every reader. */
export const Uncaptioned: Story = {
  args: { src: SOURCES.src, alt: SOURCES.alt },
};

/** Pressable, opening the drawing at the size it was drawn — a wide diagram is
    a picture of a diagram once a column has scaled it. Escape closes it and the
    focus comes back. The trigger is a link to the file, so a surface with no
    script still opens it, and the element takes the press over on upgrade. */
export const Zoomable: Story = { args: { ...SOURCES, zoomable: true } };

/** The picture a renderer wrote, kept. A renderer writes HTML and knows only
    the path an author pointed at, so it writes the `<img>` and the caption
    itself — the reader has the picture before any script runs. The element
    lifts both into its frame rather than requesting the file again. */
export const Given: Story = {
  render: () => html`<sds-figure
    ><img class="sds-art" src="/assets/placeholders/tool-search.png" alt="A cut-paper magnifier lying across three overlapping paper squares."
    ><figcaption class="sds-figure__caption"><p>The caption a document wrote, with its markup — a <code>literal</code> in it — intact.</p></figcaption></sds-figure
  >`,
};

/** The same file twice, each with a mode forced on it — the arrangement a
    guideline card is made of, and the case a `<picture>` gets wrong: it
    follows the system preference and cannot see a mode set on a subtree. */
export const BothModes: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`<div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-6); padding:var(--space-6)">
    <div data-theme="light" style="background:var(--surface-canvas); padding:var(--space-5)">${sdsFigure({ ...SOURCES, caption: 'Forced light' })}</div>
    <div data-theme="dark" style="background:var(--surface-canvas); padding:var(--space-5)">${sdsFigure({ ...SOURCES, caption: 'Forced dark' })}</div>
  </div>`,
};
