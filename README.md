# TYPO3 Support App — design system

Tokens, one component class layer, and 39 specimen cards that document them.
It is **HTML and CSS**: there are no JavaScript components, and nothing to
import at runtime. You link one stylesheet and put classes on markup.

```html
<link rel="stylesheet" href="styles.css">
<body class="tsa-app">
  <button class="tsa-btn tsa-btn--primary">Run the checks</button>
</body>
```

The system also feeds [claude.ai/design](https://claude.ai/design), so the
design agent builds with these real classes instead of generic ones.

## Start

```sh
npm ci          # installs deps AND generates fonts/ and assets/icons/
npm run dev     # http://localhost:4173/gallery.html — every card and screen
```

`npm ci` is not optional. `fonts/` and `assets/icons/` are generated from
npm packages and are **not** in git; without them every card renders in
system-ui with no icons, which looks like a design bug and is not one.

## Sync to claude.ai/design

Three steps, in this order:

```sh
npm run sync    # build, verify, what-would-change, and the upload plan
```
```
/design-sync    # in Claude Code — executes the plan
```
```sh
npm run synced  # record that the project now holds this build
```

There is deliberately no `npm run` that uploads: the upload needs the
`DesignSync` tool bound to your claude.ai login, which a shell script has no
access to. What the scripts *can* own is everything except the transport, and
they do — `npm run plan` writes `.design-sync/.cache/upload-plan.json` with
the five steps in the order they must run, the exact file list, and the exact
deletes. The agent executes it rather than working it out, because working it
out by hand is how a batch of renamed font files was once left orphaned in
the project.

**If verify fails, `npm run sync` stops there and exits non-zero — fix it
before uploading.** Everything it reports is invisible in review and wrong in
every design afterwards: a class that no stylesheet defines silently does
nothing, a broken reference ships an unstyled card, a card that overflows its
declared viewport gets cropped in the pane.

It checks mechanics, not judgement. When `status` lists changed cards, look at
them — `npm run baseline` before a visual change, `npm run shots && npm run
diff` after.

The upload finds the right project by itself — `.design-sync/config.json`
holds the project id, so a sync always lands in the same place and never
creates a second one. It compares against the anchor the project stores
(`_ds_sync.json`, a hash per card) and pushes only what moved.

## Layout

| Path | |
| --- | --- |
| `styles.css` | the single entry point — tokens, then the component layer |
| `tokens/*.css` | colour, type, control scale, spacing, radius, motion |
| `components.css` | the `tsa-` class vocabulary every surface is built from |
| `_specimen.css` | chrome for the cards only — deliberately **not** in the `styles.css` closure, so a rendered design never inherits it |
| `components/`, `guidelines/` | the 39 specimen cards |
| `screens/` | whole screens, offered as Starting Points in a consuming project |
| `assets/` | icons (generated), diagrams, signets |
| `fonts/` | generated |
| `scripts/` | the tooling below |
| `SKILL.md` | the build rules — the operating instruction |
| `RATIONALE.md` | why each rule exists — read before extending or breaking one |

Every card's first line is a `@dsCard` comment carrying its group, label,
subtitle and viewport; a screen's is `@startingPoint`. Those lines are the
contract with the Design System pane, and `npm run verify` enforces them.
A screen is its own thumbnail — there is no thumbnail file anywhere.

## Scripts

| | |
| --- | --- |
| `npm run dev` | gallery of every card and screen, with a theme toggle |
| `npm run sync` | build + verify + what-would-change + upload plan |
| `npm run synced` | after an upload: record that the project holds this build |
| `npm run verify` | the gate: headers, class vocabulary, references, viewport fit |
| `npm run status` | what a sync would change |
| `npm run plan` | the ordered upload plan, with deletes |
| `npm run build` | assemble `ds-bundle/`, the upload payload |
| `npm run fit` | does every card fit the viewport it declares |
| `npm run baseline` / `shots` / `diff` | screenshot before, after, compare |
| `npm run sheets` | tile screenshots into contact sheets |
| `npm run fonts` / `icons` | regenerate from the npm packages |

`fit`, `shots` and `verify` drive a real browser, so Playwright needs its
Chromium once: `npx playwright install chromium`.

### Changing things

Adding a font weight or an icon means editing the `FAMILIES` / `ICONS` list
in `scripts/fonts.mjs` or `scripts/icons.mjs` — never the generated output.
The icon's identifier is also its path, by its first segment:
`actions-search` → `src/actions/actions-search.svg` in `@typo3/icons`, and at
the same path under
`https://cdn.jsdelivr.net/npm/@typo3/icons@5.0.3/` or
`https://raw.githubusercontent.com/TYPO3/TYPO3.Icons/main/` — that is how a
surface pulls one the 33 do not cover. `dist/icons.json` in the package lists
all 796 identifiers and the deprecated aliases; `THIRD-PARTY.md` records the
whole provenance. A missing icon is contributed to
[TYPO3/TYPO3.Icons](https://github.com/TYPO3/TYPO3.Icons) first; the script
fails rather than substituting one from another set.

Before a visual refactor, take `npm run baseline`, make the change, then
`npm run shots && npm run diff`. Anything that moved, moved on purpose.

## Licence

GPL-2.0-or-later, matching TYPO3 CMS — see `LICENSE`. Icons are MIT and the
fonts are SIL OFL 1.1; both are recorded in `THIRD-PARTY.md`.

This is **not** an approved TYPO3 product and no surface may imply
endorsement.
