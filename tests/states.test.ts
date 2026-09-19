/* What a state changes, and what it must not.

   A state assigns into a component's own set. A property whose default reads
   the one a state assigns from it is a cycle. That is invalid at computed
   value, which is not an error anywhere: the declaration simply drops. The
   button lost its border under the pointer and shrank by it. Its ink fell
   back to whatever the page inherits, which on the accent fill is unreadable.
   Nothing in the tree can see that, because nothing hovers over a card. */

import { beforeEach, expect, test } from 'vitest';
import { commands, userEvent } from 'vitest/browser';
import './lib/commands.d.ts';
import { box, q, sleep, write } from './lib/frame.ts';

const PAGE = `
  <sds-button label="Primary" variant="primary" id="primary"></sds-button>
  <sds-button label="Secondary" variant="secondary" id="secondary"></sds-button>
  <sds-button label="Ghost" variant="ghost" id="ghost"></sds-button>
  <sds-button label="Delete the branch" variant="danger" id="danger"></sds-button>
  <sds-dropdown label="Language" name="Language" id="trigger"></sds-dropdown>`;

const BUTTONS = ['#primary button', '#secondary button', '#ghost button', '#danger button'];
const CONTROLS = [...BUTTONS, '#trigger .sds-dropdown__button'];

beforeEach(async () => {
  await write(PAGE, {
    then: () => {
      (q('#trigger') as HTMLElement & { choices: unknown }).choices = [{ label: 'English', href: '#en', lang: 'en' }];
    },
  });
});

test('the pointer changes no box', async () => {
  for (const control of CONTROLS) {
    const at = q(control);
    const before = box(at);
    await userEvent.hover(at);
    const after = box(at);
    expect(after.width, `${control} widened under the pointer`).toBeCloseTo(before.width, 1);
    expect(after.height, `${control} grew under the pointer`).toBeCloseTo(before.height, 1);
  }
});

/* An invalid custom property computes to the empty string, which is the one
   reading that says the cycle is back. */
test('every colour the pointer draws with resolves', async () => {
  for (const control of CONTROLS) {
    const at = q(control);
    await userEvent.hover(at);
    const style = getComputedStyle(at);
    for (const name of ['--sds-btn-ink-hover', '--sds-btn-fill-hover', '--sds-btn-edge-hover', 'color', 'border-top-color']) {
      expect(style.getPropertyValue(name).trim(), `${control} left ${name} unresolved under the pointer`).not.toBe('');
    }
  }
});

/* The state has to do something, or the cycle is back in the other direction.
   Three declarations that drop are three declarations nobody sees drop. Read
   after the transition rather than at the press. The three colours are the
   ones the button animates, so at the moment of the hover they are all still
   at rest. */
test('the pointer changes the fill, and leaves the ink that has to stay', async () => {
  const at = q('#primary button');
  const read = (el: Element): [string, string] => [getComputedStyle(el).color, getComputedStyle(el).backgroundColor];
  const [ink, fill] = read(at);
  await userEvent.hover(at);
  await sleep(400);
  const [inkOver, fillOver] = read(at);
  expect(fillOver, 'the accent did not answer the pointer').not.toBe(fill);
  /* The ink over the accent is the accent's own, and the fall back to the
     page's is what made it unreadable. */
  expect(inkOver).toBe(ink);
  expect(getComputedStyle(document.body).color).not.toBe(inkOver);
});

/* The press is the state nothing in this tree can hold still. Nobody presses
   a card, so three properties that compute to nothing are wrong only under a
   finger. Read while the finger holds the button, which is the one place it
   exists. The box reads there too, because the rule that a state moves
   nothing does not stop at the pointer. */
test('the press answers, moves nothing, and resolves every colour', async () => {
  const fill = (el: Element): string => getComputedStyle(el).backgroundColor;
  for (const control of BUTTONS) {
    const at = q(control);
    await userEvent.hover(at);
    await sleep(400);
    const hovered = fill(at);
    const before = box(at);

    await commands.hold(control);
    await sleep(400);
    const pressed = fill(at);
    const after = box(at);
    const style = getComputedStyle(at);
    const values = ['--sds-btn-ink-active', '--sds-btn-fill-active', '--sds-btn-edge-active'].map(
      (name) => [name, style.getPropertyValue(name).trim()] as const,
    );
    await commands.release();

    for (const [name, value] of values) {
      expect(value, `${control} left ${name} unresolved under the press`).not.toBe('');
    }
    expect(pressed, `${control} did not answer the press`).not.toBe(hovered);
    expect(after.width, `${control} widened under the press`).toBeCloseTo(before.width, 1);
    expect(after.height, `${control} grew under the press`).toBeCloseTo(before.height, 1);
  }
});

/* The wait is a state too, and two of its rules are ones no card can show. A
   bar has to stand in a cell as tall as the row it stands in for. Otherwise
   the table jumps the moment the answer lands. A row that cannot answer anything
   must not light up under the pointer as though it can. */
test('a table waiting for its rows holds their height and answers no pointer', async () => {
  const columns = [{ head: 'Tool' }, { head: 'Source' }, { head: 'Versions' }];
  await write('<sds-table id="waiting" loading loading-rows="3"></sds-table><sds-table id="answered"></sds-table>', {
    then: () => {
      const waiting = q('#waiting') as HTMLElement & { columns: unknown };
      const answered = q('#answered') as HTMLElement & { columns: unknown; rows: unknown };
      waiting.columns = columns;
      answered.columns = columns;
      answered.rows = [{ cells: ['typo3_rule_lookup', 'bundled knowledge', '12.4'] }];
    },
  });

  const bars = document.querySelectorAll('#waiting tbody tr:first-child td:first-child .sds-skeleton');
  expect(bars.length, 'the waiting table drew no bars').toBe(1);
  expect(getComputedStyle(bars[0] as Element).backgroundColor).not.toBe('');

  const height = (id: string): number => box(q(`#${id} tbody tr:first-child`)).height;
  expect(height('waiting'), 'the table jumps when the rows arrive').toBeCloseTo(height('answered'), 0);

  const row = q('#waiting tbody tr:first-child');
  await userEvent.hover(row);
  expect(getComputedStyle(row).backgroundColor, 'a row with no answer in it lit up under the pointer').toBe('rgba(0, 0, 0, 0)');
});
