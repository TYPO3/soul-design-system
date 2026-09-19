/* The one control in this system that draws its own list, not the browser's.

   A native `<select>` opens a window the page has no reach into: the operating
   system's colours on the operating system's canvas. So a dark page opens a
   light list. A drawn list buys the list back, and what it costs is
   everything the platform did for free. This suite is that bill. The
   keyboard, what the list says about itself, and the real `<select>`
   underneath still as what the form sends.

   Nothing here shows in a screenshot, which is why the card cannot hold it. */

import { beforeEach, expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as select from '../stories/forms/Select.stories.ts';
import { mount, q, shown, sleep, stories } from './lib/frame.ts';

const { Grouped } = stories(select);

const button = () => page.getByRole('combobox');
const list = () => page.getByRole('listbox');
/* The list is on the page shut and open. A popover with nothing to show
   has no role a locator finds, so its box answers for it. */
const listed = (): boolean => shown(q('sds-select .sds-select__list'));
const says = (): string => (button().element().textContent ?? '').trim();

/** Which entry the keys are on, read off the button rather than guessed: it is
    `aria-activedescendant` that tells a reader where they are. Polled, because
    a key moves the element's own state and the markup follows a frame later. */
async function onEntry(label: string, why: string): Promise<void> {
  await expect
    .poll(() => {
      const id = button().element().getAttribute('aria-activedescendant');
      return id ? (document.getElementById(id)?.textContent ?? '').trim() : '';
    }, { message: why })
    .toBe(label);
}

beforeEach(async () => {
  await mount(Grouped);
});

test('the button says what it opens, and what is open', async () => {
  await expect.element(button()).toHaveAttribute('aria-haspopup', 'listbox');
  await expect.element(button()).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(listed).toBe(false);

  await button().click();
  await expect.element(button()).toHaveAttribute('aria-expanded', 'true');
  await expect.element(list()).toBeVisible();

  /* The chosen answer is the one marked, and it is the only one. */
  await expect.element(page.getByRole('option', { selected: true })).toHaveTextContent('13.4');
});

test('it opens on the keys, at the answer in force', async () => {
  button().element().focus();
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(list()).toBeVisible();
  /* Opened where the reader already is, not at the top. A list that starts over
     every time makes them find their own answer again before they can move. */
  await onEntry('13.4', 'opened on the answer in force');

  /* The focus never leaves the button — that is what `aria-activedescendant` is
     for, and it is why a reader can walk the list and nothing blurs. */
  expect(document.activeElement).toBe(button().element());
});

test('the arrows walk it, the ends jump, and the walk steps over a closed answer', async () => {
  button().element().focus();
  await userEvent.keyboard('{ArrowDown}');

  await userEvent.keyboard('{ArrowUp}');
  await onEntry('14.3', 'up from 13.4');
  await userEvent.keyboard('{ArrowUp}');
  await onEntry('14.3', 'and it stops at the top rather than wrapping');

  await userEvent.keyboard('{End}');
  await onEntry('main', 'the last answer that is on offer — 11.5 and 12.4 are not');
  await userEvent.keyboard('{Home}');
  await onEntry('14.3', 'and Home goes back to the first');
});

test('a typed word goes to the answer, open or closed', async () => {
  button().element().focus();

  /* Closed, typing moves the answer without opening anything, the way a native
     select does. */
  await userEvent.keyboard('m');
  await expect.poll(listed).toBe(false);
  await expect.poll(says).toBe('main');

  /* Typed in one breath is one word. `m` then `a` is "ma" and not a second
     search for `a`, which is what makes a list of near-identical labels
     reachable at all. A second past the last key, the word starts over. */
  await userEvent.keyboard('{ArrowDown}');
  await sleep(1100);
  await userEvent.keyboard('1');
  await onEntry('14.3', 'the first answer starting with it');
  await sleep(1100);
  await userEvent.keyboard('13');
  await onEntry('13.4', 'and a second key in the same breath continues the word');
});

test('Enter takes what the keys are on, Escape leaves the answer alone', async () => {
  button().element().focus();

  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{ArrowUp}');
  await userEvent.keyboard('{Enter}');
  await expect.poll(listed).toBe(false);
  await expect.poll(says).toBe('14.3');

  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{Escape}');
  await expect.poll(listed).toBe(false);
  await expect.poll(says, { message: 'walked past and left' }).toBe('14.3');
});

test('an answer on the list and not on offer refuses the press', async () => {
  await button().click();

  const closed = page.getByRole('option', { name: '11.5' });
  await expect.element(closed).toHaveAttribute('aria-disabled', 'true');
  /* Forced, because the pointer does not reach it. The press is what has to
     fail, and a control the pointer cannot reach is only half of that. */
  await closed.click({ force: true });
  await expect.poll(says, { message: 'the answer did not move' }).toBe('13.4');
  await expect.element(list(), { message: 'and the list stayed open' }).toBeVisible();
});

/* The half the reader never sees, and the only half a server does. */
test('the real select underneath is what carries the value', async () => {
  await button().click();
  await page.getByRole('option', { name: '14.3' }).click();

  const control = q<HTMLSelectElement>('sds-select select');
  expect(control.value, 'moved with the drawn list, before any announcement').toBe('14.3');
  expect(getComputedStyle(control).opacity, 'and it is not what the reader looks at').toBe('0');
});
