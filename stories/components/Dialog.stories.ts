/* The dialog.

   `sds-modal` draws the surface and is what the card documents, a card being a
   still picture with nothing to open. `sds-dialog` is the behaviour, on the
   platform's `<dialog>`: the page goes inert, the focus moves in and comes
   back, and Escape works because the platform makes it work. No
   `parameters.dsCard`, which is why the two are two components. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/dialog.ts';
import '../../packages/frontend/src/components/button.ts';
import { type DialogProps, type SdsDialog } from '../../packages/frontend/src/components/dialog.ts';

const ACTIONS = [
  html`<sds-button variant="ghost" size="sm">Cancel</sds-button>`,
  html`<sds-button variant="primary" size="sm">Publish</sds-button>`,
];

/* The way out first, the press that cannot be undone last, and the label says
   what goes rather than "OK": a reader who cannot tell the tones apart still
   reads the consequence off the button. */
const DESTRUCTIVE = [
  html`<sds-button variant="ghost" size="sm">Cancel</sds-button>`,
  html`<sds-button variant="danger" size="sm">Delete 3 pages</sds-button>`,
];

/* The button beside the dialog opens the one under it. Written once because
   both stories are the same gesture. */
const opens = (e: Event): void =>
  (e.currentTarget as HTMLElement).parentElement?.querySelector<SdsDialog>('sds-dialog')?.show() ?? undefined;

const meta: Meta<DialogProps> = {
  title: 'Components/Dialog',
  tags: ['autodocs', '!dev'],
  argTypes: {
    heading: { control: 'text' },
    width: { control: { type: 'number', step: 10 } },
  },
  args: {
    heading: 'Publish the task skills?',
    width: 330,
  },
  render: ({ heading, width }) => html`
    <sds-button variant="primary" @click="${opens}">Publish…</sds-button>
    <sds-dialog
      heading="${heading}"
      width="${width ?? 330}"
      .body="${html`This writes into <span class="sds-mono">.agents/skills</span> and records the setup. Nothing else is touched.`}"
      .actions="${ACTIONS}"
    ></sds-dialog>
  `,
};

export default meta;
type Story = StoryObj<DialogProps>;

/** Click the button: the page behind goes inert, the focus moves in, and
    Escape closes it — none of which is written here. */
export const Default: Story = {};

/** The surface the danger button belongs to. The dialog carries the weight:
    the question names what goes and the body says what that costs, so the
    colour marks the press without having to explain it. A confirmation that
    only turns a button red has told the reader nothing they can act on. */
export const Destructive: Story = {
  args: { heading: 'Delete the Documentation section?', width: 360 },
  render: ({ heading, width }) => html`
    <sds-button variant="secondary" @click="${opens}">Delete…</sds-button>
    <sds-dialog
      heading="${heading}"
      width="${width ?? 360}"
      .body="${html`Three pages and everything published under them go. Nothing puts them back.`}"
      .actions="${DESTRUCTIVE}"
    ></sds-dialog>
  `,
};

/* No story that opens on load. A dialog that is already open when a page is
   opened is a dialog nobody asked for — it takes the focus, it makes
   everything behind it inert, and it demonstrates none of what the component
   does, which is what happens when somebody presses the button. The surface
   itself is `sds-modal`, and that has its own page. */
