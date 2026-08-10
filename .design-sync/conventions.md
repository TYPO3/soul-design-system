# Soul Design System — how to build with it

A CSS design system: **classes and tokens first.** You build plain markup and put
these classes on it, and that is the whole contract — the product this dresses is
plain PHP with an HTML surface and runs no JavaScript to be styled.

`_ds_bundle.js` also ships the same system as Lit custom elements:

| | |
|---|---|
| Text | `sds-icon` `sds-link` |
| Controls | `sds-button` `sds-badge` `sds-field` `sds-field-error` |
| Navigation | `sds-pills` `sds-tabs` `sds-rail` |
| Surfaces | `sds-surface` `sds-overlay` `sds-modal` `sds-drawer` `sds-dialog` |
| Data | `sds-table` `sds-code` `sds-diff` |

They render **light DOM** and emit exactly the classes below, so an element and a
hand-written `<button class="sds-btn">` are the same markup styled by the same rules.
Use them where a surface already runs JavaScript; use the classes everywhere else.
Neither is a fallback for the other, and **the classes stay authoritative** — a
component that disagrees with `_ds_bundle.css` is a bug in the component.

`sds-modal` draws the modal surface; `sds-dialog` is the behaviour — a real
`<dialog>` that opens, traps focus and closes on Escape.

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
| Root, text | `sds-app` `sds-prose` `sds-label` `sds-mono` `sds-link` `sds-link--external` `sds-icon` `sds-icon--20` `sds-icon--24` `sds-icon--muted` |
| Buttons | `sds-btn` + `--primary` `--secondary` `--ghost` `--sm` `--icon` |
| Badges | `sds-badge` + `--accent` `--ok` `--warn` `--error` |
| Fields | `sds-field` `sds-input` `sds-select` `sds-field-error` |
| Tables | `sds-table` + `--compact` `--medium` `--airy` `--scroll`; cells `sds-td-name` `sds-td-meta` |
| Surfaces | `sds-card` `sds-panel` `sds-sunken` `sds-overlay` `sds-modal__head|__body|__foot` `sds-drawer` |
| Navigation | `sds-pills`/`sds-pill` `sds-tabs`/`sds-tab` `sds-rail`/`sds-rail__item` |
| Code | `sds-code__head|__body` `sds-code__prompt|__cmd|__comment|__ok|__string|__key` `sds-diff` `sds-diff__line--add|--del` |
| States | `sds-note` + `--ok` `--warn` `--error` `--info`, with `__icon` `__title` `__body`; `sds-loading` `sds-spinner` `sds-skeleton` |
| Brand | `sds-lockup` `sds-wordmark` `sds-wordmark__pipe` `sds-wordmark__product` |

## Icons

`assets/icons/` — 33 SVGs from [TYPO3/TYPO3.Icons](https://github.com/TYPO3/TYPO3.Icons)
(MIT, `@typo3/icons` 5.0.3), named by the identifier TYPO3 core itself uses:
`assets/icons/actions-search.svg`. Inline the file's contents rather than pointing an
`<img>` at it — an `<img>` cannot inherit `currentColor`, and colour is the whole point.

**Need one that is not among the 33?** Do not draw it, and do not take it from another
icon set — fetch it. The identifier's first segment is its category, and that is the
whole path rule: `actions-search` → `src/actions/actions-search.svg`, `module-dashboard`
→ `src/module/module-dashboard.svg`. Both of these return the raw SVG:

```
https://cdn.jsdelivr.net/npm/@typo3/icons@5.0.3/src/<category>/<identifier>.svg   # the version this system ships
https://raw.githubusercontent.com/TYPO3/TYPO3.Icons/main/src/<category>/<identifier>.svg   # upstream tip
```

796 icons in 15 categories are available that way — `actions`, `apps`, `avatar`,
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
