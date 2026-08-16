/* What a page gets before it reaches for a class.

   A consumer's own content arrives without classes, so the elements are the
   reset and the classes are what you write when the element cannot say it. The
   fixture's body carries **no** `sds-app` on purpose: linking the stylesheet is
   the opt-in.

   The second half is the one that breaks quietly — a class must still win over
   the element it sits on, which no screenshot shows. Against `dist/`, because
   that is the file a consumer links. */

import { test, expect } from '@playwright/test';

const HTML = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
</head>
<body>
  <h1 id="bare-h1">Level one</h1>
  <h2 id="bare-h2">Level two</h2>
  <h3 id="bare-h3">Level three</h3>
  <h4 id="bare-h4">Level four</h4>
  <p id="bare-p">A paragraph nobody put a class on.</p>
  <p id="plain-p">One with nothing but another paragraph after it.</p>
  <p id="before-head">The one after it, and the one before a heading.</p>

  <h2 id="two-at-three" class="sds-h3">Level two, third size</h2>
  <h1 id="one-at-display" class="sds-display">Level one, display size</h1>
  <p id="p-as-lead" class="sds-lead">A paragraph set as a lead.</p>
</body>
</html>`;

/** The px value of a computed font size, so the numbers below read as the
    scale rather than as strings. */
const size = async (page: import('@playwright/test').Page, id: string): Promise<number> =>
  page.locator(`#${id}`).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

