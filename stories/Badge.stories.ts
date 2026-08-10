/* Badges.

   The markup lives in `src/components/badge.ts`. This file has no
   `parameters.dsCard`, so it generates no specimen card: badges are shown on
   the table card, which is where they first appear in the product, and a
   second card of five chips would document nothing the first does not.
   `scripts/cards.ts` skips any story file that declares no card, so a story
   is free to be documentation only.

   `accent` names the source of an answer; the status tones are the result of
   one. That distinction is the whole vocabulary — a badge says either where
   something came from or how it went. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../src/components/badge.ts';
import { type BadgeProps } from '../src/components/badge.ts';
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

const sdsBadge = ({ label, tone = 'default', icon }: BadgeProps) =>
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

/** All five together, which is how the difference is actually judged. */
export const Tones: Story = {
  render: () => html`${BADGES.map(sdsBadge)}`,
};
