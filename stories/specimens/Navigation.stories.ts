/* The navigation specimen card.

   Pills, tabs and the rail are documented one per file — `Pills.stories.ts`,
   `Tabs.stories.ts`, `Rail.stories.ts`. What is left here is the card they
   share, `components/navigation/navigation.card.html`, which shows the three
   beside each other because the rule being documented is the one they have in
   common: the active item is a filled block, never a tint.

   This file is not a page. It carries no `autodocs`, so nothing of it appears
   in the sidebar — a reader looking for tabs wants the tab component, not the
   composition a still picture is made of. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../src/components/pills.ts';
import { tabsBarMarkup } from '../../src/components/tabs.ts';
import '../../src/components/rail.ts';
import { type NavProps } from '../../src/components/nav-base.ts';
import { dsCard, part, specCol, specPad } from '../lib/specimen.ts';

const nav = (tag: 'sds-pills' | 'sds-rail', { items, active = 0 }: NavProps) =>
  tag === 'sds-pills'
    ? html`<sds-pills .items="${items}" active="${active}"></sds-pills>`
    : html`<sds-rail .items="${items}" active="${active}"></sds-rail>`;

/* A card is opened without a script, so nothing on it can be pressed and what
   it shows is which item is current.

   The tab bar comes from `tabsBarMarkup` rather than from `<sds-tabs>`: tabs
   are composed of items that carry their own panels, and `renderStatic`
   flattens no element that was given children. It is the function the element
   renders, so the card cannot drift from the browser. */
const PILLS: NavProps = { items: ['overview', 'tools', 'knowledge'], active: 0 };
const TABS = [{ label: 'standalone' }, { label: 'as a dependency' }, { label: 'ddev' }];
const RAIL: NavProps = { items: ['typo3_icon_lookup', 'typo3_label_lookup', 'typo3_schema_lookup'], active: 0 };

const meta: Meta = {
  title: 'Specimens/Navigation',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
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
type Story = StoryObj;

export const specimenHtml = (): string =>
  specPad(
    [
      specCol(
        [
          part(nav('sds-pills', PILLS)),
          part(tabsBarMarkup(TABS, 0)),
          '<div class="spec-cap">PILL NAV FOR SECTIONS · UNDERLINE TABS INSIDE A PANEL</div>',
        ],
        'display:flex; flex-direction:column; gap:14px; flex:1; min-width:300px;',
      ),
      specCol(
        ['<span class="spec-cap">TOOL SURFACE</span>', part(nav('sds-rail', RAIL))],
        'width:210px; display:flex; flex-direction:column; gap:9px;',
      ),
    ],
    'display:flex; gap:26px; flex-wrap:wrap;',
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
