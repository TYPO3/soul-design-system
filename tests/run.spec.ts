/* Work being done, which is the one component here that changes while somebody
   is watching it.

   None of what this holds shows in a screenshot, which is why the card cannot
   carry it: which rows are a control and which are not, what a state is called
   for a reader who is told rather than shown, and a fold that has to survive
   the work moving on — the run redraws itself every time a stop changes, and a
   row the reader opened by hand may not close under them. */

import { test, expect, type Page } from '@playwright/test';

import { gotoStory } from './lib/story.ts';

const RUN = 'components-run--default';
const CHECKS = 'components-run-checks--default';
const SETTLED = 'components-run-checks--settled';

const row = (page: Page, label: string) =>
  page.locator('.sds-run__step').filter({ has: page.getByText(label, { exact: true }) });

test('a stop that wrote nothing is not a control, and one that did is', async ({ page }) => {
  await gotoStory(page, RUN);

  /* The stop in hand wrote something: it opens, and it stands open because the
     work is there now. */
  const building = row(page, 'Build the index');
  await expect(building.locator('details')).toHaveCount(1);
  await expect(building.locator('details')).toHaveAttribute('open', '');

  /* One that is behind us wrote something too, and is closed: what a reader
     wants from a finished step is that it finished. */
  await expect(row(page, 'Fetch the sitemap').locator('details[open]')).toHaveCount(0);

  /* And a stop the work has not reached has nothing to show, so it offers
     nothing: no fold, no chevron, no press. */
  const ahead = row(page, 'Swap it in');
  await expect(ahead.locator('details'), 'a stop with no output is no fold').toHaveCount(0);
  await expect(ahead.locator('.sds-run__chevron'), 'and draws no chevron').toHaveCount(0);
});

test('every state is said, not only drawn', async ({ page }) => {
  await gotoStory(page, RUN);

  /* The mark is a shape and a colour and neither is a sentence. What a reader
     who is told rather than shown gets is the row's own name. */
  for (const [label, said] of [
    ['Fetch the sitemap', 'Done'],
    ['Build the index', 'Running'],
    ['Swap it in', 'Not started'],
  ] as const) {
    await expect(
      row(page, label).locator('.sds-run__row'),
      `${label} should say it is ${said}`,
    ).toHaveAttribute('aria-label', new RegExp(said));
  }

  /* And the whole says what became of it, beside the heading. */
  await expect(page.locator('.sds-run__verdict sds-icon')).toHaveAttribute('label', 'Running');
});

test('the words a state is said in are the page\'s', async ({ page }) => {
  await gotoStory(page, RUN);

  /* The one thing in a run this element writes rather than is handed. A page
     that is not in English draws its own labels and would otherwise announce
     somebody else's — so the words are set, and the states that were not named
     keep the English they had. */
  await page.locator('sds-run').evaluate((run) => {
    (run as HTMLElement & { stateWords: unknown }).stateWords = { running: 'Läuft', done: 'Fertig' };
  });

  await expect(row(page, 'Fetch the sitemap').locator('.sds-run__row'))
    .toHaveAttribute('aria-label', /Fertig/);
  await expect(row(page, 'Build the index').locator('.sds-run__row'))
    .toHaveAttribute('aria-label', /Läuft/);
  await expect(
    row(page, 'Swap it in').locator('.sds-run__row'),
    'a state the page named nothing for keeps the word it had',
  ).toHaveAttribute('aria-label', /Not started/);

  /* The verdict is a state too, and it reads the same words. */
  await expect(page.locator('.sds-run__verdict sds-icon')).toHaveAttribute('label', 'Läuft');
});

test('a row the reader closed stays closed while the run redraws', async ({ page }) => {
  await gotoStory(page, RUN);

  const building = row(page, 'Build the index').locator('details');
  await expect(building).toHaveAttribute('open', '');
  await row(page, 'Build the index').locator('.sds-run__row').click();
  await expect(building, 'the press is the reader’s answer').not.toHaveAttribute('open', '');

  /* Now the work moves on. The element renders again from the new steps, and
     the row the reader shut may not reopen under them. */
  await page.locator('sds-run').evaluate((el) => {
    const run = el as HTMLElement & { steps: readonly Record<string, unknown>[] };
    run.steps = run.steps.map((step) =>
      step['label'] === 'Build the index' ? { ...step, state: 'done', meta: '31s' } : step);
  });
  await page.locator('sds-run').evaluate((el) =>
    (el as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete);

  await expect(building, 'and it survives the work moving on').not.toHaveAttribute('open', '');
});

test('many jobs at once are sorted by state, and each group folds', async ({ page }) => {
  await gotoStory(page, CHECKS);

  const groups = page.locator('.sds-run__group');
  await expect(groups).toHaveCount(3);
  /* The name carries the count, because a group folded away has to say what is
     inside it. */
  await expect(groups.first().locator('.sds-run__group-head')).toContainText('2 queued');

  await groups.first().locator('.sds-run__group-head').click();
  await expect(groups.first()).not.toHaveAttribute('open', '');
  await expect(groups.nth(1), 'and folding one leaves the others alone').toHaveAttribute('open', '');

  /* A queue is a mark apart from work in hand and a whole answer apart, so the
     row says which it is in words. */
  await expect(row(page, 'Build PHP (8.4)').locator('.sds-run__said')).toHaveText('Waiting to run this check');
});

test('a run nobody is watching is the head and nothing else', async ({ page }) => {
  await gotoStory(page, SETTLED);

  /* `open` is written where a run is being watched. Absent, the head is the
     whole of it — which is the shape a past run takes in a list of them. */
  await expect(page.locator('.sds-run')).not.toHaveAttribute('open', '');
  await expect(page.locator('.sds-run__step').first()).not.toBeVisible();
  await expect(page.locator('.sds-run__head')).toContainText('All checks have passed');
});
