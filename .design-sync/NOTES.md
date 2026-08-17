# design-sync notes — Soul Design System

Everything a future sync should know before touching the claude.ai/design
upload. **This is one export of the design system, not the system itself** —
the repository wiring and its load-bearing decisions live under
`docs/maintaining/`, while `SKILL.md` governs designs made with the system.

## What gets uploaded

The design system is CSS, tokens and Lit components; this uploads a **flat
snapshot** of them. `scripts/build.ts` is the converter — the standard
design-sync one (`package-build.mjs`) does not apply, because this is not a
React package. `package-validate.mjs` still applies and still has to exit 0.

The bundle is flat where the repo is not: `styles.css`, `_ds_bundle.css`,
`_specimen.css` and `tokens/` all sit at its root, while the repo keeps the
three stylesheets in `styles/`. The converter rewrites both the imports and
the cards' links on the way out, so **a change to the repo layout is a change
to `rewriteDepth` and to the `@import` rewriting in `scripts/build.ts`.**

`_ds_bundle.js` carries the Lit elements built from `packages/frontend/src/index.ts`, with the
`@ds-bundle` header listing every tag. It used to be an intentionally empty
namespace; any note claiming that predates this and is wrong. The count is
not written down here on purpose — `make verify` checks the header against
the build, which is the only place it stays true.

**The app rebuilds `_ds_bundle.js` and what it writes there registers nothing.**
Read the file back out of a project and it is the app's own, not the upload: a
`format: 4` header, `"components": []`, `unexposedExports`, and a body that
does no more than create `window.SDS`. It is compiled from component sources
the app can read — `.jsx` from a React kit — and this system ships none of
those, so the 174 KB that went up is replaced by a stub. `_ds_manifest.json` is
compiled from that stub, which is why its component list is empty whatever the
uploaded header says. So the bundle also ships as **`soul.js`** — the drop-in's
own name, since it is the drop-in's own code, and a name the app does not claim.
That is what the conventions header tells a design to link. Check it after a
sync: `DesignSync get_file soul.js` should be the real bundle, and a design
linking `_ds_bundle.js` upgrades nothing.

**It is `packages/frontend/dist/soul.js`, copied.** The bundle used to build the
elements a second time with options of its own, which put a file nothing tests
in front of the design agent while the suite went on linking the drop-in. So
`make build` needs `make dist` to have run, and says so rather than shipping
nothing; `make verify ARGS=dist` is what holds that copy against `src/`. It is a
module and exposes no global — the `namespace` in the header is the app's field,
not a promise this file keeps.

The class layer is not copied the same way. `soul.css` is one file with the
tokens folded in, while the pane reads `tokens/*.css` as separate files to build
its token index, so the bundle keeps the split and hands over `styles.css` plus
`_ds_bundle.css`.

**The header's component entries are read by `name` and `sourcePath`**, and
each names a contract under `components/Elements/<Class>/`. Anything else in an
entry is ignored — `tag` is kept because `make verify ARGS=conventions` holds
the prose against it, and `export` because it is what `window.SDS` answers to.
This was found the hard way: with entries of `{tag, export}` the app compiled
`"components": []` into `_ds_manifest.json` while every card, token and screen
came through, so the design agent was handed a system of classes and wrote
classes. Read the manifest back after a sync that touches the header —
`DesignSync get_file _ds_manifest.json` — and check that list is not empty.
The shape is the sync kit's own (`.ds-sync/lib/bundle.mjs`, `stampHeader`) and
unofficial, so it is a strong lead rather than a spec.

## The project id is yours, and it is what makes an update an update

Anyone can sync this system into a claude.ai design system of their own — that is
why the converter ships and not only its output. `make design-sync` is a normal
target, not a maintainer one.

What the id buys is the *second* sync. Without one, every run imports afresh
and there is no way to tell an update from a new project: the anchor has
nothing to compare against, no deletes can be computed, and the pane fills up
with duplicates. With one, everything in this file works.

It stays out of the committed `config.json` because it is per-person, not
per-repository — a clone must not inherit someone else's project as its
default target. It is not a credential either way: the API authorises the
caller's own login, and the id opens nothing for anyone else.

`scripts/design-plan.ts` looks in three places, in order:

1. `SDS_DESIGN_PROJECT` in the environment
2. `.design-sync/config.local.json` — gitignored, `{"projectId": "…"}`
3. `config.json` itself — still honoured, for a fork that prefers it there

`make design-project` reads all three and says which answered; `ARGS=<uuid>`
writes the second, and refuses to replace a different id without `--force`.
With none of them the plan still writes, and its preflight says to create a new
design system rather than adopt anything — which is the recommended first
import, and what `/design-sync` does when no id is set.

**`ARGS=--forget` is the reset**, and it drops the id, the cached anchor and the
plan together. They are one state: an anchor kept across a change of target
describes a design system nobody is uploading to, so the next plan computes
deletes against a file list the new one never had, and `design-status` answers
about the old one. The baseline screenshots in the same cache belong to the
visual review and are left alone.

## Doing a sync

