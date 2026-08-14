/* The article.

   What the list page links to, and the archetype every long read is: a title,
   who is answerable for it, one column of running text with the things a text
   needs standing in it, and a way to reach any part of it from the top.

   The rail is that way, and it is the same `sds-nav-rail` the documentation page
   uses — a second component called "table of contents" would be that one under
   another name. What the page does not carry is bullet lists and definition
   lists: those are document flow. See `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/byline.ts';
import '../../packages/frontend/src/components/card.ts';
import '../../packages/frontend/src/components/code.ts';
import '../../packages/frontend/src/components/nav-breadcrumb.ts';
import '../../packages/frontend/src/components/figure.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/quote.ts';
import '../../packages/frontend/src/components/nav-rail.ts';
import { type CodeLine } from '../../packages/frontend/src/components/code.ts';
import { type Crumb } from '../../packages/frontend/src/components/nav-breadcrumb.ts';
import { type MenuEntry } from '../../packages/frontend/src/components/nav-base.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';

const TRAIL: readonly Crumb[] = [
  { label: 'Overview', href: '#' },
  { label: 'News', href: '#' },
  { label: 'Reading the package registry' },
];

/* The article's own sections. Flat, because a text that needs groups in its
   contents is two texts. */
const CONTENTS: readonly MenuEntry[] = [
  { label: 'What the fallback is', href: '#fallback', current: true },
  { label: 'What it returns', href: '#returns' },
  { label: 'What it leaves out', href: '#omits' },
  { label: 'Closing the gap', href: '#gap' },
  { label: 'Read on', href: '#read-on' },
];

/** What a caller sees when the fallback answered. */
const RESULT = `{
  "answeredBy": "packages",
  "declared": ["installation", "packages"],
  "reason": "the installation could not be booted",
  "omitted": "dynamically registered entries, never read"
}`;

const BOOT: readonly CodeLine[] = [
  { kind: 'comment', text: '# the gap closes when the runtime can boot' },
  { kind: 'shell', text: 'ddev start' },
  { kind: 'ok', text: 'answered by', code: 'installation' },
];

const RELATED = [
  {
    tag: 'guide',
    label: '30 May 2026',
    heading: 'Writing a task skill that fails at registration',
    body: 'A skill declares the sources it needs, so an unreachable one is a startup error rather than a wrong answer.',
  },
  {
    tag: 'release',
    label: '9 August 2026 · 1.4.0',
    heading: 'Answers now name the source that answered',
    body: 'Every result carries which of the five sources reached it, and what the substitution left out.',
  },
];

