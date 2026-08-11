/* The viewer a drawing opens into.

   `sds-figure` is the way in — `zoomable` gives it a trigger and it opens this.
   That is why the element had no story of its own for a long time, and why it
   needs one anyway: the figure documents the frame around a drawing, and this
   documents the surface the drawing gets when the frame is out of the way.

   No `parameters.dsCard`: a viewer that has to be opened cannot be a static
   specimen — a card is a still picture and has nothing to press. What a card
   would show is the modal surface, and `sds-modal` has one.

   The pair is the point of `Default`, and it can only be judged by switching
   modes while the viewer is open: the file is swapped by the same rule the
   figure uses, so the drawing never opens in the mode the reader left. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/lightbox.ts';
import '../../src/components/button.ts';
import { type LightboxProps } from '../../src/components/lightbox.ts';

/* Storybook serves `assets/` at `/assets`; a page under `screens/` reaches the
   same files at `../assets`. The path is the caller's, which is why this
   element takes one rather than deriving it. */
const SOURCES = {
  src: '/assets/diagrams/answer-sources.svg',
  dark: '/assets/diagrams/answer-sources-dark.svg',
  alt: 'The five sources a tool can answer from, plotted against how much of the machine has to be running.',
  caption: 'Every source declares a precondition, so an answer is known to be reachable before the question is asked.',
};

const meta: Meta<LightboxProps> = {
  title: 'Components/Lightbox',
  tags: ['autodocs', '!dev'],
  argTypes: {
    src: { control: 'text' },
    dark: { control: 'text' },
    alt: { control: 'text' },
    caption: { control: 'text' },
  },
  args: SOURCES,
  render: ({ src, dark, alt, caption }) => html`
    <sds-button variant="primary" for="the-drawing">Open the drawing</sds-button>
    <sds-lightbox
      id="the-drawing"
      src="${src}"
      dark="${dark ?? ''}"
      alt="${alt}"
      caption="${caption ?? ''}"
    ></sds-lightbox>
  `,
};

export default meta;
type Story = StoryObj<LightboxProps>;

/** Press it: the page behind goes inert, the focus moves in, Escape closes it
    and hands the focus back — the platform's `<dialog>`, the same one
    `sds-dialog` uses, and none of it written here.

    The drawing is shown at the size it was drawn rather than at
    `--measure-modal`. A modal stops at a measure because what is inside one is
    read; this is looked at, and a 1200px diagram held to a column of prose is
    a picture of a diagram. */
export const Default: Story = { args: SOURCES };

/** One file for both modes. Correct for a photograph and wrong for anything
    drawn in these tokens — and the viewer is where it is least forgiving,
    because a light drawing is alone on the dark ground with nothing around it
    to explain the seam. */
export const Single: Story = {
  args: { src: SOURCES.src, alt: SOURCES.alt, caption: SOURCES.caption },
};

/** No caption. The head then carries the alternative text, because a viewer
    with an empty bar above the drawing looks broken and the sentence that
    describes a drawing to a screen reader describes it to everyone else too. */
export const Uncaptioned: Story = {
  args: { src: SOURCES.src, dark: SOURCES.dark, alt: SOURCES.alt },
};

/* No story that is open on load. The element takes the focus and makes
   everything behind it inert, so a story that opens itself would leave the
   reader in a viewer they did not ask for — and it would show none of what the
   component does, which is what happens when the figure is pressed. */
