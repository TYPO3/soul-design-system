# design-sync notes — Soul Design System

What a sync has to know before it touches the claude.ai/design upload.
**This is one export of the design system, not the system itself.** The
repository's wiring lives under `docs/maintaining/`, and `SKILL.md` governs
designs made with the system.

## What goes up

The design system is CSS, tokens and Lit components. The upload is a **flat
snapshot** of them. `scripts/build.ts` is the converter. The standard
design-sync one (`package-build.mjs`) does not apply, because this is not a
React package. `package-validate.mjs` still applies and has to exit 0.

The bundle is flat where the repo is not. `styles.css`, `_ds_bundle.css`,
`_specimen.css` and `tokens/` all sit at its root, while the repo keeps the
three stylesheets in `styles/`. The converter rewrites the imports and the
cards' links on the way out. **A change to the repo layout is a change to
`rewriteDepth` and to the `@import` rewrite in `scripts/build.ts`.**

`_ds_bundle.js` carries the Lit elements built from
`packages/frontend/src/index.ts`, with the `@ds-bundle` header that lists
every tag. `make verify` checks the header against the build.

**The app rebuilds `_ds_bundle.js`** from component sources it can parse.
So the bundle ships as **`soul.js`** as well, the drop-in's own name, which
the app does not claim. The conventions header tells a design to link that.
After a sync that touches either, check both: `get_file _ds_bundle.js`
against the build, and `get_file soul.js`.

**It is `packages/frontend/dist/soul.js`, a copy.** So `make build` needs
`make dist` first, and says so. `make verify ARGS=dist` holds that copy
against `src/`. It is a module and exposes no global. The `namespace` in
the header is the app's field, not a promise this file keeps.

The class layer is not a copy. `soul.css` is one file with the tokens
folded in, while the pane reads `tokens/*.css` as separate files for its
token index. So the bundle keeps the split and hands over `styles.css` plus
`_ds_bundle.css`.

**A `.jsx` the app can parse fills `components`, not the header.** The app
builds the manifest from the sources it can compile. `elementJsx` in
`scripts/build.ts` writes `components/Elements/<Class>/<Class>.jsx` beside
the contract: a React function that spreads its props onto the tag. Keep
the header entries too. `make verify ARGS=conventions` holds the prose
against `tag`.

**The wrapper addresses the element and builds nothing.** `soul.js` still
upgrades it, and the conventions header tells a design to link that. A
wrapper without it is an inert tag.

## The project id

Anyone can sync this system into a claude.ai design system of their own.
`make design-sync` is a normal target, not a maintainer one.

The id buys the *second* sync. Without one, every run imports afresh. The
anchor has nothing to compare against, no deletes come out, and the pane
fills with duplicates.

It stays out of the committed `config.json` because it is per person. A
clone must not inherit somebody else's project as its default target. It is
not a credential. The API authorises the caller's own login.

`scripts/design-plan.ts` looks in three places, in order:

1. `SDS_DESIGN_PROJECT` in the environment
2. `.design-sync/config.local.json`, gitignored, `{"projectId": "…"}`
3. `config.json` itself, for a fork that prefers it there

`make design-project` reads all three and says which answered.
`ARGS=<uuid>` writes the second, and refuses to replace a different id
without `--force`. With none of them the plan still writes, and its
preflight says to create a new design system. That is the recommended
first import, and what `/design-sync` does with no id set.

**`ARGS=--forget` is the reset.** It drops the id, the cached anchor and
the plan together. They are one state. An anchor across a change of target
describes a design system nobody uploads to. The baseline screenshots in
the same cache belong to the visual review and stay.

## A sync

The repo's half is one command: `make design-sync`, which is build →
gate → design-status → plan. It ends with the instruction to run
`/design-sync`, the upload.

