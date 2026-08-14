/* The press that opens a picture at the size it was made.

   Three parts that hold only together: the trigger is a real link to the file,
   so a surface running no script still opens it; the element takes the press
   over once it has upgraded; and the viewer is a sibling of the trigger rather
   than inside it — a `<dialog>` within the link would be opened by the press
   that follows the href. Written once because `sds-figure` and `sds-image`
   make the same promise, and a promise kept in two places is kept differently
   by the second change to touch it. */

import { html, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../components/lightbox.ts';
import { type SdsLightbox } from '../components/lightbox.ts';

export interface ZoomOptions {
  /** The file the trigger links to, and the viewer opens. */
  src: string;
  alt: string;
  /** What the drawing claims, carried into the viewer's head so opening it is
      not a change of subject. An image has none and falls back to its alt. */
  caption?: string;
  /** The picture is linked rather than referenced — passed on, so the picture
      at full size is the picture in the page. */
  linked?: boolean;
  /** And the box it was read with, for the same reason. */
  viewBox?: string;
}

/** The trigger and the viewer, for the element to place. Two parts and not one
    template: they are siblings in an image and a frame apart in a figure. */
export interface ZoomParts {
  trigger: TemplateResult;
  viewer: TemplateResult;
}

/* One handler per host rather than one per render: a binding whose function
   changes identity has Lit take the listener off the trigger and put it back
   on at every update, for a press that behaves the same either way. */
const openers = new WeakMap<Element, (event: Event) => void>();

function opener(host: Element): (event: Event) => void {
  const known = openers.get(host);
  if (known) return known;
  const open = (event: Event): void => {
    const viewer = host.querySelector('sds-lightbox') as SdsLightbox | null;
    /* Only where there is something to take the press over with: if the viewer
       has not upgraded, the browser follows the href and the reader still gets
       the picture. */
    if (!viewer?.show) return;
    event.preventDefault();
    viewer.show();
  };
  openers.set(host, open);
  return open;
}

/** Wrap `picture` in the press that opens it, and name the viewer that host
    owns. `host` is the element rendering both — the viewer is found under it. */
export function zoom(host: Element, picture: TemplateResult, options: ZoomOptions): ZoomParts {
  const { src, alt, caption, linked = false, viewBox } = options;
  return {
    trigger: html`<a class="sds-zoom" href="${src}" title="Open the picture at full size" @click="${opener(host)}">${picture}</a>`,
    viewer: html`<sds-lightbox src="${src}" alt="${alt}" ?linked="${linked}" view-box="${ifDefined(viewBox || undefined)}" caption="${ifDefined(caption || undefined)}"></sds-lightbox>`,
  };
}
