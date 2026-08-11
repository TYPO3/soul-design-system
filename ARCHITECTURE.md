# How this repo is built

The design system is the product: the tokens in `tokens/`, the class layer in
`styles/components.css`, and the Lit elements in `src/`. Everything else is
generated from those — the specimen cards, the Storybook pages, the npm
package, and the design-guide bundle that `.design-sync/` uploads.

`SKILL.md` is the operating instruction for *designing* with the system and
`RATIONALE.md` says why each of those rules exists. This file is about the
repo: how the pieces are wired, what has already gone wrong, and which
decisions are load-bearing.

`.design-sync/NOTES.md` covers one export — the claude.ai/design upload — and
nothing else.

## Layout

`src/` is the design system. Three layers, peers of one another, because that
is what they are — a token is not a lesser thing than a component:

- `src/tokens/*.css` — the values. Nothing else declares one.
- `src/styles/` — `styles.css` is the single entry point and imports the
  tokens then the component layer. `components.css` is the `sds-` vocabulary.
  `document.css` is the document layer and `_specimen.css` is chrome for the
  cards; both are deliberately **outside** the `styles.css` closure — see
  below.
- `src/components/*.ts` — the Lit elements, each exporting a plain template
  function beside its class. `src/lib/` holds what they share and
  `src/index.ts` is the bundle entry.

Two directories beside it are source as well, and both are read by something
other than Storybook: `docs/` is the published documentation, written as RST
and rendered by phpDocumentor Guides, and `guides-theme/` is the Composer
package that maps that renderer onto this system. A guideline page there and a
story here show the same specimen, because the page embeds the same card.

Everything else is generated from those and must not be edited by hand: every
card and screen under `specimens/`, `fonts/` and `assets/icons/`, the Storybook
build, `dist/`, `ds-bundle/` and `site/`. `make verify` fails on a card that no
story produces, so the hand-written form cannot come back one file at a time.

`fonts/` and `assets/` stay at the root rather than under `src/`: they are
generated artefacts of npm packages, not sources, and the upload bundle wants
them at its own root anyway.

**The bundle is flat and the repo is not.** `styles.css`, `_ds_bundle.css`,
`_specimen.css` and `tokens/` all sit at the root of `ds-bundle/`. The climb
back to that root used to be written out beside each caller — `'../../../'`
for a card, `'../'` for a screen — so a change to either layout was also a
change to two literals in `scripts/build.ts`, and that pairing broke twice.
`rewriteRefs` now counts the climb from the directory the file lands in, and
no caller states it. What still has to move with the layout is the `@import`
rewriting, which names paths rather than depths.

**Three export surfaces, and only one of them is not committed.** `dist/` is
the npm drop-in, `ds-bundle/` is the upload payload for the design agent, and
`site/` is the publish root the rendered documentation lands in. The first two
are in git because somebody copies them — a consumer takes `dist/` over a
clone, and the sync uploads `ds-bundle/` file by file. Nobody copies a rendered
site; it is published, from `main`, by the workflow in `.github/`. Committing
it would be committing the same pages twice, once as source and once as output.

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

The document layer is not in `ds-bundle/`. That upload is for designing with
the system, and nobody sets a document in it — one flat root, unchanged.

## Two packages come out of this tree, and they leave by different doors

**npm needs no split.** `package.json` is at the root, `files` names `dist/`,
`src/`, `fonts/` and `assets/`, and `npm publish` from the root ships exactly
that.

**Composer does.** Packagist reads the `composer.json` at the root of a
repository, so a package in a subdirectory does not exist for it. `guides-theme/`
therefore has to be pushed to a read-only repository of its own on every tag —
a subtree split, the same mechanic `phpdocumentor/guides` uses for its own
`packages/*`, with `splitsh-lite` doing the work in CI.

**One decision is still open, and it is the one a consumer feels.** The split
theme needs the stylesheets, and a PHP project cannot pull npm. Either the
split carries the built files — `dist/soul.css`, `document.css`, `soul.js` and
the faces move into `guides-theme/resources/dist/` at release, and a
documentation build needs Composer and nothing else — or the theme states as a
precondition that somebody else puts them in place. Today it is the second:
`docs/guides-theme/installation.rst` tells the reader to copy the drop-in from
`path/to/soul-design-system/dist/` into their output after the render, and
leaves how it got onto that machine to them. That instruction is honest and it
is a step a Composer-only project cannot take without help — which is the
argument for the first, whenever the split is written.

## Decisions that were made on purpose

- **Two type scales, both intentional.** `tokens/typography.css` is the
  editorial scale (display → body). `tokens/controls.css` names the tighter
  scale controls were tuned to (14px buttons, 10px table heads). Converging
  them was offered and declined: it would move every surface. Not drift.
