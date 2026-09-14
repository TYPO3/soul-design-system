# Soul Design System

A design system you **build and maintain here**: the tokens, the `sds-`
class layer, and the Lit elements. Everything else in this repository comes
from those three. The specimen cards, the Storybook pages, the npm package,
and the guide the claude.ai design agent builds with.

**Status: experimental.** There is no stable release, registry package,
deprecation path or upgrade path yet. A consumer pins a commit or a tag from
one of the package mirrors and moves with care. Token, class and component
names can still change.

| I want to | Start with |
| --- | --- |
| use the class layer or the web components | [Use it in another project](#use-it-in-another-project) |
| publish a documentation site | [`docs/guides-theme/example.rst`](docs/guides-theme/example.rst) |
| explore the design rules and specimens | [`docs/design-system/index.rst`](docs/design-system/index.rst) |
| change this repository | [Maintain it here](#maintain-it-here) |
| publish package mirrors | [`MAINTAINERS.md`](MAINTAINERS.md) |

`sds-` is the system's initials. Soul Design System reads the same as the
name it replaced, so no class, token or tag had to move.

**CSS first.** You link one stylesheet and put classes on markup. That is
the whole contract, and it needs no JavaScript:

```html
<link rel="stylesheet" href="soul.css">
<body class="sds-app">
  <button class="sds-btn sds-btn--primary">Run the checks</button>
</body>
```

**Components where you already run JavaScript.** The elements render *light
DOM* and emit exactly those classes. So `components.css` stays the single
source of truth, and the two are the same markup:

```js
import '@typo3/soul-frontend';

// <sds-button variant="primary">Run the checks</sds-button>
```

Neither is a fallback for the other. The class layer works without
JavaScript, so a server-rendered surface adopts the system without a change
to its toolchain. Components add behaviour where a browser is already part
of it.

## Scope

**This dresses community projects, not TYPO3 itself.** Soul is not the
design guide for the TYPO3 backend, and not the design of typo3.org or any
other official TYPO3 presence. Those surfaces have their own owners and
rules, and nothing here speaks for them. A project on this system is not
official, and no surface built with it must imply that it is.

It is for the extensions, tools, services and documentation sites the
community builds around TYPO3. Each arrives with its own stylesheet, its own
button and its own page layout. A reader who crosses from one to the next
starts over every time. One token set, one class vocabulary and one
documentation theme mean the second project works the way the first did.

Documentation is the half of that which is easy to miss. `docs/` renders
through `packages/guides-theme/`, so a project's pages come out with the
same navigation, code blocks and search as every other project's. That is
what makes an answer findable across them. To take it is a settings file, a
workflow and the commands between them, printed whole in
`docs/guides-theme/`.

**And it does not stop at documentation.** A project also has to present
itself: a landing page, a feature or comparison page, a download, the page
that says who is behind it. That is usually where a project leaves its
documentation theme and hires a look of its own. The two halves then no
longer resemble each other.

The screens under `stories/pages/` are those surfaces, complete pages, and
a consumer offers them as Starting Points.
What a project sells itself with comes from the same tokens and classes as
what it explains itself with. `docs/design-system/screens.rst` says which
layouts they stand on.

## What comes from it

| Output | Command | What it is |
| --- | --- | --- |
| Storybook | `make start` | the documentation surface: guidelines, components with live controls, screens. `make test` builds it into `.out/storybook/`, and that build goes out below the site at [/storybook/](https://typo3.github.io/soul-design-system/storybook/) |
| `specimens/` | `make cards` | every specimen card and screen, from the stories that compose them |
| `.out/site/` | `make guides` | the documentation, rendered from `docs/` by phpDocumentor Guides through this system's own theme |
| `.out/acceptance/` | `make guides` | every node the renderer can emit, in a root of its own. The theme's check surface, published never |
| `packages/frontend/dist/` | `make dist` | the publishable ESM package and its types |
| `.out/bundle/` | `make build` | the design guide for [claude.ai/design](https://claude.ai/design), so the agent builds with these classes |

`.out/` is the root for generated output git does not keep: the rendered
site, the built Storybook, the suite's output and the assembled split
packages. `make clean` removes it whole.

Never edit one by hand. Change a component in
`packages/frontend/src/components/`, the class layer in
`packages/frontend/src/styles/components.css`, or a value in
`packages/frontend/src/tokens/`. Then regenerate.

[`docs/maintaining/`](docs/maintaining/index.rst) says how sources become
the artefacts this repository ships, and records the decisions behind those
paths. `SKILL.md` is the operating instruction to design *with* the system.
The published design-system and frontend pages put reasons beside the rules.

## Maintain it here

**Docker is the only requirement.** No Node version to match, no `npm ci`,
no `playwright install`. Every task runs in the container, and there is one
way to run each.

```sh
make start   # bring the stack up and report what is running
make status  # what is running, and where it answers
make         # every task, with what it does
make verify  # the gate
make test    # the Playwright suite
```

The gate is a sequence of named checks, and the suite a set of spec files.
While you work, ask for one of either: `make verify ARGS=classes`, `make
test ARGS=tests/parity.spec.ts`. `make verify ARGS=--help` names the checks.
A partial run says so. Only the whole sequence claims that the system is
consistent.

`make start` brings Storybook up and prints its address. It is the one
surface. The guidelines as pages with their specimens at the exact viewport
each declares. Every component with live controls and an a11y panel, and
the whole pages beside them.

**The port can change.** `make start` picks a free one and reports it, so
a Storybook you already run elsewhere cannot block this one. `make status`
reports the same addresses at any point, read out of the running
containers. Host and container get the same number on purpose. Vite's
hot-reload websocket addresses the port Storybook listens on, and a
mismatch kills the reload.

`TASKS` in `scripts/task.ts` is the task list, and `make` prints it.

## Use it in another project

The frontend is on npm, published from the tag the public mirror carries:

```sh
npm install @typo3/soul-frontend lit
```

The package comes from `packages/frontend/` and carries the committed
`dist/`, fonts and brand assets. No build runs on install. The package
entry is `dist/index.js`, with Lit as a peer dependency.

```js
import '@typo3/soul-frontend';                 // every sds- element
import '@typo3/soul-frontend/dist/soul.css';   // tokens + class layer
```

Install `lit` beside it. Import the entry and not `src/index.ts`. The
sources ship along, but they are TypeScript a consumer has to compile, and
the manifest's exports resolve the entry.

**One stylesheet, documents included.** What a renderer emits with no
class, headings, paragraphs, lists, quotes, tables, code, is in `soul.css`
with everything else. The layer that owns a bare element sets it. What is a
passage's own is `sds-prose`'s, drawn only where a page carries that class.

**The import path is the path in the repository.** There are no friendly
aliases, on purpose. An alias is a second name for one file, and the two
drift, or both work and mean slightly different things. What you read here
is what you write there.

Or skip the bundler. Copy `dist/` from the frontend mirror somewhere public
and link the drop-in. Copy the directory whole: the stylesheet resolves the
fonts beside itself, and the script resolves the icon sprite inside it.

```html
<script src="/soul/soul-boot.js"></script>
<link rel="stylesheet" href="/soul/soul.css">
<script type="module" src="/soul/soul.js"></script>
```

`soul-boot.js` is for a page with a mode switch, and it loads before the
stylesheet. `soul.js` is the drop-in build and carries Lit. The package
entry above leaves Lit external. Do not mix the two JavaScript entries on
one page.

## Export the design guide

This is not maintainer-only. Import it into **your own** design system at
[claude.ai/design](https://claude.ai/design), and the design agent builds
with these tokens, this class vocabulary and these cards.

```sh
make design-sync    # build, gate, what will change, and the upload plan
```
```
/design-sync        # in Claude Code — executes the plan
```
```sh
make design-synced  # record that the app now holds this build
```

**A first import creates its own design system.** Let it, and do not adopt
an existing project. A fresh one starts empty, so the upload is everything
in it, and only a design system is a target. The plan checks that before it
writes, and the type cannot change afterwards.

Then set its project id, once per clone. Without one, every sync imports a
second copy instead of an update to the first:

```sh
make design-project                # which design system a sync uploads into, and how to get its id
make design-project ARGS=<uuid>    # set it for this clone
make design-project ARGS=--forget  # forget it and the cached state — the next sync is a first import
```

No `npm run` uploads. The transport needs the `DesignSync` tool bound to
your claude.ai login, and a shell script has none. Claude Code asks before
it reaches the app. Once to add design access to that login, then per act:
the new design system and the plan lock. The scripts own everything else.
`make design-plan` writes the steps, the file list and the deletes, and the
agent executes that instead of its own plan.

**A red gate stops `make design-sync` before any upload.** Every fault it
names is invisible in review and wrong in every design after it. It checks
mechanics, not judgement. When `make design-status` lists changed cards,
look at them: `make baseline` before a visual change, `make shots && make
diff` after.

[`docs/design-system/design-with-claude.rst`](docs/design-system/design-with-claude.rst)
is the step-by-step: the first import, the design work, the updates, and
what each symptom means.

## Layout

| Path | |
| --- | --- |
| **`packages/frontend/src/`** | **the design system. Everything below comes from it** |
| `packages/frontend/src/tokens/*.css` | colour, type, control scale, spacing, radius, motion: the values |
| `packages/frontend/src/styles/styles.css` | the single entry point: tokens, then the component layer |
| `packages/frontend/src/styles/components.css` | the `sds-` class vocabulary every surface uses |
| `packages/frontend/src/styles/components/prose.css` | `sds-prose`: the box a passage stands in, and the names a renderer writes for nodes with no element |
| `packages/frontend/src/styles/_specimen.css` | chrome for the cards only. **Not** in the `styles.css` closure, so a rendered design never inherits it |
| `packages/frontend/src/components/*.ts` | the Lit elements and the template functions they render |
| `packages/frontend/src/lib/` | the element base, the icon inliner, the static renderer |
| `packages/frontend/src/index.ts` | the bundle entry. Its import registers every `sds-*` element |
| | |
| `stories/` | the specimen every card and screen comes from, and the components with their controls |
| `docs/` | the published documentation: the manual, the guideline pages with their specimens, and the prompts they print |
| `packages/guides-theme/` | the Composer package that maps phpDocumentor Guides onto this system, and its acceptance render |
| `tests/` | the Playwright suite |
| `scripts/` | the tooling behind the tasks |
| `.infra/` | Dockerfile, compose and the entrypoint |
| `.github/` | the gate on every push, the site published from `main`, and the release a tag publishes |
| | |
| `specimens/` | **generated**: the cards and the screens, the latter on offer as Starting Points in a consumer |
| `packages/frontend/fonts/` | **generated** from `@fontsource`, in git because the package publishes it |
| `packages/frontend/assets/icons/` | **generated** from `@typo3/icons`, in git: the sprite, the lookup, and every file the lookup names |
| `packages/frontend/dist/` | **generated**: the drop-in, in git |
| `.out/` | **generated**: everything git does not keep. The upload payload, the publish root, the built Storybook, the suite's output |
| | |
| `docs/maintaining/` | how the sources, tasks and generated outputs connect |
| `MAINTAINERS.md` | package mirror credentials and release operations |
| `SKILL.md` | the build rules: the operating instruction |

Every card's first line is a `@dsCard` comment with its group, label,
subtitle and viewport. A screen's is `@startingPoint`. Those lines are the
contract with the Design System pane, and `make verify` enforces them. A
screen is its own thumbnail.

### Change a component

Edit `packages/frontend/src/components/<name>.ts`. Every card **comes from**
the story that composes it. `make cards` writes it, and `make verify` fails
on a stale card *or* on a card with no story behind it. The next generate
reverts a card edited by hand. A card written by hand is a build failure.

The cards stay static HTML with no custom elements in them. The Design
System pane opens them with `styles.css` and no JavaScript, so what ships
is the markup the element *produces*. `@lit-labs/ssr` does that conversion
in Node.

The repository runs its `.ts` sources directly. Node strips the types, so
there is no build step for development. `make dist` exists for the publish.

### Change other things

To add a font family or style, edit the `FAMILIES` list in
`scripts/fonts.ts`. An icon arrives with its category, in `CATEGORIES` in
`scripts/icons.ts`. Never edit generated output.

The icon's identifier is also its path, by its first segment:
`actions-search` → `src/actions/actions-search.svg` in `@typo3/icons`, and
at the same path under `https://cdn.jsdelivr.net/npm/@typo3/icons@5.0.3/`
or `https://raw.githubusercontent.com/TYPO3/TYPO3.Icons/main/`. That is how
a surface pulls one this set does not cover. `dist/icons.json` in that
package lists every identifier and the deprecated aliases.
`THIRD-PARTY.md` records the provenance.

A missing icon goes to
[TYPO3/TYPO3.Icons](https://github.com/TYPO3/TYPO3.Icons) first. The script
fails and does not substitute one from another set.

Before a visual refactor, take `make baseline`, make the change, then `make
shots && make diff`. Anything that moved, moved on purpose.

## Licence

MIT, see `LICENSE`. Icons are MIT and the fonts are SIL OFL 1.1; both are in
`THIRD-PARTY.md`.
