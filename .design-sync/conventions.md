# Soul Design System — how to build with it

A design system of **custom elements, tokens, and the class layer they emit.**

**The custom elements are how this system is used.** Reach for the element
first; write the classes by hand only where a surface genuinely cannot run
JavaScript. The classes are not the primary interface — they are what the
elements emit, and what a JavaScript-free surface may fall back to.

Two rules follow, and both are load-bearing:

- **Never rebuild a component in your own stylesheet.** If `sds-code` or
  `sds-table` almost fits, the gap is a gap in the component. Say so, and it
  gets added here — the alternative is every consumer writing the same three
  declarations slightly differently.
- **Every class-layer feature must be reachable from the element.** A modifier
  the element cannot emit invites the markup to be hand-written again, and the
  two layers drift from that moment on.

`_ds_bundle.js` ships the system as Lit custom elements:

| | |
|---|---|
| Text | `sds-icon` `sds-link` |
| Brand, chrome | `sds-signet` `sds-theme` |
| Controls | `sds-button` `sds-badge` `sds-field` `sds-field-error` `sds-checkbox` `sds-radio-group` `sds-form-errors` |
| Navigation | `sds-pills` `sds-menu` `sds-tabs`/`sds-tab-item` `sds-rail` `sds-crumbs` `sds-footer` `sds-accordion` `sds-search` — search fetches its index on the first keystroke and draws `sds-result` rows in the menu's drop |
| Surfaces | `sds-surface` `sds-overlay` `sds-modal` `sds-drawer` `sds-dialog` |
| Data | `sds-table` `sds-code` `sds-diff` `sds-stat` `sds-figure` `sds-lightbox` `sds-teaser` `sds-result` `sds-pagination` |
| States | `sds-note` `sds-empty` |
| Long text | `sds-quote` `sds-byline` — both take `as` for what the source is; `role` is the ARIA attribute and cannot be used |

They render **light DOM** and emit exactly the classes below, so an element and a
hand-written `<button class="sds-btn">` are the same markup styled by the same rules.
Use them where a surface already runs JavaScript; use the classes everywhere else.
Neither is a fallback for the other, and **the classes stay authoritative** — a
component that disagrees with `_ds_bundle.css` is a bug in the component.

`sds-modal` draws the modal surface; `sds-dialog` is the behaviour — a real
`<dialog>` that opens, traps focus and closes on Escape. `sds-lightbox` is the
same behaviour around a drawing rather than a question: a modal stops at
`--measure-modal` because what is in one is read, and a drawing is looked at.
Reach it with `<sds-figure zoomable>` rather than by hand.

## Setup

Link `styles.css` and put `sds-app` on the root element. That one class establishes
the canvas, the sans stack and the text colour; without it you inherit the browser's
Times New Roman on white.

```html
<link rel="stylesheet" href="styles.css">
<body class="sds-app"> … </body>
```

Both themes ship in one declaration — every colour is `light-dark()` against
`color-scheme: light dark`, so light and dark cannot drift. Force a mode with
`data-theme="light"` or `data-theme="dark"`; put it on `<html>` or the browser's own
scrollbars and form controls stay in the other mode.

## The idiom

Classes are prefixed `sds-`, with `__element`, `--modifier`, and `.is-active` /
`.is-disabled` / `.is-focused` / `.is-invalid` / `.is-filled` / `.is-selected` for state.

**Never set a colour, size, radius or duration literal.** Every value is a token:
`--surface-*`, `--text-*`, `--border-*`, `--accent*`, `--status-*`, `--syntax-*`,
`--font-*`, `--weight-*`, `--leading-*`, `--tracking-*`, `--measure-*`, `--space-1…16`,
`--radius-none|control|card|pill`, `--duration-*`, `--ease-*`. Use `--accent`, never the
raw `--orange-*` scale.

**Never invent a class.** If nothing here fits, compose from the tokens with your own
inline styles — do not mint a `sds-` name.

