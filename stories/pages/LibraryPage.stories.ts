/* The front door to a large set.

   Not a product pitch — `LandingScreen` is that. A reader arriving here is
   looking for one thing out of hundreds, so the first control is the search
   and the first thing under it is the set itself. What a page like this owes
   is counts: "official", "flexible" and "open source" are adjectives anybody
   would write, and a reader cannot check one of them. A figure they can.

   Live and static from one composition — see `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/card.ts';
import '../../packages/frontend/src/components/code.ts';
import '../../packages/frontend/src/components/eyebrow.ts';
import '../../packages/frontend/src/components/field.ts';
import '../../packages/frontend/src/components/field-group.ts';
import '../../packages/frontend/src/components/icon-tile.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/stat.ts';
import { buttonLabel, buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { type IconId } from '../../packages/frontend/src/components/icon.ts';
import { type StatProps } from '../../packages/frontend/src/components/stat.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';
import { sdsStat } from '../components/Stat.stories.ts';

/** What the set holds, in figures a reader can check against the catalogue.
    Every one of them is a count of something on this site — a figure nobody
    can arrive at by counting is a claim wearing a number. */
const FACTS: readonly StatProps[] = [
  {
    value: '392',
    label: 'glyphs',
    icon: 'actions-image',
    note: 'Every one of them drawn on the same 16 × 16 canvas, at one stroke weight.',
  },
  {
    value: '4',
    label: 'releases answered for',
    icon: 'actions-tag',
    note: '12.4, 13.4, 14.3 and main. Each glyph says which of them it holds for.',
  },
  {
    value: '0',
    label: 'dependencies',
    icon: 'actions-package',
    note: 'One sprite per category and a stylesheet. Nothing to install to read a name.',
  },
  {
    value: '18',
    unit: 'ms',
    label: 'to answer a lookup',
    icon: 'actions-clock',
    note: 'From the bundled index, with nothing booted and no request leaving the machine.',
  },
];

/** The way into the set, in the shape a reader picks by: the part of the
    interface they are building, not the part of the file tree it lives in. */
const WAYS: readonly { icon: IconId; heading: string; body: string; action: string }[] = [
  {
    icon: 'actions-document-edit',
    heading: 'Records',
    body: 'Opening, editing, moving, translating and locking the things a page is made of.',
    action: 'Browse records',
  },
  {
    icon: 'actions-folder',
    heading: 'Files',
    body: 'Folders, uploads and the file types a listing has to tell apart at a glance.',
    action: 'Browse files',
  },
  {
    icon: 'actions-code-merge',
    heading: 'History',
    body: 'Commits, branches, comparisons — what changed, and what it used to be.',
    action: 'Browse history',
  },
  {
    icon: 'actions-arrow-end',
    heading: 'Direction',
    body: 'Arrows and chevrons, including the ones that turn with the reading direction.',
    action: 'Browse direction',
  },
];

/** The set itself, above the fold. Six drawings rather than a decorative grid:
    a reader who can see what the marks look like knows within a second whether
    this is the set they came for. */
const SHOWN: readonly IconId[] = [
  'actions-document-edit',
  'actions-file-pdf',
  'actions-folder-add',
  'actions-code-merge',
  'actions-history',
  'actions-arrow-end',
];

/** The control the page exists for. One template for both renderings — the
    group receives it between the tags or as a property, whichever the
    rendering can hold. */
const searchField = (): TemplateResult => html`<sds-field
    size="lg"
    value="Search 392 glyphs by name or purpose"
    icon="actions-search"
    label="Search the glyph set"
    min-width="420"
  ></sds-field>`;

