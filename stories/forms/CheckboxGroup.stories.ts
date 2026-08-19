/* Tick any of these, under one question.

   The markup lives in `src/components/checkbox-group.ts`. `sds-checkbox` is
   one fact standing on its own; this is the other shape a set of boxes takes.
   Written as loose checkboxes it is a heading that happens to sit above some
   rows — nothing binds them, so nothing reads them out as one question either.

   The set is the component, as it is for `sds-radio`: the legend, the shared
   name and what is ticked are three things a caller would otherwise keep in
   step by hand. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/checkbox-group.ts';
import { type CheckboxGroupProps } from '../../packages/frontend/src/components/checkbox-group.ts';

const sdsCheckboxGroup = ({ legend, name, choices, values, hint }: CheckboxGroupProps) =>
  html`<sds-checkbox-group
    legend="${legend}"
    name="${name}"
    hint="${hint ?? ''}"
    .choices="${choices}"
    .values="${values ?? []}"
  ></sds-checkbox-group>`;

const meta: Meta<CheckboxGroupProps> = {
  title: 'Forms/Checkbox group',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsCheckboxGroup(args),
  argTypes: {
    legend: { control: 'text' },
    name: { control: 'text' },
    hint: { control: 'text' },
  },
  args: {
    legend: 'What may we attach to the report?',
    name: 'scope',
    values: ['versions'],
    choices: [
      { label: 'Installed versions', value: 'versions' },
      { label: 'Reachable sources', value: 'sources' },
      { label: 'Degraded tools', value: 'tools', hint: 'What answered slowly or not at all.' },
      { label: 'File contents', value: 'files', hint: 'Not on offer while the project is public.', disabled: true },
    ],
  },
};

export default meta;
type Story = StoryObj<CheckboxGroupProps>;

/** One name for the whole set, so a server reads the answers as a list. */
export const Default: Story = {};

/** What the whole set commits to, under the legend. A choice carries its own
    where one answer needs saying and the others do not. */
export const Hinted: Story = {
  args: {
    legend: 'Which digests should we send?',
    name: 'digest',
    hint: 'One message per digest, on Fridays. Unsubscribe from any of them.',
    values: [],
    choices: [
      { label: 'Releases', value: 'releases' },
      { label: 'Security advisories', value: 'security' },
      { label: 'Documentation changes', value: 'docs' },
    ],
  },
};
