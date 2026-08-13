# Soul Design System

Design reasons are moving beside their rules in the published documentation.
The brand, artwork, colour, interaction, type, density, spacing, layout and
radius decisions now live on their pages under `docs/design-system/`; the class
and component contract lives under `docs/frontend/`. This file temporarily
holds the reasons not yet moved and is reduced as each topic finds its permanent
page.

**The system is the product.** The tokens, the `sds-` class layer and the Lit elements are what is built and maintained here; the specimen cards, the Storybook, the npm package and the guide the design agent reads are all generated from them.

It was cut against a real surface and still answers to one: **TYPO3 Support App**, a local MCP server (plain PHP) that helps coding agents implement, review and verify TYPO3 work for the three audiences that do it — the core contributor, the extension author and the site developer. That product is the worked example throughout this document, and deliberately so — a system with no surface to answer to drifts into taste.

Its one public surface has to do two jobs at once: **the documentation is also the product presentation**. A visitor arriving cold gets the pitch, and keeps scrolling into the reference without a seam. Much of what follows is shaped by that single continuous page plus the reference pages behind it.

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
- `surfaces/` — **Card, panel & modal**. Card = hairline + 4px, no fill. Panel = raised fill. Sunken = machine output. Modal is centred, max 560px, separated by `--surface-overlay` and a border. **Neither has a shadow.**
- `code/` — **Code block & diff**. Code 13px / 1.9, diff 12.5px / 1.75, diff rows tinted at 14%. No line numbers unless something refers to them. This is the only place a status colour may fill a whole line.

## States

The product's own honesty rules decide what these look like: an answer always carries its source, its version binding and what it leaves out — so the UI states are shaped to carry exactly that.

**Focus.** One ring on every control, and one place it is written: `--border-emphasis` wide in `--accent`, standing `--focus-offset` off the box, plus a halo `--focus-halo` wide in `--accent-ring`. Every surface that draws it is named in that one rule and says only how it differs — a card keeps its own corner, a tile in a flush wall turns the ring inwards because the wall would clip it, a fold does the same and insets the halo. A field that already has an accent border keeps the halo alone. The values were copied by hand before, and the copies had begun to disagree: a card ringed at 5px against a rule that said 3. Always `:focus-visible`, never `:focus` — a mouse click should not light the ring. Nothing in the system is reachable by pointer only.

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

The cards a tool or an article is announced in need imagery that can be cropped
and reduced without destroying information. Reusing a diagram there made the
diagram into page furniture and made its labels illegible. The placeholder set therefore has a
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

The pending lists are the concession, and they are bounded on purpose: they may only shrink, and an entry that has quietly become covered fails the gate. A list that can grow is an exemption list, and an exemption list is how a rule stops being one.

**Not part of this system, deliberately.** There is no application UI kit. The product is a CLI and an MCP server — sessions and feedback happen in the terminal and in the agent, not in a screen we would have to design. The one surface it has is the documentation page.
