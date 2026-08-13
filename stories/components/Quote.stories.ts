/* A sentence borrowed from somewhere.

   The markup lives in `src/components/quote.ts`. No `parameters.dsCard`: what
   a quote looks like is the type scale and a rule, both already on cards, and
   what it is *for* is only visible in a column of running text. `Pages/Article`
   shows it there.

   `Unattributed` is the story worth reading, and it is the one arrangement the
   component does not allow. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/quote.ts';
import { type QuoteProps } from '../../packages/frontend/src/components/quote.ts';

export const sdsQuote = ({ body, by, as: what, href }: QuoteProps) =>
  html`<sds-quote .body="${body}" by="${by}" as="${what ?? ''}" href="${href ?? ''}"></sds-quote>`;

const meta: Meta<QuoteProps> = {
  title: 'Components/Quote',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsQuote(args),
  argTypes: {
    body: { control: 'text' },
    by: { control: 'text' },
    as: { control: 'text' },
    href: { control: 'text' },
  },
  args: {
    body: 'A partial registry never looks complete. The source, the reason and the unread files travel with the result.',
    by: 'installation-fallback',
    as: 'diagram',
  },
};

export default meta;
type Story = StoryObj<QuoteProps>;

/** A document said it, so no monogram is drawn: the mark is initials, and a
    filename has none. The attribution is not optional either way — a quotation
    with no source is the product quoting itself for emphasis. */
export const Default: Story = {};

/** Where it can be read in full, the attribution is the link. */
export const Sourced: Story = {
  args: {
    body: 'Every source declares a precondition, so an answer is known to be reachable before the question is asked.',
    by: 'Sources and preconditions',
    as: 'documentation',
    meta: '12.4 release notes',
    href: '#',
  },
};

/** A person, where a person said it — the same byline that stands at the top
    of an article, because authorship is one thing wherever it is claimed. The
    initials are given: a quote cannot tell a name from a filename. */
export const Person: Story = {
  args: {
    body: 'The fallback was never the problem. Not saying it was a fallback was the problem.',
    by: 'Benjamin Kott',
    initials: 'BK',
    as: 'maintainer',
    meta: '24 July 2026',
  },
};

/** Long enough to be worth borrowing, short enough to read at lead size. A
    paragraph in quotation marks is a paragraph, and belongs in the column with
    the rest of them. */
export const TooLong: Story = {
  args: {
    body: 'A tool declares the sources it may answer from, the server resolves that declaration against the machine it was started on, a source it cannot reach is not offered, and the result carries the one that answered along with the releases it holds for and everything it left out.',
    by: 'the reference',
  },
};