test.beforeEach(async ({ page }) => {
  await page.route('**/defaults-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: HTML }));
  await page.goto('/defaults-fixture.html', { waitUntil: 'load' });
});

test('bare elements are already dressed, with no wrapper class', async ({ page }) => {
  /* Descending, and none of them at the browser's 32/24/18px defaults. What is
     asserted is the *order and the distance*, not four literals that would
     have to be edited every time the scale moves. */
  const h1 = await size(page, 'bare-h1');
  const h2 = await size(page, 'bare-h2');
  const h3 = await size(page, 'bare-h3');
  const h4 = await size(page, 'bare-h4');
  const p = await size(page, 'bare-p');

  expect(h1).toBeGreaterThan(h2);
  expect(h2).toBeGreaterThan(h3);
  expect(h3).toBeGreaterThan(h4);
  expect(p).toBeGreaterThan(15);

  /* The browser's own defaults, which are what a page gets when the element
     rules are missing: 2em, 1.5em, 1.17em of a 16px root. */
  expect(h1, 'h1 should not be at the browser default').not.toBe(32);
  expect(h2, 'h2 should not be at the browser default').not.toBe(24);

  /* Nothing carries a margin above it. Every distance in this system is stated
     below the block it belongs to — one direction, so nothing collapses, the
     number an element computes is the one a reader sees, and the air above a
     heading is the step below whatever stands before it. */
  const above = (id: string) =>
    page.locator(`#${id}`).evaluate((el) => getComputedStyle(el).marginBlockStart);
  for (const id of ['bare-h1', 'bare-h2', 'bare-h3', 'bare-p']) {
    expect(await above(id), `${id} should carry no margin above it`).toBe('0px');
  }

  /* The step *below* is the element's, because the box a paragraph lands in is
     as often a component's as a document's — an answer, a note, a modal — and
     none of those is `.sds-prose`. Two paragraphs with nothing between them is
     what this file exists to catch. */
  const under = (id: string) =>
    page.locator(`#${id}`).evaluate((el) => getComputedStyle(el).marginBlockEnd);
  expect(await under('plain-p'), 'a paragraph carries the step under it').toBe('16px');
  /* And more where a heading follows: the air above a heading is stated below
     the block before it, because that is the block with a box to put it on. */
  expect(await under('before-head'), 'and more where a heading follows').toBe('32px');
  /* A heading's own step is the small one — it belongs to what follows. This
     is the only heading in the fixture with text after it rather than another
     heading; the ones above carry the air of the heading that follows them,
     which is the same rule seen from the other side. */
  expect(await under('bare-h4'), 'a heading sits close to its own text').toBe('8px');
  expect(await under('bare-h1'), 'and carries the next heading’s air where one follows').toBe('40px');

  /* Body copy is held to a measure. A paragraph that runs the width of a
     1280px viewport is unreadable however well it is set. */
  const width = await page.locator('#bare-p').evaluate((el) => el.getBoundingClientRect().width);
  expect(width).toBeLessThan(900);
});

test('a class always overrides the element it sits on', async ({ page }) => {
  /* The sentence the markup can only tell with both: level two, third size. */
  expect(await size(page, 'two-at-three')).toBe(await size(page, 'bare-h3'));
  expect(await size(page, 'two-at-three')).not.toBe(await size(page, 'bare-h2'));

  /* And the other direction, where a level is set larger than its own step. */
  expect(await size(page, 'one-at-display')).toBeGreaterThan(await size(page, 'bare-h1'));

  /* A paragraph set as a lead takes the lead's size and its shorter measure —
     shorter in *characters*, which is what a measure is. The tokens are stated
     in pixels and the two are close enough there that comparing them directly
     proves nothing, so each is divided by its own font size. */
  const leadSize = await size(page, 'p-as-lead');
  const proseSize = await size(page, 'bare-p');
  expect(leadSize).toBeGreaterThan(proseSize);

  const lead = await page.locator('#p-as-lead').evaluate((el) => el.getBoundingClientRect().width);
  const prose = await page.locator('#bare-p').evaluate((el) => el.getBoundingClientRect().width);
  expect(lead / leadSize, 'a lead is held to fewer characters than body copy').toBeLessThan(prose / proseSize);
});

/* The rest of what arrives without a class: a link, a phrase in mono, a
   picture, a rule across the page. The picture is the one that costs something
   — one wider than its column pushes the whole page sideways, arriving through
   content instead of through markup. */
const CONTENT = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
</head>
<body>
  <div style="width:200px">
    <img id="wide" src="/assets/diagrams/answer-sources.svg" width="1200" height="750" alt="" />
  </div>
  <p>A sentence naming <code id="inline-code">typo3_icon_lookup</code>, which is a thing the machine named.</p>
  <p><a id="bare-a" href="#somewhere">a link nobody classed</a></p>
  <div><a id="standalone-a" href="#somewhere">a link that is a block of its own</a></div>
  <hr id="rule" />

  <div class="sds-column"><p id="in-column">A paragraph where the container states the step.</p></div>

  <ul id="bullets"><li>An item<ul id="nested"><li>One step in</li></ul></li></ul>
  <ol id="lettered" type="a"><li>The source said a.</li></ol>
  <ul id="plain" class="sds-list sds-list--plain"><li><a href="#">A list of links</a></li></ul>
</body>
</html>`;

test('content that arrives without a class is still the system', async ({ page }) => {
  await page.route('**/content-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: CONTENT }));
  await page.goto('/content-fixture.html', { waitUntil: 'load' });

  /* A 1200px picture inside a 200px column stays inside it. */
  const img = await page.locator('#wide').evaluate((el) => el.getBoundingClientRect().width);
  expect(img, 'an image is held to the box it is in').toBeLessThanOrEqual(200);

  /* Mono, and smaller than the sentence around it rather than the same size,
     which is what makes a name read as a name. */
  const code = await page.locator('#inline-code').evaluate((el) => getComputedStyle(el).fontFamily);
  expect(code).toContain('Source Code Pro');

  /* Not the browser's blue. And the underline says which of the two kinds of
     link it is: inside a sentence there is nothing to stand apart from, so it
     is drawn at rest — colour alone does not reach 3:1 against body text. A
     link that is a block of its own is told apart by standing alone. */
  const link = (id: string) =>
    page.locator(`#${id}`).evaluate((el) => {
      const s = getComputedStyle(el);
      return { color: s.color, decoration: s.textDecorationLine };
    });
  const inSentence = await link('bare-a');
  expect(inSentence.color).not.toBe('rgb(0, 0, 238)');
  expect(inSentence.decoration, 'a link inside a sentence is underlined at rest').toBe('underline');
  expect((await link('standalone-a')).decoration,
    'a link that is a block of its own is not').toBe('none');

  /* And where the container states the step itself, the element gives its own
     up: a gap and a margin stacked are neither of the two values. */
  const inColumn = await page.locator('#in-column').evaluate((el) => getComputedStyle(el).marginBlockEnd);
  expect(inColumn, 'a column states its own step, so the paragraph drops its').toBe('0px');

  /* One hairline, no radius — and far more air than any block carries, because
     a rule separates two sections of a text rather than standing in the flow as
     one more block. The same distance wherever it is written. */
  const rule = await page.locator('#rule').evaluate((el) => {
    const s = getComputedStyle(el);
    return { top: s.borderTopWidth, bottom: s.borderBottomWidth, margin: s.marginBlockStart };
  });
  expect(rule.top).toBe('1px');
  expect(rule.bottom).toBe('0px');
  expect(parseFloat(rule.margin), 'a rule stands off the text it separates').toBeGreaterThan(32);
});

