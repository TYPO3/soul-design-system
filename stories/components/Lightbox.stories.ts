/* The viewer a drawing opens into.

   `sds-figure` is the way in — `zoomable` gives it a trigger and it opens this.
   The figure documents the frame around a drawing; this documents the surface
   the drawing gets once the frame is out of the way.

   No `parameters.dsCard`: a viewer that has to be opened cannot be a static
   specimen. The mode is the point of `Default` and can only be judged by
   switching while the viewer is open. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/lightbox.ts';
import '../../packages/frontend/src/components/button.ts';
import { type LightboxProps } from '../../packages/frontend/src/components/lightbox.ts';

/* Storybook serves `assets/` at `/assets`; a page under `screens/` reaches the
   same files at `../assets`. The path is the caller's, which is why this
   element takes one rather than deriving it. */
const SOURCES = {
  src: '/assets/diagrams/answer-sources.svg',
  alt: 'The five sources a tool can answer from, plotted against how much of the machine has to be running.',
  caption: 'Every source declares a precondition, so an answer is known to be reachable before the question is asked.',
};

const meta: Meta<LightboxProps> = {
  title: 'Components/Lightbox',
  tags: ['autodocs', '!dev'],
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    caption: { control: 'text' },
  },
  args: SOURCES,
  render: ({ src, alt, caption }) => html`
    <sds-button variant="primary" for="the-drawing">Open the drawing</sds-button>
    <sds-lightbox
      id="the-drawing"
      src="${src}"
      alt="${alt}"
      caption="${caption ?? ''}"
    ></sds-lightbox>
  `,
};

export default meta;
type Story = StoryObj<LightboxProps>;

/** Press it: the page behind goes inert, the focus moves in, Escape hands it
    back — the platform's `<dialog>`, none of it written here. The drawing is
    shown at the size it was drawn rather than at `--measure-modal`: a modal
    stops at a measure because what is inside one is read, and this is looked
    at. */
export const Default: Story = { args: SOURCES };

/** No caption. The head then carries the alternative text, because a viewer
    with an empty bar above the drawing looks broken and the sentence that
    describes a drawing to a screen reader describes it to everyone else too. */
export const Uncaptioned: Story = {
  args: { src: SOURCES.src, alt: SOURCES.alt },
};

/* No story that is open on load. The element takes the focus and makes
   everything behind it inert, so a story that opens itself would leave the
   reader in a viewer they did not ask for — and it would show none of what the
   component does, which is what happens when the figure is pressed. */
