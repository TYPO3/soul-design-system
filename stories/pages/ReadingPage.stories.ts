/* The page that shows its own measure.

   Every other page story is an archetype of something a product needs. This
   one is the reference for the rhythm they are all set to: the registers stand
   under each other in one column, each block that has a title stands beside
   one that does not, and nothing on it is drawn to make a point it does not
   also do.

   It is the page `make rhythm` measures. A gap that is not on the space scale
   and a size that is not on the type scale both show up there as a number with
   no token behind it, which is why the page holds one of everything rather
   than one of the interesting ones. See `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/accordion.ts';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/card.ts';
import '../../packages/frontend/src/components/code.ts';
import '../../packages/frontend/src/components/crumbs.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/quote.ts';
import '../../packages/frontend/src/components/rail.ts';
import '../../packages/frontend/src/components/stat.ts';
import '../../packages/frontend/src/components/surface.ts';
import '../../packages/frontend/src/components/table.ts';
import '../../packages/frontend/src/components/teaser.ts';
import { type Entry } from '../../packages/frontend/src/components/accordion.ts';
import { type Crumb } from '../../packages/frontend/src/components/crumbs.ts';
import { type RailEntry } from '../../packages/frontend/src/components/rail.ts';
import { sdsAccordion } from '../components/Accordion.stories.ts';
import { sdsBadge } from '../components/Badge.stories.ts';
import { sdsCard } from '../components/Card.stories.ts';
import { sdsCode } from '../components/Code.stories.ts';
import { sdsCrumbs } from '../components/Crumbs.stories.ts';
import { sdsNote } from '../components/Note.stories.ts';
import { sdsQuote } from '../components/Quote.stories.ts';
import { sdsStat } from '../components/Stat.stories.ts';
import { sdsSurface } from '../components/Surface.stories.ts';
import { sdsTable } from '../components/Table.stories.ts';
import { sdsTeaser } from '../components/Teaser.stories.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';

const TRAIL: readonly Crumb[] = [
  { label: 'Overview', href: '#' },
  { label: 'How this is set' },
];

const CONTENTS: readonly RailEntry[] = [
  { label: 'The two registers', href: '#registers' },
  { label: 'What a block carries', href: '#blocks' },
  { label: 'The vertical step', href: '#step' },
  { label: 'Where a value comes from', href: '#values' },
  { label: 'Questions', href: '#questions' },
];

/** The scale, as a reader meets it rather than as a token list: what each
    step is for, and what it is never for. */
const REGISTERS = [
  ['Display', '58 / 44 / 34', 'A page opener and the two headings under it. Once each.'],
  ['Reading', '20 / 19 / 16', 'A third heading, a lead, and the paragraph everything else is measured against.'],
  ['Dense', '14 / 13', 'Every control, every table row, and everything the machine wrote.'],
  ['Label', '12 / 11', 'A machine name, a table head, a caption. Never a sentence.'],
] as const;

/** What the page counts, as the stat story takes it. */
const FACTS = [
  { value: '10', label: 'type steps', note: 'every size on every surface' },
  { value: '14', label: 'space steps', note: 'halved below 16px, thinning above 24' },
  { value: '1', label: 'register for a block', note: 'it is read, so it is set at the page' },
];

const QUESTIONS: readonly Entry[] = [
  {
    question: 'Is a block smaller than the text around it?',
    answer: html`It is not. A block holding sentences is read, so it is set at
      the page's own size wherever it stands — an admonition is the paragraph
      above it with a border around it. What stays small is what the machine
      wrote, and a caption, which is a label rather than a sentence.`,
    open: true,
  },
  {
    question: 'Where does a value that is not on the scale come from?',
    answer: html`Nowhere it is allowed to. A size that is not a
      <span class="sds-mono">--font-size-*</span> and a gap that is not a
      <span class="sds-mono">--space-*</span> are both values somebody typed,
      and <span class="sds-mono">make rhythm</span> is what finds them.`,
  },
  {
    question: 'What decides how much air a heading gets above it?',
    answer: `Its level. The step above a heading is what says which one it is — the size only confirms it, and at the fourth level the size has stopped changing altogether.`,
  },
];

