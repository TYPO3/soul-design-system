/* Storybook config — web components, deliberately not React.

   `@storybook/web-components-vite` matches what this ships: a story returns a
   Lit template and a custom element is markup, so one story documents the
   template function and the element alike. The React renderer would require a
   React layer to document a system that has none.

   This is a documentation surface, NOT the sync path: `.design-sync/config.json`
   pins `shape: "package"`, or the kit's own detector sees this directory and
   switches shapes. */

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
        /* MDX parses CommonMark, which has no tables, so without this a
           `| … |` row sets as a paragraph of literal pipe characters. Only the
           parser is missing — the docs theme already styles a `<table>`, which
           is why `docs.css` leaves prose and tables alone. */
        mdxPluginOptions: {
          mdxCompileOptions: { remarkPlugins: [remarkGfm] },
        },
      },
    },
    /* A system that documents focus rings and status colour should be able to
       prove them, so the panel runs axe against the rendered story. It ships in
       every build, the one the Playwright suite serves included: a surface
       assembled differently for the test is not the one that ships. The axe
       collision that causes is handled in `preview.ts`. */
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
  /* The onboarding checklist is for somebody setting Storybook up, and its
     progress lives in the cache directory the container discards — so every
     rebuild greets a finished system with a starter checklist. Both surfaces
     are turned off: the sidebar widget and the guide page. */
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
    { from: '../packages/frontend/assets', to: '/assets' },
    { from: '../packages/frontend/fonts', to: '/fonts' },
    { from: '../packages/frontend/src/tokens', to: '/tokens' },
    /* The whole directory, at the path the cards resolve to: a guideline
       card served at /guidelines/x.card.html links
       `../packages/frontend/src/styles/styles.css`. */
    { from: '../packages/frontend/src/styles', to: '/styles' },
    /* And at the path it actually asks for: a card climbs `../../packages/frontend/src/styles/`
       from wherever it is stored, which clamps above the publish root, so the
       request is for `/src/styles/styles.css`. It only shows where a story
       embeds a card as a document rather than inlining it. */
    { from: '../packages/frontend/src/styles', to: '/packages/frontend/src/styles' },
    /* And what that stylesheet then imports, at the path it imports it from —
       `../tokens/` beside `src/styles/`. A card whose sheet loads and whose
       tokens do not is a card drawn in the browser's own defaults, which is
       worse than one with no stylesheet at all: it looks like a design. */
    { from: '../packages/frontend/src/tokens', to: '/packages/frontend/src/tokens' },
    /* And the faces that sheet imports, two levels above itself — a card whose
       stylesheet loads and whose faces do not is a card set in system-ui, which
       is a difference nobody notices in a screenshot. */
    { from: '../packages/frontend/fonts', to: '/packages/frontend/fonts' },
    /* And the pictures, at the path a generated card climbs to: a card states
       where the file is in the repository, because it is also opened from disk
       in the design pane, where nothing is served at all. */
    { from: '../packages/frontend/assets', to: '/packages/frontend/assets' },
    /* What a consumer copies. Served so the drop-in can be opened here rather
       than only built — an artefact nothing ever loads is an artefact nobody
       knows is broken. */
    { from: '../packages/frontend/dist', to: '/dist' },
    /* The rendered site is deliberately NOT here. It is served by its own
       container at its own root — see the `site` service in the compose file
       for why a sub-path under this server would be a lie about how it
       ships. */
  ],
};

export default config;
