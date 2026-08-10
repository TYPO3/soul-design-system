/* Playwright — the tests that need a real browser.

   The repo already drives Chromium for `fit`, `shots` and `diff`, which
   measure *pixels*. These tests measure something the screenshots cannot:
   that every story renders at all, that the custom elements produce the same
   markup the static cards ship, and that the specimens survive an axe pass.

   Tests run against `storybook-static`, not `storybook dev`. A built
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

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['github'], ['html', { open: 'never' }]] : [['list']],

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

  webServer: {
    /* The binaries directly, not through npm or npx: the container runs as
       the host's UID with no home of its own, and npm wants a cache it can
       write. There is nothing npm adds here anyway. */
    command: `node_modules/.bin/storybook build && node scripts/serve.ts ${PORT} storybook-static`,
    url: BASE_URL,
    reuseExistingServer: !process.env['CI'],
    timeout: 240_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
