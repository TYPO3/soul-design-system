/* Storybook config — web components, deliberately not React.

   `@storybook/web-components-vite` matches what this ships. A story returns a
   Lit template and a custom element is markup, so one story documents the
   template function and the element alike. The React renderer needs a React
   layer to document a system that has none.

   This is a documentation surface, NOT the sync path: `scripts/build.ts`
   assembles the design system from the cards these stories render. */

import type { StorybookConfig } from '@storybook/web-components-vite';
import remarkGfm from 'remark-gfm';
import { mergeConfig } from 'vite';

/* A built Storybook has no Vite behind it, so the sources a card links have to
   go in as files. A dev server does, and it answers that same path both ways
   already. As a module where `preview.ts` imports it, as `text/css` where a
   card links it. A static file mapped over it in dev answers the import with
   CSS too, which a module script refuses. The preview then renders nothing
   at all. */
const BUILDING = process.argv.includes('build');

const config: StorybookConfig = {
  /* Stories, and only stories. The written pages are the published
     documentation, reStructuredText for Guides, which this renderer cannot
     show and must not try to. What remains is what only Storybook can do: a
     component with its controls, and the specimen cards beside it. */
  stories: ['../stories/**/*.stories.ts'],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        /* MDX parses CommonMark, which has no tables, so without this a
           `| … |` row sets as a paragraph of literal pipe characters. Only the
           parser is absent — the docs theme already styles a `<table>`, which
           is why `docs.css` leaves prose and tables alone. */
        mdxPluginOptions: {
          mdxCompileOptions: { remarkPlugins: [remarkGfm] },
        },
      },
    },
    /* A system that documents focus rings and status colour must be able to
       prove them, so the panel runs axe against the rendered story. It ships in
       every build, the one the Playwright suite serves included: a surface
       assembled differently for the test is not the one that ships. The axe
       collision that causes has its answer in `preview.ts`. */
    '@storybook/addon-a11y',
  ],
  framework: { name: '@storybook/web-components-vite', options: {} },
  /* The container keeps no state between rebuilds, so Storybook's release
     notice is unread after every image rebuild — which is every task. A
     notification nobody can dismiss for good is noise. */
  core: {
    disableWhatsNewNotifications: true,
    disableTelemetry: true,
  },
  /* The onboarding checklist is for somebody who sets Storybook up, and its
     progress lives in the cache directory the container discards. So every
     rebuild greets a finished system with a starter checklist. Both surfaces
     go: the sidebar widget and the guide page. */
  features: {
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },
  /* The guideline specimens sit in iframes in the MDX pages exactly as the
     pane renders them. So they serve as real files and resolve their own
     stylesheet the way the pane resolves it. Mapped entry by entry rather
     than the repo root as a whole, which copies the build output into
     itself. */
  staticDirs: [
    /* At the depth of their storage, because a card's own links climb from
       there. `specimens/guidelines/x.card.html` links
       `../../packages/frontend/src/styles/styles.css`, and the climb has to
       land inside this build. Served one level up it only landed at all
       because a browser stops the climb at the root. That is the site's root
       once the build sits below the documentation. */
    { from: '../specimens', to: '/specimens' },
    /* The pictures at the path a story writes, relative to the preview page. */
    { from: '../packages/frontend/assets', to: '/assets' },
    /* The faces and the pictures at the paths a generated card climbs to. A
       card states where a file is in the repository. It also opens from disk
       in the design pane, where no server exists at all. Neither
       ever arrives as a module import, so neither collides with Vite. */
    { from: '../packages/frontend/fonts', to: '/packages/frontend/fonts' },
    { from: '../packages/frontend/assets', to: '/packages/frontend/assets' },
    /* And the stylesheets a card links, in the build only — see above. */
    ...(BUILDING
      ? [
          { from: '../packages/frontend/src/styles', to: '/packages/frontend/src/styles' },
          { from: '../packages/frontend/src/tokens', to: '/packages/frontend/src/tokens' },
        ]
      : []),
    /* What a consumer copies. Served so the drop-in can open here rather
       than only build — an artefact nothing ever loads is an artefact whose
       breakage nobody knows. */
    { from: '../packages/frontend/dist', to: '/dist' },
    /* The rendered site is deliberately NOT here. Its own container serves it
       at its own root. See the `site` service in the compose file for why a
       sub-path under this server is a lie about how it ships. */
  ],
  /* The dev server answers to its compose name too. `make look` runs in the
     `app` container, where `localhost` is somebody else, and a live story is
     what it photographs: `make look ARGS='http://storybook:6007/iframe.html?id=slides-cards--page'`. */
  viteFinal: (viteConfig) => mergeConfig(viteConfig, { server: { allowedHosts: ['storybook'] } }),
};

export default config;
