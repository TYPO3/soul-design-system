/* A boundary, drawn as an answer.

   The markup lives in `src/components/empty.ts`. The specimen card for this is
   generated from `Specimens/States/Empty & not found`, which is where the two
   kinds are shown side by side — that comparison is the documentation, and it
   is the only place the difference between them is visible.

   What is here is the component's own surface: what each property is for, and
   what happens when one is left out. `NoResults` is the story worth reading —
   it is what this component exists to make hard to write. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../../packages/frontend/src/components/empty.ts';
import { type EmptyProps } from '../../packages/frontend/src/components/empty.ts';

const sdsEmpty = ({ kind = 'quiet', heading, body, icon, action, href, meta }: EmptyProps) =>
  html`<sds-empty
    kind="${kind}"
    heading="${heading}"
    .body="${body}"
    icon="${ifDefined(icon)}"
    action="${action ?? ''}"
    href="${href ?? ''}"
    meta="${meta ?? ''}"
    box-style="max-width:480px"
  ></sds-empty>`;

const meta: Meta<EmptyProps> = {
  title: 'Components/Empty',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsEmpty(args),
  argTypes: {
    kind: { control: 'inline-radio', options: ['quiet', 'boundary'] },
    heading: { control: 'text' },
    body: { control: 'text' },
    action: { control: 'text' },
    meta: { control: 'text' },
    icon: { control: 'select', options: [undefined, 'actions-search', 'actions-info-circle', 'actions-filter'] },
  },
  args: {
    kind: 'quiet',
    heading: 'No icon matches “dashbord”',
    body: 'The installation was asked and answered; the identifier does not exist in it.',
    action: 'Search all registered icons',
    href: '#',
  },
};

export default meta;
type Story = StoryObj<EmptyProps>;

/** An empty result: the source was asked and replied with nothing. The glyph
    is muted, because nothing here is an event. */
export const Quiet: Story = {
  args: {
    kind: 'quiet',
    heading: 'No icon matches “dashbord”',
    body: html`The installation was asked and answered; the identifier does not exist in
      it. Closest registered: <span class="sds-mono">actions-dashboard</span>.`,
    action: 'Search all registered icons',
    href: '#',
  },
};

/** A statement about scope. The question is outside what this server covers,
    which is a deliberate answer — and the reason `actions-info-circle` is one
    of the four glyphs allowed to stand alone. */
export const Boundary: Story = {
  args: {
    kind: 'boundary',
    heading: 'Outside what this server covers',
    body: 'Frontend rendering has no bundled answer and is not read from the installation. Stated as a boundary rather than left silent.',
    meta: 'typo3_server_scope · boundaries',
  },
};

/** A filter that matched nothing. The source is the list itself, so the body
    names the filter and the action undoes it — the nearest real thing to offer.
    No `href`, because undoing a filter changes this page rather than leaving
    it, so the offer is a button and says `sds-action`. */
export const Filtered: Story = {
  args: {
    kind: 'quiet',
    icon: 'actions-filter',
    heading: 'Nothing tagged “release” in this month',
    body: 'Six entries were read and none carries that tag. The tag is applied by hand, so an entry may be about a release without wearing it.',
    action: 'Show every entry',
  },
};

/** What this component exists to make hard to write. It is a legal set of
    properties and it is the failure the rules name: which source answered,
    what it does not cover and what to do instead are all missing, so the
    reader cannot tell an empty answer from a broken one. */
export const NoResults: Story = {
  args: { kind: 'quiet', heading: 'No results', body: '', action: '' },
};
