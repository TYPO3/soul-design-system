---
name: soul-design-system
description: Build any surface to the Soul Design System — documentation pages, product UI, README diagrams, release notes. Load this before writing markup, CSS or SVG.
---

# Soul Design System — build rules

Soul serves the extensions, tools, services and documentation sites the TYPO3
community builds around the CMS. Product pages, guides and application UI are
all in scope; the TYPO3 backend, typo3.org and other official TYPO3 surfaces
are not. Those products have their own owners and design rules.

This file is the operating instruction. The matching pages under
`docs/design-system/` and `docs/frontend/` carry the reasons behind the rules;
read them before extending or breaking one. Every specimen card is a working
HTML file: open the one nearest your task and copy from it rather than
inventing a variant.

## Web components first

The `sds-` custom elements are the interface. Write
`<sds-code code-lang="bash">`, not a `<div class="sds-code">` you assembled
yourself. It is `code-lang` and never `lang`, which names the *human* language
of everything under it. The classes exist
because the elements emit them and because a surface that runs no JavaScript
has to have something — they are the fallback, not the front door.

Two consequences, both learned the hard way:

- **A component that almost fits is a component with a gap.** Do not close it
  in your own stylesheet. `sds-table` had no answer for a table wider than its
  column, so the first outside consumer wrote `display:block; overflow-x:auto;
  max-width:100%` into its own CSS — three declarations that the next consumer
  would have written again, differently. The system grew `--scroll` instead.
- **Anything the classes can do, the element must be able to emit.** That same
  modifier existed in `components.css` for one commit before `SdsTable` had a
  property for it, which is exactly long enough for someone to conclude the
  element is not enough and go back to hand-written markup.

### Address a component, never rebuild one

Everything about a thing that fits in a string is a property. Between the tags
goes only what an attribute cannot carry — prose, a code block, a section of a
document — and it is content, never structure.

**A `sds-x__y` class belongs to `sds-x` and to nothing else.** Writing one puts
the element's internal names into somebody else's file: the component cannot
grow a wrapper, move a row or rename a part without every surface that draws
one changing in the same commit, and the element is reduced to framing markup
that was already built. `make coverage` fails on a part written outside the
component that owns it.

The Guides theme did exactly this, and its reason was the honest one: an
addressed element draws nothing until it upgrades, so a card's title waited for
a script. The answer is not a weaker contract — it is to run the contract
earlier. `make guides` renders every element in the output in Node before the
site is published (`scripts/lib/prerender.ts`), so the markup is on the page
for a reader who runs no script at all, and the element upgrades over its own
rendering.

Two things follow for a component:

- **It must render in Node.** `make verify ARGS=ssr` is that rule; nothing may
  reach for `document`, `navigator` or `customElements` while rendering.
- **Content arrives two ways.** In a browser the element lifts its children; in
  Node there are none, so the same content is handed over as the `content`
  property — `this.taken ?? this.content` is the shape, and `SdsElement` says
  why. Anything a component decides by *inspecting* its children (a button
  working out that its label is one glyph) has to be sayable as a property too,
  or it is a decision that silently changes when a page is rendered ahead of
  the browser.

## Comments

Write the reason, not the story. A comment earns its place by saying why the
code is the way it is — a constraint, a trade, a failure it prevents. Anything
a reader can see in the line below is noise.

- **Never name another project.** No repository, no product, no consumer, no
  counts taken from one. This system is used by things it does not know about,
  and a comment that says *the documentation site needed this* dates the moment
  it is read and means nothing to the next reader. Say what the code needs.
- **No changelog.** Not what it used to be, not who asked, not when. Git holds
  that. A note about a past failure belongs only where the failure would
  otherwise be repeated, and then in a sentence.
- **Five lines, ten at the top of a file.** Counting the `/*` and the `*/`. A
  block that wants more is carrying something besides the reason — the line
  below restated, a second example, an aside. A reason that genuinely needs
  fifteen lines is a decision about the system and belongs beside its rule in
  the published documentation, where it is read on purpose.

## Start here, every time

