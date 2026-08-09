# TYPO3 Support App — how to build with this system

A CSS design system: **classes and tokens, no JavaScript components.** `_ds_bundle.js`
is an empty namespace on purpose — there is nothing to import. You build plain
markup and put these classes on it.

## Setup

Link `styles.css` and put `tsa-app` on the root element. That one class establishes
the canvas, the sans stack and the text colour; without it you inherit the browser's
Times New Roman on white.

```html
<link rel="stylesheet" href="styles.css">
<body class="tsa-app"> … </body>
```

Both themes ship in one declaration — every colour is `light-dark()` against
`color-scheme: light dark`, so light and dark cannot drift. Force a mode with
`data-theme="light"` or `data-theme="dark"`; put it on `<html>` or the browser's own
scrollbars and form controls stay in the other mode.

## The idiom

Classes are prefixed `tsa-`, with `__element`, `--modifier`, and `.is-active` /
`.is-disabled` / `.is-focused` / `.is-invalid` / `.is-filled` / `.is-selected` for state.

**Never set a colour, size, radius or duration literal.** Every value is a token:
`--surface-*`, `--text-*`, `--border-*`, `--accent*`, `--status-*`, `--syntax-*`,
`--font-*`, `--weight-*`, `--leading-*`, `--tracking-*`, `--measure-*`, `--space-1…16`,
`--radius-none|control|card|pill`, `--duration-*`, `--ease-*`. Use `--accent`, never the
raw `--orange-*` scale.

**Never invent a class.** If nothing here fits, compose from the tokens with your own
inline styles — do not mint a `tsa-` name.

| Family | Classes |
|---|---|
| Root, text | `tsa-app` `tsa-prose` `tsa-label` `tsa-mono` `tsa-link` `tsa-link--external` `tsa-icon` `tsa-icon--20` `tsa-icon--24` `tsa-icon--muted` |
| Buttons | `tsa-btn` + `--primary` `--secondary` `--ghost` `--sm` `--icon` |
| Badges | `tsa-badge` + `--accent` `--ok` `--warn` `--error` |
| Fields | `tsa-field` `tsa-input` `tsa-select` `tsa-field-error` |
| Tables | `tsa-table` + `--compact` `--medium` `--airy`; cells `tsa-td-name` `tsa-td-meta` |
| Surfaces | `tsa-card` `tsa-panel` `tsa-sunken` `tsa-overlay` `tsa-modal__head|__body|__foot` `tsa-drawer` |
| Navigation | `tsa-pills`/`tsa-pill` `tsa-tabs`/`tsa-tab` `tsa-rail`/`tsa-rail__item` |
| Code | `tsa-code__head|__body` `tsa-code__prompt|__cmd|__comment|__ok|__string|__key` `tsa-diff` `tsa-diff__line--add|--del` |
| States | `tsa-note` + `--ok` `--warn` `--error` `--info`, with `__icon` `__title` `__body`; `tsa-loading` `tsa-spinner` `tsa-skeleton` |
| Brand | `tsa-lockup` `tsa-wordmark` `tsa-wordmark__pipe` `tsa-wordmark__product` |

## Non-negotiable

- **No shadows.** Separation is a hairline plus `--surface-overlay`. The focus ring is
  the only `box-shadow`, and it is a state, not depth.
- **One accent.** `--accent` marks exactly three things: the active nav item, the shell
  prompt in a code block, the pipe in the wordmark. No second accent, no gradient.
- **Mono is semantic.** Anything the machine reads, writes or names — tool names, paths,
  flags, versions — is `tsa-mono`, never title-cased: `typo3_server_scope`, `.mcp.json`.
- **No emoji.** Status is a colour plus an icon from `assets/icons/`.
- **Hover changes colour and border. Never position, never size.** Nothing lifts or scales.
- **Icons: 16px floor**, sizes 16/20/24 only, inlined SVG so `currentColor` is inherited.
- **Sentence case headings**, no marketing superlatives.
- An answer carries its source and version binding; an error names the command that
  fixes it. Use `tsa-note--warn` for a degraded-but-usable answer, `--error` for none.

## Where the truth is

Read the real files before styling: `styles.css` and its imports (`tokens/*.css`,
`_ds_bundle.css`). Per card, `components/<Group>/<Name>/<Name>.prompt.md` has the
markup to copy. `guidelines/build-rules.md` is the full rule set; `guidelines/rationale.md`
is why. Copy the nearest specimen rather than inventing a variant.

## A worked example

```html
<div class="tsa-note tsa-note--warn">
  <span class="tsa-note__icon"><svg class="tsa-icon" viewBox="0 0 16 16">…</svg></span>
  <div>
    <div class="tsa-note__title">The installation could not be booted — packages were read instead</div>
    <div class="tsa-note__body">
      This answer omits anything a running extension would add.
      <span class="tsa-mono">ddev start</span> would fix it.
    </div>
  </div>
</div>
<div style="display:flex; gap:var(--space-2); margin-top:var(--space-4)">
  <button class="tsa-btn tsa-btn--primary">Run the checks</button>
  <button class="tsa-btn tsa-btn--ghost">Cancel</button>
</div>
```
