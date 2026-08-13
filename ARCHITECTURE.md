# How this repo is built

The repository map now lives in the published maintainer documentation:
[`docs/maintaining/source-and-output.rst`](docs/maintaining/source-and-output.rst)
names the authoritative sources, the tasks that read them and the generated
artefacts they produce.

This file temporarily holds the architecture decisions that have not yet moved
beside the part of the system they govern. `SKILL.md` remains the operating
instruction for designing with the system, `RATIONALE.md` holds design reasons
not yet moved beside their rules, and `.design-sync/NOTES.md` covers the design
guide upload alone.

## Two layers sit outside the entry point, for one reason

`styles.css` imports the tokens and the component layer, and nothing else.
`document.css` and `_specimen.css` are linked separately by whoever needs them.

The reason is the same in both cases and it is worth stating once: **a
stylesheet that has an opinion about a bare element cannot be taken back.**
`document.css` styles `h1`–`h6`, `p`, `ul`, `dl`, `blockquote`, `table`, `code`
— what a renderer emits and never gives a class to. In a document that is the
whole point; in an application surface it is a system reaching past the classes
it was asked for and into markup it does not own. Someone building a settings
form gets a paragraph rhythm they never asked for and has to undo it.

So the document layer is scoped to `.sds-prose` *and* shipped as its own file.
The theme wraps the renderer's output in that class; the furniture around it —
bar, rail, footer — stays with the component layer, which is where it was
already drawn. `_specimen.css` is outside for the mirror-image reason: it draws
card chrome, and a design built with this system must never inherit it.

The document layer is not in `.out/bundle/`. That upload is for designing with
the system, and nobody sets a document in it — one flat root, unchanged.

**The step under a block is the one thing the component layer takes back from
it.** A `<p>` carries `--space-4` below itself, a heading less as it deepens, a
list the same as a paragraph — stated on the elements in `components.css`, not
in the layer scoped to `.sds-prose`. The line above still holds for everything
else: what stays in the document layer is the air *above* a heading, the tables,
the quotations and the names only a renderer writes. But the box authored blocks
land in is as often a component's as a document's — an answer folded behind a
question, a note, a modal — and none of those is `.sds-prose`. Before this, two
paragraphs inside one of them touched on every surface that links `styles.css`
alone, which is Storybook, the cards, and every product built on the system.

The price is that a container stating its own step has to take the element's
back, or the two stack: `.sds-column`, `.sds-stack` and the rest zero the
margins of what they hold, one rule near the elements it undoes. The blocks a
component draws — `.sds-code`, `.sds-note`, `.sds-figure`, `.sds-embed` — carry
the same step and are reached through the host they sit under, which is
`display: contents`. `tests/defaults.spec.ts` holds both halves.

## Two packages come out of this tree, and they leave through `packages/`

**Both leave the same way, and that is the point of the directory.** A package
under `packages/` is pushed to a repository of its own and published from
there; nothing else in the tree leaves. `packages/frontend/` is the npm
package — the tokens, the class layer, the elements, and the drop-in built from
them — and `packages/guides-theme/` is the Composer package.

The root is a private workspace: it holds the devDependencies, the tooling, the
specimens and the gate, and it is not a package anybody installs. That is what
the move bought — before it, the repository root *was* the npm package, so the
whole tree was something a consumer resolved paths into.

**Composer forced the question.** Packagist reads the `composer.json` at the root of a
repository, so a package in a subdirectory does not exist for it. Everything
under `packages/` is therefore pushed to a read-only repository of its own —
that is what the directory means, and the only thing it means.

**It is assembled per commit, not split out of the history.** `splitsh-lite`
reproduces a subdirectory's commits exactly, which is the one thing that cannot
work for the theme: its package has to contain a directory this tree does not
have in that place — the drop-in. So `scripts/split.ts` replays instead. Every
commit that touches a package is assembled and committed over there with the
author, date and message it had here, plus a `Split-From:` trailer that says
where the mirror stopped, so the next run continues rather than repeats. A tag
here becomes a tag there, on an empty commit where the package itself did not
change — a release has to exist before it can be tagged, and only a tag is what
Composer resolves.