/** The page. `flat` composes the form a static file can hold. */
export function articlePage({ flat = false }: PageMode = {}): TemplateResult {
  /* Storybook serves `assets/` at its root; a file under `screens/` reaches
     the same directory one level up. */
  const assets = flat ? '../assets' : '/assets';

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(4, '#article')}

  <div class="sds-body">
    <aside class="sds-body__rail" id="page-rail">
      <sds-nav-rail .entry="${{ label: '', items: CONTENTS }}"></sds-nav-rail>
    </aside>

    <main class="sds-column" id="main-content">
      <div class="sds-stack sds-stack--tight">
        <sds-nav-breadcrumb .items="${TRAIL}"></sds-nav-breadcrumb>
        <div class="sds-row">
          <sds-badge label="guide"></sds-badge>
          <sds-badge label="13.4 · 14.3" tone="accent"></sds-badge>
        </div>
        <h1>Reading the package registry when the installation will not boot</h1>
        <p class="sds-lead">
          A tool that needs a booted installation and cannot have one does not
          fail. It reads the files instead, answers with less, and says so — and
          the saying so is the part that makes the answer usable.
        </p>
      </div>

      <sds-byline name="Benjamin Kott" as="maintainer" meta="24${NNBSP}July 2026 · 6${NNBSP}min"></sds-byline>

      <sds-figure
        src="${assets}/diagrams/installation-fallback.svg"
        alt="Three paths through the registry: the console command and the booted runtime return every entry, the package-file fallback returns the declared ones and none of the dynamically registered ones."
        caption="Each square is one entry the registry could return. The fallback returns every declared entry and none of the dynamic ones — and the answer states that."
        zoomable
      ></sds-figure>

      <h2 class="sds-h3" id="fallback">What the fallback is</h2>
      <p>
        Three paths lead to the same registry and they are not equal. Where a
        console command exists it runs, and where it does not the runtime is
        booted in this process. Both return everything the registry holds; they
        differ in what they cost, not in what they know.
      </p>
      <p>
        The third path exists because the first two can be unavailable — a
        failsafe installation, a missing database, an extension that throws
        while it is being loaded. It reads the package files from disk. It never
        executes them, which is the reason it can answer at all and also the
        reason it answers with less.
      </p>

      <h2 class="sds-h3" id="returns">What it returns</h2>
      <p>
        Every entry a package declares in a file, and nothing that is registered
        while the application runs. For most installations that is the larger
        part of the registry, which is precisely what makes the shortfall
        dangerous: a partial answer that looks complete is worse than no answer,
        because nothing about it invites a second look.
      </p>

      <sds-code code-lang="json" source="${RESULT}" copy></sds-code>

      <p>
        <span class="sds-mono">answeredBy</span> is what reached the question and
        <span class="sds-mono">declared</span> is what the tool was allowed to
        read. The two differing is the whole definition of a degraded answer in
        this server, and it is a comparison a caller can make without knowing
        anything about registries.
      </p>

      <h2 class="sds-h3" id="omits">What it leaves out</h2>
      <sds-quote
        .body="${'A partial registry never looks complete: source, reason and the unread files travel with the result.'}"
        by="installation-fallback"
        as="diagram"
      ></sds-quote>
      <p>
        Dynamic registrations are the whole of the difference — entries an
        extension adds in its own bootstrap, which exist only once something has
        run. No file on disk names them, so no amount of reading files finds
        them, and a tool that pretended otherwise would be inventing.
      </p>

      <sds-note
        tone="warn"
        heading="The answer is usable, and it is not the whole registry"
        .body="${html`Treat it as a floor rather than a list: everything in it is really
          registered, and something registered may be missing from it.`}"
      ></sds-note>

      <h2 class="sds-h3" id="gap">Closing the gap</h2>
      <p>
        Nothing has to be configured. The fallback is chosen because the two
        paths above it were unavailable, so making one of them available is the
        entire fix — and the next answer says <span class="sds-mono">installation</span>
        rather than <span class="sds-mono">packages</span>.
      </p>

      <sds-code code-lang="bash" .body="${BOOT}" copy></sds-code>

      <div class="sds-actions">
        <sds-link label="Repository" href="https://github.com" external icon="actions-brand-github"></sds-link>
        <sds-link label="Share on Mastodon" href="https://typo3.org" external icon="actions-brand-mastodon"></sds-link>
        <sds-link label="Report a wrong answer" href="#" icon="actions-exclamation-circle"></sds-link>
      </div>

      <h2 class="sds-h3" id="read-on">Read on</h2>
      ${grid(
        RELATED.map(
          (entry) => html`<sds-card
            heading="${entry.heading}"
            .body="${entry.body}"
            tag="${entry.tag}"
            label="${entry.label}"
            href="#"
          ></sds-card>`,
        ),
        { flat },
      )}
    </main>
  </div>

  ${siteFooter()}
</div>`;
}

/* Untagged for the reason written out in `LandingScreen.stories.ts`: a whole
   layout has no variants to collect, and the widths it is documented at are
   reachable only in the story view. */
const meta: Meta = {
  title: 'Pages/Article',
  excludeStories: ['articlePage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/article.html',
      title: 'TYPO3 Dev Companion — article',
      subtitle: 'One long read: its contents beside it, and the things a text needs standing in the column',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the contents move with the reader, the drawing opens at
    the size it was drawn, the blocks copy themselves, and below 860px the rail
    goes behind the toggle in the header rather than off the page. */
export const Page: Story = {
  name: 'Article',
  render: () => articlePage(),
};

export const screenHtml = (): string => part(articlePage({ flat: true }));
