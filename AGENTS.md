# Navigating this repository

Read this first, then the one document below that answers your question. It
says where the rules are and what may be edited.

It is also where an agent's own notes belong. Anything worth carrying into the
next session is written down here, in the section it concerns — never into a
private memory an agent keeps beside the repository. A rule only one reader can
see is one nobody else can follow, and nobody can correct.

**The whole repository follows from `packages/frontend/src/`.** Tokens, the `sds-` class layer
and the Lit elements are written by hand; the cards, the screens, the package
and the bundle are generated from them. Editing a generated file is either
reverted by the next generate or fails the gate — both by design.

## One language

Everything written into this repository is written in English — the documents,
the code comments, the commit messages, the strings a task prints, the headings
of a page, the notes left here for the next session. A tree read by people who
do not share a first language, and worked on by agents that answer in whatever
language the prompt arrived in, holds together only as long as there is one
language in it; a second one splits the readership of every line it touches and
leaves a reader who can act on half the file.

The rule binds what is written down, not the conversation — speak to whoever is
in the room in whatever language they use, and write English into the tree.

Text in another language is not a note for later. Stop the work in hand,
translate it, commit that on its own, and only then pick the work back up. It
is treated like a red gate, and for the same reason: left standing, the next
reader inherits it and the next agent matches its tone, and by then it is no
longer one file.

No file is exempt from it. A rule carrying a standing exception is read as a
preference, and the exception is what a later reader matches — including in
the files it never names, which is where the last German line in this tree was
found.

## No document counts the parts

Nothing written down says how many of something there are — not how many
elements the system has, how many cards are generated, how many checks the
gate runs, how many suites the test run holds, how many icons are pulled in.
Name the thing and say where its list lives: `make verify ARGS=--help` names
the checks, `TASKS` in `scripts/task.ts` names the tasks, `stories/` holds the
specimen. "The gate is thirteen named checks" becomes "the gate is a sequence
of named checks", and the sentence loses nothing.

A count is a second copy of something the tree already states, and the only
copy nobody regenerates. It is right on the day it is written and wrong at the
next component, no check can see that it has gone stale, and every reader who
trusts it is worse off than one who was never given a number. The maintenance
it asks for buys nothing: a reader who needs the exact figure counts the
directory, and one who does not needs the shape, not the tally.

This binds counting the parts, not numbers as such. A value the design is
built on — a size, a radius, a viewport width, a version, a breakpoint — is
the rule itself and is written down exactly. A number recording something that
happened once, like how many cards a past change moved, is a fact about a past
and does not drift.

## How long a comment may be

**Five lines, and ten for the one at the top of a file.** That is the whole
budget, it counts the `/*` and the `*/`, and a block that needs more is a block
carrying something other than the reason. Cut the something else, not the
reason: what the line below already says, what it used to be, when it broke,
which page it broke on, the second worked example, the aside that begins
"Note that". A comment ends where a reader who has the constraint would stop
reading.

Length was written as a preference before — "as short as it can be and still be
true" — and preferences lose to whatever is being explained at the time. The
number is here because it can be counted while writing, and because a reason
that genuinely takes fifteen lines is a decision about the system, which
belongs beside its rule in the published documentation, where it is read on
purpose rather than found by whoever opens the file.

The budget binds comments. A message a task prints, an error thrown at a caller
and the documents themselves are not comments and say what they have to say.

## Which document answers what

| Question | Read |
| --- | --- |
| What is this, how do I run it, what is generated from what | `README.md` |
| Where a source lives and which output a task derives from it | `docs/maintaining/source-and-output.rst` |
| Why packages leave through mirrors, and how they remain installable | `docs/maintaining/package-splits.rst` |
| How package mirrors are authenticated and published | `MAINTAINERS.md` |
| How to *design with* the system — the build rules | `SKILL.md` |
| How the stylesheets are written — layers, flow contract, sets, nesting | `docs/frontend/stylesheets.rst` |
| Why a design rule exists | its page under `docs/design-system/` or `docs/frontend/` |
| Drawing a signet to the construction | `docs/design-system/signet-prompt.md` |
| Where the icons and fonts came from, and under what licence | `THIRD-PARTY.md` |
| How to take the theme into a project of your own | `docs/guides-theme/` |

`SKILL.md` is the operating instruction. The matching published page carries
the rule and its reason. If a change would deviate from `SKILL.md`, read that
page before deciding, not after.

## A page lives where the menu puts it

