/* Vitest — the tests that run inside a frame, in one real Chromium.

   The stories, which `@storybook/addon-vitest` turns into one test each.
   And the `.test.ts` files under `tests/`, which render markup or a story
   into the page and ask it questions. A frame per file, and Playwright
   keeps what needs a server — `playwright.config.ts`. A story renders once
   and `preview.ts` judges it in both themes. The addon starts one project
   from the sidebar, and a second on the same `.storybook` collides with it. */

import { defineConfig } from 'vitest/config';
import { defineBrowserCommand, playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

/* What a test cannot do from inside its frame: hold the pointer down. The
   press is the one state a card cannot show, and `userEvent` has no press
   that does not also let go. The frame's own locator finds the element, so
   the pointer lands on it wherever the frame stands on the page. */
const hold = defineBrowserCommand(async ({ frame, page }, selector: string) => {
  await (await frame()).locator(selector).hover();
  await page.mouse.down();
});
const release = defineBrowserCommand(async ({ page }) => {
  await page.mouse.up();
});

/* The clipboard is one for the whole browser, and every file runs in a
   context of its own. Here is the one place they all share, so a test
   that writes it or reads it takes this first, and gives it back after. */
let clipboardFree: Promise<void> = Promise.resolve();
let giveBack: (() => void) | undefined;
const takeClipboard = defineBrowserCommand(async () => {
  const before = clipboardFree;
  let done!: () => void;
  clipboardFree = new Promise<void>((resolve) => (done = resolve));
  await before;
  giveBack = done;
});
const giveClipboard = defineBrowserCommand(async () => {
  giveBack?.();
  giveBack = undefined;
});

/* Headless, and the browser Playwright installed into the image. A screenshot
   on failure is Playwright's job in its own suite; here it fills `.out/`
   with pictures of frames nobody opens. */
const browser = () => ({
  enabled: true,
  headless: true,
  /* The clipboard is the one thing a page cannot see. A test reads back
     what a press put there, which the browser permits a page only when
     asked. */
  provider: playwright({ contextOptions: { permissions: ['clipboard-read', 'clipboard-write'] } }),
  /* A laptop's window, which is where the old suite opened every page. A
     test that asks about another width sets it. */
  viewport: { width: 1280, height: 900 },
  instances: [{ browser: 'chromium' as const }],
  commands: { hold, release, takeClipboard, giveClipboard },
  screenshotFailures: false,
});

export default defineConfig({
  /* Every dependency bundled before the first frame opens. Vite discovers
     `@lit-labs/ssr` with the first specimen and `axe-core` with the first
     verdict. Then it bundles again and reloads, and an open frame keeps its
     copy of `lit-html`, or loses a module in flight. So the crawl covers
     what a frame loads, and the list names Lit whole for the renderer. */
  optimizeDeps: {
    entries: ['.storybook/*.ts', 'stories/**/*.ts', 'tests/**/*.test.ts', 'tests/lib/*.ts'],
    include: ['lit', 'lit/**', '@lit-labs/ssr', '@lit-labs/ssr/lib/render-result.js', 'axe-core'],
  },
  test: {
    /* Frames at once. One per core leaves nothing for the editor, the
       Storybook beside it, or a second run from its sidebar. */
    maxWorkers: 4,
    /* What the run covers, and the floor it must not fall under. The
       sources of the package, less what only Node runs: the static renderer
       and the boot line, which `ssr`, `parity` and the drop-in's spec hold.
       The floor stands a step under today's figure, so a component with no
       test of its behaviour is the one thing that lowers it. */
    coverage: {
      provider: 'v8',
      include: ['packages/frontend/src/**/*.ts'],
      exclude: ['packages/frontend/src/**/*.generated.ts', 'packages/frontend/src/lib/render.ts', 'packages/frontend/src/lib/authored.ts', 'packages/frontend/src/boot.ts', 'packages/frontend/src/lib/grammars/**'],
      reportsDirectory: '.out/coverage',
      thresholds: { statements: 90, branches: 80, functions: 92, lines: 93 },
    },
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: '.storybook' })],
        test: {
          name: 'stories',
          browser: browser(),
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'frames',
          include: ['tests/**/*.test.ts'],
          browser: browser(),
          setupFiles: ['tests/lib/setup.ts'],
        },
      },
    ],
  },
});
