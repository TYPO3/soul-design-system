/* Columns of items: the parts of a whole, side by side.

   The stories are the parts of a document and the states of a part. The
   others draw cases of an interface with its controls. Each story is
   `<sds-diagram>` with its text in `source`, which the controls edit. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type DiagramProps } from '../../packages/frontend/src/components/diagram.ts';
import { sdsDiagram } from '../lib/diagram.ts';

export const PARTS = `columns
title "Five parts, one chain"
description "Five columns: requirements, current state, target, delivery and appendix, each with the identifiers it holds."

column "Requirements"
  eyebrow "Part 1"
  item "Functional needs" id=F1
  item "Design principles" id=D1
  item "Technical needs" id=T1
column "Current state"
  eyebrow "Part 2"
  item "The gap per need" id=G1
  item "The market" id=M1
column "Target"
  eyebrow "Part 3"
  emphasis
  item "Architecture" id=A1
  item "Edit contract" id=C1
  item "Interface" id=U1
column "Delivery"
  eyebrow "Part 4"
  item "Work packages" id=WP1
  item "Sprints" id=S1
column "Appendix"
  eyebrow "Part 5"
  absent
  item "Feature descriptions" absent
`;

export const STATES = `columns
title "What an editor sees on an element"
description "Three columns of states: idle, editing and blocked. One item is not there yet."

column "Idle"
  body "The page as a visitor sees it."
  item "Hover shows the outline" sign=yes
  item "A press selects it" sign=yes
column "Editing"
  body "One element at a time."
  item "Text in place" sign=yes
  item "Media in the panel" sign=partly
  item "Undo across elements" sign=no absent
column "Blocked"
  body "Somebody else has it."
  item "The name of the other editor" sign=yes
  item "When it is free again" sign=unknown
`;

export const CASES = `columns
title "Text changes in the page"
description "Three cases: plain text with its rules, rich text, and what happens after the change. Each shows the controls and the feature ids it needs."

column "Plain text with its rules"
  sub "header · required · 80 characters"
  place page
  label "Click in the header" chip=A1
  field "Summer offers" large cursor focus tag="Hero" lines=2
  hint "Required" right="13 / 80 characters"
  label "Empty header"
  field placeholder="Add a heading" cursor focus
  text "! This field must not be empty." strong
  text "The editing interface does not save it."
  rule
  text "The editing interface validates each change first. It does not save an invalid value."
column "Rich text"
  sub "bodytext · preset default"
  place page
  label "¶ ▾ B I Link ⋯" chip=A2
  field "Three routes lead to the coast. The coastal path is the shortest and the easiest." cursor focus tag="Text"
  text "The editing interface keeps the change of the header. Pasted text keeps only the formats of the preset."
  rule
  text "Tab moves to the next field of the element. Rich text gets the format bar of its preset."
column "After the change"
  sub "check · command · save · render"
  place page
  label "In place" chip=A1
  field "Summer offers for families" large focus
  step "Escape, and the values are valid"
  code "change · header · tt_content:42"
  step "DataHandler checks again, saves" chip=D1
  label "Rendered at its marker"
  page "Summer offers for families"
  rule
  text "Only a valid change goes to the save. The core validates it again before the save."

key "Feature id" chip=ID
key "Place in the editing interface, here the page" sign=page
`;

export const VIEWPORTS = `columns
title "Viewport switch with the core presets"
description "Three cases of the viewport switch in the bar: a desktop preset and a phone preset. The third preset is wider than the screen and shows scaled."

column "Desktop"
  sub "preset of the core · 1280 px"
  place bar
  devices "Desktop · 1280 px" active=desktop chip=C3
  site "Summer shop" nav="Home · Offers" heading="Summer offers" cards=3
  rule
  text "The frame takes the width of the preset. The selection stays after the switch."
column "Phone"
  sub "preset of the core · 390 px"
  place bar
  devices "Phone · 390 px" active=phone chip=C3
  site "Summer shop" heading="Summer offers" cards=2 width=0.6 selected cursor
  rule
  text "The page stays editable in each viewport. The theme shows its layout for phones."
column "Scaled"
  sub "preset wider than the screen"
  place bar
  devices "1920 px · 62 %" active=desktop chip=C3
  text "The screen is narrower than the preset."
  site "Summer shop" nav="Home · Offers" heading="Summer offers" cards=4 selected
  rule
  text "A wider preset shows scaled. The bar names the width and the scale."

key "Feature id" chip=ID
key "Place in the editing interface, here the bar" sign=bar
`;

export const CONTROLS = `columns
title "Save state in the bar"
description "Three cases. The bar of a workspace shows its states. A save error has a message and a retry, and a question comes before a save to the live page. The structure list has a selection, and keys move an element."

column "Workspace"
  sub "auto-save · three states"
  place bar
  row
    text "● Saved" strong
    button "Discard" small
    button "Changes 3 ↗" small
    chip "D1" push
  row
    button "○ Unsaved · 2" strong small
    text "An editor types. The count names the open changes."
  row
    button "● Saved" strong small
    text "The core saved each change in the workspace."
  toolbar "¶ ▾,|,B,I,|,Link,⋯" active=1 chip=A2
column "Save error"
  sub "not saved · retry in the message"
  place bar
  frame "The change did not reach the server." tone=error
    row
      text "The connection failed. The text stays in the page."
      button "Retry" ink small
  frame "Save to the live page?" close strong chip=D3
    text "Visitors see this change at once."
    row
      button "Cancel" small push
      button "Save live" ink small
column "Structure"
  sub "one selection · keys move"
  place nav
  strong
  tabs "Pages,Structure,Library" active=1 switch
  list handle
    row "Text"
    row "▾ Teaser cards" selected chip=B1,B6
    row "  Card · Summer"
    row "  Card · Winter" muted
    row "Holiday notice" muted right="24.12.–26.12."
    row "Legal note" absent mark=warn
  row
    keycap "Ctrl"
    keycap "↑"
    keycap "↓"
    text "one position"
    chip "B5" push
  field "Banner, position 2 of 4" slim

key "Feature id" chip=ID
key "Place in the editing interface, here the bar" sign=bar
key "Here the navigation" sign=nav
`;

export const MARKS = `columns
title "A hidden banner, an empty place and the steps of a contract"
description "Three cases. The hatch marks a hidden banner, and a pill at the right of its head names the state. The menu of the selected element stands over it. A dashed outline marks an empty place, and a drag shows a preview. A block of code holds a contract map. A line joins the numbers of its steps, and a phone renders the result. Each case needs a workspace."

column "Hidden element"
  sub "element menu · state"
  place page
  badge "Needs a workspace"
  row
    toolbar "Banner,⠿,◌ Hide,✕" active=2 ink
    chip "B9" push
  frame hidden strong
    row
      tag "Banner"
      pill "◌ Hidden" push
    image lines=0
  text "Visitors see the banner ~~today~~ after the __next__ publication."
  arrow "the switch in the bar"
  row
    list weight=2
      row "Hero"
      row "Banner" muted right="◌ Hidden"
    frame weight=1
      text "Show"
column "Empty place"
  sub "drop line · preview"
  place any
  frame "Column 1" strong
    field "Text" slim
    field "▞ Teaser" absent slim
  frame "Column 2" absent
    text "No drop target for a teaser." tone=muted
  progress value=0.6
column "Contract"
  sub "edit map · steps"
  place docheader
  code
    line "{"
    line "  \\"id\\": \\"tt_content:42\\","
    line "  \\"fields\\": [\\"header\\"]"
    line "}"
  list steps
    row "The frontend marks its fields."
    row "The shell changes the text." selected
    row "The core sends the new map."
  frame width=0.6 strong
    text "Summer offers" strong
    lines lines=2

key "Feature id" chip=ID
key "Place in the editing interface, filled for each case" sign=any
key "The case works only in a workspace." badge="Needs a workspace"
key "A state of the element" pill="Hidden"
`;

export const PICTURES = `columns
title "Pictures, tables and lines between controls"
description "Three cases. A file selection shows thumbnails and a crop frame with its handles. A support report sets its rows in columns. A field changes in place, and a tooltip in ink explains a read-only field. Two saves join one header. A menu opens over the rows of a page, with a drop line and a switch."

column "Media"
  sub "files · crop"
  row
    thumb "beach.jpg"
    thumb "coast.jpg" selected
    thumb "prices.pdf" absent
  row
    thumb "50 | 50" split=50,50 selected
    thumb "33 | 66" split=33,66
  crop
  map "Harbour"
column "Fields"
  sub "in place · read-only"
  field "Summer offers" large cursor inplace
  field "Book your **summer trip** now." marker=1 corner
    line "More on the __route page__."
  field "12 May 2026" slim ring
  frame ink
    text "TCA sets the field read-only."
  field "Summer shop" slim dim right="Home · Offers"
  list columns=1,1.6,1.6
    row "Type | In place | In the panel" head
    row "teaser | header, text | image"
    row "slider | – | all fields" marker=2
column "Saves"
  sub "two saves · one header"
  row
    frame "Anna" id=anna
      text "Summer deals"
    frame "You" strong id=you
      text "Summer offers" strong
  text " "
  frame strong width=0.7 id=header pointer
    text "Summer offers" large
  join anna header dashed
  join you header
  toggle "Show hidden" on
  list handle
    row "Text"
  drop "Teaser, here" id=line
  frame strong
    text "Teaser" strong
  frame strong over width=0.7
    list
      row "Move up" right="Ctrl+↑"
      row "Move down" selected right="Ctrl+↓"
  list rendered
    row "Text"
    row "Banner" absent id=banner
  join banner line arrow right
`;

export const STAIRS = `columns rise
title "Each level includes the levels before it"
description "Five levels as a staircase, each a step higher than the one before. The levels of visual editing carry the emphasis together. Each names its step in the colour of the claim."

column "Preview"
  id L0
  sub "Viewport"
  page "Result"
column "Locate"
  eyebrow "Visual editing"
  emphasis
  id L1
  sub "Structure list"
  tree lines=3
column "Edit in place"
  eyebrow "Visual editing"
  emphasis
  id L2
  sub "Text · Media"
  field lines=2 focus cursor
column "Compose"
  eyebrow "Visual editing"
  emphasis
  id L3
  sub "Add · Move"
  button "+"
column "Layout"
  eyebrow "Visual editing"
  emphasis
  id L4
  sub "Grids"
  tabs "50 : 50,33 : 67" active=0
`;

const meta: Meta<DiagramProps> = {
  title: 'Diagrams/Columns',
  tags: ['autodocs', '!dev'],
  excludeStories: ['STAIRS', 'PARTS', 'STATES', 'CASES', 'VIEWPORTS', 'CONTROLS', 'MARKS', 'PICTURES'],
  render: (args) => sdsDiagram(args),
  argTypes: { source: { control: 'text' } },
};

export default meta;
type Story = StoryObj<DiagramProps>;

/** The parts of a whole, with the identifiers each holds. A part with no
    item yet has a dashed outline: its shortfall has the size of a column. */
