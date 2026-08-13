/* What a whole page is, twice.

   In Storybook a page has to be **live** — the tabs switch, the rail folds, the
   field takes typing — because a layout nobody can click through is where a
   broken control hides, and every story is opened by the test suite. In
   `screens/` it has to be **static**: the pane opens those files with no
   JavaScript, and `renderStatic` flattens no element given children.

   So a page is written once, as a function of how it is rendered, and branches
   only where the two genuinely differ: the components that take content. */

import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/grid.ts';
import { type GridVariant } from '../../packages/frontend/src/components/grid.ts';

/** Which of the two renderings is being asked for. */
export interface PageMode {
  /** True while composing the file under `screens/`. */
  flat?: boolean;
}

/* And what every page has regardless of which site it belongs to: the way
   past the bar, the rail and the breadcrumbs, which stand between the top of
   the page and the text of it. One target name here and in the guides theme,
   so a reader who has learned the press has learned it everywhere. */

/** The first tab stop, above the bar. `#main-content` is the page's `<main>`. */
export const skipLink = (): TemplateResult =>
  html`<a class="sds-skip sds-btn sds-btn--secondary" href="#main-content">Skip to content</a>`;

/** A set laid out side by side, in whichever form the rendering can hold. The
    branch is the one this file exists for: a static file has no
    `connectedCallback` to take authored children, so there the same set goes
    to the same element as a property. Here rather than in every page, because
    a wall of cards is what a page most often ends a section with. */
export const grid = (
  items: readonly TemplateResult[],
  { flat = false, variant = 'default' }: PageMode & { variant?: GridVariant } = {},
): TemplateResult =>
  flat
    ? html`<sds-grid variant="${variant}" .content="${items}"></sds-grid>`
    : html`<sds-grid variant="${variant}">${items}</sds-grid>`;
