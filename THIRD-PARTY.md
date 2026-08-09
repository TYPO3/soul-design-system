# Third-party material

The design system itself is GPL-2.0-or-later, matching TYPO3 CMS (see
`LICENSE`). It also redistributes the following, each under its own licence.
None of them is covered by the GPL notice above.

## Icons — `assets/icons/`

33 icons from [TYPO3/TYPO3.Icons](https://github.com/TYPO3/TYPO3.Icons),
**MIT License**.

The identifiers are the core's own — the same strings `typo3_icon_lookup`
returns — so design and runtime name the same thing. A missing icon is
contributed upstream, never drawn locally and never substituted from another
set.

## Fonts — `fonts/`

**SIL Open Font License 1.1.** The licence text ships beside the files as
`fonts/LICENSE-SourceSans3.txt` and `fonts/LICENSE-SourceCodePro.txt`.

| Family | Package |
| --- | --- |
| Source Sans 3 | `@fontsource/source-sans-3` |
| Source Code Pro | `@fontsource/source-code-pro` |

`fonts/` is **generated**, not committed: `scripts/fonts.mjs` copies the
weights and subsets this system declares (latin and latin-ext, woff2 only)
out of the installed packages and writes `fonts/fonts.css`. It runs from
`prepare`, so `npm ci` leaves a working tree. Change the face list in the
script, not the output.

The faces are copied to disk rather than imported from `node_modules`
because a rendered design resolves `styles.css` and its `@import` closure —
it cannot reach into a package directory.

## The TYPO3 name and marks

This is **not** an approved TYPO3 product and no surface may imply
endorsement. The TYPO3 Soul is not used anywhere in this system. `TYPO3` is a
registered trademark of the TYPO3 Association; it appears here nominatively,
to say what the software works with.
