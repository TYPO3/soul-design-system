/* The sidebar's own title.

   Without this the documentation surface of a design system is called
   "Storybook" — the name of the tool, not of the thing being documented.
   Everything else in the sidebar is this system's; the heading above it
   should be too.

   Only the title is set. The manager chrome deliberately keeps Storybook's
   own theme rather than borrowing this system's tokens: the frame around a
   specimen has to be visibly not-the-specimen, or a reader cannot tell
   which surface a colour belongs to. That is the same reason
   `.storybook/docs.css` only retakes the preview area. */

import { addons } from 'storybook/manager-api';

addons.setConfig({
  sidebar: { showRoots: true },
  theme: {
    base: 'dark',
    brandTitle: 'Soul Design System',
    brandTarget: '_self',
  },
});
