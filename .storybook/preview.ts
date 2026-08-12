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
import { VIEWPORTS } from './viewports.ts';

/* One import: the entry registers every element and installs the host rule.
   Listing them here was a second list to keep in step with `src/index.ts`,
   and it fell out of step the moment navigation was split into three. */
import '../src/index.ts';
import { setIconSprite } from '../src/components/icon.ts';

/* The icons reference a sprite embedded once per document, and by default it
   is resolved beside the module — right for the drop-in, wrong here, where
   Vite serves the module from `src/` and the assets from `/assets`. */
setIconSprite('/assets/icons/sprites/actions.svg');


/* Write the theme onto <html> for the whole preview, not only for stories. The
   decorator below does it per story, which is where a pinned specimen is
   honoured — but a guideline page is MDX with no stories, so no decorator runs
   and the toolbar reads as dead. Listening on the channel covers both, and is
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

/* `a11y.manual` is a GLOBAL, not a parameter: under `parameters.a11y` the addon
   does not read it and the panel runs axe on every story render, racing the axe
   the Playwright suite starts deliberately — axe is one global with one run at a
   time, and the loser is thrown "Axe is already running" rather than queued. */
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
    /* The toolbar is in the core; what it needs is a list to choose from — see
       `viewports.ts`. Offered everywhere rather than pinned to the pages: the
       queries live in the class layer, so a component in a bar sheds with it,
       and a specimen is the smallest place to see that. No default, so a story
       fills the pane as the screenshot suite expects. */
    viewport: { options: VIEWPORTS },
    /* The sections read in the order somebody arrives in; the components
       inside them read alphabetically, because there is no order to arrive in
       — a reader is looking one up, and the only sequence that helps is the
       one the alphabet already taught them. `method` applies wherever `order`
       has nothing more to say. */
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Introduction', 'Guidelines', ['Brand', 'Colours', 'Type', 'Spacing & layout', 'Icons', 'States', 'Illustrations', 'Diagrams'], 'Components', 'Screens'],
      },
    },
    /* The markup is the documentation. A canvas defaults to hiding its source
       behind a toggle, which is one click between a reader and the one thing
       they came for — the exact element and attributes to copy. Shown. */
    docs: { codePanel: true, canvas: { sourceState: 'shown' } },
    a11y: {
      // Report, do not fail. The specimens deliberately include states no
      // automated pass can judge — a disabled control, a focus ring drawn on
      // an element that does not have focus.
      test: 'todo',
    },
  },
};

export default preview;
