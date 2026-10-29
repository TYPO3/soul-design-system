/* Rows against columns, a sign in each cell.

   The stories are a comparison with row groups and an emphasised column,
   and a register with text in its cells. A third compares places.
   Each story is `<sds-diagram>` with its text in `source`, which the
   controls edit. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type DiagramProps } from '../../packages/frontend/src/components/diagram.ts';
import { sdsDiagram } from '../lib/diagram.ts';

export const PLACES = `matrix
title "Where a product lets an editor change a page"
description "A matrix of six products against five editing places, with signs for yes, in part, no and not known."

column "In the page"
  group Content
column "In a panel"
  group Content
column "Settings"
  group Page
column "Layout"
  group Page
column "Navigation"
  group Site
emphasis column="In the page"

group "Open source"
  row "Product A" sub=v7.1: yes yes partly yes no
  row "Product B" sub=v1.10: yes partly no yes no
  row "Product C" sub=v9.2: yes yes yes partly partly
group "Commercial"
  row "Product D": yes yes yes yes unknown
  row "Product E": partly yes yes no yes
  row "Product F": yes no unknown yes no
`;

export const PLAN = `matrix
title "Every package lands in one sprint"
description "Five work packages against four sprints. A dot marks the sprint that delivers a package, a ring the sprint that prepares it."

column "Sprint 1"
column "Sprint 2"
column "Sprint 3"
column "Sprint 4"
emphasis row="WP3 Preview links"

row "WP1 Content model": dot - - -
row "WP2 Edit contract": ring dot - -
row "WP3 Preview links": - ring dot -
row "WP4 Panel": - - dot="8 d" -
row "WP5 Migration": - - ring \`v14.2\`

legend
  dot "delivered"
  ring "prepared"
`;

export const EDITING = `matrix
  row-groups beside
title "Editing places"
description "Thirteen products in five groups against nine editing places. A sign says where a product lets an editor make a change."

column "text"
column "format text"
column "media"
column "settings"
column "add"
column "move"
column "structure list"
  split
column "viewport"
column "undo"

group "Open source CMS"
  row "WordPress":            page  page  both  both  both  both  yes yes yes
  row "Drupal Canvas":        panel panel panel panel both  both  yes yes yes
  row "Neos 9.1":             page  page  panel panel form  both  yes yes partly^1
group "Site builders"
  row "Elementor":            both  both  panel panel both  both  yes yes yes
  row "Squarespace":          page  page  both  panel page  page  no  yes yes
group "Commerce"
  row "Shopware":             both  both  form  form  both  both  yes yes no
  row "Shopify":              panel panel panel panel both  both  yes yes yes
group "Enterprise DXP"
  row "Sitecore Pages":       both  both  panel panel both  both  yes yes yes
  row "AEM Universal Editor": page  both  panel panel both  both  yes yes yes
group "Headless CMS"
  row "Storyblok":            panel panel panel panel panel panel yes yes no
  row "Sanity":               panel panel panel panel both  page  no  yes partly^2
  row "Contentful Studio":    panel panel panel panel page  panel yes yes no

legend
  yes "available"
  partly "partly"
  no "not available"
note "Undo covers the text of the element in place, not its settings."
note "Undo covers a document, not the page around it."
`;

export const TRACE = `matrix
title "Each need reaches the features that meet it"
description "Three needs against two parts of the plan. A cell holds the feature ids, and a text in a cell wraps."

column "Version 1"
column "Later"
column "Why"
row "Edit text in place": chip="A1,A2,A3" chip="A4" "The most frequent task of an editor"
row "Compose the page": chip="B1,B2,B5,B6,B7" - "Needs the drop rules of each area"
row "Preview each viewport": chip="C1" chip="C2,C3" -
`;

export const PATHS = `matrix
title "Each task is a short click path"
description "Three tasks, each with its click path as steps joined by an arrow, and the needs it checks. The first two tasks are the foundation and carry the emphasis together."

column "Click path" weight=3
column "Needs" split
emphasis row="Change a headline"
emphasis row="Replace an image"

row "Change a headline": path="Click the text › Type › Click outside" \`F1.1, F4.2\`
row "Replace an image": path="Click the image › Pick a file › Check the crop" \`F1.2, F3.3\`
row "Discard the changes": path="Click Discard › Confirm" \`F4.1\`
`;

const meta: Meta<DiagramProps> = {
  title: 'Diagrams/Matrix',
  tags: ['autodocs', '!dev'],
  excludeStories: ['PATHS', 'PLACES', 'PLAN', 'EDITING', 'TRACE'],
  render: (args) => sdsDiagram(args),
  argTypes: { source: { control: 'text' } },
};

export default meta;
type Story = StoryObj<DiagramProps>;

/** Products against places, in groups. A column of the same sign reads
    before a single cell does. One column carries the emphasis. */
export const Comparison: Story = { args: { source: PLACES } };

/** A register: a dot delivers, a ring prepares, and a cell can carry text.
    One row carries the emphasis. */
export const Register: Story = { args: { source: PLAN } };

/** Signs of a place in an interface and row groups beside their rows. A
    rule stands before a second set of columns, and a cell points at a note. */
export const Places: Story = {
  name: 'Places, with notes',
  args: { source: EDITING },
};

/** Identifiers in a cell, onto a second line where the column ends, and a
    text that wraps. The row is as high as its fullest cell. */
export const Trace: Story = {
  name: 'Identifiers in a cell',
  args: { source: TRACE },
};

/** A click path in a cell, its steps joined by ›, in a column with a
    larger weight. Rows that touch and share the emphasis share one frame. */
export const Paths: Story = { name: 'Click paths', args: { source: PATHS } };
