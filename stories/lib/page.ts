/* What a whole page is, twice.

   In Storybook a page has to be **live** — the tabs switch, the rail folds, the
   field takes typing — because a layout nobody can click through is where a
   broken control hides, and every story is opened by the test suite. In
   `screens/` it has to be **static**: the pane opens those files with no
   JavaScript, and `renderStatic` flattens no element given children.

   So a page is written once, as a function of how it is rendered, and branches
   only where the two genuinely differ: the components that take content. */

import { html, type TemplateResult } from 'lit';

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
