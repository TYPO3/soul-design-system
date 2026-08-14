/* A picture, at the size the caller gives it.

   The markup lives in `src/components/image.ts` and the mechanism in
   `src/lib/art.ts`. No `parameters.dsCard`: what a card would show is the
   picture, and the picture is documented where it is drawn — under
   `Guidelines`. */

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

/** A mark. One file at one size, drawn in the ink its own file declares — the
    hex behind each token, since an `<img>` renders in a document of its own
    where no token of this page is. */
export const Default: Story = { args: MARK };

/** A raster file in the same element, and nothing about the element changes:
    every picture is linked, and the file name is not a decision it makes. */
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
    signet rules rather than approved marks, and each is shown the same way a
    project's own would be — which is the point: nothing about the mark is in
    this system's code. */
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