/* Lists, which arrive without a class more often than anything else here. The
   third case is worth a test rather than an eye: an ordered list counts the way
   its *source* said, and the `type` attribute saying so carries no weight in
   the cascade — one `ol { list-style: decimal }` renumbers every lettered list
   on every page, invisibly. */
test('a list is set by the element, and the source still picks the marker', async ({ page }) => {
  await page.route('**/content-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: CONTENT }));
  await page.goto('/content-fixture.html', { waitUntil: 'load' });

  const list = (id: string) =>
    page.locator(`#${id}`).evaluate((el) => {
      const s = getComputedStyle(el);
      return { marker: s.listStyleType, indent: s.paddingLeft, above: s.marginBlockStart, under: s.marginBlockEnd };
    });

  /* Indented by the marker's own width, not by the browser's 40px, and the
     step under it is the one every other block carries. */
  const bullets = await list('bullets');
  expect(bullets.marker).toBe('disc');
  expect(bullets.indent).not.toBe('40px');
  expect(parseFloat(bullets.indent)).toBeGreaterThan(0);
  expect(bullets.above).toBe('0px');
  expect(bullets.under).toBe('16px');

  /* A level in is a different mark, so nesting is visible without indent
     alone having to carry it. And a nested list is part of the item it hangs
     under rather than a block after it, so it adds no step of its own — that
     one closes with the item, and a second one would open a gap mid-list. */
  expect((await list('nested')).marker).toBe('circle');
  expect((await list('nested')).under).toBe('0px');

  /* And the attribute the renderer wrote is left speaking. */
  expect((await list('lettered')).marker).toBe('lower-alpha');

  /* A list of links is marked by being links. Both halves: no marker, and the
     indent that was only there to hold one. */
  const plain = await list('plain');
  expect(plain.marker).toBe('none');
  expect(plain.indent).toBe('0px');
});

/* The page somebody wrote by hand.

   Not every consumer renders through a directive: a page is a `<section>`, a
   heading, a paragraph and whatever block the writer reached for. Everything
   here is markup the system never emitted, and the question is only whether it
   arrives with the same rhythm as markup that came out of a component. */
const HAND = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
</head>
<body class="sds-app">
  <main class="sds-column">
    <section><h2 class="sds-h2" id="classed-head">Classed</h2><p id="after-classed">under it</p></section>
    <section><h2 id="bare-head">Bare</h2><p id="after-bare">under it</p></section>
    <section id="flow">
      <p id="before-figure">before</p>
      <figure id="hand-figure"><img src="/assets/diagrams/answer-sources.svg" width="40" height="25" alt="" /></figure>
      <blockquote id="hand-quote">quoted</blockquote>
      <dl id="hand-dl"><dt>term</dt><dd>what it is</dd></dl>
      <pre id="hand-pre">a block of output</pre>
      <table id="hand-table"><tbody><tr><td>a cell</td></tr></tbody></table>
      <p id="after-table">after</p>
    </section>
  </main>
</body>
</html>`;

test('markup written by hand keeps the rhythm markup from a component has', async ({ page }) => {
  await page.route('**/hand-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: HAND }));
  await page.goto('/hand-fixture.html', { waitUntil: 'load' });

  const gap = (a: string, b: string) =>
    page.evaluate(([x, y]) => {
      const top = document.getElementById(y as string)!.getBoundingClientRect().top;
      const bottom = document.getElementById(x as string)!.getBoundingClientRect().bottom;
      return Math.round(top - bottom);
    }, [a, b]);

  /* The one a container's own step can silently take away. A heading's distance
     to the text under it is inside the block rather than between two of them,
     so a wrapper somebody wrote between the column and the heading must not
     cost it — and the classed heading has to measure what the bare one does,
     or the same page reads two ways depending on which the writer used. */
  expect(await gap('classed-head', 'after-classed')).toBe(12);
  expect(await gap('bare-head', 'after-bare')).toBe(12);

  /* And the blocks a document reaches for that no component draws. Left to the
     browser, a figure and a quote arrive indented forty pixels with no step at
     all — which reads as a broken column rather than as a missing rule. */
  const box = (id: string) =>
    page.locator(`#${id}`).evaluate((el) => {
      const s = getComputedStyle(el);
      return { start: s.marginInlineStart, end: s.marginInlineEnd, under: s.marginBlockEnd };
    });

  for (const id of ['hand-figure', 'hand-quote']) {
    const one = await box(id);
    expect(one.start, `${id} sits where the column puts it`).toBe('0px');
    expect(one.end, `${id} sits where the column puts it`).toBe('0px');
  }
  for (const id of ['hand-figure', 'hand-quote', 'hand-dl', 'hand-pre', 'hand-table']) {
    expect((await box(id)).under, `${id} carries the step under it`).toBe('16px');
  }
  expect(await gap('hand-table', 'after-table')).toBe(16);
});

