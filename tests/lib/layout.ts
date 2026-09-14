/* What a page measures for, wherever it came from.

   A layout fails in silence three ways: too wide for the screen, two things
   in the same place, or a box smaller than its content. None of them raises
   an error. Each reads as a page that is merely a little off, so they get a
   measurement rather than a look. From the story layouts in `pages.spec.ts`
   and from the rendered documentation in `guides.spec.ts`, which is the same
   page in somebody else's hand. */

import type { Page } from '@playwright/test';

export async function pageOverflow(page: Page): Promise<{ scroll: number; client: number; worst: string } | null> {
  return page.evaluate(() => {
    const d = document.documentElement;
    if (d.scrollWidth <= d.clientWidth + 1) return null;
    /* Name the responsible box because an overflow width alone is not actionable. */
    const widest = [...document.body.querySelectorAll('*')]
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.width > 0 && r.right > d.clientWidth + 1)
      .sort((a, b) => b.r.right - a.r.right)[0];
    const e = widest?.el as HTMLElement | undefined;
    return {
      scroll: d.scrollWidth,
      client: d.clientWidth,
      worst: e ? `${e.tagName.toLowerCase()}.${String(e.className).trim().split(/\s+/).join('.')}` : 'unknown',
    };
  });
}

/* Nothing on a page can paint over anything else. Only boxes with their own
   line compare. An inline `<span>` in a wrapped paragraph has a rect as wide
   as the paragraph and overlaps every line above it. That is how text works.
   Anything out of flow stays out — an overlay is over the page on purpose. */
export async function pageOverlaps(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const inFlow = (el: Element): boolean => {
      for (let node: Element | null = el; node && node !== document.body; node = node.parentElement) {
        const position = getComputedStyle(node).position;
        if (position === 'absolute' || position === 'fixed') return false;
      }
      return true;
    };

    const blocks = [...document.body.querySelectorAll<HTMLElement>('*')].filter((el) => {
      if (!el.textContent?.trim()) return false;
      if (!el.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })) return false;
      if (!/^(block|flex|grid|list-item|table)/.test(getComputedStyle(el).display)) return false;
      if (!inFlow(el)) return false;
      /* Leaves only. A section and the heading inside it share their box
         by definition, and `contains` already covers that pair. This keeps
         the comparison to what paints. */
      return ![...el.children].some((child) => child.textContent?.trim());
    });

    const named = (el: Element): string =>
      `${el.tagName.toLowerCase()}.${String(el.className).trim().split(/\s+/).join('.')}` +
      `"${(el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 30)}"`;

    const out: string[] = [];
    for (let i = 0; i < blocks.length; i++) {
      for (let j = i + 1; j < blocks.length; j++) {
        const a = blocks[i] as HTMLElement;
        const b = blocks[j] as HTMLElement;
        if (a.contains(b) || b.contains(a)) continue;
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        const x = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
        const y = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
        if (x > 2 && y > 2) out.push(`${named(a)} over ${named(b)}`);
      }
    }
    return out.slice(0, 4);
  });
}

/* Something drawn outside the box that cuts it off, with no way to reach the
   rest. This is the failure a picture shows and the other two measurements
   cannot. The page draws, a block is simply cut — a code block that ends mid
   command, an answer with only its first line.

   Measured against the nearest ancestor that clips rather than against the
   element itself. The box with the wrong height is rarely the box that cuts.
   The height went onto a host that spills, and what took the rest away was
   the fold above it. A `<details>` counts as one of those. Its clip is on
   `::details-content`, which no selector reaches, and its own content box is
   where that clip lands. An ancestor that scrolls cuts nothing: what a reader
   can scroll to is in reach. */
export async function pageClipped(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    /* `className` is an object on an SVG, and a `<use>` deserves a name as
       much as anything else that goes astray. */
    const named = (el: Element): string => {
      const classes = (el.getAttribute('class') ?? '').trim();
      return `${el.tagName.toLowerCase()}${classes ? `.${classes.split(/\s+/).join('.')}` : ''}`;
    };

    const out: string[] = [];
    for (const el of document.body.querySelectorAll<HTMLElement>('*')) {
      /* Inside a drawing nothing has a layout. The viewBox places a shape and
         clips it on purpose, and a `<use>` reports its own drawn box rather
         than the one it shows in. */
      if (el.namespaceURI !== 'http://www.w3.org/1999/xhtml') continue;
      if (!el.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })) continue;
      const box = el.getBoundingClientRect();
      if (box.width < 1 || box.height < 1) continue;

      for (let up = el.parentElement; up && up !== document.body; up = up.parentElement) {
        const style = getComputedStyle(up);
        const fold = up.tagName === 'DETAILS';
        const hidesY = fold || /^(hidden|clip)$/.test(style.overflowY);
        const hidesX = fold || /^(hidden|clip)$/.test(style.overflowX);
        if (!hidesX && !hidesY && style.overflowX === 'visible' && style.overflowY === 'visible') continue;

        /* The nearest one decides, if it cuts or lets through — as long as
           it draws at all. A fold written `display: contents` is a marker the
           rail folds by and has no box. So it clips nothing and the box that
           does is further up. */
        const edge = up.getBoundingClientRect();
        if (edge.width < 1 && edge.height < 1) continue;
        const lost = Math.max(
          hidesY ? box.bottom - edge.bottom : 0,
          hidesY ? edge.top - box.top : 0,
          hidesX ? box.right - edge.right : 0,
          hidesX ? edge.left - box.left : 0,
        );
        if (lost > 1) out.push(`${named(el)} loses ${Math.round(lost)}px to ${named(up)}`);
        break;
      }
    }
    return out.slice(0, 6);
  });
}