- **No half-pixel font sizes.** House rule. 121 of them were rounded half-up
  across the cards; `--font-size-code` went 13.5 → 13px to match the code
  blocks that already rendered at 13. Keep it that way — `make verify`
  does not catch a new one, so watch it in review.
- **Class prefix is `sds-`**, state is `.is-*`. `t3-` was avoided: the system's
  own rules forbid implying TYPO3 endorsement.
- **Fonts ship with the system**, 18 woff2 (latin + latin-ext, SIL OFL 1.1),
  generated from `@fontsource` — see the Re-sync risks entry for how. They
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
  rounding (`DIFF 12.5 PX`, `--font-size-code · 13.5`). If you change a size
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

- Nine Lit elements in `src/`, bundled into `_ds_bundle.js` and published as
  ESM from `dist/`. `_adherence.oxlintrc.json` should now come back with real
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

The seven cards under `components/` are **generated** — edit
`stories/*.stories.ts`, never the card. `make cards` writes them and
`make cards ARGS=--check` fails on a stale one, which is step 5 of verify.

The chain is: a component template in `src/` → `@lit-labs/ssr` renders it to
static markup (`src/lib/render.ts`) → the story composes the specimen out of
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
  when a template's entire content is bindings. `src/lib/render.ts` strips
  both and throws if a marker survives, because an HTML comment renders as
  nothing and would be invisible in review.

Each migration was verified by `make baseline` before and
`make shots && make diff` after: **38 identical, 0 changed** for the component
cards, **36 of 39** when the guideline cards followed. The three that moved
differ by under 0.1%: their glyphs come from the sprite rather than from a
pasted path. Numeric entities became the literal characters they encode
throughout.

The pixel diff is the check that made that migration safe, and it earned it:
six cards carry both modes inside them and must pin neither on `<html>`.
Pinning one turned the ground under the diagram figures from paper to
terminal — a quarter of the card — and no other check in the repo would have
noticed.

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
  `guides-theme/acceptance/` is where a component meets markup it did not
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

**The signets keep the old greys on purpose.** `assets/*-signet-*.svg` carry
`#8A8378` behind their tokens — `var(--text-primary, #8A8378)`, so the grey is
what the file renders as where no token is declared and never what a page
shows. A brand mark is a drawing, not text — WCAG's text-contrast rule does
not apply to it, and moving it would change the mark for no accessibility
reason. So the signet grey and `--text-muted` no longer coincide; they were
never the same decision.

The three diagram pairs under `assets/diagrams/` **were** updated: SKILL.md
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

It is `threshold: 0` now. That is affordable because everything renders in
the container: two consecutive runs of all 38 cards differ by zero pixels at
every threshold tested, so there is no antialiasing noise to absorb. If it
ever turns noisy, raise it knowing the cost — 0.05 already missed a third of
that colour change.

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
  Its own `dist/preview.d.ts` declares `initialGlobals: { a11y: { manual } }` —
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
  character, which fixes it for the seven; **the guideline cards were not
  audited for this.** Grep `guidelines/*.card.html` for `&#` in a `@dsCard`
  line.
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
(`@typo3/soul-design-system`) and the wordmark moved. That is luck rather
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

`src/lib/art.ts` decides, from the file name and nothing else: an SVG is
referenced with `<use href="file.svg#art">`, anything else is linked with
`<img>`. `sds-image` is that as an element, `sds-figure` is it with a caption,
and the Guides theme writes the same two shapes itself in `brand.html.twig`
and `figure.html.twig` — the theme cannot depend on an element, because a
picture that waits for a script is a bar with no mark.

Four things were measured before this was built on, and each one is a rule in
`docs/guidelines/artwork.rst`:

- A `<use>` into a root `<svg id="art" viewBox>` **scales** into the wrapper's
  width and height. The wrapper therefore states a size and no coordinate
  system, and nothing has to read the file. `assets/diagrams/` still names a
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
all. `make diagrams` refuses the second one for the files in this repository;
for a consumer's file the guideline page is the only guard there is.

## The signet is a construction, not the mark

The drawing in `assets/` came from the Dev Companion prototype and is a
worked example of the rules, not an approved product mark. The cards and
SKILL.md are framed accordingly: what the system fixes is *how* a signet is
built — stroke 7 → rounding 3.5 → gap ≥ 7, a 128×100 box, corner radius 20,
the frame one open path, the marker on the frame's outer edge — and the
three optical weights (7 / 8.5 / 11) hold whatever the drawing. A product
adopting this system draws its own to the same construction.

Do not re-word this back into "our mark". The example is kept because a rule
without a worked example is unusable, not because the mark is settled.
