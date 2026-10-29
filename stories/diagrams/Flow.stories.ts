/* Nodes on a grid, joined by connectors, inside boundaries.

   The layout the grammar reaches for last. The stories are a decision chain
   in two rows, a system in its boundaries, and the system in the room of a
   slide. Each has one emphasis, and the build refuses a second. Each story
   is `<sds-diagram>` with its text in `source`, which the controls edit. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type DiagramProps } from '../../packages/frontend/src/components/diagram.ts';
import { sdsDiagram } from '../lib/diagram.ts';

export const DECISION = `flow
  columns 1,1,1,1,1,1
  gap 44,48
title "Every request passes four checks"
description "Two rows of checks. The first turns a token into a session code. The second checks the code, the grant, the permission and the scope, and only the last step shows the preview."

token "Request with a token"
  at 0,0
  person
valid "Token valid?"
  at 1,0
  body "no: live page"
issue "Issue a code"
  at 2,0
  body "302 to the address with the code"
  new
code "Request with a code"
  at 0,1
  person
known "Code valid?"
  at 1,1
  body "no: live page"
grant "Grant active?"
  at 2,1
  body "no: notice, live page"
allowed "Still allowed?"
  at 3,1
  body "no: notice, live page"
scope "Page in scope?"
  at 4,1
  body "no: live page"
preview "Preview"
  at 5,1
  body "profile applied, no cache, banner"
  new
  emphasis

token -> valid
valid -> issue "yes"
issue --> code "next request"
  via v
code -> known
known -> grant "yes"
grant -> allowed "yes"
allowed -> scope "yes"
scope -> preview "yes"
`;

export const SYSTEM = `flow
  columns 1,1,1
  gap 104,40
title "One service between the backend and the frontend"
description "Two boundaries, the backend and the frontend, with a service between them. The connector from the middleware to the service is the claim."

group "backend"
  module "Editing module"
    at 0,0
    body "starts a preview"
  dialog "Share dialog"
    at 0,1
    body "issues a link"
    new
service \`PreviewService\`
  at 1,0
  body "issue, redeem, revoke"
  new
store "Grants"
  at 1,1
  body "one row per grant"
  store
group "frontend"
  middleware \`PreviewMiddleware\`
    at 2,0
    body "reads the session code"
    changed
  page "Page"
    at 2,1
    body "with hidden content"

module -> service
dialog -> service
  via h
service -> store
middleware => service "redeem"
middleware -> page
`;

export const FAN = `flow fan
  columns 1,1
  gap 120,16
title "The rules set the groups of needs"
description "Two rules on the left, each over the rows of the groups it sets. Connectors leave each rule apart and reach the groups on the right."

base "Baseline features"
  at 0,0
  rows 3
  body "21 features of the reference products"
core "Core rules"
  at 0,3
  rows 2
  body "Permissions, workspaces, languages"
f1 "F1 · Edit"
  at 1,0
f2 "F2 · Compose"
  at 1,1
f3 "F3 · Preview and orientation"
  at 1,2
f4 "F4 · Safe changes"
  at 1,3
f5 "F5 · Rules of the system"
  at 1,4

base -> f1
base -> f2
base -> f3
base -> f4
base -> f5
core -> f4
core -> f5
`;

export const NESTED = `flow fan curve
  columns 1,1,1
  gap 72,16
title "The frame stands inside the editing interface"
description "The theme files at the left go into the frame. The frame stands inside the editing interface, a boundary in a boundary. Curved connectors fan out from the theme files to the parts of the frame."

group "Theme"
  css \`theme CSS\`
    at 0,1
  js \`theme JavaScript\`
    at 0,2
group shell "Editing interface"
  bar "Bar and panel"
    at 1,0
    span 2
    strong
  group frame "Frame with the page"
    page "Rendered page"
      at 1,1
    markers "Markers"
      at 1,2
    root "Shadow root"
      at 2,1
      rows 2

css -> page
js -> page
js -> markers
`;

export const HEADS = `flow fan curve
  columns 1,1,1
  gap 80,12
title "The rules set the groups, and single needs come from the analysis"
description "Two rules at the left lead to three groups of needs. A plain note at the right names what each group adds, and a head names each column."

column 0 "Rules"
column 1 "Groups of needs"
column 2 "Additions"

base "Baseline features"
  at 0,0
  rows 2
  strong
core "Core rules"
  at 0,2
  strong
f1 "F1 · Edit"
  at 1,0
  value 4
f2 "F2 · Compose"
  at 1,1
  value 7
f3 "F3 · Rules"
  at 1,2
  value 4
a1 "+ Media (market)"
  at 2,0
  plain
a3 "+ Every site (market)"
  at 2,2
  plain

base -> f1
base -> f2
core -> f3
`;

const meta: Meta<DiagramProps> = {
  title: 'Diagrams/Flow',
  tags: ['autodocs', '!dev'],
  excludeStories: ['NESTED', 'DECISION', 'SYSTEM', 'FAN', 'HEADS'],
  render: (args) => sdsDiagram(args),
  argTypes: {
    source: { control: 'text' },
    room: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<DiagramProps>;

/** A decision chain in two rows. The dashed connector is the next request,
    which is not there yet when the first row ends. */
export const Decision: Story = { args: { source: DECISION } };

/** A system in its boundaries. The one connector that crosses from the
    frontend into the service carries the emphasis. */
export const Boundaries: Story = { args: { source: SYSTEM } };

/** A node over several rows, and `fan`: the connectors that leave one
    side of a node leave it apart, so no two share a line. */
export const Fan: Story = { name: 'Rows and a fan', args: { source: FAN } };

/** The same text in the room of a wide slide, 1640 by 560. It has no
    margin of its own, because the slide's margin is its margin. */
export const OnASlide: Story = { name: 'On a slide', args: { source: SYSTEM, room: '1640,560' } };

/** A boundary declared under another stands inside it. With `fan`,
    `curve` draws each connector across a gap as a curve from the middle of
    its source. `strong` marks a peer with an ink outline. */
export const Nested: Story = { name: 'A boundary in a boundary', args: { source: NESTED } };

/** A head over each column, and plain notes beside the boxes. */
export const Heads: Story = { name: 'Column heads and notes', args: { source: HEADS } };