**Neither door delivers a documentation build on its own, and the gap is what
a consumer feels.** The theme is PHP; the stylesheets are not, and neither is
the step that draws this system's elements before a browser sees them. A PHP
project cannot pull npm, so a Composer-only build renders documents that link
nothing and hold empty cards.

So the drop-in carries that step. `packages/frontend/dist/soul-finish.js` is
`scripts/lib/site.ts` bundled for Node — copy the drop-in, draw every element,
write the search index, refuse a reference that leaves the output — and it
arrives inside the theme package, because a PHP project cannot ask npm for a
stylesheet.

**This site is built as one of those projects.** `make guides` builds the
renderer with the three Composer commands the manual prints and takes the
templates and the drop-in out of the `vendor/` they produce — it imports none
of them from the tree. The publishing workflow does not call that task at all:
it runs those three commands itself, as a reader's own workflow does, and adds
only the two steps a reader has no use for — `make embed` for the specimen
cards these pages embed and `make chrome` for what they are drawn with. Both
read `specimens/` and generate nothing, which is why a runner with no npm
install can take them. The
renderer is built by the three Composer commands the manual prints —
`init`, `config repositories.soul`, `require` — with one thing named
differently on a desk: the repository is the package `scripts/lib/packages.ts`
assembles, where CI names the mirror the job before it pushed to. Both renders were compared over one commit and are
byte-identical, which is the only way a documented path stays true — it is the
path.

**The mirror needs one thing no file here can carry: a token.** The job pushes
into repositories this run does not belong to, and `GITHUB_TOKEN` is scoped to
the one it does — so `SPLIT_TOKEN` is a secret on this repository, a
fine-grained token with `Contents: write` on the two mirrors and no other
grant. Missing, the job stops on that sentence instead of pushing half a
release. It is the whole setup, and it is needed once:

```sh
gh secret set SPLIT_TOKEN
```

**What is still open is registration, not mechanism.** Neither name is claimed
on Packagist or npm yet. Until then the `composer.json` the manual prints names
the theme's mirror as a VCS repository and asks for `dev-main`, and the drop-in
arrives inside that package.
Nothing in CI installs it: what holds the documented path honest is that this
site is rendered along it, with the same file a reader runs.

## Decisions that were made on purpose

- **One type scale, bound by role.** `tokens/typography.css` holds every size.
  `tokens/controls.css` names the roles a component knows itself by — button,
  table head, tab, note title — and every one of them is a `--font-size-*`,
  never a literal. The two were separate while controls carried sizes of their
  own; by the time it was converged only buttons (14 → 15px) and table heads
  (10 → 11px) still sat off the editorial steps, and that was the whole cost.
  Controls still set tighter than prose — that part was never the problem.
- **A block's title and its body are one pair.** Two registers carry every
  titled block: `--block-*` for a note, surface, empty state, modal or
  accordion, `--entry-*` for the ones whose title is a destination — card,
  result. `document.css` rebinds both together. They were `--note-*`
  while only a note used them, and by the time most blocks did, a body could
  change register while the title over it stayed put; the distance between the
  two ran 0, 2 and 5 steps depending on which component you looked at, and the
  accordion's question sat a step *below* its own answer. The pair is the fix:
  a component picks a register, never a size.
- **A block is dense because it is scanned, not because it is a box.** The
  rebind fires in a `.sds-column` reading column as well as in `.sds-prose`,
  so a note or a card holding sentences on a product page reads at the page's
  size. `RATIONALE.md` defends the density contrast as the system's character
  and names what it is between — prose and *machine content* — so this applies
  that rule rather than bending it: code, compact rows and captions keep their
  density in the same paragraph. A surface joins by `:has(> .sds-surface-title)`
  because it renders a plane and has no root class of its own; it had been left
  out for that reason and read as a decision.
