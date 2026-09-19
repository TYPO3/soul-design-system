/* Content written between an element's tags survives its upgrade.

   `sds-code` has two ways in, and the cards and the pixel diff already watch
   the property path. Content between the tags has no watch. The element
   renders light DOM, so `render()` replaces its children, and the whole feature
   is the one line in `connectedCallback` that lifts them out first. Delete it
   and every content-form block is an empty frame with the cards identical.

   `renderStatic` refuses this form on purpose, which this checks too. The
   browser is where the form works, so the browser is where the proof is. */

import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as code from '../stories/components/Code.stories.ts';
import * as embed from '../stories/components/Embed.stories.ts';
import * as figure from '../stories/components/Figure.stories.ts';
import * as image from '../stories/components/Image.stories.ts';
import * as table from '../stories/components/Table.stories.ts';
import * as surface from '../stories/components/Surface.stories.ts';
import * as quote from '../stories/components/Quote.stories.ts';
import * as timeline from '../stories/components/Timeline.stories.ts';
import { box, clipboard, mount, q, qa, shown, stories } from './lib/frame.ts';

const Code = stories(code);
const Embed = stories(embed);
const Figure = stories(figure);
const Image = stories(image);
const Table = stories(table);
const Surface = stories(surface);
const Quote = stories(quote);
const Timeline = stories(timeline);

const read = (): Promise<string> => navigator.clipboard.readText();

test('a code block frames the content written between its tags', async () => {
  await mount(Code.FromContent);

  const blocks = qa('sds-code');
  expect(blocks).toHaveLength(1);
  const block = blocks[0] as HTMLElement;

  /* The frame is the component's, and the content is inside it. Not beside
     it, which is what the export produces and what a lost `connectedCallback`
     leaves behind. */
  const body = qa('.sds-code__body', block);
  expect(body).toHaveLength(1);
  expect(qa('code.language-json', body[0])).toHaveLength(1);
  expect(body[0]?.textContent).toContain('"versions": ["12.4", "13.4", "14.3"]');

  /* Nothing stranded outside the body. */
  const stray = [...block.children].filter((c) => !c.classList.contains('sds-code')).length;
  expect(stray, 'the element must hold nothing but the frame it renders').toBe(0);
});

test('the head carries the language and a working copy button', async () => {
  await clipboard(async () => {
    await mount(Code.FromContent);

    expect(q('.sds-code__lang').textContent?.trim()).toBe('json');

    const copies = qa('.sds-code__copy');
    expect(copies).toHaveLength(1);
    const copy = copies[0] as HTMLElement;
    await userEvent.click(copy);

    /* The clipboard holds the block and nothing else, asserted whole.
       `toContain` passes while the head comes with it, and a paste then begins
       `json copy` and then the first line. What frames a block is not part of
       it, and the element renders that frame into its own light DOM. */
    await expect.poll(read).toBe('{\n  "domains": ["labels", "xlf"],\n  "versions": ["12.4", "13.4", "14.3"]\n}');

    /* The class alone is not enough. A stylesheet that hides the duplicate on
       `is-copied` and never shows the check leaves a button that lost a glyph
       and gained nothing. The class is still in place. What a person sees is
       which glyph is on screen. */
    await expect.element(copy).toHaveClass(/is-copied/);
    expect(shown(q('.sds-code__copied', copy))).toBe(true);
    expect(shown(copy.querySelector('.sds-code__glyph'))).toBe(false);
    expect(copy.textContent).toMatch(/copied/);
  });
});

/* A caption between the tags is the second thing this form carries, and it
   must not become the first. Everything else the component does with its
   children reads them as the block. The theme drew the caption beside the
   element for exactly this reason, and that put the placement of a block's
   own caption outside the block. */
