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
import { buttonMarkup } from '../packages/frontend/src/components/button.ts';
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
    template: buttonMarkup({ variant: 'primary' }, html`<sds-icon name="actions-play"></sds-icon>Run the checks`),
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
