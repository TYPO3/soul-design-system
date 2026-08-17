/* An instruction read from the top, numbered down one rail.

   The markup lives in `src/components/steps.ts`. The card is generated from
   `Specimen` below: an instruction is a still picture, unlike the accordion
   beside it, so there is one.

   The thing to read rather than look at is what a stop holds — a command, a
   file, the line that says it worked. That is why a stop's content goes
   between its tags, and it is the shape a documentation renderer hands over. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/steps.ts';
import '../../packages/frontend/src/components/code.ts';
import { type Step, type StepsProps } from '../../packages/frontend/src/components/steps.ts';
import { dsCard, part, spec, specCap } from '../lib/specimen.ts';

/** One stop, written out. The demos below are composed of these rather than
    handed the same stops as a property: a property leaves no markup, and the
    source panel under a story that passes one shows an element with nothing in
    it — which is the one thing a reader came to copy. */
export const sdsStep = ({ heading, body, optional, anchor }: Step) =>
  html`<sds-step heading="${heading}" anchor="${anchor ?? ''}" ?optional="${Boolean(optional)}">${body}</sds-step>`;

/** The instruction as a page writes it. */
const composed = ({ steps }: StepsProps) =>
  html`<sds-steps>
  ${steps.map((step) => sdsStep(step))}
</sds-steps>`;

/** The other way in: the set is handed its stops and writes them itself. It is
    also the only form a card can take, an element given content between its
    tags being one a static render cannot see — see `renderStatic` in
    `lib/render.ts`. */
export const sdsSteps = ({ steps }: StepsProps) => html`<sds-steps .steps="${steps}"></sds-steps>`;

/** A command, in the block a command belongs in. */
const command = (text: string): TemplateResult =>
  html`<sds-code code-lang="bash" .body="${[{ kind: 'shell' as const, text }]}"></sds-code>`;

/** The instruction the theme's own installation is. Exported so the card and
    the stories compose these rather than a second copy that says it slightly
    differently. */
export const INSTALL: readonly Step[] = [
  {
    heading: 'Require the package',
    body: html`<p>It brings the renderer, the highlighter and the Markdown
        parser with it, so this one line is all four.</p>
      ${command('composer require typo3/soul-guides-theme')}`,
  },
  {
    heading: 'Select the theme',
    body: html`<p>In <span class="sds-mono">guides.xml</span> beside the
        documents: <span class="sds-mono">theme="soul"</span> names it, and the
        <span class="sds-mono">&lt;extension&gt;</span> element is what makes it
        exist.</p>`,
  },
  {
    heading: 'Draw the signet',
    body: html`<p>A project with no mark takes its title in the bar, which is
        where a name belongs when there is only one.</p>`,
    optional: true,
  },
  {
    heading: 'Render the site',
    body: html`<p>The first command writes documents; the second turns them
        into a site.</p>
      ${command('vendor/bin/guides docs --output=site -c docs')}`,
  },
];

const meta: Meta<StepsProps> = {
  title: 'Components/Steps',
  tags: ['autodocs', '!dev'],
  /* Storybook treats every export as a story. These are the helpers the card
     generator and the sibling stories import. */
  excludeStories: ['INSTALL', 'sdsSteps', 'sdsStep', 'specimenHtml'],
  render: (args) => composed(args),
  args: { steps: INSTALL },
  parameters: {
    dsCard: dsCard({
      path: 'components/content/steps.card.html',
      name: 'An instruction, step by step',
      subtitle: 'Numbers down one rail — the claim that step two follows step one',
      viewport: '700x657',
    }),
  },
};

export default meta;
type Story = StoryObj<StepsProps>;

/** A set is its stops: one `sds-step` per stop, and the set says nothing about
    any of them. The numbers are the set's own count, so a stop inserted in the
    middle renumbers everything under it and no page had to say a number. */
export const Default: Story = {};

/** Nothing optional in it, which is the ordinary case: an instruction whose
    every stop has to happen is an instruction a reader can follow without
    deciding anything. */
export const Required: Story = {
  args: { steps: INSTALL.filter((step) => !step.optional) },
};

/** Two stops, because that is where the rail starts meaning something: one
    numbered box is a paragraph with a disc in front of it. */
export const Short: Story = {
  args: { steps: INSTALL.slice(0, 2) },
};

/** What a stop can hold, which is the reason its content goes between the tags:
    prose, a command, a list — none of it fits in an attribute, and all of it is
    what a documentation renderer hands over. */
export const Blocks: Story = {
  render: () => html`<sds-steps>
    <sds-step heading="Write the story">
      <p>The card is generated from it, so the story is where a component is
        shown rather than described.</p>
      <ul>
        <li>the element and its classes</li>
        <li>the story every card is generated from</li>
      </ul>
    </sds-step>
    <sds-step heading="Run the gate" anchor="run-the-gate">
      <p>Nothing is finished before it is green.</p>
      ${command('make verify')}
    </sds-step>
  </sds-steps>`,
};

/** The form a page uses when it already holds its instruction as data — and the
    only form a card can take, because a card is rendered without a browser. The
    panel below shows an empty element and says the truth: a property leaves no
    markup, which is why every demo above is written out. */
export const FromData: Story = {
  render: (args) => sdsSteps(args),
};

export const specimenHtml = (): string =>
  spec([
    part(sdsSteps({ steps: INSTALL })),
    specCap('ROLE=LIST · THE NUMBER IS A COUNTER · AN UNFILLED DISC IS A STOP THAT MAY BE SKIPPED'),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
