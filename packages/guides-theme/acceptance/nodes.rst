:navigation-title: Reference
:author: The theme's own suite
:date: 2026-09-14

.. meta::
   :description: The nodes that only appear when software is being documented, each one rendered as a page and as a twin.
   :keywords: reference, confval, option, tabs

=========
Reference
=========

The parts of a real reference page. The narrative page next door shows the
shapes prose falls into. This one shows the nodes that appear only in the
documentation of software.

.. contents::
   :local:

Settings
========

.. confval:: siteTitle
   :type: string
   :required: true
   :default: "TYPO3"

   The name the site calls itself. It shows in the browser tab and in the
   header lockup, and it is the fallback for a page with no title of its
   own.

.. confval:: cache.lifetime
   :type: int
   :required: false
   :default: 86400

   How long a rendered page can come from the cache, in seconds. Set it to
   ``0`` to disable the cache, a development setting and never a production
   one.

   .. warning::

      A ``confval`` can hold a whole block, including an admonition. Anything
      that assumes its description is one line of text is wrong about the node.

.. confval:: domains
   :type: array of string
   :required: false

   Every host this site answers to. The first entry is canonical. The rest
   redirect to it.

Commands
========

The same information as an option list, which a command-line reference
uses instead.

.. option:: --output=PATH

   Where to write. The command creates the directory if it does not exist,
   and empties it if it does.

.. option:: --fail-on-error

   Return a non-zero exit code on the first error in the log. A gate wants
   that, and an author who reads a log does not.

Two ways to write the same thing
================================

.. tabs::

   .. tab:: YAML

      .. code-block:: yaml

         siteTitle: "TYPO3"
         cache:
           lifetime: 86400

   .. tab:: PHP

      .. code-block:: php

         return [
             'siteTitle' => 'TYPO3',
             'cache' => ['lifetime' => 86400],
         ];

.. configuration-block::

   .. code-block:: yaml

      domains: ["example.org", "www.example.org"]

   .. code-block:: php

      ['domains' => ['example.org', 'www.example.org']]

A second one, further down the same page. A choice of language in either
moves the other. The set above, with an author's own labels, stays where it
is. Its third tab is a language the other block does not offer, the case
that must not throw a set back to its first panel.

.. configuration-block::

   .. code-block:: yaml

      cache: { lifetime: 86400 }

   .. code-block:: php

      ['cache' => ['lifetime' => 86400]]

   .. code-block:: bash

      vendor/bin/typo3 cache:flush

Words this reference defines
============================

.. glossary::

   design token
      A named value. Nothing else in the system declares one, and a literal
      anywhere is a defect, not a shortcut.

   specimen
      A rendered example of a rule, beside the rule, so the two cannot
      drift.

   drop-in : noun
      The built stylesheet and script a consumer links, as opposed to their
      sources. The word after the colon is a classifier, the one thing a
      term can have besides its definition.

Document metadata
=================

:Author: The design system
:Version: 1.0
:Status: Fixture

The field list above is what a reference puts at the top of a page. The
core templates render it as a table.
