/* Tabs and the tool rail.

   The markup lives in `src/components/pills.ts`, `tabs.ts` and `rail.ts`,
   over the base they share in `nav-base.ts`. Three navigations, one rule: the
   active item is a filled block, never a tint. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../src/components/pills.ts';
import '../src/components/tabs.ts';
import '../src/components/rail.ts';
import { type NavProps } from '../src/components/nav-base.ts';
import { dsCard, part, specCol, specPad } from './lib/specimen.ts';

const nav = (tag: 'sds-pills' | 'sds-tabs' | 'sds-rail', { items, active = 0 }: NavProps) =>
  tag === 'sds-pills'
    ? html`<sds-pills .items="${items}" active="${active}"></sds-pills>`
    : tag === 'sds-tabs'
      ? html`<sds-tabs .items="${items}" active="${active}"></sds-tabs>`
      : html`<sds-rail .items="${items}" active="${active}"></sds-rail>`;

const meta: Meta<NavProps> = {
  title: 'Components/Navigation',
  tags: ['autodocs', '!dev'],
  /* Storybook treats every export as a story. These are the helpers the
     card generator and the sibling stories import. */
  excludeStories: ['specimenHtml'],
  render: (args) => nav('sds-pills', args),
  argTypes: {
    items: { control: 'object' },
    active: { control: { type: 'number', min: 0 } },
  },
  args: { items: ['overview', 'tools', 'knowledge'], active: 0 },
  parameters: {
    dsCard: dsCard({
      path: 'components/navigation/navigation.card.html',
      name: 'Tabs & tool rail',
      subtitle: 'Active is a filled block, not a tint',
      viewport: '700x150',
    }),
  },
};

export default meta;
type Story = StoryObj<NavProps>;

/** Pill navigation, for the sections of a page. */
export const Pills: Story = { args: { items: ['overview', 'tools', 'knowledge'], active: 0 } };

/** Underline tabs, for switching the content of a panel rather than the page. */
export const Tabs: Story = {
  render: (args) => nav('sds-tabs', args),
  args: { items: ['standalone', 'as a dependency', 'ddev'], active: 0 },
};

/** The 210px tool rail. Items are tool names, so they set in mono verbatim. */
export const ToolRail: Story = {
  render: (args) => html`<div style="width:210px">${nav('sds-rail', args)}</div>`,
  args: { items: ['typo3_icon_lookup', 'typo3_label_lookup', 'typo3_schema_lookup'], active: 0 },
};

export const specimenHtml = (): string =>
  specPad(
    [
      specCol(
        [
          part(nav('sds-pills', Pills.args as NavProps)),
          part(nav('sds-tabs', Tabs.args as NavProps)),
          '<div class="spec-cap">PILL NAV FOR SECTIONS · UNDERLINE TABS INSIDE A PANEL</div>',
        ],
        'display:flex; flex-direction:column; gap:14px; flex:1; min-width:300px;',
      ),
      specCol(
        ['<span class="spec-cap">TOOL SURFACE</span>', part(nav('sds-rail', ToolRail.args as NavProps))],
        'width:210px; display:flex; flex-direction:column; gap:9px;',
      ),
    ],
    'display:flex; gap:26px; flex-wrap:wrap;',
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
