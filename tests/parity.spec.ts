/* The invariant the whole arrangement rests on.

   A component is written once, as an element, and rendered two ways: Lit
   renders it in the browser when the element upgrades, and `@lit-labs/ssr`
   renders it in Node when `make cards` writes the static specimen card. The
   Design System pane only ever sees the second one — it opens the cards with
   `styles.css` and no JavaScript at all.

   So the two renderings have to agree, and nothing else checks that they do.
   The pixel diff compares cards against cards. The typecheck sees one source.
   If Lit's client renderer and its SSR renderer ever disagree — a version
   bump, a directive that behaves differently, an attribute that serialises
   another way — the cards keep passing while the components quietly ship
   different markup. This test is the only place that would notice.

   Both sides start from the same tag. There is no second, function-shaped
   way to produce this markup, so there is nothing else it could be compared
   against. */

import { test, expect, type Page } from '@playwright/test';
import { html, type TemplateResult } from 'lit';
import { renderStatic } from '../src/lib/render.ts';
import '../src/index.ts';

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

    /* Two normalisations, and both have a reason.

       Lit's client renderer leaves comment markers between bindings so it can
       find them again on the next update. Its SSR renderer leaves different
       ones, and `src/lib/render.ts` strips those because a static card is
       never hydrated. Neither set is markup.

       And components compose components: a button holds an `<sds-icon>`,
       which the browser upgrades in place while the static export flattens it
       away — a card is opened with no JavaScript, so it cannot carry an
       element. Unwrapping compares the two renderings rather than the two
       depths they are printed at. */
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
const flat = (s: string): string => s.replace(/\s+/g, ' ').trim();

const HOST = '/iframe.html?id=components-buttons--primary&viewMode=story';

test.beforeEach(async ({ page }) => {
  await page.goto(HOST);
  await page.waitForFunction(() => customElements.get('sds-button') !== undefined);
});

const CASES: { name: string; markup: string; template: TemplateResult }[] = [
  {
    name: 'button, primary with an icon',
    markup: '<sds-button variant="primary" label="Run the checks" icon="actions-play"></sds-button>',
    template: html`<sds-button variant="primary" label="Run the checks" icon="actions-play"></sds-button>`,
  },
  {
    name: 'button, ghost',
    markup: '<sds-button variant="ghost" label="Cancel"></sds-button>',
    template: html`<sds-button variant="ghost" label="Cancel"></sds-button>`,
  },
  {
    name: 'button, icon-only with a title',
    markup: '<sds-button variant="secondary" size="sm" label="" icon="actions-close" title="Close"></sds-button>',
    template: html`<sds-button variant="secondary" size="sm" label="" icon="actions-close" title="Close"></sds-button>`,
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

/* `display: contents` on the host is what keeps the element out of the box
   tree. Without it the element becomes the flex item instead of the button
   inside it, and every gap, alignment and `flex:1` in the specimens lands on
   the wrapper — a layout break no markup comparison would catch, because the
   markup would still be correct. */
test('every registered host is removed from the box tree', async ({ page }) => {
  const displays = await page.evaluate(async () => {
    const tags = [
      'sds-button', 'sds-badge', 'sds-icon', 'sds-field',
      'sds-pills', 'sds-tabs', 'sds-rail', 'sds-surface', 'sds-table',
    ];
    const out: Record<string, string> = {};
    for (const tag of tags) {
      await customElements.whenDefined(tag);
      const el = document.createElement(tag);
      document.body.append(el);
      out[tag] = getComputedStyle(el).display;
      el.remove();
    }
    return out;
  });

  for (const [tag, display] of Object.entries(displays)) {
    expect(display, `${tag} must not be in the box tree`).toBe('contents');
  }
});
