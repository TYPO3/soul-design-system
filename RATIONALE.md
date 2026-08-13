# Soul Design System

**The system is the product.** The tokens, the `sds-` class layer and the Lit elements are what is built and maintained here; the specimen cards, the Storybook, the npm package and the guide the design agent reads are all generated from them.

It was cut against a real surface and still answers to one: **TYPO3 Support App**, a local MCP server (plain PHP) that helps coding agents implement, review and verify TYPO3 work for the three audiences that do it — the core contributor, the extension author and the site developer. That product is the worked example throughout this document, and deliberately so — a system with no surface to answer to drifts into taste.

Its one public surface has to do two jobs at once: **the documentation is also the product presentation**. A visitor arriving cold gets the pitch, and keeps scrolling into the reference without a seam. Much of what follows is shaped by that single continuous page plus the reference pages behind it.

## Brand

There was no logo, no brand mark and no webfont binary to inherit. **No mark was invented.** The brand was **designed here**, from the product's own material, and is now decided.

**Signet.** A terminal frame holding a short session: two muted lines and one orange answer, with the top-right corner cut away by a solid orange marker. The marker is *not* the TYPO3 Soul — it takes the Soul's two-part reading, its orange and its 1 : 1.44 proportion, but none of its geometry, which is the right distance for a sub-product.

**The construction is the deliverable, not that drawing.** The marks are shipped so the claim can be checked rather than believed: `dev-companion-signet-{l,m,s}.svg`, `tryout-signet-{l,m,s}.svg`, and `design-system-signet-{l,m,s}.svg` for the system itself. Box, outer radius, stroke, rounding, gap and the single orange in the top-right corner are identical across them; only the interior differs, and it carries exactly one idea — a session ending in an answer, the triangle you press to start an instance, the parts and the frame around them. Tryout's triangle is filled *and* stroked at the mark's own weight, the way the corner marker is, so its three points come out at 3.5 through the round join rather than through a second construction that would have to be kept in step. `docs/design-system/signet-prompt.md` is the construction written as something to act on: the brand page prints it whole so a reader can copy it, and it ships in the bundle as `guidelines/signet-prompt.md`.

**The system's own mark has no window, and its accent is a stroke.** Both are deliberate breaks. A frame reads as a terminal, and a terminal is what the products this dresses *are* — not what it is; so the system's mark is two crop marks, the corners a piece is registered against, with three unequal parts between them. And its orange is a stroked corner where the product marks fill theirs: this mark is the frame everything else is composed inside, and a frame that outweighs its contents is the wrong shape for the job. That is the only licensed deviation. A product mark fills its accent.

Drawn in a 128 × 100 box, and everything follows one value: **stroke 7** → rounding 3.5 (half the stroke, on frame caps, line ends and the marker's three points alike) → **gap ≥ 7, measured ink to ink**. Marker 36 across, 52 down; corner radius 20, shared by frame and marker. The frame is one open path, so its two ends are round caps rather than cuts, and the path stops gap + stroke short because both caps reach half a stroke further. The marker sits on the frame's *outer* edge, not on the box.

**Three optical sizes, not one drawing scaled.** L (32px and up): stroke 7, three lines. M (20–31px): stroke 8.5, the faint middle line dropped. S (16–19px, favicon): stroke 11, marker 40 × 58. **16px is the floor** — below it, wordmark alone. Shipped as three files per mark — `packages/frontend/assets/<product>-signet-{l,m,s}.svg` — and the size is chosen at the link (`<link rel="icon" sizes="16x16" href="dev-companion-signet-s.svg">`), not inside the asset. A single self-switching file was tried and dropped: media queries inside an SVG only see their own viewport when the file is linked, and not dependably across renderers. Nor does a file carry its own light and dark: it names its root `id="art"` and colours its shapes `var(--text-primary, #8A8378)`, so a page that references it gets the page's ink and every other use falls back to a mid warm grey that holds on both modes. A `<style>` in the file would defeat that, and `ARCHITECTURE.md` has what was measured.

**Wordmark.** `TYPO3` at weight 600, an orange pipe, `Soul Design System` at weight 300. The pipe is a separator and a caret at once — the terminal reading the product earns — and it is the only colour in the mark. The weight split, not a bullet or a slash, carries the hierarchy: the domain has the mass, the system's name is the qualifier it grammatically is. Minimum 12px type.

**The TYPO3 Soul is not used.** Not as a rule of taste but of standing: this is not an approved TYPO3 product, so the Association's mark is not ours to place. The signet carries no Soul, and no surface implies endorsement — footers say what the product is, never whose it is. Should approval ever come, the decision is still no: the Soul inside our mark would either become the mark (and the sub-product disappears) or be cropped (and we would be altering the Association's asset). The files sit side by side for co-branding, never nested.

