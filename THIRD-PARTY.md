# Third-party material

The design system itself is GPL-2.0-or-later, matching TYPO3 CMS (see
`LICENSE`). It also redistributes the following, each under its own licence.
None of them is covered by the GPL notice above.

## Icons — `assets/icons/`

33 icons from [TYPO3/TYPO3.Icons](https://github.com/TYPO3/TYPO3.Icons),
**MIT License**, via the `@typo3/icons` package. The licence text ships
beside them as `assets/icons/LICENSE-TYPO3.Icons.txt`.

The identifiers are the core's own — the same strings `typo3_icon_lookup`
returns — so design and runtime name the same thing, and a filename here is
always findable in the package.

Findable by rule, not by search: the identifier's first segment is its
category, and that is the path. `actions-search` lives at
`src/actions/actions-search.svg`, `module-dashboard` at
`src/module/module-dashboard.svg` — inside the package, in the upstream
repository, and on any CDN that serves either.

| | |
| --- | --- |
| Package | `@typo3/icons@5.0.3`, `src/<category>/<identifier>.svg` |
| Pinned URL | `https://cdn.jsdelivr.net/npm/@typo3/icons@5.0.3/src/<category>/<identifier>.svg` |
| Upstream tip | `https://raw.githubusercontent.com/TYPO3/TYPO3.Icons/main/src/<category>/<identifier>.svg` |
| Manifest | `dist/icons.json` — 796 identifiers with their category, 211 deprecated aliases with their current name |
| Overview | <https://typo3.github.io/TYPO3.Icons/> |

`src/` and `dist/svgs/` render identically; `src/` is the unoptimised file,
which is the one worth reading before inlining it.

`assets/icons/` is **generated**, not committed: `scripts/icons.ts` copies
the declared identifiers out of the installed package. It runs from
the container entrypoint, alongside the fonts. Change the `ICONS` list in the script, not
the output.

A missing icon is contributed upstream, never drawn locally and never
substituted from another set — so the script *fails* when a declared
identifier is not in the package, rather than falling back to anything.

## Fonts — `fonts/`

**SIL Open Font License 1.1.** The licence text ships beside the files as
`fonts/LICENSE-SourceSans3.txt` and `fonts/LICENSE-SourceCodePro.txt`.

| Family | Package |
| --- | --- |
| Source Sans 3 | `@fontsource/source-sans-3` |
| Source Code Pro | `@fontsource/source-code-pro` |

`fonts/` is **generated**, not committed: `scripts/fonts.ts` copies the
weights and subsets this system declares (latin and latin-ext, woff2 only)
out of the installed packages and writes `fonts/fonts.css`. It runs from
the container entrypoint, so any container starts with a working tree.
Change the face list in the
script, not the output.

The faces are copied to disk rather than imported from `node_modules`
because a rendered design resolves `styles.css` and its `@import` closure —
it cannot reach into a package directory.

## The TYPO3 name and marks

This is **not** an approved TYPO3 product and no surface may imply
endorsement. The TYPO3 Soul is not used anywhere in this system. `TYPO3` is a
registered trademark of the TYPO3 Association; it appears here nominatively,
to say what the software works with.
