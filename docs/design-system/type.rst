:navigation-title: Type

====
Type
====

Two families, and the split between them is semantic rather than decorative.

**Source Sans 3** carries everything a person wrote. **Source Code Pro**
carries everything the machine reads, writes or names — tool names,
arguments, paths, versions, CLI fragments — at *every* size, including
headings. ``--font-size-body``, ``packages/frontend/src/tokens/colors.css``,
``make verify``. Never title-cased, never prettified.

Both are vendored under ``packages/frontend/fonts/`` rather than pulled from a font host, so a
rendered design sets in the right type behind a strict content policy or
with no network at all. They are generated from ``@fontsource`` by
``make fonts`` and are not in git — the container regenerates them whenever
they are missing, so a fresh clone needs no setup step.

Each upright family uses a variable face across the weight axis; Source Sans
also ships its variable italic face. The page preloads the upright latin faces,
and ``font-display: optional`` keeps a late response from replacing a fallback
after paint. The first visit may stay in the fallback on a slow connection;
later visits use the cached face without a layout-changing swap.

There is **one scale**. ``tokens/typography.css`` holds every size, and
``tokens/controls.css`` binds the component roles to it — a button is
``--font-size-ui``, a table head is ``--font-size-label`` — without writing a
value of its own. Controls still set tighter than prose, a 15px button against
17px body text, but on the same steps: a size a component needs is one the
scale already names, or the scale is what gains it.

No half-pixel font sizes. House rule.

Scale
=====

.. specimen:: guidelines/type-scale.card.html
   :viewport: 700x246
   :title: Type scale

Display and headings
====================

Sentence case. No marketing superlatives — nothing is "powerful", "seamless"
or "blazing fast".

.. specimen:: guidelines/type-display.card.html
   :viewport: 700x180
   :title: Display & headings

Body and lead
=============

.. specimen:: guidelines/type-body.card.html
   :viewport: 700x240
   :title: Body & lead

Lists
=====

A list is indented by the width of its own marker, so an item's text lines up
with the text of the paragraph above it, and the marker is muted — it is
punctuation for the item, not part of what the item says. The element carries
all of that: a ``<ul>`` an editor emitted is already set, with no class on it.

Two classes say what the element cannot. ``sds-list`` puts air between items
that are each a sentence or two; ``sds-list--plain`` takes the markers and the
top-level indent off a list whose items are links, where every item is marked
by being a link already.

.. specimen:: guidelines/type-lists.card.html
   :viewport: 700x260
   :title: Lists

.. note::

   The one thing the system does not decide is *which* marker an ordered list
   counts with. A source that said ``a.`` or ``i.`` arrives as the ``type``
   attribute HTML has for it, and that attribute carries no weight at all — so
   the rules here are written to leave it alone wherever it is set, rather than
   quietly turning every lettered list back into a numbered one.

Mono and labels
===============

.. specimen:: guidelines/type-mono.card.html
   :viewport: 700x201
   :title: Mono & labels
