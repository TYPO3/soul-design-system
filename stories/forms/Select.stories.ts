/* One answer out of a list the reader does not need to see.

   The markup lives in `src/components/select.ts`. It shares the field's sunken
   box and nothing else: what a select has is a list — with headings, and
   entries that are on it but not on offer — and what it has not is anything to
   type into.

   Open one below. The list is the platform's, which is the list a phone opens
   full-screen and a keyboard walks by typing. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/select.ts';
import { type SelectProps } from '../../packages/frontend/src/components/select.ts';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DIVIDER, dsCard, part, spec, specCap, specRow } from '../lib/specimen.ts';

const sdsSelect = ({ caption, label, value = '', options, hint, error, required, disabled, filled, focused, invalid, open, minWidth = 220, size = 'md' }: SelectProps) =>
  html`<sds-select
    size="${size}"
    caption="${ifDefined(caption)}"
    label="${ifDefined(label)}"
    value="${value}"
    hint="${ifDefined(hint)}"
    error="${ifDefined(error)}"
    min-width="${minWidth}"
    .options="${options ?? []}"
    ?required="${required}"
    ?disabled="${disabled}"
    ?filled="${filled}"
    ?focused="${focused}"
    ?invalid="${invalid}"
    ?open="${open}"
  ></sds-select>`;

/** The releases a question can be about, as a list with headings. Consecutive
    entries naming the same group become one `<optgroup>`, so the order of the
    list is the grouping. */
const RELEASES = [
  { label: '14.3', group: 'Supported' },
  { label: '13.4', group: 'Supported' },
  { label: 'main', group: 'Development' },
  { label: '12.4', group: 'Out of support', disabled: true },
  { label: '11.5', group: 'Out of support', disabled: true },
];

const meta: Meta<SelectProps> = {
  title: 'Forms/Select',
  tags: ['autodocs', '!dev'],
  excludeStories: ['specimenHtml'],
  render: (args) => sdsSelect(args),
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm', 'lg'] },
    caption: { control: 'text' },
    label: { control: 'text' },
    value: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    filled: { control: 'boolean' },
    open: { control: 'boolean' },
    minWidth: { control: { type: 'number', step: 10 } },
  },
  args: { size: 'md', value: '13.4', filled: true, minWidth: 180, label: 'TYPO3 version', options: ['12.4', '13.4', '14.3', 'main'] },
  parameters: {
    dsCard: dsCard({
      path: 'components/core/select.card.html',
      group: 'Components',
      name: 'A select',
      subtitle: 'The field’s box round the platform’s own list — headings, and answers that are on it but not on offer',
      viewport: '700x634',
    }),
  },
};

export default meta;
type Story = StoryObj<SelectProps>;

/** The bare box, right where the surface around it says what it is for — a
    header, a toolbar, a filter row. It still owes a `label`. */
export const Default: Story = {};

/** Nothing chosen yet, said in the list rather than in a placeholder a closed
    box has nowhere to put. The entry is disabled, so it is what the reader
    sees and never what they can pick — and a `required` select is blocked by
    the browser until they pick another. */
export const Unchosen: Story = {
  args: { value: 'Choose a release', filled: false, minWidth: 240, options: ['12.4', '13.4', '14.3', 'main'] },
};

/** Headings, and answers that are on the list and not on offer. A release out
    of support is worth showing: a reader who cannot find it at all does not
    learn that it is gone. */
export const Grouped: Story = {
  args: { value: '13.4', filled: true, minWidth: 240, options: RELEASES },
};

/** With a caption it renders the row a form owes a control: label above, hint
    under, error under both. */
export const InAForm: Story = {
  args: {
    caption: 'Which release is this about?',
    value: '13.4',
    filled: true,
    minWidth: 280,
    options: RELEASES,
    hint: 'Answers are checked against the release you pick.',
    required: true,
  },
};

/** `error` sets the sentence *and* the invalid state, and the browser refuses
    to submit past it — one fact, drawn once. */
export const Invalid: Story = {
  args: {
    caption: 'Which release is this about?',
    value: 'Choose a release',
    filled: false,
    minWidth: 280,
    options: RELEASES,
    error: 'Say which release the question is about',
  },
};

/** The three heights a button has, so a select and the button beside it stand
    on one line. */
export const Small: Story = { args: { size: 'sm', value: '13.4', filled: true, minWidth: 140 } };

/* The list, drawn standing open. A card is a picture and runs no script, so it
   can neither press the button nor hold a popover — this is the same kind of
   state as the field's `focused`, and it is never set on a page. */

/** What the reader sees while they are choosing: the headings, the answer in
    force with its mark, the one the keys are on, and the one that is on the
    list without being on offer. */
export const OpenForSpecimen: Story = {
  args: { value: '13.4', filled: true, minWidth: 240, options: RELEASES, open: true },
};

/** The open list stands over whatever is under it, so the card reserves the
    room a page would have had. */
const OPEN_ROOM = 300;

export const specimenHtml = (): string =>
  spec([
    specRow(
      [Default, Unchosen].map((s) => part(sdsSelect({ ...(meta.args as SelectProps), ...(s.args as SelectProps) }))),
      'CHOSEN · NOTHING CHOSEN YET',
    ),
    specRow(
      [InAForm, Invalid].map((s) => part(sdsSelect({ ...(meta.args as SelectProps), ...(s.args as SelectProps) }))),
      'IN A FORM · WRONG',
    ),
    specRow(
      [
        part(html`<div style="height:${OPEN_ROOM}px;">${
          sdsSelect({ ...(meta.args as SelectProps), ...(OpenForSpecimen.args as SelectProps) })
        }</div>`),
      ],
      'THE LIST, OPEN — HEADINGS, THE ANSWER IN FORCE, AND ONE THAT IS NOT ON OFFER',
      { divided: true },
    ),
    specCap(
      'THE LIST IS DRAWN, NOT THE BROWSER’S — SO A DARK PAGE DOES NOT OPEN A LIGHT WINDOW · THE REAL SELECT UNDER IT IS WHAT THE FORM SENDS',
      DIVIDER,
    ),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
