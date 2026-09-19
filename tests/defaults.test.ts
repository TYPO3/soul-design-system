/* What a page gets before it reaches for a class.

   A consumer's own content arrives without classes. So the elements are the
   reset, and the classes are what you write when the element cannot say it. The
   fixture's body carries **no** `sds-app` on purpose: linking the stylesheet is
   the opt-in.

   The second half is the one that breaks quietly — a class must still win over
   the element it sits on, which no screenshot shows. Against the sources; the
   `dist` check holds the drop-in a consumer links to them. */

import { expect, test } from 'vitest';
import { box, q, write } from './lib/frame.ts';

const HTML = `
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

  <div class="sds-prose">
    <p id="prose-p">A paragraph inside a passage.</p>
    <p id="lead-in-prose" class="sds-lead">A lead inside one.</p>
  </div>`;

/** The px value of a computed font size, so the numbers below read as the
    scale rather than as strings. */
const size = (id: string): number => parseFloat(getComputedStyle(q(`#${id}`)).fontSize);

/** How wide it drew, which is the only way to read a measure. */
const width = (id: string): number => box(q(`#${id}`)).width;

/** The distance between the foot of one block and the head of the next. */
const gap = (a: string, b: string): number => Math.round(box(q(`#${b}`)).top - box(q(`#${a}`)).bottom);

test('bare elements already have their style, with no wrapper class', async () => {
  await write(HTML, { app: false });

  /* Down the scale, and none of them at the browser's 32/24/18px defaults.
     The claim is the *order and the distance*, not four literals that need
     an edit every time the scale moves. */
  const h1 = size('bare-h1');
  const h2 = size('bare-h2');
  const h3 = size('bare-h3');
  const h4 = size('bare-h4');
  const p = size('bare-p');

  expect(h1).toBeGreaterThan(h2);
  expect(h2).toBeGreaterThan(h3);
  expect(h3).toBeGreaterThan(h4);
  expect(p).toBeGreaterThan(15);

  /* The browser's own defaults, which are what a page gets with no element
     rules: 2em, 1.5em, 1.17em of a 16px root. */
  expect(h1, 'h1 must not be at the browser default').not.toBe(32);
  expect(h2, 'h2 must not be at the browser default').not.toBe(24);

  /* A block carries its step on both sides, and two that meet collapse into
     the larger. A text block and a title carry nothing above: a paragraph
     owes its neighbour one step, and a title opens what it stands over. */
  const above = (id: string): string => getComputedStyle(q(`#${id}`)).marginBlockStart;
  for (const id of ['bare-h1', 'bare-p']) {
    expect(above(id), `${id} must carry no margin above it`).toBe('0px');
  }
  /* The air above a heading is the heading's own, and it decreases with the
     level. It wins against the paragraph's step before it rather than adds to
     it. */
  expect(above('bare-h2'), 'a second level carries its air above').toBe('40px');
  expect(above('bare-h3'), 'a third level less').toBe('32px');

  /* The step *below* is the element's. The box a paragraph lands in is as
     often a component's as a document's — an answer, a note, a modal. None
     of those is `.sds-prose`. Two paragraphs with nothing between them is
     what this file exists to catch. */
  const under = (id: string): string => getComputedStyle(q(`#${id}`)).marginBlockEnd;
  expect(under('plain-p'), 'a paragraph carries the step under it').toBe('16px');
  expect(under('before-head'), 'the same before a heading, which brings its own air').toBe('16px');
  /* A heading's own step is the small one — it belongs to what follows. */
  expect(under('bare-h4'), 'a heading sits close to its own text').toBe('8px');

  /* And no measure on one. A paragraph stands in a component's box as often as
     in a document. So the reading width is the passage's decision rather than
     the element's, which makes it a class, and the class is `.sds-prose`. */
  expect(width('bare-p'), 'a bare paragraph runs to the box it has').toBeGreaterThan(900);
  expect(width('prose-p'), 'and stops inside a passage').toBeLessThan(900);
});

