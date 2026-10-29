/* The room a figure slide lends its drawing, worked out without a browser.

   A built page holds each drawing already drawn for its slide's room, and
   `scripts/lib/slide-room.ts` works that room out from the slide's markup.
   Its sizes copy `slide.css`. So the stylesheet lays each slide out here,
   the slide lends its room, and the two rooms must be the same. */

import { expect, test } from 'vitest';
import { artOf, headOf, roomOf } from '../scripts/lib/slide-room.ts';
import { qa, sleep, write } from './lib/frame.ts';

const drawing = `<sds-diagram>flow
title "A part"
description "One part."

a "One"
  at 0,0
</sds-diagram>`;

const SHORT = 'One line of note.';
const LONG = ['A note that runs onto a second line of the head.', 'It names every part the drawing shows, and the reason for each.', 'It says what each part holds, and where the reader finds the rest.'].join(' ');

const SLIDES: Record<string, string> = {
  'wide, a short note': `<sds-slide kind="figure" heading="A figure" note="${SHORT}"><div slot="figure">${drawing}</div></sds-slide>`,
  'wide, a long note': `<sds-slide kind="figure" heading="A figure" note="${LONG}"><div slot="figure">${drawing}</div></sds-slide>`,
  'headed, a lead': `<sds-slide kind="figure" layout="headed" heading="A figure" lead="${SHORT}"><div slot="figure">${drawing}</div></sds-slide>`,
  'row of three, under words': `<sds-slide kind="figure" layout="row" heading="A row" note="${SHORT}">
    <figure slot="figure" data-label="One">${drawing}</figure>
    <figure slot="figure" data-label="Two">${drawing}</figure>
    <figure slot="figure" data-label="Three">${drawing}</figure>
  </sds-slide>`,
};

for (const [name, markup] of Object.entries(SLIDES)) {
  test(`the room a ${name} slide lends is the one the build works out`, async () => {
    await write(`<div style="inline-size: 900px">${markup}</div>`);
    await sleep(400);
    const slide = document.querySelector('sds-slide');
    const head = headOf(slide?.innerHTML ?? '');
    expect(head, 'a figure slide').toBeDefined();
    const art = head && artOf(head);
    expect(art, 'a room the build knows').toBeDefined();
    const lent = qa('.sds-slide__art sds-diagram').map((one) => one.getAttribute('lent'));
    expect(lent.length).toBeGreaterThan(0);
    /* A room a pixel or two off is the same room. The browser rounds the
       box to its pixels, and `lend` takes the same view. */
    const [w = 0, h = 0] = (art ? roomOf(art) : '').split(',').map(Number);
    for (const one of lent) {
      const [lw = 0, lh = 0] = (one ?? '').split(',').map(Number);
      expect(Math.abs(lw - w) <= 2 && Math.abs(lh - h) <= 2, `${one} against ${w},${h}`).toBe(true);
    }
    document.body.replaceChildren();
  });
}
