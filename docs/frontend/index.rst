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

The page furniture
==================

A page is made of four things, and each is a class rather than a component
because a server can write them:

.. code-block:: html

   <body class="sds-app">
     <div class="sds-shell">
       <header class="sds-bar">…</header>
       <div class="sds-body">
         <aside class="sds-body__rail">…</aside>
         <main class="sds-column">…</main>
       </div>
       <footer class="sds-footer">…</footer>
     </div>
   </body>

.. confval:: .sds-app
   :type: class
   :required: true

   Establishes the canvas: the ground colour, the text colour and the type. It
   belongs on ``<body>`` or the application root, and without it every surface
   inside is drawn on whatever the browser decided.

.. confval:: .sds-column
   :type: class

   The column everything is read in. It has no width of its own — the measure
   comes from what is in it, which is what lets a table run wide while the
   prose beside it stays at sixty-six characters.

Placing a control
=================

Every element renders light DOM and emits the classes below, so both columns
of this table produce the same pixels. Use the element when there is state or
behaviour, and the class when a server already knows the answer.

.. list-table:: The vocabulary, in pairs
   :header-rows: 1

   * - Element
     - Class equivalent
     - What it is for
   * - ``<sds-button variant="primary">``
     - ``<button class="sds-btn sds-btn--primary">``
     - one primary per view: the action that starts work
   * - ``<sds-note tone="warn">``
     - ``<div class="sds-note sds-note--warn">``
     - what an answer carries besides the answer
   * - ``<sds-badge tone="ok">``
     - ``<span class="sds-badge sds-badge--ok">``
     - a status, stated in a word and a glyph
   * - ``<sds-table density="compact">``
     - ``<table class="sds-table sds-table--compact">``
     - density is a choice about the work, not about loudness
   * - ``<sds-code code-lang="bash" copy>``
     - ``<pre class="sds-code__body">``
     - machine output, on the sunken plane
   * - ``<sds-tabs>`` + ``<sds-tab-item>``
     - ``.sds-tabs`` / ``.sds-tab``
     - switching the content of a panel, not the page

.. note::

   The attribute is ``code-lang`` and not ``lang``. ``lang`` is a global HTML
   attribute naming the *human* language of the content, and ``lang="json"``
   tells every screen reader to switch to a language tag that does not exist.

Rules that are not negotiable
=============================

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
   those are the argument. :doc:`documents` is the second stylesheet, for
   prose a renderer produced rather than a surface somebody named.