export const Parts: Story = { args: { source: PARTS } };

/** Items with signs, and one item that is not there yet. */
export const States: Story = { args: { source: STATES } };

/** Cases of an interface with its controls. That is a field with its
    cursor and tag, a hint, a step, a line of code and the page it renders. */
export const Cases: Story = {
  name: 'Cases of an interface',
  args: { source: CASES },
};

/** Cases with a viewport switch and a small site, narrow on a phone. */
export const Viewports: Story = {
  name: 'Cases with a site',
  args: { source: VIEWPORTS },
};

/** Controls side by side in a row, and a dialog and a message in a frame.
    Then a list with its levels, a switch, key caps and several ids. */
export const Controls: Story = {
  name: 'Cases with rows, frames and lists',
  args: { source: CONTROLS },
};

/** A hidden part hatched, with its state in a pill and its name in a tag.
    An empty place in a dashed outline and a block of code. Steps joined by
    a line, a badge on a column, and a row that divides by weight. */
export const Marks: Story = {
  name: 'Cases with states and marks',
  args: { source: MARKS },
};

/** Thumbnails, a crop frame and a map. Then a field in place, a run in
    bold, a double ring, a tooltip in ink and a table in a list. Then lines
    between controls, a menu over the page, a drop line and a switch. */
export const Pictures: Story = {
  name: 'Cases with pictures, tables and joins',
  args: { source: PICTURES },
};

