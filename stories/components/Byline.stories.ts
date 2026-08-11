/* Who wrote it, and when.

   The markup lives in `src/components/byline.ts`. No `parameters.dsCard`: it
   is one line, and the thing worth documenting about it is the order — who,
   what they are to the subject, when — which a picture cannot show. A page
   that puts the date first has published a date.

   The mark is initials and never a photograph: a face is a file to fetch, keep
   in step and licence, and none of that is what a byline is for. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/byline.ts';
import { type BylineProps } from '../../src/components/byline.ts';
import { NNBSP } from '../lib/specimen.ts';

const sdsByline = ({ name, role, meta, initials }: BylineProps) =>
  html`<sds-byline name="${name}" role="${role ?? ''}" meta="${meta ?? ''}" initials="${initials ?? ''}"></sds-byline>`;

const meta: Meta<BylineProps> = {
  title: 'Components/Byline',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsByline(args),
  argTypes: {
    name: { control: 'text' },
    role: { control: 'text' },
    meta: { control: 'text' },
    initials: { control: 'text' },
  },
  args: { name: 'Benjamin Kott', role: 'maintainer', meta: `24 July 2026 · 6${NNBSP}min` },
};

export default meta;
type Story = StoryObj<BylineProps>;

/** All three parts, in the order that makes it a byline. */
export const Default: Story = {};

/** Without a role, where the name says it. */
export const NameOnly: Story = { args: { name: 'Benjamin Kott', meta: '24 July 2026' } };

/** A team rather than a person. The initials come from the name either way —
    first letter of the first and last word, two at most, because three in a
    28px circle is a monogram nobody can read. */
export const Team: Story = { args: { name: 'Core Team', role: 'maintainers', meta: '12 May 2026' } };

/** Given rather than derived, where the name is one word or the initials are
    something the reader already knows. */
export const Explicit: Story = {
  args: { name: 'Dev Companion', initials: 'DC', role: 'release note', meta: '9 August 2026 · 1.4.0' },
};
