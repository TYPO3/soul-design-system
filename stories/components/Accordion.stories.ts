/* Questions with their answers folded behind them.

   The markup lives in `src/components/accordion.ts`. No `parameters.dsCard`: a
   card is a still picture and half of this is what pressing it does.

   Two things read rather than looked at: it is a real `<details>`, so it folds
   before any script and find-in-page opens the answer it lands in; and it is
   exclusive through `name` rather than a listener. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/accordion.ts';
import '../../packages/frontend/src/components/code.ts';
import { type AccordionProps, type Entry } from '../../packages/frontend/src/components/accordion.ts';

/** One question, written out. The demos below are composed of these rather than
    handed the same questions as a property: a property leaves no markup, and
    the source panel under a story that passes one shows an element with nothing
    in it — which is the one thing a reader came to copy. */
export const sdsAccordionItem = ({ question, answer, open }: Entry) =>
  html`<sds-accordion-item question="${question}" ?open="${Boolean(open)}">${answer}</sds-accordion-item>`;

/** The set as a page writes it. Demos only: a screen is exported as a card with
    no browser behind it, and an element given content between its tags cannot
    be — see `renderStatic` in `lib/render.ts`. That is what `sdsAccordion` is
    for, and it is the form the screens take. */
const composed = ({ entries, multiple = false, name }: AccordionProps) =>
  html`<sds-accordion ?multiple="${multiple}" name="${name ?? 'sds-accordion'}">
  ${entries.map((entry) => sdsAccordionItem(entry))}
</sds-accordion>`;

export const sdsAccordion = ({ entries, multiple = false, name }: AccordionProps) =>
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
    question: 'Which TYPO3 versions does it work with?',
    answer: 'Every version still receiving support, and one release past it. A version that has reached its end of life is named in the result rather than refused, so an installation nobody has updated yet still gets an answer.',
  },
];

const meta: Meta<AccordionProps> = {
  title: 'Components/Accordion',
  tags: ['autodocs', '!dev'],
  excludeStories: ['QUESTIONS', 'sdsAccordion', 'sdsAccordionItem'],
  render: (args) => composed(args),
  argTypes: {
    multiple: { control: 'boolean' },
    name: { control: 'text' },
  },
  args: { entries: QUESTIONS },
};

export default meta;
type Story = StoryObj<AccordionProps>;

/** A set is its items: one `sds-accordion-item` per question, and the set says
    only what holds for all of them. Exclusive — opening one closes the last —
    which the platform does from `name` on each `<details>`, so there is no
    listener here to get wrong. */
export const Default: Story = {};

/** More than one at a time, for a set whose answers are meant to be compared
    rather than found. It is also the quieter fold: exclusive closes one answer
    while another opens, and the question under the pointer moves. */
export const Multiple: Story = {
  args: {
    multiple: true,
    entries: QUESTIONS.map((entry, i) => ({ ...entry, open: i < 2 })),
  },
};

/** All closed. Correct where the questions are the page and the reader is
    scanning for one; the default set above stands its first answer open so the
    shape of an answer is visible without pressing anything. */
export const AllClosed: Story = {
  args: { entries: QUESTIONS.map((entry) => ({ ...entry, open: false })) },
};

/** What an item can hold, which is the reason the answer goes between the tags:
    paragraphs, a list, a code block — none of it fits in an attribute, and all
    of it is what a documentation renderer hands over. */
export const Blocks: Story = {
  render: () => html`<sds-accordion name="composed">
    <sds-accordion-item question="What can an answer hold?" open>
      <p>
        Whatever the page put there. This one is two paragraphs and a command,
        which is the shape an answer in a manual actually has.
      </p>
      <p>The second paragraph, so the fold has something to reveal.</p>
      <sds-code code-lang="bash" .body="${[{ kind: 'shell', text: 'make verify' }]}"></sds-code>
    </sds-accordion-item>
    <sds-accordion-item question="Who decides which one is open?">
      <p>
        The platform. Every answer in a set carries the set's name, so opening
        this one closed the one above it, and no listener anywhere was involved.
      </p>
    </sds-accordion-item>
  </sds-accordion>`,
};

/** The other way in, for a page that already holds its questions as data: the
    set takes them as `entries` and writes the items itself. It is also the only
    form a screen can take, because a card is exported without a browser. The
    panel below shows an empty element and says the truth — a property leaves no
    markup, which is why every demo above is written out. */
export const FromData: Story = {
  render: (args) => sdsAccordion({ ...args, name: args.name ?? 'from-data' }),
};
