:navigation-title: Type

====
Type
====

Two families, and the split between them is semantic rather than decorative.

**Source Sans 3** carries everything a person wrote. **Source Code Pro**
carries everything the machine reads, writes or names — tool names,
arguments, paths, versions, CLI fragments — at *every* size, including
headings. ``--font-size-body``, ``src/tokens/colors.css``,
``make verify``. Never title-cased, never prettified.

Both are vendored under ``fonts/`` rather than pulled from a font host, so a
rendered design sets in the right type behind a strict content policy or
with no network at all. They are generated from ``@fontsource`` by
``make fonts`` and are not in git — the container regenerates them whenever
they are missing, so a fresh clone needs no setup step.

There are **two scales, both intentional**: ``tokens/typography.css`` is the
editorial scale (display → body), and ``tokens/controls.css`` names the
tighter scale controls were tuned to — 14px buttons, 10px table heads.
Converging them was considered and declined; it would move every surface.

No half-pixel font sizes. House rule.

Scale
=====

.. specimen:: guidelines/type-scale.card.html
   :viewport: 700x230
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

Mono and labels
===============

.. specimen:: guidelines/type-mono.card.html
   :viewport: 700x190
   :title: Mono & labels
