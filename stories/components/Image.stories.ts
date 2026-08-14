/* A picture that takes the colours of the page it lands in.

   The markup lives in `src/components/image.ts` and the mechanism in
   `src/lib/art.ts`. No `parameters.dsCard`: a card is opened from disk, where
   the reference this element exists to write is refused before it is fetched,
   so a card of it would be a picture of the one thing it does not do.

   Read every story by switching the mode. That is the whole claim: one file,
   no light copy and no dark copy. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/image.ts';
import { type ImageProps } from '../../packages/frontend/src/components/image.ts';

/* Storybook serves `assets/` at `/assets`; a page under `screens/` reaches the
   same files at `../assets`. The path is the caller's, which is why this
   element takes one rather than deriving it. */
const MARK = {
  src: '/assets/design-system-signet-l.svg',
  alt: 'The Soul Design System signet',
  width: 64,
  height: 64,
};

const meta: Meta<ImageProps> = {
  title: 'Components/Image',
  tags: ['autodocs', '!dev'],
  render: ({ src, alt, width, height, zoomable = false }) =>
    html`<sds-image src="${src}" alt="${alt}" width="${width ?? 0}" height="${height ?? 0}" ?zoomable="${zoomable}"></sds-image>`,
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    width: { control: 'number' },
    height: { control: 'number' },
    zoomable: { control: 'boolean' },
  },
  args: MARK,
};

export default meta;
type Story = StoryObj<ImageProps>;

/** A mark, referenced. The ink is `--text-primary` and the corner is
    `--accent`, both read out of the page — switch the mode and the drawing
    follows without changing file. */
export const Default: Story = { args: MARK };

/** A raster file in the same element. There is nothing in a photograph for a
    mode to change, so it is linked rather than referenced, and the caller says
    nothing about which: the file name is the whole distinction. */
export const Photograph: Story = {
  args: {
    src: '/assets/placeholders/tool-search.png',
    alt: 'A cut-paper magnifier lying across three overlapping paper squares, one of them a field of halftone dots, with a single orange ring at the end of the handle.',
    width: 240,
    height: 240,
  },
};

/** A drawing wider than the column it landed in, and a way back out of it: the
    press opens the viewer, and where nothing upgraded the trigger is still a
    link to the file. This is what `sds-figure zoomable` does for a picture that
    makes its claim in a sentence — a picture without one asks for it here. */
export const Zoomable: Story = {
  args: {
    src: '/assets/diagrams/answer-sources.svg',
    alt: 'The five sources plotted against how much of the machine has to be running.',
    width: 0,
    height: 0,
    zoomable: true,
  },
};

/** The size is a box, not a shape. The mark is drawn 5:4 and the box is
    square, so it is centred inside it at its own proportions — a drawing given
    a box it does not fit is never stretched to fill one. */
export const InABox: Story = {
  render: () => html`<div style="display:flex; align-items:flex-end; gap:var(--space-6)">
    ${[16, 20, 24, 32, 64].map(
      (size) => html`<div style="display:flex; flex-direction:column; align-items:center; gap:var(--space-2)">
        <sds-image
          class="sds-signet"
          src="${size < 20 ? '/assets/design-system-signet-s.svg' : size < 32 ? '/assets/design-system-signet-m.svg' : '/assets/design-system-signet-l.svg'}"
          alt=""
          width="${size}"
          height="${size}"
        ></sds-image>
        <span class="sds-label">${size}</span>
      </div>`,
    )}
  </div>`,
};

/** In a lockup, which is where a mark nearly always is. The class the caller
    writes is the class the picture is drawn with — nothing here knows what a
    signet is, and `.sds-signet` is the same name the fallback markup uses. */
export const InALockup: Story = {
  render: () => html`<a class="sds-lockup" href="#">
    <sds-image class="sds-signet" src="/assets/design-system-signet-m.svg" alt="" width="24" height="24"></sds-image>
    <span class="sds-wordmark"><span class="sds-wordmark__brand">TYPO3</span><span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">Soul Design System</span></span>
  </a>`,
};

/** Three products, one construction. The files are worked examples of the
    signet rules rather than approved marks, and each is referenced the same
    way a project's own would be — which is the point: nothing about the mark
    is in this system's code. */
export const AFamily: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`<div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-6); padding:var(--space-6)">
    ${['light', 'dark'].map(
      (mode) => html`<div data-theme="${mode}" style="background:var(--surface-canvas); padding:var(--space-5); display:flex; gap:var(--space-6); align-items:center">
        ${['design-system', 'dev-companion', 'tryout'].map(
          (product) => html`<sds-image src="/assets/${product}-signet-l.svg" alt="The ${product} signet" width="48" height="48"></sds-image>`,
        )}
      </div>`,
    )}
  </div>`,
};
