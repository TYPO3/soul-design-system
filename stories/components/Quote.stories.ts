/* A sentence borrowed from somewhere.

   The markup lives in `src/components/quote.ts`. No `parameters.dsCard`: what
   a quote looks like is the type scale and a rule, both already on cards, and
   what it is *for* is only visible in a column of running text. `Pages/Article`
   shows it there.

   `Unattributed` is the story worth reading, and it is the one arrangement the
   component does not allow. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/quote.ts';
import { type QuoteProps } from '../../src/components/quote.ts';

const sdsQuote = ({ body, by, role, href }: QuoteProps) =>
  html`<sds-quote .body="${body}" by="${by}" role="${role ?? ''}" href="${href ?? ''}"></sds-quote>`;

const meta: Meta<QuoteProps> = {
  title: 'Components/Quote',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsQuote(args),
  argTypes: {
    body: { control: 'text' },
    by: { control: 'text' },
    role: { control: 'text' },
    href: { control: 'text' },
  },
  args: {
    body: 'A partial registry never looks complete. The source, the reason and the unread files travel with the result.',
    by: 'installation-fallback',
    role: 'diagram',
  },
};

export default meta;
type Story = StoryObj<QuoteProps>;

/** With what it is attributed to. The attribution is not optional: a
    quotation with no source in a product's own writing is the product quoting
    itself for emphasis. */
export const Default: Story = {};

/** Where it can be read in full, the attribution is the link. */
export const Sourced: Story = {
  args: {
    body: 'Every source declares a precondition, so an answer is known to be reachable before the question is asked.',
    by: 'Sources and preconditions',
    role: 'documentation',
    href: '#',
  },
};

/** A person, where a person said it. */
export const Person: Story = {
  args: {
    body: 'The fallback was never the problem. Not saying it was a fallback was the problem.',
    by: 'Benjamin Kott',
    role: 'maintainer',
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
