:navigation-title: Docs

====
Docs
====

The reference a product ships. A page here reports: a column of text with
what a text needs, and the way through the set beside it.

The documentation surface
=========================

The one place where the documentation *is* the product presentation. A
visitor gets the pitch and scrolls into the reference without a seam. 210px
tool rail, a 1200px page measure, 48px gutters.

.. specimen:: screens/documentation.html
   :viewport: 1440x900
   :title: Documentation

The guideline
=============

What a construction rule looks like on a page. The values a drawing has to
hold, the palette it can use, and the two grounds it has to survive.
Everything here is a fact somebody checks their own work against, so
nothing is prose that can be a number. No ground, no colour and no size
stands typed into the page. A guideline that hardcodes what it documents
stops being true the day the system moves.

.. specimen:: screens/guide.html
   :viewport: 1440x900
   :title: Guide

An article
==========

One column of text with what a text needs in it: a drawing, a borrowed
sentence, a block the machine wrote. Its contents stand beside it as
``sds-nav-rail``, because a table of contents is a list of links beside a
column.

.. specimen:: screens/article.html
   :viewport: 1440x900
   :title: Article

The reading page
================

The page that shows its own measure. Every other page is an archetype of
something a product needs; this one is the reference for the rhythm they
all follow. The registers stand under each other in one column, and each
block with a title stands beside one without. It holds one of everything,
because it is what ``make baseline`` and ``make diff`` read as the rhythm's
record.

.. specimen:: screens/reading.html
   :viewport: 1440x900
   :title: Reading

The questions
=============

A list of questions, not a wall of answers. ``sds-accordion`` is a real
``<details>``, so the fold works before a script runs and find-in-page opens
the answer it lands in.

.. specimen:: screens/questions.html
   :viewport: 1440x900
   :title: Questions

The tool reference
==================

The full tool surface at compact density: the least room a row reads in. Here
the list *is* the work, and a scan beats a read.

.. specimen:: screens/tool-reference.html
   :viewport: 1440x900
   :title: Tool reference
