/* The guideline page.

   What a construction rule looks like when it is written down: the values a
   drawing has to hold, the palette it may use, and the two grounds it has to
   survive. Everything here is a fact somebody will check their own work
   against, so nothing is prose that could have been a number — and no ground,
   no colour and no size is typed into the page, because a guideline that
   hardcodes what it documents stops being true the day the system moves.

   Live and static from one composition — see `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/code.ts';
import '../../packages/frontend/src/components/confval.ts';
import '../../packages/frontend/src/components/icon.ts';
import '../../packages/frontend/src/components/nav-breadcrumb.ts';
import '../../packages/frontend/src/components/nav-pager.ts';
import '../../packages/frontend/src/components/nav-rail.ts';
import '../../packages/frontend/src/components/nav-toc.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/surface.ts';
import '../../packages/frontend/src/components/swatch.ts';
import { type Crumb } from '../../packages/frontend/src/components/nav-breadcrumb.ts';
import { type ConfvalProps } from '../../packages/frontend/src/components/confval.ts';
import { type MenuEntry } from '../../packages/frontend/src/components/nav-base.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';
import { PALETTE, sdsSwatch } from '../components/Swatch.stories.ts';

const TRAIL: readonly Crumb[] = [
  { label: 'Overview', href: '#' },
  { label: 'Glyphs', href: '#' },
  { label: 'Drawing one' },
];

const RAIL: readonly MenuEntry[] = [
  { label: 'Overview', href: '#overview' },
  {
    label: 'glyphs',
    items: [
      { label: 'The set', href: '#glyphs' },
      { label: 'Drawing one', href: '#drawing', current: true },
      { label: 'Naming one', href: '#naming' },
    ],
  },
  { label: 'Glossary', href: '#glossary' },
];

/** What a drawing has to hold. One entry per value: the name somebody scans
    for, the facts a machine would check, and a sentence saying what happens
    either way. A `<dl>` of the same pairs says the first two and drops the
    third, which is the one a contributor actually needs. */
const CONSTRUCTION: readonly ConfvalProps[] = [
  {
    name: 'canvas',
    type: '16 × 16',
    default: 'no other size',
    body: html`Every glyph is drawn on the same square, whatever size it is
      rendered at. A drawing made on a larger canvas and scaled down lands
      between pixels, and the whole set stops sitting on one baseline.`,
  },
  {
    name: 'protective space',
    type: '1 unit',
    body: html`The ring of the canvas nothing may enter. It is what keeps a
      glyph the same optical size as its neighbours when one is a circle and
      the next is a square.`,
  },
  {
    name: 'stroke',
    type: '1 unit',
    default: 'even numbers only',
    body: html`An odd stroke on a whole-pixel grid renders as two grey lines
      instead of one black one. This is the rule that costs the most to break,
      because it looks correct at every size except the one people use.`,
  },
  {
    name: 'fill',
    type: 'currentColor',
    required: true,
    body: html`Never a literal. A glyph takes the colour of the text it stands
      in — that is the whole reason the drawing is in the document rather than
      linked from it, and a hardcoded fill is a glyph that goes invisible in
      the other mode.`,
  },
];

/** The palette a drawing may use, which is the page's own and not a second
    one: a guideline that lists colours a design cannot resolve is documenting
    a system that does not exist. */
const COLOURS = PALETTE;

/** One ground, with the mode forced onto that subtree. Both panes are the same
    call — a glyph that reads in one mode and goes flat in the other is what
    this pair exists to catch, and neither ground is written as a colour. */
const pane = (theme: 'light' | 'dark'): TemplateResult =>
  html`<sds-surface
    data-theme="${theme}"
    plane="raised"
    label="${theme}"
    heading="The page's own ground"
    .body="${html`<div class="sds-row">
      <sds-icon name="actions-document-edit" size="48"></sds-icon>
      <sds-icon name="actions-file-pdf" size="48"></sds-icon>
      <sds-icon name="actions-code-merge" size="48"></sds-icon>
      <sds-icon name="actions-arrow-end" size="48"></sds-icon>
    </div>`}"
  ></sds-surface>`;

/* Written as the characters it is, with real newlines: the element takes this
   verbatim, so an entity here would arrive as an entity. */
const SOURCE = '<svg viewBox="0 0 16 16">\n  <path d="…" fill="currentColor"/>\n</svg>';

