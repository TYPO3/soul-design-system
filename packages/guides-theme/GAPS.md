# phpDocumentor Guides

What the theme still owes, and the decisions everything further has to hold
to. At present it owes nothing, and the rest of this file is the second half.
What is closed is not written here — it is in the template, in
`src/styles/document.css` or in the element, and `tests/guides.spec.ts` holds
it. A list that keeps its finished lines is a changelog, and stops being read.

The ground is the actual output: the HTML templates in `phpdocumentor/guides`,
`guides-restructured-text`, `guides-code` and `guides-graphs`.
`guides-theme-bootstrap` is the model for the form, not for the content.

## What a theme is

A Guides theme is a Composer package with two parts and no third:

- `resources/template/**/*.html.twig` — overrides against the core's paths. A
  template that is not overridden renders the core output.
- `resources/config/*.php` — Symfony container configuration that registers the
  theme and optionally brings directives of its own.

A theme ships no CSS; the layout links it. The core sets **not one prefixed
class of its own** — it writes `admonition note`, `section`, `toc`, `confval`,
`guilabel`, or nothing at all. Where a class comes from the RST source
(`.. container:: foo`, `:class:`), it stands in the markup unfiltered.

So two ways carry together and neither alone: overriding templates, so that
`sds-` classes and custom elements reach the markup, and a document layer —
`src/styles/document.css`, scoped to `.sds-prose` and deliberately not imported
by `styles.css` — that maps the core's classes and bare elements onto tokens.
Way one alone leaves every paragraph unstyled; way two alone writes the system
a second time in somebody else's vocabulary.

## What is decided

The rules every open line below is bound to:

- **The theme lives in this repository** and is delivered by subtree split.
- **The server writes, the element upgrades.** Without JavaScript the page has
  to be fully readable — colour is in the markup, tabs show their content, the
  rail stands. The element brings the head, the copy button, the switching and
  the folding on top of that.
- **An element standing in running text lifts its markup.** A generator knows
  only attributes and children, and an element that renders light DOM out of
  its properties writes over its children doing it — the markup is gone.
  `lifted()` is the form that solves it; the document layer is the evidence
  that it carries. Whatever gets a node next is built after that.
- **The content decides who colours.** If it carries `hljs-` classes it is
  coloured already and is kept as it came, wrapper, start line and highlighted
  lines included; otherwise `sds-code` colours it itself
  (`src/components/code.ts`, `given`). No new attribute, no switch in the
  theme. The class offset between the server's highlight.js and the one here is
  harmless: everything unnamed reads as ordinary text.
- **Twelve admonition types fall onto four tints**, after Sphinx's own
  grouping.
- **The measure is for words, not for blocks.** The text holds 66ch; tables,
  code blocks and diagrams run to the column.
- **A component in running text speaks the document's size, a caption the one
  under it.** Inside `.sds-prose` the tokens the component layer reads anyway
  are rebound for that — no rule naming a part of a component, and so no
  specificity fight.
- **The core's names are not renamed.** An output no other tool reads any more
  is no gain.
- **A picture that brings its own colours gets a ground drawn for it.** Every
  drawing is linked and keeps whatever its exporter baked in — dark line art on
  nothing, and on a dark ground the page contradicts the picture it is
  showing. Frame, card image and viewer take `--surface-art`
  under it, the one surface in the system with a value for both modes. That
  answers `figure.uml-diagram` too, without `guides-graphs` being installed
  here: what the package emits is a linked image, and a linked image lands on
  this ground. Somebody else's artwork cannot be recoloured — the colours of a
  PlantUML diagram are in the author's `skinparam`.
- **A class from the source carries through and means nothing.** What
  `.. container::` or `:class:` writes into the markup was chosen by no system;
  a rule that hits such a name makes every author's private vocabulary the
  public interface of this design system. The content is set, the box is not.
  The `sds-` names of its own are the exception that proves it: they are
  defined here, and the class layer is deliberately hand-writable.
- **The second tab form is not supported, in any form.** `div.tabs` with
  `button[data-tabs][data-target]` and `div.tab-content` comes from no package
  installed here and has therefore never been rendered. Writing a template
  against an output nobody can look at is guessing, and guessed markup is
  checked by neither a check nor a test: it stands in the tree and is either
  right or wrong, and nobody finds out which. `.. tabs::` and
  `.. configuration-block::` are the spellings that exist, and both become
  `sds-tabs`. If a package does bring the other one along, it comes with an
  output that can be looked at — then it is decided, and not before.
- **`card-grid` is gone, and that is a decision.** The spelling was a second
  door onto the same grid: `:columns:` and `:gap:` were translated into `wide`,
  `dense` and `flush`, `:card-height:` accepted and dropped. Two names for one
  thing means every page picks one and the reader has to know both, and the
  second speaks in columns and breakpoints — exactly what `grid` does not do.
  Whoever brings a TYPO3 documentation across writes `.. grid::` with one of
  the three widths; the column count was never a trace anyway, but a question
  about room.
- **Whatever is jumped to colours its own name quietly in the accent.**
  Heading, confval, glossary term, footnote and quote do it, and all for the
  same reason: the target stands in a row of siblings that look alike, and the
  browser scrolls there without saying where it stopped. A card is not one — it
  carries no `id`, because it is itself the way on, and whoever points at a
  group of cards points at the heading above them. Whatever becomes a target in
  future takes the same mark.