The repo's half is one command: `make design-sync` — build → verify → design-status →
plan. It ends by telling the user to run `/design-sync`, which is the upload.

**First, seed the reference state — before `make design-sync`.** Fetch the
project's `_ds_sync.json` (`DesignSync get_file`) to
`.design-sync/.cache/remote-sync.json`. That file is the authority on what
the project holds; the local cache is only a copy of it and is gitignored,
so on any machine but the last one that synced, it is absent or stale. With
it in place the plan computes exact deletes; without it the plan says so and
computes none.

**Execute `.design-sync/.cache/upload-plan.json`. Do not improvise it.**
`make design-plan` writes it: the finalize_plan globs, and five numbered steps
in the order they must run, with the exact file and delete lists. It is
generated from the build and the previous anchor, so it cannot forget a
renamed file the way a hand-derived list can — that is precisely how 19
renamed font files were left orphaned in the project.

Deletes come from the anchor's `files` list, which `scripts/build.ts`
records. An anchor without that field (anything uploaded before this was
added) makes the plan say so and refuse to guess: compare `list_files`
against the build yourself that one time.

**Chunk the content write at 100 files, not the documented 256.** The tool's
own limit is 256 per `write_files`, and a call of exactly that — 256 files,
906 KB — answers `HTTP 500 internal`. It is the file count rather than the
payload: 4 files totalling 614 KB go through, and so do 23 files totalling
2.4 MB, while the 256-file call fails whatever it carries. So the budget is
**≤ 100 files and ≤ 2 MB per call**, which is what the placeholder PNGs need
anyway at roughly a megabyte each. A 500 is not a reason to stop — send one
small call first to tell a sick API apart from an oversized one, then resize.

**Nothing in the anchor proves the assets unchanged, which is why the plan
uploads all of them.** `auxSha` is `sha12` of the *filenames* in `tokens/` and
nothing else — not their content, and not `fonts/`, `assets/` or
`guidelines/`. Between them `styleSha`, `renderHashes`, `screenHashes`,
`elementHashes` and `bundleSha12` cover the stylesheets, the cards, the
screens, the element contracts and the bundle; everything else is covered by
no hash at all. A re-sync that "only uploads what changed" from the anchor
diff is therefore guessing about 14 MB of illustrations and every font file.
Upload the whole list the plan names.

**The sentinel needs an explicit `mimeType`, and the plan carries one.**
`_ds_needs_recompile` has no file extension. Uploaded like everything else —
`localPath`, no type named — `write_files` answers `written: 1` and the file
is simply not there: `list_files` omits it, `get_file` 404s. Nothing reports
a failure, which is the whole problem. The sentinel is what tells the app to
rebuild `_ds_manifest.json`; without it every content file can be current
while the pane still serves the index it compiled last time, and the project
goes on showing a stale "last updated". Steps 1 and 4 of the plan therefore
carry `mimeType: 'text/plain'` and the 24 bytes inline. Verify it afterwards
with `get_file _ds_needs_recompile` — a 404 there means the sync did not
actually land, whatever the write count said.

**What the upload does and does not move.** Writing files does not bump the
project's `updatedAt`, does not recompile `_ds_manifest.json`, and does not
regenerate `_adherence.oxlintrc.json`. Those three are the app's own work,
done when it next opens the project and finds the sentinel. So the honest
report after a sync is "the files are current, the pane refreshes on next
open" — not "the project is updated".

The conventions header is checked mechanically: `make verify`, also
step 5 of verify. It never rewrites the file — the prose belongs to its
authors — it fails on two kinds of drift, and both matter because the header
is inlined into the design agent's prompt:

- **A name that no longer exists** — a class or token named there but absent
  from the build. The agent writes markup that silently does nothing.
- **An element the header does not name** — a tag the bundle registers but
  the prose never mentions. Nothing breaks; the element is simply never
  reached for, because the only document the agent reads does not say it is
  there. That is how the header went on describing nine custom elements
  while the bundle shipped seventeen.

Classes are checked in one direction only. `_ds_bundle.css` carries internal
and state classes the prose deliberately omits; the element list is the public
surface and is meant to be complete.

**Then run `make design-synced`.** It promotes the pushed anchor into
`.design-sync/.cache/remote-sync.json`, which is what `sync-status` and `plan`
compare against next time.

**Run it, and never upload over a red verify.** The chain is `&&`, so a
failure stops it and `sync-status` never runs — but nothing stops an agent from
calling the upload anyway. Don't. Every fault verify reports is one that is
invisible in review and wrong in every design afterwards: a class defined in
no stylesheet silently does nothing, a broken reference ships an unstyled
card, a card that overflows its declared viewport gets cropped in the pane.
Fix it, re-run, then upload.

Verify checks mechanics, not judgement. When `sync-status` lists changed cards,
look at them: `make baseline` before a visual change, then `make shots
&& make diff` after. Anything that moved should have moved on purpose.

Why the plan's order matters, since it looks like ceremony: the app
regenerates `_ds_manifest.json` and `_adherence.oxlintrc.json` from the
uploaded files when the project is next opened, and only the
`_ds_needs_recompile` sentinel triggers that. Push files without re-arming
it and the manifest keeps describing the previous upload — that is how it
came to list font filenames that had already been deleted. The anchor goes
last because it vouches for everything before it: uploaded first, a failure
mid-way leaves it swearing to files the project does not have.

