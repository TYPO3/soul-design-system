/* What an answer carries besides the answer.

   The markup lives in `src/components/note.ts`. Four tones, and each of them
   is a different thing to say about a result: where it came from, that it is
   degraded but usable, that there is none, or a fact about the surface rather
   than about any result at all.

   No `parameters.dsCard`: the notes are drawn on the States cards under
   `guidelines/`, beside the other things a surface says when it cannot simply
   answer. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/note.ts';
import { type NoteProps } from '../../src/components/note.ts';

const meta: Meta<NoteProps> = {
  title: 'Components/Note',
  tags: ['autodocs', '!dev'],
  /* `.icon` as a property and not an attribute: an empty `icon=""` is a name
     no icon has, and the element would have taken it over the tone's own. */
  render: ({ tone, heading, body, icon }) =>
    html`<sds-note tone="${tone ?? 'info'}" .icon="${icon}" heading="${heading}" .body="${body}"></sds-note>`,
  argTypes: {
    tone: { control: 'inline-radio', options: ['info', 'ok', 'warn', 'error'] },
    heading: { control: 'text' },
    body: { control: 'text' },
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
    heading: 'Your installation could not be booted — packages were read instead',
    body: html`So this answer omits anything a running extension would add.
      <span class="sds-mono">ddev start</span> would close the gap.`,
  },
};

/** No answer at all. It says what was looked for and where, so the next thing
    to try is in the message rather than in the documentation. */
export const Failed: Story = {
  args: {
    tone: 'error',
    heading: 'No project found at this working directory',
    body: html`Discovery looked for <span class="sds-mono">composer.json</span> and a
      TYPO3 package and found neither.`,
  },
};

/** A fact about the surface rather than about a result: the icon is muted,
    because nothing here has gone wrong. */
export const Aside: Story = {
  args: {
    tone: 'info',
    heading: 'Three tools need a bootable installation',
    body: html`Without one they read the package registry instead, which answers with a
      subset that looks like the whole. <span class="sds-mono">ddev start</span>
      removes the gap.`,
  },
};
