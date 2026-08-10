/* Buttons and links.

   The markup lives in `src/components/button.ts`. This file documents it and composes
   the specimen that `components/core/buttons.card.html` is generated from —
   see `scripts/cards.ts`. Edit the component there, the specimen here, and
   the card nowhere. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../src/components/button.ts';
import '../src/components/link.ts';
import { type ButtonProps } from '../src/components/button.ts';

import { dsCard, part, spec, specRow } from './lib/specimen.ts';

/** Compose the element, from a props object, so a story's `args` and the
    tag stay one thing. */
const sdsButton = ({ variant = 'primary', size = 'md', label = '', icon, title, disabled = false }: ButtonProps): TemplateResult =>
  html`<sds-button
    variant="${variant}"
    size="${size}"
    label="${label}"
    icon="${ifDefined(icon)}"
    title="${ifDefined(title)}"
    ?disabled="${disabled}"
  ></sds-button>`;

const meta: Meta<ButtonProps> = {
  title: 'Components/Buttons',
  tags: ['autodocs', '!dev'],
  /* Storybook treats every export as a story. These are the helpers the
     card generator and the sibling stories import. */
  excludeStories: ['specimenHtml'],
  render: (args) => sdsButton(args),
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    label: { control: 'text' },
    icon: { control: 'select', options: [undefined, 'actions-play', 'actions-duplicate', 'actions-refresh', 'actions-close', 'actions-cog'] },
    title: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: { variant: 'primary', size: 'md', label: 'Run the checks', disabled: false },
  parameters: {
    dsCard: dsCard({
      path: 'components/core/buttons.card.html',
      name: 'Buttons & links',
      subtitle: 'One primary per view — the action that starts work',
      viewport: '700x260',
    }),
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

/** One primary per view — the action that starts work. */
export const Primary: Story = { args: { variant: 'primary', label: 'Run the checks', icon: 'actions-play' } };
export const Secondary: Story = { args: { variant: 'secondary', label: 'Copy', icon: 'actions-duplicate' } };
export const Ghost: Story = { args: { variant: 'ghost', label: 'Cancel' } };
export const Disabled: Story = { args: { variant: 'secondary', label: 'Disabled', disabled: true } };

export const Small: Story = { args: { variant: 'primary', size: 'sm', label: 'Install' } };
export const SmallWithIcon: Story = { args: { variant: 'secondary', size: 'sm', label: 'Update', icon: 'actions-refresh' } };

/** Icon-only is 28×28 at `sm` and always carries `title` — nothing else names
    the control, for a pointer or for a screen reader. */
export const IconOnly: Story = { args: { variant: 'secondary', size: 'sm', label: '', icon: 'actions-close', title: 'Close' } };


const SETTINGS: ButtonProps = { variant: 'secondary', size: 'sm', label: '', icon: 'actions-cog', title: 'Settings' };

/** The specimen card, composed from the stories above. This is what
    `components/core/buttons.card.html` is generated from — `scripts/cards.ts`
    calls it directly, so it returns markup rather than a story. */
export const specimenHtml = (): string =>
  spec([
      specRow(
        [Primary, Secondary, Ghost, Disabled].map((s) => part(sdsButton(s.args as ButtonProps))),
        'PRIMARY · SECONDARY · GHOST · DISABLED',
      ),
      specRow(
        [
          ...[Small, SmallWithIcon, IconOnly].map((s) => part(sdsButton(s.args as ButtonProps))),
          part(sdsButton(SETTINGS)),
        ],
        'SMALL · ICON-ONLY 28×28, ALWAYS title=',
      ),
      specRow(
        [
          part(html`<sds-link label="typo3_server_scope"></sds-link>`),
          part(html`<span class="spec-hover"><sds-link label="hovered"></sds-link></span>`),
          part(html`<sds-link label="docs.typo3.org" href="https://docs.typo3.org" external></sds-link>`),
        ],
        'LINKS UNDERLINE ON HOVER · EXTERNAL CARRIES actions-window-open',
        /* The size belongs to the row, not to the component: `sds-link` sets
           colour and hover only and takes its size from whatever it sits in,
           and here it sits among 15px controls. */
        { divided: true, style: 'font-size:15px;' },
    ),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
