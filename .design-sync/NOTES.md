# design-sync notes — TYPO3 Support App

Repo-specific things a future sync should know before touching anything.

## What this repo is

An **HTML/CSS design system**, not a React package. There is no `dist/`, no
component JS, and nothing to bundle. The standard design-sync converter
(`package-build.mjs`) therefore does **not** apply — `scripts/build.mjs` in
this repo produces the same upload contract directly. `package-validate.mjs`
still applies and still has to exit 0; it does, including its render check.

`_ds_bundle.js` is an intentionally empty namespace (`window.T3SA = {}`) with
a valid `@ds-bundle` header. Do not "fix" this by inventing components — the
system is consumed as classes and tokens.

## Layout

- `components.css` — the component layer. Ships as `_ds_bundle.css`; the only
  difference between the repo and bundle `styles.css` is that one `@import`.
- `_specimen.css` — chrome for the specimen cards only. Deliberately **not**
  imported by `styles.css`: a rendered design must not inherit it.
- `tokens/controls.css` — the control scale (see below).
- `scripts/` — all tooling, Node only (was Python; ported at the user's
  request so it runs the same on every machine).

## Decisions that were made on purpose

- **Two type scales, both intentional.** `tokens/typography.css` is the
  editorial scale (display → body). `tokens/controls.css` names the tighter
  scale controls were tuned to (14px buttons, 10px table heads). Converging
  them was offered and declined: it would move every surface. Not drift.
- **No half-pixel font sizes.** House rule. 121 of them were rounded half-up
  across the cards; `--font-size-code` went 13.5 → 13px to match the code
  blocks that already rendered at 13. Keep it that way — `npm run verify`
  does not catch a new one, so watch it in review.
- **Class prefix is `tsa-`**, state is `.is-*`. `t3-` was avoided: the system's
  own rules forbid implying TYPO3 endorsement.
- **Fonts are vendored** (`fonts/`, 18 woff2, latin + latin-ext, SIL OFL 1.1,
  `fonts/OFL.txt` shipped). Previously a Google Fonts `@import`. Verified
  pixel-identical on 38/39 cards; the 39th is the loading card's spinner.
  Do not go back to the remote import — a design behind a strict content
  policy would silently fall back to system-ui.

## Fixes applied to the cards (were pre-existing defects)

- `Density` — the Tool column could not hold `typo3_changelog_lookup`; the
  name overlapped the Verb column. Fixed by dropping the fixed colgroup.
- `Surfaces` — the modal's footer buttons were cropped, and the three
  surfaces wrapped to two rows because padding sat outside their width.
  Fixed by a `box-sizing: border-box` rule scoped to `[class*="tsa-"]`.
- **18 card viewports were wrong** (5 cropped their own content, 13 declared
  far more height than they used). All corrected. `npm run fit` measures this
  and is part of `npm run verify` — run it after any content edit.
- Two cards documented their own sizes in prose and went stale after the
  rounding (`DIFF 12.5 PX`, `--font-size-code · 13.5`). If you change a size
  token, grep the card copy for the number.

## Doing a sync

The repo's half is one command: `npm run sync` — build → verify → status →
plan. It ends by telling the user to run `/design-sync`, which is the upload.

**First, seed the reference state — before `npm run sync`.** Fetch the
project's `_ds_sync.json` (`DesignSync get_file`) to
`.design-sync/.cache/remote-sync.json`. That file is the authority on what
the project holds; the local cache is only a copy of it and is gitignored,
so on any machine but the last one that synced, it is absent or stale. With
it in place the plan computes exact deletes; without it the plan says so and
computes none.

**Execute `.design-sync/.cache/upload-plan.json`. Do not improvise it.**
`npm run plan` writes it: the finalize_plan globs, and five numbered steps
in the order they must run, with the exact file and delete lists. It is
generated from the build and the previous anchor, so it cannot forget a
renamed file the way a hand-derived list can — that is precisely how 19
renamed font files were left orphaned in the project.