**The name is not the mark.** This system is called Soul; the Association's asset is called the TYPO3 Soul. The rule above is about the asset — nothing here places it, nests it or borrows its geometry, and that does not change. The name carries no `TYPO3` in front of it for exactly the same reason: *TYPO3 Soul Design System* would read as the Association's own system, which this is not. `TYPO3` appears in the wordmark, where it names the domain the system serves, and in the npm scope, where it names an organisation — not in the system's name.

**Lockup.** The signet is **1.36 × the type size**, the gap between them **0.5 × the type size**. Clear space is half the signet height on every side. Minimum: 12px type for the full lockup, 16px for the signet alone.

**Never.** A second colour anywhere in the mark. The two words in equal weights. Stretched. On an orange fill. The large drawing used at a small size. The corner marker in anything but orange. See `guidelines/brand-lockup.card.html`, `brand-signet-construction.card.html`, `brand-signet-sizes.card.html`, `brand-signet-modes.card.html`, `brand-clearspace.card.html` and `brand-misuse.card.html`.

## Direction

Chosen from three built candidates: **B — Terminal.** TYPO3-adjacent with its own note: TYPO3 orange is the only accent, the typeface is TYPO3's own Source Sans 3, and the composition is airy and documentation-like rather than dense like the backend.

Dark and light are equal citizens; the OS preference decides. Dark is the terminal. Light is warm paper — never pure white as a canvas.

Every semantic colour token is declared **once**, as `light-dark(light, dark)`, against `color-scheme: light dark` on `:root`. There is no second block to keep in sync, so the two modes cannot drift apart. To force a mode on any subtree, set `data-theme="light"` or `data-theme="dark"` — that flips `color-scheme`, and every token follows on its own. `--orange-*` is the raw scale and is identical in both modes; never use it directly in a design.

**A mode switch is a product control, not a preference screen.** Every surface offers one: two segments, `light` and `dark`, the active one filled with the accent — the same treatment as an active navigation item, because it is one. The first visit follows `prefers-color-scheme`; the choice is then remembered and written to `data-theme` on `<html>`, so the page background and the native scrollbars follow with it. Setting the attribute deeper than `<html>` themes the subtree but leaves the browser's own chrome behind — which is exactly how scrollbars end up in the wrong mode.

**The header never wraps.** It sheds in a fixed order, widest first: at 1120px the mode switch drops its `light`/`dark` labels and keeps the two icons, at 1040px the transport line goes, at 820px the navigation collapses into a single button and the items move into a panel under the header — full-width rows, the active one filled with the accent, with the transport line at its foot. The mode switch and the mark stay in the bar at every width; below 620px the wordmark drops `Soul Design System` and keeps `TYPO3` plus the signet. A header that wraps to two lines breaks the sticky offset everything below it is measured against.

**Scrollbars belong to the surface.** `tokens/colors.css` styles them alongside the tokens: thumb `--border-strong`, `--text-muted` on hover, transparent track, 11px. Any page that loads the tokens gets them; `color-scheme` alone would only flip the ones the browser draws itself.

## Visual foundations

