/* sds-deck — slides one after the other, and every one of them whole.

   A slide that cuts off what it holds is no summary. So the test measures
   every slide twice: where the page draws it, and on the stage. Then the two
   ways in. A deck of its own plays from its cover. A deck over the page
   opens at the slide whose press the reader used. Both hand every slide
   back to where it stood, and the page is as the reader left it. */

import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import * as deck from '../stories/components/Deck.stories.ts';
import * as concept from '../stories/pages/ConceptPage.stories.ts';
import type { SdsSlide } from '../packages/frontend/src/components/slide.ts';
import { frames, mount, q, qa, shown, sleep, stories, write } from './lib/frame.ts';

const { Embedded } = stories(deck);
const { WithSlides } = stories(concept);

/** How far what a slide holds stands over the bottom of its body. Zero or
    less is whole. */
const over = (slide: Element): number => {
  const body = slide.querySelector('.sds-slide__body');
  const fit = slide.querySelector('.sds-slide__fit');
  if (!body || !fit) return 0;
  return fit.getBoundingClientRect().bottom - body.getBoundingClientRect().bottom;
};

/* A picture loads after the render, and a slide fits itself again when it
   has. So the measurement waits for both. */
const rest = async (): Promise<void> => {
  await sleep(200);
  await frames();
};

const count = (): string => q('.sds-deck__count').textContent?.trim() ?? '';
const staged = (): SdsSlide => q<SdsSlide>('.sds-deck__stage sds-slide');

async function walk(total: number): Promise<void> {
  for (let i = 0; i < total; i += 1) {
    await rest();
    expect(count()).toBe(`${i + 1} / ${total}`);
    expect(over(staged()), `slide ${i + 1} on the stage`).toBeLessThanOrEqual(0.5);
    await userEvent.keyboard('{ArrowRight}');
  }
}

test('a deck of its own shows its cover and the press, and nothing else', async () => {
  await mount(Embedded);
  const slides = qa<SdsSlide>('sds-deck sds-slide');
  expect(slides.length).toBeGreaterThan(1);
  expect(slides.filter(shown)).toHaveLength(1);
  expect(q('.sds-deck__play').textContent).toContain(`${slides.length} slides`);
});

test('the press plays the deck from the cover, and every slide fits the stage', async () => {
  await mount(Embedded);
  const total = qa('sds-deck sds-slide').length;
  q('.sds-deck__play').click();
  await rest();
  expect(q<HTMLDialogElement>('dialog.sds-deck').open).toBe(true);
  await walk(total);
  expect(count()).toBe(`${total} / ${total}`);
});

test('Escape puts every slide back and leaves no hold behind', async () => {
  await mount(Embedded);
  const total = qa('sds-deck sds-slide').length;
  q('.sds-deck__play').click();
  await rest();
  await userEvent.keyboard('{End}');
  await userEvent.keyboard('{Escape}');
  await rest();
  expect(q<HTMLDialogElement>('dialog.sds-deck').open).toBe(false);
  expect(qa('.sds-deck__hold')).toHaveLength(0);
  expect(qa('.sds-deck__cover sds-slide, .sds-deck__rest sds-slide')).toHaveLength(total);
});

test('every slide of the page fits where the page draws it', async () => {
  await mount(WithSlides);
  await rest();
  const slides = qa<SdsSlide>('main sds-slide');
  expect(slides.length).toBeGreaterThan(1);
  for (const [i, slide] of slides.entries()) expect(over(slide), `slide ${i + 1} on the page`).toBeLessThanOrEqual(0.5);
});

test('the deck over the page runs through every slide, and each fits', async () => {
  await mount(WithSlides);
  const total = qa('main sds-slide').length;
  q('sds-button[for="concept-deck"]').click();
  await rest();
  await walk(total);
});

test('a slide’s press opens the deck at that slide', async () => {
  await mount(WithSlides);
  const slides = qa<SdsSlide>('main sds-slide');
  const third = slides[2] as SdsSlide;
  third.querySelector<HTMLElement>('.sds-slide__zoom')?.click();
  await rest();
  expect(count()).toBe(`3 / ${slides.length}`);
  expect(staged()).toBe(third);
  expect(staged().querySelector('.sds-slide__zoom'), 'no press on the stage').toBeNull();
});

