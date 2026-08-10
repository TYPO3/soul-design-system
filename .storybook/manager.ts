/* The sidebar's own title.

   Without this the documentation surface of a design system is called
   "Storybook" — the name of the tool, not of the thing being documented.
   Everything else in the sidebar is this system's; the heading above it
   should be too.

   `theme` must be a COMPLETE theme, built by `create()`. A partial object
   looks like it should work and does not: Storybook runs it through
   `ensure()`, which calls `opacify` on colours the partial never set, and
   polished throws `PolishedError #3` on the undefined. That kills the whole
   manager bundle — the shell renders nothing at all, an empty page rather
   than an error. Passing a bare `{ base, brandTitle }` here is exactly how
   this file broke the UI once already.

   Only the title is set. The manager chrome deliberately keeps Storybook's
   own theme rather than borrowing this system's tokens: the frame around a
   specimen has to be visibly not-the-specimen, or a reader cannot tell which
   surface a colour belongs to. That is the same reason `.storybook/docs.css`
   only retakes the preview area. */

import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

addons.setConfig({
  sidebar: { showRoots: true },
  theme: create({
    base: 'dark',
    brandTitle: 'Soul Design System',
    brandTarget: '_self',
  }),
});
