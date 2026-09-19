/* The ring axe cannot ask about.

   A card hands its anchor's ring over: the whole card is the target, so the
   ring belongs round the frame. A frame with none gives a keyboard reader a
   card that changes colour and nothing that says which one they are on.
   Axe reports a focusable element, not an invisible focus, and the
   specimens draw the ring on an element that does not have focus. So the
   press happens here, in both walls. A tile turns the ring inwards, and
   that is the case where a wrong drawing is no drawing. */

import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import * as grid from '../stories/components/Grid.stories.ts';
import { mount, stories } from './lib/frame.ts';

const { Default, Flush } = stories(grid);

const RINGED = [
  ['an ordinary wall', Default, true],
  ['a flush wall', Flush, false],
] as const;

for (const [wall, story, halo] of RINGED) {
  test(`a card in ${wall} draws the ring when the keyboard reaches it`, async () => {
    await mount(story);

    /* Reached with Tab rather than focused. `:focus-visible` is the browser's
       answer about how focus arrived, and a card focused by script is a card
       a reader never gets. */
    for (let press = 0; press < 6; press++) {
      await userEvent.tab();
      if (document.activeElement?.closest('.sds-card__title')) break;
    }

    const frame = document.activeElement?.closest<HTMLElement>('.sds-card');
    expect(frame, 'the keyboard must reach a card title').not.toBeNull();
    const drawn = getComputedStyle(frame as HTMLElement);
    const emphasis = getComputedStyle(document.documentElement).getPropertyValue('--border-emphasis').trim();

    expect(drawn.outlineStyle, 'the frame draws the ring').toBe('solid');
    expect(drawn.outlineWidth, 'the ring is --border-emphasis wide').toBe(emphasis);
    /* The anchor gives its own up, or the card wears two rings. */
    expect(getComputedStyle(document.activeElement as HTMLElement).outlineStyle, 'and the words it moved off do not draw a second one').toBe('none');
    expect(drawn.boxShadow !== 'none', halo ? 'with its halo' : 'and a tile drops the halo it cannot show').toBe(halo);
    /* Outwards on a card, inwards on a tile: the wall clips its corners. */
    expect(Math.sign(parseFloat(drawn.outlineOffset)), `the ring stands ${halo ? 'off' : 'inside'} the box`).toBe(halo ? 1 : -1);
  });
}
