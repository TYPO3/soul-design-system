/* The form, and the two states that follow it.

   What a form page carries is not the controls but the three states a form is
   in, most being drawn in the first alone:

     the form      labels above, hints under, nothing silently required
     it failed     a summary at the top, focused, each entry a link to its field
     it was sent   what was sent, what happens next, and how long that takes

   The submit is real, so the error state is reachable by pressing a button
   rather than by a second story. See `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, render, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/checkbox.ts';
import '../../packages/frontend/src/components/crumbs.ts';
import '../../packages/frontend/src/components/field.ts';
import '../../packages/frontend/src/components/form-errors.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/radio.ts';
import '../../packages/frontend/src/components/surface.ts';
import { buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { type Crumb } from '../../packages/frontend/src/components/crumbs.ts';
import { type FormError } from '../../packages/frontend/src/components/form-errors.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';

const TRAIL: readonly Crumb[] = [
  { label: 'Overview', href: '#' },
  { label: 'Project', href: '#' },
  { label: 'Report a wrong answer' },
];

const RELEASES = ['12.4', '13.4', '14.3', 'main'];

const REPLY = [
  { label: 'Email', value: 'email', hint: 'One reply, to the address above. Nothing else is sent there.' },
  { label: 'In the repository', value: 'repository', hint: 'The report becomes an issue, and the thread is public.' },
  { label: 'No reply', value: 'none', hint: 'It is read and filed. Nothing comes back.' },
];

const CHANNELS = [
  {
    icon: 'actions-brand-github' as const,
    label: 'the repository',
    heading: 'A bug in the server itself',
    body: 'Crashes, a tool that does not register, anything reproducible from a checkout. An issue is faster than this form.',
  },
  {
    icon: 'actions-book' as const,
    label: 'documentation',
    heading: 'A page that is wrong',
    body: 'Documentation is not answered from here. The page itself carries the way to report what it says.',
  },
  {
    icon: 'actions-shield' as const,
    label: 'security',
    heading: 'Something that should not be public',
    body: 'A finding that affects an installation goes to the security address instead, and never through this form.',
  },
];

/** Which of the three states the page is in. */
export type ContactState = 'form' | 'failed' | 'sent';

export interface ContactMode extends PageMode {
  state?: ContactState;
  /** What the submit found. Only ever set with `failed`. */
  errors?: readonly FormError[];
  /** The failures are the result of a submit just made, so the summary takes
      the focus. A page drawn in the failed state without it moves nobody. */
  announce?: boolean;
  onSubmit?: () => void;
  onAgain?: () => void;
}

