:navigation-title: Visual review

=============
Visual review
=============

A screenshot comparison is evidence for a visual change only when both
sides have a controlled state. The repository captures every specimen at
its declared viewport and compares the rendered pixels. It does not infer
intent from the source.

Take both images
================

Capture the baseline before the edit, and the second set after the change:

.. code-block:: bash

   make baseline
   # Make the visual change.
   make shots
   make diff

Under every changed card ``make diff`` names three files: the shot before,
the shot after, and a mask of the pixels that moved, under ``.out/diffs/``.
A changed card is a prompt to open those and inspect what moved, not an
approval of the movement. Keep the baseline from the unchanged tree until
every reported difference has an explanation.

Compare exact pixels
====================

The comparison uses a pixelmatch threshold of zero. A small tolerance can
hide the muted edge or text pixels of a deliberate token change. That is
exactly the class of change this check exists to expose. Do not raise the
threshold to quiet an unstable render. Remove or control the moving source.

Freeze moving state
===================

The screenshot and test helpers disable transitions and animations before
they measure. A switch of ``data-theme`` changes the colour tokens
together, while a component can still transition its ``color``. A value
read during that interval belongs to neither complete theme.

So every new colour measurement, contrast check or screenshot path waits
for the theme and the custom elements, loads the fonts, then disables
motion. Only then does it read or capture the page. ``tests/lib/story.ts``
owns that sequence for Storybook tests. ``scripts/shoot.ts`` applies the
same motion guard to specimen screenshots.

Reproduce a change
==================

Cards drift between unchanged screenshot runs, most of all among the
hand-written guidelines. The cards one run reports are not always the cards
the next run reports. This is an open defect in the capture, not pixel
variation for the comparator to tolerate.

Run ``make shots && make diff`` once before the edit as an unchanged
control, then repeat it against the same baseline after the change. A
difference that returns on the same card and in the same region is a
candidate to inspect, not a conclusion. A changed set or region is noise to
isolate first. For a refactor that must keep its output, also compare the
source declarations. Map renamed or logical properties back to the values
they replace. Record which evidence reproduced in the report.
