/* Fields and search.

   The markup lives in `src/components/field.ts`. A field is sunken, never outlined on
   the canvas, and the accent appears on it in exactly one place: focus.

   The specimen draws its states on a `<span>` rather than an `<input>`
   because a real input cannot be made to *hold* focus or invalidity for a
   screenshot, and the states are the entire subject of the card. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../src/components/field.ts';
import { type FieldProps } from '../src/components/field.ts';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DIVIDER, dsCard, part, spec, specCap, specRow } from './lib/specimen.ts';

const sdsField = ({ value = '', icon, focused, invalid, filled, select, minWidth = 220 }: FieldProps) =>
  html`<sds-field
    value="${value}"
    icon="${ifDefined(icon)}"
    min-width="${minWidth}"
    ?focused="${focused}"
    ?invalid="${invalid}"
    ?filled="${filled}"
    ?select="${select}"
  ></sds-field>`;

const sdsFieldError = (message: string) => html`<sds-field-error message="${message}"></sds-field-error>`;

const meta: Meta<FieldProps> = {
  title: 'Components/Fields',
  tags: ['autodocs', '!dev'],
  /* Storybook treats every export as a story. These are the helpers the
     card generator and the sibling stories import. */
  excludeStories: ['specimenHtml'],
  render: (args) => sdsField(args),
  argTypes: {
    value: { control: 'text' },
    icon: { control: 'select', options: [undefined, 'actions-search', 'actions-filter'] },
    focused: { control: 'boolean' },
    invalid: { control: 'boolean' },
    filled: { control: 'boolean' },
    select: { control: 'boolean' },
    minWidth: { control: { type: 'number', step: 10 } },
  },
  args: { value: 'Type to search 48 pages', icon: 'actions-search', focused: false, invalid: false, filled: false, select: false, minWidth: 220 },
  parameters: {
    dsCard: dsCard({
      path: 'components/core/input.card.html',
      name: 'Fields & search',
      subtitle: 'A field is sunken; the accent only appears on focus',
      viewport: '700x180',
    }),
  },
};

export default meta;
type Story = StoryObj<FieldProps>;

export const Rest: Story = { args: { value: 'Type to search 48 pages', icon: 'actions-search' } };

/** The one place the accent touches a field. Always `:focus-visible`, never
    `:focus` — a click should not leave a ring behind. */
export const Focused: Story = { args: { value: 'icon lookup', icon: 'actions-search', focused: true } };

export const Select: Story = { args: { value: '13.4', select: true, minWidth: 150 } };
export const Invalid: Story = { args: { value: 'dashbord', invalid: true, filled: true } };

/** Error text sits under or beside the field, never as a tooltip: an error
    the pointer has to find is an error the keyboard never surfaces. */
export const ErrorMessage: Story = { render: () => sdsFieldError('Not a registered identifier') };

export const specimenHtml = (): string =>
  spec([
    specRow([Rest, Focused].map((s) => part(sdsField(s.args as FieldProps))), 'REST · FOCUS'),
    specRow([
      part(sdsField(Select.args as FieldProps)),
      part(sdsField(Invalid.args as FieldProps)),
      part(sdsFieldError('Not a registered identifier')),
    ]),
    specCap(
      'FIELDS ARE SUNKEN, NOT OUTLINED ON THE CANVAS · ERROR TEXT SITS UNDER OR BESIDE, NEVER AS A TOOLTIP',
      DIVIDER,
    ),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
