/* The viewer a drawing opens into.

   `sds-figure` and `sds-image` are the way in — `zoomable` gives either a
   trigger and it opens this. Those two document the frame around a drawing, or
   its absence. This documents the surface the drawing gets once the frame is
   out of the way.

   No `parameters.dsCard`: a viewer somebody has to open cannot be a static
   specimen. The mode is the point of `Default`, and only a switch while the
   viewer is open shows it. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/lightbox.ts';
import '../../packages/frontend/src/components/button.ts';
import { type LightboxProps } from '../../packages/frontend/src/components/lightbox.ts';

/* Written the way Storybook serves it, beside the preview page. A card or a
   screen gets the climb to the same files counted in on the way out. The
   path is the caller's, which is why this element takes one rather than
   derives it. */
const SOURCES = {
  src: 'assets/diagrams/answer-sources.svg',
  alt: 'The five sources a tool can answer from, plotted against how much of the machine has to be running.',
  caption: 'Every source declares a precondition, so the reach of an answer stands clear before the question.',
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
    back — the platform's `<dialog>`, none of it written here. The drawing
    shows at the size of its construction rather than at `--measure-modal`. A
    modal stops at a measure because a reader reads what is inside one, and
    looks at this. */
export const Default: Story = { args: SOURCES };

/** No caption. The head then carries the alternative text. A viewer with an
    empty bar above the drawing looks broken. The sentence that describes a
    drawing to a screen reader describes it to everyone else too. */
export const Uncaptioned: Story = {
  args: { src: SOURCES.src, alt: SOURCES.alt },
};

/* No story that is open on load. The element takes the focus and makes
   everything behind it inert. So a story that opens itself leaves the reader
   in a viewer they did not ask for. And it shows none of what the component
   does, which is what happens on a press on the figure. */