test('the list shows every slide and goes to the one pressed', async () => {
  await mount(WithSlides);
  const total = qa('main sds-slide').length;
  q('sds-button[for="concept-deck"]').click();
  await rest();
  q('button[title="Show all slides"]').click();
  await rest();
  const entries = qa('.sds-deck__entry');
  expect(entries).toHaveLength(total);
  expect(qa('.sds-deck__thumb > .sds-slide')).toHaveLength(total);
  (entries[4] as HTMLElement).click();
  await rest();
  expect(count()).toBe(`5 / ${total}`);
  expect(q('.sds-deck__entry.is-active')).toBe(entries[4]);
});

test('what the deck says once, every slide carries, and its own value wins', async () => {
  await mount(WithSlides);
  const slides = qa<SdsSlide>('main sds-slide');
  const theDeck = q('sds-deck');
  for (const slide of slides) expect(slide.getAttribute('brand')).toBe(theDeck.getAttribute('brand'));
  /* The cover carries no count; the next one counts from where it stands. */
  expect((slides[0] as SdsSlide).getAttribute('number')).toBeNull();
  expect((slides[1] as SdsSlide).getAttribute('number')).toBe('02');
});

test('a slide that says its own value keeps it', async () => {
  await write(`<sds-deck brand="The deck" product="Its product">
    <sds-slide kind="cover" heading="One"></sds-slide>
    <sds-slide heading="Two" brand="The slide"></sds-slide>
    <sds-slide heading="Three"></sds-slide>
  </sds-deck>`);
  const [one, two, three] = qa<SdsSlide>('sds-slide');
  expect(one?.getAttribute('brand')).toBe('The deck');
  expect(two?.getAttribute('brand')).toBe('The slide');
  expect(three?.getAttribute('brand')).toBe('The deck');
  expect(two?.getAttribute('product')).toBe('Its product');
});

/** Press a button that prints, and say what the page held while it did. The
    browser's own print opens a dialog a test cannot close, so a stand-in
    takes its place and reads the page at that moment. */
async function printed(press: () => void): Promise<{ sheet: number; marked: boolean }> {
  const print = window.print;
  let seen = { sheet: -1, marked: false };
  window.print = () => {
    seen = {
      sheet: qa('body > .sds-deck__print > sds-slide').length,
      marked: document.documentElement.hasAttribute('data-sds-deck-print'),
    };
  };
  try {
    press();
    await rest();
  } finally {
    window.print = print;
  }
  return seen;
}

test('a print lays every slide on a sheet of its own and puts each back after', async () => {
  /* A fixture `write` left in the body is a second deck with a press of its own. */
  document.body.replaceChildren();
  await mount(Embedded);
  const total = qa('sds-deck sds-slide').length;
  const seen = await printed(() => q('.sds-deck__presses button[title="Save as PDF"]').click());
  expect(seen).toEqual({ sheet: total, marked: true });
  expect(qa('.sds-deck__print')).toHaveLength(0);
  expect(qa('.sds-deck__hold')).toHaveLength(0);
  expect(document.documentElement.hasAttribute('data-sds-deck-print')).toBe(false);
  expect(qa('.sds-deck__cover > sds-slide')).toHaveLength(1);
  expect(qa('.sds-deck__rest > sds-slide')).toHaveLength(total - 1);
});

test('a print from the open deck keeps the cover, and the deck opens again where it was', async () => {
  document.body.replaceChildren();
  await mount(Embedded);
  const total = qa('sds-deck sds-slide').length;
  q('.sds-deck__play').click();
  await rest();
  const seen = await printed(() => q('dialog.sds-deck button[title="Save as PDF"]').click());
  expect(seen).toEqual({ sheet: total, marked: true });
  await rest();
  expect(qa('.sds-deck__print')).toHaveLength(0);
  /* The deck is open again at the cover: one loan, so one hold. */
  expect(count()).toBe(`1 / ${total}`);
  expect(qa('.sds-deck__hold')).toHaveLength(1);
  await userEvent.keyboard('{Escape}');
  await rest();
  expect(qa('.sds-deck__hold')).toHaveLength(0);
  expect(qa('.sds-deck__cover > sds-slide')).toHaveLength(1);
  expect(shown(q('.sds-deck__cover > sds-slide'))).toBe(true);
  expect(qa('.sds-deck__rest > sds-slide')).toHaveLength(total - 1);
  expect(qa('.sds-deck__stage sds-slide')).toHaveLength(0);
});