**In `docs/`, the tree on disk is the tree in the navigation.** A page that
appears under a section in the menu is a file in that section's directory; the
section's own page is the `index.rst` beside its children, and its `toctree`
names only what lies below it. A page with no children stays a single file and
becomes a directory with an `index.rst` on the day it gets any. A `../` in a
`toctree` is the rule already broken — it puts a page under one heading for a
reader and somewhere else for whoever opens the directory.

This binds the whole move, not the file: renaming a menu entry renames the
directory, and moving a page between sections moves the file, its entry in the
old `toctree` and the links that pointed at it. `make verify ARGS=refs` names
whatever stayed behind, and a page still reachable from a stale path is not a
reason to leave the tree split.

The menu is the only map most readers are given, and an editor arrives from
either side of it — from the published page, knowing the path they clicked, or
from the checkout, knowing the file. A structure that agrees with the menu
answers both with the same lookup; one that does not charges a search every
time, and the drift is invisible to everyone except the person who happens to
need the page that moved.

## What `packages/` means

Everything under it is pushed to a repository of its own and published from
there — `packages/frontend/` to npm as `@typo3/soul-frontend`, and
`packages/guides-theme/` to Packagist as `typo3/soul-guides-theme`. Nothing
else in the tree leaves, and a directory put there is a promise that it will.

`make split ARGS=<name>` assembles one and replays its commits into
`.out/split/`; `make split ARGS=--check` is the gate's question — that both
still make packages a project could install. This repository stays the only
place either is written: the mirrors are read-only, and a commit made in one is
overwritten by the next release.

Publishing, authentication and reruns are internal maintainer operations;
`MAINTAINERS.md` documents them. `.github/workflows/split.yml` is their
executable source, while `scripts/split.ts` assembles and reports push commands
without making that external change itself.

**A package's README names everything the package adds, in full and in short
form.** Every directive of the theme's own with its options, every field a
document may write, every setting — enough that somebody can write a page from
that one file, with the rendered manual linked for the long version. What the
package gains lands there in the same commit, and a surface listed nowhere is
half-shipped.

Whoever reads that file has only the mirror: the monorepo's documents are not
in it, `docs/` was never split, and the manual is a site somewhere else that a
reader has to already know exists. An agent picking the package up reads the
README and then the sources, and reconstructs from a directory of classes what
one table would have told it — or, worse, writes a `div` with the classes on it
because it never found out a directive was there. It is *no document counts the
parts* read from the other end: never write how many there are, always write
which ones they are.

## What may be edited

| Path | |
| --- | --- |
| `packages/frontend/src/tokens/*.css` | the values — colour, type, controls, spacing, radius, motion |
| `packages/frontend/src/styles/components.css` | the `sds-` class vocabulary |
| `packages/frontend/src/styles/styles.css` | the single entry point |
| `packages/frontend/src/styles/_specimen.css` | card chrome only — deliberately outside the `styles.css` closure |
| `packages/frontend/src/components/*.ts` | the Lit elements and their template functions |
| `packages/frontend/src/lib/` | element base, icon inliner, static renderer |
| `stories/` | the specimen every card and screen is generated from |
| `docs/` | the published documentation — the manual, the guideline pages, and the prompts they print for copying |
| `packages/guides-theme/` | the Composer package: templates, directives, and the acceptance render |
| `tests/*.spec.ts` | the Playwright suite |
| `scripts/` | the tooling behind the tasks |
| `.storybook/`, `.infra/`, `.github/` | the documentation surface, the container, the gate on every push |

Generated — never edit, never hand-write a new one:

| Path | Regenerated by |
| --- | --- |
| `specimens/` | `make cards` |
| `packages/frontend/dist/` | `make dist` (committed on purpose — it is the drop-in) |
| `.out/bundle/` | `make build` |
| `.out/site/` | `make guides` — untracked: a drop-in is copied, a site is published. Every element in it is rendered in Node on the way out, so the pages hold their markup before any script runs. Everything in it is published, which is why the theme's control surface is the root beside it |
| `.out/acceptance/` | `make guides` — the theme's control surface, rendered every run and published never. A root of its own, because a page below somebody else's root does not resolve its assets the way a published one does |
| `.out/theme/`, `.out/consumer/` | `make guides` — the theme assembled as the package it is published as, and the renderer built against it by the three Composer commands the manual prints. `--released` names the mirror instead, which is how the published render is reproduced on a desk |
| `docs/_cards/`, `packages/guides-theme/acceptance/_cards/` | `make embed`, and `make cards` ends with it — the generated cards where the documents that embed them can reach them. Beside those documents rather than under `.out/`, because a renderer only carries what a parsed page points at |
| `docs/_images/signet*.svg` | `make embed` — committed, and copied from `packages/frontend/assets/`, which is where a mark is drawn. `marks` in `scripts/lib/projects.ts` says which file is which drawing: a signet is crisp only in the box it was made for, and a hand copy is how the wrong one reaches a header |
| `packages/frontend/fonts/` | `make fonts` — committed, because the package publishes it and a mirror ships only what git has |
| `packages/frontend/assets/icons/`, `packages/frontend/src/components/icons*.generated.ts` | `make icons` — untracked, the container's entrypoint restores them |
| `packages/frontend/src/components/diagrams*.generated.ts` | `make diagrams` — the drawings' viewBoxes and shapes, read out of `packages/frontend/assets/diagrams/` |

