/* A value the reader takes away.

   The markup lives in `src/components/copy.ts`. What this shows that a
   screenshot cannot is the pair. Four of them down a column, each with the
   name of what it copies. So somebody who cannot see which line each one is
   on can still tell the buttons apart. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/copy.ts';
import { type CopyProps } from '../../packages/frontend/src/components/copy.ts';

export const sdsCopy = ({ value, label, ellipsis }: CopyProps) =>
  html`<sds-copy value="${value}" label="${label ?? ''}" ellipsis="${ellipsis ?? 'none'}"></sds-copy>`;

/** Long enough for a cut in a column of ordinary width. */
const WORKTREE = '~/projects/blog/.worktrees/14-3-dev';

/** What a page hands over: the four values that reach a checkout. */
export const ACCESS: readonly CopyProps[] = [
  { label: 'Directory', value: WORKTREE },
  { label: 'Database', value: 'companion_14_3_dev' },
  { label: 'Backend user', value: 'admin' },
  { label: 'Backend password', value: 'a-development-password' },
];

const meta: Meta<CopyProps> = {
  title: 'Components/Actions/Copy',
  tags: ['autodocs', '!dev'],
  excludeStories: ['ACCESS'],
  render: (args) => sdsCopy(args),
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    ellipsis: { control: 'inline-radio', options: ['none', 'start', 'end'] },
  },
  args: { label: 'Directory', value: WORKTREE, ellipsis: 'none' },
};

export default meta;
type Story = StoryObj<CopyProps>;

/** One value. Press it: the glyph becomes a check for a moment, and a reader
    who cannot see that hears it in words. */
export const Default: Story = {};

/** In the shape it is actually used in — a definition list, the term standing
    over what it names. `label` is what tells the four buttons apart. */
export const InAList: Story = {
  render: () => html`<dl class="sds-facts">
    ${ACCESS.map((one) => html`<dt>${one.label}</dt><dd>${sdsCopy(one)}</dd>`)}
  </dl>`,
};

/** A column too narrow for what stands in it. Wrapped, cut at the front, cut
    at the back — the same value three times, so the comparison is which end
    stays. The front is a path's answer: what a reader looks for is the name
    it ends on. Nothing goes either way; the press writes the whole value and
    the pointer shows it. */
export const Cut: Story = {
  render: () => html`<div style="max-width:240px">
    <dl class="sds-facts">
      ${([undefined, 'start', 'end'] as const).map((side) => html`
        <dt>${side ?? 'wrapped'}</dt>
        <dd>${sdsCopy({ label: 'Directory', value: WORKTREE, ellipsis: side })}</dd>`)}
    </dl>
  </div>`,
};

/** A value with no name. The button then says only that it copies, which is
    true and names nothing. So it is the form for the page that has exactly
    one. */
export const Unnamed: Story = {
  args: { label: '', value: 'companion_14_3_dev' },
};
