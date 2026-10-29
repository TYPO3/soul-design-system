/* Identifiers as chips: which of a set of things is where.

   The stories are a feature map in rows, and a roadmap in columns with its
   tasks in words over its chips. `A1` draws a filled chip, `(A1)` an
   outlined one and `~A1` a bare one. A `*` after it adds the ring and a `!` the emphasis. Each story is
   `<sds-diagram>` with its text in `source`, which the controls edit. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type DiagramProps } from '../../packages/frontend/src/components/diagram.ts';
import { sdsDiagram } from '../lib/diagram.ts';

export const MAP = `chips
title "Feature map"
description "Forty-six features in three rows by how many of the compared products have them. A filled chip is in the MVP. An outlined one is a small first version in the MVP, and a bare one comes after it."

row "Baseline"
  sub "21 features, all three"
  chips A1 A4 A5 B1 B2 B4 B5 B6 B8 ~B10
  chips C1 C2 C3 C5 D1 D2* D3* E1 I1 I2 I3
row "Common"
  sub "19 features, two or more"
  chips A2 A3 B3 B7 B9 ~B11 ~B12 ~B13 ~B15 ~C4
  chips (D4)* ~D5 (D6) ~D8 ~D9! E2* E3 E4 I4
row "Differentiator"
  sub "6 features, one or none"
  chips ~B14 (C6)* C7 ~C8 ~D7 ~I5

legend
  filled "MVP"
  outline "MVP, small first version"
  plain "after the MVP"
  ring "only with workspaces"
`;

export const ROADMAP = `chips
  direction columns
  across 2
title "Roadmap"
description "Nine sprints as columns. Each holds its tasks in words and the features it delivers as chips."

column "Sprint 1"
  sub "14 tasks|57 days"
  task "Edit contract"
  task "Preview frame"
  task "Command queue"
  chips E4
column "Sprint 2"
  sub "11 tasks|40 days"
  chips C1 D1 D2 (D6) E1 I1 I2
column "Sprint 3"
  sub "9 tasks|36 days"
  task "Shell"
  chips A2 B2 B3 B4 B7 B9 C3 C5
column "Sprint 4"
  sub "10 tasks|60 days"
  task "Panel"
  chips A5 B1 B5 B6 B8 C2 (C6) D3 (D4) E2 E3 I3
column "Sprint 5"
  sub "11 tasks|60 days"
  chips A1 A3 A4 C7
column "Sprint 6"
  sub "12 tasks|56 days"
  task "MVP accepted"
  chips ~C4 ~C8 I4 ~I5
column "Sprint 7"
  sub "6 tasks|55 days"
  chips ~D5
column "Sprint 8"
  sub "7 tasks|55 days"
  chips ~B10 ~B11 ~B12 ~B13 ~B14 ~B15 ~D7 ~D8
column "Sprint 9"
  sub "3 tasks|18 days"

legend
  filled "MVP"
  outline "MVP, small first version"
  plain "after the MVP"
`;

const meta: Meta<DiagramProps> = {
  title: 'Diagrams/Chips',
  tags: ['autodocs', '!dev'],
  excludeStories: ['MAP', 'ROADMAP'],
  render: (args) => sdsDiagram(args),
  argTypes: { source: { control: 'text' } },
};

export default meta;
type Story = StoryObj<DiagramProps>;

/** Chips in rows, each under the name of its row. A long row wraps. */
export const FeatureMap: Story = {
  name: 'Feature map',
  args: { source: MAP },
};

/** Chips in columns, with the tasks of a column in words over them. */
export const Roadmap: Story = { args: { source: ROADMAP } };
