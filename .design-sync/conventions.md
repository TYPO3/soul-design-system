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
| Text | `sds-icon` `sds-link` `sds-eyebrow` — the eyebrow is the line over a title, in the label register as a block; it carries the title group's step itself, where `sds-label` stays the word in a line |
| Brand, chrome | `sds-theme` |
| Controls | `sds-button` `sds-badge` `sds-field` `sds-field-group` `sds-field-error` `sds-checkbox` `sds-radio` `sds-form-errors` — `sds-field-group` is a control and what stands with it on a page (the field, a row of actions, a hint) at the normal step; a field or a row of actions alone owes none, so loose they touch |
| Navigation | `sds-nav-pills` `sds-nav-main` `sds-tabs`/`sds-tab-item` `sds-nav-rail` `sds-nav-toc` `sds-nav-breadcrumb` `sds-footer` `sds-accordion`/`sds-accordion-item` `sds-search`/`sds-search-hits` — `sds-nav-main` is the whole bar: it is handed the site as one `MenuEntry` with everything under it, measures what still fits, opens a section's pages in a drop or a wall under the row, and on a phone steps through the menu a level at a time in one drawer. Search fetches its index on the first keystroke and drops `sds-search-hits` under the field; that element is handed the hits and draws them as `sds-search-result` rows, so a page of results and the drop are the same list. `sds-nav-toc` is what is on the page being read, and the one navigation that finds its own current entry: it marks the section the reader has scrolled to |
| Surfaces | `sds-surface` `sds-overlay` `sds-modal` `sds-dialog` — `sds-surface` is a *filled* plane and takes `plane="raised|sunken"`; the plane with no fill is a card, and `sds-card` draws it |
| Data | `sds-table` `sds-code` `sds-diff` `sds-stat` `sds-figure` `sds-image` `sds-embed` `sds-lightbox` `sds-card`/`sds-grid` `sds-search-result` `sds-nav-pagination` `sds-nav-pager` — `sds-card` is a way into something and the whole of it is the link, whether it stands alone or is one entry in a list of them; `sds-grid` takes cards and carries how wide the set runs |
| States | `sds-note` — an empty answer has no element of its own: a page says it in its own headline, a list says it in an `info` note |
| Long text | `sds-quote` `sds-byline` `sds-confval` — the first two take `as` for what the source is; `role` is the ARIA attribute and cannot be used. `sds-confval` is one configuration value in a reference: `name`, `anchor`, `required`, `type`, `default`, and `facts` for whatever else the source named |

They render **light DOM** and emit exactly the classes below, so an element and a
hand-written `<button class="sds-btn">` are the same markup styled by the same rules.
Use them where a surface already runs JavaScript; use the classes everywhere else.
Neither is a fallback for the other, and **the classes stay authoritative** — a
component that disagrees with `_ds_bundle.css` is a bug in the component.

`sds-modal` draws the modal surface; `sds-dialog` is the behaviour — a real
`<dialog>` that opens, traps focus and closes on Escape. `sds-lightbox` is the
same behaviour around a drawing rather than a question: a modal stops at
`--measure-modal` because what is in one is read, and a drawing is looked at.
Reach it with `<sds-figure zoomable>` or `<sds-image zoomable>` rather than by hand.

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
`--radius-none|control|card|pill`, `--focus-offset|--focus-halo`, `--duration-*`,
`--ease-*`. Use `--accent`, never the raw `--orange-*` scale.

The focus ring is drawn from the last two plus `--border-emphasis` and
`--accent-ring`, and from nothing else: a surface that turns it inwards or
drops the halo writes that with the same tokens, never with a number.

**Never invent a class.** If nothing here fits, compose from the tokens with your own
inline styles — do not mint a `sds-` name.