**Colour.** One accent, `--accent` #FF8700, TYPO3 orange. It marks exactly three things: the active navigation item, the shell prompt in a code block, and the small square in the wordmark. Everything else is neutral: the warm-grey surfaces, text weights and border strengths declared in `tokens/colors.css`. There is no second accent and no gradient anywhere in the system. Status colours (`--status-ok`, `--status-warn`, `--status-error`) appear only inside code output, badges and result rows — never as page furniture.

**Type.** Source Sans 3 for everything human, Source Code Pro for everything the machine reads or writes: tool names, argument names, labels, version strings, code. A tool name is *always* set in mono, at any size, including as a page heading. Display is 58px/600 at -0.03em; body is 17px/1.65 capped at 620px, which is the reading column every register on a page aligns to; the small uppercase label is 11px at 0.09em. Size tokens live under `--font-size-*`; `--text-*` is reserved for text colour. Weights used: 200 (rare, display only), 400, 500 (mono headings), 600. No italics except a single emphasised word in a display line. Variable faces keep weight changes from adding fetches; the upright latin faces are preloaded, and `font-display: optional` chooses a stable fallback over a late layout-changing swap.

**Backgrounds.** Page grounds stay flat: no photography or illustration behind text, no repeating texture, no gradient. Decorative illustrations may occupy an explicit media slot such as a teaser image; explanatory imagery remains the diagram set.

**Borders and shadows.** Hairlines do all the structural work. `--border-subtle` separates sections and table rows; `--border-strong` marks the head of a table or an active field. **There are no shadows in this system** — not on cards, not on modals, not on menus. A modal is separated by an overlay wash and a border, not by elevation. The one exception is the focus ring, `box-shadow: 0 0 0 3px var(--accent-ring)`, which is a state, not a depth.

**Corners.** The split is by *role*, not by loudness. 0px is structural: full-bleed section rules, table lines, the header underline, the hairline grid — the geometry that holds the page together. 4px (`--radius-control`) is for anything a person clicks, types into or picks up — buttons, fields, selects, tabs, badges, and code blocks, which are objects at the same scale. A **card is 6px**, one step larger, because a card usually contains those things and a container must not share its corner with its contents: buttons, tabs, active navigation, badges, cards, inputs, code blocks. This is a tool that is supposed to take work off someone; it should not feel like a spec sheet. The hard edges stay where they are doing structural work, and nowhere else.

**Layout.** A 210px tool rail on the left, 1080px of content, 48px page gutters. Section boundaries are full-bleed hairlines; the content inside them respects the measure. Grid gaps of 1px over a `--border-subtle` background produce the hairline-separated card grids — that is the system's signature layout move. The header is sticky with a translucent canvas and an 8px backdrop blur; nothing else in the system is fixed, transparent or blurred.

**Interaction.** Hover changes colour and border, never position and never size. Nothing scales, lifts, or bounces. Active navigation is a filled orange block with dark text — full colour inversion, not a tint. Focus is the orange ring. Disabled is 50% opacity with no colour change. Transitions run 140ms on `--ease-out`; anything longer reads as slow here.

**Density.** Airy for prose (1.65 leading, generous section padding), tight for machine content (code at 1.9 leading but small; table rows on the `--row-pad-*` scale). The two densities sit next to each other deliberately — that contrast is the character. **The line falls between prose and machine content, not between running text and a box.** A note, a card or a surface holding sentences takes the page's own size wherever it stands in something being read — a `.sds-prose` document or a `.sds-column` reading column — while a code block, a compact row and a caption keep their density in exactly the same place. A box of sentences set four steps below the paragraph above it was never the contrast this paragraph is defending; it was the block having no way to hear where it was standing.

## Content fundamentals

The product's own writing is the model, and it is distinctive. Keep it.

**Voice.** Declarative, third-person, present tense. The subject is usually the software: "It answers before the installation does." "The conventions are the core's own." Never "we", rarely "you" — "you" appears only for the reader's own machine ("the project you are working in", "pin a commit where you depend on it").

