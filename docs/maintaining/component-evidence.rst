:navigation-title: Component evidence

==================
Component evidence
==================

A component belongs to the system only when somebody can inspect it. Source
alone proves that an element exists. It does not prove that its variants
compose, or that its class names are in use. It does not prove that a
renderer can place it among content it does not control. ``make verify ARGS=coverage`` checks
those kinds of evidence together.

.. list-table::
   :header-rows: 1

   * - Evidence
     - What it proves
     - What it catches
   * - a story
     - The public properties and variants compose on purpose. The specimen
       comes from this source.
     - An element with no example, or a variant that exists only by
       implication.
   * - a drawn class
     - A story, a specimen, a page or an element emits or uses a name from
       ``components.css``.
     - Dead selectors, and a class name that drifts away from its markup.
   * - the Guides render
     - The element works inside prose, the document layer and the markup of
       a renderer that does not flatter it.
     - A component that works on its isolated card and has no place in a
       real page.

Coverage follows composition
============================

The Guides theme addresses components and does not rebuild their internal
markup. The coverage check follows that composition. When a template emits
an element, the elements and classes that element emits in turn are
evidence too. A template does not repeat their tag names for the check.

That keeps the test about the rendered page, not the spelling of a Twig
template. It also keeps ownership. A component's internal ``__part`` names
stay its own, while the theme uses its public element and properties.

The same boundary holds for anything built on the system. An implementation
starts from the public :doc:`page layouts </frontend/layout>` and uses only
classes the stylesheets define. A theme that invents an ``sds-`` name has a
component the system cannot render, document or keep in step with its class
layer. The missing capability belongs in the system.

The ``classes`` check rejects a name in use with no definition.
``coverage`` guards the other direction: a name with a definition and no
draw. Together they keep the public vocabulary connected to its
implementation and its evidence.

Specimen classes stop at the evidence boundary. A card can use ``spec-*``
for its captions, because it links ``_specimen.css``. An element and a
starting point cannot, because a consumer links only ``styles.css``. The
``classes`` check reads product source apart from the union of sheets that
validates cards. So a class does not count as defined only because the
documentation layer knows it.

Exceptions stay executable
==========================

``PENDING`` in ``scripts/coverage.ts`` is a temporary work list. An entry
stands only while its evidence is absent. Once the evidence exists, the
entry fails the check. So the list can shrink and never becomes a permanent
exemption.

``ELSEWHERE`` records a different decision: elements for interactions a
document does not have stand outside the Guides render. They are not
work to do. The check fails if one of them appears there later, which
forces a second look at the classification. The file is the list for both
cases. This page explains their meaning and does not copy their contents.

Work with the check
===================

For a new component or public class, put its evidence on the surface that
owns it. Compose the element in ``stories/``, and draw the class through
that story or the element. Give the element a real place in the Guides
theme or its acceptance fixture. Then run:

.. code-block:: bash

   make verify ARGS=coverage

Run the whole ``make verify`` gate before a commit. Coverage answers if the
component is observable across its integration boundaries. The other checks
own references, generated output, render fit and types.
