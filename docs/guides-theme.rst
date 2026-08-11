:navigation-title: Render guide template

===============================
As a render guide template
===============================

``phpdocumentor/guides`` turns reStructuredText and Markdown into HTML. This
package is a theme for it: templates that emit the ``sds-`` vocabulary, and a
second stylesheet for everything a renderer produces that carries no class at
all. This manual is rendered with it.

Installing
==========

.. code-block:: bash

   composer require typo3/soul-guides-theme

.. code-block:: xml
   :caption: guides.xml

   <guides xmlns="https://www.phpdoc.org/guides"
           input-format="rst"
           links_are_relative="true"
           default_code_language="text">
       <project title="Your project" version="1.0"/>
       <extension class="phpDocumentor\Guides\Code\DependencyInjection\CodeExtension"/>
       <base_template_paths>
           <path>vendor/typo3/soul-guides-theme/resources/template</path>
       </base_template_paths>
   </guides>

.. confval:: base_template_paths
   :type: list of path
   :required: true

   Where the theme's Twig templates are. Searched before the packaged ones, so
   a template of the same name replaces the renderer's own.

.. confval:: links_are_relative
   :type: bool
   :default: false

   Leave it false and every asset URL is absolute, which is a site that only
   works when it is served at a domain root. Anything published under a
   repository path — GitHub Pages, most of the time — needs this on.

.. confval:: default_code_language
   :type: string
   :default: none

   The language a fenced block is highlighted as when it does not say. Set it,
   and note that the Markdown parser does **not** consult it: this theme
   guards against that itself.

In your own package
===================

The renderer copies an asset it can see a document reach for, and nothing
else — it does not read stylesheets and it does not know what a theme links.
Everything below follows from that one sentence.

**1. Require it, and the renderer.**

.. code-block:: bash

   composer require typo3/soul-guides-theme phpdocumentor/guides-cli \
       phpdocumentor/guides-code

**2. Put the drop-in inside your documentation source**, not beside it:

.. code-block:: text

   docs/
     guides.xml
     index.rst
     styles/            <- copied in by your build, gitignored
       soul.css
       document.css
       soul.js

A ``<link>`` to a file outside the parsed tree is reported as a missing image
and dropped, and the page ships with no stylesheet at all.

**3. Copy the faces afterwards.** ``soul.css`` asks for ``fonts/`` beside
itself, and since nothing parses a stylesheet, nothing carries them across.
Copy them into the *output* once the render is done:

.. code-block:: bash

   cp -r vendor/typo3/soul-design-system/dist/fonts site/styles/fonts

.. warning::

   Skip this and the site falls back to ``system-ui`` while every file it names
   is present — a page that looks broken with nothing in the log.

**4. Render.**

.. code-block:: bash

   vendor/bin/guides docs --output=site -c docs --fail-on-error

**5. Prove it stands alone.** What gets published is the output directory and
nothing else: not the repository around it, not ``vendor/``. A reference that
resolves during a build because that is a checkout resolves to nothing on the
server. Walk the rendered HTML and check every local ``href`` and ``src``
lands **inside** the output — this repository's ``make guides`` does exactly
that and refuses to finish otherwise.

.. seealso::

   ``scripts/guides.ts`` in this repository is a working version of all five
   steps, including the specimen cards. It is about ninety lines.

What the theme takes over
=========================

.. table:: Templates this theme replaces
   :widths: auto

   ==========================  =========================================
   Template                    Why
   ==========================  =========================================
   ``structure/layout``        the shell, the column and ``.sds-prose``
   ``body/code``               the caption above, and a language floor
   ==========================  =========================================

.. warning::

   A fenced block with no language kills a render. The Markdown parser leaves
   the language ``null``, the highlighter's filter declares a string, and the
   render dies with a ``TypeError`` three packages deep naming a template
   nobody wrote. This theme's code template defaults it to ``text``.

The colour comes from the server
================================

``phpdocumentor/guides-code`` highlights with a PHP port of highlight.js, so a
rendered block already carries ``hljs-`` classes — and ``soul.css`` maps
exactly those onto this system's three syntax colours. The page is coloured
with no JavaScript on it at all.

.. note::

   ``<sds-code>`` in a browser does the same job the other way round: it
   colours what it was given, unless the colour is already there. Markup
   carrying ``hljs-`` classes is handed back untouched, wrapper and all, so
   line numbers and emphasised lines survive.

Two stylesheets, and the second one is not optional here
=======================================================

.. code-block:: html

   <link rel="stylesheet" href="styles/soul.css">
   <link rel="stylesheet" href="styles/document.css">

``soul.css`` is the component layer. ``document.css`` is the document layer:
the rules for ``<p>``, ``<ul>``, ``<dl>``, ``<blockquote>``, ``<table>`` and
the six heading levels a renderer emits, scoped to ``.sds-prose`` so a page
with a bar and a rail on it does not acquire opinions about every paragraph.

See :doc:`documents` for what it sets and what the measure does.

.. important::

   The faces are not copied by the renderer. ``soul.css`` asks for ``fonts/``
   beside itself and Guides does not read stylesheets, so a build that forgets
   them serves a site that has fallen back to ``system-ui`` while every file it
   names is present.
