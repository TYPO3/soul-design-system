/* The same software, argued to one audience.

   Three very different people have to be convinced of the same thing, and a
   landing page that tries to convince all three convinces none: an editor
   reading about API stability skips, a developer reading about "getting out of
   your way" leaves. So the page is written for one of them and says at the top
   which one, with the way across for whoever landed on the wrong one.

   This is the agency, which is the audience a hosted product has no version
   of — they are not the buyer and not the user, they carry the thing for years
   after both have moved on. What convinces them is not what it does but what
   it costs them to keep.

   Live and static from one composition — see `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, render, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/code.ts';
import '../../packages/frontend/src/components/nav-pills.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/quote.ts';
import '../../packages/frontend/src/components/stat.ts';
import '../../packages/frontend/src/components/surface.ts';
import { buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { type NavChange } from '../../packages/frontend/src/components/nav-base.ts';
import { type StatProps } from '../../packages/frontend/src/components/stat.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';
import { sdsStat } from '../components/Stat.stories.ts';

/** Who this page is written for, and the others it is not. The switch is at
    the top rather than the bottom: somebody who landed on the wrong one has
    already decided by the time they reach a footer. */
const AUDIENCES: readonly { label: string; lead: string }[] = [
  { label: 'agencies', lead: 'You will still be maintaining this in 2031.' },
  { label: 'developers', lead: 'It answers before it guesses, and says which.' },
  { label: 'editors', lead: 'It knows what the thing is called. You do not have to.' },
];

/** The jobs this audience actually has, each said as the job rather than as
    the feature that touches it. An agency does not have a "search" problem;
    it has a "the person who knew this left" problem. */
const JOBS: readonly { label: string; heading: string; body: string }[] = [
  {
    label: 'handover',
    heading: 'The person who knew the project leaves',
    body: 'Every convention that lived in one developer’s head becomes a question somebody has to ask. The answers here are in the installation rather than in that person, so a handover is a directory listing rather than a fortnight.',
  },
  {
    label: 'the long tail',
    heading: 'Sixty sites, four releases between them',
    body: 'A client on 11.5 and a client on 14.3 are two different sets of names. Asked about either, it answers for the release that client is actually on rather than for the newest one you happen to know.',
  },
  {
    label: 'margin',
    heading: 'Support hours you cannot bill',
    body: 'The questions that eat a retainer are small, repeated, and answerable — what an identifier is called, whether a field still exists, what changed in a minor. Those are exactly the ones this takes.',
  },
  {
    label: 'onboarding',
    heading: 'A new developer on an old project',
    body: 'The first fortnight of a project nobody on the team wrote is spent finding out what the last team called things. It runs against their checkout on day one.',
  },
];

/** One figure this audience asked for, with what it was measured against.
    A number an agency cannot put in a calculation is a number they discount. */
const FACTS: readonly StatProps[] = [
  {
    value: '3.5',
    unit: 'h',
    label: 'per developer, per month',
    icon: 'actions-clock',
    note: 'Time not spent answering conventions questions, self-reported by four agencies over one quarter. Their own figures, not ours — and self-reporting is worth what it is worth.',
  },
  {
    value: '0',
    label: 'per-seat charges',
    icon: 'actions-users',
    note: 'Priced per organisation. A tool an agency has to count seats for is a tool that gets installed on two machines and shared.',
  },
  {
    value: '4',
    label: 'releases answered for at once',
    icon: 'actions-tag',
    note: 'One install answers for every client you have, each against the release that client runs.',
  },
];

/** What an agency writes into their own pipeline. Code because that is the
    medium this audience checks a claim in — a screenshot proves nothing to
    somebody who has to run it in CI. */
const CI = `# in your pipeline, against the checkout that is being built
dev-companion check --project . --release auto

  ✓ 61 identifiers resolved
  ! 3 identifiers not in 11.5 — used in EXT:client_theme
  ✓ 0 writes attempted`;

export interface AudiencePageProps extends PageMode {
  audience?: number;
  onAudience?: (index: number) => void;
}

