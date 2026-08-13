:navigation-title: Standalone frontend

=================================
As a standalone frontend design
=================================

Two files, and no assumptions about what rendered the page. Markup produced by
PHP, Twig, Fluid or a template string uses the class layer with no JavaScript
at all; the custom elements upgrade that markup where there is behaviour to
add.

.. toctree::
   :titlesonly:

   layout
   components/index
   documents

Two shapes
==========

.. tabs::

   .. tab:: The drop-in

      Copy the directory somewhere public and link two files. Lit is bundled
      in, because a drop-in has nothing to share a copy with.

      .. code-block:: html

         <script src="/soul/soul-boot.js"></script>
         <link rel="stylesheet" href="/soul/soul.css">
         <script type="module" src="/soul/soul.js"></script>

   .. tab:: The package

      ESM with ``lit`` external, for a page that already has a bundler.
      Bundling Lit here would give a consumer a second reactive-element
      registry and an element that upgrades under the wrong one.

      .. code-block:: bash

         npm install @typo3/soul-frontend lit

      .. code-block:: javascript

         import '@typo3/soul-frontend';
         import '@typo3/soul-frontend/dist/soul.css';

.. confval:: data-theme
   :type: "light" | "dark"
   :required: false

   Forces a mode on a subtree. Put it on ``<html>`` for a whole page, so the
   browser's own scrollbars and form controls match. Left off, the reader's
   system decides and both modes work — they are the same declaration.

.. confval:: soul-boot.js
   :type: script
   :required: where there is a mode switch

   Four lines, loaded **before** the stylesheet and **not** as a module. It
   reads the stored choice and writes ``data-theme`` before the first paint;
   ``<sds-theme>`` then shows which side is pressed, because it reads what the
   document already says rather than its own idea of it.

   Leave it out and a switch still switches — the choice is simply forgotten
   on the next page, which on a site of many pages is every click. Name
   another storage key with ``data-key`` on the tag, and give ``sds-theme``
   the same one.

.. confval:: soul.css
   :type: stylesheet
   :required: true

   The tokens and the ``sds-`` class vocabulary, in one file. It is not scoped
   to a class: linking it *is* the opt-in, which is what lets a bare ``<p>`` or
   ``<h2>`` be set without an editor writing a class it does not know about.

.. confval:: document.css
   :type: stylesheet
   :required: where a document is being set

   A second entry point, scoped to ``.sds-prose``, for everything a
   Markdown or reStructuredText renderer produces without a name.
   ``soul.css`` deliberately does not import it — see :doc:`documents`.

Three layers, one contract
==========================

**Tokens** hold the decisions. Every colour, size, space, radius and duration
is declared under a semantic name, and light and dark sit in the same
declaration.

**Classes** are the vocabulary. ``sds-`` names what a thing *is* —
``.sds-card``, ``.sds-note--warn``, ``.sds-table--compact`` — and gives
server-rendered markup the whole visual system without any JavaScript.

**Elements** add behaviour. Every one of them renders **light DOM** and emits
exactly the classes above, so an element upgrades the markup that was already
there instead of introducing a second contract. There is no shadow root and no
encapsulation anywhere in this system: ``sds-`` is it.

.. code-block:: html

   <!-- The same pixels, from either column. -->
   <sds-badge tone="ok" label="passed"></sds-badge>
   <span class="sds-badge sds-badge--ok">passed</span>

Use the element where there is state, behaviour or a decision the markup would
have to repeat; use the class where a server already knows the answer and
nothing on the page will change it.

.. important::

   **Web components first.** ``<sds-code code-lang="bash">``, never a ``div``
   with the classes on it. The classes are the fallback for surfaces that run
   no JavaScript — not the front door — and a page that writes an element's
   own ``sds-x__y`` names has taken a copy of something only the system may
   change.

Where to read on
================

.. list-table::
   :header-rows: 1

   * - Page
     - What it answers
   * - :doc:`layout`
     - the page itself: bar, rail, column, bands, footer, and where the
       layout sheds as the window narrows
   * - :doc:`components/index`
     - every element — what it is for, what it takes, what goes between its
       tags, and the classes it emits
   * - :doc:`documents`
     - the second stylesheet, for prose a renderer produced

Non-negotiable
==============

.. warning::

   **Never a colour literal.** Not a hex, not an ``rgb()``, not a named
   colour. If nothing fits, the answer is a new token rather than a local
   value.

.. warning::

   **One accent, three places.** ``--accent`` appears on the active navigation
   item, on a shell prompt and on the wordmark's pipe. A fourth use makes the
   first three stop meaning anything.

.. seealso::

   The written rules and the reasoning behind each of them ship with the
   system as ``SKILL.md`` and ``RATIONALE.md``. What is here is the interface;
   those are the argument. :doc:`/design-system/index` is the same decisions
   with the rendered evidence beside them.
