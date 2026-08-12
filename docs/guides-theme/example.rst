:navigation-title: A project to copy

===================
A project to copy
===================

A documentation site is two files and a directory of documents: the theme as a
dependency, and the project's own settings beside them. Both are printed here
in full — take them, point the render step at your own documents, and what a
landing page and a manual page need is the rest of this page. Search, both
modes, the bar and the footer arrive with the theme and are asked for nowhere.

The commands in :doc:`publishing` are the ones this site is rendered with —
PHP, Composer, Node, no ``make`` and no container — and the step after the
render is the same file in both cases, out of the package.

What a project holds
====================

.. code-block:: text

   composer.json                    the theme, named by its repository
   .github/workflows/publish.yml    render, finish, publish
   docs/
     guides.xml                     the project, the bar, the footer
     index.rst                      the landing page
     guide/                         the manual pages

The workflow is printed in :doc:`publishing`, next to what it refuses to
publish. The two below are the ones a project gets wrong.

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

The dependency
==============

.. literalinclude:: _starter/composer.json
   :language: json
   :caption: composer.json

The ``repositories`` entry is the part that goes away: the theme is not on
Packagist yet, so Composer is told which repository the name lives in. When
the package is registered, those lines are deleted and nothing else changes —
the drop-in and the finishing step arrive inside the package either way, which
is why nothing here checks out the design system.

The two page shapes
===================

**The landing page** writes ``:layout: marketing`` at the top and is a run of
full-bleed bands with no rail. **Every other page** writes no such field and
is the manual shape — the toctree in a rail on the left, the trail above the
title, the text held to sixty-six characters. Both carry the same bar and the
same footer, because a reader must never have to work out which site they are
on.

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

   .. grid::

      .. teaser:: Write a page
         :href: /guide/index
         :tag: Guide

         What a manual page is made of.

   .. band:: What a band is
      :quiet:

   Everything from here, up to the next band.

The hidden toctree is not a formality. It is what the rail, the breadcrumb and
the footer columns are built from, and a landing page that lists its sections
in prose but writes no tree is a site whose every other page has nothing to
navigate with.

Running it
==========

.. code-block:: bash

   composer install
   vendor/bin/guides docs --output=site -c docs --fail-on-error
   node vendor/typo3/soul-guides-theme/resources/dist/soul-finish.js site
   php -S localhost:8000 -t site

The second command writes documents; the third is what turns them into a site.
:doc:`publishing` says what each of its four jobs is for, and what it refuses
to publish.

.. seealso::

   :doc:`markup` is the theme's answer to what the renderer already emits —
   admonitions, code, tabs, tables and a reference entry — with the markup that
   produces each one beside it.