**First, seed the reference state, before `make design-sync`.** Fetch the
project's `_ds_sync.json` (`DesignSync get_file`) to
`.design-sync/.cache/remote-sync.json`. That file is the authority on what
the project holds. The local cache is a copy, gitignored, so on any machine
but the last one that synced it is absent or stale. With it the plan
computes exact deletes. Without it the plan says so and computes none.

**Execute `.design-sync/.cache/upload-plan.json`. Do not improvise it.**
`make design-plan` writes it: the finalize_plan globs, and the numbered
steps in order, with the exact file and delete lists. It comes from the
build and the previous anchor, so it cannot forget a renamed file the way a
hand-derived list can.

Deletes come from the anchor's `fileHashes`, whose keys are every path
`scripts/build.ts` uploaded. `scripts/lib/anchor.ts` adds the anchor's own
name back, since a file cannot hash itself. An anchor with neither that nor
the older `files` array makes the plan say so and refuse a guess. Compare
`list_files` against the build yourself that one time.

**Chunk the content write at 100 files, not the documented 256.** A call
of 256 files answers `HTTP 500 internal`. The file count is the cause, not
the payload. The budget is **≤ 100 files and ≤ 2 MB per call**. A 500 is
not a reason to stop. Send one small call first to tell a sick API from an
oversized call, then resize.

**The anchor hashes every file, and step 2 is only what moved.** A re-sync
pushes the delta, so a run that reports far fewer files than the last one
works. The delta is safe *because* the anchor is last: the anchor in the
project means everything before it landed. `_ds_bundle.js` is exempt and
always goes, because the app overwrites it after every upload.

**The sentinel needs an explicit `mimeType`, and the plan carries one.**
`_ds_needs_recompile` has no file extension. Without a type, `write_files`
answers `written: 1` and the file is not there: `list_files` omits it,
`get_file` 404s. The sentinel tells the app to rebuild `_ds_manifest.json`.
Without it every content file can be current while the pane serves the
index it compiled last time.

So the plan's sentinel steps carry `mimeType: 'text/plain'` and the
payload inline. Check with `get_file _ds_needs_recompile` afterwards. A
404 means the sync did not land.

**Its content must differ every sync, or the write is a no-op.** The
payload carries the moment of its write. A file whose job is to say
"something changed" cannot say it with the same bytes. Only `updatedAt`
and the manifest's own staleness show the failure, and both come from the
app, not the sync.

**What the upload does not move.** A file write does not bump the project's
`updatedAt`, does not recompile `_ds_manifest.json`, and does not
regenerate `_adherence.oxlintrc.json`. The app does those when it next
opens the project and finds the sentinel. So the honest report after a
sync is "the files are current, the pane refreshes on next open".

`make verify` checks the conventions header. It never rewrites the file.
The prose belongs to its authors. It fails on two kinds of drift, and both
matter because the design agent's prompt inlines the header:

- **A name that no longer exists.** A class or token named there but
  absent from the build. The agent writes markup that does nothing.
- **An element the header does not name.** A tag the bundle registers but
  the prose never mentions. Nothing breaks. The element is never in use,
  because the only document the agent reads does not say it is there.

Classes get a check in one direction only. `_ds_bundle.css` carries
internal and state classes the prose omits on purpose. The element list is
the public surface and must be complete.

**Then run `make design-synced`.** It promotes the pushed anchor into
`.design-sync/.cache/remote-sync.json`, which `design-status` and
`design-plan` compare against next time.

**Never upload over a red `make verify`.** The chain is `&&`, so a
failure stops it, but nothing stops an agent from the upload anyway. Do
not. Every fault the gate reports is invisible in review and wrong in every
design afterwards.
Fix it, re-run, then upload.

The anchor goes last because it vouches for everything before it. First, a
failure mid-way leaves it as a witness to files the project does not have.

## Re-sync risks

- **`scripts/build.ts` is the converter.** If the design-sync skill's own
  scripts change their output contract, this one does not follow. Diff
  `.out/bundle/` against the skill's documented layout.
