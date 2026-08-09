---
name: typo3-support-app-design-system
description: Build any surface of TYPO3 Support App — documentation pages, product UI, README diagrams, release notes — to its own design system. Load this before writing markup, CSS or SVG for this product.
---

# TYPO3 Support App — build rules

The product is a local MCP server (plain PHP) that helps coding agents implement, review and verify TYPO3 work. It has one public surface where **the documentation is also the product presentation**: a visitor gets the pitch and keeps scrolling into the reference without a seam.

This file is the operating instruction. `RATIONALE.md` is the reasoning behind it — read that when a rule needs to be extended or broken. Every specimen card under `guidelines/` and `components/` is a working HTML file: open the one nearest your task and copy from it rather than inventing a variant.

## Start here, every time

1. Link `styles.css` — it imports every token file. Never redeclare a token value locally.
2. Set nothing about colour by hand. Semantic tokens are declared once as `light-dark(light, dark)` against `color-scheme: light dark` on `:root`. Light and dark cannot drift because there is no second block.
3. Use `--orange-*` never in a design; it is the raw scale. Use `--accent`.
4. Copy the nearest specimen card. Deviating from one is a decision you should be able to name.

To force a mode on a subtree, set `data-theme="light"` or `data-theme="dark"`. Set it on `<html>` for a whole page — deeper, and the browser's own chrome (scrollbars, form controls) stays in the other mode.

## Non-negotiable

Breaking one of these breaks the system, not just the page.