/** The page. `flat` composes the form a static file can hold. */
export function audiencePage({ flat = false, audience = 0, onAudience }: AudiencePageProps = {}): TemplateResult {
  const current = AUDIENCES[audience] ?? AUDIENCES[0];

  const switcher = flat
    ? html`<sds-nav-pills .items="${AUDIENCES.map(({ label }) => ({ label }))}" active="${audience}"></sds-nav-pills>`
    : html`<sds-nav-pills
        .items="${AUDIENCES.map(({ label }) => ({ label }))}"
        active="${audience}"
        @sds-change="${(e: CustomEvent<NavChange>) => onAudience?.(e.detail.index)}"
      ></sds-nav-pills>`;

  const start = flat
    ? html`${buttonMarkup({ variant: 'primary', size: 'lg' }, 'Run it against a client project')}${buttonMarkup(
        { variant: 'secondary', size: 'lg' },
        'The partner programme',
      )}`
    : html`<sds-button variant="primary" size="lg">Run it against a client project</sds-button>
      <sds-button variant="secondary" size="lg">The partner programme</sds-button>`;

  const jobs = JOBS.map(
    (one) => html`<sds-surface
      box-style="min-width:0"
      plane="raised"
      label="${one.label}"
      heading="${one.heading}"
      .body="${html`<p>${one.body}</p>`}"
    ></sds-surface>`,
  );

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(1, '#audience')}

  <main class="sds-bands" id="main-content">

    <section class="sds-band" id="audience">
      <div class="sds-stack">
        <!-- Which reader this page is written for, before the claim rather
             than after it: somebody on the wrong page has already decided by
             the time they reach a footer. -->
        <div class="sds-row">
          <span class="sds-label">written for</span>
          ${switcher}
        </div>
        <h1 class="sds-display">${current?.lead}</h1>
        <p class="sds-lead">
          You did not choose this installation, you will not be the one using
          it every day, and you will still be answering questions about it long
          after both of those have changed. This page is about that.
        </p>
        <div class="sds-actions">${start}</div>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="jobs">
      <div class="sds-stack">
        <h2>Four things that cost you a week each year</h2>
        <p>
          Said as the job rather than as the feature that touches it. Nobody
          has a search problem${NNBSP}— they have a “the person who knew this has
          left” problem, and a feature list does not name that.
        </p>
        ${grid(jobs, { flat, variant: 'wide' })}
      </div>
    </section>

    <section class="sds-band" id="pipeline">
      <div class="sds-split sds-split--center">
        <div class="sds-column">
          <h2>It runs where you already check things</h2>
          <p>
            One command against a checkout, in the pipeline that builds it. It
            reads and reports; it changes nothing, so a failing run is a
            finding rather than a rollback.
          </p>
          <p>
            The interesting line is the second one: an identifier that exists
            in the release you develop against and not in the one the client
            runs. That is the failure this catches before a deployment does.
          </p>
        </div>
        <div class="sds-column">
          <sds-code code-lang="bash" caption="One client project, in CI" source="${CI}" copy></sds-code>
        </div>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="figures">
      <div class="sds-stack">
        <h2>What it is worth, as far as anyone can say</h2>
        <p>
          Three figures with what they were measured against. The first is
          self-reported by four agencies, which is worth exactly what
          self-reporting is worth${NNBSP}— it says so rather than being rounded up
          into a claim.
        </p>
        ${grid(FACTS.map(sdsStat), { flat, variant: 'dense' })}
      </div>
    </section>

    <section class="sds-band" id="objection">
      <div class="sds-split">
        <div class="sds-column">
          <h2>The objection this audience actually has</h2>
          <p>
            Not privacy and not price. It is dependency: another thing in the
            stack that has to be kept alive, explained to a client, and
            replaced when it stops being maintained.
          </p>
          <sds-note
            tone="info"
            heading="Nothing you build depends on it"
            .body="${html`It answers questions about a project; it is not part of one. Remove
              it and every site you have built still builds${NNBSP}— which is the only honest
              answer to “what if this goes away”.`}"
          ></sds-note>
        </div>
        <div class="sds-column">
          <sds-quote
            .body="${'We stopped installing tools that our clients would have to know about. This one they never have to: it is on our machines, not in their projects.'}"
            by="Jonas Riis"
            as="Lead integrator, Nordlys Digital"
            initials="JR"
          ></sds-quote>
        </div>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="elsewhere">
      <div class="sds-stack">
        <h2>Not an agency?</h2>
        <p>
          The other two pages argue the same thing to people with different
          problems. A developer wants to know where an answer came from; an
          editor wants the name of the thing and nothing else.
        </p>
        <div class="sds-actions">
          ${flat
            ? html`${buttonMarkup({ variant: 'secondary' }, 'Written for developers')}${buttonMarkup(
                { variant: 'secondary' },
                'Written for editors',
              )}`
            : html`<sds-button variant="secondary" @click="${() => onAudience?.(1)}">Written for developers</sds-button>
              <sds-button variant="secondary" @click="${() => onAudience?.(2)}">Written for editors</sds-button>`}
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
  title: 'Pages/Audience',
  excludeStories: ['audiencePage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/audience.html',
      title: 'TYPO3 Dev Companion — written for agencies',
      subtitle: 'One audience argued to, the switch at the top, jobs rather than features, and the objection this audience actually has',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the switch at the top changes who the page is written
    for, the block copies itself, and the way across sits before the footer
    rather than in it. */
export const Page: Story = {
  name: 'Audience',
  render: () => {
    /* Which reader the page is written for is the page's state, so pressing a
       name re-renders it. */
    const host = document.createElement('div');
    const draw = (audience: number): void => {
      render(audiencePage({ audience, onAudience: draw }), host);
    };
    draw(0);
    return html`${host}`;
  },
};

export const screenHtml = (): string => part(audiencePage({ flat: true }));
