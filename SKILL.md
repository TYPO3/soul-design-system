---
name: soul-design-system
description: Build any surface to the Soul Design System — documentation pages, product UI, README diagrams, release notes, and a review or report that goes out as one file, a claude.ai Artifact among them. Load this before you write markup, CSS or SVG.
---

# Soul Design System — build rules

Soul serves the extensions, tools, services and documentation sites the TYPO3
community builds around the CMS. Product pages, guides and application UI are
in scope. The TYPO3 backend, typo3.org and the other official TYPO3 surfaces
are not: those products have their own owners and design rules.

This file is the operating instruction. The pages under `docs/design-system/`
and `docs/frontend/` carry the reasons. Read them before you extend or break
a rule. Every specimen card is a working HTML file. Open the one nearest your
task and copy from it.

## Web components first

The `sds-` custom elements are the interface. Write
`<sds-code code-lang="bash">`, not a `<div class="sds-code">` of your own. It
is `code-lang` and never `lang`, which names the *human* language of
everything under it. The classes exist because the elements emit them and
because a surface with no JavaScript needs something. They are the fallback,
not the front door.

- **A component that almost fits is a component with a gap.** Do not close it
  in your own stylesheet. Close it in the component.
- **Everything the classes can do, the element must emit.** A modifier that
  exists only in `components.css` sends a consumer back to hand-written
  markup.

### Address a component, never rebuild one

Everything about a thing that fits in a string is a property. Between the tags
goes only what an attribute cannot carry: prose, a code block, a section of a
document. That is content, never structure.

**A `sds-x__y` class belongs to `sds-x` and to nothing else.** Written
elsewhere, it makes the element's internal names public API. The component
then cannot move a row or rename a part without every such surface. `make
coverage` fails on a part written outside its component.

An addressed element draws nothing until it upgrades. So `make guides`
renders every element in Node before the deploy (`scripts/lib/prerender.ts`).
The markup is on the page for a reader with no script, and the element
upgrades over its own rendering. Two things follow for a component:

- **It must render in Node.** `make verify ARGS=ssr` is that rule. Nothing
  reaches for `document`, `navigator` or `customElements` while it renders.
- **Content arrives two ways.** In a browser the element lifts its children.
  In Node there are none, so the same content arrives as the `content`
  property. `this.taken ?? this.content` is the shape, and `SdsElement` says
  why. A decision a component makes from its children must also be a property,
  or a prerendered page decides differently.

## Comments

Write the reason, not the story. A comment says why the code is the way it
is: a constraint, a trade, a failure it prevents. What a reader sees in the
line below is noise.

- **Never name another project.** No repository, no product, no consumer.
  This system serves things it does not know about. Say what the code needs.
- **No changelog.** Not what it used to be, not who asked, not when. Git holds
  that. A note about a past failure belongs only where the failure can
  repeat, and then in one sentence.
- **Five lines, ten at the top of a file.** The budget counts the `/*` and
  the `*/`. A reason that needs fifteen lines is a decision about the system
  and belongs in the published documentation.

## Start here, every time

1. Link `styles.css`. It imports every token file. Never redeclare a token
   value locally.
2. Set nothing about colour by hand. Every semantic token is one
   `light-dark(light, dark)` against `color-scheme: light dark` on `:root`.
   There is no second block, so light and dark cannot drift.
3. Never use `--orange-*` in a design. It is the raw scale. Use `--accent`.
4. Copy the nearest specimen card. Name the reason if you deviate from one.

To force a mode on a subtree, set `data-theme="light"` or
`data-theme="dark"`. Set it on `<html>` for a whole page. Deeper, the
browser's own chrome stays in the other mode.

## Non-negotiable

A break in one of these breaks the system, not the page.