**Sentences.** Long, clause-stacked, and precise; a sentence is allowed to carry three ideas if the ideas depend on each other. What is *not* allowed is vagueness. Every claim is bounded: which versions it holds for, which source answered, what it leaves out. "A statement that does not hold on every covered TYPO3 line carries the ones it does."

**Honesty as a style.** Limitations are stated, not softened. The "Experimental" notice is the first thing on the page, not a footnote. Where the server cannot answer, that is written down as a boundary rather than left silent. Never write marketing superlatives — no "powerful", "seamless", "blazing fast", "revolutionise".

**Casing.** Sentence case for headings. Tool names, file paths and CLI fragments verbatim in mono, never title-cased or prettified: `typo3_server_scope`, `.mcp.json`, `vendor/bin/typo3-support-app install`.

**Numbers and versions.** Always concrete: "PHP 8.2+", "12.4, 13.4, 14.3 and main", "0.x". Never "the latest versions".

**Emoji: none.** Not in the product, not in this system. Status is carried by a colour and a glyph from the mono font (`✓`), never by an emoji.

**Language.** The product, the knowledge base and this design system are written in English, whatever language the conversation is in — the matching in the knowledge base is lexical, so English is a functional requirement, not a preference.

## Components

Grouped by concern under `components/`, one specimen card per directory:

- `core/` — **Buttons & links** (primary, secondary, ghost, small, icon-only 28 × 28; links underline on hover, external ones carry `actions-window-open`) and **Fields & search** (a field is sunken, not outlined on the canvas; the accent appears only on focus; error text sits under or beside it, never in a tooltip).
- `navigation/` — **Tabs & tool rail**. Pill nav for sections, underline tabs inside a panel, and the 210px tool rail. Active state is a **filled orange block with dark text** — full inversion, never a tint.
- `data/` — **Table, badges & status**. Row padding from the `--row-pad-*` scale, `--border-strong` under the head, `--border-subtle` between rows. Anything the machine named is mono. **No alternating zebra** — background changes only on hover or selection, so a highlighted row means something.
- `surfaces/` — **Card, panel, modal & drawer**. Card = hairline + 4px, no fill. Panel = raised fill. Sunken = machine output. Modal is centred, max 560px, separated by `--surface-overlay` and a border; the drawer comes from the right. **Neither has a shadow.**
- `code/` — **Code block & diff**. Code 13px / 1.9, diff 12.5px / 1.75, diff rows tinted at 14%. No line numbers unless something refers to them. This is the only place a status colour may fill a whole line.

## States

The product's own honesty rules decide what these look like: an answer always carries its source, its version binding and what it leaves out — so the UI states are shaped to carry exactly that.

**Focus.** One ring on every control: `outline: 2px solid var(--accent)` at `outline-offset: 2px`, plus a 3–5px halo in `--accent-ring`. A field that already has an accent border keeps the halo alone. Always `:focus-visible`, never `:focus` — a mouse click should not light the ring. Nothing in the system is reachable by pointer only.

**Loading.** Under 200ms show nothing; a flash of skeleton is worse than a pause. Over 2s the label has to say *why* — "booting the installation", "reading packages instead", "searching docs.typo3.org". Skeleton rows only where the shape is already known (a table, a list), never for a single value. The spinner is `actions-refresh` rotating, 1.1s linear.

**Empty and not found.** Never just "no results". Say which source was asked, that it answered, and what it does not cover — plus the nearest real thing. A boundary is a legitimate answer here and is presented as one, with `actions-info-circle` rather than an error colour.

**Errors.** Three levels, three colours, one shape (icon left, bold line, explanation under it):
- **Warning** — a degraded answer that is still useful: what was reached, what was read instead, what that leaves out, and the command that would fix it.
- **Error** — no answer, with the command or environment variable that would change that.
- **Success** — only when the *source* matters ("answered from bundled knowledge · 12.4, 13.4"). Never as praise, never as a toast that says "done".

## Iconography

