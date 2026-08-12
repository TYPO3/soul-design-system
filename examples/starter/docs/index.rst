:navigation-title: Home
:layout: marketing

===============
Example Project
===============

The page a reader arrives on: a run of full-bleed bands with no rail, because
there is nothing to navigate on the way in. ``:layout: marketing`` above is
what asks for that shape, and every other page in this project leaves the
field out and gets the manual one.

.. toctree::
   :titlesonly:
   :hidden:

   guide/index

.. grid::

   .. teaser:: Write a page
      :href: /guide/index
      :tag: Guide

      What a manual page is made of, and what the renderer's own directives
      come out as under this theme.

   .. teaser:: Publish it
      :href: /guide/publishing
      :tag: Build

      The three commands behind the workflow that renders this directory, and
      what each of them is for.

   .. teaser:: See what a page becomes
      :href: /guide/writing
      :tag: Reference

      Admonitions, code, tabs, tables and a reference entry, each one written
      the way the renderer spells it.

.. band:: What a band is
   :quiet:
   :id: bands

A band opens a section rather than wrapping one: everything from here belongs
to it until the next band starts, and what stood above the first one was a
band as well. ``:quiet:`` is the second ground, and alternating the two is what
makes a run of them read as a sequence rather than as a wall.

.. band:: What is in the grid above

Three cards that reflow by their own minimum width — three across on a desk,
one on a phone — with no column count anywhere in the source. Each links a
document, written the way a ``:doc:`` reference is and resolved per page, so
the card works from wherever the reader is standing.