/* The rhythm a column actually produces.

   The gate measured whether a distance was on the grid, and 32px is on it as
   surely as 16px — so a change that doubled every step passed everything and
   was found by looking at a page. This pins the numbers instead: one step
   between blocks, and a heading buys one more. */
const RHYTHM = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
</head>
<body class="sds-app">
  <main class="sds-column">
    <p id="r-a">One.</p>
    <p id="r-b">Two.</p>
    <div class="sds-note" id="r-note"><div class="sds-note__body">A block a component draws.</div></div>
    <p id="r-c">After the block.</p>
    <h2 class="sds-h3" id="r-head">A heading</h2>
    <p id="r-d">Under the heading.</p>
  </main>
</body>
</html>`;

test('a column produces one step between blocks and two above a heading', async ({ page }) => {
  await page.route('**/rhythm-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: RHYTHM }));
  await page.goto('/rhythm-fixture.html', { waitUntil: 'load' });

  const gap = (a: string, b: string) =>
    page.evaluate(([x, y]) => {
      const top = document.getElementById(y as string)!.getBoundingClientRect().top;
      const bottom = document.getElementById(x as string)!.getBoundingClientRect().bottom;
      return Math.round(top - bottom);
    }, [a, b]);

  /* Two paragraphs: the column's own gap and nothing else. */
  expect(await gap('r-a', 'r-b'), 'two paragraphs are one step apart').toBe(16);

  /* A block a component draws carries a step of its own for the flow it may
     land in. Inside a column that step is the gap, and it is taken back —
     stacked, the two would read as one distance nobody chose. */
  expect(await gap('r-b', 'r-note'), 'a component block is one step below the text').toBe(16);
  expect(await gap('r-note', 'r-c'), 'and one step above the text under it').toBe(16);

  /* The heading's own air above, collapsed with the block's step rather than
     added to it. Closer to the text under it than to what came before, because
     a heading belongs to what follows. */
  expect(await gap('r-c', 'r-head'), 'a heading stands clear of what came before').toBe(32);
  expect(await gap('r-head', 'r-d'), 'and close to its own text').toBe(8);
});

/* The two containers, calibrated.

   `Specimens/Spacing/Containers` draws these numbers; this holds them. A demo
   page can be wrong in its markup and in the system at once and there is no
   telling which by looking — so the smallest case that shows a rhythm is the
   one that decides. */
const CONTAINERS = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
</head>
<body class="sds-app">
  <div class="sds-column">
    <p id="c-a">One.</p>
    <p id="c-b">Two.</p>
    <h3 class="sds-h3" id="c-h">A heading</h3>
    <p id="c-c">Its text.</p>
  </div>
  <div class="sds-stack">
    <p id="s-a">One.</p>
    <h3 class="sds-h3" id="s-h">A heading</h3>
    <p id="s-b">Its text.</p>
  </div>
</body>
</html>`;

test('a column is a flow and a stack is one distance', async ({ page }) => {
  await page.route('**/containers-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: CONTAINERS }));
  await page.goto('/containers-fixture.html', { waitUntil: 'load' });

  const gap = (a: string, b: string) =>
    page.evaluate(([x, y]) => {
      const top = document.getElementById(y as string)!.getBoundingClientRect().top;
      const bottom = document.getElementById(x as string)!.getBoundingClientRect().bottom;
      return Math.round(top - bottom);
    }, [a, b]);

  /* A column ranks what is in it: the blocks carry their own step, and the one
     before a heading carries more. Every distance is stated below the block it
     belongs to, so what an element computes is what a reader sees. */
  expect(await gap('c-a', 'c-b'), 'two blocks are one step apart').toBe(16);
  expect(await gap('c-b', 'c-h'), 'the block before a heading carries more').toBe(32);
  expect(await gap('c-h', 'c-c'), 'and a heading belongs to what follows').toBe(8);

  /* A stack does not rank what is in it. That is the whole of the difference,
     and it is why both exist. */
  expect(await gap('s-a', 's-h'), 'a stack states one distance').toBe(16);
  expect(await gap('s-h', 's-b'), 'whatever stands in it').toBe(16);
});