- **The space scale is halved below 16px.** `--space-0-5`, `-1-5`, `-2-5` and
  `-3-5` are not a loosening of the 4px grid but the part of it that was
  missing: the small end is where a glyph beside a word and a label over its
  value are read, and where the scale had no step the value got typed instead.
  `components.css` held a literal for nearly every integer from 1 to 16 —
  6px alone appeared fourteen times, and ten boxed blocks carried ten
  different paddings. Above 16 nothing has ever needed a half-step, and the
  scale does not gain one.
- **The reading column's rhythm is a gap plus what a heading buys.** A flex
  gap cannot be undercut, so the gap is the flow step and each heading adds
  its own margin above — 40, 32, 24 by level. It was one flat gap for
  everything, which is a column with no hierarchy in it at all.
- **`make rhythm` reads the steps out of the token files.** It renders a
  screen and measures it against them, so it holds no second copy of the scale
  and cannot drift from it. Listing the step *names* was tried first and was
  the same mistake one layer up: the list went stale the moment one was
  renamed, and the tool reported every 13px value as a defect. A whole-pixel size off the scale is a literal
  somebody typed; a fractional one is an optical `em`, the correction mono
  carries beside sans, which is a ratio of its context and can never land on
  a step. It says which, and fails only on the first. A drawing is reported
  apart: `SKILL.md` pins its own scale, down to a 13px floor.
- **No half-pixel font sizes.** House rule. 121 of them were rounded half-up
  across the cards; `--font-size-dense` went 13.5 → 13px to match the code
  blocks that already rendered at 13. Keep it that way — `make verify`
  does not catch a new one, so watch it in review.
- **Class prefix is `sds-`**, state is `.is-*`. `t3-` was avoided: the system's
  own rules forbid implying TYPO3 endorsement.
- **Fonts ship with the system** as variable woff2 (latin + latin-ext, SIL OFL
  1.1), generated from `@fontsource` — see the Re-sync risks entry for how. They
  replaced a Google Fonts `@import`; verified pixel-identical on 37/38 cards,
  the last being the loading card's spinner. Do not go back to the remote
  import: a design behind a strict content policy would silently fall back
  to system-ui.

## Fixes applied to the cards (were pre-existing defects)

- `Density` — the Tool column could not hold `typo3_changelog_lookup`; the
  name overlapped the Verb column. Fixed by dropping the fixed colgroup.
- `Surfaces` — the modal's footer buttons were cropped, and the three
  surfaces wrapped to two rows because padding sat outside their width.
  Fixed by a `box-sizing: border-box` rule scoped to `[class*="sds-"]`.
- **18 card viewports were wrong** (5 cropped their own content, 13 declared
  far more height than they used). All corrected. `make fit` measures this
  and is part of `make verify` — run it after any content edit.
- Two cards documented their own sizes in prose and went stale after the
  rounding (`DIFF 12.5 PX`, `--font-size-dense · 13.5`). If you change a size
  token, grep the card copy for the number.

## CSS-only was a decision — and it was revisited

For a long time this system shipped **no JavaScript components**, on purpose,
and that is recorded here because the reasoning still matters. The objection
was never "components are bad": it was that a React layer would be a second
source of truth for markup the product — plain PHP with an HTML surface —
cannot use. The offer was declined twice on exactly that ground.

**Web components dissolve that objection**, which is why the answer changed.
A custom element rendering light DOM emits the same `sds-` classes, and the
PHP product can use the classes with no JavaScript at all. There is no second
source of truth: `components.css` is still it.

What the system now ships, and what it costs:

- The Lit elements in `packages/frontend/src/`, bundled into `_ds_bundle.js` and published as
  ESM from `packages/frontend/dist/`. `_adherence.oxlintrc.json` should now come back with real
  entries instead of the empty `react/forbid-elements`,
  `no-restricted-imports` and `x-omelette.components` it used to — **check
  this on the next sync**, it is the first upload where that can be true.
- The specimen cards stay **static HTML with no custom elements in them**.
  The pane opens them with `styles.css` and no JavaScript, so a card
  containing `<sds-button>` would render nothing. `scripts/cards.ts` renders
  the same Lit templates to markup instead — see below.
