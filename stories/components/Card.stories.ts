/* A way into something — a chapter, a product, a page.

   The markup lives in `src/components/card.ts`. No `parameters.dsCard`, for the
   reason `Teaser.stories.ts` states: a card is judged in a set of them, at the
   width a document gives it, and a card file is a fragment at a fixed size.
   The set is `CardGrid.stories.ts` — a grid of two is not a grid of six, and
   that is a decision the grid makes, not the card. The acceptance render is
   where one meets a real page.

   The story that matters is `Written`: out of a document the body is blocks,
   not a sentence, and an element that assumes a sentence loses the list under
   it. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../../packages/frontend/src/components/card.ts';
import { type CardProps } from '../../packages/frontend/src/components/card.ts';

export const sdsCard = ({ heading, body, href, src, alt, label, icon, footer, action }: CardProps) =>
  html`<sds-card
    heading="${heading}"
    .body="${body}"
    href="${href ?? '#'}"
    src="${src ?? ''}"
    alt="${alt ?? ''}"
    label="${label ?? ''}"
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