test('a class always overrides the element it sits on', async () => {
  await write(HTML, { app: false });

  /* The sentence the markup can only tell with both: level two, third size. */
  expect(size('two-at-three')).toBe(size('bare-h3'));
  expect(size('two-at-three')).not.toBe(size('bare-h2'));

  /* And the other direction, where a level sets larger than its own step. */
  expect(size('one-at-display')).toBeGreaterThan(size('bare-h1'));

  /* A paragraph set as a lead takes the lead's size and its shorter measure.
     Shorter in *characters*, which is what a measure is. The tokens stand in
     pixels and the two are close enough there that a direct comparison proves
     nothing. So each divides by its own font size. Both inside the passage,
     because that is where body copy has a measure to be shorter than. A lead
     that lost its own there is what the passage's weightless rule exists to
     prevent. */
  const leadSize = size('p-as-lead');
  const proseSize = size('prose-p');
  expect(leadSize).toBeGreaterThan(proseSize);

  const lead = width('lead-in-prose') / size('lead-in-prose');
  const prose = width('prose-p') / proseSize;
  expect(lead, 'a lead stops at fewer characters than body copy').toBeLessThan(prose);
});

/* The other half of that rule, from the side the platform owns. Three ways to
   get a `display` from this system, and the word that takes it back. Plus the
   one `hidden` the browser answers with something other than `display`, which
   a blanket rule breaks for every consumer at once. */
const HIDDEN = `
  <p id="bare" hidden>Nothing set a display on this one.</p>
  <div id="classed" class="sds-note" hidden>A block the class layer lays out.</div>
  <sds-note id="host" hidden>An element the base layer states a display for.</sds-note>
  <p id="findable" hidden="until-found">The one a find-in-page can open.</p>
  <h2 id="said" class="sds-said-only">The name of the thing</h2>
  <p id="after">What follows it.</p>`;

test('a hidden element stays hidden, whatever this system set a display to', async () => {
  await write(HIDDEN, { app: false });

  const display = (id: string): string => getComputedStyle(q(`#${id}`)).display;

  /* The bare one is the browser's own and proves nothing on its own. The two
     below it are what an author rule had put back on the page. */
  expect(display('bare')).toBe('none');
  expect(display('classed'), 'a class must not draw a hidden thing').toBe('none');
  expect(display('host'), 'nor must the display an element gets').toBe('none');

  /* Left alone: `content-visibility` hides this one, and a page that wants
     find-in-page to reach it keeps it. */
  expect(display('findable'), 'until-found is the browser’s to answer').not.toBe('none');
});

/* The same question from the other end. A page owes the reader who listens
   things the picture already gives whoever can see it. The register that
   carries them has to stay *in* the reading, which `display: none` and
   `hidden` do not, and which is why it is neither. What it must not do is
   take room. */
test('what a page says and does not draw stays in the reading and takes no room', async () => {
  await write(HIDDEN, { app: false });

  const said = q('#said');
  await expect.element(said, { message: 'a said heading is still a heading in the tree' })
    .toHaveAccessibleName('The name of the thing');

  const r = box(said);
  expect(getComputedStyle(said).display, 'nothing a reader hears can be display:none').not.toBe('none');
  expect(r.width, 'and it takes no width').toBeLessThanOrEqual(1);
  expect(r.height, 'and no height').toBeLessThanOrEqual(1);

  /* And no room in the flow either: the paragraph after it stands where it
     stands with no heading there at all. */
  const top = box(q('#after')).top;
  said.remove();
  expect(top, 'the page lays out as though it were not there').toBe(box(q('#after')).top);
});

/* The rest of what arrives without a class: a link, a phrase in mono, a
   picture, a rule across the page. The picture is the one that costs something
   — one wider than its column pushes the whole page sideways, arriving through
   content instead of through markup. */
const CONTENT = `
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
  <ul id="plain" class="sds-list sds-list--plain"><li><a href="#">A list of links</a></li></ul>`;

