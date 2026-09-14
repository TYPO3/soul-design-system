# Navigating this repository

Read this first, then the one document below that answers your question. This
file says where the rules are and what you can edit.

An agent's notes belong here too, in the section they concern. Never keep them
in a private memory beside the repository. A rule only one reader can see is a
rule nobody else can follow or correct.

**The whole repository follows from `packages/frontend/src/`.** You write
the tokens, the `sds-` class layer and the Lit elements by hand. The tasks
generate the cards, the screens, the package and the bundle from them. The
next generate reverts an edit to a generated file, or the gate fails on it.

## One language

Every text in this repository is English: the documents, the comments, the
commit messages, the strings a task prints, the notes in this file. People who
do not share a first language read this tree, and agents answer in the
language of the prompt. One language holds it together. A second language
splits the readers of every line it touches.

The rule binds what you write down, not the conversation. Speak to the room in
its language, and write English into the tree.

Text in another language is not a note for later. Stop the work in hand,
translate it, commit that on its own, then continue. Treat it like a red gate:
the next reader inherits it, and the next agent copies its tone.

No file is exempt. A rule with a standing exception reads as a preference, and
a later reader copies the exception.

## How a text is written

**Every text in this tree follows ASD-STE100 and the terse rule.**
`docs/design-system/writing.rst` is the rule, and `make verify ARGS=prose`
is the check. The limits that count while you write:

- 25 words in a sentence, 20 in an instruction: a list item, a table cell, a
  step.
- 6 sentences in a paragraph, one topic.
- Active voice, simple present, no -ing verb forms.
- `must`, `can` and `will`. Not `shall`, `should`, `may`, `might`, `could`
  or `would`.
- One meaning per word, and the approved word: "make sure", not `ensure`.
- Say it once. Cut the story, the second example and the aside. Keep the
  reason.

The rule binds documents, comments and every string a component or a task
prints. A technical name in mono counts as one word and keeps its spelling.
The standard's dictionary is the authority for a word the page does not name.
`WORDS_REPLACED` in `scripts/prose.ts` is where a word goes when review finds
it.

## No document counts the parts

No document says how many of a thing there are: not how many elements, cards,
checks, suites or icons. Name the thing and say where its list lives. `make
verify ARGS=--help` names the checks, `TASKS` in `scripts/task.ts` names the
tasks, `stories/` holds the specimen.

A count is a second copy of a fact the tree already states, and nobody
regenerates it. It is wrong at the next component, and no check sees that. A
reader who needs the figure counts the directory.

This binds counts of parts, not numbers as such. A value the design rests on
is the rule, and you write it exactly: a size, a radius, a viewport width, a
version. A number that records a past event does not drift.

## How long a comment can be

**Five lines, and ten for the one at the top of a file.** The budget counts
the `/*` and the `*/`. A block that needs more carries more than the reason.
Cut the rest, not the reason: what the line below says, what it used to be,
when it broke, the second example, the aside.

A reason that takes fifteen lines is a decision about the system. It belongs
beside its rule in the published documentation, where a reader opens it on
purpose.

The budget binds comments. A message a task prints, an error thrown at a
caller and the documents are not comments.

## Which document answers what

| Question | Read |
| --- | --- |
| What is this, how do I run it, which task generates what | `README.md` |
| Where a source lives and which output a task derives from it | `docs/maintaining/source-and-output.rst` |
| Why packages leave through mirrors, and how they stay installable | `docs/maintaining/package-splits.rst` |
| How a maintainer authenticates and publishes a package mirror | `MAINTAINERS.md` |
| How to *design with* the system: the build rules | `SKILL.md` |
| How to write a text: the standard, the terse rule, the limits | `docs/design-system/writing.rst` |
| How to write a stylesheet: layers, flow contract, sets, nesting | `docs/frontend/stylesheets.rst` |
| Why a design rule exists | its page under `docs/design-system/` or `docs/frontend/` |
| Drawing a signet to the construction | `docs/design-system/signet-prompt.md` |
| Where the icons and fonts came from, and under what licence | `THIRD-PARTY.md` |
| How to take the theme into a project of your own | `docs/guides-theme/` |

`SKILL.md` is the operating instruction. The published page carries the rule
and its reason. If a change deviates from `SKILL.md`, read that page before
you decide.

## A page lives where the menu puts it

