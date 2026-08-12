:navigation-title: Publishing

==========
Publishing
==========

Three commands, and the workflow in ``.github/workflows/publish.yml`` is those
three with a checkout in front and a deploy behind.

.. code-block:: bash

   composer install
   vendor/bin/guides docs --output=site -c docs --fail-on-error
   node .soul/dist/soul-finish.js site

What each one is for
====================

**The renderer** turns the documents into HTML. ``--fail-on-error`` is what
makes a reference it could not resolve a failed build rather than a line in a
log; it covers the references the renderer knows about, and nothing about the
ones a theme or a copy step introduces.

**The finishing step** is everything between a render and a site, and it is
the one a project usually finds out about last:

- the drop-in — the stylesheets, the script and the faces — copied to
  ``site/styles/``, whole, because the stylesheet asks for ``fonts/`` beside
  itself and the script resolves the icon sprite against its own URL;
- every element on every page drawn ahead of the browser, so a card is a card
  before any script runs;
- ``_search.json``, the index the field in the bar fetches;
- a refusal to finish on any reference that leaves the output.

.. important::

   The last one is the check that matters after publishing has gone wrong
   once. What is served is the output directory alone — not the repository
   around it, not the checkout the drop-in came from — so a link that resolves
   during the build because the build happened in a checkout resolves to
   nothing on the server. It arrives as a page with no stylesheet rather than
   as an error somebody reads.

Where the design system comes from
==================================

The theme is a Composer package; the drop-in and the finishing step are not,
and cannot be — a stylesheet is not a PHP dependency. Both arrive with a
second checkout, and ``composer.json`` requires the theme from it as a path
repository:

.. code-block:: json
   :caption: composer.json

   {
       "repositories": [
           { "type": "path", "url": ".soul/packages/guides-theme" }
       ],
       "require": {
           "typo3/soul-guides-theme": "*"
       },
       "minimum-stability": "dev"
   }

.. note::

   Pin the checkout to a tag. A site rebuilt against a moving branch is a site
   whose look can change on a commit nobody in this repository made.

Serving it while writing
========================

``site/`` is a directory of static files with no server-side anything, so any
static server will do:

.. code-block:: bash

   php -S localhost:8000 -t site

Open the port and the page is the page that gets published, including the mode
switch and the search field.
