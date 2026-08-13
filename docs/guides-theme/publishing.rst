:navigation-title: Publishing

=====================
Publishing it, in CI
=====================

Three commands turn a directory of documents into the site this manual is: one
builds the renderer, one writes the documents, one turns what was written into
a site. The workflow below is those three with a checkout in front and a deploy
behind — the same three this site is rendered with, and the last is a file out
of the package rather than a script you are asked to write.

.. code-block:: bash

   composer require typo3/soul-guides-theme:dev-main
   vendor/bin/guides docs --output=site -c docs --fail-on-error
   node vendor/typo3/soul-guides-theme/resources/dist/soul-finish.js site

The first runs in a directory of its own — a documentation repository holds
documents, not a PHP manifest — and needs one line in front of it until the
package is on Packagist. :doc:`installation` has both.

The renderer, and what it does not do
=====================================

The second command writes documents and stops there. It knows nothing about
the three things a page in this theme still needs, and each of them is
something a project finds out about the hard way:

- the drop-in — the stylesheet, the script and the faces — standing at the
  site root, copied **whole**;
- every element on the page drawn ahead of the browser, or a reader with no
  script gets an empty box where a card belongs;
- ``_search.json``, because the field in the bar fetches an index that nothing
  in the render writes.

``--fail-on-error`` is the renderer's own half of the safety net: a reference
it could not resolve becomes a red build rather than a line in a log. It says
nothing about the references a theme or a copy step introduced, which is the
third command's job.

The finishing step
==================

``soul-finish.js`` ships inside the drop-in, which ships inside the theme, so
the ``require`` above is what put it there. It needs nothing installed of its
own — one bundled file for the Node that is on every CI image already.

.. code-block:: bash

   node vendor/typo3/soul-guides-theme/resources/dist/soul-finish.js <output-dir> [options]

.. confval:: the output directory
   :type: string
   :required: true

   What the renderer just wrote. Everything happens in place.

.. confval:: --drop-in
   :type: string
   :default: the directory the script is in

   Where the stylesheets are. The default is the answer for anybody who copied
   the drop-in as a directory, because the script is in it.

.. confval:: --no-drop-in
   :type: flag

   The output already has them — a second project rendered under a root that
   was finished once already.

.. confval:: --styles
   :type: string
   :default: "styles"

   What the directory is called at the site root. The theme's ``<head>`` links
   this name, so changing it means overriding a template.

.. confval:: --search
   :type: string
   :default: "_search.json"

   The index the bar fetches. ``--no-search`` writes none, and the field then
   opens, finds nothing and says so — a poor answer to give somebody on every
   page of a site.

It exits non-zero on the one failure that is otherwise silent: a reference that
does not resolve **inside** the output. What gets published is that directory
alone, so a link that worked during the build because the build happened in a
checkout resolves to nothing on the server, and arrives as a page with no
stylesheet rather than as an error anybody reads.

.. note::

   This is the same code ``make guides`` runs in this repository —
   ``scripts/lib/site.ts``, bundled. A documented step that drifts from the one
   we run is worse than no documented step, so there is one implementation and
   both callers share it.

The workflow
============

.. literalinclude:: _starter/publish.yml
   :language: yaml
   :caption: .github/workflows/publish.yml

Four things in it are worth reading rather than copying.

**One checkout, and a renderer built beside it.** The repository holds
documents and this file — no manifest, no lock file. The drop-in and the
finishing step are not Composer packages and cannot be, a stylesheet being no
PHP dependency, so the theme carries them: one ``require`` into a directory
under ``runner.temp`` brings the command, the templates and the stylesheets at
once, and the runner throws all of it away again.

.. important::

   Ask for a tag rather than ``dev-main`` as soon as there is one. A site
   rebuilt against a moving branch is a site whose look can change on a commit
   nobody in your repository made — and the next build after that one is the
   one that has to be explained.

**The Node version is named.** Inherited, it is whatever the runner image
happens to ship this month.

**``.nojekyll``.** Pages serves an uploaded artifact as it stands, but a
repository ever switched back to the branch-based build runs Jekyll over it,
and Jekyll drops every path beginning with an underscore — ``_search.json``
and ``_images/`` among them.

**Two jobs, not one.** Deploying is the only step that writes anything outside
the run, so it is the only one holding ``pages: write``, and it waits for the
render. Deployments queue rather than cancel: a half-replaced site is worse
than a site one commit behind.

Once, in the repository's settings
==================================

GitHub Pages has to be told to take its content from Actions —
**Settings → Pages → Source → GitHub Actions**. Left on a branch, the workflow
runs green, uploads an artifact and publishes nothing, which looks exactly like
a build that worked.

Without GitHub
==============

Nothing above is specific to Actions. The three commands are the build; what a
different runner needs is PHP with Composer, Node, and somewhere to put a
directory of static files. There is no server-side anything in the output:

.. code-block:: bash

   php -S localhost:8000 -t site

That is also how to look at it while writing — the page served there is the
page that gets published, mode switch and search included.

More than one project under one root
====================================

A render is one ``guides.xml``, one CLI call and one ``--output``, and nothing
stops a build from doing that several times. Finish each output separately:
``styles/`` is resolved from a site's own root, so each root needs its own
drop-in, and each gets its own index.

Give every project a root of its own rather than a directory inside another
one. A page one level below somebody else's root does not resolve its assets
the way a published page does, and what is published is then the whole of what
was rendered there — with nothing to remember to take back out. This site is
two: the manual, and the theme's control surface beside it, which is built on
every run and published on none.

Where a project does keep something inside the published root, a name beginning
with an underscore is left out of the search index by the finishing step.

.. seealso::

   :doc:`example` is the project the workflow above builds, file by file.
   :doc:`installation` is the same ground for somebody rendering locally for
   the first time.
