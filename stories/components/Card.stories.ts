/* A way into something — a chapter, a product, a news entry, a page.

   The markup lives in `src/components/card.ts`. No `parameters.dsCard`: a card
   is judged in a set of them, at the width a document gives it, and a card file
   is a fragment at a fixed size. The set is `Grid.stories.ts` — a grid of
   two is not a grid of six, and that is a decision the grid makes, not the
   card. The acceptance render is where one meets a real page.

   The story that matters is `Written`: out of a document the body is blocks,
   not a sentence, and an element that assumes a sentence loses the list under
   it. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../../packages/frontend/src/components/card.ts';
import '../../packages/frontend/src/components/grid.ts';
import { type CardProps } from '../../packages/frontend/src/components/card.ts';

export const sdsCard = ({ heading, body, href, src, alt, label, tag, icon, footer, action }: CardProps) =>
  html`<sds-card
    heading="${heading}"
    .body="${body}"
    href="${href ?? '#'}"
    src="${src ?? ''}"
    alt="${alt ?? ''}"
    label="${label ?? ''}"
    tag="${tag ?? ''}"
    icon="${ifDefined(icon)}"
    footer="${footer ?? ''}"
    action="${action ?? ''}"
  ></sds-card>`;

const CHAPTER: CardProps = {
  heading: 'Installation',
  body: 'What the package needs, what it writes, and the three commands that render a project with it. Written for somebody who has a repository and no renderer yet.',
};

const WITH_FOOT: CardProps = {
  heading: 'Directives',
  body: 'The markup this theme adds to reStructuredText: the bands a landing page is built out of, the grid, and the cards in it.',
  footer: 'Reference',
  action: 'Read it',
};

const PROMOTIONAL: CardProps = {
  label: 'Package',
  heading: 'Render your manual with it',
  body: 'One Composer package, three commands, and a documentation site set with this system — the same components the product surface is built from.',
  src: '/assets/placeholders/tool-registration.png',
  alt: '',
  action: 'Start here',
};

/* One entry in a list of them: what kind it is, when it is from, and the two
   lines that decide whether it is opened. The same component turned down. */
const ENTRY: CardProps = {
  tag: 'release',
  label: '9 August 2026 · 1.4.0',
  heading: 'Answers now name the source that answered',
  body: 'Every tool declares what it may read, and the result says which of the five reached it — so a partial answer can be told from a complete one without asking twice.',
  src: '/assets/placeholders/tool-source-answer.png',
  alt: '',
};

const ENTRY_NO_ART: CardProps = {
  tag: 'project',
  label: '2 July 2026',
  heading: 'What is written down, and what is not',
  body: 'The decisions this server keeps in the repository, the ones it keeps in the knowledge base, and why the two lists are not the same.',
};

const meta: Meta<CardProps> = {
  title: 'Components/Card',
  tags: ['autodocs', '!dev'],
  excludeStories: ['sdsCard'],
  render: (args) => sdsCard(args),
  argTypes: {
    heading: { control: 'text' },
    body: { control: 'text' },
    href: { control: 'text' },
    src: { control: 'text' },
    alt: { control: 'text' },
    label: { control: 'text' },
    tag: { control: 'text' },
    icon: {
      control: 'select',
      options: [undefined, 'actions-book', 'actions-database', 'actions-extension', 'actions-tag'],
    },
    footer: { control: 'text' },
    action: { control: 'text' },
  },
  args: CHAPTER,
};

export default meta;
type Story = StoryObj<CardProps>;

/** A title that goes somewhere and the prose that says what is behind it. */
export const Default: Story = { args: CHAPTER };

/** With a foot: a line about the target on one side and, on the other, the
    words that say what pressing the card does. It sits at the bottom of the
    frame however long the prose ran, so a row of cards lines its feet up. */
export const WithFoot: Story = { args: WITH_FOOT };

/** The promotional register — a glyph, the row over the title, a picture and
    a call to action. Everything here is a property; a marketing card is the
    same component turned up, not a second one. */
export const Promotional: Story = { args: { ...PROMOTIONAL, icon: 'actions-extension' } };

/** Where there is nowhere to go, the title is a title, the card is not a
    target and the action is not drawn: nothing here would answer a press. */
export const NoTarget: Story = { args: { ...WITH_FOOT, href: '' } };

/** One entry in a list of them — a release, an article, a note. The badge says
    what kind and the label when, on the one line over the title; below that it
    is the card it already was. */
export const Entry: Story = { args: ENTRY };

/** The set is where an entry is actually judged: the titles line up, and a card
    with a picture sits beside one without. A list where only some entries have
    a drawing is the arrangement a real one always is, and the one a component
    that assumes a drawing gets wrong. */
export const Entries: Story = {
  render: () => html`<sds-grid>
    ${[ENTRY, ENTRY_NO_ART, { ...ENTRY_NO_ART, tag: 'guide', label: '18 June 2026', heading: 'Writing a task skill that fails at registration' }].map(sdsCard)}
  </sds-grid>`,
};

/** What a renderer hands it: paragraphs and a list, written between the tags
    because no attribute holds a block. The property form stays a sentence. */
export const Written: Story = {
  render: () => html`<sds-card heading="What a page owes" href="#" footer="Three things" action="The rule"
    ><p>A page that has these renders in this theme with nothing written into a
    stylesheet of its own:</p>
    <ul>
      <li>a title, which is the link,</li>
      <li>the blocks under it,</li>
      <li>and where it goes.</li>
    </ul></sds-card
  >`,
};


