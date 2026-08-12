# Soul Design System

A design system you **build and maintain here**: the tokens, the `sds-` class
layer, and the Lit elements. Everything else in this repo is generated from
those three — the specimen cards, the Storybook pages, the npm package, and
the guide the claude.ai design agent builds with.

`sds-` is the system's initials, and they are the reason the prefix survived
the rename: Soul Design System reads the same as the one it replaced. Not a
class, a token or a tag had to move.

**CSS first.** You link one stylesheet and put classes on markup — that is
the whole contract, and it needs no JavaScript:

```html
<link rel="stylesheet" href="soul.css">
<body class="sds-app">
  <button class="sds-btn sds-btn--primary">Run the checks</button>
</body>
```

**Components where you already run JavaScript.** The elements render *light
DOM* and emit exactly those classes, so `components.css` stays the single
source of truth and the two are the same markup:

```js
import '@typo3/soul-frontend/src/index.ts';

// <sds-button variant="primary" label="Run the checks"></sds-button>
```

Neither is a fallback for the other. The product this dresses is plain PHP
with an HTML surface, which is why the classes have to work alone.

## Scope

**This dresses community projects, not TYPO3 itself.** Soul is not the design
guide for the TYPO3 backend, and it is not the design of typo3.org or of any
other official TYPO3 presence. Those surfaces have their own owners and their
own rules, and nothing written here speaks for them. Adopting this system does
not make a project official, and no surface built with it may imply that it
is — the same rule the signet and the licence note state, from the other end.

What it is for is the tier below: the extensions, tools, services and
documentation sites the community builds around TYPO3, and first of all the
ones the project endorses — Friends of TYPO3 among them. Each of those arrives
with its own stylesheet, its own idea of a button and its own page layout, so a
reader crossing from one to the next starts over every time. One token set, one
class vocabulary and one documentation theme mean the second project somebody
opens works the way the first one did.

Documentation is the half of that which is easy to miss. `docs/` renders
through `packages/guides-theme/`, so a project's pages come out with the same
navigation, the same code blocks and the same search as every other project's —
which is what makes an answer findable across them rather than merely
published somewhere. Taking it is two files and three commands, printed whole
in `docs/guides-theme/`.

**And it does not stop at documentation.** A project also has to present
itself — a landing page, a feature or comparison page, a download, the page
that says who is behind it — and that is usually the point where a project
leaves its documentation theme behind and hires a look of its own, so the two
halves of the same project stop resembling each other. The screens under
`stories/pages/` are those surfaces, finished pages rather than sketches, and
a consuming project offers them as Starting Points: what a project sells
itself with is built from the same tokens and the same class vocabulary as
what it explains itself with. `docs/design-system/screens.rst` says which layouts
they stand on.

**And it is still being built.** None of this is settled enough to be treated
as a stable interface: tokens get renamed, classes are added and dropped, and
a component's markup changes whenever a page finds out what it was missing.
There is no release, no deprecation path and nothing to upgrade through — a
consuming project pins a commit, and moves when it decides to. The direction
is not in question; the names still are.

## What is generated from it