- The token rules still bite mechanically either way: raw `#FF8700` or `14px`
  in a design is flagged, because tokens are in the config regardless.

## Cards are generated from stories

The cards under `components/` are **generated** — edit
`stories/*.stories.ts`, never the card. `make cards` writes them and
`make cards ARGS=--check` fails on a stale one, which is step 5 of verify.

The chain is: a component template in `packages/frontend/src/` → `@lit-labs/ssr` renders it to
static markup (`packages/frontend/src/lib/render.ts`) → the story composes the specimen out of
those strings → the generator wraps it in the `@dsCard` shell. The 31
guideline specimens under `guidelines/` are **not** generated: they document
the token layer, have no props to vary, and are embedded into the MDX docs
pages as they stand.

Two things that bit during the migration and will bite again:

- **`<pre>` is whitespace-significant.** `indent()` in
  `stories/lib/specimen.ts` skips the inside of one. Indenting a code block's
  body shifts every rendered line to the right — a visible change that reads
  as a formatting change.
- **Lit SSR emits markers.** `<!--lit-part-->` around bindings, and a `<?>`
  when a template's entire content is bindings. `packages/frontend/src/lib/render.ts` strips
  both and throws if a marker survives, because an HTML comment renders as
  nothing and would be invisible in review.

Each migration was verified by `make baseline` before and
`make shots && make diff` after: **38 identical, 0 changed** for the component
cards, **36 of 39** when the guideline cards followed. The three that moved
differ by under 0.1%: their glyphs come from the sprite rather than from a
pasted path. Numeric entities became the literal characters they encode
throughout.

The pixel diff is the check that made that migration safe, and it earned it:
a card carrying both modes inside it must pin neither on `<html>`.
Pinning one turned the ground under the diagram figures from paper to
terminal — a quarter of the card — and no other check in the repo would have
noticed.

## The rail is a section, and a section is found upwards

The bar picks a section and the rail is what is inside the one that was
picked, so every page has to answer which section it belongs to. The theme
answered it downwards: walk the top-level entries, and take the one whose own
link — or one of whose children's links — the renderer resolves to `#`, its
way of saying "the page you are on". That reaches exactly two levels. A page
three deep matched nothing, fell through to the branch meant for a project
with no sections at all, and got the list of sections back instead of the
pages around it. `sds-rail` then marked its first item, because a rail with no
`active` falls back to zero — so the reader was told they were on a page they
had never opened.

The rootline is the answer and it has no depth to run out of: the tree walked
upwards from the current document, which the renderer already computes and
hands the menu node. The section is the top-level entry that appears in it.
That is what the bar had always used, in `structure/navigation.html.twig`, and
the two now agree by construction rather than by coincidence at shallow
depths.

Which is also why the list moved out of the template into
`packages/guides-theme/src/Navigation/Rail.php`. A rail is one level of folding over a tree of
any depth — the section's children, each with everything below it — and
flattening a tree is recursion, which a Twig template cannot express without
becoming a program in the wrong language. It was a program in the wrong
language: eighty lines of index arithmetic that no check could see was wrong,
because the fixture it rendered against was flat. `acceptance/depth/` is that
gap closed — a section, a page inside it, a page with pages under it, and a
page three levels from the root.

Finding the section upwards left one case still answered by the old fallback:
a section that is a single page. Those have nothing under them, so they landed
on the branch meant for a project with no sections at all and got every other
section's tree, folded open — a sitemap belonging to no page the reader was on,
which changed shape the moment they followed one of its links. Such a page now
carries no rail, and the button in the bar that opens one goes with it.
`sds-header rail=` already drops the button where it finds no rail, but it
finds one by asking a document and the page is written before there is one, so
`structure/document.html.twig` renders the rail ahead of both and the body and
the bar read whether it came out empty. The root is not that case: its section
is the site, so its rail is the sections, under no heading and with nothing in
it marked.