| Family | Classes |
|---|---|
| Root, text | `sds-app` `sds-prose` `sds-label` `sds-eyebrow` `sds-mono` `sds-link` `sds-link--external` `sds-icon` `sds-icon--16` `sds-icon--20` `sds-icon--24` `sds-icon--muted` |
| Type | `sds-display` `sds-h1` `sds-h2` `sds-h3` `sds-lead` |
| Bullets | `sds-list` for air between items, `sds-list--plain` for a list of links — a bare `ul`/`ol` is already set, marker and indent included, so neither is needed to make a list look right |
| Layout | `sds-shell` `sds-skip` — the link above the bar that jumps to the page's `<main id="main-content">`, and every page shell has one — `sds-bar`/`sds-bar__end`/`sds-bar__nav`/`sds-bar__section`/`sds-bar__section--drop`/`sds-bar__fold`/`sds-bar__panel`/`sds-bar__link`/`sds-bar__level`/`sds-bar__row`/`sds-bar__into`/`sds-bar__back`/`sds-bar__toggle`/`sds-bar__drawer`, written by `sds-nav-main` and never by a page — a hand-written row cannot measure itself and so cannot fold; `sds-body`/`sds-body__rail` `sds-column` `sds-page` `sds-foot` `sds-sections` `sds-stack` `sds-row` `sds-actions` `sds-split` `sds-grid` `sds-grid--wide` `sds-grid--dense` `sds-grid--flush` — the first two say how much room a card in the grid needs, never how many columns to draw; the third takes the gutter out, so the cards share a hairline and the set reads as one block. Written by `sds-grid`, not by a page |
| Bands | `sds-bands` `sds-band` `sds-band--quiet` — full-bleed sections whose ground changes, contents on the page measure. Use instead of `sds-page`, never inside one |
| Site footer | `sds-footer` `sds-footer__top` `sds-footer__brand` `sds-footer__note` `sds-footer__groups` `sds-footer__group` `sds-footer__links` `sds-footer__end` `sds-footer__marks` — every part falls away where nothing is set, so a screen with no site around it is the same element with a name, a note and the way out; `sds-crumbs` `sds-crumbs__sep` `sds-crumbs__here` |
| Figures | `sds-stat` `sds-stat__icon` `sds-stat__value` `sds-stat__unit` `sds-stat__note` — a set of them is laid out by `sds-grid`, like any other set read side by side, at `dense` and in a `flush` wall too; the frame in a wall is the wall's, so a figure anywhere else stays bare. Every figure has the same three lines, so a set of them is read across its notes; a share is words — `2 of 3` — and never a bar under one of them; `sds-figure` `sds-figure__frame` `sds-figure__caption` |
| Artwork | `sds-art` — one file, in both modes. A photograph is an `<img>`; a drawing is an `<svg>` with a `<use>` into the file, because only a reference lets the tokens reach the shapes. `sds-lightbox` `sds-lightbox__art` `sds-zoom` open one at the size it was drawn |
| Search | `sds-hits` `sds-hits__empty` — the answers, and the sentence one with no hits gives; the hairline between two hits is the list's and is drawn in the gap, so the plane a hit takes under the pointer never meets it; `sds-result` `sds-result__thumb` `sds-result__body` `sds-result__title` `sds-result__path` `sds-result__meta` `sds-result__text` — the hit *is* an `<a>`, named by its heading, so the whole row is the target and carries one link; the thumbnail is optional and sits beside the words, never over them; `sds-mark` for what was searched for inside what was found |
| Cards | `sds-card` `sds-card__media` `sds-card__icon` `sds-card__body` `sds-card__title` `sds-card__text` `sds-card__foot` `sds-card__note` `sds-card__action` — the title's anchor is stretched over the frame, so a card carries one link and the call to action is words |
| Colours | `sds-swatch` `sds-swatch--line` `sds-swatch__chip` `sds-swatch__body` `sds-swatch__name` `sds-swatch__value` — one colour and all three of the things it is: the chip, the name a design writes, the value the mode resolved it to. A row, not a tile: a palette is read down its names. A hairline is drawn as its own edge, because at one pixel a fill is invisible and a filled chip is a different job. Laid out by `sds-grid` at `wide` |
| Tiles | `sds-icon-tile` `sds-icon-tile__art` `sds-icon-tile__name` `sds-icon-tile__tag` — one glyph in a wall of hundreds, laid out by `sds-grid` at `dense`. Not a card: a wall like this is found by shape, so the drawing fills the box and the identifier under it is held back to the muted register. The whole tile is one anchor, and the corner carries the single fact a drawing cannot show |
| Lists | `sds-pager` `sds-pager__next` — the page before and the page after, at the foot of a page read in order; not `sds-pagination`, which numbers a set. `sds-pagination` `sds-pagination__page` `sds-pagination__step` `sds-pagination__gap` `sds-pagination__count` |
| Long text | `sds-quote` `sds-quote__body` `sds-quote__by` — the attribution is required; `sds-byline` `sds-byline__mark` `sds-byline__who` `sds-byline__name` `sds-byline__role` |
| Buttons | `sds-btn` + `--primary` `--secondary` `--ghost` `--sm` `--icon`. Hand-written markup writes `type="button"` unless it is the form's submit — a `<button>` with no type inside a `<form>` submits it |
| Badges | `sds-badge` + `--accent` `--ok` `--warn` `--error` |
| Fields | `sds-field` + `--sm` `--lg` `--multi` — the control heights a button has, `md` unless one is said, so a field and the button beside it stand on one line; `sds-input` `sds-select` `sds-field-error` `sds-field-group` |
| Form | `sds-form` `sds-field-row` `sds-field-label` `sds-field-req` `sds-field-hint` — a field in a form owes a visible label, a hint under the control and an error under both; a placeholder is not a label |
| Choices | `sds-check` `sds-check__mark` `sds-check__body` `sds-check__label` `sds-check__hint` `sds-choices`; `sds-form-errors` `sds-form-errors__list` |
| Tables | `sds-table` + `--compact` `--medium` `--airy`, wrapped in `sds-table-scroll` where it may outgrow its column; cells `sds-td-name` `sds-td-meta` |
| Surfaces | `sds-card` `sds-panel` `sds-sunken` `sds-surface-icon` `sds-surface-title` `sds-surface-body` `sds-overlay` `sds-modal__head|__body|__foot` |
| Folds | `sds-accordion` `sds-accordion__item` `sds-accordion__head` `sds-accordion__body` — a real `<details>`, so it folds with no script; an answer that is blocks rather than a string goes in `sds-accordion-item` between the tags |
| Navigation | `sds-pills`/`sds-pill` `sds-tabs`/`sds-tab`/`sds-tab__panel` `sds-rail`/`sds-rail__heading`/`sds-rail__item`/`sds-rail__group`/`sds-rail__fold` `sds-toc`/`sds-toc__list`/`sds-toc__item` — the bar's own parts are under Layout |
| Code | `<sds-code code-lang="bash">` — the attribute is `code-lang`, because `lang` names the human language of the content. `sds-code__head|__body|__lang|__copy|__glyph|__copied|__caption` `sds-code__prompt|__cmd|__comment|__ok` `sds-diff` `sds-diff__line--add|--del` |
| States | `sds-note` + `--ok` `--warn` `--error` `--info`, with `__icon` `__title` `__body`; `sds-loading` `sds-spinner` `sds-skeleton` |
| Reference | `sds-confval` with `__term` `__name` `__mark` `__detail` `__facts` `__body` — a hairline above each entry and no box around one; the facts stand in a row on the inset surface |
| Brand | `sds-signet` `sds-lockup` `sds-wordmark` `sds-wordmark__brand` `sds-wordmark__pipe` `sds-wordmark__product` — a narrow bar drops the brand half and keeps the product's own name |
| Chrome | `sds-modes`/`sds-mode`/`sds-mode__label` — each segment is a mark and its word; the word is what a bar with no room for it drops first |

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

