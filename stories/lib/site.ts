/* What every page of one site has in common.

   A page layout is the system's; what a *site* repeats is not — its sections,
   its columns of links, the line saying what the product is. A copy per page is
   where those start to disagree, and a footer with four columns on one page and
   five on the next is not a decision anybody made. So the chrome is written
   once and each page says which section it is in. Nothing here is a
   component. */

import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/footer.ts';
import '../../packages/frontend/src/components/nav-main.ts';
import { type FooterGroup, type FooterLink } from '../../packages/frontend/src/components/footer.ts';
import { type MenuEntry } from '../../packages/frontend/src/components/nav-base.ts';

/* The site, as the one entry every navigation on it is given: the sections
   under it, and the pages under those. They are other pages rather than places
   on this one, and a static screen carries no site around it — so the targets
   are stubs and the menu is documented by what it does at width, which is the
   same on every page that has one. */
export const SITE: MenuEntry = {
  label: 'Dev Companion',
  items: [
    { label: 'overview', href: '#' },
    {
      label: 'features',
      href: '#',
      items: [
        { label: 'What it answers', href: '#' },
        { label: 'What it refuses', href: '#' },
        { label: 'Where the answers come from', href: '#' },
      ],
    },
    {
      label: 'documentation',
      href: '#',
      items: [
        { label: 'Installing the server', href: '#' },
        { label: 'Writing a task skill', href: '#' },
        { label: 'Sources and preconditions', href: '#' },
      ],
    },
    {
      label: 'tools',
      href: '#',
      items: [
        { label: 'typo3_icon_lookup', href: '#' },
        { label: 'typo3_label_lookup', href: '#' },
        { label: 'typo3_schema_lookup', href: '#' },
      ],
    },
    { label: 'news', href: '#' },
  ],
};

/** The site with one of its sections marked, which is what a page hands its
    bar: the same entry, said from where the reader is standing. */
export const siteMenu = (at: number): MenuEntry => ({
  ...SITE,
  items: (SITE.items ?? []).map((section, i) => (i === at ? { ...section, here: true } : section)),
});

/** The columns the footer carries on every page. */
export const SITE_GROUPS: readonly FooterGroup[] = [
  /* A column headed by a section of the site: the heading is that section's own
     page, which the columns are the only route to. A column that collects links
     belonging together rather than a section — the marks, the notices — is a
     page nowhere and heads nothing. */
  {
    label: 'Product',
    href: '#',
    items: [
      { label: 'Overview', href: '#' },
      { label: 'Features', href: '#' },
      { label: 'Tool reference', href: '#' },
      { label: 'Releases', href: '#' },
    ],
  },
  {
    label: 'Documentation',
    href: '#',
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

/** The header, with this page's section marked. It is handed the site and
    nothing else — the row, the panel under a section and the drawer are all
    that one entry, read at whatever width there is. The same element the
    guides theme renders, search included, because this is the bar
    `tests/pages.spec.ts` opens at every width. */
export const siteBar = (active: number, home = '#'): TemplateResult =>
  html`<sds-nav-main
    home="${home}"
    signet="../assets/design-system-signet-m.svg"
    brand="TYPO3"
    product="Dev Companion"
    search
    .menu="${siteMenu(active)}"
  ></sds-nav-main>`;

/** The end of the site. */
export const siteFooter = (): TemplateResult =>
  html`<sds-footer .groups="${SITE_GROUPS}" note="${SITE_NOTE}" version="1.4.0" .meta="${SITE_META}"
    signet="../assets/design-system-signet-m.svg" brand="TYPO3" product="Dev Companion"></sds-footer>`;