What is left is the section's own page. The rail's heading is a heading and not
a link, so a section listing only its children left a reader standing on its
index as the one page missing from it, with nothing marked. It is the first
item now — where a folded group already puts the page it is named after, and
for the same reason.

## The pages are rendered before the browser gets them

`make guides` runs every element in the output through `@lit-labs/ssr` in Node
— `scripts/lib/prerender.ts` — and writes the markup back into the page inside
the element's own tag. It is the step that lets the theme *address* components
instead of rebuilding them, and it is worth stating why it had to exist.

An addressed element draws nothing until it upgrades. On a documentation site
that is a card whose title waits for a script, and for a reader with scripting
off it never arrives. So the theme wrote the components' markup itself — the
card's own parts, `sds-card__body` and the rest, which the elements then read
back to find their content. Every internal name became public API, neither side
could change alone, and the one surface built to stop a consumer hand-writing
this system's markup was hand-writing it.

Rendering earlier removes the reason without weakening the rule. The element is
the front door on both sides of the script: the page holds its markup for a
reader who runs none, and in a browser the element re-renders over its own
output.

Three things make it work, and each is load-bearing:

- **Every element renders in Node.** That was already a rule with a check
  behind it (`make verify ARGS=ssr`); this is what turned it into a
  dependency.
- **Content travels as a property.** SSR builds an element and calls
  `render()`; it never runs `connectedCallback` and there are no children on
  the instance, so what a caller wrote between the tags is handed over as
  `content` on `SdsElement`. Components read `this.taken ?? this.content`.
- **The rendering is marked.** What was written goes back into the page in an
  inert `<template data-sds-content>`, always — including when nothing was
  written. Without it an element cannot tell a caller's content from its own
  last rendering, and lifts the frame it drew to draw a second one around it.

What a component decides by looking at its children is the one thing that does
not survive the trip: a set of tabs cannot read labels off items it does not
have, a button cannot see that its label is a single glyph. Those became
properties — `items`, `icon-only` — which is the right answer anyway, since a
decision a component makes by inspection is one a caller cannot state.

## A component is shown three times, or it does not exist

Writing an element and a class for it is half the work. The other half is
putting it where it can be looked at, and there are three places, each
answering a question the other two cannot:

- **A story**, for every element in `TAGS`. It says what the component is and
  which variants it has, and it is the source the specimen card is generated
  from — an element with no story has no card either, so it is missing from
  the design pane as well as from Storybook.
- **A drawn class**, for every `sds-` name `components.css` defines. A name
  nothing renders is a name nobody can check; it drifts against the element
  that was supposed to emit it and nothing says so. A class counts as drawn
  when a story, a card, a documentation page *or the element that emits it*
  names it — a class written at runtime is looked at wherever its element is.
- **A page the Guides renderer produced.** The theme's fixture under
  `packages/guides-theme/acceptance/` is where a component meets markup it did not
  compose: real prose around it, a document layer under it, a renderer that
  knows nothing about this system. A specimen card is built for the component;
  a rendered document is not, which is why it finds different things.

The third one is also the rule for anything built *on* the system rather than
in it. **An implementation follows the page layouts**: it builds its page out
of the shell every screen under `specimens/screens/` shares — the frame, the
bar, and either the column beside a rail or the run of full-bleed bands — and
it writes no class the stylesheets do not define. A theme that invents a name
in the `sds-` namespace has written a component the system cannot see, cannot
render in a card and cannot keep true; `sds-confval` is the one that was there
when this was written.

`make coverage` is the check, and it is step 2b of the gate. It is the mirror
of step 2: that one catches a name used and not defined, this one a name
defined and never drawn.

**The pending lists shrink and never grow.** `PENDING` in `scripts/coverage.ts`
holds what the rule does not hold for yet — the elements without a story, the
classes with no specimen, and the elements the Guides render has no node for.
An entry that has become covered fails as loudly as one that is missing,
so the list cannot outlive the work: it is the work list, not an exemption
list. Adding to it is a decision, and it needs the same kind of reason the
entries there already carry.