test('a caption between the tags stays, above the frame and off the clipboard', async () => {
  await clipboard(async () => {
    await mount(Code.CaptionedFromContent);

    const block = q('sds-code');

    /* Inside the element and above the frame — the order is the assertion, and
       it is the same order the `caption` attribute renders. */
    expect([...block.children].map((c) => c.className)).toEqual(['sds-code__caption', 'sds-code']);

    /* The markup inside it survived, which is the whole reason this form exists
       beside the attribute. */
    expect(q('.sds-code__caption code', block).textContent).toBe('composer.json');

    /* And the block is only the block: not captioned, not highlighted as if the
       sentence were a line of code. */
    const body = q('.sds-code__body', block);
    expect(body.textContent).not.toContain('Installing');
    expect(body.textContent).toContain('composer require typo3/cms-core');

    await userEvent.click(q('.sds-code__copy'));
    await expect.poll(read).toBe('composer require typo3/cms-core\nvendor/bin/typo3 cache:flush');
  });
});

/* The frame a renderer wrote, kept rather than written again. A block rendered
   twice is a nuisance. A frame written twice is a *document fetched twice*: a
   video that starts to load, stops and starts again. The theme rests on the
   server's frame, so the element takes that node. */
test('an embed keeps the frame written between its tags, and fetches it once', async () => {
  await mount(Embed.Given);

  const host = q('sds-embed');
  const frame = qa('.sds-embed__frame', host);
  expect(frame).toHaveLength(1);

  /* One frame, and it is the one the renderer wrote. The same node, moved
     into the element's own frame rather than a second one beside it. */
  const frames = qa<HTMLIFrameElement>('iframe', host);
  expect(frames).toHaveLength(1);
  expect(frames[0]?.getAttribute('src')).toMatch(/colors-borders\.card\.html$/);
  expect(qa(':scope > iframe', frame[0] as HTMLElement).length, 'the frame the element renders holds it').toBe(1);

  /* The caption written beside it lands where the component puts
     captions — under the frame, with its markup intact. */
  expect([...q('.sds-embed', host).children].map((c) => c.className))
    .toEqual(['sds-embed__frame sds-embed__frame--fixed', 'sds-embed__caption']);
  expect(q('.sds-embed__caption .sds-mono', host).textContent).toBe('700x240');
});

/* A card embeds at its measured size, and a player at none.

   The two shapes are the whole component, and neither is visible in a
   screenshot of a page wide enough for both. What separates them is what
   happens when the column is narrower than the document inside. */
test('an embed holds its ratio where it is fluid and its size where it stays fixed', async () => {
  await page.viewport(520, 800);
  await mount(Embed.Fixed);

  const fixed = q('.sds-embed__frame--fixed');
  const inner = box(q('iframe', fixed)).width;
  /* Narrower than the card, so the frame scrolls and the card keeps the width
     its `@dsCard` header declares. A frame that squeezed it reports the
     column's width here. */
  expect(Math.round(inner)).toBe(700);
  expect(fixed.scrollWidth > fixed.clientWidth).toBe(true);

  await mount(Embed.Default);
  const fluid = q('.sds-embed__frame--fluid');
  const r = box(fluid);
  /* 16 / 9 at whatever width the column is, and the document inside fills it
     in both directions. */
  expect(r.width / r.height).toBeCloseTo(16 / 9, 1);
  expect(Math.round(box(q('iframe', fluid)).width)).toBe(fluid.clientWidth);
  await page.viewport(1280, 900);
});

/* And the same form on the figure, where the stakes are the picture itself. A
   renderer writes the `<img>` for a reader with no script. An element that
   rebuilds it from `src` fetches the file again, and one that ignores the
   children frames nothing, with the picture stranded beside it. */
test('a figure keeps the picture and the caption written between its tags', async () => {
  await mount(Figure.Given);

  const host = q('sds-figure');
  expect(qa('img', host)).toHaveLength(1);
  expect(qa('.sds-figure__frame > img', host).length, 'inside the frame, not beside it').toBe(1);

  /* The caption is the renderer's own node, under the picture, with the
     markup an attribute cannot carry. */
  expect([...q('figure.sds-figure', host).children].map((c) => c.tagName.toLowerCase())).toEqual(['div', 'figcaption']);
  expect(q('figcaption.sds-figure__caption code', host).textContent).toBe('literal');
});

/* The drawing at its own size, which the viewer is the only place to get.
   Three parts hold together and only the first shows in a screenshot. The
   trigger is a real link, so a surface with no script still opens it. The
   element takes the press over on upgrade. Escape gives the focus back. */
