:navigation-title: Installation

============
Installation
============

Five steps, and the fourth is the one every first attempt gets wrong: the
renderer copies an asset it can see a document reach for, and nothing else. It
does not read stylesheets, and it does not know what a theme links.

1. Require the renderer and the theme
=====================================

.. code-block:: bash

   composer require typo3/soul-guides-theme

The theme requires ``phpdocumentor/guides-cli``, ``guides-code`` and
``guides-markdown``, so a single package brings the command, the highlighter
and the Markdown parser with it. PHP 8.2 is the floor.

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

4. Render, then copy the drop-in into the output
================================================

.. code-block:: bash

   vendor/bin/guides docs --output=site -c docs --fail-on-error
   cp -r path/to/soul-design-system/dist/. site/styles/

The theme's ``<head>`` links ``styles/`` at the site root, and it links it
directly rather than through ``asset()``. That is deliberate: ``asset()``
carries what a parsed document points at, and no document points at a font
file, at the icon sprite or at the second stylesheet — nothing reads CSS, and
``soul.js`` resolves the sprite against its own URL. Copied whole, after the
render, the directory is a self-contained thing whose internal paths are
already right.

.. code-block:: text

   site/
     index.html
     styles/            <- the drop-in, copied in; not in the source tree
       soul-boot.js     sets the mode before the first paint
       soul.css
       document.css
       soul.js
       fonts/
       assets/

.. warning::

   Copy the whole directory, not the four files. ``soul.css`` asks for
   ``fonts/`` beside itself and ``soul.js`` asks for ``assets/`` beside
   itself, so a site missing either serves pages that fall back to
   ``system-ui`` or draw every icon as a blank box — with nothing in the
   render log, because the render was fine.

.. important::

   ``dist/`` is the built drop-in, not the sources. Render a site against
   ``src/`` and what has been proven is that the theme works with something
   nobody ships.

5. Prove it stands alone
========================

What gets published is the output directory: not the repository around it,
not ``vendor/``. A reference that resolves during a build because that build
happened in a checkout resolves to nothing on the server, and it fails as a
page with no stylesheet rather than as an error somebody reads.

So walk the rendered HTML, take every local ``href`` and ``src``, and check
each one lands **inside** the output. ``--fail-on-error`` covers the
references the renderer knows about — a missing document, an image it could
not find — and says nothing about the ones a theme or a copy step introduced.

.. seealso::

   ``scripts/guides.ts`` in this repository is a working version of all five
   steps, plus the specimen cards and the search index, in about ninety lines.
   ``make guides`` runs it and refuses to finish on a reference that leaves
   the site.

The search index
================

The bar carries a search field, and the index behind it is a file: the theme
asks for ``_search.json`` at the site root, and **nothing writes it for you**.
The renderer has no search of its own, and a theme cannot write one — the
index describes the output, which only exists once the render is done.

.. code-block:: text

   [{"title": "Installation", "url": "guides-theme/installation.html",
     "text": "Five steps, and the fourth is the one every first attempt …"}]

A title, a URL relative to the site root, and enough text to tell two pages
apart. This repository builds it by walking the rendered HTML for ``<title>``
and the first paragraph, which is a couple of dozen lines and needs no parser.
Left out, the field opens, finds nothing, and says so — the fetch fails and
the reader is told the search found no matches, which is a poor answer to give
somebody on every page of a site.

Rendering more than one project
===============================

The output directory takes several renders, and this is how a fixture, an API
reference or a changelog ends up beside a manual: one ``guides.xml`` each, one
CLI call each, each with its own ``--output`` under the same root. Copy the
drop-in once per output that has a ``<head>`` of its own, since ``styles/`` is
resolved from each site's own root.

A directory whose name starts with an underscore is a good place for anything
that is a control surface rather than a page — this repository renders its
theme fixture into ``_acceptance/`` and leaves it out of the search index and
out of what gets published.
