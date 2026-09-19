/* A value the reader takes away.

   The clipboard is the one thing here nothing else can see. A card is a
   picture, and the markup says only that there is a button. A browser with no
   clipboard must get no button at all. Pressed here, and read back out of
   the clipboard rather than off the element that claims to have written it. */

import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { box, clipboard, q, settle, shown, sleep, write } from './lib/frame.ts';

const PAGE = `
  <dl>
    <dt>Directory</dt>
    <dd><sds-copy id="dir" label="Directory" value="~/projects/blog/.worktrees/14-3-dev"></sds-copy></dd>
    <dt>Database</dt>
    <dd><sds-copy id="db" label="Database" value="companion_14_3_dev"></sds-copy></dd>
  </dl>
  <sds-copy id="bare" value="admin"></sds-copy>
  <div style="width:160px">
    <sds-copy id="head" label="Directory" ellipsis="start" value="~/projects/blog/.worktrees/14-3-dev"></sds-copy>
    <sds-copy id="tail" label="Directory" ellipsis="end" value="~/projects/blog/.worktrees/14-3-dev"></sds-copy>
  </div>`;

const read = (): Promise<string> => navigator.clipboard.readText();

beforeEach(async () => {
  await write(PAGE);
  expect(shown(q('#dir button'))).toBe(true);
});

test('the press puts the value on the clipboard, and nothing that frames it', async () => {
  await clipboard(async () => {
    await userEvent.click(q('#dir button'));
    await expect.poll(read, { message: 'the value whole, with no term and no chrome around it' })
      .toBe('~/projects/blog/.worktrees/14-3-dev');

    await userEvent.click(q('#db button'));
    await expect.poll(read).toBe('companion_14_3_dev');
  });
});

test('each button says what it copies, so a reader can tell two of them apart', () => {
  expect(q('#dir button').getAttribute('aria-label')).toBe('Copy Directory');
  expect(q('#dir button').getAttribute('title')).toBe('Copy Directory');
  expect(q('#db button').getAttribute('aria-label')).toBe('Copy Database');
  /* Without a name it says the true thing that names nothing. */
  expect(q('#bare button').getAttribute('aria-label')).toBe('Copy this value');
});

test('a press that worked says so, in the glyph and out loud', async () => {
  await clipboard(async () => {
    const said = q('#dir .sds-said-only');
    expect(said.textContent).toBe('');
    expect(shown(q('#dir [data-icon="actions-duplicate"]'))).toBe(true);
    expect(document.querySelectorAll('#dir .sds-btn__label').length, 'one glyph, and the sentence in title').toBe(0);

    await userEvent.click(q('#dir button'));
    await expect.element(q('#dir button')).toHaveClass(/is-copied/);
    expect(shown(q('#dir [data-icon="actions-check"]'))).toBe(true);
    expect(document.querySelectorAll('#dir [data-icon="actions-duplicate"]').length).toBe(0);
    /* A screen reader announces no word that changes in place; a node that was
       empty, it does. */
    expect(said.textContent, 'a press that only changed a glyph is one a reader never hears about')
      .toBe('Copied Directory');

    /* And it goes back on its own, so the next press has something to say. */
    await expect.poll(() => said.textContent, { timeout: 4000 }).toBe('');
    expect(shown(q('#dir [data-icon="actions-duplicate"]'))).toBe(true);
  });
});

