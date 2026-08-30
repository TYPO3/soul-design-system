/* One thing that is either so or not — and the set of them under one question.

   The markup lives in `src/components/checkbox.ts` and `checkbox-group.ts`. Two
   elements and one subject, so one file, the way the steps, the accordion and
   the tabs each hold a set and its item together. No `parameters.dsCard` of its
   own: the box and its states are drawn in `components.css`, and the form card
   is where they are shown — in the company a checkbox is used in.

   The two decisions are here — the label is part of the target, and the tick is
   `--text-primary`, because the accent marks three things and a form of ticked
   boxes is not one. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/checkbox.ts';
import '../../packages/frontend/src/components/checkbox-group.ts';
import { type CheckboxProps } from '../../packages/frontend/src/components/checkbox.ts';
import { type CheckboxGroupProps } from '../../packages/frontend/src/components/checkbox-group.ts';

const sdsCheckbox = ({ label, hint, checked = false, indeterminate, name, value, required, disabled }: CheckboxProps) =>
  html`<sds-checkbox
    label="${label}"
    hint="${hint ?? ''}"
    ?checked="${checked}"
    ?indeterminate="${indeterminate ?? false}"
    name="${name ?? ''}"
    value="${value ?? ''}"
    ?required="${required ?? false}"
    ?disabled="${disabled ?? false}"
  ></sds-checkbox>`;

const sdsCheckboxGroup = ({ legend, legendSaidOnly, name, choices, values, hint }: CheckboxGroupProps) =>
  html`<sds-checkbox-group
    legend="${legend}"
    ?legend-said-only="${legendSaidOnly ?? false}"
    name="${name}"
    hint="${hint ?? ''}"
    .choices="${choices}"
    .values="${values ?? []}"
  ></sds-checkbox-group>`;

const meta: Meta<CheckboxProps> = {
  title: 'Forms/Checkbox',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsCheckbox(args),
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    name: { control: 'text' },
    value: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Send me the answer by email', checked: false },
};

export default meta;
type Story = StoryObj<CheckboxProps>;

/** The label is inside the `<label>`, so the words are part of the target. A
    16px box is hard to hit and the sentence beside it is not. */
export const Default: Story = {};

/** Ticked. Not in the accent, which has three jobs already. */
export const Checked: Story = { args: { label: 'Send me the answer by email', checked: true } };

/** What the form receives. These render into the light DOM, so the `<input>`
    is a real descendant of the `<form>` and is submitted with the rest: `name`
    is what it is called there, `value` what it sends when ticked. A box with
    no `value` sends `on` — the platform's answer, not this system's — and an
    unticked box sends nothing at all. */
export const Named: Story = {
  args: { label: 'Attach the server scope', name: 'scope', value: 'server', checked: true },
};

/** A set of them under one question, which is its own element. Written as loose
    boxes it is a heading that happens to sit above some rows — nothing binds
    them, so nothing reads them out as one question either. The legend, the
    shared name and what is ticked are three things a caller would otherwise
    keep in step by hand. */
export const Group: Story = {
  render: () => sdsCheckboxGroup({
    legend: 'What may we send you?',
    name: 'send',
    hint: 'Each one is its own answer, and none of them decides another.',
    values: ['releases', 'security'],
    choices: [
      { label: 'Release notes', value: 'releases', hint: 'When a version ships, and what changed in it.' },
      { label: 'Security advisories', value: 'security', hint: 'Only what reaches a version you run.' },
      { label: 'Everything else', value: 'other', hint: 'Events, surveys, and the occasional experiment.' },
      { label: 'File contents', value: 'files', hint: 'Not on offer while the project is public.', disabled: true },
    ],
  }),
};

/** What the whole set commits to, under the legend. A choice carries its own
    where one answer needs saying and the others do not. */
export const GroupHinted: Story = {
  render: () => sdsCheckboxGroup({
    legend: 'Which digests should we send?',
    name: 'digest',
    hint: 'One message per digest, on Fridays. Unsubscribe from any of them.',
    choices: [
      { label: 'Releases', value: 'releases' },
      { label: 'Security advisories', value: 'security' },
      { label: 'Documentation changes', value: 'docs' },
    ],
  }),
};

/** Where the page already asks the question — a dialog's title, a heading over
    the set — the legend is said and not drawn. It stays: an empty one leaves
    the group with no name at all, which is worse than asking twice. Here the
    heading above the set is what a reader sees. */
export const GroupQuestionAbove: Story = {
  render: () => html`<div>
    <h3 class="sds-h3">What may we attach to the report?</h3>
    ${sdsCheckboxGroup({
      legend: 'What may we attach to the report?',
      legendSaidOnly: true,
      name: 'scope',
      values: ['versions'],
      choices: [
        { label: 'Installed versions', value: 'versions' },
        { label: 'Reachable sources', value: 'sources' },
        { label: 'Degraded tools', value: 'tools', hint: 'What answered slowly or not at all.' },
      ],
    })}
  </div>`,
};

/** Mixed: the box answers for a set only some of which is ticked, and ticking
    it resolves to on. The input has no attribute for this — it is a property
    and nothing else, so a surface running no script shows an empty box. */
export const Mixed: Story = {
  args: { label: 'Attach every source in the scope', indeterminate: true },
};

/** With what ticking it commits to. A consent whose consequence is a line of
    prose somewhere else on the page is a consent nobody read. */
export const WithHint: Story = {
  args: {
    label: 'Attach the server scope to this report',
    hint: 'Sends the versions, the reachable sources and which tools are degraded. No file contents and no credentials.',
    checked: true,
  },
};

/** Required, said in words by the field above it rather than by an asterisk
    this control would have to explain. */
export const Required: Story = {
  args: { label: 'I have read what this sends', required: true },
};

/** Not available. The paint is this system's and the tab order is the
    browser's — a disabled input leaves it either way. */
export const Disabled: Story = {
  args: { label: 'Attach the installation log', hint: 'Available once an installation has been reached.', disabled: true },
};
