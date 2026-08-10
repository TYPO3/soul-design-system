/* What every story renders inside.

   A story links exactly what a consuming surface links — `styles.css`, and
   nothing else from the system. `_specimen.css` comes along too, but only
   because the specimen stories draw their captions with it; it is outside
   the `styles.css` closure on purpose, so a design built with this system
   never inherits it. If a story needs `.spec-*` to look right it is a
   specimen; if a product surface does, something is wrong. */

import type { Preview } from '@storybook/web-components-vite';
import '../src/styles/styles.css';
import '../src/styles/_specimen.css';
import './docs.css';
import { addons } from 'storybook/preview-api';

/* One import: the entry registers every element and installs the host rule.
   Listing them here was a second list to keep in step with `src/index.ts`,
   and it fell out of step the moment navigation was split into three. */
import '../src/index.ts';
import { setIconSprite } from '../src/components/icon.ts';

/* The icons reference a sprite embedded once per document, and by default it
   is resolved beside the module — right for the drop-in, wrong here, where
   Vite serves the module from `src/` and the assets from `/assets`. */
setIconSprite('/assets/icons/sprites/actions.svg');


/* Write the theme onto <html> for the whole preview, not only for stories.

   The decorator below does it per story, which is where a pinned specimen is
   honoured — but a guideline page is MDX with no stories in it, so no
   decorator ever runs and the toolbar looked dead on exactly the pages that
   are mostly embedded cards. Listening on the channel covers both, and it is
   not a hook, so it is legal outside a story. */
const applyTheme = (theme: string): void => {
  document.documentElement.dataset['theme'] = theme;
};

applyTheme('dark');
addons.getChannel().on('globalsUpdated', ({ globals }: { globals: Record<string, unknown> }) => {
  applyTheme((globals['theme'] as string) ?? 'dark');
});

/* Both themes ship in one declaration — every colour is `light-dark()`
   against `color-scheme: light dark` — so this toggle sets `data-theme` and
   nothing else. It goes on `<html>`, because deeper the browser's own
   scrollbars and form controls stay in the other mode. */
export const globalTypes = {
  theme: {
    description: 'Colour scheme',
    toolbar: {
      title: 'Theme',
      icon: 'contrast',
      items: [
        { value: 'dark', title: 'Dark' },
        { value: 'light', title: 'Light' },
      ],
      dynamicTitle: true,
    },
  },
};

/* `a11y.manual` is a GLOBAL, not a parameter.

   It was set under `parameters.a11y` for a long time, where the addon simply
   does not read it — `@storybook/addon-a11y` declares
   `initialGlobals: { a11y: { manual } }` in its own preview entry. So the
   panel went on running axe automatically on every story render, and every
   run raced the axe the Playwright suite starts deliberately: axe is one
   global with one run at a time, and the loser gets a thrown "Axe is already
   running" rather than a queue.

   That surfaced as a11y tests passing alone and failing in a full run. The
   addon is not the problem and is not removed — a test build assembled
   differently from the shipped one proves nothing. This is the addon's own
   supported setting for "run when asked, not on load", and the panel still
   runs on demand. */
export const initialGlobals = { theme: 'dark', a11y: { manual: true } };


const preview: Preview = {
  decorators: [
    (story, context) => {
      /* A specimen that exists to show one mode must not be flipped by the
         toolbar — `colors-surfaces` proves light and dark side by side, and
         a card that pins its own theme means it. */
      const pinned = context.parameters['pinTheme'] as string | undefined;
      document.documentElement.dataset['theme'] = pinned ?? (context.globals['theme'] as string);
      return story();
    },
  ],
  parameters: {
    layout: 'padded',
    // The system paints its own canvas through `--surface-canvas`; a second
    // background picker underneath it could only ever be wrong.
    backgrounds: { disable: true },
    controls: { expanded: true, sort: 'requiredFirst' },
    options: {
      storySort: {
        order: ['Introduction', 'Guidelines', ['Brand', 'Colours', 'Type', 'Spacing & layout', 'Icons', 'States', 'Diagrams'], 'Components', 'Screens'],
      },
    },
    docs: { codePanel: true },
    a11y: {
      // Report, do not fail. The specimens deliberately include states no
      // automated pass can judge — a disabled control, a focus ring drawn on
      // an element that does not have focus.
      test: 'todo',
    },
  },
};

export default preview;
