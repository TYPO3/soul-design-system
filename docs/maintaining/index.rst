:navigation-title: Maintaining

======================
Maintaining the system
======================

This section is for work on Soul itself. Where the source is, and what a
task generates from it. How to change the repository without an edit to an
artefact the next build replaces.

The product rules stay with the surfaces they govern. Design decisions and
their reasons live under :doc:`/design-system/index`. The frontend contract
lives under :doc:`/frontend/index`. The documentation renderer lives under
:doc:`/guides-theme/index`. These pages describe how those sources connect
in this repository.

.. toctree::
   :titlesonly:

   source-and-output
   package-splits
   component-evidence
   visual-review
   storybook-tests

Start with the source
=====================

Every artefact has one hand-written source. A generated file can be useful
evidence, and git can keep it for a consumer, but a change never starts
there. :doc:`source-and-output` maps each output back to the source and the
task that own it.

Ship packages
=============

The repository root is a workspace. Every directory under ``packages/`` has
to leave as something a project can install. :doc:`package-splits` explains
how assembly, history replay and the consumer render keep that boundary
honest.

Demand visible evidence
=======================

An element in source is not a maintained component. :doc:`component-evidence`
explains why stories, drawn classes and the Guides render catch different
failures, and how ``make verify ARGS=coverage`` keeps a temporary gap from
a permanent exemption.

Review the pixels
=================

A visual refactor needs a before image, an after image and an exact
comparison. :doc:`visual-review` explains how the screenshot loop freezes
moving state, and why its comparison has no tolerance. And how to tell a
repeated change from the known drift in guideline cards.

Test Storybook
==============

The component preview and the Storybook shell are separate browser
surfaces, and the accessibility panel shares axe with the test suite.
:doc:`storybook-tests` explains how the shipped build keeps those paths
from a test around one another.
