/* A setting that takes effect where it stands.

   The markup lives in `src/components/switch.ts`. The decision is when to
   reach for one: a checkbox answers a question the form asks and is sent when
   the form is sent; a switch turns something on now. A reader who has to press
   Save after flipping one has been told the wrong thing by the control.

   The track is the platform's own checkbox with the paint taken, under
   `role="switch"` — so the keyboard, the tap target and how it reads out are
   the input's. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/switch.ts';
import { type SwitchProps } from '../../packages/frontend/src/components/switch.ts';

const sdsSwitch = ({ label, hint, checked = false, name, value, disabled }: SwitchProps) =>
  html`<sds-switch
    label="${label}"
    hint="${hint ?? ''}"
    ?checked="${checked}"
    name="${name ?? ''}"
    value="${value ?? ''}"
    ?disabled="${disabled ?? false}"
  ></sds-switch>`;

const meta: Meta<SwitchProps> = {
  title: 'Forms/Switch',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsSwitch(args),
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    checked: { control: 'boolean' },
    name: { control: 'text' },
    value: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Follow the system theme', checked: true },
};

export default meta;
type Story = StoryObj<SwitchProps>;

/** On is `--text-primary`, the colour a ticked box is filled with — never the
    accent, which marks three things and a page of settings is not one. */
export const Default: Story = {};

/** Off. The knob slides rather than the track redrawing, so the two states are
    one control moving and not two pictures. */
export const Off: Story = { args: { label: 'Send me the weekly digest', checked: false } };

/** What turning it on does, where the label cannot say it in a line. */
export const Hinted: Story = {
  args: {
    label: 'Keep me signed in',
    hint: 'On this browser, for thirty days. Not on a shared machine.',
    checked: false,
  },
};

/** Unavailable is the whole row: a full-strength sentence beside a greyed
    track reads as a label that lost its control. */
export const Disabled: Story = {
  args: { label: 'Publish on save', hint: 'Available once the site has a workspace.', disabled: true },
};
