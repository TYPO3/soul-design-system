:navigation-title: Writing a page

==============
Writing a page
==============

What a page is made of, in the order somebody reaches for it. Every block
below is the renderer's own directive — none of it is this theme's — and what
each becomes is the theme's actual subject.

.. contents::
   :local:

Admonitions
===========

Twelve types, four tones. The type's own word survives the mapping, so a
reader who cannot see the colour still hears which one this was.

.. note::

   The tone that does not tint. ``hint``, ``important``, ``seealso`` and a
   generic ``.. admonition::`` land here too.

.. tip::

   The one type that reads as good news.

.. warning::

   ``attention`` and ``caution`` come out the same. Anything an admonition
   holds — paragraphs, lists, a whole code block — goes between the element's
   tags rather than into an attribute.

.. danger::

   ``error`` shares this tone. Four tones is the whole ladder.

Code
====

The colour is the server's: the block arrives already carrying ``hljs-``
classes, and the stylesheet maps them. A page is coloured with no JavaScript
on it at all.

.. code-block:: php
   :caption: config/system.php

   <?php

   return [
       'siteTitle' => 'Example',
       'cache' => ['lifetime' => 86400],
   ];

The caption goes above the block. In a browser the element adds the head, the
language label and the copy button, and leaves the colouring alone.

Two ways of saying the same thing
=================================

.. tabs::

   .. tab:: YAML

      .. code-block:: yaml

         cache:
           lifetime: 86400

   .. tab:: PHP

      .. code-block:: php

         return ['cache' => ['lifetime' => 86400]];

With scripting off the bar is there and the panels stack open under it: a
button that cannot switch anything must not hide what it would have switched.

Tables
======

.. table:: What each layer is reached for
   :widths: auto

   ==========  ==========================  ==================================
   Layer       Written as                  Reach for it when
   ==========  ==========================  ==================================
   Tokens      ``var(--surface-card)``     a value is needed at all
   Classes     ``class="sds-card"``        a server produced the markup
   Elements    ``<sds-note tone="warn">``  the thing has behaviour or state
   ==========  ==========================  ==================================

A table keeps its own drawing and gets a box around it that scrolls, so a wide
one overflows inside the column instead of shrinking to fit it.

Reference entries
=================

.. confval:: lifetime
   :type: int
   :default: 86400

   ``confval`` is the backbone of a reference page and renders as a definition
   list rather than as a card: forty in a row have to read as a list and not
   as forty boxes. It holds blocks, so a description can be more than a line.

.. topic:: A digression

   ``.. topic::`` and ``.. sidebar::`` are the same shape — a box with a title
   that labels it. Neither says anything about the reader's situation, which
   is what separates them from an admonition.

.. seealso::

   The pages in this project are short on purpose. The manual has one page per
   subject, and it is rendered with this same theme.