**The icons are TYPO3's own.** `TYPO3/TYPO3.Icons` is the source; the icons this product needs are copied into `packages/frontend/assets/icons/`, and that directory is the list. Nothing is drawn locally and nothing is substituted from another set — an icon this product needs and TYPO3 does not have yet is **contributed upstream**, so the two stay one set.

That is not only tidiness. The identifiers are the core's own — `actions-search`, `actions-code-compare`, `actions-exclamation-triangle` — which is the same string an agent gets back from `typo3_icon_lookup`. Design and runtime name the same thing.

**Form.** 16 × 16 viewBox, solid (filled) paths, `fill="currentColor"`. Note the deliberate mismatch: the icon set is filled, the signet is stroked. The signet is a mark, the icons are UI — they are not meant to look like the same family.

**Sizes.** 16 beside 15–17px text, 20 in toolbars and buttons, 24 in empty states. **16px is the floor** — TYPO3.Icons are drawn and hinted for a 16-unit grid and optimised for exactly that size; below it the shapes break down. Sizes between grid steps (18, 22) blur them, so: 16, 20, 24, or a whole multiple.

**Colour.** `currentColor`, defaulting to `--text-secondary`. `--accent` only marks an active item. Status colours only on status icons.

**Standing alone.** Exactly four icons may appear without a label, because they carry a meaning this product uses constantly: `actions-check-circle` (answered), `actions-exclamation-triangle` (version-bound — check the line), `actions-exclamation-circle` (the installation could not be booted), `actions-info-circle` (a boundary, stated on purpose). Everything else is labelled.

**Placement.** Icon before its label with an 8px gap — except a direction icon, which follows it.

**No emoji, anywhere.** Status is a colour and a glyph from the icon set or the mono font (`✓`).

**Loading as `<img>` breaks `currentColor`.** Inline the SVG wherever the colour has to follow the UI.

## Illustration language

Tool and article teasers need imagery that can be cropped and reduced without
destroying information. Reusing a diagram there made the diagram into page
furniture and made its labels illegible. The placeholder set therefore has a
separate job: support the subject already named by the copy, never explain it.

The relationship to the diagrams is deliberate but bounded. Both use warm
neutrals, clean contours and exactly one orange emphasis. Illustrations replace
axes, labels and connectors with one quiet person, object or still-life gesture
drawn as broad, flattened silhouettes; one contained halftone plane supplies
print character without borrowing the diagram's dashed-state meaning.

The 1200 × 750 PNGs under `packages/frontend/assets/placeholders/` are one-file assets used
unchanged in light and dark. A separate dark generation drifted in composition
and doubled the set for decorative media that already carries its own canvas.
Overlap, at most two flat tones per object and a shallow shape-like ground wash
are allowed inside the bitmap; this is not an exception to the interface's
no-shadow rule.

`guidelines/illustration-prompt.md` fixes the prompt, negative constraints,
format and the kind of subject the language takes, so the set can be extended
without inventing the style again. What it does not carry is a register of the
images already made: a prompt is handed to someone drawing the next one, and a
list of the last ones is a changelog that ages into a wrong answer about which
subjects are free.

## Diagram language

The product's existing diagrams carry its explanation and are the intended visual leitmotif. Rather than a set of one-off redraws, this system defines the **rules** they are drawn by, plus one worked example: `packages/frontend/assets/diagrams/answer-sources.svg`.

**One claim per diagram.** The title states it, the closing line states its consequence. Two claims are two diagrams.

**Flat.** Canvas is a plain rectangle at `--surface-canvas` with a 60px margin and no outer radius. No shadow, no gradient, no texture. Depth is a hairline — nodes are `--surface-raised` at 6px radius with a 1px `--border-subtle`.

**A diagram is a picture, not a text block in boxes.** If the drawing would still work as a bulleted list, it is not a diagram. Meaning has to be carried by **position, length or alignment** — the worked example plots the five sources against the machine state each one requires, so the fact that bundled knowledge spans the whole axis is visible before a word is read. Boxes and arrows are the last resort, not the starting vocabulary.

