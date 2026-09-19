/* A directory, as the shape it has on disk.

   The claim that matters is that it folds with **no script**. A `<details>`
   per directory, so a page from a server still opens and closes for a reader
   who runs nothing. That is invisible in the markup, as a `<details>` looks
   the same with or without anything that works. So the press happens here
   in a frame that runs no script at all.

   And that a level is how deep it stands open and not how deep it draws. The
   theme this spelling comes from renders nothing below the level, which
   takes away what a reader came for. */

import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { q, qa, shown, write } from './lib/frame.ts';

const ENTRIES = [
  {
    label: 'docs/',
    note: 'the sources',
    items: [
      { label: 'Index.rst' },
      { label: 'Introduction/', items: [{ label: 'Deep.rst', items: [{ label: 'Deeper.rst' }] }] },
    ],
  },
  { label: 'composer.json' },
];

async function open(level: number, icons = false): Promise<void> {
  await write(`<sds-tree id="t" level="${level}"${icons ? ' icons' : ''} entries='${JSON.stringify(ENTRIES)}'></sds-tree>`);
  expect(shown(q('#t .sds-tree__name'))).toBe(true);
}

test('a level is how deep it stands open, and nothing below it goes', async () => {
  await open(1);
  /* Every name the entries hold is in the page — three levels below the one
     that stands open included. */
  expect(qa('#t .sds-tree__name').map((n) => n.textContent))
    .toEqual(['docs/', 'Index.rst', 'Introduction/', 'Deep.rst', 'Deeper.rst', 'composer.json']);
  expect(qa<HTMLDetailsElement>('#t details').map((f) => f.open), 'the first level stands open and the rest stands closed')
    .toEqual([true, false, false]);

  await open(9);
  expect(qa<HTMLDetailsElement>('#t details').every((f) => f.open)).toBe(true);
});

test('it folds with no script at all', async () => {
  /* The whole reason for `<details>` over a framework's collapse: a document
     renders on a server, and somebody who runs nothing reads it. A sandbox
     that permits no script is that reader. Prerendered markup is what a
     document carries, so the element stands written out by hand the way
     the renderer writes it. */
  await write('');
  const frame = document.createElement('iframe');
  frame.sandbox.add('allow-same-origin');
  frame.style.cssText = 'width:600px;height:400px;border:0';
  frame.srcdoc = `<!doctype html><html lang="en" data-theme="dark"><head>
    <meta charset="utf-8"><link rel="stylesheet" href="/packages/frontend/src/styles/styles.css">
    </head><body class="sds-app">
    <div class="sds-tree"><ul class="sds-tree__list">
      <li class="sds-tree__item"><details class="sds-tree__fold">
        <summary class="sds-tree__row"><span class="sds-tree__mark"></span><span class="sds-tree__name">docs/</span></summary>
        <ul class="sds-tree__list"><li class="sds-tree__item">
          <span class="sds-tree__row"><span class="sds-tree__name">Index.rst</span></span>
        </li></ul>
      </details></li>
    </ul></div></body></html>`;
  document.body.append(frame);
  await new Promise((resolve) => frame.addEventListener('load', resolve, { once: true }));

  const inside = page.frameLocator(page.elementLocator(frame));
  const inner = inside.getByText('Index.rst');
  await expect.element(inner, { message: 'folded, with nothing running' }).not.toBeVisible();
  await inside.getByText('docs/').click();
  await expect.element(inner, { message: 'and the press is the platform’s own' }).toBeVisible();
});

test('a leaf name begins where a directory name does', async () => {
  await open(9);
  const at = (text: string): number => {
    const name = qa('#t .sds-tree__name').find((n) => n.textContent === text) as HTMLElement;
    return Math.round(name.getBoundingClientRect().left);
  };
  /* Both sit one level under `docs/`, so a fold mark on one of them must not
     move the other's name. The mark keeps its box on every row. */
  expect(at('Index.rst')).toBe(at('Introduction/'));
});

test('a mark for a directory and one for a file, on request', async () => {
  await open(9);
  expect(qa('#t .sds-tree__glyph').length, 'off unless asked for').toBe(0);

  await open(9, true);
  const file = qa('#t .sds-tree__item').find((item) => item.textContent?.includes('composer.json')) as HTMLElement;
  expect(shown(file.querySelector('[data-icon="actions-file"]'))).toBe(true);
  expect(shown(q('#t .sds-tree__fold [data-icon="actions-folder"]'))).toBe(true);
});
