/* Storybook config — web components, deliberately not React.

   This system ships classes and tokens and now ships Lit elements too.
   `@storybook/web-components-vite` is the renderer that matches both: a
   story returns a Lit template, and a custom element is markup, so the same
   story documents `buttonTemplate()` today and `<sds-button>` tomorrow. The
   React renderer would have required a React layer to document a system
   that has none — the thing `ARCHITECTURE.md` records as declined
   twice.

   Storybook is a documentation and authoring surface. It is NOT the
   claude.ai/design sync path: `.design-sync/config.json` pins
   `shape: "package"` and `scripts/build.ts` stays the converter. The kit's
   own detector would otherwise see this directory and switch shapes — see
   `.design-sync/NOTES.md` § Storybook. */

import type { StorybookConfig } from '@storybook/web-components-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  /* Stories, and only stories. The written pages were MDX here until they
     became the published documentation — reStructuredText read by Guides,
     which this renderer cannot show and should not try to. What is left is
     what only Storybook can do: a component with its controls, and the
     specimen cards beside it. */
  stories: ['../stories/**/*.stories.ts'],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        /* MDX parses CommonMark, and CommonMark has no tables. The default
           pipeline is parse → mdx → rehype and nothing else, so a `| … |`
           row set as a paragraph of literal pipe characters — which is what
           every table on the overview pages was doing.

           Only the parser was missing: the docs theme already styles a
           `<table>`, which is why `docs.css` leaves prose and tables alone. */
        mdxPluginOptions: {
          mdxCompileOptions: { remarkPlugins: [remarkGfm] },
        },
      },
    },
    // A system that documents focus rings and status colour should be able
    // to prove them. The panel runs axe against the rendered story.
    //
    // It ships in every build, including the one the Playwright suite serves.
    // Dropping it there was tried and is not allowed: the tests exist to prove
    // the shipped surface, and a surface assembled differently for the test is
    // not the one that ships. The axe collision it causes is handled where it
    // belongs — see `parameters.a11y` in preview.ts.
    '@storybook/addon-a11y',
  ],
  framework: { name: '@storybook/web-components-vite', options: {} },
  /* The container keeps no state between rebuilds, so Storybook's release
     notice is unread every time the image is rebuilt — which is every task.
     A notification that cannot be dismissed for good is noise. */
  core: {
    disableWhatsNewNotifications: true,
    disableTelemetry: true,
  },
  /* The onboarding checklist is addressed to someone setting Storybook up for
     the first time — install this addon, write a first story, publish. None of
     it applies here, and its progress is kept in the cache directory the
     container discards, so every rebuild greets a finished system with a
     starter checklist. Both surfaces it appears on are turned off: the sidebar
     widget and the guide page in the menu. */
  features: {
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },
  /* The guideline specimens are iframed into the MDX pages exactly as the
     pane renders them, so they are served as real files and resolve their
     own `../styles.css` the way the pane resolves it. Mapped entry by entry
     rather than serving the repo root, which would copy the build output
     into itself. */
  staticDirs: [
    /* Served at the path a card declares, not at the path it is stored under:
       the card's own links climb to `/styles/` and `/assets/`, and those are
       counted from the declared depth. `specimens/` is where the repo keeps
       them and stops at the file system. */
    { from: '../specimens/guidelines', to: '/guidelines' },
    { from: '../specimens/components', to: '/components' },
    { from: '../specimens/screens', to: '/screens' },
    { from: '../assets', to: '/assets' },
    { from: '../fonts', to: '/fonts' },
    { from: '../src/tokens', to: '/tokens' },
    /* The whole directory, at the path the cards resolve to: a guideline
       card served at /guidelines/x.card.html links
       `../src/styles/styles.css`. */
    { from: '../src/styles', to: '/styles' },
    /* What a consumer copies. Served so the drop-in can be opened here rather
       than only built — an artefact nothing ever loads is an artefact nobody
       knows is broken. */
    { from: '../dist', to: '/dist' },
    /* The rendered site is deliberately NOT here. It is served by its own
       container at its own root — see the `site` service in the compose file
       for why a sub-path under this server would be a lie about how it
       ships. */
  ],
};

export default config;