- **`.design-sync/conventions.md` is in git and hand-editable.** Never
  rewrite it on a re-sync. `make verify` checks that every class and token
  it names still exists in the build.
- **`packages/frontend/assets/**` is not in the skill's default upload
  plan.** The cards reference `packages/frontend/assets/icons` and
  `packages/frontend/assets/diagrams`. So the plan must include
  `packages/frontend/assets/**` in both `writes` and `deletes`, or icons
  vanish from the cards.
- **The licences stand**: MIT, so a project can take a piece of this into
  a tree of its own. Icons are MIT from TYPO3/TYPO3.Icons, fonts are OFL
  through `@fontsource`. Both stand in `THIRD-PARTY.md`.
- **`packages/frontend/fonts/` and `packages/frontend/assets/icons/` are a
  task's output, in git.** `scripts/fonts.ts` and `scripts/icons.ts` write
  them from `@fontsource/*` and `@typo3/icons`. A new weight or icon is an
  edit to the `FAMILIES` / `CATEGORIES` list in the script, nothing else.
- **Upstream names stay verbatim** in both generators. `actions-search.svg`
  is the TYPO3 icon identifier, `source-sans-3-latin-400-normal.woff2` is
  the @fontsource filename. A filename in this repo is always findable in
  the package it came from. Do not "tidy" them.
- `@typo3/icons` ships `src/` and an SVGO-optimised `dist/svgs/`. The
  script reads `src/`, and so must any comparison.
- The `.ds-sync/` dir holds the skill's staged validator plus a
  `playwright` install for `package-validate.mjs` only. Git ignores it,
  and the skill regenerates it. The repo's own tooling uses the root
  `playwright` devDep.

## Known render warns

None. A warn on a future run is new. Look at it.

## Thumbnails and starting points

There is **no thumbnail file**. The thumbnail of a component *is* its
`@dsCard`-tagged HTML, and the thumbnail of a screen *is* the screen. To
change a thumbnail, edit that HTML. Do not invent a filename.

`startingPoints` is full, and this is how. A consumer shows a **Starting
Points picker** that seeds a new design from this system. A screen gets
its mark from `<!-- @startingPoint section="<group>" subtitle="<one line>"
viewport="<WxH>" -->` as the first line of its HTML. A component gets its
mark from `@startingPoint` in the JSDoc on its `.d.ts` props interface.

Source: Claude Design's leaked system prompt, with the fields the app
writes into `_ds_manifest.json` (`startingPoints`, `cards`, `templates`) as
evidence. Unofficial, so a strong lead, not a spec.

## Storybook, and how it must not touch the sync

Storybook is the documentation and author's surface: `make storybook`. It
uses `@storybook/web-components-vite`, **never the React renderer**.

**The hazard.** `.ds-sync/lib/detect.mjs` walks up to four directories
deep for a `.storybook/` config dir and switches the source shape to
`storybook` when it finds one. That shape expects React 18+ and a compiled
`packages/frontend/dist/` of React components, which this repo is not.
`.design-sync/config.json` pins `"shape": "package"`, which overrides the
detector, and `scripts/build.ts` stays the converter. **Do not remove that
pin.** If a future kit version ignores it, pin it again.

## A design holds bind-time copies, and a re-sync does not reach them

A design made with this system keeps its own copy of what it got, under
`_ds/<project-slug>/`: `styles.css`, `tokens/`, `fonts/`, `_ds_bundle.css`,
`_ds_bundle.js`. An upload into the design system updates the design
system. It does not touch a copy a design already holds. So a design
renders the state of its bind day, whatever the system's state is.

Two things follow. A report of "the system is wrong in my design" is first
a question about which copy that design holds. Fetch
`_ds/<slug>/_ds_bundle.css` and compare it against `.out/bundle/`, not the
sources. A repair of a design writes the current files into its own
`_ds/<slug>/`. That is a second upload, to the design's project and not to
the system's. Only the files a delta names need to move.