## Contrast: fixed, not tolerated

`--text-muted` sat at ~3.3:1 on product text — table headers, `sds-td-meta`,
an inactive tab, a placeholder, and `--syntax-comment` shares its value, so
code comments too. Below WCAG AA's 4.5:1 for normal text, in both modes.
`--status-warn` was under it on the light canvas as well.

Changed, with a little headroom rather than the bare minimum:

| token | was | is | worst surface |
| --- | --- | --- | --- |
| `--text-muted` light | `#8A8378` | `#726C63` | 4.65:1 on sunken |
| `--text-muted` dark | `#6E6860` | `#878076` | 4.63:1 on raised |
| `--syntax-comment` | same two | same two | shares the muted value |
| `--status-warn` light | `#A56A00` | `#986200` | 4.60:1 on sunken |

Dark `--status-warn` was already at 8.04:1 and did not move. The hierarchy
against `--text-secondary` (8.50:1 light, 7.16:1 dark) is unchanged: muted is
still clearly quieter, just legible.

**The signets keep the old greys on purpose.** `packages/frontend/assets/*-signet-*.svg` carry
`#8A8378` behind their tokens — `var(--text-primary, #8A8378)`, so the grey is
what the file renders as where no token is declared and never what a page
shows. A brand mark is a drawing, not text — WCAG's text-contrast rule does
not apply to it, and moving it would change the mark for no accessibility
reason. So the signet grey and `--text-muted` no longer coincide; they were
never the same decision.

The three diagram pairs under `packages/frontend/assets/diagrams/` **were** updated: SKILL.md
documents their colours as a token swap, so leaving them would have made the
drawings drift from the tokens they claim to follow. The two colour cards
that print the hex values in prose were updated for the same reason — that is
exactly the "cards documented their own sizes and went stale" trap above.

35 of the 38 cards moved. All of it is the contrast change.

## The pixel diff was too lax to see any of that

`scripts/diff.ts` ran pixelmatch at `threshold: 0.1`, and at that setting
the `--text-muted` change — 2143 pixels on one card — reported **zero**.
A deliberate token change, invisible to the tool whose entire job is
catching deliberate changes. Every "38 identical" in this repo's history
should be read with that in mind.

It is `threshold: 0` now. That was affordable when everything rendered in the
container and two consecutive runs of all cards differed by zero pixels at
every threshold tested. If it ever turns noisy, raise it knowing the cost —
0.05 already missed a third of that colour change.

**It has turned noisy, and the run is no longer an answer on its own.** Two
consecutive runs with no change between them now report roughly a dozen cards
changed at 1–7% of pixels, and not the same dozen twice: a run during the RTL
refactor reported fourteen, and the same tree with the change stashed reported
twelve with half the names different. The guideline cards drift and the
generated component cards do not, which is where to start looking.

Until that is fixed, `make baseline` / `make diff` cannot answer "did anything
move" — a clean run means nothing and a dirty one has to be re-run to see
whether the same cards come back. For a change that is logical-property or
token renaming, map the new declarations back to the old ones and diff the
source instead; that is exact where the pixels currently are not. **Do not
read a `make diff` result as evidence without saying which of the two it is.**

## Measuring anything right after a theme switch races a transition

Switching `data-theme` changes every colour token at once, and several
components carry `transition: color var(--duration-fast)`. For 140ms the
whole page is mid-animation, and a colour read in that window belongs to
neither theme. It made one axe test fail on roughly one run in three.

`tests/lib/story.ts` injects a stylesheet killing transitions and animations
after every navigation. Anything else that measures colour — a future
screenshot step, a contrast script — needs the same guard.

## The a11y addon ships in the test build, and `a11y.manual` is a global

axe is one global object with one run at a time; a second caller gets a thrown
`Axe is already running` rather than a queue. The addon's panel runs axe on
story render and the Playwright suite runs it deliberately, so the two raced —
about one run in twenty, which is the worst frequency there is.

Two dead ends are recorded because both look like fixes:

