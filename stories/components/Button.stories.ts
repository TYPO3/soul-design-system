/* Buttons.

   The markup lives in `src/components/button.ts`; this composes the specimen
   the card is generated from. Edit the component there, the specimen here, the
   card nowhere.

   The label is content, so a story writes a button the way a surface does. The
   card cannot — `renderStatic` flattens no element given children — so it is
   composed from `buttonMarkup`, the same function the element renders. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../src/components/button.ts';
import '../../src/components/link.ts';
import { buttonMarkup, type ButtonProps, type ButtonSize, type ButtonVariant } from '../../src/components/button.ts';
import { type IconId } from '../../src/components/icon.ts';

import { dsCard, part, spec, specRow } from '../lib/specimen.ts';

interface ButtonArgs {
  variant: ButtonVariant;
  size: ButtonSize;
  label: string;
  icon?: IconId;
  title?: string;
  disabled: boolean;
}

/* The element, written the way a surface writes it. What is between the tags
   is the label, glyph included. */
const sdsButton = ({ variant, size, label, icon, title, disabled }: ButtonArgs): TemplateResult =>
  title
    ? html`<sds-button variant="${variant}" size="${size}" title="${title}" ?disabled="${disabled}">${
        icon ? html`<sds-icon name="${icon}"></sds-icon>` : ''
      }${label}</sds-button>`
    : html`<sds-button variant="${variant}" size="${size}" ?disabled="${disabled}">${
        icon ? html`<sds-icon name="${icon}"></sds-icon>` : ''
      }${label}</sds-button>`;

/* The same button as static markup, for the card. `buttonMarkup` is what the
   element renders, so the two cannot disagree. */
const staticButton = ({ variant, size, label, icon, title, disabled }: ButtonArgs) =>
  buttonMarkup(
    { variant, size, title, disabled, iconOnly: !label } as ButtonProps,
    html`${icon ? html`<sds-icon name="${icon}"></sds-icon>` : ''}${label}`,
  );

const meta: Meta<ButtonArgs> = {
  title: 'Components/Button',
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
type Story = StoryObj<ButtonArgs>;

/** One primary per view — the action that starts work. */
export const Primary: Story = { args: { variant: 'primary', size: 'md', label: 'Run the checks', icon: 'actions-play', disabled: false } };
export const Secondary: Story = { args: { variant: 'secondary', size: 'md', label: 'Copy', icon: 'actions-duplicate', disabled: false } };
export const Ghost: Story = { args: { variant: 'ghost', size: 'md', label: 'Cancel', disabled: false } };

/** Disabled is the real attribute, so the pointer, the keyboard and anything
    reading the page all agree it cannot be pressed. */
export const Disabled: Story = { args: { variant: 'secondary', size: 'md', label: 'Disabled', disabled: true } };

export const Small: Story = { args: { variant: 'primary', size: 'sm', label: 'Install', disabled: false } };
export const SmallWithIcon: Story = { args: { variant: 'secondary', size: 'sm', label: 'Update', icon: 'actions-refresh', disabled: false } };

/** Icon-only is 28×28 at `sm` and always carries `title` — nothing else names
    the control, for a pointer or for a screen reader. The square is not a
    property: a button whose whole label is one glyph is one. */
export const IconOnly: Story = { args: { variant: 'secondary', size: 'sm', label: '', icon: 'actions-close', title: 'Close', disabled: false } };

/** The label is markup, which is the reason it is content: a glyph, a word,
    and a version in mono are one label and no string can hold them. The icon
    takes the size of the text it sits in, so this reads right at both sizes
    without anyone saying a number. */
export const RichLabel: Story = {
  render: () => html`
    <sds-button variant="primary"><sds-icon name="actions-play"></sds-icon>Run the checks</sds-button>
    <sds-button variant="secondary" size="sm"><sds-icon name="actions-refresh"></sds-icon>Update <span class="sds-mono">13.4</span></sds-button>
  `,
};

const SETTINGS: ButtonArgs = { variant: 'secondary', size: 'sm', label: '', icon: 'actions-cog', title: 'Settings', disabled: false };

/** The specimen card, composed from the stories above. This is what
    `components/core/buttons.card.html` is generated from — `scripts/cards.ts`
    calls it directly, so it returns markup rather than a story. */
export const specimenHtml = (): string =>
  spec([
      specRow(
        [Primary, Secondary, Ghost, Disabled].map((s) => part(staticButton(s.args as ButtonArgs))),
        'PRIMARY · SECONDARY · GHOST · DISABLED',
      ),
      specRow(
        [
          ...[Small, SmallWithIcon, IconOnly].map((s) => part(staticButton(s.args as ButtonArgs))),
          part(staticButton(SETTINGS)),
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
