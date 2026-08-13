/* Badges.

   The markup lives in `src/components/badge.ts`. No `parameters.dsCard`, so no
   card: badges are shown on the table card, where they first appear in the
   product. A story is free to be documentation only.

   `accent` names the source of an answer and the status tones are the result of
   one. That distinction is the whole vocabulary. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/badge.ts';
import { type BadgeProps } from '../../packages/frontend/src/components/badge.ts';
import { ifDefined } from 'lit/directives/if-defined.js';

/** The set the table card shows, in the order it shows them. Exported so the
    table specimen composes the same five rather than its own copy. */
export const BADGES: readonly BadgeProps[] = [
  { label: 'readOnlyHint' },
  { label: 'bundled knowledge', tone: 'accent' },
  { label: 'answered', tone: 'ok' },
  { label: 'degraded', tone: 'warn' },
  { label: 'not booted', tone: 'error' },
];

export const sdsBadge = ({ label, tone = 'default', icon }: BadgeProps) =>
  html`<sds-badge label="${label}" tone="${tone}" icon="${ifDefined(icon)}"></sds-badge>`;

const meta: Meta<BadgeProps> = {
  title: 'Components/Badge',
  tags: ['autodocs', '!dev'],
  excludeStories: ['BADGES'],
  render: (args) => sdsBadge(args),
  argTypes: {
    label: { control: 'text' },
    tone: { control: 'inline-radio', options: ['default', 'accent', 'ok', 'warn', 'error'] },
    icon: {
      control: 'select',
      options: [undefined, 'actions-database', 'actions-book', 'actions-extension', 'actions-clock', 'actions-tag'],
    },
  },
  args: { label: 'readOnlyHint', tone: 'default' },
};

export default meta;
type Story = StoryObj<BadgeProps>;

/** No tone: a fact about the thing, carrying no judgement — a tool hint, a
    flag, a count. */
export const Default: Story = { args: { label: 'readOnlyHint', tone: 'default' } };

/** Where an answer came from. The one place a badge may carry the accent. */
export const Accent: Story = { args: { label: 'bundled knowledge', tone: 'accent' } };

/** Answered. The glyph is not decoration: colour alone would leave the
    meaning to anyone who can see the difference between three hues. */
export const Ok: Story = { args: { label: 'answered', tone: 'ok' } };

/** A degraded but usable answer — what was reached, and what that leaves out. */
export const Warn: Story = { args: { label: 'degraded', tone: 'warn' } };

/** No answer, and the reason. */
export const ErrorTone: Story = { args: { label: 'not booted', tone: 'error' } };

/** A badge may carry any icon, not only the one its tone implies. Worth it
    when the glyph adds a fact the word does not — here, that the knowledge
    came from a bundled database rather than from the installation. */
export const WithIcon: Story = {
  args: { label: 'bundled knowledge', tone: 'accent', icon: 'actions-database' },
};

/** All five together, which is how the difference is actually judged. The
    gap is the row's: a badge sets no margin, because what it sits among —
    a table cell, a heading, a line of prose — decides its spacing. */
export const Tones: Story = {
  render: () => html`<div style="display:flex; flex-wrap:wrap; gap:var(--space-2)">${BADGES.map(sdsBadge)}</div>`,
};
