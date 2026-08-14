:navigation-title: Source and output

============================
Sources and generated output
============================

A change moves from an authoritative source, through a named task, into the
artefacts that readers and consuming projects use. Edit the source on the left
of this map; use the output on the right to inspect or ship the result.

That direction is one-way. Rules are decided and reviewed in this repository,
where their specimens and pages can be rendered; generated bundles and package
mirrors are consumers, not another place to author the system. A change made
at an output returns through its source and generator. Two writing ends would
turn one design decision into competing copies.

The build owns the delivery boundary. ``scripts/build.ts`` decides what enters
the design upload, and the package assembly in ``scripts/lib/packages.ts``
decides what leaves through each package. Keeping another inventory here would
let the prose stay unchanged while the executable boundary moved.
:doc:`package-splits` explains why those packages leave through generated
mirrors and how their assembled history is tested and published.

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
The document layer is absent from the design-agent bundle for the same reason:
that surface composes interface designs rather than setting documents.

Sources beside it
=================

``stories/`` is source because every specimen and starting point is generated
from a story. Change the story or the component template it calls, then run
``make cards``. A hand edit under ``specimens/`` is replaced by that task and
is rejected by the gate.

The first-line ``@dsCard`` and ``@startingPoint`` markers are metadata inside
an HTML comment, not rendered text. Their values therefore use literal Unicode
characters rather than HTML character references: nothing decodes an entity
before the Design System pane or repository tooling reads it. The ``headers``
check rejects a character reference in either marker so both consumers receive
the same string.

The generated cards are static HTML rather than unresolved custom elements.
The design surface opens them with the stylesheets and no JavaScript, so the
card generator renders the same Lit templates ahead of time. Both routes still
arrive at the class vocabulary in ``components.css``; the static consumer does
not create another component implementation.

That static rendering deliberately removes Lit's hydration markers.
``renderStatic()`` fails if one survives, because a marker is valid HTML and
visually empty: a rendered review would never reveal that the exported markup
still carries framework scaffolding. The failure keeps a change in Lit's SSR
output from silently becoming part of every specimen.

Readable generated HTML is indented by ``indent()`` in
``stories/lib/specimen.ts``, except inside ``<pre>``. Whitespace is content
there; adding the surrounding block's indentation would move every displayed
line to the right. Keep code bodies at the indentation they are meant to show
while the specimen helper positions the surrounding markup without touching
those lines.

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
