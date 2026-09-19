/* A page inside a test frame: markup written into it, or a story mounted
   on it, and every element upgraded before anything measures. A story
   needs the preview's own annotations — its decorator writes the theme onto
   `<html>`. And the preview needs a channel to listen on. A frame with no
   Storybook around it has to give it one. */

import { commands } from 'vitest/browser';
import './commands.d.ts';
import { addons, composeStories, mockChannel } from 'storybook/preview-api';
import { setProjectAnnotations, type WebComponentsRenderer } from '@storybook/web-components-vite';
import type { ComposedStoryFn, StoriesWithPartialProps, Store_CSFExports } from 'storybook/internal/types';

addons.setChannel(mockChannel());
const annotations = setProjectAnnotations(await import('../../.storybook/preview.ts'));

/** The stories of one file, composed with the preview. The core's
    `composeStories` types its answer as nothing; the renderers each wrap it,
    and this one does not. */
// biome-ignore lint/suspicious/noExplicitAny: the renderers' own wrappers take a file's args as any, so a typed meta fits
export function stories<T extends Store_CSFExports<WebComponentsRenderer, any>>(file: T): StoriesWithPartialProps<WebComponentsRenderer, T> {
  return composeStories(file, annotations) as StoriesWithPartialProps<WebComponentsRenderer, T>;
}

/** One element, or the sentence that names the one the page lacks. */
export function q<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T {
  const found = root.querySelector<T>(selector);
  if (!found) throw new Error(`nothing on the page matches ${selector}`);
  return found;
}

/** Every element, as an array. */
export function qa<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] {
  return [...root.querySelectorAll<T>(selector)];
}

/** Drawn: on the page, with a box, and hidden by nothing above it. What a
    reader sees, which is the question every assertion of visibility asks. */
export function shown(el: Element | null | undefined): boolean {
  if (!el || !el.isConnected) return false;
  if (!el.checkVisibility({ visibilityProperty: true, opacityProperty: true })) return false;
  const box = el.getBoundingClientRect();
  return box.width > 0 && box.height > 0;
}

export const box = (el: Element): DOMRect => el.getBoundingClientRect();

/** The clipboard is one for the whole browser, and the files run beside
    each other. A test that writes it or reads it holds this while it does. */
export async function clipboard<T>(work: () => Promise<T>): Promise<T> {
  await commands.takeClipboard();
  try {
    return await work();
  } finally {
    await commands.giveClipboard();
  }
}

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** Every element's own update, twice: a parent's render is what puts a nested
    element into the document at all. */
export async function settle(): Promise<void> {
  for (let pass = 0; pass < 2; pass++) {
    await Promise.all(
      [...document.querySelectorAll('*')]
        .filter((el) => el.tagName.includes('-'))
        .map(async (el) => {
          await customElements.whenDefined(el.tagName.toLowerCase());
          await (el as HTMLElement & { updateComplete?: Promise<unknown> }).updateComplete;
        }),
    );
  }
  await document.fonts.ready;
}

/** The body, as the markup says. What a prerendered page holds before a
    script runs, and then what the elements make of it. A `<script>` written
    into `innerHTML` never runs, so a fixture's own script is a function. */
export async function write(markup: string, { theme = 'dark', app = true, then }: { theme?: 'dark' | 'light'; app?: boolean; then?: () => void } = {}): Promise<void> {
  document.documentElement.dataset['theme'] = theme;
  document.body.className = app ? 'sds-app' : '';
  document.body.innerHTML = markup;
  then?.();
  await settle();
}

/** A story on a canvas of its own, the way the preview mounts one. The last
    canvas goes first: one story at a time is what a frame shows. The story
    run has judged it with axe already; here it is a fixture. */
export async function mount(story: ComposedStoryFn<WebComponentsRenderer>, theme?: 'dark' | 'light'): Promise<HTMLElement> {
  document.querySelector('#storybook-root')?.remove();
  document.body.className = '';
  const canvas = document.createElement('div');
  canvas.id = 'storybook-root';
  document.body.append(canvas);
  const globals = { ...story.globals, ...(theme ? { theme } : {}), a11y: { manual: true } };
  await story.run({ canvasElement: canvas, globals });
  await settle();
  return canvas;
}

/** Two frames, and then every element's own update: what a viewport change
    hands to whatever measures itself. */
export async function frames(): Promise<void> {
  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  await settle();
}
