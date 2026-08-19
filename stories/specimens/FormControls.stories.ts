/* The controls a form is made of that are not a box you type in, as one card.

   The field card is the box and its states; the form card is what a form owes
   a control. This is the third question a reader has: which control answers
   which kind of question. A setting that takes effect now is a switch, a value
   felt for is a slider, a file is the platform's own picker, and several
   answers under one question are a set of boxes.

   Everything here is drawn by the elements. A form is where a specimen is
   tempted to fake — a `<span>` shaped like a switch photographs perfectly and
   cannot be flipped. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/checkbox-group.ts';
import '../../packages/frontend/src/components/file.ts';
import '../../packages/frontend/src/components/range.ts';
import '../../packages/frontend/src/components/switch.ts';
import { DIVIDER, dsCard, part, spec, specCap, specRow } from '../lib/specimen.ts';

/** A setting that takes effect where it stands — on and off, so the two are
    read as one control moving rather than two pictures. */
const settings = (): string =>
  part(html`<div style="display:flex; flex-direction:column; gap:14px;">
  <sds-switch label="Follow the system theme" checked></sds-switch>
  <sds-switch
    label="Keep me signed in"
    hint="On this browser, for thirty days. Not on a shared machine."
  ></sds-switch>
</div>`);

/** A value the position of which is the answer. The read-out is an `<output>`:
    a slider with no number beside it is a value nobody can report. */
const felt = (): string =>
  part(html`<div style="width:280px;">
  <sds-range
    caption="Preview width"
    field-id="spec-width"
    name="preview-width"
    min="320"
    max="1440"
    step="10"
    value="960"
    unit="px"
  ></sds-range>
</div>`);

/** The picker, with its own button painted and the browser's sentence beside
    it. A drawn box with a hidden input behind it photographs well and loses
    the keyboard. */
const attach = (): string =>
  part(html`<sds-file
  caption="Attach a screenshot"
  field-id="spec-shot"
  name="shot"
  accept="image/*"
  hint="PNG or JPEG, up to 5 MB."
></sds-file>`);

/** Several answers under one question, bound by a legend and a shared name.
    One of them is on the list and not on offer, which is worth showing: an
    answer a reader cannot find at all does not tell them it is closed. */
const several = (): string =>
  part(html`<sds-checkbox-group
  legend="What may we attach to the report?"
  name="scope"
  .values="${['versions']}"
  .choices="${[
    { label: 'Installed versions', value: 'versions' },
    { label: 'Reachable sources', value: 'sources' },
    { label: 'File contents', value: 'files', hint: 'Not on offer while the project is public.', disabled: true },
  ]}"
></sds-checkbox-group>`);

const meta: Meta = {
  title: 'Specimens/Form controls',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'components/core/form-controls.card.html',
      group: 'Components',
      name: 'Beyond the text field',
      subtitle: 'A switch takes effect now, a slider is felt for, a picker is the platform’s, a set is one question',
      viewport: '700x382',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  spec([
    specRow([settings(), felt()], 'TAKES EFFECT NOW · FELT FOR'),
    specRow([attach(), several()], 'THE PLATFORM’S PICKER · ONE QUESTION, ANY NUMBER OF ANSWERS'),
    specCap(
      'A SWITCH IS NOT A CHECKBOX — ONE TURNS SOMETHING ON, THE OTHER ANSWERS THE FORM · ON IS TEXT COLOUR, NOT THE ACCENT',
      DIVIDER,
    ),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
