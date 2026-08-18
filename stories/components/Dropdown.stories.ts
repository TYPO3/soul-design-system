/* A button, and the short list it opens under itself.

   The markup lives in `src/components/dropdown.ts`. What is in the list decides
   what the list is: entries with a target are pages and become links a reader
   Tabs through, entries without are commands and become a menu the arrows
   walk. Announcing menu commands over a list of pages is a promise the panel
   cannot keep, so the element asks the entries rather than the caller. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/dropdown.ts';
import { type DropdownChoice } from '../../packages/frontend/src/components/dropdown.ts';
import { buttonClass, buttonLabel } from '../../packages/frontend/src/components/button.ts';

import { dsCard, part, spec, specRow } from '../lib/specimen.ts';

const meta: Meta = {
  title: 'Components/Dropdown',
  tags: ['autodocs', '!dev'],
  parameters: {
    dsCard: dsCard({
      path: 'components/core/dropdown.card.html',
      name: 'Dropdown',
      subtitle: 'A button, and the short list it opens under itself',
      viewport: '700x523',
    }),
  },
};

export default meta;
type Story = StoryObj;

const LANGUAGES: DropdownChoice[] = [
  { label: 'English', href: '/en/', lang: 'en', current: true },
  { label: 'Deutsch', href: '/de/', lang: 'de' },
  { label: 'Français', href: '/fr/', lang: 'fr' },
  { label: '日本語', href: '/ja/', lang: 'ja' },
];

const ACTIONS: DropdownChoice[] = [
  { label: 'Duplicate', icon: 'actions-duplicate' },
  { label: 'Rename', icon: 'actions-rename' },
  { label: 'Move to trash', icon: 'actions-delete', disabled: true },
];

/** Entries that carry a target. A disclosure holding links: Tab walks them,
    every row is a real anchor with the browser's own middle-click and status
    line, and a page that never listens for the event still works. */
export const Pages: Story = {
  render: () => html`<sds-dropdown label="Language" .choices="${LANGUAGES}"></sds-dropdown>`,
};

/** Entries that carry none. A menu of commands: the arrows walk the rows, Home
    and End reach the ends, and Escape puts the reader back on the button they
    pressed. Nothing here navigates — each row reports itself and the page
    decides. */
export const Commands: Story = {
  render: () => html`<sds-dropdown label="Edit" variant="secondary" .choices="${ACTIONS}"></sds-dropdown>`,
};

/** The name a reader hears, where the label is too short to say what the
    control is. It is said in front of the label rather than instead of it: an
    accessible name that drops the visible word leaves a control nobody can ask
    for by the name they can see. */
export const ShortLabel: Story = {
  render: () => html`<sds-dropdown name="Language" label="en" .choices="${LANGUAGES}"></sds-dropdown>`,
};

/** Hung from the end, for the button that sits in a corner — which is where a
    bar puts one. A list that always opened to the start would run off the
    page. */
export const FromTheEnd: Story = {
  render: () => html`<div style="display:flex;justify-content:flex-end">
  <sds-dropdown align="end" label="Language" .choices="${LANGUAGES}"></sds-dropdown>
</div>`,
};

/** The trigger is a real button of this system, so it takes the variants and
    sizes every other one does. */
export const Variants: Story = {
  render: () => html`<div style="display:flex;gap:1rem;align-items:center">
  <sds-dropdown variant="primary" label="Primary" .choices="${ACTIONS}"></sds-dropdown>
  <sds-dropdown variant="secondary" label="Secondary" .choices="${ACTIONS}"></sds-dropdown>
  <sds-dropdown variant="ghost" label="Ghost" .choices="${ACTIONS}"></sds-dropdown>
  <sds-dropdown size="sm" label="Small" .choices="${ACTIONS}"></sds-dropdown>
</div>`,
};

/** The glyph alone, which then requires the name — nothing else says what the
    control is. */
export const IconOnly: Story = {
  render: () => html`<sds-dropdown icon-only icon="actions-menu" name="Actions" .choices="${ACTIONS}"></sds-dropdown>`,
};

/* The box the element draws around both halves, and the reason every part
   below stands in one: the set is declared on it, and a property travels down
   and never sideways — a button or a panel outside it reads none of the set
   and comes out as unpadded text. */
const box = (inside: TemplateResult) => html`<div class="sds-dropdown">
  ${inside}
</div>`;

/* The trigger as static markup: the same class list the element draws, from
   the same function, so the card and the component cannot disagree. */
const button = (label: string, variant: 'primary' | 'secondary' | 'ghost', open = false) => html`<button
    type="button"
    class="${buttonClass({ variant })} sds-dropdown__button"
    aria-expanded="${open ? 'true' : 'false'}"
  >${buttonLabel(label)}<span class="sds-dropdown__marker"><sds-icon name="actions-chevron-down"></sds-icon></span></button>`;

/* The panel without the attribute that makes it a popover — which is a list in
   the flow, and the one state a card can hold. A specimen runs no script, and
   nothing static can open a popover. */
const list = (entries: readonly DropdownChoice[]) => html`<div class="sds-dropdown__panel">
    ${entries.map((entry) => html`<a
      class="${entry.current ? 'sds-dropdown__item is-active' : 'sds-dropdown__item'}"
      href="#"
      aria-current="${entry.current ? 'true' : undefined}"
      aria-disabled="${entry.disabled ? 'true' : undefined}"
    >${entry.icon ? html`<sds-icon name="${entry.icon}"></sds-icon>` : ''}${entry.label}</a>`)}
  </div>`;

const trigger = (label: string, variant: 'primary' | 'secondary' | 'ghost', open = false) =>
  part(box(button(label, variant, open)));

const panel = (entries: readonly DropdownChoice[]) => part(box(list(entries)));

/* The whole control, which is the one thing a reader came to see: the button
   pressed and its list standing under it. */
const opened = (label: string, entries: readonly DropdownChoice[]) =>
  part(box(html`${button(label, 'secondary', true)}${list(entries)}`));

/** The specimen card, composed from the stories above. This is what
    `components/core/dropdown.card.html` is generated from. */
export const specimenHtml = (): string =>
  spec([
    specRow(
      [trigger('Language', 'secondary'), trigger('Edit', 'primary'), trigger('View', 'ghost')],
      'SHUT · THE MARKER SAYS IT OPENS SOMETHING RATHER THAN ACTS',
    ),
    specRow([opened('Language', LANGUAGES)], 'OPEN · THE LIST UNDER ITS BUTTON, THE ONE IN FORCE MARKED', {
      divided: true,
    }),
    specRow([panel(ACTIONS)], 'COMMANDS · A GLYPH WHERE THE ENTRY ASKED FOR ONE, AND ONE UNAVAILABLE', { divided: true }),
  ]);

/** The card, as Storybook shows it. The same string the generator ships, so a
    difference between the two would have to be a difference in this file. */
export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
