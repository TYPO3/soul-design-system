# Soul Design System — how to build with it

A design system of **custom elements, tokens, and the class layer they
emit.**

**The custom elements are how you use this system.** Use the element first.
Write the classes by hand only where a surface cannot run JavaScript. The
classes are not the primary interface. They are what the elements emit, and
what a JavaScript-free surface falls back to.

Two rules follow, and both carry weight:

- **Never rebuild a component in your own stylesheet.** If `sds-code` or
  `sds-table` almost fits, the gap is a gap in the component. Say so, and
  the component gets it. Otherwise every consumer writes the same three
  declarations slightly differently.
- **Every class-layer feature must be reachable from the element.** A
  modifier the element cannot emit invites hand-written markup, and the two
  layers drift from that moment on.

`components/bundle.js` ships the system as Lit custom elements:

| | |
|---|---|
| Text | `sds-icon` `sds-link` `sds-eyebrow`. The eyebrow is the line over a title, in the label register as a block. It sits flush, with the register's leading as the air. `sds-label` stays the word in a line |
| Brand, chrome | `sds-theme` |
| Controls | `sds-button` `sds-dropdown` `sds-badge` `sds-field` `sds-textarea` `sds-select` `sds-field-group` `sds-field-error` `sds-checkbox` `sds-checkbox-group` `sds-radio` `sds-switch` `sds-range` `sds-file` `sds-form-errors`. A switch takes effect where it stands, and a checkbox answers the form. A slider is for a value to feel for, and a field with `type="number"` for one the reader knows. `sds-file` keeps the platform's own picker and paints its button. A drawn box with a hidden input has no keyboard. `sds-field-group` is a control and what stands with it, at the normal step. The field, a row of actions, a hint. Loose, they touch. `sds-dropdown` is a button and the short list it opens. Its `choices` decide what the list is. Entries with `href` are pages, and Tab walks them. Entries without are commands, and the arrows walk them. It is the language control in `sds-nav-main`, which takes the same entries as `languages` |
| Navigation | `sds-nav-pills` `sds-nav-main` `sds-tabs`/`sds-tab-item` `sds-nav-rail` `sds-nav-toc` `sds-nav-outline` `sds-nav-breadcrumb` `sds-footer` `sds-accordion`/`sds-accordion-item` `sds-search`/`sds-search-hits`. `sds-nav-main` is the whole bar. It gets the site as one `MenuEntry` and measures what fits. It opens a section's pages in a drop or a wall under the row. On a phone it steps through the menu a level at a time in one drawer. Search fetches its index on the first keystroke and drops `sds-search-hits` under the field. That element gets the hits and draws them as `sds-search-result` rows. So a page of results and the drop are the same list. `sds-nav-toc` is what is on the page, and the one navigation that finds its own current entry. It marks the section the reader has scrolled to |
| Surfaces | `sds-surface` `sds-overlay` `sds-modal` `sds-dialog`. `sds-surface` is a plane and takes `plane="plain|raised|sunken"`. `plain` is the hairline with no fill. What goes somewhere is `sds-card`, whatever its fill |
| Data | `sds-table` `sds-code` `sds-copy` `sds-tree` `sds-diff` `sds-stat` `sds-figure` `sds-image` `sds-embed` `sds-lightbox` `sds-card`/`sds-grid` `sds-search-result` `sds-nav-pagination` `sds-nav-pager`. `sds-td-graph` with `sds-graph` and `sds-graph--open` is the rail of a history. It is a rail and not a graph. A history that forks is a drawing. A `sds-table` cell takes a component or `{ value, note }`. So a row somebody acts on carries its own controls and its own state line. Nobody rebuilds it as markup. `sds-card` is a way into something, and the whole of it is the link. Alone, or as one entry in a list. `sds-grid` takes cards and carries how wide the set runs |
| States | `sds-note` `sds-progress`. An empty answer has no element of its own. A page says it in its own headline, a list in an `info` note. `sds-progress` is how far a running job has got, driven from outside. `value` against `max`, the position beside the bar as a percentage or as the two numbers. The fill's ink comes from the same distance and arrives at the status colour as the run does. `pulsing` says work happens right now, which a bar at rest cannot say. With no share there is nothing to fill, and the answer is `sds-loading` with a spinner |
| Instructions | `sds-steps`/`sds-step`. Work with an order, numbered down one rail. The number is the set's own count. A stop in the middle renumbers the rest, and nothing states a figure. A stop's content goes between the tags. `heading` is the only thing that fits an attribute. `optional` leaves its disc unfilled and puts the word beside the title. It is a list in ARIA, not `<ol>`. An element's own box always stands one generic away from the set's |
| Plans | `sds-timeline`/`sds-timeline-stop`. A plan on the calendar: dated stops down one rail, as elements between the tags, one marked `now`. A stop holds what it delivers and the stops inside it. The passed ones carry the check, the ones ahead stand a step quieter. Not `sds-steps` and not `sds-run` |
| Decisions | `sds-decision`/`sds-answer`. The question a paper asks, who decides and by when. The answers as elements between the tags, with the one it recommends. `sds-compare` is two pictures read against each other, each a figure with its claim |
| Work | `sds-run`. Work in progress, which is not `sds-steps`. A run arrives one stop at a time, each stop with what it wrote. The whole ends on a `verdict`. Stops take `label`, `state` (`ahead|running|done|failed`), `meta` for a duration. `note` is what happens to it in words, `output` what it wrote. `group` is for many jobs at once. `open` says if the whole stands unfolded. The share, where the work reports one, is `sds-progress` above it. A run whose end is not a number draws no bar |
| Decks | `sds-slide`. One 16:9 frame: the page at twice the size, so every element between the tags keeps its set. `kind` is `cover`, `speaker`, `section`, `statement`, `content` or `closing`. A speaker's `portrait` and `alt`. `ground` is `paper` unless said, and `terminal` on the cover. `eyebrow`, `heading`, `lead`, `note`, `number`. The lockup as `signet`, `brand`, `product`; the outline as `sections` and `current`. `fit` scales the frame to the room it has. |
| Long text | `sds-quote` `sds-byline` `sds-confval` `sds-facts` `sds-entry` `sds-register`. The first two take `as` for what the source is. `role` is the ARIA attribute and is out of reach. `sds-confval` is one configuration value in a reference. `name`, `anchor`, `required`, `type`, `default`, and `facts` for whatever else the source named |

