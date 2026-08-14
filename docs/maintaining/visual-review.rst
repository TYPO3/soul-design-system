:navigation-title: Visual review

=============
Visual review
=============

A screenshot comparison is evidence for a visual change only when the state
on both sides is controlled. The repository captures every specimen at its
declared viewport and compares the rendered pixels; it does not infer intent
from the source that produced them.

Take both images
================

Capture the baseline before editing and the second set after the change:

.. code-block:: bash

   make baseline
   # Make the visual change.
   make shots
   make diff

``make diff ARGS=--write-diffs`` also writes images that mark the changed
pixels. A changed card is a prompt to inspect what moved, not an approval of
the movement. Keep the baseline from the unchanged tree until every reported
difference has an explanation.

Compare exact pixels
====================

The comparison uses a pixelmatch threshold of zero. A small tolerance can hide
the muted edge or text pixels produced by a deliberate token change, which is
exactly the class of change this check exists to expose. Do not raise the
threshold to make an unstable render appear quiet; remove or control the
moving source instead.

Freeze moving state
===================

Screenshot and test helpers disable transitions and animations before they
measure. Switching ``data-theme`` changes the colour tokens together, while a
component may still be transitioning its ``color``. A value read during that
interval belongs to neither completed theme.

Any new colour measurement, contrast check or screenshot path must therefore
wait for the requested theme and custom elements, load the fonts, then disable
motion before reading or capturing the page. ``tests/lib/story.ts`` owns that
sequence for Storybook tests; ``scripts/shoot.ts`` applies the same motion
guard to specimen screenshots.

Reproduce a change
==================

Cards currently drift between unchanged screenshot runs, most visibly among
the hand-written guidelines. The cards reported by one run need not be the
cards reported by the next. This is an open defect in the capture, not pixel
variation the comparator should tolerate.

Run ``make shots && make diff`` once before editing as an unchanged control,
then repeat it against the same baseline after the change. A difference that
returns on the same card and in the same region is a candidate to inspect, not
a conclusion; a changing set or region is noise to isolate first. For a
refactor intended to preserve output, also compare the source declarations and
map renamed or logical properties back to the values they replace. Record
which evidence reproduced when reporting the result.
