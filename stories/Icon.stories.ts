/* Icons.

   The markup lives in `src/components/icon.ts`. No `parameters.dsCard`: the
   set and its rules are documented in Guidelines → Icons, on the two cards
   that already exist for them. This page is the component — what a caller
   passes and what comes back.

   The SVG is inlined rather than linked because an `<img>` cannot inherit
   `currentColor`, and the whole icon rule is that colour follows the UI.
   Every other component imports the template, not the element: the specimen
   cards are opened without JavaScript, where an unupgraded `<sds-icon>`
   would be an empty box. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../src/components/icon.ts';
import { iconIds, type IconId, type IconSize } from '../src/components/icon.ts';

interface IconArgs {
  name: IconId;
  size?: IconSize;
  className?: string;
  title?: string;
}

const sdsIcon = ({ name, size = 16, className, title }: IconArgs) =>
  html`<sds-icon name="${name}" size="${size}" class="${className ?? 'sds-icon'}" label="${title ?? ''}"></sds-icon>`;

const meta: Meta<IconArgs> = {
  title: 'Components/Icon',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsIcon(args),
  argTypes: {
    name: { control: 'select', options: iconIds },
    size: { control: 'inline-radio', options: [16, 20, 24] },
    className: { control: 'text' },
    title: { control: 'text' },
  },
  args: { name: 'actions-search', size: 16, className: 'sds-icon' },
};

export default meta;
type Story = StoryObj<IconArgs>;

/** 16px is the floor. Below it, no icon at all. */
export const Default: Story = { args: { name: 'actions-search', size: 16 } };

/** 16, 20, 24 or a whole multiple — never 18 or 22. */
export const Sizes: Story = {
  render: () => html`${([16, 20, 24] as const).map((size) => sdsIcon({ name: 'actions-cog', size }))}`,
};

/** `sds-icon--muted` drops it to `--text-muted`; the colour otherwise follows
    whatever text the icon sits in. */
export const Muted: Story = {
  args: { name: 'actions-info-circle', className: 'sds-icon sds-icon--muted' },
};

/** An icon with a `title` is announced and stands alone. Only four may:
    answered, version-bound, not bootable, and a stated boundary. Everything
    else sits beside its own label and is hidden from assistive tech rather
    than read out twice. */
export const Labelled: Story = {
  args: { name: 'actions-check-circle', title: 'answered' },
};

/** The whole set this system ships — 33 identifiers, the core's own. */
export const TheSet: Story = {
  render: () => html`<div style="display:flex; flex-wrap:wrap; gap:14px;">
    ${iconIds.map((id) => sdsIcon({ name: id, size: 24 }))}
  </div>`,
};
