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
npm run dev     # http://localhost:4173/gallery.html — all 39 cards
```

`npm ci` is not optional. `fonts/` and `assets/icons/` are generated from
npm packages and are **not** in git; without them every card renders in
system-ui with no icons, which looks like a design bug and is not one.

## Sync to claude.ai/design

Two steps, in this order:

```sh
npm run sync    # builds, verifies, and lists what would change
```
```
/design-sync    # in Claude Code — does the upload
```

There is deliberately no `npm run` that uploads: the upload needs the
`DesignSync` tool bound to your claude.ai login, which a shell script has no
access to. `npm run sync` gets everything ready and ends by telling you so.

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
| `assets/` | icons (generated), diagrams, signets |
| `fonts/` | generated |
| `scripts/` | the tooling below |
| `SKILL.md` | the build rules — the operating instruction |
| `RATIONALE.md` | why each rule exists — read before extending or breaking one |

Every card's first line is a `@dsCard` comment carrying its group, label,
subtitle and viewport. That line is the contract with the Design System pane;
`npm run verify` enforces it.

## Scripts

| | |
| --- | --- |
| `npm run dev` | gallery of every card, with a theme toggle |
| `npm run sync` | build + verify + what-would-change (then `/design-sync`) |
| `npm run verify` | the gate: headers, class vocabulary, references, viewport fit |
| `npm run status` | what a sync would change |
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
A missing icon is contributed to
[TYPO3/TYPO3.Icons](https://github.com/TYPO3/TYPO3.Icons) first; the script
fails rather than substituting one from another set.

Before a visual refactor, take `npm run baseline`, make the change, then
`npm run shots && npm run diff`. Anything that moved, moved on purpose.

## Licence

GPL-2.0-or-later, matching TYPO3 CMS — see `LICENSE`. Icons are MIT and the
fonts are SIL OFL 1.1; both are recorded in `THIRD-PARTY.md`.

This is **not** an approved TYPO3 product and no surface may imply
endorsement.
