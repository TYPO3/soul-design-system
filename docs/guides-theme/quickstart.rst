:navigation-title: Quick start

===========
Quick start
===========

Render a local documentation site from an empty project directory. Run every
command below from that directory; the renderer lives under ``.renderer/`` and
the documents under ``docs/``.

What the machine needs
======================

PHP 8.2 or newer, Composer and Node. The theme brings phpDocumentor Guides, the
syntax highlighter, the Markdown parser, the frontend drop-in and the finishing
step with it.

Write the project files
=======================

Create ``docs/guides.xml``:

.. code-block:: xml
   :caption: docs/guides.xml

   <?xml version="1.0" encoding="UTF-8" ?>
   <guides xmlns="https://www.phpdoc.org/guides"
           input-format="rst"
           links_are_relative="true"
           theme="soul"
           default_code_language="text">
       <project title="Example Project" version="1.0"/>
       <extension class="TYPO3\Soul\GuidesTheme\DependencyInjection\SoulExtension"/>
   </guides>

The ``<extension>`` element registers the theme and is required even when it
has no configuration of its own.

Create the entry page:

.. code-block:: text
   :caption: docs/index.rst

   :navigation-title: Home

   ===============
   Example Project
   ===============

   This page was rendered with the Soul Guides theme.

   .. note::

      The renderer, theme, search and frontend now travel together.

Install the renderer
====================

The package is installed outside the documentation tree:

.. code-block:: bash

   mkdir -p .renderer
   composer --working-dir=.renderer init --no-interaction --name=example/documentation
   composer --working-dir=.renderer require \
     --no-interaction --no-progress \
     typo3/soul-guides-theme:dev-main

Render and finish the site
==========================

The render writes the documents. The finishing step copies the drop-in, draws
the custom elements into the HTML, writes the search index and checks the
references introduced after the render:

.. code-block:: bash

   .renderer/vendor/bin/guides docs --output=site -c docs --fail-on-error
   node .renderer/vendor/typo3/soul-guides-theme/resources/dist/soul-finish.js site
   php -S localhost:8000 -t site

Open ``http://localhost:8000``. The page should carry the Soul type, canvas,
header, mode switch and footer. It remains readable with JavaScript disabled;
JavaScript adds the interactive behaviour rather than the content.

Where to continue
=================

.. list-table::
   :header-rows: 1

   * - Need
     - Read
   * - a complete project and GitHub Pages workflow to copy
     - :doc:`example`
   * - every setting available in ``guides.xml``
     - :doc:`configuration`
   * - cards, grids, tabs, accordions and landing-page bands
     - :doc:`directives`
   * - the build, finishing step and publication boundary
     - :doc:`publishing`
   * - the renderer's own reStructuredText and Markdown output
     - :doc:`markup`
