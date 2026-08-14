:navigation-title: A project to copy

===================
A project to copy
===================

A documentation site is a directory of documents, one settings file and one
workflow. Both files are printed here in full — take them, point the render
step at your own documents, and what a landing page and a manual page need is
the rest of this page. Search, both modes, the bar and the footer arrive with
the theme and are asked for nowhere.

The commands in :doc:`publishing` are the ones this site is rendered with —
PHP, Composer, Node, no ``make`` and no container — and the step after the
render is the same file in both cases, out of the package.

What a project holds
====================

.. code-block:: text

   .github/workflows/publish.yml    the renderer, render, finish, publish
   docs/
     guides.xml                     the project, the bar, the footer
     index.rst                      the landing page
     guide/                         the manual pages

No manifest among them: the renderer is built by the workflow, in a directory
the runner discards. Both files are below.

The configuration
=================

.. literalinclude:: _starter/guides.xml
   :language: xml
   :caption: docs/guides.xml

Everything inside the theme's ``<extension>`` is optional; the element itself
is not, because it is what makes a theme called ``soul`` exist. Written empty,
the bar carries the project title and the footer carries the site's own
sections. :doc:`configuration` has each setting and what happens when it is
left out.

The workflow
============

.. literalinclude:: _starter/publish.yml
   :language: yaml
   :caption: .github/workflows/publish.yml

The renderer is built in the job that uses it and goes away with the runner —
a handful of Composer lines, no manifest in the repository. :doc:`publishing`
reads the rest of this file, including what it refuses to publish.

The two page shapes
===================

**The landing page** writes ``:layout: marketing`` at the top and is a run of
full-bleed bands with no rail. **Every other page** writes no such field and is
the manual shape, a column beside a rail. Both carry the same bar and the same
footer, because a reader must never have to work out which site they are on;
:doc:`directives` has what each shape is made of.

.. code-block:: text
   :caption: docs/index.rst

   :navigation-title: Home
   :layout: marketing

   ===============
   Example Project
   ===============

   .. toctree::
      :titlesonly:
      :hidden:

      guide/index

   .. hero:: /_images/workbench.png

      What this project is, in the sentence somebody arriving needs.

   .. button-bar::

      .. button:: :doc:`guide/index`
         :icon: actions-download

      .. button:: The source
         :href: https://github.com/example/project
         :variant: secondary
         :rel: external

   .. band:: What it holds
      :quiet:

   .. grid::

      .. card:: Write a page
         :href: /guide/index
         :tag: Guide

         What a manual page is made of.

The hidden toctree is not a formality. It is what the rail, the breadcrumb and
the footer columns are built from, and a landing page that lists its sections
in prose but writes no tree is a site whose every other page has nothing to
navigate with.

The rest of the shape follows from that opening: the hero makes the claim, the
row of presses is the way on, and everything after a ``band`` belongs to it
until the next one starts. :doc:`directives` has each of them with its options
and a rendered example.

Running it
==========

.. code-block:: bash

   composer require typo3/soul-guides-theme:dev-main   # in a directory of its own
   vendor/bin/guides docs --output=site -c docs --fail-on-error
   node vendor/typo3/soul-guides-theme/resources/dist/soul-finish.js site
   php -S localhost:8000 -t site

The second command writes documents; the third is what turns them into a site.
:doc:`installation` says what that directory of its own is for, and
:doc:`publishing` says what the workflow's jobs are for and what they refuse
to publish.

.. seealso::

   :doc:`markup` is the theme's answer to what the renderer already emits —
   admonitions, code, tabs, tables and a reference entry — with the markup that
   produces each one beside it.
