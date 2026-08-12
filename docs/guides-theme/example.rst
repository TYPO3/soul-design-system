:navigation-title: A project to copy

===================
A project to copy
===================

``examples/starter/`` in this repository is a whole documentation site: a
landing page, a manual page beside a rail, search, both modes, and the
workflow that publishes it. Copy the directory, point the render step at your
own documents, and the parts below are the only ones you have to touch.

It is also a fixture. The gate builds it on every push the way
:doc:`publishing` says to — PHP, Composer, Node, no ``make`` and no container —
so an instruction that stops being true stops the build rather than the reader.

What is in it
=============

.. code-block:: text

   examples/starter/
     composer.json                    the theme, out of a checkout
     .github/workflows/publish.yml    render, finish, publish
     docs/
       guides.xml                     the project, the bar, the footer
       index.rst                      the landing page
       guide/
         index.rst                    the manual shape
         writing.rst                  what the renderer's own directives become
         publishing.rst               the three commands, from the inside

Two of those files are the ones a project gets wrong, so they are printed here
in full rather than described.

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
Packagist yet, so it is required out of a checkout of this repository — the
same checkout the drop-in and the finishing step come from. When the package
is registered, those four lines and the second checkout in the workflow are
deleted and nothing else changes.

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

   git clone --depth 1 https://github.com/benjaminkott/typo3-soul-design-system .soul
   composer install
   vendor/bin/guides docs --output=site -c docs --fail-on-error
   node .soul/dist/soul-finish.js site
   php -S localhost:8000 -t site

The third command writes documents; the fourth is what turns them into a site.
:doc:`publishing` says what each of its four jobs is for, and what it refuses
to publish.

.. seealso::

   ``examples/starter/docs/guide/writing.rst`` is a page about what the
   renderer's own directives come out as — which makes the rendered version of
   it the shortest way to see the theme's answer to admonitions, code, tabs,
   tables and a reference entry at once. :doc:`markup` is the same ground
   written down.
