/* The page that is not there.

   The one surface nobody designs and everybody ships, and the rules already say
   what it owes. Name the request, say it answered, say what it does not
   cover, offer the nearest real thing. A 404 that says "page not found" over a
   large number has done none of that.

   And it speaks as a page speaks. The requested address is the headline, what
   answered is the lead under it, and the search field is the nearest real
   thing. A box with a smaller title makes the one statement on the page
   quieter than the cards below it. The chrome stays: a reader who arrives
   here needs the way out every other page has. See `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/eyebrow.ts';
import '../../packages/frontend/src/components/field.ts';
import '../../packages/frontend/src/components/card.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';

/** Where a reader who landed here probably meant to be. Named pages rather
    than a link to the front page. "Go home" is the offer that helps nobody
    who followed a link to something specific. */
const NEAREST = [
  {
    icon: 'actions-list-alternative' as const,
    label: 'reference',
    heading: 'The eight tools',
    body: 'What each one answers from, which releases it holds for, and how it last answered.',
    link: 'Open the tool reference',
  },
  {
    icon: 'actions-book' as const,
    label: 'documentation',
    heading: 'Installing the server',
    body: 'One command, the client configuration it writes, and what to run when it does not answer.',
    link: 'Read the documentation',
  },
  {
    icon: 'actions-newspaper' as const,
    label: 'news',
    heading: 'Releases and guides',
    body: 'Everything published, newest first, with the release each entry holds for.',
    link: 'Open the news',
  },
];

/** The page. `flat` composes the form a static file can hold. */
export function notFoundPage({ flat = false }: PageMode = {}): TemplateResult {
  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(-1, '#gone')}

  <main class="sds-bands" id="main-content">

    <section class="sds-band" id="gone">
      <sds-eyebrow label="404 · nothing at this address"></sds-eyebrow>
      <h1>There is no page at this address</h1>
      <p class="sds-lead">
        The site read <span class="sds-mono">/tools/typo3_label_lookup/v2</span> and
        has nothing at it. Nothing here went away — this path has never existed, so it
        is not a link that rotted but one that was never right.
      </p>

      <div class="sds-row" id="search">
        <sds-field
          caption="Search the site"
          field-id="q"
          name="q"
          value="A tool name, a release, or what you were looking for"
          icon="actions-search"
          min-width="420"
          hint="Searches the documentation, the tool reference and the news. Not your installation."
        ></sds-field>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="nearest">
      <h2>The nearest real things</h2>
      <p>
        Three pages rather than a link to the front page: the start helps
        nobody who followed a link to something specific.
      </p>
      ${grid(
        NEAREST.map(
          (one) => html`<sds-card
            icon="${one.icon}"
            label="${one.label}"
            heading="${one.heading}"
            body="${one.body}"
            href="#"
            action="${one.link}"
          ></sds-card>`,
        ),
        { flat },
      )}
    </section>

  </main>

  ${siteFooter()}
</div>`;
}

/* Untagged for the reason `LandingScreen.stories.ts` gives. A whole layout
   has no variants to collect, and the widths it documents are reachable only
   in the story view. */
const meta: Meta = {
  title: 'Pages/Not found',
  excludeStories: ['notFoundPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/not-found.html',
      title: 'TYPO3 Dev Companion — not found',
      subtitle: 'A boundary is an answer: the request, what answered, and the nearest real thing',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** The whole page keeps its chrome: a reader who arrives here still needs the
    way out that every other page has. */
export const Page: Story = {
  name: 'Not found',
  render: () => notFoundPage(),
};

export const screenHtml = (): string => part(notFoundPage({ flat: true }));
