/* A value picked along a run of them.

   The markup lives in `src/components/range.ts`. Reach for one where the
   *position* is the answer and the exact number is not — a zoom, a threshold
   somebody is feeling their way to. Where the number is what the reader
   already knows, that is a field with `type="number"`, which can be typed into
   and pasted.

   Drag one below, and walk it with the arrow keys: it is the platform's own
   slider with the track and the thumb repainted. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/range.ts';
import { type RangeProps } from '../../packages/frontend/src/components/range.ts';
import { ifDefined } from 'lit/directives/if-defined.js';

const sdsRange = ({ caption, label, name, min, max, step, value, unit, hint, disabled, fieldId }: RangeProps) =>
  html`<sds-range
    caption="${ifDefined(caption)}"
    label="${ifDefined(label)}"
    name="${name ?? ''}"
    min="${min ?? '0'}"
    max="${max ?? '100'}"
    step="${step ?? '1'}"
    value="${value ?? '50'}"
    unit="${unit ?? ''}"
    hint="${hint ?? ''}"
    field-id="${fieldId ?? ''}"
    ?disabled="${disabled ?? false}"
  ></sds-range>`;

const meta: Meta<RangeProps> = {
  title: 'Forms/Range',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsRange(args),
  argTypes: {
    caption: { control: 'text' },
    label: { control: 'text' },
    min: { control: 'text' },
    max: { control: 'text' },
    step: { control: 'text' },
    value: { control: 'text' },
    unit: { control: 'text' },
    hint: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    caption: 'Results per page',
    fieldId: 'per-page',
    name: 'per-page',
    min: '10',
    max: '100',
    step: '10',
    value: '30',
  },
};

export default meta;
type Story = StoryObj<RangeProps>;

/** The question on the left and the number on the right: a slider with nothing
    beside it is a value nobody can read back or report. The read-out is an
    `<output>` pointing at the control. */
export const Default: Story = {};

/** What the number means, beside the read-out. */
export const WithUnit: Story = {
  args: {
    caption: 'Preview width',
    fieldId: 'preview-width',
    name: 'preview-width',
    min: '320',
    max: '1440',
    step: '10',
    value: '960',
    unit: 'px',
    hint: 'The viewport the specimen is photographed in.',
  },
};

/** Without a caption it is the bare slider — right where the surface around it
    says what it moves. It still owes a `label`. */
export const Bare: Story = {
  args: { caption: undefined, label: 'Zoom', value: '70' },
};

/** Present but not available. */
export const Disabled: Story = {
  args: { caption: 'Quality', fieldId: 'quality', value: '80', unit: '%', disabled: true },
};