/** The page. `flat` composes the form a static file can hold. */
export function libraryPage({ flat = false }: PageMode = {}): TemplateResult {
  /* The one place the two renderings differ: a button's label is content, and
     `renderStatic` flattens no element that was given children. */
  const actions = flat
    ? html`${buttonMarkup({ variant: 'primary', size: 'lg' }, html`<sds-icon name="actions-list"></sds-icon>${buttonLabel('Browse all 392')}`)}${buttonMarkup(
        { variant: 'secondary', size: 'lg' },
        'Read the drawing rules',
      )}`
    : html`<sds-button variant="primary" size="lg"><sds-icon name="actions-list"></sds-icon>Browse all 392</sds-button>
      <sds-button variant="secondary" size="lg">Read the drawing rules</sds-button>`;

  const ways = WAYS.map(
    (one) => html`<sds-card
      icon="${one.icon}"
      heading="${one.heading}"
      body="${one.body}"
      href="#glyphs"
      action="${one.action}"
    ></sds-card>`,
  );

  const tiles = SHOWN.map(
    (name) => html`<sds-icon-tile name="${name}" href="#glyph"></sds-icon-tile>`,
  );

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(3, '#glyphs')}

  <main class="sds-bands" id="main-content">

    <section class="sds-band" id="glyphs">
      <div class="sds-split sds-split--center">
        <div class="sds-column">
          <!-- The label, the claim and the sentence under it are one thing and
               stand at one distance. -->
          <sds-eyebrow label="the glyph set"></sds-eyebrow>
          <h1 class="sds-display">One mark per thing the backend does</h1>
          <p class="sds-lead">
            Search by what the thing does, not by what it looks like. Every
            drawing is indexed by purpose as well as by name, so
            <span class="sds-mono">bin</span> finds
            <span class="sds-mono">actions-delete</span>.
          </p>
          <!-- The control the page exists for, at the size a field is when it
               is what the screen is for rather than one row of a form. The
               group gives the bare control its place in the flow; the actions
               are their own row and carry their own step. -->
          ${flat
            ? html`<sds-field-group .content="${searchField()}"></sds-field-group>`
            : html`<sds-field-group>${searchField()}</sds-field-group>`}
          <div class="sds-actions">${actions}</div>
        </div>
        <div class="sds-column">
          <!-- The set, not a decoration: a reader knows in a second whether
               these are the marks they came for. -->
          ${grid(tiles, { flat, variant: 'dense' })}
        </div>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="facts">
      <h2>What the set is</h2>
      <p>
        Four figures rather than four adjectives. Every one of them is a
        count somebody can arrive at from the catalogue, which is the
        difference between a fact and a claim wearing a number.
      </p>
      ${grid(FACTS.map(sdsStat), { flat, variant: 'dense' })}
    </section>

    <section class="sds-band" id="ways">
      <h2>Start where you are building</h2>
      <p>
        The set is grouped by the part of the interface it serves, not by the
        part of the repository it lives in. Somebody adding a toolbar wants
        the first of these and will never think to open the fourth.
      </p>
      ${grid(ways, { flat, variant: 'flush' })}
    </section>

    <section class="sds-band sds-band--quiet" id="use">
      <div class="sds-split sds-split--center">
        <div class="sds-column">
          <h2>One tag, wherever it goes</h2>
          <p>
            The identifier is the contract. The drawing behind it may be
            redrawn; the name will not move, and nothing has to be copied into
            your own tree for it to render.
          </p>
          <div class="sds-actions">
            ${flat
              ? buttonMarkup({ variant: 'secondary' }, 'Read the usage guide')
              : html`<sds-button variant="secondary">Read the usage guide</sds-button>`}
          </div>
        </div>
        <div class="sds-column">
          <sds-code
            code-lang="html"
            source="&lt;sds-icon name=&quot;actions-document-edit&quot;&gt;&lt;/sds-icon&gt;"
            copy
          ></sds-code>
          <sds-note
            tone="info"
            heading="Nothing to install inside TYPO3"
            .body="${html`Every release pins a tested version of the set. Check which one
              before reaching for a glyph added last month${NNBSP}— the catalogue says per
              glyph, not just per release.`}"
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
  title: 'Pages/Library',
  excludeStories: ['libraryPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/library.html',
      title: 'TYPO3 Dev Companion — the glyph set',
      subtitle: 'The front door to a large set — search first, the set visible, counted facts instead of adjectives',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the field takes typing, the tiles are each one target,
    the card wall is one block rather than four boxes, and the block copies
    itself. */
export const Page: Story = {
  name: 'Library',
  render: () => libraryPage(),
};

export const screenHtml = (): string => part(libraryPage({ flat: true }));
