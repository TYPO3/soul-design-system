/* Layouts in one drawing: a sketch beside its notes, a matrix over cards.

   Each part is a layout of its own, and the drawing keeps one emphasis
   across all of them. Each story is `<sds-diagram>` with its text in
   `source`, which the controls edit. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type DiagramProps } from '../../packages/frontend/src/components/diagram.ts';
import { sdsDiagram } from '../lib/diagram.ts';

export const PRINCIPLES = `compose
title "Design principles in the editing interface"
description "A sketch of the editing interface with nine numbered places, and the principle each place shows."

part
  weight 1.4
  sketch
    height 400
  screen
    column
      region "BAR"
        size 46
        surface sunken
        flow row
        text "Unsaved changes" marker=4
        button "Discard" marker=5
        button "Changes 3 ↗" strong marker=9
      row
        region "NAVIGATION"
          size 110
          surface sunken
          tree lines=6 marker=8
        region "PAGE"
          surface raised
          tools count=3 marker=7
          field lines=2 focus cursor marker=2
          image lines=2 marker=3
          lock "News list, edit in the panel" marker=6
        region "PANEL"
          size 160
          surface sunken
          tabs "Content,Layout" marker=1
          lines lines=1
          field
          lines lines=1
          field
part
  notes
  note 1 "Content before layout"
    body "The panel opens on content. Layout needs an explicit step."
  note 2 "Change with one click"
    body "A click on a text starts the change, with no mode switch."
  note 3 "Same result on every element"
    body "Each action does the same on every element type."
  note 4 "Visible state"
    body "The selection and the save state always show."
  note 5 "Clear publication"
    body "Nothing goes live without a clear action."
  note 6 "Reason for a locked area"
    body "A locked area says why and opens its fields in the panel."
  note 7 "Controls for the selection only"
    body "Controls show on the selected element only."
  note 8 "Terms of the backend"
    body "Terms, icons and dialogs are the same as in the backend."
  note 9 "Access for every user"
    body "Keyboard, screen reader and touch reach each action."
`;

export const FIELDTEST = `compose
  direction column
title "Field test of WordPress and Drupal Canvas"
description "The steps of one page build that each product supports, in full, in part or not at all. Under them, the four shortfalls."

part
  label "Support of the 21 steps of the page build"
  matrix
    figures
  column "supported" sign=yes
  column "partly supported" sign=partly
  column "not supported" sign=no
  row "WordPress 7.1": "10" "10" "1"
  row "Drupal Canvas 1.10.1": "9" "10" "2"
part
  label "Shortfalls"
  columns
  column "Field rules"
    id P10
    body "No message for an overlong headline"
    item "WordPress" sign=no
    item "Drupal Canvas" sign=no
  column "Grids"
    id P11
    body "A smaller column count deletes content"
    item "WordPress" sign=no
  column "Review"
    id P20
    body "No preview link that opens without a login"
    item "WordPress" sign=no
    item "Drupal Canvas" sign=no
  column "Conflicts"
    body "Only an experimental module shows other users"
    item "Drupal Canvas" sign=partly
`;

export const VERDICT = `compose
  direction column
title "State of the extension"
description "The baseline features in groups, each with its verdict in a status colour. Under them, the levels stand as a staircase. Both parts name the same signs, so the legend stands once, under the last."

part
  label "Baseline features"
  cells
    group "Edit"
      sub "large gap"
      tone warn
      A1 yes
      A4 partly
    group "Rules"
      sub "good base"
      tone ok
      E1 yes
    group "Integration"
      sub "architecture change"
      tone error
      I1 no
  legend yes="complete" partly="partly" no="missing"
part
  label "Levels"
  columns rise
  column "L0"
    sub "Preview"
    item "core" sign=yes
  column "L1"
    sub "Locate"
    item "core" sign=partly
  column "L2"
    sub "Edit in place"
    item "core" sign=no
  key "complete" sign=yes
  key "partly" sign=partly
  key "missing" sign=no
`;

const meta: Meta<DiagramProps> = {
  title: 'Diagrams/Compose',
  tags: ['autodocs', '!dev'],
  excludeStories: ['VERDICT', 'PRINCIPLES', 'FIELDTEST'],
  render: (args) => sdsDiagram(args),
  argTypes: { source: { control: 'text' } },
};

export default meta;
type Story = StoryObj<DiagramProps>;

/** A sketch with its controls and numbered markers, beside the notes the
    markers point at. */
export const SketchAndNotes: Story = {
  name: 'A sketch and its notes',
  args: { source: PRINCIPLES },
};

/** Figures over cards: a matrix that holds figures, and the shortfalls
    under it as columns. */
export const FiguresOverCards: Story = {
  name: 'Figures over cards',
  args: { source: FIELDTEST },
};

/** A verdict under a group of cells in its status colour, and one legend
    for parts that name the same signs. */
export const Verdict: Story = { name: 'Verdicts and one legend', args: { source: VERDICT } };