They render **light DOM** and emit exactly the classes below. So an element
and a hand-written `<button class="sds-btn">` are the same markup under the
same rules. Use them where a surface already runs JavaScript. Use the
classes everywhere else. Neither is a fallback for the other, and **the
classes stay the authority**. A component that disagrees with
`components/bundle.css` is a bug in the component.

`sds-modal` draws the modal surface. `sds-dialog` is the behaviour: a real
`<dialog>` that opens, traps focus and closes on Escape. `sds-lightbox` is
the same behaviour around a drawing, not a question. A modal stops at
`--measure-modal` because a reader reads what is in one, and a reader
looks at a drawing. Reach it with `<sds-figure zoomable>` or `<sds-image
zoomable>`, not by hand.

## Setup

One stylesheet, one script, one class. `components/bundle.css` carries the
faces, the tokens and the class layer. `components/bundle.js` registers
every element on the page. `sds-app` on the root sets the canvas, the sans
stack and the text colour. Without it you inherit the browser's Times New
Roman on white.

```html
<link rel="stylesheet" href="components/bundle.css">
<script src="components/bundle.js"></script>
<body class="sds-app"> … </body>
```

`bundle.js` is a classic script. It registers the elements as it loads and
puts every class under `window.SDS`. There is nothing to call. A project
installs the same elements as the module `soul.js` of `@typo3/soul-frontend`.

`sds-icon` draws its glyph out of the script: this bundle carries the
whole set, so a preview fetches no sprite. The files under
`icons/sprites/` are for a page outside the artifact, one file per
category; `SDS.setIconSprites(dir)` points the element at them.

A script sets a property that takes a template, a `body` or a table cell
with markup in it. `SDS.html` and `SDS.unsafeHTML` come from Lit. Every
element's `preview.html` shows the way.

**Without the script you write the fallback.** The elements are how you use
this system. Without them a page keeps the classes, and every part name in
it becomes markup somebody has to maintain by hand.