/** The page. `flat` composes the form a static file can hold. */
export function guidePage({ flat = false }: PageMode = {}): TemplateResult {
  /* The one place the two renderings differ: a pane's body is content, and
     `renderStatic` flattens no element that was given children. */
  const grounds = grid([pane('light'), pane('dark')], { flat });
  const palette = grid(COLOURS.map(sdsSwatch), { flat, variant: 'wide' });

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(3, '#drawing')}

  <div class="sds-body">
    <aside class="sds-body__rail" id="page-rail">
      <sds-nav-rail .entry="${{ label: '', items: RAIL }}"></sds-nav-rail>
    </aside>

    <main class="sds-body__main" id="main-content">
      <sds-nav-breadcrumb .items="${TRAIL}"></sds-nav-breadcrumb>
      <h1>Drawing a glyph</h1>
      <p class="sds-lead">
        What a drawing has to hold to look like it belongs to the set. These
        are the rules a review checks against, in the order somebody drawing
        their first glyph meets them.
      </p>

      <!-- What is on this page. The class that floats it beside the text is
           the document layer's, and a product surface links only the
           stylesheet — so here the contents stand in the column. -->
      <sds-nav-toc
        .entries="${[
          { label: 'Construction', href: '#construction' },
          { label: 'Colour', href: '#colour' },
          { label: 'Both grounds', href: '#grounds' },
          { label: 'The source', href: '#source' },
        ]}"
      ></sds-nav-toc>

      <h2 class="sds-h3" id="construction">Construction</h2>
      <p>
        Four values, and every one of them is checkable. A drawing that holds
        all four is already most of the way to looking like the set, because
        what makes a set a set is that nobody had to judge any of this.
      </p>

      ${CONSTRUCTION.map(
        (one) => html`<sds-confval
          name="${one.name}"
          type="${one.type ?? ''}"
          default="${one.default ?? ''}"
          ?required="${one.required ?? false}"
          .body="${one.body}"
        ></sds-confval>`,
      )}

      <h2 class="sds-h3" id="colour">Colour</h2>
      <p>
        A glyph has one colour and inherits it. The palette below is what the
        page around it resolves — every entry carries the name a design writes
        and the value the mode resolved it to, because a chip on its own is
        nothing a reader can type into their own drawing.
      </p>

      ${palette}

      <sds-note
        tone="warn"
        heading="Never a literal"
        .body="${html`A hex typed into a drawing is a glyph that survives one mode. The
          value above is the pair, and the drawing takes whichever half the reader is
          in — which is what <span class="sds-mono">currentColor</span> is for.`}"
      ></sds-note>

      <h2 class="sds-h3" id="grounds">Both grounds</h2>
      <p>
        The same drawings on either ground, and each pane forces its mode on
        itself rather than painting one. A glyph that goes flat in dark was
        drawn against a single background, and this is where that shows before
        a reader finds it.
      </p>

      ${grounds}

      <h2 class="sds-h3" id="source">The source</h2>
      <p>
        What a finished drawing looks like. The viewBox is the canvas, the fill
        is inherited, and there is nothing else in the file — no width, no
        height, no metadata an editor left behind.
      </p>

      <sds-code code-lang="html" source="${SOURCE}" copy></sds-code>

      <sds-nav-pager
        previous-href="#glyphs" previous-label="The set"
        next-href="#naming" next-label="Naming one"
        label="Through the guideline"
      ></sds-nav-pager>
    </main>
  </div>

  ${siteFooter()}
</div>`;
}

/* Untagged for the reason written out in `LandingScreen.stories.ts`: a whole
   layout has no variants to collect, and the widths it is documented at are
   reachable only in the story view. */
const meta: Meta = {
  title: 'Pages/Guide',
  excludeStories: ['guidePage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/guide.html',
      title: 'TYPO3 Dev Companion — drawing a glyph',
      subtitle: `A construction rule written down — values as entries, the palette resolved, both grounds forced on a subtree`,
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the rail folds, the contents mark where the reader is,
    both panes hold their mode while the switch moves the page around them, and
    the block copies itself. */
export const Page: Story = {
  name: 'Guide',
  render: () => guidePage(),
};

export const screenHtml = (): string => part(guidePage({ flat: true }));
