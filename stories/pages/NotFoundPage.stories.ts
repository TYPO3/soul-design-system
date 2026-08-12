/* The page that is not there.

   The one surface nobody designs and everybody ships, and the rules already say
   what it owes: name what was asked, say it answered, say what it does not
   cover, offer the nearest real thing. A 404 that says "page not found" over a
   large number has done none of that.

   So it is `sds-empty`, the same component the filtered list and the search use,
   because it is the same statement. The chrome stays: a reader arriving here
   needs the way out every other page has. See `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/empty.ts';
import '../../packages/frontend/src/components/field.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/surface.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { type PageMode } from '../lib/page.ts';

/** Where a reader who landed here probably meant to be. Named pages rather
    than a link to the front page: "go home" is the offer that helps nobody who
    was following a link to something specific. */
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
export function notFoundPage(_: PageMode = {}): TemplateResult {
  return html`<div class="sds-shell">
  ${siteBar(-1, '#gone')}

  <main class="sds-bands">

    <section class="sds-band" id="gone">
      <div class="sds-stack">
        <sds-empty
          heading="There is no page at /tools/typo3_label_lookup/v2"
          .body="${html`The address was read and the site has nothing at it. Nothing here was
            removed — this path has never existed, so it is not a link that rotted
            but one that was never right.`}"
          action="Search the site"
          href="#search"
          meta="404 · nothing at this address"
          box-style="max-width:640px"
        ></sds-empty>

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
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="nearest">
      <div class="sds-stack">
        <h2>The nearest real things</h2>
        <p>
          Three pages rather than a link to the front page: whoever followed a
          link to something specific is not helped by being sent to the start.
        </p>
        <div class="sds-grid">
          ${NEAREST.map(
            (one) => html`<sds-surface
              icon="${one.icon}"
              label="${one.label}"
              heading="${one.heading}"
              .body="${html`${one.body}<br /><sds-link label="${one.link}" href="#"></sds-link>`}"
            ></sds-surface>`,
          )}
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
  title: 'Pages/Not found',
  excludeStories: ['notFoundPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/not-found.html',
      title: 'TYPO3 Dev Companion — not found',
      subtitle: 'A boundary is an answer: what was asked, what answered, and the nearest real thing',
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