test('content that arrives without a class is still the system', async () => {
  await write(CONTENT, { app: false });

  /* A 1200px picture inside a 200px column stays inside it. */
  expect(box(q('#wide')).width, 'an image stops at the box it is in').toBeLessThanOrEqual(200);

  /* Mono, and smaller than the sentence around it rather than the same size,
     which is what makes a name read as a name. */
  expect(getComputedStyle(q('#inline-code')).fontFamily).toContain('Source Code Pro');

  /* Not the browser's blue. And the underline says which of the two kinds of
     link it is. Inside a sentence there is nothing to stand apart from, so it
     draws at rest — colour alone does not reach 3:1 against body text. A
     link that is a block of its own stands apart on its own. */
  const link = (id: string) => {
    const s = getComputedStyle(q(`#${id}`));
    return { color: s.color, decoration: s.textDecorationLine };
  };
  const inSentence = link('bare-a');
  expect(inSentence.color).not.toBe('rgb(0, 0, 238)');
  expect(inSentence.decoration, 'a link inside a sentence carries an underline at rest').toBe('underline');
  expect(link('standalone-a').decoration, 'a link that is a block of its own is not').toBe('none');

  /* And where the container states the step itself, the element gives its own
     up. A gap and a margin stacked are neither of the two values. */
  expect(getComputedStyle(q('#in-column')).marginBlockEnd, 'a column states its own step, so the paragraph drops its').toBe('0px');

  /* One hairline, no radius. And far more air than any block carries. A rule
     separates two sections of a text rather than stands in the flow as one
     more block. The same distance wherever it stands. */
  const rule = getComputedStyle(q('#rule'));
  expect(rule.borderTopWidth).toBe('1px');
  expect(rule.borderBottomWidth).toBe('0px');
  expect(parseFloat(rule.marginBlockStart), 'a rule stands off the text it separates').toBeGreaterThan(32);
});

/* Lists, which arrive without a class more often than anything else here. The
   third case deserves a test rather than an eye. An ordered list counts the
   way its *source* said, and the `type` attribute that says so carries no
   weight in the cascade. One `ol { list-style: decimal }` renumbers every
   lettered list on every page, unseen. */
test('the element sets a list, and the source still picks the marker', async () => {
  await write(CONTENT, { app: false });

  const list = (id: string) => {
    const s = getComputedStyle(q(`#${id}`));
    return { marker: s.listStyleType, indent: s.paddingLeft, above: s.marginBlockStart, under: s.marginBlockEnd };
  };

  /* Indented by the marker's own width, not by the browser's 40px, and the
     step under it is the one every other block carries. */
  const bullets = list('bullets');
  expect(bullets.marker).toBe('disc');
  expect(bullets.indent).not.toBe('40px');
  expect(parseFloat(bullets.indent)).toBeGreaterThan(0);
  expect(bullets.above).toBe('16px');
  expect(bullets.under).toBe('16px');

  /* A level in is a different mark, so the nest is visible and the indent
     does not carry it alone. A nested list is part of the item it hangs under
     rather than a block after it, so it adds no step of its own. That one
     closes with the item, and a second one opens a gap mid-list. */
  expect(list('nested').marker).toBe('circle');
  expect(list('nested').under).toBe('0px');

  /* And the attribute the renderer wrote still speaks. */
  expect(list('lettered').marker).toBe('lower-alpha');

  /* A list of links has its links as its mark. Both halves: no marker, and
     the indent that was only there to hold one. */
  const plain = list('plain');
  expect(plain.marker).toBe('none');
  expect(plain.indent).toBe('0px');
});

/* The page somebody wrote by hand.

   Not every consumer renders through a directive: a page is a `<section>`, a
   heading, a paragraph and whatever block the writer reached for. Everything
   here is markup the system never emitted. The question is only if it arrives
   with the same rhythm as markup that came out of a component. */
const HAND = `
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
  </main>`;

