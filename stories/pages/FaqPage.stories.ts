/* The questions page.

   The archetype most likely to become a wall of answers written out in full,
   until the page is longer than the documentation it was to save the reader
   from. So it is a *list of questions* with the answers folded behind them:
   `sds-accordion` is a real `<details>`, so the fold works with no script and
   find-in-page opens the answer it lands in.

   Two groups, because these are two kinds of question: what the software does
   to your machine, and what it costs to run. See `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/accordion.ts';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/crumbs.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/note.ts';
import { buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { type Entry } from '../../packages/frontend/src/components/accordion.ts';
import { type Crumb } from '../../packages/frontend/src/components/crumbs.ts';
import { QUESTIONS } from '../components/Accordion.stories.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { type PageMode, skipLink } from '../lib/page.ts';

const TRAIL: readonly Crumb[] = [{ label: 'Overview', href: '#' }, { label: 'Questions' }];

/** The second group: what running it costs, rather than what it does. */
const RUNNING: readonly Entry[] = [
  {
    question: 'What does it need installed?',
    answer: html`PHP 8.2 or newer, and a TYPO3 project it can read. No daemon, no
      database of its own, and no network unless a tool is asked for a
      documentation page.`,
    open: true,
  },
  {
    question: 'How long does an answer take?',
    answer: html`Around 240 ms from bundled knowledge. Anything that needs the
      installation booted takes as long as booting it, which is why the tools that
      can answer without it say so.`,
  },
  {
    question: 'Can it run in CI?',
    answer: 'Yes, and it answers less there: nothing boots, so the tools that need a running installation fall back to reading package files and say what that leaves out.',
  },
  {
    question: 'What happens to a wrong answer I report?',
    answer: html`It is read by a person. Where the answer came from bundled
      knowledge the fix ships with the next release and the changelog names the
      release it was fixed in.`,
  },
];

/** The page. `flat` composes the form a static file can hold. */
export function faqPage({ flat = false }: PageMode = {}): TemplateResult {
  const ask = flat
    ? buttonMarkup({ variant: 'primary' }, html`<sds-icon name="actions-message"></sds-icon>Ask it yourself`)
    : html`<sds-button variant="primary"><sds-icon name="actions-message"></sds-icon>Ask it yourself</sds-button>`;

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(-1, '#questions')}

  <main class="sds-bands" id="main-content">

    <section class="sds-band" id="questions">
      <div class="sds-stack">
        <sds-crumbs .items="${TRAIL}"></sds-crumbs>
        <h1>Questions</h1>
        <p class="sds-lead">
          The ones that arrive by email every week, answered here so they do not
          have to be. Every answer holds for the releases named in it; where one
          does not hold any more it is changed rather than left standing.
        </p>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="machine">
      <div class="sds-stack">
        <h2>What it does to your machine</h2>
        <p>
          The five that decide whether this can be installed at all. Opening one
          closes the last, so the list stays a list.
        </p>
        <sds-accordion name="machine" .entries="${QUESTIONS}"></sds-accordion>
      </div>
    </section>

    <section class="sds-band" id="running">
      <div class="sds-stack">
        <h2>What running it costs</h2>
        <sds-accordion name="running" .entries="${RUNNING}"></sds-accordion>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="ask">
      <div class="sds-split">
        <div class="sds-stack">
          <h2>Not here?</h2>
          <p>
            The server answers questions about TYPO3 itself, which is what it is
            for. Questions about the server go to the repository, and an answer
            that was wrong goes to the form that collects those.
          </p>
          <div class="sds-actions">
            ${ask}
            <sds-link label="Report a wrong answer" href="#"></sds-link>
          </div>
        </div>
        <div class="sds-stack">
          <sds-note
            heading="An answer here is not version-bound the way a tool's is"
            .body="${html`These hold for the releases they name and are maintained by hand.
              What a tool returns carries its own binding, and that binding is the
              one to trust where the two disagree.`}"
          ></sds-note>
        </div>
      </div>
    </section>

  </main>

  ${siteFooter()}
</div>`;
}

/* Untagged for the reason written out in `LandingScreen.stories.ts`: a whole
   layout has no variants to collect, and the widths it is documented at are
   reachable only in the story view. */
const meta: Meta = {
  title: 'Pages/Questions',
  excludeStories: ['faqPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/questions.html',
      title: 'TYPO3 Dev Companion — questions',
      subtitle: 'A list of questions rather than a wall of answers — and it folds with no script',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: opening one answer closes the last within its group and
    leaves the other group alone, the marker turns rather than moves, and the
    whole thing works the same with the bundle blocked. */
export const Page: Story = {
  name: 'Questions',
  render: () => faqPage(),
};

export const screenHtml = (): string => part(faqPage({ flat: true }));
