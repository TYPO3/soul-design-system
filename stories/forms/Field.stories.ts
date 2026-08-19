/* Fields and search.

   The markup lives in `src/components/field.ts`. A field is sunken, never
   outlined on the canvas, and the accent appears on it in one place: focus.

   Type in the ones below and tab between them — they are controls. The two
   stories that force a state are marked as what they are, a still picture
   being unable to hold focus or invalidity. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/field.ts';
import '../../packages/frontend/src/components/field-error.ts';
import { type FieldProps, type FieldSize } from '../../packages/frontend/src/components/field.ts';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DIVIDER, dsCard, part, spec, specCap, specRow } from '../lib/specimen.ts';

/* `label` is not optional in practice: a control with no visible label of its
   own has no accessible name without it, and every field on the card is one.
   The stories pass it, and the a11y pass is what says whether they did. */
const sdsField = ({ value = '', icon, label, focused, invalid, filled, select, options, disabled, readonly, prefix, suffix, minWidth = 220, size = 'md' }: FieldProps) =>
  html`<sds-field
    size="${size}"
    value="${value}"
    icon="${ifDefined(icon)}"
    label="${ifDefined(label)}"
    prefix="${ifDefined(prefix)}"
    suffix="${ifDefined(suffix)}"
    min-width="${minWidth}"
    .options="${options ?? []}"
    ?focused="${focused}"
    ?invalid="${invalid}"
    ?filled="${filled}"
    ?select="${select}"
    ?disabled="${disabled}"
    ?readonly="${readonly}"
  ></sds-field>`;

const meta: Meta<FieldProps> = {
  title: 'Forms/Field',
  tags: ['autodocs', '!dev'],
  /* Storybook treats every export as a story. These are the helpers the
     card generator and the sibling stories import. */
  excludeStories: ['specimenHtml'],
  render: (args) => sdsField(args),
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm', 'lg'] },
    value: { control: 'text' },
    icon: { control: 'select', options: [undefined, 'actions-search', 'actions-filter'] },
    focused: { control: 'boolean' },
    invalid: { control: 'boolean' },
    filled: { control: 'boolean' },
    select: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
    minWidth: { control: { type: 'number', step: 10 } },
    label: { control: 'text' },
  },
  args: { size: 'md', value: 'Type to search 48 pages', icon: 'actions-search', label: 'Search the documentation', focused: false, invalid: false, filled: false, select: false, disabled: false, readonly: false, minWidth: 220 },
  parameters: {
    dsCard: dsCard({
      path: 'components/core/input.card.html',
      name: 'Fields & search',
      subtitle: 'A field is sunken; the accent only appears on focus',
      viewport: '700x357',
    }),
  },
};

export default meta;
type Story = StoryObj<FieldProps>;

/** A real input in a sunken box. Click it: the ring is `:focus-within`, and
    the value becomes the user's as soon as anything is typed. */
export const Default: Story = { args: { value: 'Type to search 48 pages', icon: 'actions-search', label: 'Search the documentation' } };

/** A select is the same box, closed by a chevron, around a real `<select>`. */
export const Select: Story = {
  args: { value: '13.4', select: true, minWidth: 150, options: ['12.4', '13.4', '14.3', 'main'], label: 'TYPO3 version' },
};

/** What stands in the box beside the value and is not part of it: a unit, a
    currency, the fixed head of an address. Nothing is typed into one and
    nothing is sent for it. */
export const Affixed: Story = {
  args: { value: '16', filled: true, prefix: 'line-height', suffix: 'px', icon: undefined, minWidth: 240, label: 'Line height' },
};

/** Shown and sent, and not editable — so the box gives up the sunken fill that
    says *type here* and keeps everything else. Still focusable and still
    copyable, which is the whole difference from the one below. */
export const Readonly: Story = {
  args: { value: 'typo3/cms-core', filled: true, readonly: true, icon: undefined, minWidth: 240, label: 'Package' },
};

/** Not on offer, at the strength every other unavailable control is drawn at.
    The box keeps its shape: one that loses its border too reads as a gap in
    the form rather than as a question that is closed. */
export const Disabled: Story = {
  args: { value: 'Sign in to search your projects', disabled: true, icon: 'actions-search', minWidth: 300, label: 'Search your projects' },
};

/** Error text sits under or beside the field, never as a tooltip: an error
    the pointer has to find is an error the keyboard never surfaces. */
export const Invalid: Story = {
  render: (args) => html`<div style="display:flex; flex-direction:column; gap:var(--space-2); align-items:flex-start">
    ${sdsField(args)}
    <sds-field-error message="Not a registered identifier"></sds-field-error>
  </div>`,
  args: { value: 'dashbord', invalid: true, filled: true, label: 'Identifier' },
};

/** The three heights a button has, so a field and the button beside it stand
    on one line. `sm` is for a field inside another surface — a toolbar, a
    table head, a filter row — and never for making a form fit. */
export const Small: Story = {
  args: { size: 'sm', value: 'Filter tools', icon: 'actions-filter', minWidth: 180, label: 'Filter tools' },
};

/** `lg` is the field the screen is for: the one question a landing asks,
    beside the large button that answers it. */
export const Large: Story = {
  args: { size: 'lg', value: 'Search the manual', icon: 'actions-search', minWidth: 300, label: 'Search the manual' },
};

/* The two below force a state that a live control holds only while it is
   held. They exist because the specimen card is a photograph. */

/** Focus, painted. The live state needs none of this — the ring is the
    browser's, and this only stands in where nothing can be pressed. */
export const FocusedForSpecimen: Story = {
  args: { value: 'icon lookup', icon: 'actions-search', focused: true, label: 'Search the documentation' },
};

/* One field at each height, with the same content in all three, so the row
   differs in nothing but the box. The widths only keep them off each other. */
const at = (size: FieldSize, minWidth: number): string =>
  part(sdsField({ size, minWidth, value: 'Filter tools', icon: 'actions-filter', label: 'Filter tools' }));

export const specimenHtml = (): string =>
  spec([
    specRow(
      [Default, FocusedForSpecimen].map((s) => part(sdsField(s.args as FieldProps))),
      'REST · FOCUS',
    ),
    specRow([
      part(sdsField(Affixed.args as FieldProps)),
      part(sdsField(Invalid.args as FieldProps)),
      part(html`<sds-field-error message="Not a registered identifier"></sds-field-error>`),
    ]),
    specRow(
      [Readonly, Disabled].map((s) => part(sdsField(s.args as FieldProps))),
      'READ-ONLY · NOT ON OFFER',
    ),
    specRow(
      (['sm', 'md', 'lg'] as const).map((size, i) => at(size, 150 + i * 30)),
      'SM · MD · LG — THE CONTROL HEIGHTS A BUTTON HAS',
      { divided: true },
    ),
    specCap(
      'FIELDS ARE SUNKEN, NOT OUTLINED ON THE CANVAS · ERROR TEXT SITS UNDER OR BESIDE, NEVER AS A TOOLTIP',
      DIVIDER,
    ),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
