/* The one control in this system whose list is drawn rather than the browser's.

   A native `<select>` opens a window the page has no reach into — the operating
   system's colours on the operating system's canvas — so a dark page opens a
   light list. Drawing it is what buys the list back, and what it costs is
   everything the platform was doing for free. This suite is that bill: the
   keyboard, what the list says about itself, and the real `<select>` underneath
   still being what the form sends.

   Nothing here shows in a screenshot, which is why the card cannot hold it. */

import { test, expect, type Page } from '@playwright/test';

import { gotoStory } from './lib/story.ts';

const GROUPED = 'forms-select--grouped';

const button = (page: Page) => page.getByRole('combobox');
const list = (page: Page) => page.getByRole('listbox');

/** Which entry the keys are on, read off the button rather than guessed: it is
    `aria-activedescendant` that tells a reader where they are. Polled, because
    a key moves the element's own state and the markup follows a frame later. */
async function onEntry(page: Page, label: string, why: string): Promise<void> {
  await expect
    .poll(async () => {
      const id = await button(page).getAttribute('aria-activedescendant');
      return id ? ((await page.locator(`#${id}`).textContent()) ?? '').trim() : '';
    }, { message: why })
    .toBe(label);
}

test('the button says what it opens, and what is open', async ({ page }) => {
  await gotoStory(page, GROUPED);

  await expect(button(page)).toHaveAttribute('aria-haspopup', 'listbox');
  await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
  await expect(list(page)).toBeHidden();

  await button(page).click();
  await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
  await expect(list(page)).toBeVisible();

  /* The chosen answer is the one marked, and it is the only one. */
  await expect(page.getByRole('option', { selected: true })).toHaveText('13.4');
});

test('it opens on the keys, at the answer in force', async ({ page }) => {
  await gotoStory(page, GROUPED);

  await button(page).focus();
  await page.keyboard.press('ArrowDown');
  await expect(list(page)).toBeVisible();
  /* Opened where the reader already is, not at the top: a list that starts over
     every time makes them find their own answer again before they can move. */
  await onEntry(page, '13.4', 'opened on the answer in force');

  /* The focus never leaves the button — that is what `aria-activedescendant` is
     for, and it is why the list can be walked without anything being blurred. */
  await expect(button(page)).toBeFocused();
});

test('the arrows walk it, the ends jump, and a closed answer is stepped over', async ({ page }) => {
  await gotoStory(page, GROUPED);
  await button(page).focus();
  await page.keyboard.press('ArrowDown');

  await page.keyboard.press('ArrowUp');
  await onEntry(page, '14.3', 'up from 13.4');
  await page.keyboard.press('ArrowUp');
  await onEntry(page, '14.3', 'and it stops at the top rather than wrapping');

  await page.keyboard.press('End');
  await onEntry(page, 'main', 'the last answer that is on offer — 11.5 and 12.4 are not');
  await page.keyboard.press('Home');
  await onEntry(page, '14.3', 'and Home goes back to the first');
});

test('typing goes to the answer, open or closed', async ({ page }) => {
  await gotoStory(page, GROUPED);
  await button(page).focus();

  /* Closed, typing moves the answer without opening anything, the way a native
     select does. */
  await page.keyboard.press('m');
  await expect(list(page)).toBeHidden();
  await expect(button(page)).toHaveText('main');

  /* What is typed in one breath is one word: `m` then `a` is "ma" and not a
     second search for `a`, which is what makes a list of near-identical labels
     reachable at all. A second past the last key, the word starts over. */
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(1100);
  await page.keyboard.press('1');
  await onEntry(page, '14.3', 'the first answer starting with it');
  await page.keyboard.press('3');
  await onEntry(page, '13.4', 'and the next key continues the word');
});

test('Enter takes what the keys are on, Escape leaves the answer alone', async ({ page }) => {
  await gotoStory(page, GROUPED);
  await button(page).focus();

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');
  await expect(list(page)).toBeHidden();
  await expect(button(page)).toHaveText('14.3');

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Escape');
  await expect(list(page)).toBeHidden();
  await expect(button(page), 'walked past and left').toHaveText('14.3');
});

test('an answer on the list and not on offer cannot be taken', async ({ page }) => {
  await gotoStory(page, GROUPED);
  await button(page).click();

  const closed = page.getByRole('option', { name: '11.5' });
  await expect(closed).toHaveAttribute('aria-disabled', 'true');
  /* Forced, because the pointer would not reach it: the press is what has to be
     refused, and a control the pointer cannot reach is only half of that. */
  await closed.click({ force: true });
  await expect(button(page), 'the answer did not move').toHaveText('13.4');
  await expect(list(page), 'and the list stayed open').toBeVisible();
});

/* The half the reader never sees, and the only half a server does. */
test('the real select underneath is what carries the value', async ({ page }) => {
  await gotoStory(page, GROUPED);

  await button(page).click();
  await page.getByRole('option', { name: '14.3' }).click();

  const held = await page.evaluate(() => {
    const control = document.querySelector('sds-select select') as HTMLSelectElement;
    return { value: control.value, hidden: getComputedStyle(control).opacity };
  });
  expect(held.value, 'moved with the drawn list, before anything was announced').toBe('14.3');
  expect(held.hidden, 'and it is not what the reader is looking at').toBe('0');
});
