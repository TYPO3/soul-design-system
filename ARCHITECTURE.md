# How this repo is built

The repository map now lives in the published maintainer documentation:
[`docs/maintaining/source-and-output.rst`](docs/maintaining/source-and-output.rst)
names the authoritative sources, the tasks that read them and the generated
artefacts they produce.

This file temporarily holds the architecture decisions that have not yet moved
beside the part of the system they govern. `SKILL.md` remains the operating
instruction for designing with the system, the published documentation keeps
design reasons beside their rules, and `.design-sync/NOTES.md` covers the
design-guide upload alone.

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
