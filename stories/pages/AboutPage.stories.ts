/* Who is behind it.

   The page a project owes anyone deciding whether to run its code, most often
   written as a mission statement. What a reader is asking is narrower: who
   maintains this, what are they answerable for, how is it paid for, and what
   happens if they stop.

   So the page is people, a decision record and a funding line, and no
   photographs — `sds-byline` marks a person with initials. Nothing new was
   needed: a person is a card with a byline in it. See `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/byline.ts';
import '../../packages/frontend/src/components/crumbs.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/quote.ts';
import '../../packages/frontend/src/components/stat.ts';
import '../../packages/frontend/src/components/card.ts';
import { type Crumb } from '../../packages/frontend/src/components/crumbs.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { type PageMode } from '../lib/page.ts';

const TRAIL: readonly Crumb[] = [{ label: 'Overview', href: '#' }, { label: 'Who is behind it' }];

/** What a reader is owed about a person here: the name, what they are
    answerable for, and since when. Not a biography. */
const PEOPLE = [
  {
    name: 'Benjamin Kott',
    role: 'maintainer',
    since: 'since 2025',
    answerable: 'The bundled knowledge, the release that ships it, and every answer that turns out to be wrong.',
  },
  {
    name: 'Core Team',
    role: 'reviewers',
    since: 'since 2026',
    answerable: 'Whether an answer matches what the core actually does. A rule nobody from the core has read is a rule this project does not ship.',
  },
  {
    name: 'Everyone who reported one',
    role: 'contributors',
    since: '41 so far',
    answerable: 'The wrong answers that became changelog entries. The entry names the release it was fixed in, never the person who found it.',
  },
];

const FACTS = [
  {
    value: '41',
    label: 'wrong answers fixed',
    note: `Reported by readers, each one a changelog entry naming the release it was fixed in.`,
  },
  {
    value: '0',
    label: 'analytics scripts',
    note: 'On this site and in the server. What is known about a reader is what they typed into a form.',
  },
  {
    value: `2${NNBSP}days`,
    label: 'typical reply',
    note: 'Longer where an answer has to be reproduced against a release the project no longer runs.',
  },
];

/** The page. `flat` composes the form a static file can hold. */
export function aboutPage(_: PageMode = {}): TemplateResult {
  return html`<div class="sds-shell">
  ${siteBar(-1, '#about')}

  <main class="sds-bands">

    <section class="sds-band" id="about">
      <div class="sds-stack">
        <sds-crumbs .items="${TRAIL}"></sds-crumbs>
        <h1>Who is behind it</h1>
        <p class="sds-lead">
          A tool that answers questions about somebody else’s software has to
          say who is answerable for the answers. This page is that, and the
          three things that follow from it.
        </p>
        <div class="sds-stats">
          ${FACTS.map(
            (fact) => html`<sds-stat value="${fact.value}" label="${fact.label}" .note="${fact.note}"></sds-stat>`,
          )}
        </div>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="people">
      <div class="sds-stack">
        <h2>The people</h2>
        <p>
          Named by what they are answerable for rather than by a title. No
          photographs: a face is a file to fetch, keep in step and licence, and
          none of that is what naming a maintainer is for.
        </p>
        <div class="sds-grid">
          ${PEOPLE.map(
            (person) => html`<sds-card
              .body="${html`<sds-byline name="${person.name}" as="${person.role}" meta="${person.since}"></sds-byline>
              <span style="display:block; margin-top:10px">${person.answerable}</span>`}"
            ></sds-card>`,
          )}
        </div>
      </div>
    </section>

    <section class="sds-band" id="why">
      <div class="sds-split">
        <div class="sds-stack">
          <h2>Why it exists</h2>
          <p>
            A coding agent asked about TYPO3 answers from whatever it read
            during training, which is a mixture of releases nobody can name.
            The answers are fluent and some of them are from 2019.
          </p>
          <p>
            This project’s position is that an answer without a source is not an
            answer. Everything else it does — the version bindings, the five
            sources, the shortfall that travels with a degraded result — follows
            from that one sentence.
          </p>
        </div>
        <div class="sds-stack">
          <sds-quote
            .body="${'A partial registry never looks complete: source, reason and the unread files travel with the result.'}"
            by="installation-fallback"
            as="the drawing this rule came from"
          ></sds-quote>
        </div>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="funding">
      <div class="sds-stack">
        <h2>How it is paid for, and what happens if it stops</h2>
        <p>
          Unpaid work, done in the open, under MIT. Nothing about
          it is sold and nothing about it is sponsored, which is worth stating
          plainly rather than leaving to be inferred from the absence of a
          pricing page.
        </p>
        <sds-note
          heading="It is not a TYPO3 Association product, and it never claims to be"
          .body="${html`No page here uses the Association’s marks, and the footer says what
            this is on every one of them. Where an answer comes from official
            documentation, the answer says so and links to it.`}"
        ></sds-note>
        <sds-note
          tone="warn"
          heading="If maintenance stops, the bundled knowledge goes stale silently"
          .body="${html`That is the honest failure mode: the tools keep answering and the
            version bindings stop being extended. The release date is in every
            answer’s source, which is how a reader would notice.`}"
        ></sds-note>
        <div class="sds-actions">
          <sds-link label="Repository" href="https://github.com" external icon="actions-brand-github"></sds-link>
          <sds-link label="What is written down" href="#"></sds-link>
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
  title: 'Pages/About',
  excludeStories: ['aboutPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/about.html',
      title: 'TYPO3 Dev Companion — who is behind it',
      subtitle: 'Who is answerable, why it exists, how it is paid for, and what happens if it stops',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** A page of people with no photographs on it, which is the decision worth
    looking at here. */
export const Page: Story = {
  name: 'About',
  render: () => aboutPage(),
};

export const screenHtml = (): string => part(aboutPage({ flat: true }));
