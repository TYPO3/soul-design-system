/* One glyph in a wall of them.

   The markup lives in `src/components/icon-tile.ts`. No `parameters.dsCard`:
   one tile on its own says nothing, because what it is for is only visible in
   the wall — which is what `Pages/Catalog` shows.

   The stories are the decisions a wall makes: how big the glyph is drawn,
   whether the tile goes anywhere, and what happens to an identifier too long
   for the column it landed in. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/grid.ts';
import '../../packages/frontend/src/components/icon-tile.ts';
import { type IconTileProps } from '../../packages/frontend/src/components/icon-tile.ts';

export const sdsIconTile = ({ name, caption, href, tag }: IconTileProps) =>
  html`<sds-icon-tile
    name="${name}"
    caption="${caption ?? ''}"
    href="${href ?? ''}"
    tag="${tag ?? ''}"
  ></sds-icon-tile>`;

/** The set the catalog page shows, in the order it shows them. Exported so the
    page composes these rather than keeping a copy of its own. */
export const GLYPHS: readonly IconTileProps[] = [
  { name: 'actions-document-edit', href: '#glyph' },
  { name: 'actions-document-view', href: '#glyph' },
  { name: 'actions-document-add', href: '#glyph' },
  { name: 'actions-file-pdf', href: '#glyph' },
  { name: 'actions-folder-add', href: '#glyph' },
  { name: 'actions-code-merge', href: '#glyph' },
  /* The two optional parts, in the wall rather than beside it: what a corner
     mark and a short caption cost is the row they stand in, and a tile shown
     on its own answers neither question. */
  { name: 'actions-arrow-end', href: '#glyph', tag: 'BiDi' },
  { name: 'actions-chevron-start', href: '#glyph', tag: 'BiDi' },
  { name: 'actions-history', href: '#glyph', caption: 'Version history' },
];

const meta: Meta<IconTileProps> = {
  title: 'Components/Icon tile',
  tags: ['autodocs', '!dev'],
  excludeStories: ['GLYPHS', 'sdsIconTile'],
  render: (args) => sdsIconTile(args),
  argTypes: {
    name: { control: 'text' },
    caption: { control: 'text' },
    href: { control: 'text' },
    tag: { control: 'text' },
  },
  args: GLYPHS[0] as IconTileProps,
};

export default meta;
type Story = StoryObj<IconTileProps>;

/** The glyph, and the identifier held back under it. Mono and in its own case:
    a name the reader retypes elsewhere is not a caption about the tile. */
export const Default: Story = { args: GLYPHS[0] as IconTileProps };

/** The one fact a drawing cannot show. One word — a corner is not a sentence,
    and a tile carrying two facts is a tile that has become a card. */
export const Tagged: Story = { args: GLYPHS[7] as IconTileProps };

/** Something other than the identifier under it, where the set is named for
    readers rather than for the machine. Rare: what a reader takes away from a
    wall like this is usually the string they have to type. */
export const Captioned: Story = {
  args: { name: 'actions-document-edit', caption: 'Edit record', href: '#glyph' },
};

/** Going nowhere. Still a tile: a wall that documents a set rather than
    indexing it presses nowhere, so nothing rises under the pointer and the
    keyboard is not stopped at something that does not answer. */
export const Inert: Story = { args: { name: 'actions-document-edit' } };

/** The wall, which is the only place one of these means anything. `dense` is
    the width a tile holds — the drawing and a name under it, six or seven
    across, where a card carrying a paragraph would take the room of two. */
export const Wall: Story = {
  render: () => html`<sds-grid variant="dense">${GLYPHS.map(sdsIconTile)}</sds-grid>`,
};

/** An identifier longer than the column it landed in breaks inside the word
    rather than being cut off. A name with its end missing is one the reader
    cannot use, which is the only reason it is on the tile at all. */
export const LongName: Story = {
  name: 'A name too long for its column',
  render: () =>
    html`<sds-grid variant="dense">
      ${(
        [
          { name: 'actions-save-translation-clearcache', href: '#glyph' },
          { name: 'actions-code-merge-localization', href: '#glyph' },
          { name: 'actions-document-edit-access', href: '#glyph' },
        ] as readonly IconTileProps[]
      ).map(sdsIconTile)}
    </sds-grid>`,
};
