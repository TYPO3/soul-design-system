/* One entry in a list of them.

   The markup lives in `src/components/teaser.ts`. No `parameters.dsCard`: a
   teaser is judged in a grid of them — whether the titles line up, whether a
   card with an image sits beside one without — and a card is a fragment at a
   fixed size. `Pages/News` shows the grid.

   The story that matters is `Mixed`: a set where only some entries have a
   drawing is the arrangement a real list always is, and the one a component
   that assumes a drawing gets wrong. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/teaser.ts';
import { type TeaserProps } from '../../src/components/teaser.ts';

export const sdsTeaser = ({ heading, body, href, tag, meta, art, alt }: TeaserProps) =>
  html`<sds-teaser
    heading="${heading}"
    .body="${body}"
    href="${href ?? '#'}"
    tag="${tag ?? ''}"
    meta="${meta ?? ''}"
    art="${art ?? ''}"
    alt="${alt ?? ''}"
  ></sds-teaser>`;

const WITH_ART: TeaserProps = {
  tag: 'release',
  meta: '9 August 2026 · 1.4.0',
  heading: 'Answers now name the source that answered',
  body: 'Every tool declares what it may read, and the result says which of the five reached it — so a partial answer can be told from a complete one without asking twice.',
  art: '/assets/placeholders/tool-source-answer.png',
  alt: '',
};

const WITHOUT_ART: TeaserProps = {
  tag: 'project',
  meta: '2 July 2026',
  heading: 'What is written down, and what is not',
  body: 'The decisions this server keeps in the repository, the ones it keeps in the knowledge base, and why the two lists are not the same.',
};

const meta: Meta<TeaserProps> = {
  title: 'Components/Teaser',
  tags: ['autodocs', '!dev'],
  excludeStories: ['sdsTeaser'],
  render: (args) => sdsTeaser(args),
  argTypes: {
    heading: { control: 'text' },
    body: { control: 'text' },
    href: { control: 'text' },
    tag: { control: 'text' },
    meta: { control: 'text' },
    art: { control: 'text' },
    alt: { control: 'text' },
  },
  args: WITH_ART,
};

export default meta;
type Story = StoryObj<TeaserProps>;

/** With an illustration. It sits flush at the top: a framed image inside a card
    would share the card's corner, and a container must not. */
export const Default: Story = { args: WITH_ART };

/** Without one. Most entries have no drawing, and the card is not a frame with
    a hole in it — the body simply starts at the top. */
export const NoArt: Story = { args: WITHOUT_ART };

/** Only a headline and a summary. The meta row is dropped rather than left
    empty, so a set of these has no blank first line to line up. */
export const Bare: Story = {
  args: { heading: WITHOUT_ART.heading, body: WITHOUT_ART.body },
};

/** The grid, which is where a teaser is actually judged: the titles line up,
    and a card with an image sits beside one without. */
export const Mixed: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`<div class="sds-grid" style="padding:var(--space-6)">
    ${[WITH_ART, WITHOUT_ART, { ...WITHOUT_ART, tag: 'guide', meta: '18 June 2026', heading: 'Writing a task skill that fails at registration' }].map(sdsTeaser)}
  </div>`,
};
