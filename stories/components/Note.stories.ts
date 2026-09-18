/* What an answer carries besides the answer.

   The markup lives in `src/components/note.ts`. Four tones, and each of them
   is a different thing to say about a result. Where it came from, that it
   runs degraded but usable, that there is none. Or a fact about the surface
   rather than about any result at all.

   No `parameters.dsCard`: the notes stand on the States cards under
   `guidelines/`, beside the other things a surface says when it cannot simply
   answer. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/code.ts';
import { type NoteProps } from '../../packages/frontend/src/components/note.ts';


export const sdsNote = ({ tone, heading, body, icon, action, href }: NoteProps) =>
  html`<sds-note
    tone="${ifDefined(tone)}"
    heading="${ifDefined(heading)}"
    .body="${body ?? ''}"
    icon="${ifDefined(icon)}"
    action="${ifDefined(action)}"
    href="${ifDefined(href)}"
  ></sds-note>`;

const meta: Meta<NoteProps> = {
  title: 'Components/Feedback/Note',
  tags: ['autodocs', '!dev'],
  /* `.icon` as a property and not an attribute. An empty `icon=""` is a name
     no icon has, and the element takes it over the tone's own. */
  render: ({ tone, heading, body, icon, action, href }) =>
    html`<sds-note tone="${tone ?? 'info'}" .icon="${icon}" heading="${heading}" .body="${body}"
      action="${action ?? ''}" href="${href ?? ''}"></sds-note>`,
  argTypes: {
    tone: { control: 'inline-radio', options: ['info', 'ok', 'warn', 'error'] },
    heading: { control: 'text' },
    body: { control: 'text' },
    action: { control: 'text' },
  },
  args: {
    tone: 'ok',
    heading: 'Answered from bundled knowledge · 13.4',
    body: 'Holds on 13.4 and main. It does not hold on 12.4, where the old resolution order is still in place.',
  },
};

export default meta;
type Story = StoryObj<NoteProps>;

/** The source of an answer, and the versions it holds for. Both belong in the
    answer rather than in a footnote under it. */
export const Answered: Story = {};

/** Degraded but usable — the one tone that tints the whole block, because
    what it says is about this answer and not about the page. It names the
    command that closes the gap. */
export const Degraded: Story = {
  args: {
    tone: 'warn',
    heading: 'Your installation did not boot — the packages answered instead',
    body: html`So this answer omits anything an extension adds at run time.
      <span class="sds-mono">ddev start</span> closes the gap.`,
  },
};

/** No answer at all. It says what the search was for and where, so the next
    thing to try is in the message rather than in the documentation. */
export const Failed: Story = {
  args: {
    tone: 'error',
    heading: 'No project found at this working directory',
    body: html`Discovery looked for <span class="sds-mono">composer.json</span> and a
      TYPO3 package and found neither.`,
  },
};

/** A fact about the surface rather than about a result: the icon stays
    muted, because nothing here has gone wrong. */
export const Aside: Story = {
  args: {
    tone: 'info',
    heading: 'Three tools need a bootable installation',
    body: html`Without one they read the package registry instead, which answers with a
      subset that looks like the whole. <span class="sds-mono">ddev start</span>
      removes the gap.`,
  },
};

/** A message that carries the one thing to do about it. The label is a
    property rather than a button between the tags. So every message a product
    shows offers its answer as the same control in the same place. A note
    nobody can act on still carries none. */
export const Actionable: Story = {
  args: {
    tone: 'info',
    heading: '',
    body: 'Two worktrees look finished.',
    action: 'Clean up',
  },
};

/** The same message where the answer is a place rather than a decision. It
    draws a link, and a press on it announces nothing. The link itself is the
    answer, and the browser's own middle-click and status line come with it. */
export const ActionElsewhere: Story = {
  args: {
    tone: 'warn',
    heading: 'The index is a day old',
    body: 'Pages published since yesterday are not in it yet.',
    action: 'Open the run',
    href: '#',
  },
};

/** The form a renderer uses: the body between the tags, and no heading at all.
    `.body` is prose a product surface composed and it exports. Content between
    the tags is a document's own markup, which an attribute flattens. Most
    admonitions carry no title, so the word goes to the glyph. This form has
    no export — see `FromContent` in `Code.stories.ts`. */
export const FromContent: Story = {
  render: () => html`<sds-note tone="warn" label="Caution">
    <p>A cache that is warm from before the change answers with what was true
      then. Two things follow, and only the second is obvious:</p>
    <ul>
      <li>the page a reader sees is the old one</li>
      <li>every page that <em>links</em> it is stale too</li>
    </ul>
    <sds-code code-lang="bash" copy>vendor/bin/typo3 cache:flush</sds-code>
  </sds-note>`,
};