/** The steps of one argument: a figure in each column, and an arrow from
    each column to the next. */
export const Chain: Story = {
  args: {
    source: `columns chain
title "From the market to the decisions"
description "Four steps of an argument, each with one figure and one finding, joined by arrows."

column eyebrow="Market" value="12" body="products compared" foot="Part B"
  item "Three products share the baseline."
column eyebrow="Needs" value="34" body="functional requirements" foot="Part B"
  item "From the baseline and the core rules."
column eyebrow="Gap" value="2 of 34" body="needs met today" foot="Part C"
  item "A base for text, not the baseline."
column eyebrow="Decide" value="2" body="open decisions" foot="Part E"
  item "Each with a recommendation."
`,
  },
};

/** The parts of a document, lettered, with the part that sets the measure
    in a strong outline. */
export const Lettered: Story = {
  args: {
    source: `columns chain
title "Each part answers one question"
description "Three lettered parts in a chain, each with its question and its result. The second part sets the measure."

column "Context" letter="A"
  body "Why this paper?"
  label "RESULT"
  text "The goal and the people who decide"
column "Requirements" letter="B" strong
  body "What must it be?"
  label "RESULT"
  text "The needs and the technical requirements"
column "Current state" letter="C"
  body "Where does it stand?"
  label "RESULT"
  text "A base for text changes"
`,
  },
};

/** `rise`: each column starts a step higher than the one before. Peers of
    one kind share the emphasis, and in a staircase each says its eyebrow
    in the colour of the claim. */
export const Staircase: Story = { args: { source: STAIRS } };