**In `docs/`, the tree on disk is the tree in the navigation.** A page under a
section in the menu is a file in that section's directory. The section's own
page is the `index.rst` beside its children, and its `toctree` names only what
lies below it. A page with no children is a single file. It becomes a
directory with an `index.rst` on the day it gets one. A `../` in a `toctree`
breaks the rule.

This binds the whole move. A renamed menu entry renames the directory. A page
that moves between sections moves the file, its entry in the old `toctree` and
the links to it. `make verify ARGS=refs` names what stayed behind.

The menu is the only map most readers get. An editor arrives from the
published page or from the checkout. A tree that agrees with the menu answers
both with one lookup.

## What `packages/` means

Every directory under it goes to a repository of its own, and a release
publishes it from there. `packages/frontend/` goes to npm as
`@typo3/soul-frontend`, and `packages/guides-theme/` to Packagist as
`typo3/soul-guides-theme`. Nothing else in the tree leaves. A directory put
there is a promise that it will.

`make split ARGS=<name>` assembles one package and replays its commits into
`.out/split/`. `make split ARGS=--check` is the gate's question: both still
make a package a project can install. Only this repository holds the source
of either. Nobody writes to a mirror: the next release overwrites a commit
made in one.

`MAINTAINERS.md` documents publication, authentication and reruns.
`.github/workflows/split.yml` is their executable source. `scripts/split.ts`
assembles and reports the push commands. It does not make that external
change.

**A package's README names everything the package adds, in full and in short
form.** Every directive of the theme's own with its options, every field a
document can write, every setting. A reader of the mirror has only that file:
the split does not carry `docs/`, and the manual is a site somewhere else. What the
package gains lands in the README in the same commit. A surface listed nowhere
is half-shipped.

## What you can edit

| Path | |
| --- | --- |
| `packages/frontend/src/tokens/*.css` | the values: colour, type, controls, spacing, radius, motion |
| `packages/frontend/src/styles/components.css` | the `sds-` class vocabulary |
| `packages/frontend/src/styles/styles.css` | the single entry point |
| `packages/frontend/src/styles/_specimen.css` | card chrome only, outside the `styles.css` closure on purpose |
| `packages/frontend/src/components/*.ts` | the Lit elements and their template functions |
| `packages/frontend/src/lib/` | the element base, the form base, the field's box and row, the icon inliner, the static renderer, the grammars |
| `stories/` | the specimen the cards and screens come from |
| `docs/` | the published documentation, and the prompts it prints |
| `packages/guides-theme/` | the Composer package: templates, directives, the acceptance render |
| `tests/*.spec.ts` | the Playwright suite |
| `scripts/` | the tooling behind the tasks |
| `.storybook/`, `.infra/`, `.github/` | the documentation surface, the container, the gate on every push |

Generated. Never edit one, never hand-write a new one:

| Path | Regenerated by |
| --- | --- |
| `specimens/` | `make cards` |
| `packages/frontend/dist/` | `make dist`. Committed on purpose: it is the drop-in |
| `.out/bundle/` | `make build` |
| `.out/site/` | `make guides`. Untracked. Node renders every element on the way out, so a page holds its markup before a script runs |
| `.out/acceptance/` | `make guides`. The theme's control surface, rendered every run and published never. A root of its own, because a page below another root resolves its assets differently |
| `.out/theme/`, `.out/consumer/` | `make guides`. The theme as the published package, and the renderer built against it with the Composer commands the manual prints. `--released` names the mirror instead |
| `.out/release/notes.md` | `make notes`. What the release page will say, from the commits under the tag. The release job writes it again on the runner |
| `docs/_cards/`, `packages/guides-theme/acceptance/_cards/` | `make embed`, and `make cards` ends with it. The generated cards beside the documents that embed them, because a renderer carries only what a parsed page points at |
| `docs/_images/signet*.svg` | `make embed`. Committed, copied from `packages/frontend/assets/`. `marks` in `scripts/lib/projects.ts` says which file is which drawing |
| `packages/frontend/fonts/` | `make fonts`. Committed, because the package publishes it and a mirror ships only what git has |
| `packages/frontend/assets/icons/`, `packages/frontend/src/components/icons*.generated.ts` | `make icons`. Committed: a mirror replays what git has, so every file a package ships or names is a file git keeps |
| `packages/frontend/src/components/diagrams*.generated.ts` | `make diagrams`. The drawings' viewBoxes and shapes, read out of `packages/frontend/assets/diagrams/` |
| `packages/guides-theme/resources/highlight/*.generated.json` | `make grammars`. The grammars written under `packages/frontend/src/lib/grammars/`, as the JSON the theme's PHP highlighter loads. One grammar keeps the server and the page the same colour |