| Family | Classes |
|---|---|
| Root, text | `sds-app` `sds-prose` `sds-label` `sds-mono` `sds-link` `sds-link--external` `sds-icon` `sds-icon--16` `sds-icon--20` `sds-icon--24` `sds-icon--muted` |
| Type | `sds-display` `sds-h1` `sds-h2` `sds-h3` `sds-lead` |
| Layout | `sds-shell` `sds-bar`/`sds-bar__end` `sds-body`/`sds-body__rail` `sds-column` `sds-page` `sds-foot` `sds-sections` `sds-stack` `sds-row` `sds-actions` `sds-split` `sds-grid` |
| Bands | `sds-bands` `sds-band` `sds-band--quiet` — full-bleed sections whose ground changes, contents on the page measure. Use instead of `sds-page`, never inside one |
| Site footer | `sds-footer` `sds-footer__groups` `sds-footer__group` `sds-footer__links` `sds-footer__end`; `sds-crumbs` `sds-crumbs__sep` `sds-crumbs__here` |
| Figures | `sds-stats` `sds-stat` `sds-stat__value` `sds-stat__note`; `sds-figure` `sds-figure__frame` `sds-figure__caption` |
| Artwork | `sds-art` `sds-art--light` `sds-art--dark` — a drawing that ships as two files, one per mode. Both go in the markup; the stylesheet shows the one the nearest forced mode asks for. `sds-lightbox` `sds-lightbox__art` `sds-figure__zoom` open one at the size it was drawn |
| Search | `sds-result` `sds-result__title` `sds-result__path` `sds-result__text`; `sds-mark` for what was searched for inside what was found |
| Lists | `sds-teaser` `sds-teaser__art` `sds-teaser__body` `sds-teaser__title` `sds-teaser__text`; `sds-pagination` `sds-pagination__page` `sds-pagination__step` `sds-pagination__gap` `sds-pagination__count` |
| Long text | `sds-quote` `sds-quote__body` `sds-quote__by` — the attribution is required; `sds-byline` `sds-byline__mark` `sds-byline__who` `sds-byline__name` `sds-byline__role` |
| Empty | `sds-empty` `sds-empty--boundary` `sds-empty__icon` `sds-empty__title` `sds-empty__body` — never "no results": name the source asked, what it does not cover, and the nearest real thing |
| Buttons | `sds-btn` + `--primary` `--secondary` `--ghost` `--sm` `--icon`. Hand-written markup writes `type="button"` unless it is the form's submit — a `<button>` with no type inside a `<form>` submits it |
| Badges | `sds-badge` + `--accent` `--ok` `--warn` `--error` |
| Fields | `sds-field` `sds-input` `sds-select` `sds-field--multi` `sds-field-error` |
| Form | `sds-form` `sds-field-row` `sds-field-label` `sds-field-req` `sds-field-hint` — a field in a form owes a visible label, a hint under the control and an error under both; a placeholder is not a label |
| Choices | `sds-check` `sds-check__mark` `sds-check__body` `sds-check__label` `sds-check__hint` `sds-choices`; `sds-form-errors` `sds-form-errors__list` |
| Tables | `sds-table` + `--compact` `--medium` `--airy`, wrapped in `sds-table-scroll` where it may outgrow its column; cells `sds-td-name` `sds-td-meta` |
| Surfaces | `sds-card` `sds-panel` `sds-sunken` `sds-surface-icon` `sds-surface-title` `sds-surface-body` `sds-overlay` `sds-modal__head|__body|__foot` `sds-drawer` |
| Folds | `sds-accordion` `sds-accordion__item` `sds-accordion__head` `sds-accordion__body` — a real `<details>`, so it folds with no script |
| Navigation | `sds-pills`/`sds-pill` `sds-menu`/`sds-menu--for`/`sds-menu__items`/`sds-menu__panel`/`sds-menu__toggle` `sds-tabs`/`sds-tab`/`sds-tab__panel` `sds-rail`/`sds-rail__item`/`sds-rail__group` |
| Code | `<sds-code code-lang="bash">` — the attribute is `code-lang`, because `lang` names the human language of the content. `sds-code__head|__body|__lang|__copy|__glyph|__copied|__caption` `sds-code__prompt|__cmd|__comment|__ok|__string|__key` `sds-diff` `sds-diff__line--add|--del` |
| States | `sds-note` + `--ok` `--warn` `--error` `--info`, with `__icon` `__title` `__body`; `sds-loading` `sds-spinner` `sds-skeleton` |
| Brand | `sds-signet` `sds-lockup` `sds-wordmark` `sds-wordmark__pipe` `sds-wordmark__product` |
| Chrome | `sds-modes`/`sds-mode` |

