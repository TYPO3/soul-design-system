/* The tour.

   A feature presentation that is not three cards in a row. Cards compare —
   they put four things beside each other for a reader to pick from. A tour is
   read in order, because the second step means nothing until the first one has
   happened, and that is what a row of cards cannot say.

   So the steps alternate sides down the page: the eye crosses the column at
   every one, which is what makes a sequence read as a sequence rather than as
   a list that happens to be numbered. Each carries the picture of the thing it
   describes, openable at the size it was made — a screenshot scaled into half
   a column is a screenshot nobody can read.

   Live and static from one composition — see `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/embed.ts';
import '../../packages/frontend/src/components/eyebrow.ts';
import '../../packages/frontend/src/components/image.ts';
import '../../packages/frontend/src/components/nav-pager.ts';
import '../../packages/frontend/src/components/note.ts';
import { buttonLabel, buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { type PageMode, skipLink } from '../lib/page.ts';

/** One step of the tour: what happens, what it looks like, and the one fact a
    reader would otherwise have to take on trust. */
interface Step {
  /** Numbered, because the order is the content. */
  label: string;
  heading: string;
  body: TemplateResult;
  src: string;
  alt: string;
  /** What the step costs — a duration, a count, a precondition. Stated per
      step rather than collected in a summary nobody reads. */
  fact: string;
}

const STEPS: readonly Step[] = [
  {
    label: 'step 01',
    heading: 'It reads your installation, once',
    body: html`The server starts as a subprocess of your editor and asks the
      project what it is: which release, which packages, which of them actually
      booted. Nothing is written back, and nothing leaves the machine — the
      first answer is available before the index has finished.`,
    src: '../assets/placeholders/tool-package-registry.png',
    alt: 'The package registry as the server reads it, with three packages marked as not booted',
    fact: 'read-only · 0 requests out',
  },
  {
    label: 'step 02',
    heading: 'You ask in the words you already use',
    body: html`A question is a sentence, not a query language. “which icon means
      delete” and “actions-delete” reach the same answer, because the index
      carries what a thing is for beside what it is called.`,
    src: '../assets/placeholders/tool-search.png',
    alt: 'A search for “delete” returning three identifiers with their purposes',
    fact: `typically 18${NNBSP}ms`,
  },
  {
    label: 'step 03',
    heading: 'The answer says where it came from',
    body: html`Every result names its source and the releases it holds for.
      That is the difference between an answer and a guess: a reader can check
      it, and a reader who cannot check an answer has to trust the tool, which
      is the thing this is trying to avoid.`,
    src: '../assets/placeholders/tool-source-answer.png',
    alt: 'An answer with its source and version binding shown beneath it',
    fact: '4 releases · 1 source named',
  },
  {
    label: 'step 04',
    heading: 'What changed is shown as what changed',
    body: html`Where an answer is about a difference between two releases, it
      arrives as the difference — the lines that moved, in the file they moved
      in, rather than a paragraph describing them.`,
    src: '../assets/placeholders/tool-changelog-history.png',
    alt: 'A changelog entry rendered as a diff, with two lines removed and two added',
    fact: 'down to 7.0',
  },
];

/** One step, on the side the sequence puts it. `leads-end` is the same split
    with the picture first, so the eye crosses the column at every step. */
const step = (one: Step, i: number): TemplateResult => html`<section
  class="sds-band${i % 2 ? ' sds-band--quiet' : ''}"
  id="step-${i + 1}"
>
  <div class="sds-split sds-split--center${i % 2 ? ' sds-split--leads-end' : ''}">
    <div class="sds-column">
      <sds-eyebrow label="${one.label}"></sds-eyebrow>
      <h2>${one.heading}</h2>
      <p>${one.body}</p>
      <div class="sds-row">
        <sds-badge label="${one.fact}"></sds-badge>
      </div>
    </div>
    <div class="sds-column">
      <!-- Openable at the size it was made: a screenshot scaled into half a
           column is a picture of an interface nobody can read. -->
      <sds-image src="${one.src}" alt="${one.alt}" zoomable></sds-image>
    </div>
  </div>
</section>`;

