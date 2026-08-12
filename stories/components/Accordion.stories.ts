/* Questions with their answers folded behind them.

   The markup lives in `src/components/accordion.ts`. No `parameters.dsCard`: a
   card is a still picture and half of this is what pressing it does.

   Two things read rather than looked at: it is a real `<details>`, so it folds
   before any script and find-in-page opens the answer it lands in; and it is
   exclusive through `name` rather than a listener. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/accordion.ts';
import { type AccordionProps, type Entry } from '../../packages/frontend/src/components/accordion.ts';

const sdsAccordion = ({ entries, multiple = false, name }: AccordionProps) =>
  html`<sds-accordion .entries="${entries}" ?multiple="${multiple}" name="${name ?? 'sds-accordion'}"></sds-accordion>`;

/** The set the FAQ page asks. Exported so the page composes these rather than
    a second copy that answers slightly differently. */
export const QUESTIONS: readonly Entry[] = [
  {
    question: 'Does it send anything anywhere?',
    answer: html`One path leaves the machine and it is drawn as the exception: a
      read from <span class="sds-mono">docs.typo3.org</span>, made only when a tool
      was asked for a documentation page. Everything else is answered from bundled
      knowledge, from files on disk, or from the installation.`,
    open: true,
  },
  {
    question: 'Does it write to my installation?',
    answer: html`No. Every source is read, and the package files are read rather
      than executed. The one thing written anywhere is what you ask for
      explicitly — the task skills, into <span class="sds-mono">.agents/skills</span>.`,
  },
  {
    question: 'Which releases does it answer for?',
    answer: html`12.4, 13.4, 14.3 and main from bundled knowledge; changelog
      lookups go down to 7.0. Anything read from your installation follows that
      installation, whatever it runs.`,
  },
  {
    question: 'What happens when the installation will not boot?',
    answer: html`The tool reads the package registry from disk instead and says so
      in the result. It returns every declared entry and none of the dynamically
      registered ones, and the answer states that rather than looking complete.`,
  },
  {
    question: 'Is it a TYPO3 Association product?',
    answer: 'No. It is an independent development tool, it is not endorsed, and no surface of it implies otherwise.',
  },
];

const meta: Meta<AccordionProps> = {
  title: 'Components/Accordion',
  tags: ['autodocs', '!dev'],
  excludeStories: ['QUESTIONS'],
  render: (args) => sdsAccordion(args),
  argTypes: {
    multiple: { control: 'boolean' },
    name: { control: 'text' },
  },
  args: { entries: QUESTIONS },
};

export default meta;
type Story = StoryObj<AccordionProps>;

/** Exclusive: opening one closes the last. The platform does it, from `name`
    on each `<details>` — there is no listener here to get wrong. */
export const Default: Story = {};

/** More than one at a time, for a set whose answers are meant to be compared
    rather than found. */
export const Multiple: Story = { args: { multiple: true } };

/** All closed. Correct where the questions are the page and the reader is
    scanning for one; the default set above stands its first answer open so the
    shape of an answer is visible without pressing anything. */
export const AllClosed: Story = {
  args: { entries: QUESTIONS.map((entry) => ({ ...entry, open: false })) },
};
