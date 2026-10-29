/* Things as cells in named groups, each with its sign.

   The story is a gap map: every need of a concept as a cell, in its group,
   with its state. One cell stands on each line of the text, its id and its
   sign. The story is `<sds-diagram>` with its text in `source`, which the
   controls edit. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type DiagramProps } from '../../packages/frontend/src/components/diagram.ts';
import { sdsDiagram } from '../lib/diagram.ts';

export const GAPS = `cells
title "Gap map"
description "The needs in seven groups, each a cell with its state: met, partly met, missing or not known."

group "Edit"
  sub "0 of 4 missing"
  F1.1 partly
  F1.2 partly
  F1.3 partly
  F1.4 partly
group "Compose"
  sub "3 of 7 missing"
  F2.1 partly
  F2.2 partly
  F2.3 yes
  F2.4 no
  F2.5 partly
  F2.6 no
  F2.7 no
group "Preview"
  sub "3 of 6 missing"
  F3.1 partly
  F3.2 partly
  F3.3 no
  F3.4 no
  F3.5 partly
  F3.6 no
group "Safe changes"
  sub "1 of 3 missing"
  F4.1 partly
  F4.2 partly
  F4.3 no
group "Rules"
  sub "1 of 4 missing"
  F5.1 yes
  F5.2 partly
  F5.3 partly
  F5.4 no
group "Integration"
  sub "3 of 6 missing"
  F6.1 partly
  F6.2 partly
  F6.3 partly
  F6.4 no
  F6.5 no
  F6.6 no
group "Quality"
  sub "0 of 4 missing"
  F7.1 partly
  F7.2 partly
  F7.3 unknown
  F7.4 unknown

legend
  yes "2 met"
  partly "19 partly met"
  no "11 missing"
  unknown "2 unknown"
`;

const meta: Meta<DiagramProps> = {
  title: 'Diagrams/Cells',
  tags: ['autodocs', '!dev'],
  excludeStories: ['GAPS'],
  render: (args) => sdsDiagram(args),
  argTypes: { source: { control: 'text' } },
};

export default meta;
type Story = StoryObj<DiagramProps>;

/** The groups stand side by side and wrap where the width ends. The eye
    counts a sign down a group before it reads a single cell. */
export const GapMap: Story = {
  name: 'Gap map',
  args: { source: GAPS },
};
