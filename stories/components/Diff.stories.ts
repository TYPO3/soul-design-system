/* A file's changes.

   The markup lives in `src/components/diff.ts`. With the code block it shares
   the one permission the rest of the system does not have: status colour may
   fill a whole line, at 14%, so a changed line reads as changed without
   becoming the loudest thing on the surface. No line numbers unless something
   references them. No `parameters.dsCard`: it is drawn on the code card. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/diff.ts';
import { type DiffLine, type DiffProps } from '../../src/components/diff.ts';

/** The change the code card shows. Exported so the card composes this one
    rather than keeping a second copy of it. */
export const DIFF: readonly DiffLine[] = [
  { kind: 'context', text: '"domains": ["labels", "xlf"],' },
  { kind: 'del', text: '"versions": ["12.4"]' },
  { kind: 'add', text: '"versions": ["12.4", "13.4", "14.3"]' },
  { kind: 'context', text: '}' },
];

const meta: Meta<DiffProps> = {
  title: 'Components/Diff',
  tags: ['autodocs', '!dev'],
  excludeStories: ['DIFF'],
  render: ({ path, body }) => html`<sds-diff path="${path}" .body="${body}"></sds-diff>`,
  argTypes: {
    path: { control: 'text' },
    body: { control: 'object' },
  },
  args: { path: 'KNOWLEDGE/HINTS/LABELS.JSON', body: DIFF },
};

export default meta;
type Story = StoryObj<DiffProps>;

/** The head names the file, so it sets in mono like every path in this
    system. */
export const Default: Story = {};
