:navigation-title: Maintaining

======================
Maintaining the system
======================

This section is for work on Soul itself: finding the authoritative source,
understanding what a task generates from it, and changing the repository
without editing an artefact that will be replaced on the next build.

The product-facing rules stay with the surfaces they govern. Design decisions
and their reasons live under :doc:`/design-system/index`; the frontend contract
lives under :doc:`/frontend/index`; the documentation renderer lives under
:doc:`/guides-theme/index`. These pages describe how those sources are wired
together in this repository.

.. toctree::
   :titlesonly:

   source-and-output
   component-evidence
   visual-review

Start with the source
=====================

Every maintained artefact has one hand-written source. A generated file can be
useful evidence and may be committed for a consumer, but it is never the place
where a change begins. :doc:`source-and-output` maps each output back to the
source and task that own it.

Require visible evidence
========================

An element in source is not enough to make it a maintained component.
:doc:`component-evidence` explains why stories, drawn classes and the Guides
render catch different failures, and how ``make verify ARGS=coverage`` keeps
temporary gaps from becoming permanent exemptions.

Review the pixels
=================

A visual refactor needs a before image, an after image and an exact comparison.
:doc:`visual-review` explains how the screenshot loop freezes moving state,
why its comparison has no tolerance and how to distinguish a repeated change
from the known drift in guideline cards.
