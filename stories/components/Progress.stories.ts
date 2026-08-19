/* How far a running job has got.

   The markup lives in `src/components/progress.ts`. A share, not a sequence of
   stops: reach for `sds-steps` where the claim is that step two follows step
   one, and for this where the claim is a distance. Where the distance is not
   known there is nothing to fill — that is `.sds-loading` with a spinner.

   Press the buttons under `Driven from outside`: nothing here moves on its
   own, `value` is the whole of the interface, and the ink follows it the whole
   way — grey at the start, the colour of a finished run as it gets there. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/progress.ts';
import { type ProgressProps, type SdsProgress } from '../../packages/frontend/src/components/progress.ts';
import { dsCard, DIVIDER, spec, specCap, part } from '../lib/specimen.ts';

export const sdsProgress = ({ caption, label, value, max, readout, unit, note, size, pulsing }: ProgressProps) =>
  html`<sds-progress
    caption="${caption ?? ''}"
    label="${ifDefined(label)}"
    value="${value ?? 0}"
    max="${max ?? 100}"
    readout="${readout ?? 'percent'}"
    unit="${unit ?? ''}"
    size="${size ?? 'medium'}"
    ?pulsing="${pulsing ?? false}"
    .note="${note ?? ''}"
  ></sds-progress>`;

const meta: Meta<ProgressProps> = {
  title: 'Components/Progress',
  tags: ['autodocs', '!dev'],
  excludeStories: ['sdsProgress', 'specimenHtml'],
  render: (args) => sdsProgress(args),
  argTypes: {
    caption: { control: 'text' },
    label: { control: 'text' },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number' },
    readout: { control: 'inline-radio', options: ['percent', 'count', 'none'] },
    unit: { control: 'text' },
    note: { control: 'text' },
    size: { control: 'inline-radio', options: ['medium', 'small'] },
    pulsing: { control: 'boolean' },
  },
  args: {
    caption: 'Rendering the manual',
    value: 42,
    note: 'Chapter 5 of 12 — writing the search index next.',
  },
  parameters: {
    dsCard: dsCard({
      path: 'components/core/progress.card.html',
      name: 'A job with a distance in it',
      subtitle: 'The share as a length, the position as a number, and the line saying what is running',
      viewport: '700x475',
    }),
  },
};

export default meta;
type Story = StoryObj<ProgressProps>;

/** The name of the work on the left, where it stands on the right: a filled
    length on its own is a position nobody can read back or report. */
export const Default: Story = {};

/** The two numbers themselves, where what is being counted is the useful part.
    A percentage of twelve files is arithmetic the reader has to undo. */
export const Count: Story = {
  args: {
    caption: 'Uploading the release',
    value: 3,
    max: 12,
    readout: 'count',
    unit: 'files',
    note: 'Two of them are the drop-in, which is the pair that takes the longest.',
  },
};

/** Nothing done yet. The track is the whole of it, and the caption is what
    says the work has started — an empty bar claims neither. */
export const Empty: Story = { args: { caption: 'Booting the installation', value: 0, note: '' } };

/** Done, where the ink has arrived at the colour it has been mixing toward all
    the way up. The bar stays — a job that finishes by disappearing leaves the
    reader working out whether it finished or the page dropped it. */
export const Complete: Story = {
  args: { caption: 'Rendering the manual', value: 100, note: '12 chapters, 1 search index.' },
};

/** The bar in a row of other things. The track alone gets thinner; the
    read-out over it is the same line it is anywhere else. */
export const Small: Story = {
  args: { caption: 'Reading packages', value: 68, size: 'small', note: '' },
};

/** Work is happening right now, which a bar standing still cannot say: a hatch
    travels through the filled part while the number waits for the next report.
    Turn it off the moment the work stops — one travelling at a standstill
    claims something nobody measured — and leave it off when the run is done.
    Not in the card: moving stripes photograph as whatever frame they were
    caught in, and every screenshot of the card would differ from the last. */
export const Pulsing: Story = {
  args: {
    caption: 'Booting the installation',
    value: 18,
    pulsing: true,
    note: 'Waiting on the container — the next report is the extension scan.',
  },
};

/** A bar with no caption, where the surface around it already names the job.
    It still owes `label`, which is what anything not reading the page uses. */
export const Bare: Story = {
  args: { caption: '', label: 'Rendering the manual', value: 42, note: '' },
};

/** Driven from outside, which is the whole interface: `value` is set and the
    bar travels to the new width in `--duration-fast`. Nothing counts on its
    own — a bar that advances by itself is a bar telling the reader something
    the work never said. */
export const Driven: Story = {
  render: () => {
    const move = (by: number) => (event: Event): void => {
      const set = (event.currentTarget as HTMLElement).closest('.sds-stack');
      const bar = set?.querySelector('sds-progress') as SdsProgress | null;
      if (bar) bar.value = Math.min(Math.max(bar.value + by, 0), bar.max);
    };
    return html`<div class="sds-stack">
      ${sdsProgress({ caption: 'Rendering the manual', value: 42, note: 'Set from outside, one press at a time.' })}
      <div class="sds-actions">
        <sds-button variant="secondary" size="sm" @click="${move(-10)}">Back 10</sds-button>
        <sds-button variant="secondary" size="sm" @click="${move(10)}">On 10</sds-button>
      </div>
    </div>`;
  },
};

/** The card: the two read-outs, the two ends of the run, and the thin one. */
export const specimenHtml = (): string =>
  spec([
    part(
      sdsProgress({
        caption: 'Rendering the manual',
        value: 42,
        note: 'Chapter 5 of 12 — writing the search index next.',
      }),
    ),
    specCap('PERCENT · THE SHARE, WHERE WHAT IS BEING COUNTED IS NOT THE READER’S CONCERN'),
    part(
      sdsProgress({
        caption: 'Uploading the release',
        value: 3,
        max: 12,
        readout: 'count',
        unit: 'files',
        note: 'Two of them are the drop-in, which is the pair that takes the longest.',
      }),
    ),
    specCap('COUNT · THE TWO NUMBERS THEMSELVES, WHERE THE THING COUNTED IS THE USEFUL PART'),
    part(sdsProgress({ label: 'Nothing done yet', value: 0, readout: 'none' })),
    part(sdsProgress({ label: 'A third of the way', value: 33, readout: 'none' })),
    part(sdsProgress({ label: 'Two thirds of the way', value: 66, readout: 'none' })),
    part(sdsProgress({ label: 'Finished', value: 100, readout: 'none' })),
    specCap('THE INK IS MIXED FROM THE DISTANCE ITSELF · GREY AT THE START, THE COLOUR OF A FINISHED RUN AT THE END'),
    part(sdsProgress({ caption: 'Reading packages', value: 68, size: 'small' })),
    specCap('SMALL · THE TRACK ALONE IS THINNER, FOR A BAR IN A ROW OF OTHER THINGS', DIVIDER),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
