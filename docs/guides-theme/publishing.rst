:navigation-title: Publishing

=====================
Publishing it, in CI
=====================

A directory of documents becomes the site this manual is through the
commands below. One builds the renderer, one writes the documents, one turns
the documents into a site. The workflow after them is the same run with a
checkout in front and a deploy behind. The last command is a file out of
the package, not a script you write.

.. code-block:: bash

   composer require typo3/soul-guides-theme
   vendor/bin/guides docs --output=site -c docs --fail-on-error
   node vendor/typo3/soul-guides-theme/resources/dist/soul-finish.js site

The first runs in a directory of its own. A documentation repository holds
documents, not a PHP manifest. :doc:`installation` says what that directory
is and why a build throws it away.

What the renderer does not do
=============================

The second command writes documents and stops there. It knows nothing about
what a page in this theme still needs, and a project finds out about each
of these the hard way:

- the drop-in, the stylesheet, the script and the faces, at the site root,
  copied **whole**;
- every element on the page drawn before the browser. Otherwise a reader
  with no script gets an empty box where a card belongs;
- ``_search.json``, because the field in the bar fetches an index nothing in
  the render writes.

What it *does* do beyond the pages is write them twice. ``page.md`` lands
beside every ``page.html``: the same document as Markdown, for the reader
that is a program. Each page names its own twin in the head. It is a second
output format, not a step afterwards. So both come from one parsed document,
and a link inside a twin lands on the next twin.

``llms.txt`` lands at the publish root with them: the toctree as a list of
those twins, for a reader with no navigation. ``markdown`` in
:doc:`configuration` is the setting, and the reason.

``--fail-on-error`` is the renderer's own half of the safety net. A
reference with no target becomes a red build, not a line in a log. It
says nothing about the references a theme or a copy step added, which is the
third command's job.

The finishing step
==================

``soul-finish.js`` ships inside the drop-in, which ships inside the theme,
so the ``require`` above put it there. It needs nothing of its own: one
bundled file for the Node that is on every CI image already.

.. code-block:: bash

   node vendor/typo3/soul-guides-theme/resources/dist/soul-finish.js <output-dir> [options]

.. confval:: the output directory
   :type: string
   :required: true

   What the renderer just wrote. Everything happens in place.

.. confval:: --drop-in
   :type: string
   :default: the directory the script is in

   Where the stylesheets are. The default is the answer for anybody who
   copied the drop-in as a directory, because the script is in it.

.. confval:: --no-drop-in
   :type: flag

   The output already has them: a second project rendered under a root
   after its finish.

.. confval:: --styles
   :type: string
   :default: "styles"

   The name of the directory at the site root. The theme's ``<head>`` links
   this name, so a change here means a template override.

.. confval:: --search
   :type: string
   :default: "_search.json"

   The index the bar fetches. ``--no-search`` writes none. The field then
   opens, finds nothing and says so, on every page of a site.

It exits non-zero on the one failure that is otherwise silent: a reference
that does not resolve **inside** the output. The publish takes that
directory alone. A link that worked in the build because the build ran in a
checkout resolves to nothing on the server. It arrives as a page with no
stylesheet, not as an error anybody reads.

.. note::

   This is the code ``make guides`` runs in this repository,
   ``scripts/lib/site.ts``, bundled. A documented step that drifts from the
   one in use is worse than none, so there is one implementation, and both
   callers share it.

The workflow
============

.. literalinclude:: _starter/publish.yml
   :language: yaml
   :caption: .github/workflows/publish.yml

What to read in it, not only copy:

**One checkout, and a renderer beside it.** The repository holds documents
and this file: no manifest, no lock file. The drop-in and the finishing
step are not Composer packages and cannot be, since a stylesheet is no PHP
dependency, so the theme carries them. One ``require`` into a directory
under ``runner.temp`` brings the command, the templates and the stylesheets
at once, and the runner throws all of it away.

.. important::

   The command above takes the newest release and pins it in your own
   ``composer.json``. ``dev-main`` instead asks for a look that can change
   on a commit nobody in your repository made. The next build after that
   one is the one to explain.

**The Node version has a name.** Inherited, it is whatever the runner
image ships this month.

**``.nojekyll``.** Pages serves an uploaded artifact as it stands. But a
repository that ever goes back to the branch-based build runs Jekyll over
it. Jekyll drops every path with a leading underscore, ``_search.json`` and
``_images/`` among them. The upload leaves a dotfile out unless
``include-hidden-files`` says otherwise, and the marker is one.

**Two jobs, not one.** The deploy is the only step that writes anything
outside the run. So it is the only one with ``pages: write``, and it waits
for the render. Deployments queue and do not cancel. A half-replaced site
is worse than a site one commit behind.

Once, in the settings
=====================

Tell GitHub Pages to take its content from Actions: **Settings → Pages →
Source → GitHub Actions**. On a branch, the workflow runs green, uploads an
artifact and publishes nothing, which looks exactly like a build that
worked.

Without GitHub
==============

Nothing above is specific to Actions. The commands at the top are the
build. A different runner needs PHP with Composer, Node, and a place for a
directory of static files. There is nothing server-side in the output:

.. code-block:: bash

   php -S localhost:8000 -t site

That is also how to look at it while you write. The page served there is
the page the workflow publishes, mode switch and search included.

Several projects, one root
==========================

A render is one ``guides.xml``, one CLI call and one ``--output``, and a
build can do that several times. Finish each output on its own. ``styles/``
resolves from a site's own root, so each root needs its own drop-in, and
each gets its own index.

Give every project a root of its own, not a directory inside another one. A
page one level below somebody else's root does not resolve its assets the
way a published page does. And the publish then takes the whole render
under that root, with nothing to take back out. This site is the manual, and
beside it the theme's control surface, built on every run and published on
none.

Where a project does keep something inside the published root, the
finishing step leaves a name with a leading underscore out of the search
index.

.. seealso::

   :doc:`example` is the project the workflow above builds, file by file.
   :doc:`installation` is the same ground for a first local render.
