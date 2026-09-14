:navigation-title: Package splits

==============
Package splits
==============

This repository's root is a workspace. It holds source, specimens,
documentation, tooling and the gate, and no consumer installs it. A
directory under ``packages/`` is different. It is a delivery boundary, and a
promise that the assembled directory stands alone in its own repository.

``packages/frontend/`` is the npm package ``@typo3/soul-frontend``.
``packages/guides-theme/`` is the Composer package
``typo3/soul-guides-theme``. Their public mirrors are a task's output.
This monorepo stays the only place with the source of either.

Why mirrors exist
=================

Package managers install from a repository root. Composer looks for
``composer.json`` there, and npm resolves the package rooted there. So a
package inside this workspace needs a repository in which its own manifest
and files form the root, not a nested directory.

Do not edit a mirror. The next replay replaces its working tree with the
package from this repository. So a direct commit there is neither a source
change nor a durable patch. Issues and changes return here, through the
package source and its generator.

Assembly owns the contents
==========================

``PACKAGES`` in ``scripts/lib/packages.ts`` defines each package: its
source concerns, manifest, remote, assembly function and completeness
checks. The frontend package comes from its package directory. The Guides
theme also gets the committed frontend drop-in under ``resources/dist/``,
because a Composer consumer must get that directory.

Run the package check without a publish:

.. code-block:: bash

   make split ARGS=--check

The task assembles each package into an isolated directory and asks if a
consumer finds its manifest, entry points and necessary assets. It is part
of ``make verify``. A green source tree with an incomplete package is not a
tree to ship.

Replay package history
======================

``scripts/split.ts`` assembles the package at each relevant monorepo
commit. It does not copy the current directory onto one final commit. The
Guides theme needs that, because its published tree combines theme source
with the frontend drop-in, which have no shared source directory.

The replay keeps the source commit's author, date and message and adds a
``Split-From:`` trailer. That trailer records where the mirror stopped, so
the next run continues and does not replay the same range. When the package
content did not change, an empty commit gives the release a commit it can
name.

Tags come after the replay, over the whole mirror, not over the commits one
run wrote. The trailer says which source commit each mirrored commit came
from. So a tag finds its commit if the release came from a commit already
in the mirror. It also finds it if the run has just carried it across. A tag
already on the right commit stays, and a mirror never moves a tag it has
published.

Ship a complete theme
=====================

The Guides theme is PHP, while its page styles, elements and finishing step
are not. A Composer-only documentation project cannot have an npm build
beside the theme as a precondition. So the assembled theme carries the
frontend drop-in itself. ``soul-finish.js`` travels with that directory and
does the post-render work in :doc:`/guides-theme/publishing`.

This is a package boundary, not a second implementation.
``scripts/lib/site.ts`` stays the source of the finishing step. ``make
dist`` bundles it into the frontend drop-in, and the package assembly puts
that committed output where a Composer consumer gets it.

Test the consumer path
======================

``make guides`` assembles the theme, creates an empty consumer directory and
installs the package through Composer. The renderer, the templates, the
drop-in and the finishing step then come from ``vendor/``, not from their
monorepo paths. ``make guides ARGS=--released`` repeats the render against
the published package, the one a reader installs.

So the manual's install and publish commands are executable
architecture. This site's own render reaches the same package boundary a
reader uses. A shortcut only inside this checkout leaves that documented
path without a test.
