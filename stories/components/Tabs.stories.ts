/* Tabs.

   The markup lives in `src/components/tabs.ts` and `tab-item.ts`. A tab is a
   label and a panel, and the component holds the two together — the stories
   below are the composed form, because that is the component.

   No `parameters.dsCard`: the three navigations share one card, composed in
   `Navigation.stories.ts`. A card carries no script and cannot switch a
   panel, so what it documents is the bar. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/tabs.ts';
import '../../src/components/code.ts';

const meta: Meta = {
  title: 'Components/Tabs',
  tags: ['autodocs', '!dev'],
  args: { active: 0 },
  argTypes: { active: { control: { type: 'number', min: 0 } } },
};

export default meta;
type Story = StoryObj;

/** The component: each item carries its own content, so nothing outside has
    to keep a label and a panel in step. Press a tab, or use the arrow keys —
    the focus follows the selection, which is what a tablist does. */
export const Default: Story = {
  render: ({ active }) => html`
    <sds-tabs active="${active ?? 0}">
      <sds-tab-item label="standalone">
        <p>Clone it, install once, then point a project at the binary.</p>
      </sds-tab-item>
      <sds-tab-item label="as a dependency">
        <p>Require it, and the binary arrives in <span class="sds-mono">vendor/bin</span>.</p>
      </sds-tab-item>
      <sds-tab-item label="ddev">
        <p>Run it inside the container the site runs in, so the versions agree.</p>
      </sds-tab-item>
    </sds-tabs>
  `,
};

/** A tab may carry a glyph where its subject has one — never as decoration on
    a set that reads fine without. */
export const WithIcons: Story = {
  render: () => html`
    <sds-tabs>
      <sds-tab-item label="answer" icon="actions-message">
        <p>What the tool said, as it said it.</p>
      </sds-tab-item>
      <sds-tab-item label="request" icon="actions-code">
        <p>The call that produced it, arguments included.</p>
      </sds-tab-item>
      <sds-tab-item label="timing" icon="actions-clock">
        <p>How long it took, and where the time went.</p>
      </sds-tab-item>
    </sds-tabs>
  `,
};

/** Anything may be in a panel, components included — the item holds nodes,
    not a string. What is not showing stays in the document, so a find-in-page
    reaches it. */
export const Composed: Story = {
  render: () => html`
    <sds-tabs>
      <sds-tab-item label="install">
        <sds-code code-lang="bash" copy>composer require typo3/cms-core</sds-code>
      </sds-tab-item>
      <sds-tab-item label="configure">
        <sds-code code-lang="yaml" copy>versions:
  - "13.4"
  - "14.3"</sds-code>
      </sds-tab-item>
    </sds-tabs>
  `,
};
