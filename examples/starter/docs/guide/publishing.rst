:navigation-title: Publishing

==========
Publishing
==========

Three commands, and the workflow in ``.github/workflows/publish.yml`` is those
three with a checkout in front and a deploy behind.

.. code-block:: bash

   composer install
   vendor/bin/guides docs --output=site -c docs --fail-on-error
   node vendor/typo3/soul-guides-theme/resources/dist/soul-finish.js site

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
   around it, not the ``vendor/`` the drop-in came from — so a link that
   resolves during the build because the build happened in a working copy
   resolves to nothing on the server. It arrives as a page with no stylesheet
   rather than as an error somebody reads.

Where the design system comes from
==================================

Out of ``vendor/``, with the theme. A stylesheet is nothing Composer can be
asked for on its own, so the package carries the drop-in — the stylesheets,
the script, the faces, the icon sprite and ``soul-finish.js`` — under
``resources/dist/``, and ``composer install`` is the whole of getting it.

.. code-block:: json
   :caption: composer.json

   {
       "repositories": [
           {
               "type": "vcs",
               "url": "https://github.com/benjaminkott/typo3-soul-guides-theme"
           }
       ],
       "require": {
           "typo3/soul-guides-theme": "dev-main"
       },
       "minimum-stability": "dev",
       "prefer-stable": true
   }

The ``repositories`` entry is there because the package is not on Packagist
yet: Composer is told which repository the name lives in, and everything else
about the require is ordinary.

.. note::

   Ask for a tag rather than ``dev-main`` as soon as there is one. A site
   rebuilt against a moving branch is a site whose look can change on a commit
   nobody in this repository made.

Serving it while writing
========================

``site/`` is a directory of static files with no server-side anything, so any
static server will do:

.. code-block:: bash

   php -S localhost:8000 -t site

Open the port and the page is the page that gets published, including the mode
switch and the search field.