/** The page. `flat` composes the form a static file can hold. */
export function readingPage({ flat = false }: PageMode = {}): TemplateResult {
  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(4, '#reading', 'page-rail')}

  <div class="sds-body">
    <aside class="sds-body__rail" id="page-rail">
      <sds-rail .items="${CONTENTS}" active="0"></sds-rail>
    </aside>

    <main class="sds-column" id="main-content">
      <div class="sds-stack sds-stack--tight">
        ${sdsCrumbs({ items: TRAIL })}
        ${sdsBadge({ label: 'reference' })}
        <h1>How this page is set</h1>
        <p class="sds-lead">
          Every size on it comes off one scale and every gap off one grid. That
          is not a house style — it is the only thing that lets a reader tell a
          heading from a title from a label without reading any of them first.
        </p>
      </div>

      <h2 class="sds-h3" id="registers">The two registers</h2>
      <p>
        Running text is the reading register: a paragraph at 16px, held to a
        measure, with headings above it that get quieter as they get deeper.
        Anything the machine wrote — a control, a table row, a code block —
        runs on the same scale a few steps down, because it is scanned rather
        than read.
      </p>
      <p>
        The mistake the scale exists to prevent is a third voice — a size chosen
        for one component because neither register looked right that afternoon.
        Every such size reads as a fourth level of hierarchy that means nothing.
      </p>

      ${sdsTable({
        density: 'medium',
        columns: [{ head: 'Register' }, { head: 'Steps', cls: 'sds-td-name' }, { head: 'What it is for' }],
        rows: REGISTERS.map(([name, sizes, use]) => ({ cells: [name, sizes, use] })),
      })}

      <h2 class="sds-h3" id="blocks">What a block carries</h2>
      <p>
        Anything with a heading over its own text is read, so its body is the
        page's own size. Only the title tells two kinds apart: a card, a teaser
        and a result carry the louder one, because their title is somewhere you
        can go rather than something you read.
      </p>

      ${sdsNote({
        tone: 'info',
        icon: 'actions-info',
        heading: 'A block is read at the page it stands on',
        body: `There is no second register to rebind and nothing to keep in step. What
          is dense is what the machine wrote — a control, a row, a code block, the
          line about the thing beside it — and each of those says so itself.`,
      })}

      <p>
        Below is the same shape twice: once as an entry, whose title is a
        destination, and once as a surface, which states something in place.
        The bodies are one size and only the titles differ.
      </p>

      ${grid(
        [
          sdsCard({
            heading: 'An entry',
            body: 'Its title is a link, so it is the louder of the two and a page of them can be scanned by title alone.',
            label: 'entry',
            href: '#blocks',
          }),
          sdsSurface({
            plane: 'raised',
            title: 'A surface',
            body: 'It states something in place. Its title stays the quieter one, because nothing here is a destination and a title that looks like one is a promise the box does not keep.',
          }),
        ],
        { flat, variant: 'wide' },
      )}

      <h2 class="sds-h3" id="step">The vertical step</h2>
      <p>
        What separates two things on a page is the air between them, and the air
        is what says which of them owns the other. A second-level heading takes
        40px above it and the flow gap below: the large one belongs to the
        section it opens, the small one binds it to what it introduces.
      </p>
      <p>
        Get that pair backwards and the heading floats between two sections
        belonging to neither, which is the most common way a page with correct
        sizes still reads as a list of fragments.
      </p>

      ${sdsQuote({
        body: 'A heading is the top of what follows, not a gap after what came before.',
        by: 'document.css',
        as: 'the rule the layer is built on',
      })}

      <h2 class="sds-h3" id="values">Where a value comes from</h2>
      <p>
        A token, or it is a defect. The scale holds the sizes and the grid holds
        the gaps, and a component that needs something between two steps has
        found either a missing step or a decision it should not be making alone.
      </p>

      <sds-code
        code-lang="css"
        source="${`/* a block is read, so it is set at the page it stands on */
--block-title-size: var(--font-size-body);
--entry-title-size: var(--font-size-h3);
--block-body-size:  var(--font-size-body);

/* and the line *about* a thing is not the thing */
--aside-size: var(--font-size-dense);`}"
        copy
      ></sds-code>

      <div class="sds-stats">
        ${FACTS.map(sdsStat)}
      </div>

      <h2 class="sds-h3" id="questions">Questions</h2>
      ${sdsAccordion({ entries: QUESTIONS, name: 'reading' })}

      ${sdsTeaser({
        heading: 'The tokens themselves',
        body: 'Every value named above, with what it is for and what it is never for.',
        tag: 'reference',
        meta: 'tokens',
        href: '#registers',
      })}
    </main>
  </div>

  ${siteFooter()}
</div>`;
}

/* Untagged for the reason written out in `LandingScreen.stories.ts`: a whole
   layout has no variants to collect, and the widths it is documented at are
   reachable only in the story view. */
const meta: Meta = {
  title: 'Pages/Reading',
  excludeStories: ['readingPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/reading.html',
      title: 'TYPO3 Dev Companion — how this page is set',
      subtitle: 'Every register under one another in one column — the page make rhythm measures',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Read it top to bottom: the step above a heading says which level it is
    before its size does, the two block registers stand side by side, and the
    fold at the foot opens with no script. */
export const Page: Story = {
  name: 'Reading',
  render: () => readingPage(),
};

export const screenHtml = (): string => part(readingPage({ flat: true }));