- **A shadow says a surface left the page.** Write the job — `--shadow-basic`,
  `--shadow-strong`, `--shadow-tooltip`, `--shadow-flyout`, `--shadow-dialog`,
  `--shadow-window` — never the raw `--shadow-2…64` behind them. Nothing that stays on
  the page takes one: it separates with a hairline plus `--surface-overlay`, and the
  focus ring is a state, not depth.
- **One accent.** `--accent` marks exactly three things: the active nav item, the shell
  prompt in a code block, the pipe in the wordmark. No second accent, no gradient.
- **Mono is semantic.** Anything the machine reads, writes or names — tool names, paths,
  flags, versions — is `sds-mono`, never title-cased: `typo3_server_scope`, `.mcp.json`.
- **No emoji.** Status is a colour plus an icon from `packages/frontend/assets/icons/`.
- **Hover changes colour and border. Never position, never size.** Nothing lifts or scales.
- **Icons: 16px floor**, sizes 16/20/24 only, inlined SVG so `currentColor` is inherited.
- **Sentence case headings**, no marketing superlatives.
- An answer carries its source and version binding; an error names the command that
  fixes it. Use `sds-note--warn` for a degraded-but-usable answer, `--error` for none.

## Where the truth is

Read the real files before styling: `styles.css` and its imports (`tokens/*.css`,
`_ds_bundle.css`). Per card, `components/<Group>/<Name>/<Name>.prompt.md` has the
markup to copy. `guidelines/build-rules.md` is the full rule set. Copy the
nearest specimen rather than inventing a variant.

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
