/* Slides one after the other, at the window's size.

   The markup lives in `src/components/deck.ts`. Two ways in, one story each.
   A deck of its own stands on the page as its cover with a press that plays
   it. A deck over the page runs through the slides its sections hold, and
   that one is `Pages/Paper/Concept with slides`, where a page has them.

   No `parameters.dsCard`: what a deck does happens after a press. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/deck.ts';
import { type DeckProps } from '../../packages/frontend/src/components/deck.ts';
import { DECK } from '../lib/deck.ts';
import { coverSlide } from '../slides/Cover.stories.ts';
import { speakerSlide } from '../slides/Speaker.stories.ts';
import { speakersSlide } from '../slides/Speakers.stories.ts';
import { sectionSlide } from '../slides/Section.stories.ts';
import { statementSlide } from '../slides/Statement.stories.ts';
import { cardsSlide } from '../slides/Cards.stories.ts';
import { flowSlide } from '../slides/Flow.stories.ts';
import { codeSlide } from '../slides/Code.stories.ts';
import { tableSlide } from '../slides/Table.stories.ts';
import { numbersSlide } from '../slides/Numbers.stories.ts';
import { quoteSlide } from '../slides/Quote.stories.ts';
import { closingSlide } from '../slides/Closing.stories.ts';

/* The layouts in the order a deck runs, as the sidebar has them. The flat
   form: a slide in a column is a picture, and `fit` is for a stage. Bare:
   no slide names the product or counts itself. The deck says both once. */
const LAYOUTS = [coverSlide, speakerSlide, speakersSlide, sectionSlide, statementSlide, cardsSlide, flowSlide, codeSlide, tableSlide, numbersSlide, quoteSlide, closingSlide];

const meta: Meta<DeckProps> = {
  title: 'Components/Content/Deck',
  tags: ['autodocs', '!dev'],
  argTypes: {
    label: { control: 'text' },
  },
  args: { label: 'The system in front of a room' },
  render: ({ label }) => html`<article class="sds-prose">
    <h1>A deck on a page</h1>
    <p>
      The talk as the speaker gave it, in the text that reports on it. The page shows the cover
      and the press that plays it. The rest of the deck opens over the page, one frame at
      the window's size.
    </p>
    <sds-deck
      label="${label ?? ''}"
      brand="${DECK.brand}"
      product="${DECK.product}"
      signet="${DECK.signet}"
      signet-large="${DECK.signetLarge}"
      numbered
    >${LAYOUTS.map((one) => one({ flat: true, bare: true }))}</sds-deck>
    <p>
      The deck lends each slide the stage and puts it back. Escape returns the reader to the
      cover, where the text goes on.
    </p>
  </article>`,
};

export default meta;
type Story = StoryObj<DeckProps>;

/** A deck of its own. Press the cover. The list in the head shows every
    slide as a picture, and the arrows and the keys step through them.
    Escape hands the page back. No slide names the product or its number:
    the deck gives each one the lockup and counts it. */
export const Embedded: Story = {};
