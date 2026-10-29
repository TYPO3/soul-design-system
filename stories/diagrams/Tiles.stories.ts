/* Figures in a row: the value is the claim.

   The stories are a set of counts, and a set where one figure is short of
   its target. Each story is `<sds-diagram>` with its text in `source`,
   which the controls edit. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type DiagramProps } from '../../packages/frontend/src/components/diagram.ts';
import { sdsDiagram } from '../lib/diagram.ts';

export const SOURCES = `tiles
title "Where the needs come from"
description "The number of needs from each source: market 27, field test 15, core rule 9, expert review 12."

tile "27" "Market"
  body "What the compared products do."
  emphasis
tile "15" "Field test"
  body "Tasks that editors did not finish."
tile "9" "Core rule"
  body "What the core needs from any editor."
tile "12" "Expert review"
  body "What the review of the draft added."
`;

export const COVERAGE = `tiles
  claim warn
  columns 3
title "One area is short of its target"
description "Three tiles with a coverage each. Integration is at 4 of 9 and drawn in the warning colour."

tile "12" "Editing"
  unit "of 12"
  sign yes
tile "7" "Review"
  unit "of 8"
  sign partly
tile "4" "Integration"
  unit "of 9"
  sign no
  body "Five needs wait for the edit contract."
  emphasis
`;

const meta: Meta<DiagramProps> = {
  title: 'Diagrams/Tiles',
  tags: ['autodocs', '!dev'],
  excludeStories: ['SOURCES', 'COVERAGE'],
  render: (args) => sdsDiagram(args),
  argTypes: { source: { control: 'text' } },
};

export default meta;
type Story = StoryObj<DiagramProps>;

/** Counts side by side, the value largest. One tile carries the emphasis. */
export const Counts: Story = { args: { source: SOURCES } };

/** A figure with what it is out of, and a sign. The drawing is about a
    shortfall, so the claim is in the warning colour. */
export const Shortfall: Story = { args: { source: COVERAGE } };
