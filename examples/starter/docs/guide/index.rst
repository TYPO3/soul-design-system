:navigation-title: Guide

=====
Guide
=====

This page is the other shape: a column beside a rail, the trail above the
title, the text held to sixty-six characters. Nothing asked for it — a page
that writes no ``:layout:`` field is a manual page, and that is the shape most
of a documentation site is in.

The rail on the left is the toctree below. The bar above is ``guides.xml``.
Neither is written on this page, and neither can be written differently on the
next one.

.. toctree::
   :titlesonly:

   writing
   publishing

.. note::

   Everything in this project is ordinary reStructuredText. The theme is what
   stands between it and the markup: an admonition becomes ``<sds-note>``, a
   table gets the box it scrolls in, the toctree becomes the rail.

Where to put a file
===================

.. code-block:: text

   docs/
     guides.xml          beside the documents it describes
     index.rst           required, and required at the root
     guide/
       index.rst
       writing.rst

A document called ``index`` at the root is not a convention here, it is a
requirement: the layout works out where the site root is by resolving
``/index`` from the page being rendered, and every asset the shell links hangs
off that answer.

.. warning::

   A project whose entry page is called something else renders pages that
   reach for their stylesheets one directory too high — with nothing in the
   render log, because the render was fine.
