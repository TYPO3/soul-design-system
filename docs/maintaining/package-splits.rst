:navigation-title: Package splits

==============
Package splits
==============

This repository's root is a workspace: it holds source, specimens, documentation,
tooling and the gate, and is not installed by a consuming project. A directory
under ``packages/`` is different. It is a delivery boundary and a promise that
the assembled directory can stand alone in the repository from which it is
published.

``packages/frontend/`` is the npm package ``@typo3/soul-frontend``.
``packages/guides-theme/`` is the Composer package
``typo3/soul-guides-theme``. Their public mirrors are generated outputs; this
monorepo remains the only place either package is authored.

Why mirrors exist
=================

Package managers install from a repository root. Composer looks for
``composer.json`` there, and npm resolves the package rooted there. A package
maintained inside this workspace therefore needs a repository in which its own
manifest and files form the root rather than a nested directory.

Do not edit a mirror. The next replay replaces its working tree with the
package assembled from this repository, so a direct commit is neither a source
change nor a durable patch. Issues and changes return here, through the package
source and its generator.

Assembly owns the contents
==========================

``PACKAGES`` in ``scripts/lib/packages.ts`` is the authoritative definition of
each package: its source concerns, manifest, remote, assembly function and
completeness checks. The frontend package is assembled from its package
directory. The Guides theme also receives the committed frontend drop-in under
``resources/dist/`` because that directory is part of what a Composer consumer
must receive.

Run the package check without publishing anything:

.. code-block:: bash

   make split ARGS=--check

The task assembles each package into an isolated directory and asks whether a
consumer would find its manifest, entry points and required assets. It is part
of ``make verify``; a green source tree with an incomplete package is not a
shippable tree.

Replay package history
======================

``scripts/split.ts`` assembles the package at each relevant monorepo commit
rather than copying the current directory onto one final commit. This is
necessary for the Guides theme because its published tree combines theme
source with the frontend drop-in, which do not share one source directory.

The replay preserves the source commit's author, date and message and adds a
``Split-From:`` trailer. That trailer records where the mirror stopped, so the
next run continues instead of replaying the same range. When the package
content did not change, an empty commit gives the release a commit it can name.

Tags are placed after the replay, over the whole mirror rather than over the
commits one run happened to write. The trailer says which source commit each
mirrored commit came from, so a tag finds its commit whether the release was
cut from a commit that is already mirrored or from one this run has just
carried across. A tag already on the right commit is left alone, and a mirror
never moves a tag it has published.

Ship a complete theme
=====================

The Guides theme is PHP, while its page styles, elements and finishing step
are not. A Composer-only documentation project cannot be required to fetch an
npm build beside the theme, so the assembled theme carries the frontend
drop-in itself. ``soul-finish.js`` travels with that directory and performs the
post-render work described in :doc:`/guides-theme/publishing`.

This is a package boundary rather than duplicated implementation.
``scripts/lib/site.ts`` remains the source of the finishing step,
``make dist`` bundles it into the frontend drop-in, and package assembly places
that committed output where a Composer consumer receives it.

Test the consumer path
======================

``make guides`` assembles the theme, creates an empty consumer directory and
installs the package through Composer. The renderer, templates, drop-in and
finishing step are then taken from ``vendor/`` rather than imported from their
monorepo paths. ``make guides ARGS=--released`` repeats the render against the
published package, which is the one a reader installs.

The manual's installation and publishing commands are therefore executable
architecture: this site's own render reaches the same package boundary a
reader is asked to use. A shortcut available only inside this checkout would
leave that documented path untested.