/** The page. `flat` composes the form a static file can hold. */
export function contactPage({ flat = false, state = 'form', errors = [], announce = false, onSubmit, onAgain }: ContactMode = {}): TemplateResult {
  /* The one place the two renderings differ: a button's label is content, and
     `renderStatic` flattens no element that was given children. */
  const send = flat
    ? buttonMarkup({ variant: 'primary' }, html`<sds-icon name="actions-paperplane"></sds-icon>Send the report`)
    : html`<sds-button variant="primary" @click="${() => onSubmit?.()}"><sds-icon name="actions-paperplane"></sds-icon>Send the report</sds-button>`;
  const again = flat
    ? buttonMarkup({ variant: 'secondary' }, 'Report another answer')
    : html`<sds-button variant="secondary" @click="${() => onAgain?.()}">Report another answer</sds-button>`;

  const failed = (id: string): string => errors.find((e) => e.for === id)?.message ?? '';

  const form = html`<form class="sds-form" @submit="${(e: Event) => e.preventDefault()}">
          ${state === 'failed'
            ? html`<sds-form-errors .errors="${errors}" ?announce="${announce}"></sds-form-errors>`
            : ''}

          <sds-field
            caption="Your email"
            field-id="email"
            name="email"
            type="email"
            value="you@example.org"
            min-width="420"
            hint="Used for the reply and for nothing else. It is not stored with the report."
            error="${failed('email')}"
          ></sds-field>

          <sds-radio
            legend="How should we come back to you?"
            name="reply"
            .choices="${REPLY}"
            value="email"
          ></sds-radio>

          <sds-field
            caption="Which release is this about?"
            field-id="release"
            name="release"
            select
            .options="${RELEASES}"
            value="13.4"
            filled
            min-width="220"
            hint="The release the installation runs, not the one the answer named."
            error="${failed('release')}"
          ></sds-field>

          <sds-field
            caption="What did the tool answer, and what should it have answered?"
            field-id="message"
            name="message"
            rows="6"
            required
            min-width="420"
            value="The tool, the question, and what came back."
            hint="The tool name and the question are enough to reproduce it. A screenshot is not."
            error="${failed('message')}"
          ></sds-field>

          <sds-checkbox
            name="scope"
            label="Attach the server scope"
            hint="Sends the versions, which sources were reachable, and which tools are degraded. No file contents, and no credentials."
            checked
          ></sds-checkbox>

          <sds-checkbox
            name="public"
            label="This report may be quoted in the changelog"
            hint="Without your address, and without anything the scope carries."
          ></sds-checkbox>

          <div class="sds-actions">${send}</div>
        </form>`;

  const sent = html`<div class="sds-stack">
          <sds-note
            tone="ok"
            heading="The report was sent · 6 answers, and the server scope"
            .body="${html`Nothing else left this machine. The scope is attached exactly as the
              page showed it, and the address is used for the reply alone.`}"
          ></sds-note>
          <p>
            It is read by a person, usually within two working days. A report
            about bundled knowledge that turns out to be wrong becomes a
            changelog entry, and the entry names the release it was fixed in —
            not the person who reported it.
          </p>
          <div class="sds-row">
            <span class="sds-label">reference</span>
            <span class="sds-mono">RPT-2026-0814</span>
          </div>
          <div class="sds-actions">
            ${again}
            <sds-link label="Back to the news" href="#"></sds-link>
          </div>
        </div>`;

  return html`<div class="sds-shell">
  ${skipLink()}
  <!-- No section is current: the form hangs under Project, which is a footer
       column rather than one of the five the header carries. Marking the
       nearest one instead would tell the reader they are somewhere they are
       not. -->
  ${siteBar(-1, '#contact')}

  <main class="sds-bands" id="main-content">

    <section class="sds-band" id="contact">
      <div class="sds-stack sds-stack--tight">
        <sds-crumbs .items="${TRAIL}"></sds-crumbs>
        <h1>Report a wrong answer</h1>
        <p class="sds-lead">
          An answer that names its source can be checked, and one that is wrong
          can be fixed in the source rather than argued about. This form is how
          the second half of that happens.
        </p>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="report">
      <div class="sds-split">
        ${state === 'sent' ? sent : form}

        <div class="sds-stack">
          <span class="sds-label">What happens to it</span>
          <p>
            It is read by a person. Where the answer came from bundled
            knowledge, the fix is a change to that knowledge and ships with the
            next release; where it came from your installation, the reply says
            what the tool read and why it read that.
          </p>
          <sds-note
            heading="Nothing is collected that you did not attach"
            .body="${html`The scope is the only thing beyond the six answers, it is optional,
              and what it holds is listed beside the box. No page on this site
              carries an analytics script.`}"
          ></sds-note>
          <p>
            Typical turnaround is two working days${NNBSP}— longer where the answer
            has to be reproduced against a release the project no longer runs.
          </p>
        </div>
      </div>
    </section>

    <section class="sds-band" id="elsewhere">
      <div class="sds-stack">
        <h2>Three things that go elsewhere</h2>
        <p>
          This form is for an answer that was wrong. These are not that, and
          sending them here makes them slower rather than faster.
        </p>
        ${grid(
          CHANNELS.map(
            (one) => html`<sds-surface
              icon="${one.icon}"
              label="${one.label}"
              heading="${one.heading}"
              body="${one.body}"
            ></sds-surface>`,
          ),
          { flat },
        )}
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
  title: 'Pages/Contact',
  excludeStories: ['contactPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/contact.html',
      title: 'TYPO3 Dev Companion — report a wrong answer',
      subtitle: 'A form, what it does when it fails, and what it says when it succeeds',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** What the submit found. Read from the controls rather than decided here: a
    form whose failures are a fixture proves the box is red and nothing else. */
function check(host: HTMLElement): FormError[] {
  /* Read off the control itself and not off the element's `value`, which is
     the placeholder until something is typed. What is in the box is what the
     reader answered. */
  const value = (id: string): string =>
    (host.querySelector(`#${id}`) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? '';

  const found: FormError[] = [];
  const email = value('email');
  if (!email.trim()) found.push({ message: 'An email address is needed for a reply by email', for: 'email' });
  else if (!email.includes('@')) found.push({ message: `“${email}” is not an email address`, for: 'email' });
  if (!value('message').trim()) found.push({ message: 'The message is empty — say what the tool answered', for: 'message' });
  return found;
}

/** Click through it: empty the message or the address and press send. The
    summary appears at the top, takes the focus, and each line in it goes to
    the field it is about. Fill both and the page says what it sent. */
export const Page: Story = {
  name: 'Contact',
  render: () => {
    const host = document.createElement('div');
    const draw = (state: ContactState, errors: readonly FormError[] = []): void => {
      render(
        contactPage({
          state,
          errors,
          /* Pressed by the reader, so the summary is where they are sent. */
          announce: true,
          onSubmit: () => {
            const found = check(host);
            draw(found.length ? 'failed' : 'sent', found);
          },
          onAgain: () => draw('form'),
        }),
        host,
      );
    };
    draw('form');
    return html`${host}`;
  },
};

/** The state after a submit that found something. The summary is first,
    focusable and announced; the fields it names carry the same sentence, so
    what is wrong is legible from either end of the form. */
export const Failed: Story = {
  render: () =>
    contactPage({
      state: 'failed',
      errors: [
        { message: 'An email address is needed for a reply by email', for: 'email' },
        { message: 'The message is empty — say what the tool answered', for: 'message' },
      ],
    }),
};

/** What it says when it worked: what was sent, what happens to it, how long
    that takes, and a reference. A page that says "thank you" and stops has
    taken something and given nothing back. */
export const Sent: Story = { render: () => contactPage({ state: 'sent' }) };

export const screenHtml = (): string => part(contactPage({ flat: true }));