| Output | Command | What it is |
| --- | --- | --- |
| Storybook | `make start` | the documentation surface — guidelines, components with live controls, screens |
| `specimens/` | `make cards` | every specimen card and screen, rendered from the stories that compose them |
| `.out/site/` | `make guides` | the documentation, rendered from `docs/` by phpDocumentor Guides through this system's own theme |
| `.out/acceptance/` | `make guides` | every node the renderer can emit, in a root of its own — what the theme is checked against, and published never |
| `packages/frontend/dist/` | `make dist` | the publishable ESM package and its types |
| `.out/bundle/` | `make build` | the design guide for [claude.ai/design](https://claude.ai/design), so the agent builds with these real classes instead of generic ones |

`.out/` is where everything generated goes that git does not keep — those two,
the built Storybook, the suite's output, the assembled split packages. One
root, and `make clean` removes it whole.

None of them is edited by hand. Change a component in `packages/frontend/src/`, change the
class layer in `styles/`, change a value in `tokens/` — then regenerate.

`ARCHITECTURE.md` says how the pieces are wired and which decisions are
load-bearing. `SKILL.md` is the operating instruction for designing *with*
the system, and `RATIONALE.md` says why each of its rules exists.

## Start

**Docker is the only requirement.** No Node version to match, no `npm ci`, no
`playwright install` — every task runs in the container, and there is one way
to run each.

```sh
make start   # bring the stack up and report what is running
make         # every task, with what it does
make verify  # the gate
make test    # the Playwright suite
```

The gate is a sequence of named checks and the suite a set of spec files, and
while working you can ask for one of either — `make verify ARGS=classes`, `make test
ARGS=tests/parity.spec.ts`. `make verify ARGS=--help` names the checks. A
partial run says so; only the whole sequence claims the system is consistent.

`make start` brings Storybook up and prints its address. It is the one
surface: the guidelines as written pages with their specimens embedded at the
exact viewport each declares, every component with live controls and an a11y
panel, and the whole pages beside them.

**The port is not fixed.** `make start` picks a free one and reports it, so a
Storybook you already have running elsewhere cannot make this fail to start.
Host and container get the same number on purpose — Vite's hot-reload
websocket addresses the port Storybook was told to listen on, and a mismatch
kills reloading.

## Using it in another project

There is no registry yet, and none is needed — npm resolves a public git
repository directly, in CI as well as locally:

```json
"devDependencies": {
  "@typo3/soul-frontend": "github:benjaminkott/typo3-soul-frontend#<tag>"
}
```

No build runs on install: this package has no `prepare` script, and the CSS
exports point at `packages/frontend/src/`, not at a compiled artefact.

```js
import '@typo3/soul-frontend/dist/soul.css';   // tokens + class layer
import '@typo3/soul-frontend/dist/soul.js';    // every sds- element
```

**A second stylesheet, for documents only.** `packages/frontend/dist/document.css` is the
document layer: element selectors for what a renderer emits and never gives a
class — headings, paragraphs, lists, quotes, tables, code. It is scoped to
`.sds-prose`, and it is **not** imported by `soul.css`. An application surface
wants no opinion about every `<p>` on the page; a page of prose does, and asks
for it:

```js
import '@typo3/soul-frontend/dist/document.css';
```

**The import path is the path in the repository.** There are no friendly
aliases, on purpose: an alias is a second name for one file, and the two drift
or, worse, both work and mean slightly different things. What you read here is
what you write there.

**Take `packages/frontend/dist/` over a git install.** It is committed, it carries its own Lit,
and it needs nothing installed beside it. `packages/frontend/src/` is exported too, but it does
not compile from a clone: `packages/frontend/src/lib/icons.generated.ts` is generated from
`@typo3/icons` and is not in the repository, so `packages/frontend/src/components/icon.ts`
imports a file that is not there. Reach for `packages/frontend/src/` only in a checkout that has
run the generators.

Or skip the bundler entirely — copy `packages/frontend/dist/` somewhere public and link it:

```html
<link rel="stylesheet" href="/soul/soul.css">
<script type="module" src="/soul/soul.js"></script>
```

**What a git install does and does not carry.** `packages/frontend/src/tokens/`, `packages/frontend/src/styles/`
and the brand assets under `packages/frontend/assets/` are in the repository and arrive.
`packages/frontend/assets/icons/`, `packages/frontend/fonts/` and `packages/frontend/dist/` are generated here and gitignored, so
they do not — and deliberately:

| you want | take it from | why not from here |
| --- | --- | --- |
| the icons | `@typo3/icons` | they are TYPO3's, not ours. `scripts/icons.ts` names the identifiers this system uses; copy that list, not the files |
| the font families | `@fontsource/source-sans-3`, `@fontsource/source-code-pro` | same reason, and your bundler wants its own subsetting |
| a prebuilt `<script src>` bundle | `make dist`, unpublished | a build product. If you bundle, import `packages/frontend/src/index.ts` instead |

A copy of an upstream file is a copy that can go stale against the version
that produced it — which is exactly the failure this system had to repair in
its own first consumer. Let npm own the version in both places.

## Exporting the design guide

This is not maintainer-only. Sync it into **your own** claude.ai design
project and the design agent builds with this system — its tokens, its class
vocabulary, its specimen cards — instead of inventing its own.

Set your project once, so every later sync updates that project rather than
importing a fresh copy beside it:

```sh
export SDS_DESIGN_PROJECT=<uuid>
# or, untracked and per-clone:
echo '{"projectId": "<uuid>"}' > .design-sync/config.local.json
```

No project yet? `/design-sync` creates one and reports its id. The id is not a
credential — the API authorises your own login — but it is per-person, which
is why the committed config does not carry one.

Then, in this order:

```sh
make sync    # build, verify, what-would-change, and the upload plan
```
```
/design-sync    # in Claude Code — executes the plan
```
```sh
make synced  # record that the project now holds this build
```

There is deliberately no `npm run` that uploads: the upload needs the
`DesignSync` tool bound to your claude.ai login, which a shell script has no
access to. What the scripts *can* own is everything except the transport, and
they do — `make plan` writes `.design-sync/.cache/upload-plan.json` with
the steps in the order they must run, the exact file list, and the exact
deletes. The agent executes it rather than working it out, because working it
out by hand is how a batch of renamed font files was once left orphaned in
the project.

**If verify fails, `make sync` stops there and exits non-zero — fix it
before uploading.** Everything it reports is invisible in review and wrong in
every design afterwards: a class that no stylesheet defines silently does
nothing, a broken reference ships an unstyled card, a card that overflows its
declared viewport gets cropped in the pane.

It checks mechanics, not judgement. When `status` lists changed cards, look at
them — `make baseline` before a visual change, `make shots && npm run
diff` after.

The upload finds the right project by itself — `.design-sync/config.json`
holds the project id, so a sync always lands in the same place and never
creates a second one. It compares against the anchor the project stores
(`_ds_sync.json`, a hash per card) and pushes only what moved.

## Layout

| Path | |
| --- | --- |
| **`packages/frontend/src/`** | **the design system — everything below is generated from it** |
| `packages/frontend/src/tokens/*.css` | colour, type, control scale, spacing, radius, motion — the values |
| `packages/frontend/src/styles/styles.css` | the single entry point: tokens, then the component layer |
| `packages/frontend/src/styles/components.css` | the `sds-` class vocabulary every surface is built from |
| `packages/frontend/src/styles/document.css` | the document layer — what a renderer emits and never classes, scoped to `.sds-prose`. Also **not** in the `styles.css` closure: an application surface takes no opinion about every `<p>` |
| `packages/frontend/src/styles/_specimen.css` | chrome for the cards only — deliberately **not** in the `styles.css` closure, so a rendered design never inherits it |
| `packages/frontend/src/components/*.ts` | the Lit elements and the template functions they render |
| `packages/frontend/src/lib/` | the element base, the icon inliner, the static renderer |
| `packages/frontend/src/index.ts` | the bundle entry — importing it registers every `sds-*` element |
| | |
| `stories/` | the specimen every card and screen is generated from, and the components with their controls |
| `docs/` | the published documentation — the manual, the guideline pages with their specimens embedded, and the prompts those pages print whole |
| `packages/guides-theme/` | the Composer package that maps phpDocumentor Guides onto this system, and the acceptance render it is checked against |
| `tests/` | the Playwright suite |
| `scripts/` | the tooling behind the tasks |
| `.infra/` | Dockerfile, compose and the entrypoint |
| `.github/` | the gate on every push, and the site published from `main` |
| | |
| `specimens/` | **generated** — the cards and the screens, the latter offered as Starting Points in a consuming project |
| `packages/frontend/fonts/` | **generated** from `@fontsource`, and committed — the package publishes it |
| `packages/frontend/assets/icons/` | **generated** from `@typo3/icons`, untracked |
| `packages/frontend/dist/` | **generated** — the drop-in, committed |
| `.out/` | **generated** — everything git does not keep: the upload payload, the publish root, the built Storybook, the suite's output. A drop-in is copied, a site is published |
| | |
| `ARCHITECTURE.md` | how this repo is built, and what has already gone wrong |
| `SKILL.md` | the build rules — the operating instruction |
| `RATIONALE.md` | why each rule exists — read before extending or breaking one |

Every card's first line is a `@dsCard` comment carrying its group, label,
subtitle and viewport; a screen's is `@startingPoint`. Those lines are the
contract with the Design System pane, and `make verify` enforces them.
A screen is its own thumbnail — there is no thumbnail file anywhere.

## Tasks

`make` prints this list. Every one runs in the container.

| | |
| --- | --- |
| `storybook` | the documentation surface, on a port Docker picks |
| `verify` | the gate: headers, classes, coverage, references, fit, card staleness, types, conventions |
| `test` | the Playwright suite — every story renders, components match their static render, axe |
| `cards` | regenerate the specimen cards from their stories |
| `guides` | render `docs/` into `.out/site/` with the theme — the documentation as it will be served |
| `build` | assemble `.out/bundle/`, the upload payload |
| `dist` | build the publishable ESM package and its types |
| `sync` | build + verify + what-would-change + upload plan |
| `status` / `plan` / `synced` | the sync steps individually |
| `baseline` / `shots` / `diff` | screenshot before, after, compare |
| `sheets` | tile screenshots into contact sheets |
| `fonts` / `icons` | regenerate from the npm packages |
| `coverage` | is every component shown — a story, a drawn class, a page the Guides renderer produced |
| `fit` | does every card fit the viewport it declares |
| `typecheck` | `tsc --noEmit` |
| `shell` | a prompt inside the image |

`packages/frontend/fonts/` and `packages/frontend/assets/icons/` are generated from npm packages and are **not**
in git. The container's entrypoint regenerates them whenever they are
missing, so a fresh clone needs no setup step — without them every card would
render in system-ui with no icons, which looks like a design bug and is not
one.

### Changing a component

Edit `packages/frontend/src/<component>.ts`. Every card is **generated** from the story that
composes it — `make cards` writes it, and `make verify` fails if one is stale
*or* if a card on disk has no story behind it. A card edited by hand is
silently reverted on the next generate; a card written by hand is a build
failure, which is the same rule stated so it cannot be missed.

The cards stay static HTML with no custom elements in them: the Design System
pane opens them with `styles.css` and no JavaScript, so what ships is the
markup the element *produces*. `@lit-labs/ssr` does that conversion in Node.

The repo runs its `.ts` sources directly — Node 22.18+ strips types, so there
is no build step for development. `make dist` exists only for publishing.

### Changing things

Adding a font weight or an icon means editing the `FAMILIES` / `ICONS` list
in `scripts/fonts.ts` or `scripts/icons.ts` — never the generated output.
The icon's identifier is also its path, by its first segment:
`actions-search` → `src/actions/actions-search.svg` in `@typo3/icons`, and at
the same path under
`https://cdn.jsdelivr.net/npm/@typo3/icons@5.0.3/` or
`https://raw.githubusercontent.com/TYPO3/TYPO3.Icons/main/` — that is how a
surface pulls one this set does not cover. `dist/icons.json` in that package
lists every identifier and the deprecated aliases; `THIRD-PARTY.md` records the
whole provenance. A missing icon is contributed to
[TYPO3/TYPO3.Icons](https://github.com/TYPO3/TYPO3.Icons) first; the script
fails rather than substituting one from another set.

Before a visual refactor, take `make baseline`, make the change, then
`make shots && make diff`. Anything that moved, moved on purpose.

## Licence

MIT — see `LICENSE`. Icons are MIT and the fonts are SIL OFL 1.1; both are
recorded in `THIRD-PARTY.md`.

This is **not** an approved TYPO3 product and no surface may imply
endorsement.
