# Third-party material

The design system itself is MIT (see `LICENSE`). It also redistributes the
following, each under its own licence. None of them is covered by the notice
above.

## Icons — `packages/frontend/assets/icons/`

33 icons from [TYPO3/TYPO3.Icons](https://github.com/TYPO3/TYPO3.Icons),
**MIT License**, via the `@typo3/icons` package. The licence text ships
beside them as `packages/frontend/assets/icons/LICENSE-TYPO3.Icons.txt`.

The identifiers are the core's own — the same strings `typo3_icon_lookup`
returns — so design and runtime name the same thing, and a filename here is
always findable in the package.

Findable by rule, not by search: the identifier's first segment is its
category, and that is the path. `actions-search` lives at
`src/actions/actions-search.svg`, `module-dashboard` at
`src/module/module-dashboard.svg` — inside `@typo3/icons`, in the upstream
repository, and on any CDN that serves either.

| | |
| --- | --- |
| Package | `@typo3/icons@5.0.3`, `packages/frontend/src/<category>/<identifier>.svg` |
| Pinned URL | `https://cdn.jsdelivr.net/npm/@typo3/icons@5.0.3/src/<category>/<identifier>.svg` |
| Upstream tip | `https://raw.githubusercontent.com/TYPO3/TYPO3.Icons/main/src/<category>/<identifier>.svg` |
| Manifest | `packages/frontend/dist/icons.json` — 796 identifiers with their category, 211 deprecated aliases with their current name |
| Overview | <https://typo3.github.io/TYPO3.Icons/> |

`packages/frontend/src/` and `packages/frontend/dist/svgs/` render identically; `packages/frontend/src/` is the unoptimised file,
which is the one worth reading before inlining it.

`packages/frontend/assets/icons/` is **generated**, not committed: `scripts/icons.ts` copies
the declared identifiers out of the installed package. It runs from
the container entrypoint, alongside the fonts. Change the `ICONS` list in the script, not
the output.

A missing icon is contributed upstream, never drawn locally and never
substituted from another set — so the script *fails* when a declared
identifier is not in the package, rather than falling back to anything.

## Fonts — `packages/frontend/fonts/`

**SIL Open Font License 1.1.** The licence text ships beside the files as
`packages/frontend/fonts/LICENSE-SourceSans3.txt` and its Source Code Pro twin.

| Family | Package |
| --- | --- |
| Source Sans 3 | `@fontsource-variable/source-sans-3` |
| Source Code Pro | `@fontsource-variable/source-code-pro` |

`packages/frontend/fonts/` is **generated**, not committed: `scripts/fonts.ts` copies the
styles and subsets this system declares (latin and latin-ext, variable woff2)
out of the installed packages and writes `packages/frontend/fonts/fonts.css`. It runs from
the container entrypoint, so any container starts with a working tree.
Change the family list in the script, not the output.

The faces are copied to disk rather than imported from `node_modules`
because a rendered design resolves `styles.css` and its `@import` closure —
it cannot reach into a package directory.

## The TYPO3 name and marks

This is **not** an approved TYPO3 product and no surface may imply
endorsement. The TYPO3 Soul is not used anywhere in this system. `TYPO3` is a
registered trademark of the TYPO3 Association; it appears here nominatively,
to say what the software works with.
