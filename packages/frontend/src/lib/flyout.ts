/* Where a popover sits, for the engines that will not say.

   A panel in the top layer sits against the viewport and knows nothing about
   the control it came out of. Anchor positioning is how a stylesheet says it.
   Where the engine has it, the stylesheet is the whole of the placement. This
   runs only where it has not; it measures the control and writes the edges.

   Never both. `position-area` derives a containing block from the anchor, so
   an edge measured against the viewport lands offset by the anchor's inset.
   The first thing `place` does is take the area away. */

/** If the engine places a popover against its anchor on its own. Asked of the
    engine rather than of a version, and read at every open. A page can move
    between windows, and a test can answer differently on purpose. */
export const anchored = (): boolean =>
  typeof CSS !== 'undefined' && CSS.supports?.('anchor-name', '--a') === true;

/** Which edge of the anchor the panel lines up with. */
export type Side = 'start' | 'end';

/** Put `panel` under `anchor` and keep it there. Returns what stops it. The
    page moves under a panel that is out of flow. A listener left behind
    measures a control that is no longer on the page.

    Scroll comes in the capture phase. What scrolls is as often a box on the
    page as the page itself, and `scroll` does not bubble from one. */
export function place(panel: HTMLElement, anchor: HTMLElement, side: Side, gapFrom: string): () => void {
  const put = (): void => {
    const at = anchor.getBoundingClientRect();
    const room = document.documentElement.clientWidth;
    const gap = parseFloat(getComputedStyle(panel).getPropertyValue(gapFrom)) || 0;
    panel.style.positionArea = 'none';
    panel.style.insetBlockStart = `${at.bottom + gap}px`;
    /* How wide it wants to be, asked with the whole viewport in front of it.
       A panel left where it last stood narrows to the room that was there,
       and a width read off that places the next one short. */
    panel.style.insetInlineEnd = 'auto';
    panel.style.insetInlineStart = '0px';
    const wide = panel.getBoundingClientRect().width;
    /* The edge the caller asked for, and the anchor's other one where that
       leaves the viewport. That is what `position-try-fallbacks: flip-inline`
       does on the route the stylesheet places. A panel that fits on neither
       side is wider than the room there is, and stays where it was. */
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