/** The page. `flat` composes the form a static file can hold. */
export function tourPage({ flat = false }: PageMode = {}): TemplateResult {
  const actions = flat
    ? html`${buttonMarkup({ variant: 'primary', size: 'lg' }, html`<sds-icon name="actions-play"></sds-icon>${buttonLabel('Watch the run')}`)}${buttonMarkup(
        { variant: 'secondary', size: 'lg' },
        'Install it instead',
      )}`
    : html`<sds-button variant="primary" size="lg"><sds-icon name="actions-play"></sds-icon>Watch the run</sds-button>
      <sds-button variant="secondary" size="lg">Install it instead</sds-button>`;

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(1, '#tour')}

  <main class="sds-bands" id="main-content">

    <section class="sds-band" id="tour">
      <sds-eyebrow label="a run, end to end"></sds-eyebrow>
      <h1 class="sds-display">Four steps, and the third is the one that matters</h1>
      <p class="sds-lead">
        What actually happens between a question and an answer. Read it in
        order — the fourth step means nothing without the first, which is why
        this is a sequence and not a row of cards.
      </p>
      <div class="sds-actions">${actions}</div>
    </section>

    <section class="sds-band sds-band--quiet" id="run">
      <h2>The whole thing, in one run</h2>
      <p>
        Where the four steps below end up. It is here rather than at the foot
        of the page because a reader who opens it needs nothing else, and one
        who would rather read has the same four steps under it.
      </p>
      <!-- A framed document rather than a picture of one: what is in the
           frame keeps its own layout and answers a pointer, so the reader is
           looking at the thing rather than at a photograph of it. The one
           address that differs between the two renderings: beside the static
           file it is a sibling, and in the story it is served from the root. -->
      <sds-embed
        src="${flat ? 'answer.html' : '/screens/answer.html'}"
        label="The answer this run ends at, live in the page"
        ratio="16 / 10"
        caption="The end of the run, running. Scroll it: the source and the version binding are under the answer."
      ></sds-embed>
    </section>

    ${STEPS.map(step)}

    <section class="sds-band" id="not">
      <div class="sds-split">
        <div class="sds-column">
          <h2>What the tour left out</h2>
          <p>
            Two things this does not do, said here rather than discovered
            later. A tour that only shows what works is a tour that gets
            believed once.
          </p>
        </div>
        <div class="sds-column">
          <sds-note
            tone="warn"
            heading="It cannot answer about a release it has never seen"
            .body="${html`Bundled knowledge stops where the last release stopped. Asked
              about a newer one, it says so instead of answering from the nearest thing
              it has.`}"
          ></sds-note>
          <sds-note
            tone="info"
            heading="Three tools need a bootable installation"
            .body="${html`Without one they read the package registry instead, which answers
              with a subset that looks like the whole — and says which one it gave you.`}"
          ></sds-note>
        </div>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="next">
      <h2>Where to go from here</h2>
      <p>
        The tour ends where the reference begins. Everything above is one
        path through a surface that has several.
      </p>
      <sds-nav-pager
        previous-href="#tour" previous-label="Back to the start of the run"
        next-href="#tools" next-label="The tool reference"
        label="Out of the tour"
      ></sds-nav-pager>
    </section>

  </main>

  ${siteFooter()}
</div>`;
}

/* Untagged for the reason written out in `LandingScreen.stories.ts`: a whole
   layout has no variants to collect, and the widths it is documented at are
   reachable only in the story view. */
const meta: Meta = {
  title: 'Pages/Tour',
  excludeStories: ['tourPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/tour.html',
      title: 'TYPO3 Dev Companion — the tour',
      subtitle: 'A sequence rather than a row of cards — steps alternating sides, each picture openable at the size it was made',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: every picture opens at the size it was made and closes on
    Escape, the frame holds a real page, and the steps cross the column. */
export const Page: Story = {
  name: 'Tour',
  render: () => tourPage(),
};

export const screenHtml = (): string => part(tourPage({ flat: true }));