test('a figure opens its drawing, and stays a link where nothing upgraded', async () => {
  await mount(Figure.Zoomable);
  const here = location.href;

  const trigger = q('.sds-zoom');
  /* The href is the fallback, not decoration: without it a script-less surface
     has a cursor that changes over something that does nothing. */
  expect(trigger.getAttribute('href')).toMatch(/answer-sources\.svg$/);

  const dialog = q<HTMLDialogElement>('dialog.sds-lightbox');
  expect(shown(dialog)).toBe(false);

  await userEvent.click(trigger);
  await expect.element(dialog).toBeVisible();
  /* The page did not navigate to the file — the element took the press. */
  expect(location.href).toBe(here);
  /* The same file the frame shows, at its own size. */
  expect(q('img.sds-art', dialog).getAttribute('src')).toMatch(/answer-sources\.svg$/);

  /* The whole drawing, in one screen. A viewer that scrolls shows a picture cut
     off at the foot, which is the one thing the viewer exists to fix. */
  const pane = q('.sds-lightbox__art', dialog);
  expect(pane.scrollHeight - pane.clientHeight).toBeLessThanOrEqual(0);
  expect(pane.scrollWidth - pane.clientWidth).toBeLessThanOrEqual(0);
  /* And the page under it holds still. The platform makes the rest inert, which
     a wheel over the backdrop is not. So the document locks while it is
     open, and unlocks with it. */
  const overflow = (): string => getComputedStyle(document.documentElement).overflowY;
  expect(overflow()).toBe('hidden');

  await userEvent.keyboard('{Escape}');
  await expect.element(dialog).not.toBeVisible();
  expect(overflow()).not.toBe('hidden');
});

/* The same three parts on the element with no caption under it. A figure is the
   way in for a picture that states its claim in a sentence. A picture without
   one had no way in at all, and the viewer is the only place the drawing is at
   its own size. The viewer's name falls back to the alt text, which is the
   only sentence an image carries. */
test('an image opens its picture, and stays a link where nothing upgraded', async () => {
  await mount(Image.Zoomable);
  const here = location.href;

  const trigger = q('.sds-zoom');
  expect(trigger.getAttribute('href')).toMatch(/answer-sources\.svg$/);

  const dialog = q<HTMLDialogElement>('dialog.sds-lightbox');
  expect(shown(dialog)).toBe(false);

  await userEvent.click(trigger);
  await expect.element(dialog).toBeVisible();
  expect(location.href).toBe(here);
  expect(q('img.sds-art', dialog).getAttribute('src')).toMatch(/answer-sources\.svg$/);
  expect(dialog.getAttribute('aria-label')).toMatch(/five sources/);

  await userEvent.keyboard('{Escape}');
  await expect.element(dialog).not.toBeVisible();
});

/* A table takes the rows as markup. A cell carries a link or a literal,
   `colspan` is on the cell, and a caption has no property at all. What the
   table *is* stays the element's, so the two forms cannot draw two different
   tables.

   Handed over as `content` rather than between the tags, and that is the form
   and not a shortcut. The parser drops a `<thead>` outside a `<table>`, so
   these rows survive only inside a `<template>`. That is what the property
   carries and what the finish step leaves in the page. */
test('a table draws the rows it gets as markup', async () => {
  await mount(Table.FromContent);

  const tables = qa('sds-table > .sds-table-scroll > table.sds-table');
  expect(tables, 'the element draws the table, the document fills it').toHaveLength(1);
  const drawn = tables[0] as HTMLElement;
  expect(drawn.className).toMatch(/sds-table--medium/);

  /* The rows are inside that table and not stranded beside it, which is what a
     lost `connectedCallback` leaves behind. */
  expect([...drawn.children].map((c) => c.tagName.toLowerCase())).toEqual(['caption', 'thead', 'tbody']);
  expect(q('td code', drawn).textContent).toBe('typo3_rule_lookup');
  expect(q('td[colspan="2"] em', drawn).textContent).toBe('only');
});

/* And a plane holds whatever the passage was. The property form is a sentence
   somebody composed; a document's is paragraphs and a list, and only one of
   the two fits in an attribute. */
