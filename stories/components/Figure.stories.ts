/* A picture and the claim it makes.

   The markup lives in `src/components/figure.ts`. No `parameters.dsCard`: the
   diagram rules already have four cards under `Guidelines → Diagrams`, and
   they document the drawings. This documents the frame around one — which is
   a different thing and does not need a fifth picture of the same artwork.

   Two stories carry the point and both are read by switching modes.
   `BothModes` shows the drawing: one file, referenced into the page, arriving
   in the mode of whatever it was placed in. `Photograph` shows the other half
   of the frame — a raster file, linked, the same in both modes because there
   is nothing in it for a mode to change. The switch is in the toolbar. */

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

/** A raster image in the same frame. There is no viewBox to be had, so it is
    linked rather than referenced — and nothing is lost by that, because there
    is nothing in a photograph for a mode to change. Switch modes: the frame,
    the ground and the caption follow, and the picture stays the picture.

    Not `zoomable`. The trigger earns its place where the drawing is wider than
    the column holding it; an illustration shown whole is already shown. */
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

/** Pressable, opening the drawing at the size it was drawn — 1200px of
    diagram is a picture of a diagram once a column has scaled it. Escape
    closes it, and the focus comes back to the figure.

    The trigger is a link to the file, so a surface with no script still opens
    the drawing. The element takes the press over once it has upgraded. */
export const Zoomable: Story = { args: { ...SOURCES, zoomable: true } };

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