Both themes ship in one declaration. Every colour is `light-dark()` against
`color-scheme: light dark`, so light and dark cannot drift. Force a mode
with `data-theme="light"` or `data-theme="dark"`. Put it on `<html>`, or
the browser's own scrollbars and form controls stay in the other mode.

<!-- @startingPoints -->

## A deck

A slide is the page at twice the size, read from twice the distance. On a
page the frame is `sds-slide`, and the layouts under **Slides** above are
the slides to start from. Nothing on a slide is a slide's own. A card is
`sds-surface` and a figure is `sds-stat`. A block is `sds-code`, a quote
is `sds-quote`, an order is `sds-steps`, a wall is `sds-grid`.

**A deck written in the Slides app follows the same rules in that app's own
format.** The canvas is 1920 × 1080, every style inline, every colour a hex.
The values are the page's, doubled, and they stand here written out:

| The page says | On a slide |
|---|---|
| `--space-16` 64px, the margin of the frame | `padding:128px` on every side, and 176px at the foot where a foot stands |
| `--font-size-display` 58px, the title of a cover, a divider, a statement | `font-size:116px`, weight 700, `line-height:1.08`, `letter-spacing:-3px` |
| `--font-size-h2` 34px, the title of a content slide | `font-size:68px`, weight 700, `line-height:1.2`, `letter-spacing:-1px` |
| `--font-size-h3` 24px, a card's heading, a quote | `font-size:48px`, weight 600 for a heading, 400 for a quote |
| `--font-size-lead` 19px, the sentence under a cover's title | `font-size:38px`, weight 400, `line-height:1.55` |
| `--font-size-body` 16px, what a room reads | `font-size:32px`, weight 400, `line-height:1.55` |
| `--font-size-small` 14px, a source line, a caption | `font-size:28px` |
| the label register: `--font-size-small` 14px × 0.9 in the mono face, upper case, `--tracking-label` 0.09em | `font-size:25px`, `font-family:'Source Code Pro'`, `text-transform:uppercase`, `letter-spacing:2px` |
| `--radius-control` 4px, a code block | `border-radius:8px` |
| `--radius-card` 6px, a card | `border-radius:12px` |
| `--border-hairline` 1px, every edge | `border:2px solid` the hairline colour |

The faces are the system's: `Source Sans 3` for everything a person wrote,
`Source Code Pro` for everything the machine reads, writes or names, at
every size. Both are in `fonts/`.

**The grounds.** A deck stands on paper. The cover stands on the terminal,
and that flip is the deck's emphasis: no accent ground, no gradient, no
second colour. Every other slide is paper, whatever the reader's mode.

| Token | Paper | Terminal |
|---|---|---|
| `--surface-canvas`, the slide | `#fbfaf7` | `#131210` |
| `--surface-raised`, a card | `#ffffff` | `#171614` |
| `--surface-sunken`, a code block | `#f4f2ee` | `#0c0b0a` |
| `--surface-inset`, a monogram | `#efebe3` | `#221f1b` |
| `--text-primary`, a title | `#1c1a17` | `#ede9e2` |
| `--text-secondary`, a sentence | `#4a453d` | `#a9a299` |
| `--text-muted`, a label, a count, a source | `#726c63` | `#878076` |
| `--border-subtle`, a hairline | `#e3dfd6` | `#2b2823` |
| `--border-strong`, a quote's rule | `#c9c3b7` | `#37332c` |
| `--accent` | `#ff8700` | `#ff8700` |
| `--syntax-key` | `#a85400` | `#ffa338` |
| `--syntax-string` | `#3f6b2b` | `#9cc27f` |
| `--syntax-comment` | `#726c63` | `#878076` |

**The accent marks three things on a slide**, as on a page. The pipe in the
lockup, the prompt in a code block, and the rule under the current entry of
the outline on a divider. Nothing else is orange. Nothing floats: a card
and a code block separate with a hairline, never a shadow. Status is a
colour and a word, never an emoji.

**The kinds, and what each holds.**

- **Cover**, on the terminal. The eyebrow in the label register and the
  title at the display step. The lead under it, the lockup at the foot. The
  lockup is the signet, `TYPO3` at weight 600, a 2px accent rule and the
  product at weight 300. It stands at the h3 step with the mark at 64.
