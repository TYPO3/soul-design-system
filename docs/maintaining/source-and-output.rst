:navigation-title: Source and output

============================
Sources and generated output
============================

A change moves from a source, through a named task, into the artefacts that
readers and consumers use. Edit the source on the left of this map. Use the
output on the right to inspect or ship the result.

That direction is one-way. This repository decides and reviews the rules,
where their specimens and pages render. Generated bundles and package
mirrors are consumers, not a second place to write the system. A change at
an output returns through its source and generator. Two writing ends turn
one design decision into two copies.

The build owns the delivery boundary. ``scripts/build.ts`` decides what
enters the design upload. The package assembly in
``scripts/lib/packages.ts`` decides what leaves through each package. A
second inventory here lets the prose stand still while the executable
boundary moves. :doc:`package-splits` says why those packages leave through
mirrors and how the gate tests their history.

.. list-table::
   :header-rows: 1

   * - Concern
     - Authoritative source
     - Task
     - Derived output
   * - visual values
     - ``packages/frontend/src/tokens/*.css``
     - ``make dist`` and ``make build``
     - the frontend drop-in and the design system's files
   * - class vocabulary
     - ``packages/frontend/src/styles/``
     - ``make dist``, ``make cards`` and ``make build``
     - stylesheets, specimens and the design system's files
   * - web components
     - ``packages/frontend/src/components/`` and ``src/lib/``
     - ``make dist`` and ``make cards``
     - the frontend package and static specimen markup
   * - specimens and starting points
     - ``stories/``
     - ``make cards``
     - ``specimens/`` and the copies beside documents
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
the values, ``styles/components.css`` holds the ``sds-`` class vocabulary,
and the Lit elements emit that vocabulary into light DOM. No layer comes
from another. They are peers that agree through shared names and markup.

``styles/styles.css`` is the package entry for tokens and components, bare
elements included. The sheet that owns a ``<p>`` from a renderer sets it,
which leaves almost nothing with a ``.sds-prose`` scope.
``styles/_specimen.css`` stays separate because card chrome is evidence
around a design, not part of the design.

Sources beside it
=================

``stories/`` is source, because every specimen and starting point comes
from a story. Change the story or the component template it calls, then run
``make cards``. That task replaces a hand edit under ``specimens/``, and the
gate rejects one.

The first-line ``@dsCard`` and ``@startingPoint`` markers are metadata
inside an HTML comment, not rendered text. So their values use literal
Unicode characters, not HTML character references. Nothing decodes an
entity before the Design System pane or the tooling reads it. The
``headers`` check rejects a character reference in either marker, so both
consumers get the same string.

The generated cards are static HTML, not unresolved custom elements. The
design surface opens them with the stylesheets and no JavaScript, so the
card generator renders the same Lit templates ahead of time. Both routes
arrive at the class vocabulary in ``components.css``. The static consumer
does not create a second component implementation.

That static render removes Lit's hydration markers on purpose.
``renderStatic()`` fails if one survives. A marker is valid HTML and
invisible, so a visual review never shows that the exported markup carries
framework scaffolding. The failure keeps a change in Lit's SSR output out
of every specimen.

``indent()`` in ``stories/lib/specimen.ts`` indents the generated HTML,
except inside ``<pre>``. Whitespace is content there, and the block's
indentation moves every displayed line to the right. Keep code bodies at
the indentation they show. The specimen helper positions the markup around
them and leaves those lines alone.

``docs/`` is the source of the published manual. The theme under
``packages/guides-theme/`` maps its reStructuredText and Markdown onto the
same components and class vocabulary. ``make guides`` renders the pair
together, so a documentation change gets its check against the package a
consumer installs.

Where generated work belongs
============================

Generated work that git does not keep belongs under ``.out/``. The rendered
site, the built Storybook, the design system's files, test results and
assembled packages then go together with ``make clean``. No source goes
with them.

The built Storybook is also what goes out. ``make test`` builds it to open
it, and on ``main`` the site job takes that same build and serves it below
the documentation, at `/storybook/ <https://typo3.github.io/soul-design-system/storybook/>`__.
It sits on a sub-path there. That is why a story writes every path relative
to the preview page: ``assets/…``, ``specimens/screens/…``. ``make cards``
counts the climb in when it writes a card or a screen.

Some generated artefacts are in git because a consumer needs them without
this repository's toolchain. ``packages/frontend/dist/`` is the drop-in a
project installs or copies. The generated fonts travel with that package.
``specimens/`` is the static evidence the design surface reads. Their place
in git changes how they ship, not where you write them.

The tree under ``.out/bundle/project/`` is the artifact's, and the
repository is not. The assembly places every picture a preview, a layout or
a section names, so none carries a path into this tree. Change the source layout
in the generator, not inside generated cards.

How to work on a change
=======================

Find the source in the map, run the narrow task that regenerates its
output, and inspect the result there. ``make verify`` is the final
boundary. It checks that generated artefacts still match their sources, and
that the packages assemble without the rest of the checkout.

``TASKS`` in ``scripts/task.ts`` is the task list. Run ``make`` for the
descriptions and ``make verify ARGS=--help`` for the named checks. Do not
copy either list into a document.