- **One accent.** `--accent` (#FF8700) marks exactly three things: the active navigation item, the shell prompt in a code block, the pipe in the wordmark. No second accent, no gradient, anywhere.
- **No shadows.** Not on cards, modals, menus or drawers. Separation is a hairline plus `--surface-overlay`. The focus ring is the single `box-shadow` in the system, and it is a state, not depth.
- **No emoji.** Status is a colour plus a glyph from `assets/icons/` or the mono font (`✓`).
- **Mono is semantic.** Anything the machine reads, writes or names — tool names, arguments, paths, versions, CLI fragments — is Source Code Pro, at every size including headings. Never title-case or prettify them: `typo3_server_scope`, `.mcp.json`, `vendor/bin/typo3-support-app install`.
- **16px is the floor** for both the signet and the icons. Below it: wordmark alone, and no icon at all.
- **The TYPO3 Soul is not used.** This is not an approved TYPO3 product. No surface may imply endorsement; footers say what the product is, never whose it is.
- **Hover changes colour and border. Never position, never size.** Nothing scales, lifts or bounces. Transitions 140ms `--ease-out`.
- **Sentence case headings.** No marketing superlatives — no "powerful", "seamless", "blazing fast".

## Choosing

**Radius, by role — not by loudness.**

| Role | Value | Applies to |
| --- | --- | --- |
| Structural | `0` | Section rules, table lines, header underline, hairline grids |
| Control | `--radius-control` 4px | Buttons, fields, selects, tabs, badges, **code blocks** |
| Container | `--radius-card` 6px | Cards, panels, modals, drawers |

A container must not share its corner with its contents — that is why the card is one step larger.

**Table density.** Compact (30px rows, 13px type) when the list *is* the work: the full tool table, label lists, changelogs. Airy (48px rows, 15px type) when the rows are read rather than scanned: three worked tools, prose-adjacent reference. Medium (38px) if one density must serve both. Never zebra stripes — background changes only on hover or selection, so a highlighted row means something.

**Status colour** (`--status-ok`, `--status-warn`, `--status-error`) appears only inside code output, badges, result rows and status-about diagrams. Never as page furniture.

**A card is a hairline and 6px, no fill.** A panel is a raised fill. Sunken is machine output.

## Writing

The product's own writing is the model. Declarative, third-person, present tense; the subject is usually the software. Never "we"; "you" only for the reader's own machine.

Sentences may be long and clause-stacked, but every claim is bounded — which versions it holds for, which source answered, what it leaves out. Limitations are stated, not softened: the "Experimental" notice is the first thing on the page, not a footnote. Numbers are concrete ("PHP 8.2+", "12.4, 13.4, 14.3 and main"), never "the latest versions".

Everything ships in English regardless of the conversation language — the knowledge base matches lexically, so this is functional, not stylistic.

## States

An answer always carries its source, its version binding and what it leaves out. The UI states exist to carry exactly that.

- **Focus** — `outline: 2px solid var(--accent)` at `outline-offset: 2px` plus a `--accent-ring` halo. Always `:focus-visible`, never `:focus`.
- **Loading** — nothing under 200ms. Over 2s the label says *why*: "booting the installation", "reading packages instead", "searching docs.typo3.org". Skeletons only where the shape is known.
- **Empty / not found** — never "no results". Name the source asked, say it answered, say what it does not cover, offer the nearest real thing. A deliberate boundary gets `actions-info-circle`, not an error colour.
- **Warning** — a degraded but usable answer: what was reached, what was read instead, what that leaves out, and the command that fixes it.
- **Error** — no answer, plus the command or environment variable that would change that.
- **Success** — only when the *source* matters ("answered from bundled knowledge · 12.4, 13.4"). Never praise, never a "done" toast.

## Icons

`assets/icons/`, 33 icons from `TYPO3/TYPO3.Icons`. The identifiers are the core's own — the same strings `typo3_icon_lookup` returns — so design and runtime name the same thing.

**Where they come from.** The set is generated, never committed: `scripts/icons.mjs` copies the identifiers it declares out of the `@typo3/icons` npm package (`^5.0.3`, MIT), which `npm ci` installs and `prepare` materialises. An empty `assets/icons/` means `npm ci` has not run — it is not a missing file to work around.

**How to get one that is not in the 33.** An identifier resolves to a path by its first segment: `actions-search` → `src/actions/actions-search.svg`, `module-dashboard` → `src/module/module-dashboard.svg`. The package holds 796 icons across 15 categories (`actions`, `apps`, `avatar`, `content`, `default`, `files`, `form`, `information`, `install`, `mimetypes`, `miscellaneous`, `module`, `overlay`, `spinner`, `status`) plus `dist/icons.json` — the manifest mapping every identifier to its category, and the 211 deprecated aliases to their current names. Resolve an alias before using it; the old spelling is not what `typo3_icon_lookup` returns.

Reach a single file without the package from either of these, both raw SVG:

```
https://raw.githubusercontent.com/TYPO3/TYPO3.Icons/main/src/<category>/<identifier>.svg
https://cdn.jsdelivr.net/npm/@typo3/icons@5.0.3/src/<category>/<identifier>.svg
```

The first is the upstream tip, the second is pinned to the version this system ships — prefer it when the result has to match what is already in `assets/icons/`. The whole set is browsable at <https://typo3.github.io/TYPO3.Icons/>. `src/` rather than `dist/svgs/`: same rendering, but unoptimised and readable for someone deciding what to inline.

To *ship* one, add its identifier to the `ICONS` list in `scripts/icons.mjs` and run `npm run icons` — never drop a file into the generated directory by hand, and never edit one there.

**Missing icons are contributed upstream, never drawn locally and never substituted from another set.** The script fails on an identifier the package does not have, rather than falling back to anything.

16 × 16 viewBox, filled paths, `fill="currentColor"` at `--text-secondary`. Sizes 16, 20, 24 or a whole multiple — never 18 or 22. Icon before its label with an 8px gap, except direction icons, which follow. Only four icons may stand without a label: `actions-check-circle` (answered), `actions-exclamation-triangle` (version-bound), `actions-exclamation-circle` (installation not bootable), `actions-info-circle` (a stated boundary).

Inline the SVG wherever colour must follow the UI — an `<img>` cannot inherit `currentColor`.

## Diagrams

**One claim per diagram.** The title states it, the closing line states its consequence. Two claims are two diagrams.

**If the drawing would still work as a bulleted list, it is not a diagram.** Meaning is carried by position, length or alignment. Boxes and arrows are the last resort, not the starting vocabulary — see `assets/diagrams/` for how three different shapes of claim were solved (an axis, a sequence, a containment).

Solid means there; a dashed outline of the same shape means missing or not yet reachable — so a shortfall has a size, not a sentence. Where the missing part is a degradation rather than a precondition, the dashed outline carries `--status-warn`.

Orange marks the one thing the diagram is about — exactly one element per drawing. When the drawing is about degradation or failure, status colour replaces the accent and orange stays out entirely.

Flat canvas at `--surface-canvas`, 60px margin, no outer radius. Nodes `--surface-raised`, 6px, 1px `--border-subtle`. Connectors 1.5px, orthogonal, one arrowhead, `--text-muted`, no curves. Type floor 13px at drawn size; identifiers in mono.

**Ship two files per drawing.** Colours as presentation attributes; the dark file is a straight token swap of the light one (`name.svg` / `name-dark.svg`), selected with `<picture>` and `media="(prefers-color-scheme: dark)"`. A `<style>` block inside an SVG is stripped by GitHub. A page that forces its own mode inlines the drawing instead.

## Brand

**The signet is a construction, not a fixed drawing.** What this system fixes is *how* one is built; the mark in `assets/` is one worked example of the rules, carried over from the Dev Companion prototype. Treat it as the reference implementation, not as an approved product mark — a product that adopts this system draws its own to the same rules.

**How to draw one.** Everything follows the stroke: stroke 7 → rounding 3.5 (half the stroke, on frame caps, line ends and the marker's points alike) → gap ≥ 7 measured ink to ink. A 128 × 100 box, corner radius 20 shared by frame and marker. The frame is one open path — both ends are caps, not cuts — and it stops gap + stroke short, because each cap reaches half a stroke further. The marker sits on the frame's **outer** edge, not on the box.

**Three optical sizes, redrawn, never scaled.** The weights are the system's, whatever the drawing: 32px and up takes stroke 7 and three lines, 20–31px stroke 8.5 with the middle line dropped, 16–19px stroke 11. Shipped as `assets/signet-l.svg`, `signet-m.svg`, `signet-s.svg`; pick the file at the link, because a media query inside an SVG only sees its own viewport: `<link rel="icon" sizes="16x16" href="signet-s.svg">`. The 16–19px file is square-boxed, since a 5:4 mark letterboxed into a favicon slot lands under the 16px floor.

**What the example mark means, if you keep it.** A terminal frame holding a short session: two muted lines and one orange answer, top-right corner cut away by a solid orange marker. The marker is not the Soul; it borrows the Soul's two-part reading, its orange and its 1 : 1.44 proportion, and none of its geometry.

**Wordmark** — `TYPO3` at 600, an orange pipe, `Support App` at 300. The pipe is separator and caret at once, and the only colour in the mark. Signet is 1.36 × the type size, gap 0.5 ×, clear space half the signet height.

**Never** — a second colour in the mark, equal weights on the two words, stretching, an orange fill behind it, the large drawing at a small size, the marker in anything but orange.

## Layout

210px tool rail, 1080px content, 48px gutters. Section boundaries are full-bleed hairlines; content inside respects the measure. **1px grid gaps over a `--border-subtle` background** produce the hairline-separated card grid — the system's signature move.

The header is sticky, translucent canvas with an 8px backdrop blur; nothing else in the system is fixed, transparent or blurred. **It never wraps** — it sheds in a fixed order, widest first: 1120px mode-switch labels, 1040px transport line, 820px navigation into a panel, 620px `Support App` off the wordmark. A header that wraps to two lines breaks the sticky offset everything below is measured against.

Every surface carries the mode switch: two segments, `light` and `dark`, the active one filled with the accent — the same treatment as an active navigation item, because it is one.

## Where things are

| Need | File |
| --- | --- |
| Everything, one import | `styles.css` |
| Token values | `tokens/colors.css`, `fonts.css`, `typography.css`, `spacing.css`, `radius.css`, `motion.css` |
| Colour, type, spacing, brand specimens | `guidelines/*.card.html` |
| Focus, loading, empty, error | `guidelines/states-*.card.html` |
| Icon set and usage | `guidelines/icons-*.card.html`, `assets/icons/` |
| Diagram rules and three worked examples | `guidelines/diagrams-*.card.html`, `assets/diagrams/` |
| Buttons, fields | `components/core/` |
| Tabs, tool rail | `components/navigation/` |
| Table, badges, density | `components/data/` |
| Card, panel, modal, drawer | `components/surfaces/` |
| Code block, diff | `components/code/` |
| The documentation surface itself | `ui_kits/documentation/index.dc.html` |
| The reasoning behind every rule | `RATIONALE.md` |

## Before you call it done

- Both modes checked — not by trusting the tokens, but by looking. Anything inlined rather than linked (`currentColor`, a forced `data-theme` subtree) is where they drift.
- No shadow, no gradient, no second accent, no emoji added.
- Every machine-named string in mono, verbatim.
- Every state that can occur has copy that names its source and its boundary.
- Header sheds rather than wraps at 1120, 1040, 820 and 620.
- Nothing reachable by pointer only; `:focus-visible` rings present.
