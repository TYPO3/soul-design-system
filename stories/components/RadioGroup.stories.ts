/* One answer out of a few, all of them visible.

   The markup lives in `src/components/radio-group.ts`. No `parameters.dsCard`:
   what a card would show is three radios, and what is worth documenting is
   when to reach for this at all — which is a comparison with `sds-field
   select` rather than a picture.

   A few, and visible. Above roughly five answers the set stops being scannable
   and becomes a list, and a list the reader must read to answer one question
   is a select. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/radio-group.ts';
import '../../packages/frontend/src/components/field.ts';
import { type RadioGroupProps } from '../../packages/frontend/src/components/radio-group.ts';

const sdsRadioGroup = ({ legend, name, choices, value, hint, required }: RadioGroupProps) =>
  html`<sds-radio-group
    legend="${legend}"
    name="${name}"
    .choices="${choices}"
    value="${value ?? ''}"
    hint="${hint ?? ''}"
    ?required="${required ?? false}"
  ></sds-radio-group>`;

const REPLY = [
  { label: 'Email', hint: 'One reply, to the address above.' },
  { label: 'In the repository', hint: 'The report becomes an issue, and the thread is public.' },
  { label: 'No reply', hint: 'The report is read and filed. Nothing comes back.' },
];

const meta: Meta<RadioGroupProps> = {
  title: 'Components/Radio group',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsRadioGroup(args),
  argTypes: {
    legend: { control: 'text' },
    name: { control: 'text' },
    hint: { control: 'text' },
    value: { control: 'text' },
    required: { control: 'boolean' },
  },
  args: { legend: 'How should we come back to you?', name: 'reply', choices: REPLY, value: 'Email' },
};

export default meta;
type Story = StoryObj<RadioGroupProps>;

/** The question is the legend and the answers are the set. Each may carry
    what choosing it means — which is the whole reason this is not a select. */
export const Default: Story = {};

/** Nothing chosen. Legal, and worth avoiding where one answer is the ordinary
    one: an unset group makes every reader decide something the form could
    have decided for them. */
export const Unset: Story = { args: { value: '' } };

/** Required, and with what the answer is for under the question. */
export const Required: Story = {
  args: {
    required: true,
    hint: 'It decides where the answer goes, not how fast it comes.',
  },
};

/** Bare answers, where each of them says everything in its own label. */
export const Plain: Story = {
  args: {
    legend: 'Which release is this about?',
    name: 'release',
    choices: [{ label: '12.4' }, { label: '13.4' }, { label: '14.3' }, { label: 'main' }],
    value: '13.4',
  },
};

/** The comparison worth making. Four answers with consequences are a group;
    twelve releases are a select, because the reader knows the one they want
    and does not need to read the others. */
export const OrASelect: Story = {
  render: () => html`<div style="display:flex; gap:var(--space-12); flex-wrap:wrap; align-items:flex-start">
    ${sdsRadioGroup({ legend: 'How should we come back to you?', name: 'reply-a', choices: REPLY, value: 'Email' })}
    <sds-field
      caption="Which release is this about?"
      select
      .options="${['12.4', '13.4', '14.3', 'main', '11.5', '10.4', '9.5', '8.7']}"
      value="13.4"
      filled
      hint="Every release the bundled knowledge still answers for."
    ></sds-field>
  </div>`,
};
