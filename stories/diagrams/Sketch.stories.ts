/* Screens as nested regions: where a thing stands in an interface.

   The stories are three shells side by side, and one interface with the
   numbered places a text explains. The last is a page grid with the items
   in each place. Each story is `<sds-diagram>` with its
   text in `source`, which the controls edit. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type DiagramProps } from '../../packages/frontend/src/components/diagram.ts';
import { sdsDiagram } from '../lib/diagram.ts';

export const SHELLS = `sketch
  height 280
title "Three shells, one place for the page"
description "Three screen sketches: a panel on the right, a panel on the left, and a bar on top only."

screen "Panel on the right"
  caption "Settings beside the element."
  column
    region "toolbar"
      size 30
      surface raised
    row
      region "page" lines=6 surface=raised
      region "panel" lines=4 size=90
screen "Panel on the left"
  caption "The structure before the page."
  column
    region "toolbar"
      size 30
      surface raised
    row
      region "tree" lines=5 size=90
      region "page" lines=6 surface=raised
screen "Bar on top"
  caption "No panel. The page takes it all."
  column
    region "toolbar"
      size 30
      surface raised
    region "page" lines=8 surface=raised
      emphasis
`;

export const INTERFACE = `sketch
  height 360
title "Where each principle shows"
description "A sketch of the editing interface with four numbered places: the bar, the tree, the page and the panel. The panel is not there yet."

screen
  column
    region "docheader"
      size 34
      surface raised
      marker 1
    row
      region "tree" lines=8
        size 160
        marker 2
      region "page" lines=14
        surface raised
        marker 3
      region "panel"
        size 220
        marker 4
        absent
`;

export const GRID = `sketch
  height 250
title "Features by place"
description "The page grid of an editing interface. The toolbar holds C3 viewport switch and D1 save state. The left column holds B1 structure list, with a count of 10 of 12 products. The page holds A1 text with a live preview, which is the emphasis. It also holds B4 insert at a position, B6 drag and drop and C1 outline on hover. The panel holds A4 element fields, with a count of 5 of 12. The band under the surface holds D3 drafts and E1 permissions."

screen
  column
    region
      size 44
      surface raised
      across 2
      chip "C3" "Viewport switch"
      chip "D1" "Save state"
    row
      region "LEFT COLUMN"
        size 240
        surface raised
        chip "B1" "Structure list"
        dots "Products" value=10 of=12
      region "PAGE"
        surface sunken
        across 2
        chip "A1" "Text, live preview" emphasis
        chip "B4" "Insert at a position"
        chip "B6" "Drag and drop"
        chip "C1" "Outline on hover"
      region "PANEL"
        size 240
        surface raised
        chip "A4" "Element fields"
        dots "Products" value=5 of=12
  band "UNDER THE SURFACE"
    chip "D3" "Drafts"
    chip "E1" "Permissions"
`;

export const PEERS = `sketch
  height 200
title "Text changes in the page"
description "A shell with the bar, the structure, the page and the panel. The selected text, the bar button and the note under the page are places of one claim. They carry the emphasis together. A filled item marks the one feature that the claim rests on."

screen
  column
    region "viewports"
      size 34
      surface raised
      flow row
      button "Preview" emphasis
    row
      region
        size 96
        text "Structure" strong
      region "Page"
        surface raised
        field lines=2 focus emphasis
        hint "type in place" emphasis
      region "Panel"
        size 160
        chip "A1" "Text" emphasis fill
        chip "A4" "Fields"
`;

const meta: Meta<DiagramProps> = {
  title: 'Diagrams/Sketch',
  tags: ['autodocs', '!dev'],
  excludeStories: ['PEERS', 'SHELLS', 'INTERFACE', 'GRID'],
  render: (args) => sdsDiagram(args),
  argTypes: { source: { control: 'text' } },
};

export default meta;
type Story = StoryObj<DiagramProps>;

/** Three screens side by side, each a tree of regions. Text is a
    placeholder bar, because the claim is the place and not the words. */
export const Shells: Story = { args: { source: SHELLS } };

/** One screen with numbered markers that a text beside it explains. A
    region that is not there yet has a dashed outline. */
export const Places: Story = { args: { source: INTERFACE } };

/** The page grid of an interface: a toolbar, then the left column, the
    page and the panel. A dashed band holds what lies out of sight. Each
    place holds boxed items, two across in the page, and a count in dots. */
export const Grid: Story = { args: { source: GRID } };

/** Places of one claim: a region, a field, a button and a hint can share
    the emphasis. */
export const Peers: Story = { name: 'Places of one claim', args: { source: PEERS } };
