/* Lengths on one scale.

   The stories are a state in segments against a target, and a plain
   comparison of quantities on an axis. Each story is `<sds-diagram>` with
   its text in `source`, which the controls edit. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type DiagramProps } from '../../packages/frontend/src/components/diagram.ts';
import { sdsDiagram } from '../lib/diagram.ts';

export const STATE = `bars
  max 14
  unit steps
  ticks 0,2,4,6,8,10,12,14
title "The page build passes half its steps"
description "One bar per area. Its segments are the steps that pass, pass in part and fail. The outline is all steps of the area."

row "Editing"
  target 12
  value "9 of 12"
  segments ok=9 warn=2
row "Review"
  target 8
  value "5 of 8"
  segments ok=5 warn=1
row "Integration"
  target 9
  value "2 of 9"
  segments ok=2 warn=1 error=4
  emphasis
row "Publication"
  target 5
  value "4 of 5"
  segments ok=4

legend
  ok "passes"
  warn "passes in part"
  error "fails"
`;

export const EFFORT = `bars
  max 40
  unit d
  ticks 0,10,20,30,40
title "The edit contract is the largest package"
description "Five work packages with their effort in days on one axis."

group "Foundation"
  row "Content model": 12
  row "Edit contract": 34
    emphasis
group "Features"
  row "Preview links": 16
  row "Panel": 21
  row "Migration": muted=8
    target 14
    value "8 to 14 d"
`;

const meta: Meta<DiagramProps> = {
  title: 'Diagrams/Bars',
  tags: ['autodocs', '!dev'],
  excludeStories: ['STATE', 'EFFORT'],
  render: (args) => sdsDiagram(args),
  argTypes: { source: { control: 'text' } },
};

export default meta;
type Story = StoryObj<DiagramProps>;

/** Segments in the tones of what they count, against the dashed outline
    of the target. The gap between them is the shortfall. */
export const Segments: Story = { args: { source: STATE } };

/** Quantities in groups on one axis. The emphasis fills the ink of its bar
    in the claim colour. */
export const OnAnAxis: Story = { name: 'On an axis', args: { source: EFFORT } };
