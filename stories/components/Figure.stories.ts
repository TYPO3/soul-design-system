/* A drawing and the claim it makes.

   The markup lives in `src/components/figure.ts`. No `parameters.dsCard`: the
   diagram rules already have four cards under `Guidelines → Diagrams`, and
   they document the drawings. This documents the frame around one — which is
   a different thing and does not need a fifth picture of the same artwork.

   The story that matters is `Pair`, and it can only be judged by switching
   modes: two files are in the markup, and the stylesheet shows the one the
   nearest forced mode asks for. The mode switch is in the toolbar. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/figure.ts';
import { type FigureProps } from '../../src/components/figure.ts';

const sdsFigure = ({ src, dark, alt, caption }: FigureProps) =>
  html`<sds-figure src="${src}" dark="${dark ?? ''}" alt="${alt}" .caption="${caption ?? ''}"></sds-figure>`;

/* Storybook serves `assets/` at `/assets`; a page under `screens/` reaches the
   same files at `../assets`. The path is the caller's, which is why this
   element takes one rather than deriving it. */
const SOURCES = {
  src: '/assets/diagrams/answer-sources.svg',
  dark: '/assets/diagrams/answer-sources-dark.svg',
  alt: 'The five sources a tool can answer from, plotted against how much of the machine has to be running.',
  caption: 'Every source declares a precondition, so an answer is known to be reachable before the question is asked.',
};

const meta: Meta<FigureProps> = {
  title: 'Components/Figure',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsFigure(args),
  argTypes: {
    src: { control: 'text' },
    dark: { control: 'text' },
    alt: { control: 'text' },
    caption: { control: 'text' },
  },
  args: SOURCES,
};

export default meta;
type Story = StoryObj<FigureProps>;

/** The pair. Switch the mode in the toolbar: the file changes, and it changes
    for a subtree with a mode forced on it too — which is why the swap is a
    custom property rather than a pair of descendant selectors. */
export const Pair: Story = { args: SOURCES };

/** One file for both modes. Correct for a photograph, wrong for anything drawn
    in these tokens — a light drawing on the dark canvas is the one thing the
    frame cannot rescue. */
export const Single: Story = {
  args: { src: SOURCES.src, alt: SOURCES.alt, caption: 'One file in both modes: the drawing keeps its own ground while the page changes.' },
};

/** Without a caption. Allowed, and almost never right: a drawing whose point
    has to be inferred means something different to every reader. */
export const Uncaptioned: Story = {
  args: { src: SOURCES.src, dark: SOURCES.dark, alt: SOURCES.alt },
};

/** Both files at once, each with a mode forced on it — the arrangement a
    guideline card is made of, and the case a stylesheet keyed on descendants
    gets wrong. */
export const BothModes: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`<div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-6); padding:var(--space-6)">
    <div data-theme="light" style="background:var(--surface-canvas); padding:var(--space-5)">${sdsFigure({ ...SOURCES, caption: 'Forced light' })}</div>
    <div data-theme="dark" style="background:var(--surface-canvas); padding:var(--space-5)">${sdsFigure({ ...SOURCES, caption: 'Forced dark' })}</div>
  </div>`,
};
