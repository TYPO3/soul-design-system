/* What every story renders inside.

   A story links exactly what a consuming surface links — `styles.css`, and
   nothing else from the system. `_specimen.css` comes along too, but only
   because the specimen stories draw their captions with it. It is outside
   the `styles.css` closure on purpose, so a design built with this system
   never inherits it. If a story needs `.spec-*` to look right it is a
   specimen; if a product surface does, something is wrong. */

import type { Preview } from '@storybook/web-components-vite';
import '../packages/frontend/src/styles/styles.css';
import '../packages/frontend/src/styles/_specimen.css';
import './docs.css';
import { addons } from 'storybook/preview-api';
import { VIEWPORTS } from './viewports.ts';
import { readable } from './source.ts';

/* One import: the entry registers every element. A list here is a second
   list to keep in step with the package's `src/index.ts`, and it falls out
   of step at the next split. */
import '../packages/frontend/src/index.ts';
import { setIconSprites } from '../packages/frontend/src/components/icon.ts';

/* The icons reference a sprite embedded once per document, and by default it
   resolves beside the module. Right for the drop-in, wrong here, where Vite
   serves the module from the package and the assets beside the preview
   page. Relative, like every path a story writes: the built Storybook sits
   below the documentation, where `/assets` is somebody else's. */
setIconSprites('assets/icons/sprites/');


/* Write the theme onto <html> for the whole preview, not only for stories. The
   decorator below does it per story, which is where a pinned specimen gets
   its way. But a guideline page is MDX with no stories, so no decorator runs
   and the toolbar reads as dead. A listener on the channel covers both, and
   is not a hook, so it is legal outside a story. */
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

/* `a11y.manual` is a GLOBAL, not a parameter. Under `parameters.a11y` the addon
   does not read it and the panel runs axe on every story render. That races
   the axe the Playwright suite starts on purpose. Axe is one global with
   one run at a time, and the loser gets "Axe is already running" rather than
   a place in a queue. */
export const initialGlobals = { theme: 'dark', a11y: { manual: true } };


/* The container the renderer keeps between renders, dropped so the next one
   builds the story rather than updates it. An element takes what stands
   between its tags once and renders over it. So Lit's markers among those
   children have gone by the second render, which then throws instead of
   changes a label. The renderer makes a new one when it finds none. */
const dropCanvas = (canvas: HTMLElement | undefined): void => {
  canvas?.querySelector('#root-inner')?.remove();
};

const preview: Preview = {
  decorators: [
    (story, context) => {
      /* The toolbar must not flip a specimen that exists to show one mode.
         `colors-surfaces` proves light and dark side by side, and a card
         that pins its own theme means it. */
      const pinned = context.parameters['pinTheme'] as string | undefined;
      document.documentElement.dataset['theme'] = pinned ?? (context.globals['theme'] as string);
      dropCanvas(context.canvasElement);
      return story();
    },
  ],
  parameters: {
    layout: 'padded',
    // The system paints its own canvas through `--surface-canvas`; a second
    // background picker underneath it can only ever be wrong.
    backgrounds: { disable: true },
    controls: { expanded: true, sort: 'requiredFirst' },
    /* The toolbar is in the core; what it needs is a list to choose from — see
       `viewports.ts`. On offer everywhere rather than pinned to the pages. The
       queries live in the class layer, so a component in a bar sheds with it.
       A specimen is the smallest place to see that. No default, so a story
       fills the pane as the screenshot suite expects. */
    viewport: { options: VIEWPORTS },
    /* The sections read in the order somebody arrives in. The components
       inside them read alphabetically, because there is no order to arrive in.
       A reader looks one up, and the only sequence that helps is the one the
       alphabet already taught them. `method` applies wherever `order` has
       nothing more to say. */
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Introduction', 'Guidelines', ['Brand', 'Colours', 'Type', 'Spacing & layout', 'Icons', 'States', 'Illustrations', 'Diagrams'], 'Components', ['Actions', 'Forms', 'Navigation', 'Content', 'Code', 'Overlays', 'Feedback', 'Theme'], 'Screens'],
      },
    },
    /* The markup is the documentation. A canvas hides its source behind a
       toggle by default. That is one click between a reader and the one
       thing they came for — the exact element and attributes to copy. Shown,
       and laid out on the way there. What the renderer hands over is the
       story's own whitespace, which is none at all wherever a template sits
       on one line. See `source.ts`. */
    docs: {
      codePanel: true,
      canvas: { sourceState: 'shown' },
      source: { transform: readable },
    },
    a11y: {
      // Report, do not fail. The specimens deliberately include states no
      // automated pass can judge — a disabled control, a focus ring drawn on
      // an element that does not have focus.
      test: 'todo',
    },
  },
};

export default preview;
