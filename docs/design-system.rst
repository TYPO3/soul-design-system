:navigation-title: Claude design system

===============================
As a Claude design system
===============================

The design agent at claude.ai/design works from an uploaded system: a
stylesheet, a set of tokens, and — the part that decides whether the output
looks like anything — rendered examples it can look at. This package builds
that upload.

.. code-block:: bash

   make build      # assemble the payload into .out/bundle/
   make status     # what a sync would change
   make plan       # the ordered upload plan, with deletes
   make sync       # build, verify, status, plan in one go

What gets uploaded
==================

``make build`` writes ``.out/bundle/``. The bundle is **flat** where the repo is
not, because that is the shape the pane expects:

.. code-block:: text

   .out/bundle/
     styles.css          the entry point a rendered design links
     _ds_bundle.css      the class layer
     _ds_bundle.js       the elements, bundled
     _specimen.css       the chrome the cards are drawn with
     tokens/             every value, one file per family
     fonts/  assets/     the faces, the icons, the marks
     components/<Group>/<Name>/
         <Name>.html         the card, rendered at a declared size
         <Name>.prompt.md    what it is, which classes it uses, its markup
     screens/            whole pages to start a design from
     guidelines/         the written rules, and why they exist

.. confval:: shape
   :type: string
   :default: "package"

   Set in ``.design-sync/config.json``. It pins the converter to this
   repository's own build rather than letting the sync kit detect a shape from
   the directory layout — which, with a Storybook config present, would guess
   wrong.

.. confval:: SDS_DESIGN_PROJECT
   :type: environment variable
   :required: false

   The design project a sync updates. Without it a re-sync creates a **new**
   project instead of updating yours, and the second upload is a second
   system rather than a new version of the first.

Why cards and not descriptions
==============================

Every component ships as a static HTML card rendered at a declared viewport,
generated from the same story that documents it in Storybook. One source,
three renderers: the browser upgrades the custom element, Storybook renders the
story, and the card generator writes the file.

.. warning::

   A card contains **no custom elements**. The pane opens these files with
   ``styles.css`` and no JavaScript at all, so what ships is the markup the
   element *produces*. A card carrying ``<sds-button>`` would render nothing.

Beside each card is a ``.prompt.md``: what the component is, which classes it
uses, and its markup as a block to copy. That is what the agent reads when it
places one.

What the gate checks before an upload
=====================================

.. code-block:: bash

   make verify

- every card declares a ``@dsCard`` header, and its declared size matches what
  it actually renders at
- every class used anywhere is defined in the stylesheets — no unknown names
- every local reference resolves, **inside the bundle** and not merely on the
  disk it was built on
- every card comes from a story, and no story is missing its card
- the committed drop-in still matches its sources

.. seealso::

   The written rules that travel with the upload are ``SKILL.md`` — how to
   design with the system — and ``RATIONALE.md``, which says why each rule
   exists. They are copied into ``guidelines/`` by the build.
