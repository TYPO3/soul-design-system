/* What every page of one site has in common.

   A page layout is the system's; what a *site* repeats is not — its sections,
   its columns of links, the line that says what the product is. Those were
   about to be a copy per page, and the second copy is where they start to
   disagree: a footer with four columns on one page and five on the next is
   not a design decision anybody made.

   So the chrome is written once and each page says which section it is in.
   Nothing here is a component: it is this site's content, and a second site
   built on this system would have its own file exactly like it. */

import { html, type TemplateResult } from 'lit';
import '../../src/components/badge.ts';
import '../../src/components/footer.ts';
import '../../src/components/menu.ts';
import '../../src/components/search.ts';
import '../../src/components/image.ts';
import '../../src/components/theme.ts';
import { type FooterGroup, type FooterLink } from '../../src/components/footer.ts';

/* The site's sections. They are other pages rather than places on this one,
   and a static screen carries no site around it — so the targets are stubs and
   the menu is documented by what it does at width, which is the same on every
   page that has one. */
export const SECTIONS = [
  { label: 'overview', href: '#' },
  { label: 'features', href: '#' },
  { label: 'documentation', href: '#' },
  { label: 'tools', href: '#' },
  { label: 'news', href: '#' },
];

/** The columns the footer carries on every page. */
export const SITE_GROUPS: readonly FooterGroup[] = [
  {
    label: 'Product',
    items: [
      { label: 'Overview', href: '#' },
      { label: 'Features', href: '#' },
      { label: 'Tool reference', href: '#' },
      { label: 'Releases', href: '#' },
    ],
  },
  {
    label: 'Documentation',
    items: [
      { label: 'Installing the server', href: '#' },
      { label: 'Writing a task skill', href: '#' },
      { label: 'Sources and preconditions', href: '#' },
      { label: 'docs.typo3.org', href: 'https://docs.typo3.org', external: true },
    ],
  },
  {
    label: 'Project',
    items: [
      { label: 'What is written down', href: '#' },
      { label: 'Reporting a wrong answer', href: '#' },
      { label: 'Contributing', href: '#' },
    ],
  },
  /* Where a mark says what the link is rather than decorating it. Every one of
     them keeps its label: four glyphs in this system may stand alone, and all
     four say something about a result. */
  {
    label: 'Community',
    items: [
      { label: 'Repository', href: 'https://github.com', external: true, icon: 'actions-brand-github' },
      { label: 'Slack', href: 'https://typo3.org', external: true, icon: 'actions-brand-slack' },
      { label: 'Mastodon', href: 'https://typo3.org', external: true, icon: 'actions-brand-mastodon' },
      { label: 'Bluesky', href: 'https://typo3.org', external: true, icon: 'actions-brand-bluesky' },
    ],
  },
  {
    label: 'Legal',
    items: [
      { label: 'Licence', href: '#' },
      { label: 'Imprint', href: '#' },
      { label: 'Privacy', href: '#' },
    ],
  },
];

/** The line that has to be on every page. It says what the product is; it
    never says whose it is, and no surface here may imply an endorsement it
    does not have. */
export const SITE_NOTE =
  'An independent development tool. Not a product of the TYPO3 Association, and not endorsed by it.';

export const SITE_META: readonly FooterLink[] = [
  { label: 'GPL-2.0-or-later', href: '#' },
  { label: 'docs.typo3.org', href: 'https://docs.typo3.org', external: true },
];

/** The header, with the section this page is in marked current.

    `railFor` is the id of a page rail, where the page has one. The toggle that
    opens it lives in the bar and appears only at the width the rail has no
    column of its own — which is the layout's decision, not this file's.

    The same five parts as the header the guides theme renders, and the search
    is in the list for that reason rather than because a story needs one: this
    is the bar `tests/pages.spec.ts` opens at every width, and for as long as it
    was one box lighter than the shipped one it had 260px of room the real
    header does not. The narrow widths passed here and overlapped there. With
    no index given the field finds nothing, which is all a layout test asks of
    it. */
export const siteBar = (active: number, home = '#', railFor = ''): TemplateResult =>
  html`<header class="sds-bar">
    ${railFor ? html`<sds-menu for="${railFor}" label="Sections of this page"></sds-menu>` : ''}
    <a class="sds-lockup" href="${home}">
      <sds-image class="sds-signet" src="../assets/design-system-signet-m.svg" alt="" width="20" height="20"></sds-image>
      <span class="sds-wordmark">TYPO3<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">Dev Companion</span></span>
    </a>
    <sds-menu label="Sections" .items="${SECTIONS}" active="${active}"></sds-menu>
    <div class="sds-bar__end">
      <sds-badge label="1.4.0" tone="accent"></sds-badge>
      <sds-search label="Search"></sds-search>
      <sds-theme></sds-theme>
    </div>
  </header>`;

/** The end of the site. */
export const siteFooter = (): TemplateResult =>
  html`<sds-footer .groups="${SITE_GROUPS}" note="${SITE_NOTE}" .meta="${SITE_META}"></sds-footer>`;
