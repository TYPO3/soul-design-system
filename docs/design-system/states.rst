:navigation-title: States

======
States
======

An answer always carries its source, its version binding, and what it leaves
out. These states exist to carry exactly that — which is why none of them is
a spinner with a shrug.

Focus
=====

``outline: 2px solid var(--accent)`` at ``outline-offset: 2px``, plus an
``--accent-ring`` halo. Always ``:focus-visible``, never ``:focus`` — a click
should not leave a ring behind.

Nothing in this system is reachable by pointer only.

.. specimen:: guidelines/states-focus.card.html
   :viewport: 700x230
   :title: Focus & keyboard

Loading
=======

Nothing under 200ms. Over 2s the label says *why*: "booting the installation",
"reading packages instead", "searching docs.typo3.org". Skeletons only where
the shape is already known.

.. specimen:: guidelines/states-loading.card.html
   :viewport: 700x275
   :title: Loading

Empty and not found
===================

.. warning::

   **Never "no results".** Name the source asked, say it answered, say what it
   does not cover, and offer the nearest real thing. A deliberate boundary is
   not a failure: it gets ``actions-info-circle``, not an error colour.

.. specimen:: guidelines/states-empty.card.html
   :viewport: 700x276
   :title: Empty & not found

Errors and degraded answers
===========================

A **warning** is a degraded but usable answer: what was reached, what was
read instead, what that leaves out, and the command that fixes it. An
**error** is no answer, plus the command or environment variable that would
change that.

**Success** appears only when the *source* matters — "answered from bundled
knowledge · 12.4, 13.4". Never praise, never a "done" toast.

.. specimen:: guidelines/states-error.card.html
   :viewport: 700x460
   :title: Errors & degraded answers