**Everything generated that git does not keep is under `.out/`** — the bundle,
the rendered site, the built Storybook, the suite's output and reports, the
packages assembled for their split repositories. One root, so a task's output
is somewhere a reader can find without a list to consult: `GENERATED` in
`scripts/lib/cards.ts` is where the path is written, and `make clean` removes
it whole. What stays ignored outside it is either somebody else's — the
design-sync skill's `.ds-sync/` and `.design-sync/.cache/`, `node_modules/` —
or has to sit where something reads it: the drop-in copied beside a page the
renderer is about to write, and `packages/frontend/.dist-check/`, which is a
sibling of `dist/` because the check compares bytes and the paths inside the
output are relative.

A card edited by hand is silently reverted; a card with no story behind it is
a build failure. The `@dsCard` header on a card and `@startingPoint` on a
screen are the contract with the Design System pane, and `make verify`
enforces them.
A marker's metadata uses literal Unicode, never an HTML character reference:
it is comment data rather than rendered text, so no browser decodes it.

## Running anything

Every task runs in the container. The host needs Docker and Make — no `npm
ci`, no `npx playwright install`, no Node version to match. `npm run` does not
exist here on purpose.

```sh
make          # the task list, with what each does
make start    # bring the stack up; it takes the old one down first
make status   # what is running, and where it answers
make verify   # the gate
make test     # the Playwright suite
```

`make start` tears down before it comes up, so do not run it to "check" a
running stack — `make status` is that question, and it is what `start` itself
prints when it is done. Restart only when `.infra/` or the compose file
changed.

The authoritative task list is the `TASKS` map in `scripts/task.ts`; the
`Makefile` only decides how to get into a container, and the handful of
targets that are not in that map — `start`, `status`, `stop`, `logs`, `shell`,
`clean` — are the ones about the containers themselves, which a container
cannot answer from inside. `make tasks` asks the container itself. Flags reach a task through `ARGS=`, e.g. `make cards
ARGS=--check`.

## How a task speaks

**Every task prints through `scripts/lib/report.ts` and nothing else calls
`console.log` directly.** It opens with its name and what it is for, says one
row per thing it checked — verdict, name, what it holds, its numbers — and
closes on a verdict. Whatever a row found is printed under that row rather
than collected at the bottom, so a finding is read beside the thing that
found it. Colour arrives only where there is a terminal; piped and in CI the
same characters carry the same meaning, and nothing is said in colour alone.

A task that another one runs speaks the contract instead: under `SDS_REPORT=1`
its first line is the facts and every line after it is what it found. That is
what `verify` reads, and it is a contract rather than a guess — the gate used
to filter a child's prose for a substring, and `fit` printed `cards + screens,`
against a filter looking for `cards,`. Its summary went to nobody for as long
as it stayed green, which is the failure a gate may not have: a check that
printed nothing read exactly like a check that passed.

Set the variable by hand to see what the gate sees — `SDS_REPORT=1 node
scripts/fit.ts`. A new task is written the same way, and a raw `console.log`
in one is a second voice in a tree that is read as one.

## The gate

`make verify` runs these checks, in this order — each has a name, and the
names are how a single one is asked for:

