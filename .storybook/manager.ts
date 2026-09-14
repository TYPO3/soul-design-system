/* The sidebar's own title, so the documentation surface of a design system
   does not carry the name of the tool that renders it.

   `theme` must be a COMPLETE theme, from `create()`. A partial object looks
   like it must work and does not. `ensure()` calls `opacify` on colours it
   never set and polished throws, which kills the manager bundle and renders an
   empty page rather than an error.

   Only the title changes. The chrome keeps Storybook's own theme, because the
   frame around a specimen has to be visibly not-the-specimen. */

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
