/* What every story renders inside.

   A story links exactly what a consuming surface links — `styles.css`, and
   nothing else from the system. `_specimen.css` comes along too, but only
   because the specimen stories draw their captions with it. It is outside
   the `styles.css` closure on purpose, so a design built with this system
   never inherits it. If a story needs `.spec-*` to look right it is a
   specimen; if a product surface does, something is wrong. */

/// <reference types="vite/client" />
import type { Preview } from '@storybook/web-components-vite';
import '../packages/frontend/src/styles/styles.css';
import '../packages/frontend/src/styles/_specimen.css';
import './docs.css';
import './stage.css';
import { html } from 'lit';
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

export const initialGlobals = { theme: 'dark' };

/* Axe, on the part it can judge with honesty. Only a serious or critical
   violation fails a story. The specimens show states on purpose that no
   automated pass can interpret, and a failure on `minor` trains everyone to
   ignore the run. The addon has no such line, so under Vitest the verdict is
   this file's and the addon's run is off. In the panel it reports and fails none. */
const TESTING = import.meta.env.MODE === 'test';
const SPECIMEN_CHROME = ['.spec-cap', '.spec-note', '.spec-lbl', '.spec-h'];

async function judged(): Promise<string[]> {
  const axe = (await import('axe-core')).default;
  const result = await axe.run(
    /* `.spec-cap` and friends are the specimen's own annotation layer,
       styled by `_specimen.css`, which never ships to a product. */
    { include: document.body, exclude: ['.sb-wrapper', ...SPECIMEN_CHROME] },
    /* No landmarks in a fragment, which is what a story is. */
    { rules: { region: { enabled: false } } },
  );
  return result.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id} — ${v.help} (${v.nodes.length} node(s): ${v.nodes[0]?.target.join(' ')})\n    ${v.nodes[0]?.failureSummary?.split('\n').join('\n    ')}`);
}

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
      /* A slide gets a stage in the story view. In the docs view the preview
         block is the frame already — see `docs.css`. */
      const staged = context.viewMode === 'story' && (context.title.startsWith('Slides/') || context.title === 'Components/Content/Slide');
      return staged ? html`<div class="sb-stage">${story()}</div>` : story();
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
      /* The slides read in the order a deck runs, cover to closing: a
         reader who opens the group walks through a deck. */
      storySort: {
        method: 'alphabetical',
        order: ['Introduction', 'Guidelines', ['Brand', 'Colours', 'Type', 'Spacing & layout', 'Icons', 'States', 'Illustrations', 'Diagrams'], 'Components', ['Actions', 'Forms', 'Navigation', 'Content', 'Code', 'Overlays', 'Feedback', 'Theme'], 'Pages', ['Site', 'Docs', 'Catalog', 'Service', 'Paper'], 'Slides', ['Cover', 'Speaker', 'Speakers', 'Section', 'Statement', 'Cards', 'Flow', 'Code', 'Table', 'Numbers', 'Quote', 'Closing']],
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
      test: 'todo',
      disable: TESTING,
      context: { exclude: SPECIMEN_CHROME },
    },
  },
  afterEach: async ({ title, name, canvasElement, globals, parameters }) => {
    /* An empty root is a story that "rendered" nothing. Storybook reports
       no error for it, and it looks like a deliberate blank specimen. */
    if (!canvasElement.innerHTML.trim()) throw new Error(`${title}/${name} rendered nothing`);
    /* A Specimen is what a card is a picture of, and a card opens without
       JavaScript. So the subject draws from the system's classes or tokens,
       and no custom element can survive in it. */
    if (name === 'Specimen') {
      const drawn = [...canvasElement.querySelectorAll('[class]')].some((el) => [...el.classList].some((c) => c.startsWith('sds-')));
      if (!drawn && !canvasElement.innerHTML.includes('var(--')) throw new Error(`${title} must draw from the system — its classes, or its tokens`);
      const live = [...canvasElement.querySelectorAll('*')].map((el) => el.tagName.toLowerCase()).filter((tag) => tag.startsWith('sds-'));
      if (live.length) throw new Error(`${title} specimen must be static markup, and holds ${live.join(', ')}`);
    }
    /* The addon's own word for "no automatic run". A test that mounts a
       story as its fixture says it: the story run has judged it already. */
    if (!TESTING || (globals['a11y'] as { manual?: boolean } | undefined)?.manual === true) return;
    /* Both themes, from one render: the switch sets `data-theme` on `<html>`
       and nothing else, so the story need not mount twice. A specimen that
       pins its mode stays in it. */
    const pinned = parameters['pinTheme'] as string | undefined;
    const root = document.documentElement;
    const was = root.dataset['theme'];
    for (const theme of pinned ? [pinned] : ['dark', 'light']) {
      root.dataset['theme'] = theme;
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      const serious = await judged();
      if (serious.length) throw new Error(`serious axe violations on ${title}/${name} in ${theme}:\n  ${serious.join('\n  ')}`);
    }
    if (was) root.dataset['theme'] = was;
  },
};

export default preview;
