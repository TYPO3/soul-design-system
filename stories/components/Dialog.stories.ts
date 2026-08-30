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

/* The button opens the dialog written after it. The sibling rather than the
   first one in the parent, because the sizes story puts four pairs in one
   row. */
const opens = (e: Event): void => {
  const next = (e.currentTarget as HTMLElement).nextElementSibling;
  if (next?.tagName.toLowerCase() === 'sds-dialog') (next as SdsDialog).show();
};

const meta: Meta<DialogProps> = {
  title: 'Components/Dialog',
  tags: ['autodocs', '!dev'],
  argTypes: {
    heading: { control: 'text' },
    size: { control: 'inline-radio', options: ['auto', 'sm', 'md', 'lg'] },
    width: { control: { type: 'number', step: 10 } },
  },
  args: {
    heading: 'Publish the task skills?',
    size: 'sm',
    width: 0,
  },
  render: ({ heading, size, width }) => html`
    <sds-button variant="primary" @click="${opens}">Publish…</sds-button>
    <sds-dialog
      heading="${heading}"
      size="${size ?? 'sm'}"
      width="${width ?? 0}"
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
  args: { heading: 'Delete the Documentation section?' },
  render: ({ heading, size, width }) => html`
    <sds-button variant="secondary" @click="${opens}">Delete…</sds-button>
    <sds-dialog
      heading="${heading}"
      size="${size ?? 'sm'}"
      width="${width ?? 0}"
      .body="${html`Three pages and everything published under them go. Nothing puts them back.`}"
      .actions="${DESTRUCTIVE}"
    ></sds-dialog>
  `,
};

/** The scale, one button each: `sds-modal--sm` is a question, `sds-modal--md`
    is the reading measure, `sds-modal--lg` is past it for what is operated
    rather than read, and `auto` is whatever the content asks for. Each stops at
    a height of its own, after which the body is what scrolls. */
export const Sizes: Story = {
  render: () => html`<div style="display:flex; flex-wrap:wrap; gap:var(--space-2)">
    ${(['auto', 'sm', 'md', 'lg'] as const).map(
      (size) => html`
        <sds-button variant="secondary" @click="${opens}">${size}</sds-button>
        <sds-dialog
          heading="A dialog at ${size}"
          size="${size}"
          .body="${html`Every size is a width it takes and a height it stops at. Past that height the head and the foot stay where they are and this part scrolls.`}"
          .actions="${ACTIONS}"
        ></sds-dialog>
      `,
    )}
  </div>`,
};

/* No story that opens on load. A dialog that is already open when a page is
   opened is a dialog nobody asked for — it takes the focus, it makes
   everything behind it inert, and it demonstrates none of what the component
   does, which is what happens when somebody presses the button. The surface
   itself is `sds-modal`, and that has its own page. */