`assets` (the generated fonts and icons are there) · `diagrams` (the modules
match the drawings) · `marks` (the documents' signets against those same
drawings) · `headers` (`@dsCard`, `@startingPoint`, literal metadata) · `heights`
(specimens against the cards they embed) · `classes` (every class used is
defined in the layer that can load it) · `coverage` (every component is shown)
· `names` (every `sds-` name a document writes exists) · `refs` (every local
reference resolves) · `sets` (a component draws from its own property set) ·
`breakpoints` (every width the layer changes at is one a
document names) · `fit` (render, inside the declared viewport) · `ssr`
(every element renders outside a browser) · `dist` (the committed drop-in
against its source) · `split` (each package assembles into something a project
could install) · `cards` (every card against its story, and none without
one) · `types` (`tsc --noEmit`) · `css` (the stylesheets against their shape —
`make css` fixes what it can) · `php` (the theme's sources against the coding
standard) · `conventions` (the names in `.design-sync/conventions.md` against
the built stylesheets).

`make test` runs these suites, each guarding something the others cannot see:

| Suite | What it holds |
| --- | --- |
| `parity` | the element rendered by Lit and by `@lit-labs/ssr` are the same markup |
| `stories` | every story renders in both themes, silently |
| `pages` | the page layouts at every width they must survive |
| `viewports` | every layout band is selectable from the toolbar |
| `a11y` | axe on the specimens, serious and critical only |
| `dropin` | `packages/frontend/dist/` works the way a consumer copies it |
| `defaults` | unclassed content — what a page gets before it reaches for a class |
| `content` | content between an element's tags survives its upgrade |
| `forms` | a form of these elements submits what it shows, and a reset puts back what the markup said |
| `highlight` | every language `CodeLang` promises is actually registered |
| `manager` | the Storybook shell itself boots |
| `search` | a hit in the site index resolves from a page below the root |
| `guides` | the rendered site, opened — the theme's findings, and the page with no script |

Never disable an addon, a spec or a threshold to get a green run.

### Not every change needs the whole gate

The gate is what a piece of work is finished against, not the feedback loop
inside it. While working, run the narrowest thing that can fail on what was
touched — any check by name, and any spec by path:

```sh
make verify ARGS=classes            # one check
make verify ARGS="refs heights"     # two
make verify ARGS=--help             # the names
make test ARGS=tests/parity.spec.ts
make test ARGS="tests/a11y.spec.ts --grep card"
```

| Touched | Run |
| --- | --- |
| a component's template or its story | `make verify ARGS=cards`, then the one spec |
| types only | `make verify ARGS=types` |
| a class name, in a sheet or on a card | `make verify ARGS=classes` |
| a stylesheet, for its shape alone | `make verify ARGS=css` — `make css` fixes |
| a document naming a class, an element or an event | `make verify ARGS=names` |
| a new component, class or Guides page | `make verify ARGS=coverage` |
| a card's height or its viewport | `make verify ARGS="fit heights"` |
| a `@media` width, in any sheet | `make verify ARGS=breakpoints` |
| `packages/frontend/src/` with `packages/frontend/dist/` committed against it | `make verify ARGS=dist` |
| a drawing in `packages/frontend/assets/diagrams/` | `make verify ARGS=diagrams` |
| a mark in `packages/frontend/assets/`, or the signet a `guides.xml` names | `make verify ARGS=marks` |

A partial run says which checks it ran and that it is not the gate; only the
whole sequence prints `✓ design system is consistent`. A name that is not a
check is an error, not an empty selection. `conventions` is the one check that
reads `.out/bundle/`, so selecting it — or running everything — assembles the
bundle first; the others do not pay for it.

Run the whole gate before calling anything done, before a commit, and whenever
the change crosses layers — a token, `components.css`, a build script. A narrow
run is a step, never the answer to "is it green".

`.github/workflows/ci.yml` runs `make verify` and `make test` on every push, in
the same image. On `main` and behind that gate it mirrors the packages, then
renders and deploys `.out/site/` — from the theme it has just pushed, with no
container, because a reader has none either. All of it is a net under the rule,
not a replacement for it: a red run there is a commit already pushed, and
whoever reads it has to work out what the tree looked like instead of watching
it fail in front of them.

## Recipes

**Change a component** — edit `packages/frontend/src/components/<name>.ts`, then `make cards`,
then `make verify`. The card is static HTML with no custom elements in it: the
Design System pane opens it with `styles.css` and no JavaScript.

**Add a component** — the element in `packages/frontend/src/components/`, its classes in
`packages/frontend/src/styles/components.css`, a story in `stories/components/`, then `make
cards`. It is not done there: give it a place in the Guides render too — a
template that emits it, or a page of the fixture that asks for it. `make
coverage` names whichever of the three is still missing.

**Close a gap in a component** — in the component. A consumer writing three
declarations into their own stylesheet is the failure this system exists to
prevent, and anything the classes can do the element must be able to emit.

