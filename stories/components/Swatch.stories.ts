/* One colour, stated as a fact.

   The markup lives in `src/components/swatch.ts`. No `parameters.dsCard`: what
   the colours *are* is drawn by `Guidelines → Colours`, which is the specimen
   layer's own scaffolding. This is the same job on a product surface, where a
   page documents a palette that is not this system's.

   The stories are the three things a swatch has to survive: a value that is
   one pixel wide, a value the same colour as the page, and a value nobody
   should be allowed to smuggle a declaration through. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/grid.ts';
import '../../packages/frontend/src/components/swatch.ts';
import { type SwatchProps } from '../../packages/frontend/src/components/swatch.ts';

export const sdsSwatch = ({ value, name, resolved, kind }: SwatchProps) =>
  html`<sds-swatch
    value="${value}"
    name="${name}"
    resolved="${resolved ?? ''}"
    kind="${kind ?? 'fill'}"
  ></sds-swatch>`;

/** The set the guide page shows, in the order it shows them. Exported so the
    page composes these rather than keeping a copy of its own. */
export const PALETTE: readonly SwatchProps[] = [
  { value: 'var(--accent)', name: '--accent', resolved: '#FF8700' },
  { value: 'var(--surface-canvas)', name: '--surface-canvas', resolved: 'light-dark(#FBFAF7, #131210)' },
  { value: 'var(--surface-raised)', name: '--surface-raised', resolved: 'light-dark(#FFFFFF, #171614)' },
  { value: 'var(--text-primary)', name: '--text-primary', resolved: 'light-dark(#1C1A17, #EDE9E2)' },
  { value: 'var(--text-muted)', name: '--text-muted', resolved: 'light-dark(#726C63, #878076)' },
  { value: 'var(--border-subtle)', name: '--border-subtle', resolved: 'light-dark(#E3DFD6, #2B2823)', kind: 'line' },
];

const meta: Meta<SwatchProps> = {
  title: 'Components/Swatch',
  tags: ['autodocs', '!dev'],
  excludeStories: ['PALETTE', 'sdsSwatch'],
  render: (args) => sdsSwatch(args),
  argTypes: {
    value: { control: 'text' },
    name: { control: 'text' },
    resolved: { control: 'text' },
    kind: { control: 'inline-radio', options: ['fill', 'line'] },
  },
  args: PALETTE[0] as SwatchProps,
};

export default meta;
type Story = StoryObj<SwatchProps>;

/** All three at once: the chip nobody can type, the name a design writes, and
    the value the mode resolved it to. A swatch missing any of them documents
    part of a colour. */
export const Default: Story = { args: PALETTE[0] as SwatchProps };

/** A hairline is a colour too, and it cannot be shown as a fill: at one pixel
    a value is invisible, and filled it is a different job being done by the
    same number. The chip becomes its own edge. */
export const Hairline: Story = { args: PALETTE[5] as SwatchProps };

/** A value the same colour as the page it is documented on. The chip keeps the
    system's own hairline for exactly this: without it the square would be
    missing rather than white. */
export const SameAsThePage: Story = {
  name: 'The colour of the page',
  args: { value: 'var(--surface-canvas)', name: '--surface-canvas', resolved: '#131210' },
};

/** A pair of values that hold both modes at once. The token is the pair, and
    writing it out is what makes the swatch document the system rather than the
    mode the reader happens to be in. */
export const BothModes: Story = {
  name: 'A token that is a pair',
  args: PALETTE[3] as SwatchProps,
};

/** Anything that is not a colour is dropped rather than painted. The value
    arrives from a document somebody else wrote, and a style attribute is not a
    place to find out what it turns out to be — the name and the value are
    still readable, which is what the reader came for. */
export const NotAColour: Story = {
  name: 'A value that is not a colour',
  args: { value: 'red; position:fixed; inset:0', name: '--not-a-colour', resolved: 'dropped' },
};

/** The set, which is how a palette is actually read: laid out by `sds-grid`
    like every other set read side by side. `wide` is the width a swatch holds
    once the value under the name is a `light-dark()` pair. */
export const Palette: Story = {
  render: () => html`<sds-grid variant="wide">${PALETTE.map(sdsSwatch)}</sds-grid>`,
};
