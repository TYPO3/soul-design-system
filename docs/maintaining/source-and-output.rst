:navigation-title: Source and output

============================
Sources and generated output
============================

A change moves from an authoritative source, through a named task, into the
artefacts that readers and consuming projects use. Edit the source on the left
of this map; use the output on the right to inspect or ship the result.

.. list-table::
   :header-rows: 1

   * - Concern
     - Authoritative source
     - Task
     - Derived output
   * - visual values
     - ``packages/frontend/src/tokens/*.css``
     - ``make dist`` and ``make build``
     - the frontend drop-in and design-agent bundle
   * - class vocabulary
     - ``packages/frontend/src/styles/``
     - ``make dist``, ``make cards`` and ``make build``
     - stylesheets, specimens and the design-agent bundle
   * - web components
     - ``packages/frontend/src/components/`` and ``src/lib/``
     - ``make dist`` and ``make cards``
     - the frontend package and static specimen markup
   * - specimens and starting points
     - ``stories/``
     - ``make cards``
     - ``specimens/`` and the copies embedded beside documents
   * - published documentation
     - ``docs/``
     - ``make guides``
     - the rendered site under ``.out/site/``
   * - Guides integration
     - ``packages/guides-theme/``
     - ``make guides`` and ``make split ARGS=guides-theme``
     - the rendered site and standalone Composer package

The frontend source
===================

``packages/frontend/src/`` is the design system implementation. Tokens hold
the values, ``styles/components.css`` holds the ``sds-`` class vocabulary, and
the Lit elements emit that vocabulary into light DOM. None of those layers is
generated from another: they are peers which have to agree through their
shared names and markup.

``styles/styles.css`` is the package entry for tokens and components.
``styles/document.css`` stays separate because it styles bare prose elements
inside ``.sds-prose``; an application taking the component layer must not gain
an opinion about every paragraph. ``styles/_specimen.css`` also stays separate
because card chrome is evidence around a design, not part of the design.

Sources beside it
=================

``stories/`` is source because every specimen and starting point is generated
from a story. Change the story or the component template it calls, then run
``make cards``. A hand edit under ``specimens/`` is replaced by that task and
is rejected by the gate.

``docs/`` is the source of the published manual. The theme under
``packages/guides-theme/`` maps its reStructuredText and Markdown onto the same
components and class vocabulary. ``make guides`` renders the pair together,
so a documentation change is checked against the package a consuming project
installs.

Where generated work belongs
============================

Generated work that Git does not keep belongs under ``.out/``. The rendered
site, built Storybook, design-agent bundle, test results and assembled packages
can then be removed together with ``make clean`` without touching source.

Some generated artefacts are committed because a consumer needs them without
this repository's toolchain. ``packages/frontend/dist/`` is the drop-in a
project installs or copies, the generated fonts travel with that package, and
``specimens/`` is the static evidence read by the design surface. Their place
in Git changes how they are delivered, not where they are authored.

The bundle under ``.out/bundle/`` is flat even though the repository is not.
Paths are rewritten when it is assembled, so a card or screen never carries a
hard-coded climb back to the bundle root. Change the source layout in the
generator rather than compensating inside generated cards.

How to work on a change
=======================

Find the source in the map, run the narrow task that regenerates its output,
and inspect the result there. ``make verify`` is the final boundary: it checks
that generated artefacts still match their sources and that the packages
assemble without relying on the rest of the checkout.

The task list itself is authoritative in ``TASKS`` inside
``scripts/task.ts``. Run ``make`` for the descriptions and ``make verify
ARGS=--help`` for the named checks rather than copying either list into a
document.