**Everything generated that git does not keep is under `.out/`.** One root,
so a reader finds a task's output without a list. `GENERATED` in
`scripts/lib/cards.ts` holds the path, and `make clean` removes it whole. What
stays ignored outside it belongs to somebody else, or sits where something
reads it. That is `node_modules/`, the design-sync skill's `.ds-sync/` and
`.design-sync/.cache/`, the drop-in beside a page the renderer writes, and
`packages/frontend/.dist-check/`.

The next generate reverts a card edited by hand. A card with no story behind it is a build
failure. The `@dsCard` header on a card and `@startingPoint` on a screen are
the contract with the Design System pane, and `make verify` enforces them. A
marker's metadata uses literal Unicode, never an HTML character reference: no
browser decodes comment data.

## Running anything

Every task runs in the container. The host needs Docker and Make, nothing
else. `npm run` does not exist here on purpose.

```sh
make          # the task list, with what each does
make start    # bring the stack up; it takes the old one down first
make status   # what is running, and where it answers
make verify   # the gate
make test     # the Playwright suite
```

`make start` tears down before it comes up. Do not run it to check a stack:
`make status` is that question. Restart only if `.infra/` or the compose file
changed.

The `TASKS` map in `scripts/task.ts` is the task list. The `Makefile` only
decides how to get into a container. The targets not in that map are about
the containers themselves: `start`, `status`, `stop`, `logs`, `shell`,
`clean`. `make tasks` asks the container. Flags reach a task through `ARGS=`:
`make cards ARGS=--check`.

## How a task speaks

**Every task prints through `scripts/lib/report.ts`, and nothing else calls
`console.log`.** A task opens with its name and what it is for. It says one
row per thing it checked: verdict, name, what it holds, its numbers. It
closes on a verdict. A finding stands under the row that found it. Colour
arrives only on a terminal, and colour alone says nothing.

A task that another one runs speaks the contract: under `SDS_REPORT=1` its
first line is the facts, and every line after it is a finding. `verify` reads
that. A check that prints nothing must not read like a check that passed.

Set the variable by hand to see what the gate sees: `SDS_REPORT=1 node
scripts/fit.ts`. Write a new task the same way.

## The gate

`make verify` runs these checks, in this order. Each has a name, and the name
is how you ask for one:

| Check | What it holds |
| --- | --- |
| `assets` | the generated fonts and icons are there |
| `diagrams` | the modules match the drawings |
| `grammars` | the theme's copies of the written grammars |
| `marks` | the documents' signets against those drawings |
| `headers` | `@dsCard`, `@startingPoint`, literal metadata |
| `heights` | specimens against the cards they embed |
| `classes` | every class in use has a definition in the layer that can load it |
| `coverage` | every component has its three places |
| `formats` | every node the theme renders has a page and a twin |
| `names` | every `sds-` name a document writes exists |
| `values` | every figure beside a token is that token's |
| `refs` | every local reference resolves |
| `sets` | a component draws from its own property set |
| `breakpoints` | every width the layer changes at is one a document names |
| `fit` | render, inside the declared viewport |
| `ssr` | every element renders outside a browser |
| `version` | every manifest names the same one |
| `dist` | the committed drop-in against its source |
| `split` | each package assembles into something a project can install |
| `cards` | every card against its story, and none without one |
| `types` | `tsc --noEmit` |
| `css` | the stylesheets against their shape; `make css` fixes what it can |
| `php` | the theme's sources against the coding standard |
| `prose` | every text against ASD-STE100 and the terse rule |
| `conventions` | the names in `.design-sync/conventions.md` against the built stylesheets |

`make test` runs these suites. Each guards what the others cannot see:

| Suite | What it holds |
| --- | --- |
| `parity` | the element rendered by Lit and by `@lit-labs/ssr` is the same markup |
| `stories` | every story renders in both themes, silently |
| `pages` | the page layouts at every width they must survive |
| `viewports` | every layout band is selectable from the toolbar |
| `a11y` | axe on the specimens, serious and critical only |
| `dropin` | `packages/frontend/dist/` works the way a consumer copies it |
| `defaults` | unclassed content: what a page gets before it reaches for a class |
| `content` | content between an element's tags survives its upgrade |
| `forms` | a form submits what it shows, and a reset puts back what the markup said |
| `states` | what the pointer changes on a control: no box moves, and every state colour resolves |
| `select` | the drawn list: the keys, what it says about itself, and the real `select` underneath |
| `dialog` | the question a dialog asks: the pair, the two events, the size cap, and the head every surface draws |
| `run` | work in progress: which rows are a control, the name of every state, and a fold that survives |
| `tree` | a directory: a level is how deep it stands open, and the fold works with no script |
| `copy` | a value carried off: what reaches the clipboard, the button names, and a press that says so in words |
| `table` | the way into a row: an anchor at its end, one keyboard stop per row, a column at its edge |
| `toc` | the contents list: which section it marks, and the mark inside a box too short for the list |
| `dropdown` | the popover: not clipped, under its button by either route, and closed the way the platform closes one |
| `highlight` | every language `CodeLang` promises has a grammar |
| `manager` | the Storybook shell boots |
| `search` | a hit in the site index resolves from a page below the root |
| `guides` | the rendered site, opened: the theme's findings, the page with no script, the Markdown twin beside every page |

Never disable an addon, a spec or a threshold to get a green run.

### Not every change needs the whole gate

The gate is what a piece of work ends against, not the loop inside it.
While you work, run the narrowest thing that can fail on what you touched.
Ask for a check by name, and a spec by path:

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
| a stylesheet, for its shape alone | `make verify ARGS=css`; `make css` fixes |
| a document, a comment or a printed string | `make verify ARGS=prose` |
| a document that names a class, an element or an event | `make verify ARGS=names` |
| a token's value, or a comment or caption that quotes one | `make verify ARGS=values` |
| a new component, class or Guides page | `make verify ARGS=coverage` |
| a directive, a node or a template of the Guides theme | `make verify ARGS=formats`, then `make guides` |
| a card's height or its viewport | `make verify ARGS="fit heights"` |
| a `@media` width, in any sheet | `make verify ARGS=breakpoints` |
| `packages/frontend/src/`, with `packages/frontend/dist/` committed against it | `make verify ARGS=dist` |
| `scripts/soul-check.ts`, or what `lib/elements.ts` reads out of a component | `make dist`, then `make verify ARGS=dist`; both ship from `dist/` |
| a drawing in `packages/frontend/assets/diagrams/` | `make verify ARGS=diagrams` |
| a grammar in `packages/frontend/src/lib/grammars/` | `make grammars`, then `make verify ARGS=grammars` and `make test ARGS=tests/highlight.spec.ts` |
| a mark in `packages/frontend/assets/`, or the signet a `guides.xml` names | `make verify ARGS=marks` |

A partial run says which checks it ran and that it is not the gate. Only the
whole sequence prints `✓ design system is consistent`. A name that is not a
check is an error. `conventions` is the one check that reads `.out/bundle/`,
so it assembles the bundle first; the others do not pay for it.

Run the whole gate before you call anything done, before a commit, and when a
change crosses layers: a token, `components.css`, a build script. A narrow run
is a step, never the answer to "is it green".

`.github/workflows/ci.yml` runs `make verify` and `make test` on every push,
in the same image. On `main` and behind that gate it mirrors the packages,
then renders and deploys `.out/site/` from the theme it has just pushed. The
Storybook the suite built on the way, `.out/storybook/`, goes out under that
site at `storybook/`. One Pages site per repository, and one build of it, the
one the suite tested. That is why every path a story writes is relative to
the preview page — `assets/…`, `specimens/screens/…` — and `make cards`
counts the climb in for a card. All of it is a net under the rule, not a
replacement: a red run there is a commit already pushed.

## Recipes

**Change a component.** Edit `packages/frontend/src/components/<name>.ts`,
then `make cards`, then `make verify`. The card is static HTML with no custom
element in it: the Design System pane opens it with `styles.css` and no
JavaScript.

**Add a component.** The element in `packages/frontend/src/components/`, its
classes in `packages/frontend/src/styles/components.css`, a story in
`stories/components/`, then `make cards`. Then give it a place in the Guides
render: a template that emits it, or a page of the fixture that asks for it.
`make coverage` names what is still missing.

**Close a gap in a component.** In the component. A consumer who writes three
declarations into their own stylesheet is the failure this system exists to
prevent. Everything the classes can do, the element must emit.

**Add a directive to the Guides theme.** A directive is complete with all of
these:

- the directive in `packages/guides-theme/src/Directives/` and the node it
  returns;