**Solid means there, dashed outline means not there.** One vocabulary across the whole set: a filled shape is what you get, a dashed outline of the same shape is what is missing or not yet reachable. It is why the drawings read before they are read — the shortfall has a size, not a sentence. Where the missing part is a degradation rather than a precondition, the dashed outline carries `--status-warn` instead of `--text-muted`.

**Colour has one job.** The existing set uses five hues to tell five peers apart; here peers are told apart by their names and look identical. Orange marks the one thing the diagram is about — exactly one element per drawing. Status colours appear only in diagrams that are about status.

**Connectors.** 1.5px, orthogonal, one arrowhead, `--text-muted`. No curves. Dashed means optional or not-yet, and nothing else.

**Type.** Source Sans 3 with system fallback; every identifier — tool name, argument, field, version — in Source Code Pro. The floor is 13px at the drawn size; a diagram that needs smaller type is carrying too much.

**The ones redrawn so far** were chosen because they stress the rules in different places. `answer-sources` had a natural axis (required machine state) and became a bar chart. `installation-fallback` is a sequence that wanted to be a flowchart — redrawn, the sequence is the reading order and the registry itself is drawn as one square per entry, so the shortfall appears at its real size. `system-overview` has no axis at all; there **containment** carries the claim, and the single crossing line is the only accented element.

**When a drawing is about degradation or failure, status colour replaces the accent** and orange stays out of the chart. One emphasis per diagram, never two.

**One file, one drawing.** Every colour is written as a presentation attribute, and every attribute is `var(--token, #light)` — the token this system already declares, with the light hex behind it. A drawing opened on its own, in a README or a tab, has no tokens and renders as the light file it falls back to. Referenced into a page it reads that page's tokens and arrives in that page's mode, including a mode forced on a subtree, which is what a `<picture>` could never do: it follows the system preference and cannot see `data-theme`.

Referenced, not linked — `<img>` renders its file in a document of its own, where no token is declared and the fallback is all there is. So a drawing is a `<use>` into the file, the same mechanism an icon is, and `packages/frontend/src/lib/art.ts` is where that decision lives. It ships one file, and the file it ships is the one GitHub can read.

## Governance

**This design system project is the source of truth.** Rules are decided here, where the specimen cards render and a change can be seen. The copy that ships inside the product repository — `.claude/skills/design-system/` — is a build artefact: an agent reads it and never writes back to it.

That direction is deliberate. A system with two writing ends drifts, and design rules are not code that many people edit in parallel. A rule change is a decision, so it happens in one place and is then distributed.

The build decides what crosses that line — the rules, the stylesheets, the cards and the assets an implementation needs go over; the working surface the system is developed on stays behind. Written out here as well, that list would be a second copy nobody regenerates, and the export would keep being right while the sentence quietly stopped being.

**A component nobody can look at is not part of the system.** The rule — a story, a drawn class, and a page the Guides renderer produced — is not bookkeeping. Each surface fails differently, and that is the whole argument for asking for all three. A story is the only place a variant is stated rather than implied, and it is what the specimen card is generated from. A drawn class is the only proof that the name in the stylesheet and the name the element emits are still the same name; the pair drifted once, in the commit where a modifier existed in `components.css` and the element had no property for it. And a rendered document is the only place a component is surrounded by markup that was not written for it — prose it did not compose, a document layer under it, a renderer that has never heard of this system. A card is built to flatter the component; a page is not.

The same reasoning is why an implementation may not invent a name. A theme that writes `sds-confval` has declared a component, in this system's namespace, that this system cannot render, cannot show in a card and cannot keep true — and the next implementation will declare it again, differently. The gap belongs in the system or nowhere, which is the component rule one level up.

The pending lists are the concession, and they are bounded on purpose: they may only shrink, and an entry that has quietly become covered fails the gate. A list that can grow is an exemption list, and an exemption list is how a rule stops being one.

**Not part of this system, deliberately.** There is no application UI kit. The product is a CLI and an MCP server — sessions and feedback happen in the terminal and in the agent, not in a screen we would have to design. The one surface it has is the documentation page.