**Add a directive to the Guides theme** — the directive in
`packages/guides-theme/src/Directives/` and whatever node it returns, its
template under `resources/template/body/directive/`, the registration in
`resources/config/soul.php`, **the node's template in the `templates` list in
`SoulExtension.php`** — a node with none renders as its own text, which is a
page that comes out looking merely unstyled — a page of
`packages/guides-theme/acceptance/` that
uses it, its section in `docs/guides-theme/directives.rst` with a rendered
example, and its row in the package's own README — see above for why that last
one is not optional. Then `make guides` and `make verify`.

**Add a font family or style, or an icon category** — edit the `FAMILIES`
list in `scripts/fonts.ts` or `CATEGORIES` in `scripts/icons.ts`, then `make
fonts` / `make icons`. An icon arrives with its whole category, which is the
unit the package's own manifest resolves against. Never the generated output. A missing icon goes to TYPO3/TYPO3.Icons first —
the script fails rather than substituting one from another set.

**Add or redraw a diagram** — one file in `packages/frontend/assets/diagrams/`, shapes wrapped
in `<g id="soul-ref">`, every colour written `var(--token, #light)`, then
`make diagrams`. There is no dark copy: the drawing is referenced into a page
and reads that page's tokens.

**Change what a consuming project has to run** — the steps are
`scripts/lib/site.ts`, shipped as `packages/frontend/dist/soul-finish.js`. Change those, then
`make dist`: `make guides` installs the theme package and runs the built file
out of it, so an unbuilt change reaches this site as the old one. What a
project is told to run is `docs/guides-theme/_starter/publish.yml`, quoted
whole into the manual and taken command for command by `make guides` — a step
that stops working for a reader stops the site.

**A visual refactor** — `make baseline`, change, `make shots && make diff`.
Anything that moved, moved on purpose.

**`make diff` is clean, and the reason it was not is worth keeping.** Two runs
of the same tree reported ten to twenty changed cards, then two to four, and now
nothing or a single pixel of corner antialiasing. Every one of them was the same
fault: a card painted in a fallback face while `document.fonts` reported the
face `loaded` and `check()` true. `openCard` asks the one question that cannot
be answered wrongly — the same string in the shipped family and in one that does
not exist, equal widths meaning the fallback drew both — and `loadFonts` retries
until *that* is satisfied rather than until the status says so.

What made it happen at all was concurrency: six pages fetching nine `file://`
faces at once is a race, and a page that lost it stayed lost however often it
was reopened. `map` runs one page at a time, which costs `shots` six seconds and
`fit` eight and removes the race rather than retrying around it.

Two documents cannot be fixed and are named in the output instead of measured
silently: one that embeds another `file://` document — an `<iframe>`, or an
externally referenced `<svg>` — never applies its own faces, however long
anything waits. `specimens/screens/tour.html` and the three diagram cards are
those, and they are measured in the fallback.

**Change a size or a gap** — through a token or a component's set, never as a
value in a declaration: `make verify ARGS=sets` holds the route, and a raw
number in a set is read in review beside its reason. Then the visual-refactor
recipe above, because a changed distance is a visual change.

**Ship to the design agent** — `make sync` (build + verify + what would change
+ plan); `make sync-status`, `make plan`, `make synced` are the same steps
individually — `status` on its own is the containers, not the sync. Set
`SDS_DESIGN_PROJECT`, or a re-sync creates a new project instead of updating
one.

## What a change owes the documents

**A change is finished when every page describing it is true again, and that
happens in the same commit.** Before calling anything done, open what the
change touches — `SKILL.md`, the page under `docs/` carrying the reason, the
README of the package whose surface moved, and this file — and read the
passage rather than searching it for a name. `make verify ARGS="names refs"`
holds the names and the links, which is the half a check can see; a sentence
that is merely no longer true passes every gate this repository has.

Nothing decays as quietly. A stylesheet whose rules moved out into their own
component files left behind a page listing what a passage sets — headings,
lists, tables, none of them scoped there any more — and a worked example
quoting a rule that was written for the paragraph and never existed in the
tree. Both read as authoritative for as long as every name in them stayed
spelt correctly, which is exactly as long as nobody checked.

A page that turns out to be wrong about something the change did not touch is
still worth fixing, in a commit of its own: it is the one kind of bug a reader
cannot see, because a document is what they came to trust instead of reading
the source.

## Committing

Stage only the files you changed — `git add <path>`, never `git add .` or
`-A`. The working tree normally carries somebody else's work in flight:
regenerated `packages/frontend/dist/` output, untracked drafts, a screenshot run. Sweeping it
into your commit buries a change nobody reviewed under a message that does not
mention it.