test('markup written by hand keeps the rhythm markup from a component has', async () => {
  await write(HAND);

  /* The one a container's own step can silently take away. A heading's distance
     to the text under it is inside the block rather than between two of them.
     So a wrapper somebody wrote between the column and the heading must not
     cost it. The classed heading has to measure what the bare one does, or
     the same page reads two ways by which the writer used. */
  expect(gap('classed-head', 'after-classed')).toBe(12);
  expect(gap('bare-head', 'after-bare')).toBe(12);

  /* And the blocks a document reaches for that no component draws. Left to the
     browser, a figure and a quote arrive indented forty pixels with no step at
     all. That reads as a broken column rather than as an absent rule. */
  const edges = (id: string) => {
    const s = getComputedStyle(q(`#${id}`));
    return { start: s.marginInlineStart, end: s.marginInlineEnd, under: s.marginBlockEnd };
  };

  for (const id of ['hand-figure', 'hand-quote']) {
    const one = edges(id);
    expect(one.start, `${id} sits where the column puts it`).toBe('0px');
    expect(one.end, `${id} sits where the column puts it`).toBe('0px');
  }
  expect(edges('hand-dl').under, 'a list of terms is a text and carries its step').toBe('16px');
  /* A thing rather than a text carries the wider step, on both sides, and the
     paragraph beside it stands off by that. */
  for (const id of ['hand-figure', 'hand-quote', 'hand-pre', 'hand-table']) {
    expect(edges(id).under, `${id} carries the wider step`).toBe('24px');
  }
  expect(gap('before-figure', 'hand-figure')).toBe(24);
  expect(gap('hand-table', 'after-table')).toBe(24);
});

/* The rhythm a column actually produces.

   The gate measured if a distance was on the grid, and 32px is on it as
   surely as 16px. So a change that doubled every step passed everything, and
   a look at a page found it. This pins the numbers instead: one step between
   blocks, and a heading buys one more. */
const RHYTHM = `
  <main class="sds-column">
    <p id="r-a">One.</p>
    <p id="r-b">Two.</p>
    <div class="sds-note" id="r-note"><div class="sds-note__body">A block a component draws.</div></div>
    <p id="r-c">After the block.</p>
    <h2 class="sds-h3" id="r-head">A heading</h2>
    <p id="r-d">Under the heading.</p>
  </main>`;

test('a column produces one step between blocks and two above a heading', async () => {
  await write(RHYTHM);

  /* Two paragraphs: the column's own gap and nothing else. */
  expect(gap('r-a', 'r-b'), 'two paragraphs are one step apart').toBe(16);

  /* A block a component draws is a thing, and it carries the wider step on
     both sides. Against the paragraph's step that is the distance a reader
     sees, on either side of it: the larger wins, nothing adds. */
  expect(gap('r-b', 'r-note'), 'a component block stands the wider step below the text').toBe(24);
  expect(gap('r-note', 'r-c'), 'and the wider step above the text under it').toBe(24);

  /* The heading's own air above, collapsed with the block's step rather than
     added to it. Closer to the text under it than to what came before, because
     a heading belongs to what follows. */
  expect(gap('r-c', 'r-head'), 'a heading stands clear of what came before').toBe(32);
  expect(gap('r-head', 'r-d'), 'and close to its own text').toBe(8);
});

/* The two containers, calibrated.

   `Specimens/Spacing/Containers` draws these numbers; this holds them. A demo
   page can be wrong in its markup and in the system at once, and a look
   cannot tell which. So the smallest case that shows a rhythm is the one that
   decides. */
const CONTAINERS = `
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
  </div>`;

test('a column is a flow and a stack is one distance', async () => {
  await write(CONTAINERS);

  /* A column ranks what is in it: the blocks carry their own step, and a
     heading carries more above itself. The two collapse into the larger, so
     what a reader sees is the one distance the heading states. */
  expect(gap('c-a', 'c-b'), 'two blocks are one step apart').toBe(16);
  expect(gap('c-b', 'c-h'), 'a heading carries more above itself').toBe(32);
  expect(gap('c-h', 'c-c'), 'and a heading belongs to what follows').toBe(8);

  /* A stack does not rank what is in it. That is the whole of the difference,
     and it is why both exist. */
  expect(gap('s-a', 's-h'), 'a stack states one distance').toBe(16);
  expect(gap('s-h', 's-b'), 'whatever stands in it').toBe(16);
});
