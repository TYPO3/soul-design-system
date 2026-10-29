/* Counts as unit squares: one square is one thing.

   The story is a registry answered three ways, the last one short of a part
   it never reads. The missing squares keep their place, so the shortfall has
   the size of what is not there. The story is `<sds-diagram>` with its text
   in `source`, which the controls edit. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type DiagramProps } from '../../packages/frontend/src/components/diagram.ts';
import { sdsDiagram } from '../lib/diagram.ts';

export const FALLBACK = `units lines=4
  head "what the machine permits"
  key "one square = one entry the registry could return"
title "A fallback answers less, and says so"
description "Each square is one entry the registry could return. The console path and the booted runtime return all of them; the package-file fallback returns every declared entry but none of the dynamically registered ones."

row "A console command exists"
  sub "Typo3Cli::run()"
  note "answeredBy: installation"
  parts 88
row "No command — boot the runtime"
  sub "Typo3Runtime::ask()"
  note "answeredBy: installation"
  parts 88
row "Failsafe mode, or unreachable"
  sub "package files, read not executed"
  note "answeredBy: packages"
  missing "dynamic registrations, never read"
  parts 68 degraded=20
`;

const meta: Meta<DiagramProps> = {
  title: 'Diagrams/Units',
  tags: ['autodocs', '!dev'],
  excludeStories: ['FALLBACK'],
  render: (args) => sdsDiagram(args),
  argTypes: { source: { control: 'text' } },
};

export default meta;
type Story = StoryObj<DiagramProps>;

/** A shortfall as dashed squares in their own place, in the warning colour
    because the answer is less, not absent. */
export const AShortfall: Story = {
  name: 'A shortfall',
  args: { source: FALLBACK },
};
