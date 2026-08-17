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
    const gap = parseFloat(getComputedStyle(panel).getPropertyValue(gapFrom)) || 0;
    panel.style.positionArea = 'none';
    panel.style.insetBlockStart = `${at.bottom + gap}px`;
    if (side === 'end') {
      panel.style.insetInlineStart = 'auto';
      panel.style.insetInlineEnd = `${document.documentElement.clientWidth - at.right}px`;
    } else {
      panel.style.insetInlineEnd = 'auto';
      panel.style.insetInlineStart = `${at.left}px`;
    }
  };

  const stop = new AbortController();
  const { signal } = stop;
  put();
  addEventListener('scroll', put, { capture: true, passive: true, signal });
  addEventListener('resize', put, { passive: true, signal });
  return () => stop.abort();
}
