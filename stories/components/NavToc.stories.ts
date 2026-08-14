/* What is on this page.

   The markup lives in `src/components/nav-toc.ts`, over the contract every
   navigation in the system shares in `nav-base.ts`. The sections of the page
   being read, as a list to jump from — apparatus, so its links are drawn as
   the footer's are and never as the ones in a sentence.

   It is the one navigation that finds its own current entry: a heading is
   current because the reader has scrolled to it, which is a fact about the
   page and not about the data. `Reading` is that story — the list beside a
   page tall enough to scroll, which is the only way to see it work.

   No `parameters.dsCard`: a card is a still, and what this element does is
   move. The specimen it belongs to is the navigation card, which shows the one
   rule pills, tabs and the rail have in common. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/nav-toc.ts';
import { type MenuEntry } from '../../packages/frontend/src/components/nav-base.ts';

interface TocArgs {
  label: string;
  entries: MenuEntry[];
}

const meta: Meta<TocArgs> = {
  title: 'Components/Nav toc',
  tags: ['autodocs', '!dev'],
  render: ({ label, entries }) =>
    html`<div style="width:258px"><sds-nav-toc label="${label}" .entries="${entries}"></sds-nav-toc></div>`,
  argTypes: {
    label: { control: 'text' },
    entries: { control: 'object' },
  },
  args: {
    label: 'On this page',
    entries: [
      { label: 'Space scale', href: '#scale', current: true },
      { label: 'Reading rhythm', href: '#rhythm' },
      { label: 'Layout frame', href: '#frame' },
      { label: 'Radius, by role', href: '#radius' },
    ],
  },
};

export default meta;
type Story = StoryObj<TocArgs>;

export const Default: Story = {};

/** Two levels, which is what the column beside a page carries. A section with
    sections of its own nests, and the level below is a step quieter — the
    indent alone does not say it, a sub-entry and the second line of a wrapped
    entry starting at different places and reading as the same thing. */
export const Nested: Story = {
  args: {
    entries: [
      { label: 'Space scale', href: '#scale' },
      {
        label: 'Reading rhythm',
        href: '#rhythm',
        current: true,
        items: [
          { label: 'The measure', href: '#measure' },
          { label: 'Between blocks', href: '#blocks' },
        ],
      },
      { label: 'Layout frame', href: '#frame' },
    ],
  },
};

/* The sections the reading story is a list of, and the page they are on. Long
   enough that each one can be scrolled to on its own, which is what the
   element is reading. */
const READING = [
  { label: 'Where a token lives', anchor: 'lives' },
  { label: 'What a scale is for', anchor: 'scale-for' },
  { label: 'The grid under the gaps', anchor: 'grid' },
];

/** The list beside a page, following the reader. The entry marked is the last
    heading to have passed the line the reading rests on — the top of whatever
    is scrolling, plus the offset it keeps for anything standing over it. So
    the entry a press marks is the entry the scroll marks, and above the first
    heading nothing is marked: the page opens there and no section holds it. */
export const Reading: Story = {
  /* The text scrolls in a pane of its own, so a story on a docs page that is
     as tall as it likes still has something to scroll. It is also the case
     worth showing: the element reads the scroller its headings are in, and the
     top of the window is not the top of a pane. */
  render: ({ label }) => html`<div style="display:flex; gap:48px; height:420px">
    <div style="flex:1 1 auto; min-width:0; max-width:640px; height:100%; overflow-y:auto">
      ${READING.map(
        (section) => html`<section id="${section.anchor}" style="min-height:320px">
        <h2 class="sds-h3">${section.label}</h2>
        <p>Scroll the text, and the list beside it follows.</p>
      </section>`,
      )}
    </div>
    <div style="width:258px; flex:none">
      <sds-nav-toc
        label="${label}"
        .entries="${READING.map((section) => ({ label: section.label, href: `#${section.anchor}` }))}"
      ></sds-nav-toc>
    </div>
  </div>`,
};
