/* One colour, stated as a fact.

   The markup lives in `src/components/swatch.ts`. No `parameters.dsCard`.
   `Guidelines → Colours` draws what the colours *are*, which is the specimen
   layer's own scaffolding. This is the same job on a product surface, where a
   page documents a palette that is not this system's.

   The stories are the three things a swatch has to survive. A value that is
   one pixel wide, a value the same colour as the page, and a value nobody
   must smuggle a declaration through. */

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

/** The set the guide page shows, in the order it shows them. An export, so
    the page composes these rather than keeps a copy of its own. */
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

/** A hairline is a colour too, and it cannot show as a fill. At one pixel a
    value is invisible, and as a fill it is a different job done by the same
    number. The chip becomes its own edge. */
export const Hairline: Story = { args: PALETTE[5] as SwatchProps };

/** A value the same colour as the page it stands on. The chip keeps the
    system's own hairline for exactly this: without it the square is absent
    rather than white. */
export const SameAsThePage: Story = {
  name: 'The colour of the page',
  args: { value: 'var(--surface-canvas)', name: '--surface-canvas', resolved: '#131210' },
};

/** A pair of values that hold both modes at once. The token is the pair. In
    full, it makes the swatch document the system rather than the mode the
    reader happens to be in. */
export const BothModes: Story = {
  name: 'A token that is a pair',
  args: PALETTE[3] as SwatchProps,
};

/** Anything that is not a colour drops rather than paints. The value arrives
    from a document somebody else wrote. A style attribute is not a place to
    find out what it turns out to be. The name and the value are still
    readable, which is what the reader came for. */
export const NotAColour: Story = {
  name: 'A value that is not a colour',
  args: { value: 'red; position:fixed; inset:0', name: '--not-a-colour', resolved: 'dropped' },
};

/** The set, which is how a reader reads a palette. `sds-grid` lays it out
    like every other set read side by side, and at the grid's ordinary minimum.
    What one swatch needs is its longest value with the chip beside it. `wide`
    reserves enough more than that to cost a track wherever the column is
    narrow, which is what it did beside a guideline page's contents. */
export const Palette: Story = {
  render: () => html`<sds-grid>${PALETTE.map(sdsSwatch)}</sds-grid>`,
};
