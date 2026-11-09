/* Bands in a row: what one band does where it meets the next.

   A band has no element. It is a part of the page frame, `sds-band` in
   `layout.css`, and a template writes it as a section. So the stories write
   the classes. Each story is a run of bands. What a band decides shows only
   where two of them meet: the ground, the line, or neither. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

interface BandProps {
  quiet?: boolean;
  rule?: boolean;
}

interface Part extends BandProps {
  heading: string;
  body: string;
}

const band = ({ heading, body, quiet, rule }: Part) =>
  html`<section class="sds-band${quiet ? ' sds-band--quiet' : ''}${rule ? ' sds-band--ruled' : ''}">
    <h2>${heading}</h2>
    <p>${body}</p>
  </section>`;

const run = (parts: readonly Part[]) => html`<div class="sds-bands">${parts.map(band)}</div>`;

const plain = (heading: string, body = 'The canvas, the ground every page opens on.'): Part => ({ heading, body });
const quiet = (heading: string, body = 'The second ground, with a hairline at each edge.'): Part => ({ heading, body, quiet: true });
const ruled = (heading: string, body = 'The canvas again, with a line above it.'): Part => ({ heading, body, rule: true });

/* The line above each band of the run, as the page draws it: true where one
   stands. A story says which bands must draw one, and the play holds it. */
const lines = (canvas: HTMLElement): boolean[] =>
  [...canvas.querySelectorAll('.sds-band')].map((section) => parseFloat(getComputedStyle(section).borderTopWidth) > 0);

/* The space above the content of each band. True where the band keeps its
   own, false where the band before it gives the space. */
const spaces = (canvas: HTMLElement): boolean[] =>
  [...canvas.querySelectorAll('.sds-band')].map((section) => parseFloat(getComputedStyle(section).paddingTop) > 0);

const expectLines = (want: readonly boolean[], space?: readonly boolean[]) => async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const got = lines(canvasElement);
  if (got.join() !== want.join()) throw new Error(`lines above the bands: ${got.join()}, not ${want.join()}`);
  const kept = spaces(canvasElement);
  if (space && kept.join() !== space.join()) throw new Error(`space above the bands: ${kept.join()}, not ${space.join()}`);
};

const meta: Meta<BandProps> = {
  title: 'Components/Content/Band',
  tags: ['autodocs', '!dev'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    quiet: { control: 'boolean' },
    rule: { control: 'boolean' },
  },
  args: { quiet: false, rule: true },
  /* The band in the middle takes the controls, between two plain bands. */
  render: (args) =>
    run([
      plain('The band before'),
      { heading: 'This band', body: 'The controls set its ground and its line.', ...args },
      plain('The band after'),
    ]),
};

export default meta;
type Story = StoryObj<BandProps>;

/** The middle band, set by the controls. */
export const Default: Story = {};

/** Two plain bands are one ground: no line, and the space between them once, not twice. */
export const PlainThenPlain: Story = {
  name: 'Plain, then plain',
  render: () => run([plain('One part'), plain('The next part')]),
  play: expectLines([false, false], [true, false]),
};

/** A ruled band after a plain one: the same ground, and a line where the next part starts. */
export const PlainThenRuled: Story = {
  name: 'Plain, then ruled',
  render: () => run([plain('One part'), ruled('The next part'), ruled('And the part after it')]),
  play: expectLines([false, true, true], [true, true, true]),
};

/** Plain and quiet in turn: the ground changes, and each quiet band draws its own edges. */
export const Alternating: Story = {
  render: () => run([plain('The pitch'), quiet('Who it is for'), plain('What it consists of'), quiet('How to start')]),
  play: expectLines([false, true, false, true], [true, true, true, true]),
};

/** Two quiet bands in a row share one line, not two. */
export const QuietThenQuiet: Story = {
  name: 'Quiet, then quiet',
  render: () => run([plain('The canvas'), quiet('One quiet part'), quiet('The next quiet part'), plain('The canvas again')]),
  play: expectLines([false, true, false, false], [true, true, true, true]),
};

/** A ruled band after a quiet one: the quiet band's own edge is the line, and the rule adds none. */
export const QuietThenRuled: Story = {
  name: 'Quiet, then ruled',
  render: () => run([quiet('A quiet part'), ruled('A ruled part')]),
  play: expectLines([true, false]),
};

/** The first band of a page draws no rule: nothing stands above it to divide it from. */
export const RuledFirst: Story = {
  name: 'Ruled, first',
  render: () => run([ruled('The first band', 'A rule here is a second edge under the bar, so it draws none.'), ruled('The second band')]),
  play: expectLines([false, true]),
};
