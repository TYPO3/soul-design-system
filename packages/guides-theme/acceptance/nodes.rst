:navigation-title: Reference

=========
Reference
=========

What a real reference page is made of. The narrative page next door shows the
shapes prose falls into; this one shows the four nodes that only appear when
software is being documented — and the design system has a counterpart for
none of them.

.. contents::
   :local:

Settings
========

.. confval:: siteTitle
   :type: string
   :required: true
   :default: "TYPO3"

   The name the site calls itself. Shown in the browser tab and in the header
   lockup, and used as the fallback for any page that declares no title of its
   own.

.. confval:: cache.lifetime
   :type: int
   :required: false
   :default: 86400

   How long a rendered page may be served from cache, in seconds. Set to ``0``
   to disable caching, which is a development setting and never a production
   one.

   .. warning::

      A ``confval`` can hold a whole block, including an admonition. Anything
      that assumes its description is one line of text is wrong about the node.

.. confval:: domains
   :type: array of string
   :required: false

   Every host this site answers to. The first entry is canonical; the rest
   redirect to it.

Commands
========

The same information as an option list, which is what a command-line reference
uses instead.

.. option:: --output=PATH

   Where to write. The directory is created if it does not exist and is
   emptied if it does.

.. option:: --fail-on-error

   Return a non-zero exit code as soon as anything is logged as an error,
   which is what a gate wants and what an author reading a log does not.

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

Words this reference defines
============================

.. glossary::

   design token
      A named value. Nothing else in the system declares one, and a literal
      anywhere is a defect rather than a shortcut.

   specimen
      A rendered example of a rule, kept beside the rule so the two cannot
      drift.

   drop-in : noun
      The built stylesheet and script a consuming site links, as opposed to
      the sources they are built from. The word after the colon is a
      classifier, which is what a term is allowed to be given besides its
      definition.

Document metadata
=================

:Author: The design system
:Version: 1.0
:Status: Fixture

The field list above is what a reference puts at the top of a page, and it is
rendered as a table by the core templates.
