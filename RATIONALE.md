# Soul Design System

Design reasons are moving beside their rules in the published documentation.
The brand, artwork, colour, interaction, type, writing, density, spacing,
layout and radius decisions now live on their pages under
`docs/design-system/`; the class and component contract lives under
`docs/frontend/`. This file temporarily holds the reasons not yet moved and is
reduced as each topic finds its permanent page.

**The system is the product.** The tokens, the `sds-` class layer and the Lit elements are what is built and maintained here; the specimen cards, the Storybook, the npm package and the guide the design agent reads are all generated from them.

It was cut against a real surface and still answers to one: **TYPO3 Support App**, a local MCP server (plain PHP) that helps coding agents implement, review and verify TYPO3 work for the three audiences that do it — the core contributor, the extension author and the site developer. That product is the worked example throughout this document, and deliberately so — a system with no surface to answer to drifts into taste.

Its one public surface has to do two jobs at once: **the documentation is also the product presentation**. A visitor arriving cold gets the pitch, and keeps scrolling into the reference without a seam. Much of what follows is shaped by that single continuous page plus the reference pages behind it.

## Diagram files

**One file, one drawing.** Every colour is written as a presentation attribute, and every attribute is `var(--token, #light)` — the token this system already declares, with the light hex behind it. A drawing opened on its own, in a README or a tab, has no tokens and renders as the light file it falls back to. Referenced into a page it reads that page's tokens and arrives in that page's mode, including a mode forced on a subtree, which is what a `<picture>` could never do: it follows the system preference and cannot see `data-theme`.

Referenced, not linked — `<img>` renders its file in a document of its own, where no token is declared and the fallback is all there is. So a drawing is a `<use>` into the file, the same mechanism an icon is, and `packages/frontend/src/lib/art.ts` is where that decision lives. It ships one file, and the file it ships is the one GitHub can read.

## Governance

**This design system project is the source of truth.** Rules are decided here, where the specimen cards render and a change can be seen. The copy that ships inside the product repository — `.claude/skills/design-system/` — is a build artefact: an agent reads it and never writes back to it.

That direction is deliberate. A system with two writing ends drifts, and design rules are not code that many people edit in parallel. A rule change is a decision, so it happens in one place and is then distributed.

The build decides what crosses that line — the rules, the stylesheets, the cards and the assets an implementation needs go over; the working surface the system is developed on stays behind. Written out here as well, that list would be a second copy nobody regenerates, and the export would keep being right while the sentence quietly stopped being.

**A component nobody can look at is not part of the system.** The rule — a story, a drawn class, and a page the Guides renderer produced — is not bookkeeping. Each surface fails differently, and that is the whole argument for asking for all three. A story is the only place a variant is stated rather than implied, and it is what the specimen card is generated from. A drawn class is the only proof that the name in the stylesheet and the name the element emits are still the same name; the pair drifted once, in the commit where a modifier existed in `components.css` and the element had no property for it. And a rendered document is the only place a component is surrounded by markup that was not written for it — prose it did not compose, a document layer under it, a renderer that has never heard of this system. A card is built to flatter the component; a page is not.

The pending lists are the concession, and they are bounded on purpose: they may only shrink, and an entry that has quietly become covered fails the gate. A list that can grow is an exemption list, and an exemption list is how a rule stops being one.

**Not part of this system, deliberately.** There is no application UI kit. The product is a CLI and an MCP server — sessions and feedback happen in the terminal and in the agent, not in a screen we would have to design. The one surface it has is the documentation page.
