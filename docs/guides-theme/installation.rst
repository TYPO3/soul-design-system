:navigation-title: Installation

============
Installation
============

Four steps, and the last one is the one every first attempt leaves out: a
render is not a site. The renderer copies an asset it can see a document reach
for and nothing else — it does not read stylesheets, and it does not know what
a theme links.

.. tip::

   :doc:`example` is all four steps already taken, as a directory to copy. Read
   this page to know what is in it; start from that.

1. Require the renderer and the theme
=====================================

The theme is **not on Packagist yet**, so it is required out of a checkout of
the design system — which is where the drop-in and the finishing step have to
come from anyway, since a stylesheet is not a PHP dependency.

.. code-block:: bash

   git clone --depth 1 https://github.com/benjaminkott/typo3-soul-design-system .soul

.. code-block:: json
   :caption: composer.json

   {
       "repositories": [
           { "type": "path", "url": ".soul/guides-theme" }
       ],
       "require": {
           "typo3/soul-guides-theme": "*"
       },
       "minimum-stability": "dev"
   }

The theme requires ``phpdocumentor/guides-cli``, ``guides-code`` and
``guides-markdown``, so one package brings the command, the highlighter and the
Markdown parser with it. PHP 8.2 is the floor.

.. note::

   When the package is registered, the ``repositories`` entry goes away and
   this step becomes ``composer require typo3/soul-guides-theme``. The checkout
   stays either way: it is what carries ``dist/``.

.. note::

   ``guides-code`` is not optional the way a highlighter usually is. This
   theme's colour is the server's — the block arrives carrying ``hljs-``
   classes and ``soul.css`` maps them — so without that package every code
   block on the site renders as unmarked text. :doc:`markup` says what the
   browser then does and does not add.

2. Configure the project
========================

``guides.xml`` sits beside the documents it describes.

.. code-block:: xml
   :caption: docs/guides.xml

   <?xml version="1.0" encoding="UTF-8" ?>
   <guides xmlns="https://www.phpdoc.org/guides"
           input-format="rst"
           links_are_relative="true"
           theme="soul"
           default_code_language="text">
       <project title="Your project" version="1.0"/>
       <extension class="phpDocumentor\Guides\Code\DependencyInjection\CodeExtension"/>
       <extension class="TYPO3\Soul\GuidesTheme\DependencyInjection\SoulExtension"/>
   </guides>

That is the smallest file that renders with this theme, and both extension
elements are load-bearing. The second one is what registers the theme:
``theme="soul"`` selects a theme that has to exist first, and without the
element the render stops with *Theme "soul" is not registered, available
themes are: default*.

That same element is where the mark, the bar's sections and the footer are
configured, as children of it. :doc:`configuration` has each setting and what
happens when it is left out — which, for every one of them, is something
sensible.

3. Write the documents
======================

.. code-block:: text

   docs/
     guides.xml
     index.rst
     installation.rst
     guide/
       index.rst

**A document called** ``index`` **at the root is required.** The layout works
out where the site root is by resolving ``/index`` from the page being
rendered, and everything the shell links — the stylesheets, the fonts, the
icon sprite, the search index — hangs off that answer. A project whose entry
page is called something else renders pages that reach for assets one
directory too high.

.. note::

   Both parsers work, and reStructuredText is the one to write a reference
   in. The Markdown parser reads CommonMark: an admonition, a ``confval``, a
   tab set or a text role has no spelling there, and a fenced block with no
   language leaves the language ``null`` rather than falling back to
   ``default_code_language``. This theme survives that last one; nothing can
   give Markdown the other four.

4. Render, then finish the site
===============================

.. code-block:: bash

   vendor/bin/guides docs --output=site -c docs --fail-on-error
   node .soul/dist/soul-finish.js site

The first command writes documents. The second is the one this page exists to
say out loud: it copies the drop-in to the site root, draws every element on
every page ahead of the browser, writes the search index, and refuses to
finish on a reference that leaves the output.

.. code-block:: text

   site/
     index.html
     _search.json       the index the field in the bar fetches
     styles/            <- the drop-in, put there by the step above
       soul-boot.js     sets the mode before the first paint
       soul.css
       document.css
       soul.js
       fonts/
       assets/

The theme's ``<head>`` links ``styles/`` at the site root directly rather than
through ``asset()``, which carries only what a parsed document points at — and
no document points at a font file, at the icon sprite or at the second
stylesheet. Put there whole, after the render, the directory is self-contained
and every path inside it is already right.

.. warning::

   Copying by hand instead, copy the **whole** directory. ``soul.css`` asks for
   ``fonts/`` beside itself and ``soul.js`` resolves the icon sprite against
   its own URL, so a site missing either serves pages that fall back to
   ``system-ui`` or draw every icon as a blank box — with nothing in the render
   log, because the render was fine.

.. important::

   ``dist/`` is the built drop-in, not the sources. Render a site against
   ``src/`` and what has been proven is that the theme works with something
   nobody ships.

What the finishing step does, and why it is not the renderer's job
==================================================================

**It draws the elements.** Every template in this theme *addresses* a
component — ``<sds-teaser heading="…">`` — and writes none of its markup, which
is the whole point of there being components. An addressed element draws
nothing until it upgrades, so the markup is written into the page before it is
published, and in a browser the element upgrades over its own rendering. Skip
this and a reader with no script gets an empty box where a card belongs.

**It writes the search index.** The bar fetches ``_search.json`` from the site
root, and nothing else writes it: the renderer has no search of its own, and a
theme cannot write one, because the index describes the output and the output
only exists once the render is done.

.. code-block:: text

   [{"title": "Installation", "url": "guides-theme/installation.html",
     "text": "Four steps, and the last one is the one every first attempt …"}]

A title, a URL relative to the site root, and enough text to tell two pages
apart. Left out — ``--no-search`` — the field opens, finds nothing and says so,
which is a poor answer to give somebody on every page of a site.

**It proves the site stands alone.** What gets published is the output
directory: not the repository around it, not ``vendor/``, not the checkout the
drop-in came from. So every local ``href`` and ``src`` in the rendered HTML is
checked to land inside the output, and anything that does not is an error
rather than a page with no stylesheet on the server. ``--fail-on-error``
covers the references the renderer knows about and says nothing about the ones
a theme or a copy step introduced.

:doc:`publishing` has its options, and the workflow that runs all of it.

.. seealso::

   ``make guides`` in this repository is the same three commands, plus the
   specimen cards — and it calls the same code the finishing step is built
   from, so this page cannot document something we do not run.

Rendering more than one project
===============================

The output directory takes several renders, and this is how a fixture, an API
reference or a changelog ends up beside a manual: one ``guides.xml`` each, one
CLI call each, each with its own ``--output`` under the same root. This site is
two of them. :doc:`publishing` says which parts of the finishing step run once
per output and which run once over the root.