- its two templates under `resources/template/body/directive/`: `.html.twig`
  for the page and `.md.twig` for the twin, beside each other;
- the registration in `resources/config/soul.php`;
- **the node's template in the `templates` list in `SoulExtension.php` and in
  `resources/template/markdown.php`**. A node with none renders as its own
  text;
- a page of `packages/guides-theme/acceptance/` that uses it;
- its section in `docs/guides-theme/directives.rst` with a rendered example;
- its row in the package's own README.

Then `make guides` and `make verify`.

**Add a font family or style, or an icon category.** Edit the `FAMILIES` list
in `scripts/fonts.ts` or `CATEGORIES` in `scripts/icons.ts`, then `make
fonts` or `make icons`. An icon arrives with its whole category. Never edit
the generated output. A missing icon goes to TYPO3/TYPO3.Icons first: the
script fails rather than substitute one from another set.

**Add a language for code blocks.** Name it in `CodeLang` in
`packages/frontend/src/components/code.ts`, register its grammar in
`packages/frontend/src/lib/highlight.ts`, add a sample to
`tests/highlight.spec.ts` and a block to `packages/guides-theme/acceptance/`.
If highlight.js ships the grammar, that is all. If not, write one under
`packages/frontend/src/lib/grammars/` as data: no function and no regular
expression literal. `make grammars` writes the same modes out as the JSON the
theme's PHP highlighter loads.

**Add or redraw a diagram.** One file in
`packages/frontend/assets/diagrams/`, shapes in `<g id="soul-ref">`, every
colour written `var(--token, #light)`, then `make diagrams`. There is no dark
copy: a page references the drawing, and it reads that page's tokens.

**Change what a consumer has to run.** The steps are `scripts/lib/site.ts`,
shipped as `packages/frontend/dist/soul-finish.js`. Change those, then `make
dist`: `make guides` installs the theme package and runs the built file, so an
unbuilt change reaches this site as the old one. What a project runs is
`docs/guides-theme/_starter/publish.yml`, quoted whole into the manual and
taken command for command by `make guides`.

**Cut a release.** `make release ARGS=<version>`, and nothing before it. It
runs the gate and the suite, and it refuses a dirty tree or an existing tag.
It writes the number into every file that carries it, commits those files and
makes the tag. It pushes nothing. Both packages take the same version, because
the tag is this repository's own.

The push of the tag is the release. The gate runs over it, and the mirrors
carry the tag across. The release job publishes npm from the tagged tree, and
Packagist reads the theme off the tag. `MAINTAINERS.md` has the whole of it.
`make notes ARGS=v<version>` is the release page before the tag exists.

**A visual refactor.** `make baseline`, change, `make shots && make diff`.
Anything that moved, moved on purpose.

**`make diff` is clean, and the reason it was not is worth a note.** Two runs
of the same tree reported changed cards. Every one was a card painted in a
fallback face while `document.fonts` reported the face `loaded`. `openCard`
asks the one question with no wrong answer: the same string in the shipped
family and in a family that does not exist. Equal widths mean the fallback
drew both, and `loadFonts` retries until that holds.

`map` runs one page at a time, which removes the race between pages that
fetch `file://` faces. Two documents have no fix, and the output names them
instead of a measurement. A document that embeds another `file://` document,
an `<iframe>` or an external `<svg>`, never applies its own faces.
`specimens/screens/tour.html` and the diagram cards are those.

**Change a size or a gap.** Through a token or a component's set, never as a
value in a declaration. `make verify ARGS=sets` holds the route. Then the
visual-refactor recipe, because a changed distance is a visual change.

**Ship to the design agent.** `make design-sync` is build, gate, what will
change, and the plan. `make design-status`, `make design-plan` and `make
design-synced` are the same steps one at a time. Every one carries the
`design-` scope because `status`, `plan` and `project` name other things
here.

`make design-project` says which claude.ai project a sync uploads into and
sets it. Without one, a re-sync creates a new project.
`docs/design-system/design-with-claude.rst` is the reader's half.

## What a change owes the documents

**A change is complete when every page that describes it is true again, in
the same commit.** Before you call anything done, open what the change
touches. That is `SKILL.md`, the page under `docs/` with the reason, the
README of the package whose surface moved, and this file. Read the passage
rather than search it for a name. `make verify ARGS="names refs"` holds the
names and the links. A sentence that is no longer true passes every gate this
repository has.

A page that is wrong about a thing the change did not touch is still worth a
fix, in a commit of its own. It is the one bug a reader cannot see, because a
document is what they trust instead of the source.