test('a print from the deck over the page puts the slide it showed back in its section', async () => {
  document.body.replaceChildren();
  await mount(WithSlides);
  const slides = qa<SdsSlide>('main sds-slide');
  const third = slides[2] as SdsSlide;
  const section = third.closest('section');
  third.querySelector<HTMLElement>('.sds-slide__zoom')?.click();
  await rest();
  const seen = await printed(() => q('dialog.sds-deck button[title="Save as PDF"]').click());
  expect(seen).toEqual({ sheet: slides.length, marked: true });
  await rest();
  await userEvent.keyboard('{Escape}');
  await rest();
  expect(third.closest('section')).toBe(section);
  expect(qa('main sds-slide')).toHaveLength(slides.length);
  expect(qa('.sds-deck__hold')).toHaveLength(0);
});

/** A drag across the stage from `from` to `to`, as a pointer sends it. */
function drag(from: number, to: number): void {
  const stage = q('.sds-deck__stage');
  const y = stage.getBoundingClientRect().top + 200;
  const send = (type: string, x: number): void => {
    stage.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 7, button: 0, clientX: x, clientY: y }));
  };
  send('pointerdown', from);
  for (let i = 1; i <= 10; i += 1) send('pointermove', from + ((to - from) * i) / 10);
  send('pointerup', to);
}

test('a drag past a part of the stage turns the slide, and a short one does not', async () => {
  document.body.replaceChildren();
  await mount(Embedded);
  const total = qa('sds-deck sds-slide').length;
  q('.sds-deck__play').click();
  await rest();
  const width = q('.sds-deck__stage').getBoundingClientRect().width;
  drag(width * 0.8, width * 0.2);
  await rest();
  expect(count()).toBe(`2 / ${total}`);
  drag(width * 0.8, width * 0.78);
  await rest();
  expect(count(), 'a short drag goes back').toBe(`2 / ${total}`);
  drag(width * 0.2, width * 0.8);
  await rest();
  expect(count()).toBe(`1 / ${total}`);
  drag(width * 0.2, width * 0.8);
  await rest();
  expect(count(), 'nothing before the first').toBe(`1 / ${total}`);
  expect(q('.sds-deck__stage').style.getPropertyValue('--sds-deck-drag'), 'the slide rests').toBe('');
});

test('F asks for the full screen for the box the dialog holds, never the dialog', async () => {
  document.body.replaceChildren();
  await mount(Embedded);
  q('.sds-deck__play').click();
  await rest();
  const asked: Element[] = [];
  const request = HTMLElement.prototype.requestFullscreen;
  HTMLElement.prototype.requestFullscreen = function (this: HTMLElement) {
    asked.push(this);
    return Promise.resolve();
  };
  try {
    await userEvent.keyboard('f');
  } finally {
    HTMLElement.prototype.requestFullscreen = request;
  }
  expect(asked).toHaveLength(1);
  expect(asked[0]).toBe(q('.sds-deck__screen'));
});

test('a turn pushes the slide out as a picture, and leaves nothing behind', async () => {
  document.body.replaceChildren();
  await mount(Embedded);
  q('.sds-deck__play').click();
  await rest();
  await userEvent.keyboard('{ArrowRight}');
  expect(qa('.sds-deck__ghost'), 'the slide that leaves').toHaveLength(1);
  expect(qa('.sds-deck__ghost sds-slide'), 'a picture, not a second slide').toHaveLength(0);
  await sleep(1100);
  expect(qa('.sds-deck__ghost')).toHaveLength(0);
  expect(qa('.sds-deck__stage sds-slide')).toHaveLength(1);
});

test('nothing on a slide takes the keyboard or a press', async () => {
  document.body.replaceChildren();
  await mount(WithSlides);
  await rest();
  const fits = qa('main sds-slide .sds-slide__fit');
  expect(fits.length).toBeGreaterThan(1);
  for (const fit of fits) {
    expect(getComputedStyle(fit).pointerEvents).toBe('none');
    expect(qa('*', fit).filter((el) => el.tabIndex >= 0), 'no stop for the keyboard').toHaveLength(0);
  }
});

test('a press anywhere on a slide opens the deck at it', async () => {
  document.body.replaceChildren();
  await mount(WithSlides);
  const slides = qa<SdsSlide>('main sds-slide');
  (slides[3]?.querySelector(':scope > .sds-slide') as HTMLElement).click();
  await rest();
  expect(count()).toBe(`4 / ${slides.length}`);
});