- **Speaker**. Two columns, and the portrait fills the right one edge to
  edge, 40% of the width. Left, centred: the eyebrow says who speaks. The
  name at the display step, the role and team as the lead, one sentence.
  A speaker has a portrait; it is the deck's own picture. Two speakers take
  a plain plane each, with a byline and one sentence.
- **Section**. The eyebrow says which of how many, the title at the display
  step. The outline in a row at the foot, over a hairline. Every entry takes
  the muted ink. The current one is primary, weight 600, with a 4px accent
  rule under it.
- **Statement**. One sentence at the display step, centred, and its source
  under it at the small step, muted. No foot.
- **Content**. The title at the h2 step at the top margin, never centred,
  so it never hops. The body under it: cards in a row with a 32px gap, or
  a table. A code block beside a plane, three figures, a numbered rail. The
  foot at `bottom:64px`. The lockup at the page's size, its mark at 48. The
  count in the label register at the right.
- **The closing**, on paper. The cover's shape and lockup, with the one
  thing to do next as the title.

One idea per slide. A list becomes cards, a table or figures. A title
introduces the topic in sentence case, with no superlative. A figure carries
its unit beside it and a sentence under it; a quote carries who said it. A
deck built in the app and a deck built from the layouts are the same design.

## The idiom

Classes carry the prefix `sds-`, with `__element`, `--modifier`, and
`.is-active` / `.is-disabled` / `.is-focused` / `.is-invalid` /
`.is-filled` / `.is-selected` for state.

**Never set a colour, size, radius or duration literal.** Every value is a
token: `--surface-*`, `--text-*`, `--border-*`, `--accent*`, `--status-*`,
`--syntax-*`, `--font-*`, `--weight-*`, `--leading-*`, `--tracking-*`,
`--measure-*`, `--space-1…16`, `--radius-none|control|card|pill`,
`--focus-offset|--focus-halo`, `--duration-*`, `--ease-*`. Use
`--accent`, never the raw `--orange-*` scale.

**The semantic colours have names, not patterns.** Surfaces are
`--surface-canvas`, `--surface-raised`, `--surface-sunken`,
`--surface-inset`, `--surface-overlay`. Text is `--text-primary`,
`--text-secondary`, `--text-muted`, `--text-link`, `--text-on-accent`.
Borders are `--border-subtle`, `--border-strong`, `--border-emphasis`. A
guess from the pattern is how a surface called *page*, or text called
*default*, comes about. Such a name resolves to nothing, paints nothing,
and no check reports it.

The focus ring comes from the last two plus `--border-emphasis` and
`--accent-ring`, and from nothing else. A surface that turns it inwards or
drops the halo writes that with the same tokens, never with a number.

**Never invent a class.** If nothing here fits, compose from the tokens
with your own inline styles. Do not mint a `sds-` name.