**Commit your own work in small parts, each one as it is finished** — not the
whole session at the end of it. A part is finished when it stands on its own,
the gate is green over it, and it could be reverted without taking anything
else along: one component, one rule, one rendered page, the generated side
alongside the source that moved it. That is the size at which a message can
name what changed, a review can disagree with one decision instead of twenty,
and a bisect lands on something small enough to read. A session that arrives
as a single commit has thrown that grain away — work that was already done and
green sits unreviewed beside work that is still in flight, and neither can be
moved without the other.

## What fails review

- **A component is shown three times.** A story for every element, a specimen
  or an element that draws every class the stylesheets define, and a page the
  Guides renderer produced — `packages/guides-theme/acceptance/`. Anything built on the
  system follows the page layouts and invents no class of its own. `make
  coverage` is the check. `PENDING` in `scripts/coverage.ts` is the work list
  and only shrinks; `ELSEWHERE` beside it is the other answer — an element a
  document has no node for, which is a classification rather than a debt and
  fails just as loudly if it ever does turn up in the render.
- **Web components first.** `<sds-code code-lang="bash">`, never a `div` with
  the classes on it. The classes are the fallback for surfaces that run no
  JavaScript, not the front door.
- **Specimen classes stop at the card.** A card links `_specimen.css`; an
  element and a starting point link only `styles.css`, so neither may write a
  `spec-*` class. The `classes` check holds that boundary separately from the
  repository-wide class vocabulary.
- **A component's whole contract is in its own file.** Every element renders
  the class box it draws *inside itself*, always — so each one has three rules
  that only mean anything together: the element carries the step, the box it
  renders gives that up, and the same box standing alone carries it. They sit in
  a `@layer base` block above the component's own, because a container in
  `layout` takes the step back and a step stated in `components` would win over
  the container that already paid the gap. Its display is there too. Split
  across a shared list and a component file, a contract drifts into two layers,
  and a rule in the lower one silently never wins.
- **A component is a property set, and its variants only assign to it.** One
  file per component under `packages/frontend/src/styles/components/`, its own
  `--sds-<name>-*` set declared at the top and derived from the shared tokens,
  every declaration below reading only that set. A variant, a size and a state
  assign values and draw nothing — so a state is written once whatever the
  variant, and a surface needing one instance different sets a property rather
  than a class this system never heard of. A value that reaches a declaration
  without passing through the set is how `1.55` ends up in one component and
  `--leading-body` in every other. `make verify ARGS=sets` holds it, and the
  two things read straight are named there: the focus ring, which is one ring,
  and the colours that mean something. A set has to sit on an ancestor of
  everything that reads it — a property travels down and never sideways or up,
  which the check cannot see and the suite has caught three times.
  `docs/frontend/stylesheets.rst` carries the shape;
  `packages/frontend/src/styles/components/button.css` is the model.
- **What belongs to one subject stands in its block.** The stylesheets are
  written with native CSS nesting: a state, a condition and a descendant rule
  sit inside the block of the selector that owns them. Nesting is scope, never
  weight and never names — a nested rule re-enters through `:is()` with the
  parent's full specificity, so a rule moves inside a block only when the
  selector it desugars to is the one it already had flat. A variant stays a
  top-level rule under its full name, a part addressed as a bare class stays
  where it is, and what is written weightless — `:where()` — stays written
  out, because zero specificity is the point.
  `docs/frontend/stylesheets.rst` carries the reason;
  `packages/frontend/src/styles/components/button.css` is the model here too.
- **A component is addressed, never rebuilt.** Everything that fits in a string
  is a property; between the tags goes only what an attribute cannot carry, and
  that is content rather than structure. A `sds-x__y` class is `sds-x`'s own
  name for its own node and may be written nowhere else — `make coverage`
  fails on one in the theme. The Guides pages are rendered before they are
  published so this costs a reader with no script nothing; see `SKILL.md`.
- **Comments carry the reason, not the story.** No changelog, no anecdote, and
  never the name of another project — this system is used by things it does
  not know about. Five lines, ten at the top of a file; see above.
- **One accent.** `--accent` marks three things and nothing else; `--orange-*`
  is the raw scale and never appears in a design. It is also the one colour a
  surface may be *lit* with — `--accent-glow` in the top of a card's frame
  under the pointer, and the single gradient in the system.

`SKILL.md` has the rest, including the checklist to run before calling
anything done.
