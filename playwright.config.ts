/* Playwright — the tests that need a real browser.

   The repo already drives Chromium for `fit`, `shots` and `diff`, which
   measure *pixels*. These tests measure something the screenshots cannot:
   that every story renders at all, that the custom elements produce the same
   markup the static cards ship, and that the specimens survive an axe pass.

   Tests run against a built Storybook, not `storybook dev`. A built
   Storybook is deterministic and starts in a second; the dev server
   recompiles on demand, so a slow first story looks like a flaky test. The
   trade is that `make test` builds first — `reuseExistingServer` keeps that
   to once per session locally.

   The port below is container-internal and never published: the suite starts
   its own server inside the same container it runs in. Nothing on the host
   can collide with it, and it cannot collide with the running stack — that
   is why it is a fixed number and the stack's are not. */

import { defineConfig, devices } from '@playwright/test';

export const PORT = 6107;
export const BASE_URL = `http://localhost:${PORT}`;

/* The rendered documentation, on a port of its own.

   Storybook serves the sources of this system; the site is what a renderer
   made out of them, and the only place a template meets markup nobody here
   wrote. It cannot be a route in the first server — the pages resolve their
   assets relative to a publish root, which is the property under test. */
export const SITE_PORT = 6108;
export const SITE_URL = `http://localhost:${SITE_PORT}`;
/* The publish root on disk. Served below, and walked by the guides suite to
   ask what the renderer actually wrote — one spelling for both. */
export const SITE_DIR = '.out/site';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI']
    ? [['github'], ['html', { open: 'never', outputFolder: '.out/playwright-report' }]]
    : [['list']],

  /* Both under the one ignored root, rather than the two directories Playwright
     would otherwise scatter at the repo root — see `.gitignore`. */
  outputDir: './.out/test-results',

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  /* One browser. This system is documented, not shipped to end users across
     a matrix — and everything under test is markup and class names, which do
     not differ between engines. Adding webkit here would buy runtime, not
     information. */
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: [
    {
      /* The binaries directly, not through npm or npx: the container runs as
         the host's UID with no home of its own, and npm wants a cache it can
         write. There is nothing npm adds here anyway. */
      command: `node_modules/.bin/storybook build -o .out/storybook && node scripts/serve.ts ${PORT} .out/storybook`,
      url: BASE_URL,
      reuseExistingServer: !process.env['CI'],
      timeout: 240_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      /* Rendered here rather than expected to be lying around. A suite that
         opens whatever the last `make guides` left behind reports on a tree
         nobody has any more, and the one thing this spec exists to catch —
         a template that stopped emitting what it used to — is exactly what
         a stale render hides. The renderer is PHP over a handful of
         documents and costs about a second. */
      command: `node scripts/guides.ts && node scripts/serve.ts ${SITE_PORT} ${SITE_DIR}`,
      url: SITE_URL,
      reuseExistingServer: !process.env['CI'],
      timeout: 240_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
  ],
});