test('a surface holds the passage written between its tags', async () => {
  await mount(Surface.FromContent);

  const planes = qa('sds-surface > .sds-panel');
  expect(planes).toHaveLength(1);
  const plane = planes[0] as HTMLElement;
  expect(q('.sds-surface-title', plane).textContent?.trim()).toBe('What a topic is');

  const body = q('.sds-surface-body', plane);
  expect(qa('p', body)).toHaveLength(1);
  expect(qa('ul li', body)).toHaveLength(2);

  const stray = [...q('sds-surface').children].filter((c) => !c.classList.contains('sds-panel')).length;
  expect(stray, 'the element must hold nothing but the plane it renders').toBe(0);
});

/* And a quotation keeps the sentence it borrowed. A line composed for a
   product surface fits in a property. A passage lifted out of a page brings
   its links and its emphasis, which an attribute cannot carry. */
test('a quote keeps the sentence written between its tags', async () => {
  await mount(Quote.FromContent);

  const body = q('sds-quote .sds-quote__body');
  expect(q('em', body).textContent).toBe('Not saying it was a fallback');
  expect(q('a', body).getAttribute('href')).toBe('#');

  /* The attribution comes from the properties around that markup, so the
     two channels meet in one element rather than one displaces the other. */
  expect(qa('sds-quote .sds-quote__by .sds-byline')).toHaveLength(1);

  const stray = [...q('sds-quote').children].filter((c) => c.tagName.toLowerCase() !== 'figure').length;
  expect(stray, 'the element must hold nothing but the figure it renders').toBe(0);
});

/* And a plan reads its stops from the elements written between its tags.
   The state is the one thing a stop cannot say for itself. Where it stands
   against the one marked now is a reading of the whole order, nested stops
   included. The plan writes it onto each element, and each renders its own
   box from there. The blocks a stop holds stay its body, and the stops
   inside it become its list. */
test('a plan writes the state onto the stops written between its tags', async () => {
  await mount(Timeline.Blocks);

  const plan = q('sds-timeline');
  const lists = qa(':scope > .sds-timeline', plan);
  expect(lists).toHaveLength(1);
  const list = lists[0] as HTMLElement;

  /* The elements stand in the list, in the order written, each with the
     state the plan read off the order. */
  expect([...list.children].map((c) => `${c.tagName.toLowerCase()}:${c.getAttribute('state')}`))
    .toEqual(['sds-timeline-stop:now', 'sds-timeline-stop:ahead']);

  const sprint = qa(':scope > sds-timeline-stop', list)[1] as HTMLElement;
  /* Its blocks are its body, and nothing but the box it renders is in it. */
  expect(qa(':scope > .sds-timeline__stop > .sds-timeline__body > ul > li', sprint)).toHaveLength(2);
  const stray = [...sprint.children].filter((c) => !c.classList.contains('sds-timeline__stop')).length;
  expect(stray, 'the element must hold nothing but the box it renders').toBe(0);

  /* The stop inside it is in its list, with a state of its own. */
  const inside = qa(':scope > .sds-timeline__stop > .sds-timeline__list > sds-timeline-stop', sprint);
  expect(inside).toHaveLength(1);
  expect(inside[0]?.getAttribute('state')).toBe('ahead');
  expect(q('.sds-timeline__title', inside[0]).textContent?.trim()).toBe('The server keeps the last thirty reads');

  /* The one now says so twice: the mark out loud, and the word beside the
     title. */
  const now = q(':scope > sds-timeline-stop > .sds-timeline__stop', list);
  expect(now.getAttribute('aria-current')).toBe('step');
  expect(q('.sds-timeline__title .sds-label', now).textContent?.trim()).toBe('Now');

  /* A package marked now, read against the whole order. Its sprint is at
     now too, the package before it has passed, and the stop after the
     sprint lies ahead. */
  await mount(Timeline.InsideASprint);
  expect(qa('sds-timeline sds-timeline-stop').map((c) => `${c.getAttribute('when')}:${c.getAttribute('state')}`)).toEqual([
    '2026-09-15:passed',
    '2026-09-30:passed',
    'Sprint 1 · 2026-10-05 to 10-16:passed',
    'W1:passed',
    'Sprint 2 · 2026-10-19 to 10-30:now',
    'W2:passed',
    'W3:now',
    'W4:ahead',
    '2026-11-10:ahead',
  ]);
});
