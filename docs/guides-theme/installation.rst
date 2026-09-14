:navigation-title: Installation

============
Installation
============

The last step below is the one every first try leaves out: a render is not
a site. The renderer copies an asset a document points at and nothing
else. It reads no stylesheet, and it does not know what a theme links.

.. tip::

   :doc:`example` is every step already taken, printed whole. Read this page
   to know what they are. Copy from that one.

1. Build the renderer
=====================

One package, and nothing else to fetch. The theme brings the renderer, the
highlighter and the Markdown parser with it. Build it where it is in use,
not in the repository. A documentation project is documents, and a
``composer.json`` beside them is a file nothing else in that repository
reads.

.. code-block:: bash

   mkdir -p .renderer && cd .renderer
   composer init --no-interaction --name=example/documentation
   composer require typo3/soul-guides-theme

``vendor/bin/guides`` is then the command, out of a directory a build can
throw away. PHP 8.2 is the floor.

.. note::

   A stylesheet is not a PHP dependency, which is why this package carries
   one. ``vendor/typo3/soul-guides-theme/resources/dist/`` is the drop-in:
   ``soul.css``, ``soul.js``, ``soul-boot.js``, the faces, the icon sprites,
   and the finishing step of step 4. The install above is the whole of it.
   No checkout of the design system is part of this.

.. note::

   Named without a version, so Composer takes the newest release and writes
   the constraint into your own ``composer.json``, where you decide when it
   moves. A site rebuilt tomorrow then renders the way it does today.
   ``dev-main`` asks for a look that can change on a commit nobody in your
   repository made.

.. note::

   ``guides-code`` is not optional the way a highlighter usually is. This
   theme's colour is the server's. The block arrives with ``hljs-``
   classes, and ``soul.css`` maps them. Without that package every code
   block on the site is plain text. The theme depends on it and registers
   it, so a project neither installs nor configures it. :doc:`markup` says
   what the browser then adds.

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
       <extension class="TYPO3\Soul\GuidesTheme\DependencyInjection\SoulExtension"/>
   </guides>

That is the smallest file that renders with this theme, and the
``<extension>`` element carries the weight: it registers the theme.
``theme="soul"`` selects a theme that has to exist first. Without the
element the render stops with ``Theme "soul" is not registered, available
themes are: default``.

That same element registers the highlighter and the Markdown parser. They
are packages the theme depends on. A dependency a project has to name a
second time in its own configuration is one it can name wrong. So the file
that says which theme to use says nothing about the theme's parts. To name
either of them anyway is to configure it, and the theme then leaves the
project's element alone.

That same element holds the mark, the bar's sections and the footer, as
children. :doc:`configuration` has each setting and what happens without it,
which is something sensible in every case.

3. Write the documents
======================

.. code-block:: text

   docs/
     guides.xml
     index.rst
     installation.rst
     guide/
       index.rst

**A document called** ``index`` **at the root is mandatory.** The layout
finds the site root when it resolves ``/index`` from the page in render.
Everything the shell links, the stylesheets, the fonts, the icon sprite, the
search index, hangs off that answer. A project whose entry page has another
name renders pages that reach for assets one directory too high.

**Both parsers are there without a request.** The theme registers
reStructuredText and Markdown, so ``input-format`` is the whole choice:
``rst`` above, ``md`` for a project in Markdown. It names one file
extension, and the renderer reads it as one. The value goes into the
filename the renderer looks for, so a project is one format, and the files
in the other are not documents. That is what lets ``docs/`` here keep its
prompts as ``.md`` beside the pages that include them.

.. note::

   Both work, and reStructuredText is the one to write a reference in. The
   Markdown parser reads CommonMark. An admonition, a ``confval``, a tab set
   or a text role has no spelling there. A fenced block with no language
   leaves the language ``null`` and does not fall back to
   ``default_code_language``. This theme survives that last one. Nothing can
   give Markdown the others.

4. Render, then finish the site
===============================

.. code-block:: bash

   vendor/bin/guides docs --output=site -c docs --fail-on-error
   node vendor/typo3/soul-guides-theme/resources/dist/soul-finish.js site

The first command writes documents. The second is the reason for this page.
It copies the drop-in to the site root and draws every element on every
page before the browser. It writes the search index, and refuses to finish
on a reference that leaves the output.

.. code-block:: text

   site/
     index.html
     _search.json       the index the field in the bar fetches
     styles/            <- the drop-in, put there by the step above
       soul-boot.js     sets the mode before the first paint
       soul.css
       soul.js
       fonts/
       assets/

The theme's ``<head>`` links ``styles/`` at the site root directly, not
through ``asset()``. That helper carries only what a parsed document points
at, and no document points at a font file, the icon sprite or the second
stylesheet. Put there whole, after the render, the directory stands on its
own, and every path inside it is right.

.. warning::

   For a copy by hand, copy the **whole** directory. ``soul.css`` asks for
   ``fonts/`` beside itself, and ``soul.js`` resolves the icon sprite
   against its own URL. A site without either serves pages in ``system-ui``
   or with every icon as a blank box, and the render log says nothing.

.. important::

   ``resources/dist/`` in the package is a build's output. The design system's
   sources are not in it, and a page does not link them. A site that points
   at a checkout of ``packages/frontend/src/`` proves that the theme works
   with something nobody ships.

What the finishing step does
============================

**It draws the elements.** Every template in this theme *addresses* a
component, ``<sds-card heading="…">``, and writes none of its markup. That
is the whole point of components. An addressed element draws nothing until
it upgrades. So the step writes the markup into the page before the publish,
and in a browser the element upgrades over its own rendering. Without this
step, a reader with no script gets an empty box where a card belongs.

**It writes the search index.** The bar fetches ``_search.json`` from the
site root, and nothing else writes it. The renderer has no search of its
own, and a theme cannot write one. The index describes the output, and the
output exists only after the render.

.. code-block:: text

   [{"title": "Installation", "url": "guides-theme/installation.html",
     "text": "The last of the steps below is the one every first attempt …"}]

A title, a URL relative to the site root, and enough text to tell two pages
apart. Without it, ``--no-search``, the field opens, finds nothing and says
so, on every page of a site.

**It proves the site stands alone.** The publish takes the output
directory: not the repository, not ``vendor/``, not the checkout the drop-in
came from. So the step checks every local ``href`` and ``src`` in the
rendered HTML for a target inside the output. One outside is an error, not a
page with no stylesheet on the server. ``--fail-on-error`` covers the
references the renderer knows about, and says nothing about the ones a theme
or a copy step added.

:doc:`publishing` has its options, and the workflow that runs all of it.

.. seealso::

   ``make guides`` in this repository is the same commands, plus the
   specimen cards. It calls the same code the finishing step comes from, so
   this page cannot document something the repository does not run.

More than one project
=====================

The output directory takes several renders. That is how a fixture, an API
reference or a changelog ends up beside a manual. One ``guides.xml`` each,
one CLI call each, each with its own ``--output`` under the same root. This
site comes from that. :doc:`publishing` says which parts of the finishing
step run once per output and which run once over the root.