- **One accent.** `--accent` (#FF8700) marks three things. The active
  navigation item, the shell prompt in a code block, the pipe in the wordmark.
  No second accent, anywhere. The accent is also the one colour that can
  *light* a surface. That is `--accent-glow` in the top of a card's frame
  under the pointer. **The system has two gradients, and both have names.**
  That lit frame, and the hatch a running `sds-progress` draws inside its
  own fill. Nothing else is a gradient.
- **A shadow means a surface has left the page.** Write the job, never the
  distance: `--shadow-basic`, `--shadow-strong`, `--shadow-tooltip`,
  `--shadow-flyout`, `--shadow-dialog`, `--shadow-window`. `--shadow-2…64` is
  the raw scale and appears in no design. Nothing that stays *on* the page
  takes one. A card, a band and a table separate with a hairline plus
  `--surface-overlay`. The focus ring is a state, not depth.
- **No emoji.** Status is a colour plus a glyph from
  `packages/frontend/assets/icons/` or the mono font (`✓`).
- **Mono is semantic.** Everything the machine reads, writes or names is
  Source Code Pro, at every size. Tool names, arguments, paths, versions, CLI
  fragments. Never title-case or prettify them: `make verify`, `guides.xml`.
- **16px is the floor** for the signet and the icons. Below it: the wordmark
  alone, and no icon.
- **The TYPO3 Soul is not in use.** A footer says what the product is, never
  whose it is. The system's *name* is Soul. The Association's *asset* is the
  TYPO3 Soul. The name never takes `TYPO3` in front of it.
- **Interaction never changes size.** A linked card alone can lift 2px, take
  the raised fill and light its top frame. Keyboard focus gets the same
  answer. A flush wall and reduced motion hold it still. Nothing scales or
  bounces. A transition is 140ms `--ease-out`.
- **Sentence case headings.** No marketing superlatives: no "powerful",
  "seamless", "blazing fast".

## Choosing

**Radius, by role.**

| Role | Value | Applies to |
| --- | --- | --- |
| Structural | `0` | section rules, table lines, header underline, hairline grids |
| Control | `--radius-control` 4px | buttons, fields, selects, tabs, badges, **code blocks** |
| Container | `--radius-card` 6px | cards, panels, modals |

A container must not share its corner with its contents. That is why the card
is one step larger.

**Table density.** A density is room, not type. Every row is in the small
register, and the air around it changes. Compact when the list *is* the work:
the full tool table, label lists, changelogs. Airy when a reader reads the
rows: three worked tools, reference beside prose. Medium if one density must
serve both.

Never zebra stripes. The background changes only on hover or selection, so a
highlighted row means something.

**Status colour** (`--status-ok`, `--status-warn`, `--status-error`) appears
only inside code output, badges, result rows and status diagrams. Never as
page furniture. One exception, and it is the whole of it. A press with no
undo takes `--status-error` as ink and a hairline, never as a fill, and its
label names what goes.

**A card is a hairline and 6px, no fill.** A panel is a raised fill. Sunken
is machine output.

**The step above a thing says what it is.** A reading column runs on one gap,
`--space-4` between anything and anything. A heading buys its own air on top:
40px above a second level, 32px above a third, 24px above a fourth. That
decreasing air is the hierarchy. By the fourth level only the air still
changes.

**The step below a thing is the element's own.** A paragraph, a list and a
heading carry `--space-4` under them, less as a heading deepens. So blocks in
a component's box stand apart without that box being a document. A container
that states its own step takes those margins back: `.sds-column`,
`.sds-stack`, a card's body, a specimen's stack. A box of your own either lets
authored blocks keep their margin or joins that list. Never both.

**A titled block carries a pair, not two sizes.** A *block* with a heading
over its own text, a note, a surface, an empty state, a modal, an accordion,
is `--block-title-size` over `--block-body-size`. An *entry* whose title is a
destination, a card, a result, is `--entry-title-size` over the same body.
Never set one half from `--font-size-*` directly. That is how the pair
escapes the register that owns it.

## Writing

Every text follows ASD-STE100 and the terse rule. `docs/design-system/writing.rst`
is the rule, `make verify ARGS=prose` is the check. The page holds the
limits, the voice and the words; nothing here repeats them.

## States

An answer always carries its source, its version binding and what it leaves
out. The UI states carry exactly that.

- **Focus.** An outline `--border-emphasis` wide in `--accent` at
  `--focus-offset`, plus a `--focus-halo` of `--accent-ring`. Never a number
  of your own. Always `:focus-visible`, never `:focus`.
- **Pointer and press.** Hover changes colour, border or fill, never a size.
  A press takes the same three a step further. `--accent-active` under a
  filled control, the sunken plane under one with no fill at rest.
- **Loading.** Nothing under 200ms. Over 2s the label says *why*: "booting
  the installation", "searching docs.typo3.org". A skeleton only where the
  shape is certain; `<sds-table loading>` draws its own. Work that reports
  its distance is `sds-progress`. The share is a length, the position a
  number, and the ink arrives at `--status-ok` as the run does. `pulsing`
  draws a hatch through the fill: work happens right now, which tells a slow
  run from a stalled one. Work that reports nothing is a spinner, which
  claims no distance.
- **Empty / not found.** Never "no results". Name the source, say it
  answered, say what it does not cover, offer the nearest real thing. A
  deliberate boundary gets `actions-info-circle`, not an error colour.
- **Warning.** A degraded but usable answer. What the tool reached, what it
  read instead, what that leaves out, and the command that fixes it.
- **Error.** No answer, plus the command or environment variable that changes
  that.
- **Success.** Only when the *source* matters ("answered from bundled
  knowledge · 12.4, 13.4"). Never praise, never a "done" toast.

## Icons

`packages/frontend/assets/icons/` holds every `actions-*` icon from
`TYPO3/TYPO3.Icons`. The identifiers are the core's own, the strings
`typo3_icon_lookup` returns, so design and runtime name the same thing.

**Where they come from.** `scripts/icons.ts` copies the categories it
declares out of the `@typo3/icons` npm package (`^5.0.3`, MIT), and `make
icons` writes them into the tree. Git keeps them because the package
publishes them and a mirror replays what git has. A file missing under
`packages/frontend/assets/icons/` means `make icons` did not run after a
change to `CATEGORIES`.

**An icon outside `actions`.** `packages/frontend/assets/icons/icons.json`
lists what is here. For an icon that is not here yet, read the upstream
manifest: `node_modules/@typo3/icons/dist/icons.json` in the container, or
<https://typo3.github.io/TYPO3.Icons/>. It names an identifier's category
and maps every deprecated alias to its current name. Resolve an alias before
you use it. Nothing from it goes into this tree: a second list goes stale.

One file without the package, both raw SVG:

```
https://raw.githubusercontent.com/TYPO3/TYPO3.Icons/main/src/<category>/<identifier>.svg
https://cdn.jsdelivr.net/npm/@typo3/icons@5.0.3/src/<category>/<identifier>.svg
```

The first is the upstream tip, the second the version this system ships.

To *ship* a category, add it to `CATEGORIES` in `scripts/icons.ts` and run
`make icons`. It arrives whole, in the package's own layout. Never put a file
into the generated directory by hand, and never edit one there.

**A missing icon goes upstream.** Never draw one locally, never take one from
another set. The script fails on an identifier the package does not have.

16 × 16 viewBox, filled paths, `fill="currentColor"`. A neutral standalone
icon uses `--text-secondary`. `--accent` marks an active item, and status
colours belong to status icons only. Sizes 16, 20, 24 or a whole multiple,
never 18 or 22. Icon before its label with an 8px gap; a direction icon
follows.

These state icons can stand without visible text: `actions-check-circle`
(answered), `actions-exclamation-triangle` (version-bound),
`actions-exclamation-circle` (installation not bootable),
`actions-info-circle` (a stated boundary). Give a standalone `sds-icon` a
`label`. Every other icon sits beside visible text.

Inline the SVG wherever colour must follow the UI. An `<img>` cannot inherit
`currentColor`.

## Illustrations

An illustration supports a tool or an article without an explanation. It is
not a small diagram: no position, connection, count or label in one carries a
claim. If the reader must understand the picture for the copy to work, use a
diagram.

The shipped set under `packages/frontend/assets/placeholders/` is
mode-neutral: one 1200 × 750 PNG in light and in dark. Each image has one
person, object or still-life gesture, and five to eight broad hard-edged
silhouettes. The view is flat and almost orthographic, with one contained
halftone field and exactly one small orange detail. Use overlap and at most two flat tones
per object. Realistic materials, highlights and cast shadows are not in the
language. A pale ground wash inside the raster never licenses CSS elevation
or a third gradient.

Use `guidelines/illustration-prompt.md` verbatim to extend the set. The
subject is the only prompt field that changes. Use an empty `alt` where the
heading and summary beside it already name the subject.

## Diagrams

**One claim per diagram.** The title states it, the closing line states its
consequence. Two claims are two diagrams.

**If the drawing still works as a bulleted list, it is not a diagram.**
Position, length or alignment carries the meaning. Boxes and arrows are the
last resort. `packages/frontend/assets/diagrams/` shows three shapes of
claim: an axis, a sequence, a containment.

Solid means there. A dashed outline of the same shape means absent or not
yet reachable, so a shortfall has a size. Where the missing part is a
degradation rather than a precondition, the dashed outline takes
`--status-warn`.

Orange marks the one thing the diagram is about, exactly one element per
drawing. When the drawing is about degradation or failure, status colour
replaces the accent and orange stays out.

### Drawing one — the numbers

Every value below is what the shipped drawings use. A deviation is a decision
to name.

| | |
| --- | --- |
| Canvas | `viewBox="0 0 1200 H"`, always 1200 wide. A plain `<rect width="1200" height="H">` at `--surface-canvas`, **no radius**. |
| Margin | 60 units on every side. Nothing enters it, dashed outlines and labels included. |
| Type | Source Sans 3; every identifier, path and flag in Source Code Pro. Title 36 · lead 17 · node title 16 · node body 14 · label, axis and caption 13. **13 is the floor.** |
| Stroke | 1 for a node outline, 1.5 for a connector or a boundary, 2 for the one accented connector. Nothing heavier. |
| Radius | 6 for a node or a boundary, 4 for a bar, 2 for a unit square. Never over 6. |
| Node | `--surface-raised`, 1px `--border-subtle`, 6px. Peers are identical: names tell them apart, never hue. |
| Boundary | Hairline only, **no fill**. A filled container makes depth out of colour. |
| Connector | 1.5px, orthogonal, one arrowhead, `--text-muted`. No curves. Dashed means optional or not yet, nothing else. |
| Accent | Exactly one element per drawing carries `--accent`: the thing the diagram is **about**, often a connector. For degradation, `--status-warn` replaces it. |
| Actor | The one node the drawing centres on can invert: `--text-primary` fill, no border, its title at 18. It marks *who acts*; the accent marks *the claim*. At most one, and only where there is an actor. |

**Where it stands.** On `--surface-sunken`. The drawing brings its own canvas,
which makes it read as a figure with clear space. On `--surface-canvas` it
dissolves into the page.

**Colour is an attribute**, never a `<style>` block, which GitHub strips. Each
attribute is the token with the light hex behind it:
`fill="var(--text-primary, #1C1A17)"` (ink), `--text-secondary, #4A453D`,
`--text-muted, #726C63`, `--surface-canvas, #FBFAF7`,
`--surface-raised, #FFFFFF`, `--border-subtle, #E3DFD6`,
`--border-strong, #C9C3B7`, `--status-warn, #986200`, `--accent, #FF8700`.

**Ship one file per drawing**, a viewBox on the root and every colour as a
`var()` with a hex behind it. A page shows it as `<img>`, so a reader sees the
hex: the same picture in light and in dark. The tokens are for the day a page
can reach into the file. `docs/design-system/artwork.rst` says what ships
first.

`sds-figure` shows it in a frame with a claim under it. `sds-image` is the
same picture without the caption. **Every picture is a link.** An unprepared
file or a browser without SVG 2's fragmentless reference draws *nothing*, and
a hole is not a failure a reader can see.

**A drawing of your own follows the same rule.** A viewBox on the root, and
every colour as a `var()` with a hex behind it. Never a `<style>` block and
never a colour on the root. A comment must not contain a double dash. That is
not valid XML, and the file then draws nothing, as an image and as a favicon.
`docs/design-system/artwork.rst` is the whole rule.

**Specimen cards are the one exception.** They open from disk with no server,
and the card generator puts the drawing's shapes into the card itself. So a
specimen shows the drawing in both modes while a page shows one picture.
`scripts/diagrams.ts` reads the shapes from under `<g id="soul-ref">`.

## Brand

**The signet is a construction, not a fixed drawing.** The system fixes *how*
to build one. The mark in `packages/frontend/assets/` is one worked example.
A product that adopts this system draws its own to the same rules.

**How to draw one.** Everything follows the stroke: stroke 7 → rounding 3.5
(half the stroke, on frame caps, line ends and the marker's points) → gap ≥ 7
ink to ink. A 128 × 100 box, corner radius 20 for frame and marker. The frame
is one open path, both ends caps, and it stops gap + stroke short. The marker
sits on the frame's **outer** edge, not on the box.

**Three optical sizes, redrawn, never scaled.** 32px and up takes stroke 7
and three lines; 20–31px stroke 8.5 with the middle line dropped; 16–19px
stroke 11. Shipped as `packages/frontend/assets/<product>-signet-l.svg`,
`-m.svg`, `-s.svg`. Pick the file at the link, because a media query inside
an SVG only sees its own viewport:
`<link rel="icon" sizes="16x16" href="dev-companion-signet-s.svg">`. The
16–19px file is square, since a 5:4 mark in a favicon slot lands under the
16px floor.

**A new signet is a defined job.** Three marks ship as worked examples:
`design-system-`, `dev-companion-` and `tryout-signet-*.svg`.
`guidelines/signet-prompt.md` is the construction as an instruction: give it
a product name and it produces a mark of the family. Do not draw one freehand
from the cards.

**What the example mark means.** A terminal frame holds a short session: two
muted lines and one orange answer, the top-right corner cut away by a solid
orange marker. The marker is not the Soul. It borrows the Soul's two-part
reading, its orange and its 1 : 1.44 proportion, and none of its geometry.

**Wordmark.** `TYPO3` at 600, an orange pipe, `Soul Design System` at 300.
The pipe is separator and caret at once, and the only colour in the mark. The
signet is 1.36 × the type size, the gap 0.5 ×, the clear space half the
signet height.

**Never:**

- a second colour in the mark;
- equal weights on the two words;
- a stretch;
- an orange fill behind it;
- the large drawing at a small size;
- the marker in anything but orange.

## Layout

210px tool rail, a 1200px page measure, 48px gutters. Section boundaries are
full-bleed hairlines; content inside keeps the measure. **1px grid gaps over
a `--border-subtle` background** produce the hairline-separated card grid,
the system's signature move.

The header is sticky, translucent canvas with an 8px backdrop blur. Nothing
else is sticky, transparent or blurry. **It never wraps.** It sheds in a fixed
order, widest first: 1120px mode-switch labels, 1040px transport line, 820px
navigation into a panel, 620px `Soul Design System` off the wordmark. A
header on two lines breaks the sticky offset everything below measures
against.

Every surface carries the mode switch: two segments, `light` and `dark`, the
active one filled with the accent, the same as an active navigation item.

**Build a page out of the page layouts, not a shell of your own.**
`sds-app` on the body, an `sds-skip` link before anything else, `sds-shell`
around everything, `sds-bar` for the header. The page's `<main>` carries
`id="main-content"`, and that link is the only way past the bar and the rail
on a keyboard.

Then one of two bodies. A column beside a rail (`sds-body`,
`sds-body__rail`, `sds-column`) for anything read in sequence. A run of
full-bleed bands (`sds-bands`, `sds-band`) for a page somebody arrives on.
The screens under `specimens/screens/` are those layouts assembled: start
from the nearest one.

A renderer, a theme or a template set writes no class the stylesheets do not
define. A name it needs and cannot find is a gap in the system, closed there.

## A page that is one file

A review, a report, a claude.ai Artifact: a page that goes out as one file,
under a host that admits nothing beside it. It links nothing. It carries the
system inside it, and the host's frame around it. The tokens, the two
families and the page layouts decide the palette, the type and the layout
before the first line. A design plan of the page's own is the deviation to
name.

1. **The `<title>` first**, then one `<style>` with `soul-inline.css` pasted
   whole. That is `soul.css` with the two families inside it and, at its
   end, the hand-back a host's own reset needs. Never a `<link>` to it: the
   host blocks the fetch, and the page arrives with no stylesheet. The title
   stands before the sheet because a host reads it out of the first bytes.
2. **Write the elements**, as on any page. `<body class="sds-app">`,
   `sds-shell`, `sds-body`, then `<main class="sds-body__main"
   id="main-content">` with the document in an `<article class="sds-prose">`.
   No bar, no rail, no footer and no `sds-theme`: the host draws the frame
   and owns the mode switch. The page follows `data-theme` on the root as
   every page does. `specimens/screens/review.html` is the page to start
   from.
3. **Prerender it.** `node <dist>/soul-finish.js <dir> --no-drop-in
   --no-search` renders every element in every `.html` under that directory,
   in place, icons inlined. The page then holds its markup before a script
   runs, and none runs.
4. **Link no script.** `soul.js` resolves its icon sprite against its own
   URL, and a `<use>` across origins draws nothing. So the page is what the
   prerender wrote. Write no `copy` on `sds-code`, because its button needs
   a script. `sds-accordion` folds anyway: it is a `<details>`.

`<dist>` is `packages/frontend/dist/` in this checkout,
`node_modules/@typo3/soul-frontend/dist/` in a project that installed the
package, or `https://cdn.jsdelivr.net/npm/@typo3/soul-frontend@<version>/dist/`
with `curl`. The three hold the same files.

Everything that fits in a string is an attribute, and a list is JSON in
one: `entries='[{"label":"Evidence","href":"#evidence"}]'`,
`body='[{"kind":"add","text":"…"}]'`. A table's rows stand between its tags
as `<thead>` and `<tbody>`. A drawing follows the rule above and goes into
`sds-figure` as a data URI, `src="data:image/svg+xml;base64,…"`, because
the host fetches nothing beside the page. It arrives in its exported
colours, as every picture does.

A review is a document, not a page of a site: no bar, no rail, nothing to
navigate. Its head is its own.

| The part of a review | The element |
| --- | --- |
| what kind of document, of what | `sds-eyebrow` over the `h1`, the lead in `.sds-lead` |
| the facts of the change: the number, the commit, the target, the votes | `sds-facts`, the pairs between its tags. The change and the issue as `sds-link`, a vote as `sds-badge`, a hash in `.sds-mono` |
| the summary | `<sds-surface plane="raised" heading="Summary">`, first: what the change does, then the recommendation with a link to each finding it rests on |
| the counts, as sentences | four `<sds-surface plane="plain" label="…">` in `<sds-grid variant="dense">`, one per weight, each a sentence with the number as its first word |
| the contents | `sds-nav-toc` with `entries` nested as the parts nest. In a `<div class="sds-aside">`, which rests beside the column where the page has the room |
| the findings | `<sds-register name="findings" prefix="F" todo-prefix="T">` with `.groups` from `FINDING_GROUPS`. One `sds-entry` per finding between its tags: `heading`, `group`, `origin`, `todo`, the evidence between the tags. The register numbers them, groups them, writes the overview and the work |
| a caveat beside the findings | `sds-note` with the tone it deserves |
| the change | `sds-diff` with its `path` |
| a finding at the code | `sds-code` with `source`, `start` and `remarks`. The sentences stand under the block, each with the line it cites; never a comment in the code's own voice |
| a trace, a command, a test | `sds-code` with `code-lang` and a `caption`. `start` where the text cites a line, and the numbers draw |
| the mechanism, the fault | `sds-figure` with a drawing under the diagram rule. One claim, the accent on the one thing it is about; status colour where it is about a fault |
| what stays out of the way | `sds-accordion`, one `question` per entry |

## Where things are

| Need | File |
| --- | --- |
| Everything, one import | `styles.css` |
| Everything, one file to paste | `packages/frontend/dist/soul-inline.css` |
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
| A whole page to start from | `screens/` |
| The reason behind a design rule | `docs/design-system/` |
| The reason behind an interface rule | `docs/frontend/` |

## Before you call it done

- Both modes, by eye. Anything inlined rather than linked (`currentColor`, a
  forced `data-theme` subtree) is where they drift.
- No shadow, no second accent, no emoji. No gradient other than a card's lit
  frame and a working bar's hatch.
- Every machine-named string in mono, verbatim.
- Every state that can occur has copy that names its source and its boundary.
- The header sheds rather than wraps at 1120, 1040, 820 and 620.
- Nothing reachable by pointer only. `:focus-visible` rings present.
- Nothing new that lives only in `packages/frontend/src/`. A component has a
  story, draws its classes somewhere, and appears in a Guides page. `make
  coverage`.
- No class invented outside the stylesheets: not in a template, a theme or a
  page.
- `make verify ARGS=prose` is green over every text you wrote.
- A page that is one file: the title first, the sheet pasted, every element
  prerendered, no script, no `spec-*`.
