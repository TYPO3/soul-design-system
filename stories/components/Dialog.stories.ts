/* The dialog.

   `sds-modal` draws the modal surface and is what the specimen card
   documents — a card is a still picture and has nothing to open.
   `sds-dialog` is the behaviour: it uses the platform's `<dialog>`, so
   opening it makes the rest of the page inert, moves the focus in, traps it,
   and returns it on close. Escape works because the platform makes it work.

   No `parameters.dsCard`: a dialog that has to be opened cannot be a static
   specimen, which is exactly why the surface and the behaviour are two
   components. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/dialog.ts';
import '../../src/components/button.ts';
import { type DialogProps, type SdsDialog } from '../../src/components/dialog.ts';

const ACTIONS = [
  html`<sds-button variant="ghost" size="sm">Cancel</sds-button>`,
  html`<sds-button variant="primary" size="sm">Publish</sds-button>`,
];

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
    <sds-button
      variant="primary"
      @click="${(e: Event) =>
        (e.currentTarget as HTMLElement).parentElement?.querySelector<SdsDialog>('sds-dialog')?.show()}"
    >Publish…</sds-button>
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

/* No story that opens on load. A dialog that is already open when a page is
   opened is a dialog nobody asked for — it takes the focus, it makes
   everything behind it inert, and it demonstrates none of what the component
   does, which is what happens when somebody presses the button. The surface
   itself is `sds-modal`, and that has its own page. */