| Family | Classes |
|---|---|
| Root, text | `sds-app` `sds-prose` `sds-section`/`sds-section__number` `sds-label` `sds-eyebrow` `sds-mono` `sds-link` `sds-link--external` `sds-icon` `sds-icon--16` `sds-icon--20` `sds-icon--24` `sds-icon--muted` |
| Type | `sds-display` `sds-h1` `sds-h2` `sds-h3` `sds-lead` |
| Bullets | `sds-list` for air between items, `sds-list--plain` for a list of links. A bare `ul`/`ol` needs neither, marker and indent included |
| Layout | `sds-shell` `sds-skip`, the link above the bar to the page's `<main id="main-content">`, in every page shell. `sds-bar`/`sds-bar__end`/`sds-bar__nav`/`sds-bar__section`/`sds-bar__section--drop`/`sds-bar__fold`/`sds-bar__panel`/`sds-bar__link`/`sds-bar__level`/`sds-bar__row`/`sds-bar__into`/`sds-bar__back`/`sds-bar__toggle`/`sds-bar__drawer`, which `sds-nav-main` writes and a page never does. A hand-written row cannot measure itself and so cannot fold. `sds-body`/`sds-body__rail` `sds-column` `sds-page` `sds-paper`/`sds-paper__panel`/`sds-paper__head`/`sds-paper__title`/`sds-paper__foot`/`sds-paper__main`. The panel is a long document's frame. Sticky, the height of the window, the contents between its head and its foot. `sds-sections` `sds-stack` `sds-row` `sds-actions` `sds-split` `sds-grid` `sds-grid--wide` `sds-grid--dense` `sds-grid--flush`. The first two say how much room a card in the grid needs, never how many columns. The third takes the gutter out, so the cards share a hairline and the set reads as one block. `sds-grid` writes them, not a page |
| Bands | `sds-bands` `sds-band` `sds-band--quiet`. Full-bleed sections whose ground changes, contents on the page measure. Instead of `sds-page`, never inside one |
| Site footer | `sds-footer` `sds-footer__top` `sds-footer__brand` `sds-footer__note` `sds-footer__groups` `sds-footer__group` `sds-footer__links` `sds-footer__end` `sds-footer__marks`. Every part falls away where nothing sets it. A screen with no site around it is the same element with a name, a note and the way out. `sds-crumbs` `sds-crumbs__sep` `sds-crumbs__here` |
| Figures | `sds-stat` `sds-stat__icon` `sds-stat__value` `sds-stat__unit` `sds-stat__note`. `sds-grid` lays a set of them out, at `dense` and in a `flush` wall too. The frame in a wall is the wall's, so a figure anywhere else stays bare. Every figure has the same three lines, so a reader reads a set across its notes. A share is words, `2 of 3`, never a bar. `sds-figure` `sds-figure__frame` `sds-figure__caption` |
| Artwork | `sds-art`. One file, in both modes. A photograph is an `<img>`. A drawing is an `<svg>` with a `<use>` into the file. Only a reference lets the tokens reach the shapes. `sds-lightbox` `sds-lightbox__art` `sds-zoom` open one at its drawn size |
| Search | `sds-hits` `sds-hits__empty`. The answers, and the sentence one with no hits gives. The hairline between two hits is the list's, drawn in the gap. So the plane a hit takes under the pointer never meets it. `sds-result` `sds-result__thumb` `sds-result__body` `sds-result__title` `sds-result__path` `sds-result__meta` `sds-result__text`. The hit *is* an `<a>`, named by its heading, so the whole row is the target with one link. The thumbnail is optional and sits beside the words, never over them. `sds-mark` for the search term inside what the search found |
| Cards | `sds-card` `sds-card__media` `sds-card__icon` `sds-card__body` `sds-card__title` `sds-card__text` `sds-card__foot` `sds-card__note` `sds-card__action`. The title's anchor stretches over the frame, so a card carries one link, and the call to action is words |
| Colours | `sds-swatch` `sds-swatch--line` `sds-swatch__chip` `sds-swatch__body` `sds-swatch__name` `sds-swatch__value`. One colour and all three things it is: the chip, the name a design writes, the resolved value. A row, not a tile. A reader reads a palette down its names. A hairline draws as its own edge, because at one pixel a fill is invisible. `sds-grid` lays it out at `wide` |
| Tiles | `sds-icon-tile` `sds-icon-tile__art` `sds-icon-tile__name` `sds-icon-tile__tag`. One glyph in a wall of hundreds, in `sds-grid` at `dense`. Not a card. A reader finds a wall like this by shape. So the drawing fills the box, and the identifier under it stays in the muted register. The whole tile is one anchor, and the corner carries the one fact a drawing cannot show |
| Lists | `sds-pager` `sds-pager__next`. The page before and the page after, at the foot of a page in a sequence. Not `sds-pagination`, which numbers a set. `sds-pagination` `sds-pagination__page` `sds-pagination__step` `sds-pagination__gap` `sds-pagination__count` |
| Long text | `sds-quote` `sds-quote__body` `sds-quote__by`. The attribution is mandatory. `sds-byline` `sds-byline__mark` `sds-byline__who` `sds-byline__name` `sds-byline__role` |
| Buttons | `sds-btn` + `--primary` `--secondary` `--ghost` `--danger` `--sm` `--icon`. `--danger` is the press with no undo, the one control with a status colour, and its label names what goes. Hand-written markup writes `type="button"` unless it is the form's submit. A `<button>` with no type inside a `<form>` submits it |
| Badges | `sds-badge` + `--accent` `--ok` `--warn` `--error` |
| Fields | `sds-field` + `--sm` `--lg` `--multi`. The control heights a button has, `md` by default. So a field and the button beside it stand on one line. `sds-input` `sds-field__affix` `sds-field-error` `sds-field-group`. `sds-textarea` draws the field's box under `sds-field--multi`. `sds-select` + `sds-select__native` `sds-select__button` `sds-select__value` `sds-select__mark` `sds-select__list` `sds-select__option` `sds-select__tick` `sds-select__group`. The element draws the list, not the browser, so a dark page does not open a light window. The real `select` under it is what the form sends. `sds-switch` + `sds-switch__track` `sds-switch__body` `sds-switch__label` `sds-switch__hint`. `sds-range` + `sds-range__head` `sds-range__value` `sds-range__slider`. `sds-file` |
| Form | `sds-form` `sds-field-row` `sds-field-label` `sds-field-req` `sds-field-hint`. A field in a form owes a visible label, a hint under the control and an error under both. A placeholder is not a label |
| Choices | `sds-check` `sds-check__mark` `sds-check__body` `sds-check__label` `sds-check__hint` `sds-choices`. `sds-form-errors` `sds-form-errors__list` |
| Tables | `sds-table` + `--compact` `--medium` `--airy`, in `sds-table-scroll` where it can outgrow its column. `caption` names it under the last row, where a figure's caption stands. `caption-side="top"` (`sds-table--caption-top`) puts it above the head: the name of a list a reader scans. Cells `sds-td-name` `sds-td-meta`, and `sds-td-note` for a second line under the name. What is true about that row right now, in the cell. `sds-table--loading` draws the body as `sds-skeleton` bars with the head in place, for the wait before the rows |
| Surfaces | `sds-plane` `sds-panel` `sds-sunken` `sds-surface-icon` `sds-surface-title` `sds-surface-body` `sds-overlay` `sds-modal__head|__body|__foot`. The card's own classes are under Cards |
| Plans | `sds-timeline` `sds-timeline__stop`/`sds-timeline__stop--passed`/`sds-timeline__stop--now`/`sds-timeline__stop--ahead` `sds-timeline__mark` `sds-timeline__when` `sds-timeline__title` `sds-timeline__body`. The mark is a run's glyph, and the rail is solid up to now and dashed beyond |
| Decisions | `sds-decision` `sds-decision__question` `sds-decision__lead` `sds-decision__answers` `sds-decision__answer` `sds-decision__key` `sds-decision__what` `sds-decision__label` `sds-decision__body` `sds-decision__meta`; `is-recommended` on the one answer. `sds-compare` `sds-compare__half`, two figures in one row |
| Steps | `sds-steps` `sds-steps__step` `sds-steps__step--optional` `sds-steps__title`. The set carries `role="list"` and every stop `role="listitem"`. The number is a counter in the disc. The word that says a stop is optional is `sds-label` inside the title |
| Work | `sds-run` `sds-run__head` `sds-run__verdict--running|--done|--failed` `sds-run__headline` `sds-run__heading` `sds-run__note` `sds-run__body` `sds-run__group` `sds-run__group-head` `sds-run__list` `sds-run__step--ahead|--running|--done|--failed` `sds-run__fold` `sds-run__row` `sds-run__chevron` `sds-run__mark--ahead|--running|--done|--failed` `sds-run__label` `sds-run__said` `sds-run__meta` `sds-run__output` `sds-run__line--note|--ok|--error`. A real `<details>` at both levels, so it folds with no script. The mark carries `sds-spinner` while the stop is in hand, and the row a band. The two settled ends are what the status colours are for |
| Folds | `sds-accordion` `sds-accordion__item` `sds-accordion__head` `sds-accordion__body`. A real `<details>`, so it folds with no script. An answer of blocks goes in `sds-accordion-item` between the tags |
| Navigation | `sds-pills`/`sds-pill` `sds-tabs`/`sds-tab`/`sds-tab__panel` `sds-rail`/`sds-rail__heading`/`sds-rail__item`/`sds-rail__group`/`sds-rail__fold` `sds-toc`/`sds-toc__list`/`sds-toc__item` `sds-outline`/`sds-outline__fold`/`sds-outline__toggle`/`sds-outline__list`/`sds-outline__item`/`sds-outline__number`, which `sds-nav-outline` writes: the parts of a long document in the panel of `sds-paper`. The bar's own parts are under Layout |
| Status on a word | `.sds-ok` `.sds-warn` `.sds-error`. The status colour on a word: a count in a table cell, a state in a line of prose. `sds-badge` is the pill around a thing. This is the colour on the word, and no other colour goes on one |
| Facts | `<sds-facts>`, which draws `<dl class="sds-facts">`; the pairs between its tags as `<dt>` and `<dd>`, or `.entries`. A block of terms and their values, scanned down the terms. No indent, and a shorter step from a name to its value than to the next name. `sds-facts-set` wraps two lists with their labels between them, so their values still stand at one edge. Apart, they size their terms on their own, and a label cannot go inside a `<dl>`. `sds-facts__note` is a line under a value with what is true about it. A bare `<dl>` is the prose form, for a read, not a scan |
| Values a reader takes away | `<sds-copy label="Directory" value="~/site">`. The value in the machine's own font with the button that puts it on the clipboard, on one line. `sds-code` is the block form, and a frame around a frame for one word. `ellipsis="start|end"` cuts the value to one line at the caller's end. The front for a path, whose name is its last segment. The press still writes the whole of it. `sds-copy__value|__button`. The press is one glyph, and its sentence is `title` |
| Directory trees | `<sds-tree level="2" .entries="${[{ label: 'docs/', note: 'the sources', items: [] }]}">`. A nested list, folded with `<details>` and no script. A directory has its slash. `level` is how deep it stands open, and nothing below it drops. `sds-tree__list|__item|__row|__mark|__glyph|__name|__note` `sds-tree__fold` |
| Code | `<sds-code code-lang="bash">`. The attribute is `code-lang`, because `lang` names the human language of the content. `sds-code__head|__body|__lang|__copy|__glyph|__copied|__caption|__row|__row--cited|__no|__remarks` `sds-code__prompt|__cmd|__comment|__ok` `sds-diff` `sds-diff__line--add|--del` |
| States | `sds-note` + `--ok` `--warn` `--error` `--info`, with `__icon` `__title` `__body` `__action`. `sds-loading` `sds-spinner` `sds-skeleton`. `sds-progress` `sds-progress--small` `sds-progress--pulsing` with `sds-progress__head` `sds-progress__caption` `sds-progress__value` `sds-progress__track` `sds-progress__fill` `sds-progress__note`. The fill draws to the length the component's own set carries. Its ink comes from that same length, grey at the start and the status colour on arrival. `sds-progress--pulsing` sends a hatch through the fill: work happens right now |
| Reference | `sds-confval` with `__term` `__name` `__mark` `__detail` `__facts` `__body`. A hairline above each entry and no box around one. The facts stand in a row on the inset surface |
| Registers | `sds-entry` with `__number` `__title` `__meta` `__origin` `__body` `__todo`. One numbered, addressed entry, the number in a rail on the left. The kind is a word in a badge, with the origin beside it. No box round one, and a hairline only between two in a register. `sds-register` with `__entries` holds the entries and numbers them. It groups them in an `sds-section` each. Every one goes into one `sds-table` first, and the work they ask for into a second |
| Brand | `sds-signet` `sds-lockup` `sds-wordmark` `sds-wordmark__brand` `sds-wordmark__pipe` `sds-wordmark__product`. A narrow bar drops the brand half and keeps the product's own name |
| Chrome | `sds-theme__toggle` with `sds-theme__mark--machine` `sds-theme__mark--light` `sds-theme__mark--dark`. The mode is one press through three, as the system's own icon button. The marks stack, and the document's own `data-theme` decides which one stands at full ink |

