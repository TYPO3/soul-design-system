/* The block that puts the question.

   The markup lives in `src/components/decision.ts`. A concept ends on a
   decision somebody else makes. The question, the answers it can take with
   the one the paper recommends, who decides and by when. The answers go
   between the tags as elements. The card comes from `Specimen` below. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/decision.ts';
import { type Answer, type DecisionProps } from '../../packages/frontend/src/components/decision.ts';
import { dsCard, part, spec, specCap } from '../lib/specimen.ts';

/** One answer, written out: the letter and the name on the element, what it
    means between the tags. */
export const sdsAnswer = ({ key, heading, body, recommended, decided }: Answer) =>
  html`<sds-answer key="${key}" heading="${heading}" ?recommended="${Boolean(recommended)}" ?decided="${Boolean(decided)}">${body ?? ''}</sds-answer>`;

/** The question as a page writes it: the answers as elements between the
    tags. The source panel under a story shows them, which is what a reader
    came to copy. */
export const sdsDecision = ({ question, answers, by, due, label, lead }: DecisionProps) =>
  html`<sds-decision question="${question}" by="${by ?? ''}" due="${due ?? ''}" label="${label ?? ''}" lead="${lead ?? ''}">
  ${(answers ?? []).map((one) => sdsAnswer(one))}
</sds-decision>`;

/** The other way in: the block gets its answers and writes them itself. It
    is also the only form a card can take. A static render cannot see an
    element with content between its tags. */
export const sdsDecisionFlat = ({ question, answers, by, due, label, lead }: DecisionProps) =>
  html`<sds-decision question="${question}" .answers="${answers ?? []}" by="${by ?? ''}" due="${due ?? ''}" label="${label ?? ''}" lead="${lead ?? ''}"></sds-decision>`;

/** The answers a concept paper offers. Exported so the concept page composes
    these rather than a second copy. */
export const ANSWERS: readonly Answer[] = [
  { key: 'A', heading: 'The record on the page of the source', body: 'Thirty reads, on the page of the source; five marks in the row; one line in the terminal. Six days.', recommended: true },
  { key: 'B', heading: 'A page of its own, with a chart', body: 'A year of reads, drawn. It is a history, and fourteen days.' },
  { key: 'C', heading: 'Marks in the row only', body: 'It answers since when for five reads and how often for none. Two days.' },
];

const QUESTION = 'Does the server keep a record of its own reads, and show it?';

const LEAD = 'Until the maintainers answer, this paper is a draft and the pages stay as they are. The three answers are part 6 in short; the cost of each is part 7.';

const meta: Meta<DecisionProps> = {
  title: 'Components/Feedback/Decision',
  tags: ['autodocs', '!dev'],
  excludeStories: ['ANSWERS', 'sdsAnswer', 'sdsDecision', 'sdsDecisionFlat', 'specimenHtml'],
  render: (args) => sdsDecision(args),
  argTypes: {
    question: { control: 'text' },
    by: { control: 'text' },
    due: { control: 'text' },
    label: { control: 'text' },
    answers: { control: 'object' },
  },
  args: {
    question: QUESTION,
    answers: ANSWERS,
    by: 'the maintainers',
    due: '2026-09-30',
    lead: LEAD,
  },
  parameters: {
    dsCard: dsCard({
      path: 'components/content/decision.card.html',
      name: 'The question a paper asks',
      subtitle: 'The answers it can take, the one it recommends, who decides, by when',
      viewport: '700x530',
    }),
  },
};

export default meta;
type Story = StoryObj<DecisionProps>;

/** Three answers, one recommended, and the facts of the decision at the
    foot. The word after the name, and only the word, says which one the
    paper recommends. */
export const Default: Story = {};

/** The decision fell, and not the way the paper recommended. The disc
    says which answer the maintainers took, and the foot speaks in the
    past: who decided, and on which day. */
export const Decided: Story = {
  args: {
    answers: ANSWERS.map((one) => (one.key === 'C' ? { ...one, decided: true } : one)),
    lead: 'The maintainers took the marks: a read is a fact about the source, and the row is where it stands.',
  },
};

/** No recommendation: a paper that lays the answers out and stops. */
export const Open: Story = {
  args: { answers: ANSWERS.map(({ recommended: _r, ...rest }) => rest) },
};

/** The question alone, with nothing to say about it and no date. */
export const Bare: Story = {
  args: { lead: '', by: '', due: '' },
};

/** What an answer can hold, which is the reason it goes between the tags.
    A paragraph and a list, where a sentence is not enough to say what an
    answer means. */
export const Blocks: Story = {
  render: () => html`<sds-decision question="${QUESTION}" by="the maintainers" due="2026-09-30">
    <sds-answer key="A" heading="The record on the page of the source" recommended>
      <p>Thirty reads, on the page of the source. With it:</p>
      <ul>
        <li>five marks at the end of the row</li>
        <li>one line in the terminal</li>
      </ul>
    </sds-answer>
    <sds-answer key="B" heading="A page of its own, with a chart">
      <p>A year of reads, drawn. It is a history, and fourteen days.</p>
    </sds-answer>
  </sds-decision>`,
};

export const specimenHtml = (): string =>
  spec([
    part(sdsDecisionFlat({ question: QUESTION, answers: ANSWERS, by: 'the maintainers', due: '2026-09-30', lead: LEAD })),
    specCap('THE QUESTION, THREE ANSWERS, ONE RECOMMENDED · WHO DECIDES AND BY WHEN'),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