The cache is gitignored, so on a fresh clone `sync-status` and `plan` correctly
say they have no reference point rather than guessing.

## Re-sync risks

- **`scripts/build.ts` is the converter.** If the design-sync skill's own
  scripts change their output contract, this one will not follow
  automatically — diff `.out/bundle/` against the skill's documented layout.
- **`.design-sync/conventions.md` is committed and human-editable.** Never
  rewrite it on a re-sync; re-validate that every class and token it names
  still exists in the build, and report drift — `make verify` does this and
  prints the counts, which is why none are repeated here. It also no longer says
  "no JavaScript components" — that claim was inlined into the design agent's
  prompt and became false the day the bundle got components.
- **`packages/frontend/assets/**` is not in the skill's default upload plan.** This repo's cards
  reference `packages/frontend/assets/icons` and `packages/frontend/assets/diagrams`, so the plan must include
  `packages/frontend/assets/**` in both `writes` and `deletes` or icons vanish from the cards.
- **Licensing is settled**: MIT, so a project may take a piece of this into a
  tree of its own without the tree following. Icons are MIT from
  TYPO3/TYPO3.Icons, fonts are OFL via `@fontsource`; both are recorded in
  `THIRD-PARTY.md`. `package.json` is still `private: true` — flip that only
  deliberately.
- **`packages/frontend/fonts/` and `packages/frontend/assets/icons/` are generated and gitignored.** They come
  from `@fontsource/*` and `@typo3/icons` via `scripts/fonts.ts` and
  `scripts/icons.ts`, both run by the container entrypoint when missing. A
  clone has
  neither, and every card then renders in system-ui with no icons — which
  looks like a design bug and is not one. `make verify` checks for this
  first and says which command to run. Adding a weight or an icon means
  editing the `FAMILIES` / `ICONS` list in the script, nothing else.
- **Upstream names are kept verbatim** in both generators — `actions-search.svg`
  is the TYPO3 icon identifier, `source-sans-3-latin-400-normal.woff2` is the
  @fontsource filename. Deliberate: a filename in this repo is always findable
  in the package it came from. Do not "tidy" them.
- All 33 icons were byte-compared against `@typo3/icons@5.0.3` `packages/frontend/src/` before
  the switch: identical apart from entity-encoded whitespace. `packages/frontend/dist/svgs/` is
  the SVGO-optimised tree and does *not* match — use `packages/frontend/src/`, as the script does.
- The `.ds-sync/` dir holds the skill's staged validator plus a `playwright`
  install used only for `package-validate.mjs`. It is gitignored and
  regenerated; the repo's own tooling uses the root `playwright` devDep.

## Known render warns

None. `package-validate.mjs` reports 39/39 rendering cleanly, 0 bad, 0 thin,
0 variants-identical. A warn on a future run is new — look at it.

## Thumbnails and starting points — what the app actually wants

There is **no thumbnail file**. Two invented ones (`_ds_thumbnail.html`,
`thumbnail.html`) were uploaded and removed again; `hasThumbnailHtml` never
flipped, because thumbnails are not files. Per Claude Design's own system
prompt, the thumbnail of a component *is* its `@dsCard`-tagged HTML, and the
thumbnail of a screen *is* the screen: "The screen itself is the thumbnail."
To change a thumbnail you edit that HTML. Do not invent a filename again.

`startingPoints` is the empty field worth filling. A consuming project shows
a **Starting Points picker** that seeds a new design from this system. A
screen is marked by making `<!-- @startingPoint section="<group>"
subtitle="<one line>" viewport="<WxH>" -->` the first line of its HTML; a
component is marked with `@startingPoint` in the JSDoc on its `.d.ts` props
interface. That route is open here and unused: every element ships a `.d.ts`
under `components/Elements/`, so the JSDoc has somewhere to live. This used to
read "not applicable here — this system ships no components", which was
written when the bundle was an empty namespace and stopped being true the day
the bundle got them.

Source: Claude Design's leaked system prompt, corroborated by the fields the
app actually writes into `_ds_manifest.json` (`startingPoints`, `cards`,
`templates`). Unofficial, so treat as a strong lead rather than a spec; the
official help centre documents none of this.

## Storybook, and how it must not touch the sync

Storybook is the documentation and authoring surface: `make storybook`.
It uses `@storybook/web-components-vite` — **never the React renderer**, for
the reason above.

**The hazard.** `.ds-sync/lib/detect.mjs` walks up to four directories deep
looking for a `.storybook/` config dir and switches the source shape to
`storybook` when it finds one. That shape expects React 18+ and a compiled
`packages/frontend/dist/` of React components, and it is not what this repo is.
`.design-sync/config.json` pins `"shape": "package"`, which overrides the
detector, and `scripts/build.ts` remains the converter. **Do not remove that
pin**, and if a future kit version stops honouring it, the fix is to pin it
again — not to let the shape flip.