## Icons

Every `actions-*` icon from [TYPO3/TYPO3.Icons](https://github.com/TYPO3/TYPO3.Icons)
(MIT, `@typo3/icons`) ships, named by the identifier TYPO3 core itself uses.
The layout mirrors the package, so its own manifest resolves:

```
assets/icons/icons.json                        the lookup — identifier, category, paths
assets/icons/svgs/actions/actions-search.svg   one file
assets/icons/sprites/actions.svg               the whole category, one request
```

Use `<sds-icon name="actions-search">`. It carries the SVG inline, because
an `<img>` cannot inherit `currentColor`, and colour is the whole point.
Where an element is out of reach, a template that inlines with `source()`,
take the single file.

**Need one outside `actions`?** Do not draw it, and do not take it from
another icon set. A category goes into `CATEGORIES` in `scripts/icons.ts`
and ships whole. These return the raw SVG:

```
https://cdn.jsdelivr.net/npm/@typo3/icons@5.0.3/src/<category>/<identifier>.svg   # the version this system ships
https://raw.githubusercontent.com/TYPO3/TYPO3.Icons/main/src/<category>/<identifier>.svg   # upstream tip
```

Every category is available that way: `actions`, `apps`, `avatar`,
`content`, `default`, `files`, `form`, `information`, `install`,
`mimetypes`, `miscellaneous`, `module`, `overlay`, `spinner`, `status`. To
look one up, `…/@typo3/icons@5.0.3/dist/icons.json` maps every identifier
to its category and every deprecated alias to its current name. The set is
at <https://typo3.github.io/TYPO3.Icons/>. A 404 means the identifier does
not exist. That is the answer, not a reason to substitute something.

## Non-negotiable

- **A shadow says a surface left the page.** Write the job, `--shadow-basic`,
  `--shadow-strong`, `--shadow-tooltip`, `--shadow-flyout`,
  `--shadow-dialog`, `--shadow-window`, never the raw `--shadow-2…64`
  behind them. Nothing that stays on the page takes one. It separates with
  a hairline plus `--surface-overlay`, and the focus ring is a state, not
  depth.
- **One accent.** `--accent` marks exactly three things. The active nav
  item, the shell prompt in a code block, the pipe in the wordmark. No
  second accent. The only gradients are the card's lit frame and the hatch
  a running `sds-progress` draws in its own fill.
- **Mono is semantic.** Everything the machine reads, writes or names, tool
  names, paths, flags, versions, is `sds-mono`, never title case:
  `typo3_server_scope`, `.mcp.json`.
- **No emoji.** Status is a colour plus an icon from
  `packages/frontend/assets/icons/`.
- **Hover changes colour and border. Never position, never size.** Nothing
  lifts or scales.
- **Icons: 16px floor**, sizes 16/20/24 only, inline SVG so `currentColor`
  inherits.
- **Sentence case headings**, no marketing superlatives.
- **The pictures are illustrations, and nobody photographs a person.** What
  ships under `assets/placeholders/` is the whole language. A face is a
  file to fetch, keep in step and licence, and none of that names somebody.
  `sds-byline` marks a person with initials. A picture a reader has to
  understand is a diagram instead.
- An answer carries its source and version binding. An error names the
  command that fixes it. Use `sds-note--warn` for a degraded but usable
  answer, `--error` for none.

## Where the truth is

Read the real files before you style: `tokens.json` and
`components/bundle.css`. Per element, `components/<Class>/README.md` is its
attributes and what goes between its tags, and `<Class>.d.ts` beside it
the types. `preview.html` is the element live in its states, written the
way a page writes it. Read that before you write one.

`guidelines/build-rules.md` is the full rule set. The sections after it
carry the brand, the signet, the states and the icons, each rule as a
picture. Copy the nearest element instead of a variant of your own.

A product on this system brings its own mark and its own pictures.
`guidelines/signet-prompt.md` draws a signet to the construction, and
`guidelines/illustration-prompt.md` extends the picture set. The marks under
`assets/` belong to the products named on them. Use the prompt, not one of
those, and say so where a mark is absent.

## A worked example

A degraded answer and what to do about it, the way you use this system:

```html
<sds-note tone="warn"
  heading="The installation could not be booted — packages were read instead">
  This answer omits anything a running extension would add.
  <span class="sds-mono">ddev start</span> would fix it.
</sds-note>
<div class="sds-actions">
  <sds-button variant="primary">Run the checks</sds-button>
  <sds-button variant="ghost">Cancel</sds-button>
</div>
```

The same thing on a surface that runs no script. It is the markup the
elements above emit, which is why it is a fallback and not a second way to
build:

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
<div class="sds-actions">
  <button class="sds-btn sds-btn--primary">Run the checks</button>
  <button class="sds-btn sds-btn--ghost">Cancel</button>
</div>
```
