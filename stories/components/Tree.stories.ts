/* A directory, as the shape it has on disk.

   The markup lives in `src/components/tree.ts`. The card is the tree a project
   is actually given — the one `docs/guides-theme/installation.rst` draws as
   preformatted text with the annotations lined up by counting spaces, which is
   the thing this replaces. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/tree.ts';
import { type TreeEntry, type TreeProps } from '../../packages/frontend/src/components/tree.ts';
import { dsCard, part, spec, specCap, DIVIDER } from '../lib/specimen.ts';

export const sdsTree = ({ entries, level, icons }: TreeProps) =>
  html`<sds-tree level="${level ?? 2}" ?icons="${icons}" .entries="${entries ?? []}"></sds-tree>`;

/** What a project renders from, and what it gets back. The notes are what a
    text tree lines up with spaces and what goes wrong the moment a name
    changes by one character. */
export const SITE: readonly TreeEntry[] = [
  {
    label: 'docs/',
    note: 'the sources, as a project already writes them',
    items: [
      { label: 'Index.rst' },
      { label: 'guides.xml', note: 'the theme, the mark and the versions' },
      { label: 'Introduction/', items: [{ label: 'Index.rst' }, { label: 'Installation.rst' }] },
      { label: '_images/', items: [{ label: 'overview.png' }] },
    ],
  },
  {
    label: 'site/',
    note: 'what the render writes, and what is published',
    items: [
      { label: 'index.html' },
      { label: '_search.json', note: 'the index the field in the bar fetches' },
      {
        label: 'styles/',
        note: 'the drop-in, copied there by the finishing step',
        items: [
          { label: 'soul-boot.js', note: 'sets the mode before the first paint' },
          { label: 'soul.css' },
          { label: 'soul.js' },
          { label: 'fonts/' },
          { label: 'assets/' },
        ],
      },
    ],
  },
  { label: '.github/workflows/publish.yml', note: 'render, finish, publish' },
];

const meta: Meta<TreeProps> = {
  title: 'Components/Tree',
  tags: ['autodocs', '!dev'],
  excludeStories: ['SITE', 'specimenHtml'],
  render: (args) => sdsTree(args),
  argTypes: {
    entries: { control: 'object' },
    level: { control: { type: 'number', min: 0, max: 6 } },
    icons: { control: 'boolean' },
  },
  args: { entries: SITE, level: 2, icons: false },
  parameters: {
    dsCard: dsCard({
      path: 'components/data/tree.card.html',
      name: 'Directory tree',
      subtitle: 'A nested list, folded — what a document draws as preformatted text with the spaces counted by hand',
      viewport: '700x602',
    }),
  },
};

export default meta;
type Story = StoryObj<TreeProps>;

/** Two levels open. Nothing is dropped below that — what is deeper is folded,
    which a reader can undo, rather than hidden, which they cannot. */
export const Default: Story = {};

/** Marked. A folder and a file glyph where the tree is long enough that the
    fold alone does not say which is which — and off by default, because a wall
    of glyphs down the left of a short tree is decoration. */
export const Marked: Story = { args: { entries: SITE, level: 3, icons: true } };

/** Shut but for the top. Everything under the first level is folded, which is
    the form a long tree takes on a page that is about something else. */
export const Folded: Story = { args: { entries: SITE, level: 1 } };

/** Open to the bottom. There is no depth this refuses to draw: a level is how
    much stands open, not how much exists. */
export const Whole: Story = { args: { entries: SITE, level: 9 } };

/* The card, as a story, so what the picture is of can be opened and pressed. */
export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};

export const specimenHtml = (): string =>
  spec([
    part(sdsTree({ entries: SITE, level: 2 })),
    specCap('A DIRECTORY IS WRITTEN WITH ITS SLASH · A FOLD IS <details> AND NEEDS NO SCRIPT', DIVIDER),
  ]);
