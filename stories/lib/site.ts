/* What every page of one site has in common.

   A page layout is the system's; what a *site* repeats is not — its sections,
   its columns of links, the line saying what the product is. A copy per page is
   where those start to disagree, and a footer with four columns on one page and
   five on the next is not a decision anybody made. So the chrome is written
   once and each page says which section it is in. Nothing here is a
   component. */

import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/footer.ts';
import '../../packages/frontend/src/components/menu.ts';
import '../../packages/frontend/src/components/search.ts';
import '../../packages/frontend/src/components/image.ts';
import '../../packages/frontend/src/components/theme.ts';
import { type FooterGroup, type FooterLink } from '../../packages/frontend/src/components/footer.ts';

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
  { label: 'MIT', href: '#' },
  { label: 'docs.typo3.org', href: 'https://docs.typo3.org', external: true },
];

/** The header, with this page's section marked current. `railFor` is the id of
    a page rail where there is one. The same parts as the header the guides
    theme renders, search included, because this is the bar
    `tests/pages.spec.ts` opens at every width — one box lighter, it has room
    the real header does not. */
export const siteBar = (active: number, home = '#', railFor = ''): TemplateResult =>
  html`<header class="sds-bar">
    ${railFor ? html`<sds-menu for="${railFor}" label="Sections of this page"></sds-menu>` : ''}
    <a class="sds-lockup" href="${home}">
      <sds-image class="sds-signet" src="../assets/design-system-signet-m.svg" alt="" width="24" height="24"></sds-image>
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
  html`<sds-footer .groups="${SITE_GROUPS}" note="${SITE_NOTE}" .meta="${SITE_META}"
    signet="../assets/design-system-signet-m.svg" brand="TYPO3" product="Dev Companion"></sds-footer>`;
