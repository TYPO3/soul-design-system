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

## Component evidence

**A component nobody can look at is not part of the system.** The rule — a story, a drawn class, and a page the Guides renderer produced — is not bookkeeping. Each surface fails differently, and that is the whole argument for asking for all three. A story is the only place a variant is stated rather than implied, and it is what the specimen card is generated from. A drawn class is the only proof that the name in the stylesheet and the name the element emits are still the same name; the pair drifted once, in the commit where a modifier existed in `components.css` and the element had no property for it. And a rendered document is the only place a component is surrounded by markup that was not written for it — prose it did not compose, a document layer under it, a renderer that has never heard of this system. A card is built to flatter the component; a page is not.

The pending lists are the concession, and they are bounded on purpose: they may only shrink, and an entry that has quietly become covered fails the gate. A list that can grow is an exemption list, and an exemption list is how a rule stops being one.

**Not part of this system, deliberately.** There is no application UI kit. The product is a CLI and an MCP server — sessions and feedback happen in the terminal and in the agent, not in a screen we would have to design. The one surface it has is the documentation page.