- **The address of an answer is on the answer.** `:name:` on the
  `accordion-item` becomes the `id` of the answer's body and not the opener's:
  the platform opens a fold a fragment points into and leaves shut the one it
  points at. A link into a folded answer then needs neither a rule nor a
  listener, and arriving colours nothing — it opens, which says more than any
  mark. The element has to take back only what its own upgrade destroys: the
  browser's jump hangs on nodes it rewrites. There is no motion in it — a fold
  that runs on arrival pulls the ground out from under the jump, and
  `:has(:target)` stills the set, for the page with no script as well. The
  set's group has been `:group:` since then: `:name:` means the address
  everywhere in a document, and a node carries it under that key whether a
  directive reads it or not.
- **The render is measured, not photographed.** `tests/guides.spec.ts` opens
  every rendered page: no error, no missing file, the findings this theme was
  written for, axe in both modes, and the three measurements from
  `tests/lib/layout.ts` — too wide, overlapping, or a box holding less than it
  was given. The third is the reason for the decision: a code block cropped to
  a fifth draws a page that merely looks calm, and a screenshot comparison
  reports that to a human who has to look — that is, to nobody. A measurement
  runs on every push. Pictures are compared where somebody looks on purpose:
  `make baseline`, `make shots`, `make diff` on the cards. Whatever arrives
  here gets its line in the suite; otherwise it quietly comes undone again.
- **There is no printing.** No print stylesheet, and that is not an open line:
  a manual page is read where it stands. On paper nothing that makes it what it
  is carries any more — no link, no search, no rail, no fold — and a second
  layout for the rest would be a second output no test looks at and no reader
  reports. What the browser makes of the page is what is printed.
- **A digression in running text is not a plane made of one sentence.** `topic`
  and `sidebar` are a box the reader may skip and the outline does not list:
  never one of a single sentence, never scanned, never with something standing
  beside it. `sds-surface` is built for the opposite — glyph, label, title,
  body, read across each other, and its default layout says so literally. The
  three templates therefore keep drawing the plate themselves; an `<aside>`
  with `.sds-panel` is the class layer as a vocabulary and not as the front
  door, which `src/components/surface.ts` records by name at that template. The
  component reaches the render where it is right: as a directive of its own in
  a `grid`, beside `stat`.

## Which layer does what

The question of what belongs to the shell decides at the same time who is fed
and who has to accept markup.

**Shell** — writes the layout once, appears in no document: `sds-theme`,
`sds-nav-breadcrumb`, `sds-nav-rail`, `sds-nav-main`, `sds-nav-pills`, `sds-footer`, plus the
classes `.sds-signet`, `.sds-shell`, `.sds-bar`, `.sds-body`, `.sds-column`,
`.sds-page`. Fed from Guides objects — menu tree, breadcrumbs, project title —
whose content is pure labelling. Attributes are enough for that; nobody here
needs children.

**Document** — maps RST nodes and stands in running text: `sds-note`,
`sds-code`, `sds-table`, `sds-figure`, `sds-tabs`, `sds-diff`, `sds-surface`,
`sds-quote`. Accepting markup is not a convenience here but the condition: the
content of a node is arbitrary content.

**In the sentence** — `sds-icon`, `sds-link`, `sds-badge`, and the text roles
that do not exist yet. For a role like `guilabel` a custom element is the wrong
price: a class and a CSS rule do it, and Guides sets the class anyway.

**Application** — `sds-modal`, `sds-dialog`, `sds-overlay`, `sds-field`,
`sds-field-error`. None of it appears in a documentation page, unless we
provide the search.

## What is not down to us

A block quote comes out as a definition list. The indented block in
`acceptance/index.rst` becomes `<dl><dt>first line</dt><dd>second line</dd>`.
That is the parser and not the theme; the repair would be a production rule of
our own here, or a patch there. A page can quote all the same: `.. quote::` is
the directive the node does not give, and it demands the source a block quote
would only offer.

The annotation list is not a counterpart problem but no problem at all. The
node collects footnotes and citations and renders its children without an
element of its own — there is nothing in the markup a class or a component
could correspond to. What becomes visible is `.footnote` and `.citation`, and
those have their rule in `document.css`.


## The coverage rule

`make coverage` demands every component in three places — a story, a drawn
class, **and a page produced by the Guides renderer**. The third is this theme,
and it is the only one where a component meets markup that was not written for
it. Evidence in the fixture (`acceptance/`) counts, a copy under
`acceptance/_cards/` does not: a copied card proves nothing about the renderer.

- **What is missing is not the same as what has no business here.**
  `PENDING.guides` in `scripts/coverage.ts` is the debt: an element that needs
  a node or a directive of its own, and the list only shrinks — a covered entry
  turns the gate as red as a missing one. `ELSEWHERE` beside it is the other
  answer and no debt: form parts, overlays, the pill navigation and the
  pagination. A manual has no form to fill in, no application chrome and no
  numbered pages — its way on is the `sds-nav-pager`. If one of them does turn up
  in the render, the classification was wrong, and the check says so.

## In what order

None. The debt list is empty at the moment — what the package has to be able to
do, it does, and what stands above are the rules the next thing has to measure
itself against. A new line goes only to what is genuinely outstanding: a
decision nobody has taken, or something that has to be built and is not. What
is decided belongs above, and what is finished stands in the template, in
`document.css` or in the element, and is held by the suite.
