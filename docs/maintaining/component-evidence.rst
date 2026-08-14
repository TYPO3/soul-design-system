:navigation-title: Component evidence

==================
Component evidence
==================

A component belongs to the system only when somebody can inspect it. Source
alone proves that an element exists, but not that its public variants can be
composed, its class names are still in use, or a document renderer can place it
among content it does not control. ``make verify ARGS=coverage`` checks those
different kinds of evidence together.

.. list-table::
   :header-rows: 1

   * - Evidence
     - What it proves
     - What it catches
   * - a story
     - The public properties and variants can be composed deliberately. The
       specimen is generated from this source.
     - An element with no example, or a variant that exists only by implication.
   * - a drawn class
     - A name defined in ``components.css`` is emitted or used by a story,
       specimen, page or element.
     - Dead selectors and a class name drifting away from the markup that is
       meant to draw it.
   * - the Guides render
     - The element works inside prose, the document layer and markup produced
       by a renderer that was not written to flatter it.
     - A component that works on its isolated card but has no integration in a
       real page.

Coverage follows composition
============================

The Guides theme addresses components instead of rebuilding their internal
markup. The coverage check follows that composition: when a template emits an
element, the elements and classes that it emits in turn are evidence too. A
template does not need to repeat their tag names merely to satisfy the check.

This keeps the test about the rendered page rather than the spelling of a Twig
template. It also preserves ownership: a component's internal ``__part`` names
remain its own, while the theme uses its public element and properties.

The same boundary holds for anything built on the system. An implementation
starts from the public :doc:`page layouts </frontend/layout>` and uses only
classes the stylesheets define. A theme that invents an ``sds-`` name has
created a component the system cannot render, document or keep aligned with
its class layer; the missing capability belongs in the system instead.

The ``classes`` check rejects a name that is used but not defined. ``coverage``
guards the other direction: a name defined but never drawn. Together they keep
the public vocabulary connected to both its implementation and its evidence.

Specimen classes stop at the evidence boundary. A card may use ``spec-*`` for
its captions because it explicitly links ``_specimen.css``; an element and a
starting point may not, because a consuming surface links only ``styles.css``.
The ``classes`` check reads product source separately from the union of sheets
used to validate cards, so a class cannot appear defined merely because the
documentation layer knows it.

Exceptions stay executable
===========================

``PENDING`` in ``scripts/coverage.ts`` is a temporary work list. An entry is
allowed only while its evidence is absent; once the evidence appears, leaving
the entry in place fails the check. The list can therefore shrink without
quietly becoming a permanent exemption mechanism.

``ELSEWHERE`` records a different decision: elements for interactions a
document does not provide are outside the Guides render rather than unfinished
work. The check fails if one of them later appears there, forcing that
classification to be reconsidered. The file is the authoritative list for
both cases; this page explains their meaning without copying their contents.

Working with the check
======================

When a component or public class is added, put its evidence on the surface
that owns it: compose the element in ``stories/``, draw the class through that
story or the element, and give the element a real place in the Guides theme or
its acceptance fixture. Then run:

.. code-block:: bash

   make verify ARGS=coverage

Run the complete ``make verify`` gate before committing. Coverage answers
whether the component is observable across its integration boundaries; the
other checks still own references, generated output, rendering fit and types.
