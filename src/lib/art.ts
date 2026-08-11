/* The one image a figure, a viewer or a teaser shows.

   One file, in both modes. There is no light copy and no dark copy: a drawing
   is written in the tokens and takes the mode of wherever it is placed, and a
   photograph is a photograph in either. A pair of files could not be that —
   it had to be told which mode it was in, so every surface that showed one
   carried the switch, and a drawing shown in a card with a mode forced on it
   was showing whichever file the page had guessed.

   Which means a drawing cannot be linked. An `<img>` renders its file in a
   document of its own, where `--text-primary` is not declared and the fill
   falls back to the light hex — the same reason `sds-icon` is a `<use>` and
   not an image. So a drawing is referenced into this document instead: the
   shapes carry `fill="var(--token, #light)"`, inherited properties cross into
   the shadow tree `<use>` builds, and the drawing arrives in the mode of the
   thing it sits in. The hex fallback is not dead weight — it is what the file
   renders as on its own, in a README or a tab, where there are no tokens.

   What `<use>` will not carry across is the size, so the wrapper states the
   viewBox — and the file name is what says which one. `scripts/diagrams.ts`
   reads the coordinate systems out of `assets/diagrams/` and nothing else
   supplies them: a caller cannot name one, because a caller naming a number
   that is already in the file is a number that can be wrong.

   Everything the manifest does not name is linked. That is not a fallback for
   a drawing that got missed — it is the right answer for everything else in a
   frame: a photograph, an illustration, a screenshot, a signet. None of them
   has a mode, and being an SVG does not make a file a drawing in these
   tokens. */

import { html, type TemplateResult } from 'lit';
import { DIAGRAM_VIEWBOX } from '../components/diagrams.generated.ts';

/** The group every drawing wraps itself in — see `scripts/diagrams.ts`. */
const GROUP = 'art';

/**
 * The picture, as whatever it has to be to arrive in the right mode.
 *
 * @param cls the class the surface hangs its own sizing on, `sds-art` alone
 *            unless a surface needs more.
 */
export function art(src: string, alt: string, cls = 'sds-art'): TemplateResult {
  const viewBox = DIAGRAM_VIEWBOX[src.split('/').pop()?.replace(/\.svg$/, '') ?? ''];
  /* `aria-label` on the wrapper rather than the `<title>` inside the file:
     only one of the two would be read, and the one the author wrote beside
     the figure is the one that describes why it is there. */
  return viewBox
    ? html`<svg class="${cls}" viewBox="${viewBox}" role="img" aria-label="${alt}"><use href="${src}#${GROUP}"></use></svg>`
    : html`<img class="${cls}" src="${src}" alt="${alt}" />`;
}