Deletes come from the anchor's `files` list, which `scripts/build.mjs`
records. An anchor without that field (anything uploaded before this was
added) makes the plan say so and refuse to guess: compare `list_files`
against the build yourself that one time.

**Then run `npm run synced`.** It promotes the pushed anchor into
`.design-sync/.cache/remote-sync.json`, which is what `status` and `plan`
compare against next time.

**Run it, and never upload over a red verify.** The chain is `&&`, so a
failure stops it and `status` never runs — but nothing stops an agent from
calling the upload anyway. Don't. Every fault verify reports is one that is
invisible in review and wrong in every design afterwards: a class defined in
no stylesheet silently does nothing, a broken reference ships an unstyled
card, a card that overflows its declared viewport gets cropped in the pane.
Fix it, re-run, then upload.

Verify checks mechanics, not judgement. When `status` lists changed cards,
look at them: `npm run baseline` before a visual change, then `npm run shots
&& npm run diff` after. Anything that moved should have moved on purpose.

Why the plan's order matters, since it looks like ceremony: the app
regenerates `_ds_manifest.json` and `_adherence.oxlintrc.json` from the
uploaded files when the project is next opened, and only the
`_ds_needs_recompile` sentinel triggers that. Push files without re-arming
it and the manifest keeps describing the previous upload — that is how it
came to list font filenames that had already been deleted. The anchor goes
last because it vouches for everything before it: uploaded first, a failure
mid-way leaves it swearing to files the project does not have.

The cache is gitignored, so on a fresh clone `status` and `plan` correctly
say they have no reference point rather than guessing.

## Re-sync risks

- **`scripts/build.mjs` is the converter.** If the design-sync skill's own
  scripts change their output contract, this one will not follow
  automatically — diff `ds-bundle/` against the skill's documented layout.
- **`.design-sync/conventions.md` is committed and human-editable.** Never
  rewrite it on a re-sync; re-validate that every class and token it names
  still exists in the build, and report drift. All 69 classes and 15 token
  prefixes verified at the time of writing.
- **`assets/**` is not in the skill's default upload plan.** This repo's cards
  reference `assets/icons` and `assets/diagrams`, so the plan must include
  `assets/**` in both `writes` and `deletes` or icons vanish from the cards.
- **Licensing is settled**: GPL-2.0-or-later, matching TYPO3 CMS (whose
  `composer.json` is the authoritative source, not the GitHub summary, which
  says plain `GPL-2.0`). Icons are MIT from TYPO3/TYPO3.Icons, fonts are OFL
  via `@fontsource`; both are recorded in `THIRD-PARTY.md`. `package.json` is
  still `private: true` — flip that only deliberately.
- **`fonts/` and `assets/icons/` are generated and gitignored.** They come
  from `@fontsource/*` and `@typo3/icons` via `scripts/fonts.mjs` and
  `scripts/icons.mjs`, both wired to `prepare`. A clone without `npm ci` has
  neither, and every card then renders in system-ui with no icons — which
  looks like a design bug and is not one. `npm run verify` checks for this
  first and says which command to run. Adding a weight or an icon means
  editing the `FAMILIES` / `ICONS` list in the script, nothing else.
- **Upstream names are kept verbatim** in both generators — `actions-search.svg`
  is the TYPO3 icon identifier, `source-sans-3-latin-400-normal.woff2` is the
  @fontsource filename. Deliberate: a filename in this repo is always findable
  in the package it came from. Do not "tidy" them.
- All 33 icons were byte-compared against `@typo3/icons@5.0.3` `src/` before
  the switch: identical apart from entity-encoded whitespace. `dist/svgs/` is
  the SVGO-optimised tree and does *not* match — use `src/`, as the script does.
- The `.ds-sync/` dir holds the skill's staged validator plus a `playwright`
  install used only for `package-validate.mjs`. It is gitignored and
  regenerated; the repo's own tooling uses the root `playwright` devDep.

## Known render warns

None. `package-validate.mjs` reports 39/39 rendering cleanly, 0 bad, 0 thin,
0 variants-identical. A warn on a future run is new — look at it.
