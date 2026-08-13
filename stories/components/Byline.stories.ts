/* Who wrote it, and when.

   The markup lives in `src/components/byline.ts`. No `parameters.dsCard`: it
   is one line, and the thing worth documenting about it is the order — who,
   what they are to the subject, when — which a picture cannot show. A page
   that puts the date first has published a date.

   The mark is initials and never a photograph: a face is a file to fetch, keep
   in step and licence, and none of that is what a byline is for. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/byline.ts';
import { type BylineProps } from '../../packages/frontend/src/components/byline.ts';
import { NNBSP } from '../lib/specimen.ts';

const sdsByline = ({ name, as: what, meta, initials, href, unmarked }: BylineProps) =>
  html`<sds-byline
    name="${name}"
    as="${what ?? ''}"
    meta="${meta ?? ''}"
    initials="${initials ?? ''}"
    href="${href ?? ''}"
    ?unmarked="${unmarked ?? false}"
  ></sds-byline>`;

const meta: Meta<BylineProps> = {
  title: 'Components/Byline',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsByline(args),
  argTypes: {
    name: { control: 'text' },
    as: { control: 'text' },
    meta: { control: 'text' },
    initials: { control: 'text' },
    href: { control: 'text' },
    unmarked: { control: 'boolean' },
  },
  args: { name: 'Benjamin Kott', as: 'maintainer', meta: `24 July 2026 · 6${NNBSP}min` },
};

export default meta;
type Story = StoryObj<BylineProps>;

/** All three parts, in the order that makes it a byline. */
export const Default: Story = {};

/** Without a role, where the name says it. */
export const NameOnly: Story = { args: { name: 'Benjamin Kott', meta: '24 July 2026' } };

/** A team rather than a person. The initials come from the name either way —
    first letter of the first and last word, two at most, because three in a
    32px circle is a monogram nobody can read. */
export const Team: Story = { args: { name: 'Core Team', as: 'maintainers', meta: '12 May 2026' } };

/** Given rather than derived, where the name is one word or the initials are
    something the reader already knows. */
export const Explicit: Story = {
  args: { name: 'Dev Companion', initials: 'DC', as: 'release note', meta: '9 August 2026 · 1.4.0' },
};

/** Where the name leads somewhere — a profile, or the source it is attributed
    to. The link is on the name and nothing else: a date is not a destination. */
export const Linked: Story = { args: { href: '#' } };

/** Not a person, so no monogram. `sds-quote` stands its attribution this way
    for a document: initials derived from a filename are a person invented for
    a source that has none. */
export const Unmarked: Story = {
  args: { name: 'The 12.4 release notes', as: 'changelog', meta: '12.4.0', unmarked: true },
};
