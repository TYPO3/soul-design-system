/* The form layer, as one card.

   The fields card documents a field where the surface around it says what it is
   for. This is the other case: a field inside a **form**, where nothing else
   does and the control owes a label, a hint and, when it is wrong, a sentence.
   Its own card, because a reader picking between them has to see them apart.

   Everything here is drawn by the elements. A form is where a specimen is
   tempted to fake — a `<span>` shaped like a checkbox photographs perfectly and
   cannot be ticked. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/checkbox.ts';
import '../../packages/frontend/src/components/field.ts';
import '../../packages/frontend/src/components/form-errors.ts';
import '../../packages/frontend/src/components/radio.ts';
import { DIVIDER, dsCard, part, spec, specCap, specRow } from '../lib/specimen.ts';

/** A field as a form asks for one: the label above it, the hint under it. */
const asked = (): string =>
  part(html`<sds-field
  caption="Your email"
  field-id="email"
  name="email"
  type="email"
  value="you@example.org"
  min-width="260"
  hint="Used for the reply and for nothing else."
  required
></sds-field>`);

/** The same field after a submit found something. The sentence and the red
    border are one state: `error` sets the invalid mark with it, so the two
    cannot disagree. */
const wrong = (): string =>
  part(html`<sds-field
  caption="Which release is this about?"
  field-id="release"
  name="release"
  value="13.4"
  min-width="240"
  error="Say which release the question is about"
></sds-field>`);

/** One fact, and a set where exactly one answer holds. Both are the browser's
    own controls: what a hand-built box has to re-implement is the keyboard,
    the tap target and how the whole thing reads out. */
const choices = (): string =>
  part(html`<div style="display:flex; flex-direction:column; gap:14px;">
  <sds-checkbox
    label="Attach the server scope"
    hint="Versions, reachable sources, degraded tools. No file contents."
    checked
  ></sds-checkbox>
  <sds-radio
    legend="How should we come back to you?"
    name="reply"
    value="email"
    .choices="${[{ label: 'Email' }, { label: 'In the repository' }, { label: 'No reply' }]}"
  ></sds-radio>
</div>`);

/** What stopped the form, at the top of it. Every line is a link to the field
    it is about, and the box is `sds-note` — a failure looks like one thing in
    this system. */
const summary = (): string =>
  part(html`<sds-form-errors
  .errors="${[
    { message: 'An email address is needed for a reply by email', for: 'email' },
    { message: 'Say which release the question is about', for: 'release' },
  ]}"
></sds-form-errors>`);

const meta: Meta = {
  title: 'Specimens/Form layer',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'components/core/form.card.html',
      group: 'Components',
      name: 'A field in a form',
      subtitle: 'Label above, hint under, error under both — and a placeholder is not a label',
      viewport: '700x486',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  spec([
    specRow([asked(), wrong()], 'ASKED · WRONG'),
    specRow([choices()], 'ONE FACT · ONE ANSWER OF THREE'),
    specRow([summary()], 'WHAT STOPPED IT'),
    specCap(
      'A PLACEHOLDER IS NOT A LABEL · REQUIRED IS SAID IN WORDS · THE TICK IS TEXT COLOUR, NOT THE ACCENT',
      DIVIDER,
    ),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