- **`SDS_NO_A11Y_ADDON`** was set in `playwright.config.ts` and read by
  nothing. The addon shipped into every test build regardless. Removing the
  addon from the test build is also not the answer, and was rejected: the
  suite exists to prove the shipped surface, and a surface assembled
  differently for the test is not that surface.
- **`parameters.a11y.manual`** is not read by `@storybook/addon-a11y` v10.
  Its own `packages/frontend/dist/preview.d.ts` declares `initialGlobals: { a11y: { manual } }` —
  it is a **global**. Set in `parameters` it silently does nothing, which is
  why the setting appeared to be in place for months while the panel went on
  auto-running.

It is now in `initialGlobals` in `.storybook/preview.ts`. The addon is
installed, the panel still runs on demand, and nothing runs axe on load.
Verified over four consecutive full runs rather than one.

## The suite had never opened the Storybook shell

Every test but one opens `/iframe.html` — the preview. Nothing opened `/`,
the manager: sidebar, toolbar, docs chrome, the surface a person looks at.
That blind spot let a blank documentation site sit behind a fully green run.

`.storybook/manager.ts` passed a partial object as `theme`. Storybook runs
that through `ensure()`, polished calls `opacify` on a colour the partial
never set, and `PolishedError #3` takes down the entire manager bundle — an
empty page, not an error overlay. `theme` must be built by `create()` from
`storybook/theming/create`; a partial looks right and is not.

`tests/manager.spec.ts` now boots the shell, asserts the sidebar lists
stories, and fails on any page error. It was checked in both directions:
green with `create()`, red with the partial it was written for.

## Two findings worth fixing separately

- **`@dsCard` subtitles are not entity-decoded.** `scripts/lib/cards.ts`
  parses the header with a regex and never decodes, so `&#8220;` travelled
  verbatim into `Density.prompt.md` — which the design agent reads — and
  double-escaped anywhere it was rendered as text. The generated cards now
  write the literal
  character, which fixes it for the generated ones; **the guideline cards were
  not audited for this.** Grep `guidelines/*.card.html` for `&#` in a
  `@dsCard` line.
- **`sds-code` depends on a specimen class.** The code block's language label
  carries `spec-cap`, which is defined only in `_specimen.css` — deliberately
  outside the `styles.css` closure. A product surface using `sds-code` gets
  no styling for it. `make verify` cannot catch this: step 2 unions both
  stylesheets when deciding whether a class is defined. Reproduced as it was
  rather than quietly redesigned.

## The `sds-` prefix

Renamed from `tsa-` at the user's request, together with the JS namespace
(`T3SA` → `SDS`) and the package name. The rename touched 51 files and was
verified pixel-identical on all 38 cards — a class rename changes nothing
visually as long as stylesheet and markup move together.

It survived the second rename untouched. When the system became **Soul
Design System** the initials came out the same, so `sds-`, `SDS` and every
tag stayed exactly where they were; only prose, the package name
(`@typo3/soul-frontend`) and the wordmark moved. That is luck rather
than design, but it is worth recording why nothing had to move: a prefix
that spells the system's initials survives a rename only when the initials
do.

A prefix is kept on purpose, whatever its spelling. Designs mix this CSS with agent-written markup, and `.btn`,
`.card`, `.badge`, `.table` are the most collided-with names in CSS. The bug
is not hypothetical: before the refactor `.card` meant "20px of specimen
padding" in the cards and "a hairline and 6px, no fill" in the doctrine.
The prefix is also what lets `make verify` tell system classes from a
screen's own layout classes. Shortening it to `ds-` was offered; the length
was not worth a repo-wide rename.

## The signet is not an icon

Never put `.sds-icon` on a signet. It pins width and height to 16px, and CSS
beats the element's own `width`/`height` attributes — so all three optical
sizes render identically and `brand-signet-sizes` disproves its own point.
That happened: a bulk sed during the class refactor rewrote every inline
`<svg>` the same way, including 81 signets across the eight Brand cards. The
pixel diff flagged those cards and it was written off as font rounding.
Signets use `.sds-signet` / `.sds-signet--muted`, which set no size.