## Icons

Every `actions-*` icon from [TYPO3/TYPO3.Icons](https://github.com/TYPO3/TYPO3.Icons)
(MIT, `@typo3/icons`) ships, named by the identifier TYPO3 core itself uses. The layout mirrors the package, so its own manifest resolves:

```
assets/icons/icons.json                        the lookup — identifier, category, paths
assets/icons/svgs/actions/actions-search.svg   one file
assets/icons/sprites/actions.svg               the whole category, one request
```

Reach for `<sds-icon name="actions-search">`; it carries the SVG inline, because an
`<img>` cannot inherit `currentColor` and colour is the whole point. Where an element
is not available — a template that inlines with `source()` — take the single file.

**Need one outside `actions`?** Do not draw it, and do not take it from another icon
set. A category is added to `CATEGORIES` in `scripts/icons.ts` and shipped whole. These return the raw SVG:

```
https://cdn.jsdelivr.net/npm/@typo3/icons@5.0.3/src/<category>/<identifier>.svg   # the version this system ships
https://raw.githubusercontent.com/TYPO3/TYPO3.Icons/main/src/<category>/<identifier>.svg   # upstream tip
```

Every category is available that way — `actions`, `apps`, `avatar`,
`content`, `default`, `files`, `form`, `information`, `install`, `mimetypes`,
`miscellaneous`, `module`, `overlay`, `spinner`, `status`. To look one up rather than
guess, `…/@typo3/icons@5.0.3/dist/icons.json` maps every identifier to its category and
every deprecated alias to its current name; the set is browsable at
<https://typo3.github.io/TYPO3.Icons/>. A 404 means the identifier does not exist —
that is the answer, not a reason to substitute something.

## Non-negotiable

- **No shadows.** Separation is a hairline plus `--surface-overlay`. The focus ring is
  the only `box-shadow`, and it is a state, not depth.
- **One accent.** `--accent` marks exactly three things: the active nav item, the shell
  prompt in a code block, the pipe in the wordmark. No second accent, no gradient.
- **Mono is semantic.** Anything the machine reads, writes or names — tool names, paths,
  flags, versions — is `sds-mono`, never title-cased: `typo3_server_scope`, `.mcp.json`.
- **No emoji.** Status is a colour plus an icon from `assets/icons/`.
- **Hover changes colour and border. Never position, never size.** Nothing lifts or scales.
- **Icons: 16px floor**, sizes 16/20/24 only, inlined SVG so `currentColor` is inherited.
- **Sentence case headings**, no marketing superlatives.
- An answer carries its source and version binding; an error names the command that
  fixes it. Use `sds-note--warn` for a degraded-but-usable answer, `--error` for none.

## Where the truth is

Read the real files before styling: `styles.css` and its imports (`tokens/*.css`,
`_ds_bundle.css`). Per card, `components/<Group>/<Name>/<Name>.prompt.md` has the
markup to copy. `guidelines/build-rules.md` is the full rule set; `guidelines/rationale.md`
is why. Copy the nearest specimen rather than inventing a variant.

## A worked example

```html
<div class="sds-note sds-note--warn">
  <span class="sds-note__icon"><svg class="sds-icon" viewBox="0 0 16 16">…</svg></span>
  <div>
    <div class="sds-note__title">The installation could not be booted — packages were read instead</div>
    <div class="sds-note__body">
      This answer omits anything a running extension would add.
      <span class="sds-mono">ddev start</span> would fix it.
    </div>
  </div>
</div>
<div style="display:flex; gap:var(--space-2); margin-top:var(--space-4)">
  <button class="sds-btn sds-btn--primary">Run the checks</button>
  <button class="sds-btn sds-btn--ghost">Cancel</button>
</div>
```