## Committing

Stage only the files you changed: `git add <path>`, never `git add .` or
`-A`. The working tree carries somebody else's work in flight. A sweep buries
a change nobody reviewed under a message that does not name it.

**Commit your own work in small parts, each one as soon as it is complete.**
A part is complete when it stands on its own, the gate is green over it, and
a revert takes nothing else along. That is one component, one rule, one
rendered page, or the generated side beside the source that moved it. At that
size a message can name what changed, and a bisect lands on something small
enough to read.

**A subject reaches the public.** `<scope>: <sentence>` is what the release page
lists, grouped by that scope and read by people who never open this tree.
`make notes` is that page. The sentence says what the work does for whoever
installs it. The scope is the part of the system it did it to.

## What fails review

### A component has three places

A story for every element, a specimen or an element that draws every class,
and a page the Guides renderer produced: `packages/guides-theme/acceptance/`.
Anything built on the system follows the page layouts and invents no class.
`make coverage` is the check.

`PENDING` in `scripts/coverage.ts` is the work list and only shrinks.
`ELSEWHERE` beside it names an element a document has no node for, and fails
as loudly if one turns up in the render.

### Web components first

`<sds-code code-lang="bash">`, never a `div` with the classes on it. The
classes are the fallback for a surface with no JavaScript, not the front door.

### Specimen classes stop at the card

A card links `_specimen.css`. An element and a starting point link only
`styles.css`, so neither writes a `spec-*` class. The `classes` check holds
that boundary.

### A component's whole contract is in its own file

Every element renders the class box it draws inside itself. So each one has
three rules that only mean anything together. The element carries the step,
the box it renders gives that up, and the same box alone carries it.

They sit in a `@layer base` block above the component's own. A container in
`layout` takes the step back, and a step in `components` wins over the
container that paid the gap. Its display is there too.

### A component is a property set, and its variants only assign to it

One file per component under `packages/frontend/src/styles/components/`. Its
own `--sds-<name>-*` set stands at the top, derived from the shared tokens,
and every declaration below reads only that set. A variant, a size and a state
assign values and draw nothing. `make verify ARGS=sets` holds it and names the
two things read straight: the focus ring and the colours that mean something.
A set sits on an ancestor of everything that reads it: a property travels
down, never sideways or up. `docs/frontend/stylesheets.rst` carries the
shape; `packages/frontend/src/styles/components/button.css` is the model.

### What belongs to one subject stands in its block

The stylesheets use native CSS nesting. A state, a condition and a descendant
rule sit inside the block of the selector that owns them. Nesting is scope,
never weight and never names.

A nested rule re-enters through `:is()` with the parent's full specificity.
So a rule moves inside a block only if the flat selector had that
specificity. A variant stays a top-level rule under its full name, and
`:where()` stays written out. `docs/frontend/stylesheets.rst` carries the
reason.

### Address a component, never rebuild one

Everything that fits in a string is a property. Between the tags goes only
what an attribute cannot carry, and that is content, not structure. A
`sds-x__y` class is `sds-x`'s own name for its own node. Nothing else writes
it, and `make coverage` fails on one in the theme. Node renders the Guides
pages before the deploy, so this costs a reader with no script nothing. See
`SKILL.md`.

### A control belongs to the form, and its value is a real control's

Every element a form holds extends `SdsFormElement`, which is
`ElementInternals`. So a reset reaches the element, and a `<fieldset
disabled>` reaches what is under it. An `error` a caller wrote is a validity
the browser refuses to submit past.

Internals never carry the value. Each element renders a named `<input>`,
`<select>` or `<textarea>` into the light DOM. That is what a prerendered page
submits before a script runs.

A `.checked` or `.value` **binding** is the other half of the same rule. The
static renderer writes it out as `checked="false"`, which in HTML means
checked. So `updated()` writes the live state onto the control, and the
attribute stays the default a reset puts back.

### Comments carry the reason, not the story

No changelog, no anecdote, and never the name of another project: this system
serves things it does not know about. Five lines, ten at the top of a file.

### One accent

`--accent` marks three things and nothing else. `--orange-*` is the raw scale
and never appears in a design. The accent is also the one colour that can
*light* a surface: `--accent-glow` in the top of a card's frame under the
pointer. That frame and the hatch a running progress bar draws in its own
fill are the two gradients in the system. There is no third.

`SKILL.md` has the rest, with the checklist to run before you call anything
done.