The three shipped files are one construction now, differing only in what the
optical size demands (stroke 7 / 8.5 / 11, marker 36×52 / 36×54 / 40×58,
three bars on L and two on M and S). Before that each mixed three colour
mechanisms in one file — an undefined `.ink` class, an undefined `.inkf`
class and a hardcoded hex, plus a leftover `class=""`. Since `.ink` and
`.inkf` were defined nowhere, the frame was invisible and the bars fell back
to black in any standalone use: as an `<img>`, and as the favicon they are
meant to be. The colour is on the shapes now, as the page's token with the
mid warm grey behind it, which is the one arrangement that survives being
referenced — see below.

`dev-companion-signet-s.svg` has a square viewBox (`-6 -20 140 140`) because it is the
favicon file: the mark is 5:4, and a 5:4 mark letterboxed into a square slot
lands under the system's own 16px floor. L and M keep the natural box.

## A drawing is referenced, a photograph is linked

There is no signet component. There was one, and it was the drawing pasted
into TypeScript: three optical sizes as string literals beside the three files
that already held them, kept in step by hand, and hard-wired to this system's
own mark — so the one element a consumer could not use was the one about their
own brand. What it bought was `currentColor` and `var(--accent)`, which an
`<img>` cannot inherit, and that turned out to be buyable another way.

`packages/frontend/src/lib/art.ts` decides, from the file name and nothing else: an SVG is
referenced with `<use href="file.svg#art">`, anything else is linked with
`<img>`. `sds-image` is that as an element, `sds-figure` is it with a caption,
and the Guides theme writes the same two shapes itself in `brand.html.twig`
and `figure.html.twig` — the theme cannot depend on an element, because a
picture that waits for a script is a bar with no mark.

Four things were measured before this was built on, and each one is a rule in
`docs/design-system/artwork.rst`:

- A `<use>` into a root `<svg id="art" viewBox>` **scales** into the wrapper's
  width and height. The wrapper therefore states a size and no coordinate
  system, and nothing has to read the file. `packages/frontend/assets/diagrams/` still names a
  `<g>`, which carries no viewBox, which is why that one directory is read by
  `scripts/diagrams.ts` and the marks are not.
- A custom property declared on the page **reaches** the referenced shapes.
  `fill="var(--text-primary, #8A8378)"` is the page's ink on a page and the
  grey anywhere else.
- A `<style>` in the file **is applied** to the shapes after they are
  referenced, and a rule beats a presentation attribute — so a stylesheet
  inside a mark defeats the token silently. Same for a `color` on the root,
  one level up, which is why the shapes cannot say `currentColor`.
- What the file's own root **inherits does not travel** into the clone. A file
  cannot carry its own `prefers-color-scheme` switch, and does not need one.

The failure mode is a blank space: a file whose root is not named, or whose
comment carries a double dash and is therefore malformed XML, draws nothing at
all. `make diagrams` refuses the second one for the files in this repository.
The first is caught where the file can be read — `link()` in
`scripts/lib/site.ts` marks an unprepared drawing `linked` before the page is
drawn, so the picture arrives as an `<img>` and the run names the file. That is
also why the flag is a property on every element that shows a picture: only the
build knows, and the element would otherwise decide again on upgrade.

## The signet is a construction, not the mark

The drawing in `packages/frontend/assets/` came from the Dev Companion prototype and is a
worked example of the rules, not an approved product mark. The cards and
SKILL.md are framed accordingly: what the system fixes is *how* a signet is
built — stroke 7 → rounding 3.5 → gap ≥ 7, a 128×100 box, corner radius 20,
the frame one open path, the marker on the frame's outer edge — and the
three optical weights (7 / 8.5 / 11) hold whatever the drawing. A product
adopting this system draws its own to the same construction.

Do not re-word this back into "our mark". The example is kept because a rule
without a worked example is unusable, not because the mark is settled.
