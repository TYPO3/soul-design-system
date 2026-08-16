:navigation-title: Quick start

===========
Quick start
===========

Put a working Soul surface in a page, then choose how the files reach it.
The markup is the same with a bundler or with the drop-in: ``soul.css`` carries
the tokens and class layer, and the JavaScript registers the ``sds-*``
elements.

Choose how the files arrive
===========================

.. tabs::

   .. tab:: From the package

      Install the frontend mirror and Lit in a project that already has a
      bundler:

      .. code-block:: bash

         npm install github:TYPO3/soul-frontend#main lit

      Import the package entry and the stylesheet from the application's
      JavaScript entry:

      .. code-block:: javascript
         :caption: src/main.js

         import '@typo3/soul-frontend';
         import '@typo3/soul-frontend/dist/soul.css';

      The package entry leaves Lit external, so the application and the
      elements share the same reactive-element registry.

   .. tab:: From the drop-in

      Copy ``dist/`` from the frontend mirror to a public ``soul/`` directory,
      whole. The stylesheet resolves the fonts beside itself and the script
      resolves the icon sprite inside it.

      .. code-block:: html

         <script src="/soul/soul-boot.js"></script>
         <link rel="stylesheet" href="/soul/soul.css">
         <script type="module" src="/soul/soul.js"></script>

      ``soul-boot.js`` belongs before the stylesheet where the page has a mode
      switch. Leave it out when the page follows the reader's system setting
      and offers no switch of its own.

Write the surface
=================

Put ``sds-app`` on the application root, then address the elements the surface
needs. A complete page adds the shell, skip link and one of the bodies described
in :doc:`layout` around this content:

.. code-block:: html
   :caption: surface.html

   <div class="sds-app">
     <section class="sds-page" aria-labelledby="package-status">
       <h1 id="package-status">Package status</h1>

       <sds-note tone="info" heading="Rendered from Soul">
         <p>The component styles and behaviour come from the same package.</p>
       </sds-note>

       <sds-button href="/docs/">Read the documentation</sds-button>
     </section>
   </div>

The result is a surface on the canvas, an information note with its labelled glyph,
and a primary press rendered as a real link. The custom elements render light
DOM and emit the same ``sds-`` classes a server-rendered surface writes.

Use classes where no script runs
================================

A server that already knows the answer can write the class layer directly.
It needs ``soul.css`` and no JavaScript:

.. code-block:: html

   <a class="sds-btn sds-btn--primary" href="/docs/">
     Read the documentation
   </a>

Prefer the element where there is behaviour, state or structure it owns.
Prefer the class where the server has already produced final markup and
nothing in the page will change it.

Where to continue
=================

.. list-table::
   :header-rows: 1

   * - Need
     - Read
   * - the page shell, bands and responsive frame
     - :doc:`layout`
   * - an element's attributes, properties and events
     - :doc:`components/index`
   * - headings, lists, tables and prose from a renderer
     - :doc:`documents`
   * - the visual rules behind the tokens and components
     - :doc:`/design-system/index`