describe('an origin that is not a secure context', () => {
  /* Exactly what `http://a-host.test:6006` gives a browser: no async clipboard
     at all. A LAN address or a `.test` domain over http is where a reader
     looks at a design system. A button drawn only where the API exists left
     no button on every one of those, which reads as a component that does not
     work. The element asks at every press, so the answer changes under it. */
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', { get: () => undefined, configurable: true });
  });
  afterEach(() => {
    delete (navigator as { clipboard?: unknown }).clipboard;
  });

  test('still draws the press, and still copies', async () => {
    expect(shown(q('#dir button'))).toBe(true);
    expect(shown(q('#dir [data-icon="actions-duplicate"]'))).toBe(true);

    /* The older way, which every browser has and no context withholds. Nothing
       can read back what it put on the clipboard here, as the read side is the
       same absent API. So the event the browser fires is the witness. */
    let taken: string | null = null;
    document.addEventListener('copy', (event) => {
      taken = event.target instanceof HTMLTextAreaElement ? event.target.value : '';
    }, { once: true });
    q('#dir button').click();
    await sleep(200);
    expect(taken, 'the value whole, by the way that works here').toBe('~/projects/blog/.worktrees/14-3-dev');
    expect(shown(q('#dir [data-icon="actions-check"]'))).toBe(true);
  });

  test('and a code block keeps its copy button too', async () => {
    const block = document.createElement('sds-code');
    block.id = 'block';
    block.setAttribute('source', 'ls -la');
    block.setAttribute('copy', '');
    document.body.append(block);
    await settle();
    expect(shown(q('#block .sds-code__copy'))).toBe(true);
  });
});

test('the value gives up the room, never the press', () => {
  const host = q('#dir');
  const value = q('.sds-copy__value', host);
  const button = q('.sds-copy__button', host);
  /* Squeezed to less than the pair needs, which is a value in a column. */
  host.style.width = '220px';

  expect(getComputedStyle(value).fontFamily, 'a path is the machine’s own text').toContain('Source Code Pro');
  expect(getComputedStyle(value).overflowWrap, 'a path has no spaces to break at').toBe('anywhere');
  /* The press keeps what it needs; the path wraps under itself instead. */
  expect(Math.round(box(button).width)).toBeGreaterThanOrEqual(Math.round(button.scrollWidth));
});

describe('a value cut instead of wrapped', () => {
  /* Which end survives, read off the characters themselves rather than off the
     declarations that have to cut them. The box is narrower than the path, so
     one end of the string stands outside it and the other does not. */
  const ends = (id: string) => {
    const value = q(`#${id} .sds-copy__value`);
    /* The text itself, past the markers lit leaves around a binding. */
    const bdi = q('bdi', value);
    const text = [...bdi.childNodes].find((n) => n.nodeType === Node.TEXT_NODE) as Text;
    const edge = box(value);
    const at = (i: number): DOMRect => {
      const range = document.createRange();
      range.setStart(text, i);
      range.setEnd(text, i + 1);
      return range.getBoundingClientRect();
    };
    const inside = (r: DOMRect): boolean => r.left >= edge.left - 1 && r.right <= edge.right + 1;
    return {
      first: inside(at(0)),
      last: inside(at(text.length - 1)),
      clipped: value.scrollWidth > value.clientWidth,
      lines: getComputedStyle(value).whiteSpace,
      dots: getComputedStyle(value).textOverflow,
    };
  };

  test('the front goes, and the name the path ends on stays', () => {
    const shape = ends('head');
    expect(shape.lines, 'one line — a cut value that wraps is neither').toBe('nowrap');
    expect(shape.dots).toBe('ellipsis');
    expect(shape.clipped, 'the column is narrower than the path').toBe(true);
    expect(shape.last, 'the segment that tells a worktree apart').toBe(true);
    expect(shape.first, 'the front is what went').toBe(false);
  });

  test('or the back goes, and the root it begins at stays', () => {
    const shape = ends('tail');
    expect(shape.clipped).toBe(true);
    expect(shape.first).toBe(true);
    expect(shape.last).toBe(false);
  });

  test('the cut part is still under the pointer, and still copies whole', async () => {
  await clipboard(async () => {
      expect(q('#head .sds-copy__value').getAttribute('title')).toBe('~/projects/blog/.worktrees/14-3-dev');
      /* Nothing hides on a value that wraps, so nothing has to stand twice. */
      expect(q('#dir .sds-copy__value').getAttribute('title') ?? '').toBe('');

      await userEvent.click(q('#head button'));
      await expect.poll(read, { message: 'the press writes the property, never the visible text' })
        .toBe('~/projects/blog/.worktrees/14-3-dev');
    });
  });
});
