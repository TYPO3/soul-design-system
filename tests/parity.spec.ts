/* The invariant the whole arrangement rests on.

   A component is written once and rendered two ways: by Lit when the element
   upgrades, and by `@lit-labs/ssr` when `make cards` writes the card. Nothing
   else checks that the two agree — let them disagree and the cards keep passing
   while the components ship different markup.

   Where a component takes its content between the tags the static side cannot,
   so those export the markup function the element renders and the case pairs
   the two. That pairing is the part most worth checking. */

import { test, expect, type Page } from '@playwright/test';
import { html, type TemplateResult } from 'lit';
import { renderStatic } from '../packages/frontend/src/lib/render.ts';
import { buttonLabel, buttonMarkup } from '../packages/frontend/src/components/button.ts';
import '../packages/frontend/src/index.ts';

/** Mount the markup in the page and read back the light DOM it produced. */
async function mount(page: Page, markup: string): Promise<string> {
  return page.evaluate(async (source) => {
    const host = document.createElement('div');
    host.innerHTML = source;
    document.body.append(host);

    const settle = async (): Promise<void> => {
      const pending = [...host.querySelectorAll('*')].filter((el) => el.tagName.includes('-'));
      await Promise.all(
        pending.map(async (el) => {
          await customElements.whenDefined(el.tagName.toLowerCase());
          await (el as HTMLElement & { updateComplete?: Promise<unknown> }).updateComplete;
        }),
      );
    };

    /* Twice: a nested element only exists after its parent has rendered, so
       the first pass cannot have waited for it. */
    await settle();
    await settle();

    /* Two normalisations. Lit's client renderer leaves comment markers between
       bindings and its SSR renderer leaves different ones, and neither set is
       markup. And components compose components, which the browser upgrades in
       place while the static export flattens away — so unwrapping compares the
       two renderings rather than the two depths they are printed at. */
    /* An icon is drawn two ways on purpose: the browser references a sprite,
       and the static export, having none, inlines the glyph. Comparing those
       bodies would only ever say "they differ", so `data-icon` is compared
       instead. Everything else about the two renderings still has to agree. */
    for (const svg of host.querySelectorAll('svg[data-icon]')) svg.replaceChildren();

    const strip = (node: Node): void => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === Node.COMMENT_NODE) {
          child.remove();
          continue;
        }
        if (child.nodeType !== Node.ELEMENT_NODE) continue;
        strip(child);
        if ((child as Element).tagName.toLowerCase().startsWith('sds-')) {
          (child as Element).replaceWith(...child.childNodes);
        }
      }
    };
    strip(host);

    const out = host.innerHTML;
    host.remove();
    return out;
  }, markup);
}

/* Whitespace is normalised on both sides. The templates carry the newlines
   and indentation that keep a generated card diffable, and the browser
   reflows them; that difference is formatting and not markup. */
const flat = (s: string): string =>
  /* The export's inlined glyph, emptied the same way the browser's is. */
  s.replace(/(<svg[^>]*data-icon="[^"]*"[^>]*>)[\s\S]*?(<\/svg>)/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();

const HOST = '/iframe.html?id=components-button--primary&viewMode=story';

test.beforeEach(async ({ page }) => {
  await page.goto(HOST);
  await page.waitForFunction(() => customElements.get('sds-button') !== undefined);
});

const CASES: { name: string; markup: string; template: TemplateResult }[] = [
  {
    name: 'button, primary with an icon',
    markup: '<sds-button variant="primary"><sds-icon name="actions-play"></sds-icon>Run the checks</sds-button>',
    template: buttonMarkup({ variant: 'primary' }, html`<sds-icon name="actions-play"></sds-icon>${buttonLabel('Run the checks')}`),
  },
  {
    name: 'button, ghost',
    markup: '<sds-button variant="ghost">Cancel</sds-button>',
    template: buttonMarkup({ variant: 'ghost' }, 'Cancel'),
  },
  {
    name: 'button, icon-only with a title',
    markup: '<sds-button variant="secondary" size="sm" title="Close"><sds-icon name="actions-close"></sds-icon></sds-button>',
    template: buttonMarkup(
      { variant: 'secondary', size: 'sm', title: 'Close', iconOnly: true },
      html`<sds-icon name="actions-close"></sds-icon>`,
    ),
  },
  {
    name: 'field at rest',
    markup: '<sds-field value="Type to search 48 pages" icon="actions-search"></sds-field>',
    template: html`<sds-field value="Type to search 48 pages" icon="actions-search"></sds-field>`,
  },
  {
    name: 'badge, plain',
    markup: '<sds-badge label="readOnlyHint"></sds-badge>',
    template: html`<sds-badge label="readOnlyHint"></sds-badge>`,
  },
  {
    name: 'badge, a status tone and its glyph',
    markup: '<sds-badge label="answered" tone="ok"></sds-badge>',
    template: html`<sds-badge label="answered" tone="ok"></sds-badge>`,
  },
  {
    name: 'surface, the sunken plane',
    markup: '<sds-surface plane="sunken" heading="Sunken" body="For machine output."></sds-surface>',
    template: html`<sds-surface plane="sunken" heading="Sunken" body="For machine output."></sds-surface>`,
  },
  {
    name: 'icon, at 24',
    markup: '<sds-icon name="actions-cog" size="24"></sds-icon>',
    template: html`<sds-icon name="actions-cog" size="24"></sds-icon>`,
  },
];

for (const c of CASES) {
  test(`${c.name} renders the same in the browser and in the export`, async ({ page }) => {
    expect(flat(await mount(page, c.markup))).toBe(flat(renderStatic(c.template)));
  });
}

/* Every element is the box it draws.

   A block that stands in a flow is a block: it carries the step, and what it
   draws inside gives it up. A part standing in a line of text or a row of
   controls is inline, so the line lays out the element itself. Either way a
   distance is read off the element it belongs to rather than assembled from
   two of them, and no rule in this system reaches past one to find a block.

   The exception is named rather than defaulted to: what a dialog or an overlay
   draws is in the top layer or fixed to the viewport, so a box where it stands
   is one nothing would ever fill. Nothing else may be invisible. */
test('every element is the box it draws', async ({ page }) => {
  const seen = await page.evaluate(async () => {
    const blocks = ['sds-card', 'sds-note', 'sds-grid', 'sds-stat', 'sds-surface', 'sds-table',
      'sds-tabs', 'sds-field', 'sds-nav-pills', 'sds-nav-rail', 'sds-footer'];
    const parts = ['sds-button', 'sds-badge', 'sds-icon', 'sds-link', 'sds-search', 'sds-theme'];
    const away = ['sds-dialog', 'sds-lightbox', 'sds-modal', 'sds-overlay'];
    const out: Record<string, string> = {};
    for (const tag of [...blocks, ...parts, ...away]) {
      await customElements.whenDefined(tag);
      const el = document.createElement(tag);
      document.body.append(el);
      out[tag] = getComputedStyle(el).display;
      el.remove();
    }
    return { out, blocks, parts, away };
  });

  for (const tag of seen.blocks) {
    expect(seen.out[tag], `${tag} stands in a flow, so it is a block of its own`).toBe('block');
  }
  for (const tag of seen.parts) {
    expect(seen.out[tag], `${tag} stands in a line, so it is the box that line lays out`)
      .toMatch(/^inline/);
  }
  for (const tag of seen.away) {
    expect(seen.out[tag], `${tag} draws nothing where it stands`).toBe('contents');
  }
});
