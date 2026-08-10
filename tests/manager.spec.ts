/* The Storybook shell itself boots.

   Everything else in this suite opens `/iframe.html` — the preview, where the
   stories live. Nothing opened `/`, the manager: the sidebar, the toolbar,
   the docs chrome, the surface a person actually looks at. So a manager that
   crashed on load was invisible to a green run, and that is not theoretical:
   `.storybook/manager.ts` passed a partial object as `theme`, Storybook ran
   it through `ensure()`, polished threw `PolishedError #3` on a colour the
   partial never set, and the whole shell rendered as an empty white page.
   Forty-three tests passed while the documentation surface was blank.

   The manager is configured in a file the preview never imports, so nothing
   about the preview can stand in for this. */

import { test, expect } from '@playwright/test';

test('the manager shell boots, with its sidebar and no page errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  /* The tree is rendered by the manager bundle. If that bundle threw, the
     selector never appears — which is the failure this test exists for, so
     it is asserted rather than waited on with a catch. */
  await page.waitForSelector('#storybook-explorer-tree', { timeout: 30_000 });

  const links = await page.locator('#storybook-explorer-tree a').count();
  expect(links, 'the sidebar should list the stories').toBeGreaterThan(0);

  /* The system's name, not the tool's. `manager.ts` sets it, and a broken
     theme object takes it down with the rest of the shell. */
  await expect(page.locator('.sidebar-header')).toContainText('Soul Design System');

  expect(errors, 'the manager should boot clean').toEqual([]);
});