1. Link `styles.css` — it imports every token file. Never redeclare a token value locally.
2. Set nothing about colour by hand. Semantic tokens are declared once as `light-dark(light, dark)` against `color-scheme: light dark` on `:root`. Light and dark cannot drift because there is no second block.
3. Use `--orange-*` never in a design; it is the raw scale. Use `--accent`.
4. Copy the nearest specimen card. Deviating from one is a decision you should be able to name.

To force a mode on a subtree, set `data-theme="light"` or `data-theme="dark"`. Set it on `<html>` for a whole page — deeper, and the browser's own chrome (scrollbars, form controls) stays in the other mode.

## Non-negotiable

Breaking one of these breaks the system, not just the page.

- **One accent.** `--accent` (#FF8700) marks exactly three things: the active navigation item, the shell prompt in a code block, the pipe in the wordmark. No second accent, anywhere. The accent is also the one thing a surface may be *lit* with: `--accent-glow` in the top of a card's frame under the pointer, falling away down it. That is the single gradient in the system, it is a state rather than a mark, and it is not a licence for a second one.
- **A shadow means a surface has left the page.** Write the job, never the distance: `--shadow-basic`, `--shadow-strong`, `--shadow-tooltip`, `--shadow-flyout` (what the bar opens over the text), `--shadow-dialog`, `--shadow-window`. `--shadow-2…64` is the raw scale behind them and appears in no design, the way `--orange-*` does not. Nothing that stays *on* the page takes one — a card, a band, a table separate with a hairline plus `--surface-overlay`. The focus ring is a state, not depth.
- **No emoji.** Status is a colour plus a glyph from `packages/frontend/assets/icons/` or the mono font (`✓`).
- **Mono is semantic.** Anything the machine reads, writes or names — tool names, arguments, paths, versions, CLI fragments — is Source Code Pro, at every size including headings. Never title-case or prettify them: `make verify`, `guides.xml`, `vendor/bin/guides`.
- **16px is the floor** for both the signet and the icons. Below it: wordmark alone, and no icon at all.
- **The TYPO3 Soul is not used.** Footers say what the product is, never whose it is. The system's *name* is Soul; the Association's *asset* is the TYPO3 Soul. This rule is about the asset, and the name never takes `TYPO3` in front of it.
- **Interaction never changes size.** A linked card alone may lift 2px, take the raised fill and light its top frame; keyboard focus gets the same answer. A flush wall and reduced motion hold it still. Nothing scales or bounces. Transitions use 140ms `--ease-out`.
- **Sentence case headings.** No marketing superlatives — no "powerful", "seamless", "blazing fast".

## Choosing

**Radius, by role — not by loudness.**

| Role | Value | Applies to |
| --- | --- | --- |
| Structural | `0` | Section rules, table lines, header underline, hairline grids |
| Control | `--radius-control` 4px | Buttons, fields, selects, tabs, badges, **code blocks** |
| Container | `--radius-card` 6px | Cards, panels, modals |

A container must not share its corner with its contents — that is why the card is one step larger.

**Table density.** Compact (30px rows, 13px type) when the list *is* the work: the full tool table, label lists, changelogs. Airy (48px rows, 14px type) when the rows are read rather than scanned: three worked tools, prose-adjacent reference. Medium (38px) if one density must serve both. Never zebra stripes — background changes only on hover or selection, so a highlighted row means something.

**Status colour** (`--status-ok`, `--status-warn`, `--status-error`) appears only inside code output, badges, result rows and status-about diagrams. Never as page furniture.

**A card is a hairline and 6px, no fill.** A panel is a raised fill. Sunken is machine output.

**The step above a thing is what says what it is.** A reading column runs on one gap — `--space-4` between anything and anything — and a heading buys its own air on top of it: 40px above a second level, 32px above a third, 24px above a fourth. That decreasing purchase is the hierarchy; by the fourth level the size has stopped changing and only the air still does. A flow where a heading gets what a paragraph gets has no hierarchy in it, whatever its sizes say.

**The step below one is the element's own.** A paragraph, a list and a heading carry `--space-4` under them — less as a heading deepens — so blocks written into a component's box stand apart without that box being a document. Where a container states its own step it takes those margins back, which is why a column is still one gap and not two stacked: put a block in `.sds-column`, `.sds-stack`, a card's body or a specimen's stack and it gives up its margin. A box of your own that holds authored blocks either lets them keep it or joins that list — never both.

**A titled block carries a pair, not two sizes.** Anything with a heading over its own text takes a register. A *block* — note, surface, empty state, modal, accordion — is `--block-title-size` over `--block-body-size`. An *entry*, whose title is a destination you open — card, result — is `--entry-title-size` over that same body. Sentence-bearing blocks stay in the reading register wherever they stand; machine content such as code, compact rows and captions chooses a dense role explicitly. Never set one half from `--font-size-*` directly: that is how the relationship escapes the register that owns it.

## Writing

The product's own writing is the model. Declarative, third-person, present tense; the subject is usually the software. Never "we"; "you" only for the reader's own machine.

Sentences may be long and clause-stacked, but every claim is bounded — which versions it holds for, which source answered, what it leaves out. Limitations are stated beside the claim they limit, not softened or moved to a footnote. Numbers are concrete ("PHP 8.2+", "12.4, 13.4, 14.3 and main"), never "the latest versions".

Everything ships in English regardless of the conversation language — the knowledge base matches lexically, so this is functional, not stylistic.

A design value is written exactly. An inventory is not copied into prose: name the component index, task help or directory that owns the list instead of recording how many entries it has today.

## States

An answer always carries its source, its version binding and what it leaves out. The UI states exist to carry exactly that.

- **Focus** — an outline `--border-emphasis` wide in `--accent` at `--focus-offset`, plus a `--focus-halo` of `--accent-ring`. Never a number of your own: a surface that turns the ring inwards or drops the halo says so with those tokens. Always `:focus-visible`, never `:focus`.
- **Loading** — nothing under 200ms. Over 2s the label says *why*: "booting the installation", "reading packages instead", "searching docs.typo3.org". Skeletons only where the shape is known.
- **Empty / not found** — never "no results". Name the source asked, say it answered, say what it does not cover, offer the nearest real thing. A deliberate boundary gets `actions-info-circle`, not an error colour.
- **Warning** — a degraded but usable answer: what was reached, what was read instead, what that leaves out, and the command that fixes it.
- **Error** — no answer, plus the command or environment variable that would change that.
- **Success** — only when the *source* matters ("answered from bundled knowledge · 12.4, 13.4"). Never praise, never a "done" toast.

## Icons

`packages/frontend/assets/icons/`, every `actions-*` icon from `TYPO3/TYPO3.Icons`. The identifiers are the core's own — the same strings `typo3_icon_lookup` returns — so design and runtime name the same thing.

**Where they come from.** The set is generated, never committed: `scripts/icons.ts` copies the identifiers it declares out of the `@typo3/icons` npm package (`^5.0.3`, MIT), which the container installs and its entrypoint materialises. An empty `packages/frontend/assets/icons/` means the generator has not run — it is not a missing file to work around.

**How to get one outside `actions`.** `packages/frontend/assets/icons.json` names every icon `@typo3/icons` has, shipped here or not — an identifier's category and the path to its file, so nothing has to be guessed from the spelling. The set that is actually here is listed in `packages/frontend/assets/icons/icons.json` beside it, and only that one's paths resolve. The categories are `actions`, `apps`, `avatar`, `content`, `default`, `files`, `form`, `information`, `install`, `mimetypes`, `miscellaneous`, `module`, `overlay`, `spinner` and `status`; that file maps every identifier to its category and every deprecated alias to its current name. Resolve an alias before using it; the old spelling is not what `typo3_icon_lookup` returns.

Reach a single file without the package from either of these, both raw SVG:

```
https://raw.githubusercontent.com/TYPO3/TYPO3.Icons/main/src/<category>/<identifier>.svg
https://cdn.jsdelivr.net/npm/@typo3/icons@5.0.3/src/<category>/<identifier>.svg
```

The first is the upstream tip, the second is pinned to the version this system ships. The whole set is browsable at <https://typo3.github.io/TYPO3.Icons/>.

To *ship* a category, add it to `CATEGORIES` in `scripts/icons.ts` and run `make icons`. It arrives whole, in the package's own layout — `svgs/<category>/`, `sprites/<category>.svg`, and a manifest whose relative paths resolve against it. Never drop a file into the generated directory by hand, and never edit one there.

**Missing icons are contributed upstream, never drawn locally and never substituted from another set.** The script fails on an identifier the package does not have, rather than falling back to anything.

16 × 16 viewBox, filled paths, `fill="currentColor"`. Neutral standalone icons use `--text-secondary`; `--accent` marks an active item and status colours belong only to status icons. Sizes 16, 20, 24 or a whole multiple — never 18 or 22. Icon before its label with an 8px gap, except direction icons, which follow. These state icons may stand without visible text: `actions-check-circle` (answered), `actions-exclamation-triangle` (version-bound), `actions-exclamation-circle` (installation not bootable), `actions-info-circle` (a stated boundary). Give a standalone `sds-icon` a `label`; every other icon sits beside visible text.

Inline the SVG wherever colour must follow the UI — an `<img>` cannot inherit `currentColor`.

## Illustrations

Illustrations support a tool or article without explaining it. They are not
small diagrams: no position, connection, count or label in one may carry a
claim. If the picture has to be understood for the adjacent copy to work, use
a diagram instead.

The shipped set under `packages/frontend/assets/placeholders/` is mode-neutral: one 1200 × 750
PNG is used unchanged in light and dark. Each image has one person, object or
still-life gesture, five to eight broad hard-edged silhouettes, a flattened
almost orthographic view, one contained halftone field and exactly one small
orange detail. Use overlap and at most two flat tones per object; realistic
materials, highlights and cast shadows do not belong to the language. A pale
ground wash inside the raster never licenses CSS elevation or another
interface gradient; the linked card's lit frame remains the only one.

Use `guidelines/illustration-prompt.md` verbatim to extend the set. The subject
is the only prompt field that changes. These images are decorative support, so
use an empty `alt` where the adjacent heading and summary already name the
subject.

## Diagrams

**One claim per diagram.** The title states it, the closing line states its consequence. Two claims are two diagrams.

**If the drawing would still work as a bulleted list, it is not a diagram.** Meaning is carried by position, length or alignment. Boxes and arrows are the last resort, not the starting vocabulary — see `packages/frontend/assets/diagrams/` for how three different shapes of claim were solved (an axis, a sequence, a containment).

Solid means there; a dashed outline of the same shape means missing or not yet reachable — so a shortfall has a size, not a sentence. Where the missing part is a degradation rather than a precondition, the dashed outline carries `--status-warn`.

Orange marks the one thing the diagram is about — exactly one element per drawing. When the drawing is about degradation or failure, status colour replaces the accent and orange stays out entirely.

### Drawing one — the numbers

Enough to produce a new diagram that sits in the set without adjustment. Every value below is what the shipped drawings actually use; deviating is a decision to name, not a default.

| | |
| --- | --- |
| Canvas | `viewBox="0 0 1200 H"` — always 1200 wide, height to fit. A plain `<rect width="1200" height="H">` at `--surface-canvas`, **no radius**. |
| Margin | 60 units on every side. Nothing enters it, including dashed outlines and labels. |
| Type | Source Sans 3; every identifier, path and flag in Source Code Pro. Title 36 · lead 17 · node title 16 · node body 14 · label, axis and caption 13. **13 is the floor** — a drawing that needs smaller type is carrying too much. |
| Stroke | 1 for a node outline, 1.5 for a connector or a boundary, 2 for the one accented connector. Nothing heavier. |
| Radius | 6 for a node or a boundary, 4 for a bar, 2 for a unit square. Radius follows the element's own size and never exceeds 6. |
| Node | `--surface-raised`, 1px `--border-subtle`, 6px. Peers are identical — told apart by their names, never by hue. |
| Boundary | Hairline only, **no fill**. Containment is drawn by the line; a filled container makes depth out of colour, which this system does not do. |
| Connector | 1.5px, orthogonal, one arrowhead, `--text-muted`. No curves. Dashed means optional or not yet, nothing else. |
| Accent | Exactly one element per drawing carries `--accent`: the thing the diagram is **about** — often a connector rather than a box, since the claim is usually a relation. If the drawing is about degradation, `--status-warn` replaces it and orange stays out entirely. |
| Actor | The one node the drawing is centred on may be inverted — `--text-primary` fill, no border, its title at 18. This marks *who acts*, and is not the accent, which marks *what is claimed*. At most one per drawing, and only where there is an actor at all: a chart has none. |

**Where it is placed.** On `--surface-sunken`. The drawing brings its own canvas, and that is what makes it read as a figure with clear space — put it on `--surface-canvas` and it dissolves into the page with no boundary at all.

**Colour is written as attributes**, never a `<style>` block — GitHub strips those. Each attribute is the token with the light hex behind it: `fill="var(--text-primary, #1C1A17)"` (ink), `--text-secondary, #4A453D`, `--text-muted, #726C63`, `--surface-canvas, #FBFAF7`, `--surface-raised, #FFFFFF`, `--border-subtle, #E3DFD6`, `--border-strong, #C9C3B7`, `--status-warn, #986200`, `--accent, #FF8700`.

**Ship one file per drawing**, with a viewBox on the root and every colour written as a `var()` with a hex behind it. A page shows it as `<img>`, so what a reader sees is the hex — the same picture in light and in dark, on the one ground drawn for it. The tokens are for the day a page can reach into the file; `docs/design-system/artwork.rst` says what has to ship first.

`sds-figure` shows it in a frame with a claim under it, `sds-image` is the same picture without the caption — a mark in a bar, an illustration on a screen. Neither asks what is in the file: **every picture is linked**, because the alternative draws *nothing* where the file was never prepared or the browser has not shipped SVG 2's fragmentless reference, and a hole is not a failure a reader can see.

**A drawing of your own is written the same way.** A viewBox on the root, every colour as a `var()` with a hex behind it, never a `<style>` block and never a colour on the root — the two that would defeat the tokens the day they are reached, and that make the file the author's grey forever. A comment may not contain a double dash either: that is malformed XML, and the file then draws nothing anywhere, as an image and as a favicon alike. `docs/design-system/artwork.rst` is the whole rule; a signet a documentation project configures follows it.

**Specimen cards are the one exception.** They are opened from disk with no server, and the card generator puts the drawing's shapes into the card itself — which is why a specimen shows the drawing in both modes while a page shows one picture in both. `scripts/diagrams.ts` reads the shapes out from under `<g id="soul-ref">`, which is that generator's handle and not a page's.

## Brand

**The signet is a construction, not a fixed drawing.** What this system fixes is *how* one is built; the mark in `packages/frontend/assets/` is one worked example of the rules, carried over from the Dev Companion prototype. Treat it as the reference implementation, not as an approved product mark — a product that adopts this system draws its own to the same rules.

**How to draw one.** Everything follows the stroke: stroke 7 → rounding 3.5 (half the stroke, on frame caps, line ends and the marker's points alike) → gap ≥ 7 measured ink to ink. A 128 × 100 box, corner radius 20 shared by frame and marker. The frame is one open path — both ends are caps, not cuts — and it stops gap + stroke short, because each cap reaches half a stroke further. The marker sits on the frame's **outer** edge, not on the box.

**Three optical sizes, redrawn, never scaled.** The weights are the system's, whatever the drawing: 32px and up takes stroke 7 and three lines, 20–31px stroke 8.5 with the middle line dropped, 16–19px stroke 11. Shipped as `packages/frontend/assets/<product>-signet-l.svg`, `-m.svg`, `-s.svg`; pick the file at the link, because a media query inside an SVG only sees its own viewport: `<link rel="icon" sizes="16x16" href="dev-companion-signet-s.svg">`. The 16–19px file is square-boxed, since a 5:4 mark letterboxed into a favicon slot lands under the 16px floor.

**Drawing a new signet is a defined job, not an invention.** Three marks ship as worked examples — `design-system-`, `dev-companion-` and `tryout-signet-*.svg` — and `guidelines/signet-prompt.md` is the construction written as something to act on: hand it a product name and it produces a mark that belongs to the family. Do not draw one freehand from the cards.

**What the example mark means, if you keep it.** A terminal frame holding a short session: two muted lines and one orange answer, top-right corner cut away by a solid orange marker. The marker is not the Soul; it borrows the Soul's two-part reading, its orange and its 1 : 1.44 proportion, and none of its geometry.

**Wordmark** — `TYPO3` at 600, an orange pipe, `Soul Design System` at 300. The pipe is separator and caret at once, and the only colour in the mark. Signet is 1.36 × the type size, gap 0.5 ×, clear space half the signet height.

**Never** — a second colour in the mark, equal weights on the two words, stretching, an orange fill behind it, the large drawing at a small size, the marker in anything but orange.

## Layout

210px tool rail, 1080px content, 48px gutters. Section boundaries are full-bleed hairlines; content inside respects the measure. **1px grid gaps over a `--border-subtle` background** produce the hairline-separated card grid — the system's signature move.

The header is sticky, translucent canvas with an 8px backdrop blur; nothing else in the system is fixed, transparent or blurred. **It never wraps** — it sheds in a fixed order, widest first: 1120px mode-switch labels, 1040px transport line, 820px navigation into a panel, 620px `Soul Design System` off the wordmark. A header that wraps to two lines breaks the sticky offset everything below is measured against.

Every surface carries the mode switch: two segments, `light` and `dark`, the active one filled with the accent — the same treatment as an active navigation item, because it is one.

**A page is built out of the page layouts, not out of a shell of your own.** `sds-app` on the body, an `sds-skip` link before anything else — the page's `<main>` carries `id="main-content"` and that link is the only way past the bar and the rail on a keyboard — `sds-shell` around everything, `sds-bar` for the header, and then one of the two bodies: a column beside a rail (`sds-body`, `sds-body__rail`, `sds-column`) for anything that is read in sequence, or a run of full-bleed bands (`sds-bands`, `sds-band`) for a page somebody arrives on. The screens under `specimens/screens/` are those layouts already assembled — start from the nearest one. A renderer, a theme or a template set is bound by this the same way a hand-written page is: it writes no class the stylesheets do not define, and a name it needs and cannot find is a gap in the system, to be closed there.

## Where things are

| Need | File |
| --- | --- |
| Everything, one import | `styles.css` |
| Token values | `tokens/colors.css`, `fonts.css`, `typography.css`, `spacing.css`, `radius.css`, `motion.css` |
| Colour, type, spacing, brand specimens | `guidelines/*.card.html` |
| Focus, loading, empty, error | `guidelines/states-*.card.html` |
| Icon set and usage | `guidelines/icons-*.card.html`, `packages/frontend/assets/icons/` |
| Illustration rules, prompt and examples | `guidelines/illustration-prompt.md`, `packages/frontend/assets/placeholders/` |
| Diagram rules and the worked examples | `guidelines/diagrams-*.card.html`, `packages/frontend/assets/diagrams/` |
| Buttons, fields | `components/core/` |
| Tabs, tool rail | `components/navigation/` |
| Table, badges, density | `components/data/` |
| Card, panel, modal | `components/surfaces/` |
| Code block, diff | `components/code/` |
| A whole page to start from, the documentation surface among them | `screens/` |
| The reasoning behind a design rule | `docs/design-system/` |
| The reasoning behind an interface rule | `docs/frontend/` |

## Before you call it done

- Both modes checked — not by trusting the tokens, but by looking. Anything inlined rather than linked (`currentColor`, a forced `data-theme` subtree) is where they drift.
- No shadow, no second accent, no emoji added; no gradient other than a card's lit frame.
- Every machine-named string in mono, verbatim.
- Every state that can occur has copy that names its source and its boundary.
- Header sheds rather than wraps at 1120, 1040, 820 and 620.
- Nothing reachable by pointer only; `:focus-visible` rings present.
- Nothing new that is only in `packages/frontend/src/`: a component is shown in a story, its classes are drawn somewhere, and it appears in a page the Guides renderer produced. `make coverage`.
- No class invented outside the stylesheets — not in a template, not in a theme, not in a page.
