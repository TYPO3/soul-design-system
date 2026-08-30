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
  html`<sds-button variant="ghost">Cancel</sds-button>`,
  html`<sds-button variant="primary">Publish</sds-button>`,
];

/* The way out first, the press that cannot be undone last, and the label says
   what goes rather than "OK": a reader who cannot tell the tones apart still
   reads the consequence off the button. */
const DESTRUCTIVE = [
  html`<sds-button variant="ghost">Cancel</sds-button>`,
  html`<sds-button variant="danger">Delete 3 pages</sds-button>`,
];

/* The button opens the dialog written after it. The sibling rather than the
   first one in the parent, because the sizes story puts four pairs in one
   row. */
const opens = (e: Event): void => {
  const next = (e.currentTarget as HTMLElement).nextElementSibling;
  if (next?.tagName.toLowerCase() === 'sds-dialog') (next as SdsDialog).show();
};

/* What the page heard, written where a reader of the story can see it. A page
   would act on the answer instead; this is the wiring made visible. */
const said = (event: Event): void => {
  const heard = (event.currentTarget as HTMLElement).nextElementSibling;
  if (heard) heard.textContent = `heard ${event.type}`;
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

/** A confirmation with no script behind it: a button that names the dialog,
    a label for the press that answers, and the two events a page listens for.
    The pair is a `<form method="dialog">` — the platform closes the dialog and
    says which button did it, so `sds-dialog-confirm` and `sds-dialog-cancel`
    are the whole contract. */
export const Confirm: Story = {
  render: () => html`
    <sds-button for="confirm-remove" variant="secondary">Remove the token…</sds-button>
    <sds-dialog
      id="confirm-remove"
      heading="Remove this token?"
      body="Anything using it stops answering immediately. Nothing puts it back."
      confirm-label="Remove"
      confirm-icon="actions-delete"
      cancel-label="Keep it"
      tone="danger"
      @sds-dialog-confirm="${said}"
      @sds-dialog-cancel="${said}"
    ></sds-dialog>
    <p class="sds-mono">nothing heard yet</p>
  `,
};

/* No story that opens on load. A dialog that is already open when a page is
   opened is a dialog nobody asked for — it takes the focus, it makes
   everything behind it inert, and it demonstrates none of what the component
   does, which is what happens when somebody presses the button. The surface
   itself is `sds-modal`, and that has its own page. */
