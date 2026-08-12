:navigation-title: Publishing

=====================
Publishing it, in CI
=====================

Three commands turn a directory of documents into the site this manual is. The
workflow below is those three with a checkout in front and a deploy behind,
and it is not an illustration: it is the file in
:doc:`examples/starter <example>`, and the gate in this repository runs it on
every push.

.. code-block:: bash

   composer install
   vendor/bin/guides docs --output=site -c docs --fail-on-error
   node .soul/packages/frontend/dist/soul-finish.js site

.. contents::
   :local:

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

``soul-finish.js`` ships inside the drop-in and needs nothing installed — it is
one bundled file for the Node that is on every CI image already.

.. code-block:: bash

   node path/to/dist/soul-finish.js <output-dir> [options]

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

**The second checkout.** The theme is a Composer package; the drop-in and the
finishing step are not, and cannot be — a stylesheet is not a PHP dependency.
Both arrive as a checkout of the design system, and ``composer.json`` requires
the theme out of that same directory:

.. literalinclude:: _starter/composer.json
   :language: json
   :caption: composer.json

.. important::

   Pin ``ref:`` to a tag. A site rebuilt against a moving branch is a site
   whose look can change on a commit nobody in your repository made — and the
   next build after that one is the one that has to be explained.

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

The output directory takes several renders: one ``guides.xml`` each, one CLI
call each, each with its own ``--output`` under the same root. This site is
two — the manual, and the theme's acceptance fixture under ``_acceptance/``.

Finish each output that has a ``<head>`` of its own, since ``styles/`` is
resolved from each site's own root, and write the index once over the root
that gets published. A directory whose name starts with an underscore is left
out of the index by the finishing step, which is what makes it the right place
for a control surface.

.. seealso::

   :doc:`example` is the project the workflow above builds, file by file.
   :doc:`installation` is the same ground for somebody rendering locally for
   the first time.
