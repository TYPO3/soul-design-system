/* The dropdown's panel, which is a popover.

   Everything that once stood in the element is the browser's now. The open,
   the press outside that closes it, Escape, the focus back on the button. And
   the top layer that keeps an ancestor's overflow off it. That is a good
   trade only as long as it is true. None of it is visible in a screenshot of
   a closed control, so the press happens here.

   The panel sits inside a box that clips, because the clip is the whole
   reason the top layer was the right move. */

import { beforeEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { box, q, qa, shown, write } from './lib/frame.ts';

const PAGE = `
  <!-- A box that clips, and a control near its bottom edge: before the top
       layer this is where a panel was cut in half. -->
  <div id="clip" style="overflow:hidden;height:120px;width:340px;padding:70px 16px 0">
    <sds-dropdown id="pages" label="Language" name="Language"></sds-dropdown>
  </div>
  <sds-dropdown id="commands" label="Edit"></sds-dropdown>
  <!-- Hard against the end of the window: the panel is hung from its button's
       start edge and is wider than the room left there. -->
  <div style="display:flex;justify-content:flex-end">
    <sds-dropdown id="edge" label="Edit"></sds-dropdown>
  </div>
  <!-- Somewhere that is nothing, for the press outside. -->
  <div id="outside" style="height:40px"></div>`;

const choices = (): void => {
  const pages = q('#pages') as HTMLElement & { choices: unknown };
  pages.choices = [
    { label: 'English', href: '#en', lang: 'en', current: true },
    { label: 'Deutsch', href: '#de', lang: 'de' },
  ];
  const commands = q('#commands') as HTMLElement & { choices: unknown };
  commands.choices = [
    { label: 'Duplicate' },
    { label: 'Rename' },
    { label: 'Move to trash', disabled: true },
  ];
  (q('#edge') as HTMLElement & { choices: unknown }).choices = commands.choices;
};

beforeEach(async () => {
  await write(PAGE, { then: choices });
});

const button = (id: string): HTMLElement => q(`#${id} .sds-dropdown__button`);
const panel = (id: string): HTMLElement => q(`#${id} .sds-dropdown__panel`);
const rows = (id: string): HTMLElement[] => qa(`#${id} .sds-dropdown__panel .sds-dropdown__item`);

test('the button opens the panel and says so', async () => {
  expect(button('pages').getAttribute('aria-expanded')).toBe('false');
  expect(shown(panel('pages'))).toBe(false);

  await userEvent.click(button('pages'));
  await expect.element(panel('pages')).toBeVisible();
  expect(button('pages').getAttribute('aria-expanded')).toBe('true');
});

/* The reason the panel is a popover at all. A box with `overflow: hidden`
   used to cut it off, and nothing in the element can reach out of it. */
test('a box that clips does not clip the panel', async () => {
  await userEvent.click(button('pages'));
  await expect.element(panel('pages')).toBeVisible();
  const drawn = box(panel('pages'));
  const clip = box(q('#clip'));
  /* Below the clipping box's own bottom edge, and still drawn. */
  expect(drawn.bottom).toBeGreaterThan(clip.bottom);
});

/* The other edge of the same question. No box on the page clips the top
   layer, but the window does. A panel that has left the window cannot scroll
   back onto it, because nothing in that layer scrolls. */
test('the panel stays inside the window when the button is at its edge', async () => {
  const room = document.documentElement.clientWidth;
  await userEvent.click(button('edge'));
  await expect.element(panel('edge')).toBeVisible();
  const at = box(button('edge'));
  const drawn = box(panel('edge'));
  /* The case, said out loud: hung from the button's start edge the panel does
     not fit between that edge and the end of the window. */
  expect(at.x + drawn.width).toBeGreaterThan(room);
  expect(drawn.x).toBeGreaterThanOrEqual(0);
  expect(drawn.right).toBeLessThanOrEqual(room);
});

test('the panel hangs under the button it came from', async () => {
  await userEvent.click(button('pages'));
  await expect.element(panel('pages')).toBeVisible();
  const at = box(button('pages'));
  const drawn = box(panel('pages'));
  /* Under it, and starting from the same edge — whichever way the engine
     placed it, from its own anchor or from the element's measurement. */
  expect(drawn.y).toBeGreaterThanOrEqual(at.bottom);
  expect(Math.abs(drawn.x - at.x)).toBeLessThan(2);
});

/* The other placement. This browser has anchor positioning, so every test
   above takes the stylesheet's path and the element's own never runs. That
   is exactly the half that breaks unwatched. `CSS.supports` is what the
   element asks, at every open, so a different answer to it puts it on the
   other route. The inline edge it writes is the proof it went there. */
test('where the engine cannot anchor, the element places the panel itself', async () => {
  const real = CSS.supports.bind(CSS);
  CSS.supports = ((...args: [string, string?]) =>
    args[0] === 'anchor-name' ? false : real(...(args as [string, string]))) as typeof CSS.supports;
  try {
    await userEvent.click(button('pages'));
    const placed = panel('pages');
    await expect.element(placed).toHaveAttribute('style', expect.stringMatching(/inset-block-start:\s*\d/));
    const at = box(button('pages'));
    const drawn = box(placed);
    expect(drawn.y).toBeGreaterThanOrEqual(at.bottom);
    expect(Math.abs(drawn.x - at.x)).toBeLessThan(2);
  } finally {
    CSS.supports = real;
  }
});

test('a press outside closes it, and Escape puts the reader back on the button', async () => {
  await userEvent.click(button('pages'));
  await expect.element(panel('pages')).toBeVisible();
  await userEvent.click(q('#outside'));
  await expect.element(panel('pages')).not.toBeVisible();
  expect(button('pages').getAttribute('aria-expanded')).toBe('false');

  await userEvent.click(button('pages'));
  await expect.element(panel('pages')).toBeVisible();
  await userEvent.keyboard('{Escape}');
  await expect.element(panel('pages')).not.toBeVisible();
  expect(document.activeElement).toBe(button('pages'));
});

/* What is in the list decides what the list is. Targets make it a disclosure
   of links, and no targets make it a menu the arrows walk. */
test('entries with a target are links, and no screen reader calls them commands', async () => {
  await userEvent.click(button('pages'));
  await expect.element(panel('pages')).toBeVisible();
  expect(panel('pages').getAttribute('role')).not.toBe('menu');
  const items = rows('pages');
  expect(items).toHaveLength(2);
  expect(items[0]?.getAttribute('href')).toBe('#en');
  /* Its own language, so a reader hears the name in the language it names. */
  expect(items[1]?.getAttribute('lang')).toBe('de');
  expect(items[1]?.getAttribute('hreflang')).toBe('de');
});

/* The announcement is what the two kinds differ in — not if a reader can
   reach the list. Down from the button opens it and steps in; up comes in from
   the other end. */
test('the arrows open a list of pages too, and walk it', async () => {
  const trigger = button('pages');
  trigger.focus();
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(panel('pages')).toBeVisible();
  expect(trigger.getAttribute('aria-expanded')).toBe('true');

  const items = rows('pages');
  await expect.poll(() => document.activeElement).toBe(items[0]);
  await userEvent.keyboard('{ArrowDown}');
  await expect.poll(() => document.activeElement).toBe(items[1]);
  await userEvent.keyboard('{ArrowUp}');
  await expect.poll(() => document.activeElement).toBe(items[0]);
  await userEvent.keyboard('{End}');
  await expect.poll(() => document.activeElement).toBe(items[1]);
});

test('entries with no target are a menu the arrows walk', async () => {
  const trigger = button('commands');
  expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
  await userEvent.click(trigger);
  await expect.element(panel('commands')).toBeVisible();
  expect(panel('commands').getAttribute('role')).toBe('menu');

  await userEvent.keyboard('{ArrowDown}');
  const items = rows('commands');
  await expect.poll(() => document.activeElement).toBe(items[0]);
  await userEvent.keyboard('{ArrowDown}');
  await expect.poll(() => document.activeElement).toBe(items[1]);
  /* Stops at the end rather than wrapping, and never lands on the disabled
     row — a list that starts over hides how long it was. */
  await userEvent.keyboard('{ArrowDown}');
  await expect.poll(() => document.activeElement).toBe(items[1]);
});

test('a choice reports the entry and closes the panel', async () => {
  const chosen: string[] = [];
  const heard = (event: Event): void => {
    chosen.push((event as CustomEvent<{ choice: { label: string } }>).detail.choice.label);
  };
  document.addEventListener('sds-dropdown-choose', heard);
  try {
    await userEvent.click(button('commands'));
    await expect.element(panel('commands')).toBeVisible();
    await userEvent.click(rows('commands')[0] as HTMLElement);
    await expect.element(panel('commands')).not.toBeVisible();
    expect(chosen).toEqual(['Duplicate']);
  } finally {
    document.removeEventListener('sds-dropdown-choose', heard);
  }
});
