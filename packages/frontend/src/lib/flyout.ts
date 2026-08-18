/* Where a popover sits, for the engines that will not say.

   A panel in the top layer is positioned against the viewport and knows
   nothing about the control it came out of. Anchor positioning is how a
   stylesheet says it, and where the engine has it the stylesheet is the whole
   of the placement — this runs only where it has not, measuring the control
   and writing the edges.

   Never both: `position-area` derives a containing block from the anchor, so
   an edge measured against the viewport dropped into it lands offset by
   whatever the anchor was inset by. Taking the area away is the first thing
   `place` does. */

/** Whether the engine places a popover against its anchor on its own. Asked of
    the engine rather than of a version, and read at every open: a page can be
    moved between windows and a test may answer differently on purpose. */
export const anchored = (): boolean =>
  typeof CSS !== 'undefined' && CSS.supports?.('anchor-name', '--a') === true;

/** Which edge of the anchor the panel lines up with. */
export type Side = 'start' | 'end';

/** Put `panel` under `anchor` and keep it there. Returns what stops it: the
    page moves under a panel that is out of flow, and a listener left behind
    goes on measuring a control that has been taken off the page.

    Scroll is taken in the capture phase, because what scrolls is as often a
    box on the page as the page itself, and `scroll` does not bubble from one. */
export function place(panel: HTMLElement, anchor: HTMLElement, side: Side, gapFrom: string): () => void {
  const put = (): void => {
    const at = anchor.getBoundingClientRect();
    const room = document.documentElement.clientWidth;
    const gap = parseFloat(getComputedStyle(panel).getPropertyValue(gapFrom)) || 0;
    panel.style.positionArea = 'none';
    panel.style.insetBlockStart = `${at.bottom + gap}px`;
    /* How wide it wants to be, asked with the whole viewport in front of it: a
       panel left standing where it was last put is narrowed by the room that
       was there, and a width read off that places the next one short. */
    panel.style.insetInlineEnd = 'auto';
    panel.style.insetInlineStart = '0px';
    const wide = panel.getBoundingClientRect().width;
    /* The edge it was asked for, and the anchor's other one where that would
       leave the viewport — which is what `position-try-fallbacks: flip-inline`
       does on the route the stylesheet places. A panel that fits on neither
       side is a panel wider than the room there is, and stays where it was. */
    const asked = side === 'end' ? at.right - wide : at.left;
    const other = side === 'end' ? at.left : at.right - wide;
    const fits = (x: number): boolean => x >= 0 && x + wide <= room;
    panel.style.insetInlineStart = `${!fits(asked) && fits(other) ? other : asked}px`;
  };

  const stop = new AbortController();
  const { signal } = stop;
  put();
  addEventListener('scroll', put, { capture: true, passive: true, signal });
  addEventListener('resize', put, { passive: true, signal });
  return () => stop.abort();
}
