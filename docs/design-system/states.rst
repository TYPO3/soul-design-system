:navigation-title: States

======
States
======

An answer always carries its source, its version binding, and what it leaves
out. These states exist to carry exactly that — which is why none of them is
a spinner with a shrug.

Focus
=====

An outline ``--border-emphasis`` wide in ``--accent``, standing
``--focus-offset`` off the box, plus a halo ``--focus-halo`` wide in
``--accent-ring`` — 2px, 2px and 3px, and every surface that draws the ring
reads those three tokens rather than the numbers. Always ``:focus-visible``,
never ``:focus`` — a click should not leave a ring behind.

Nothing in this system is reachable by pointer only.

.. specimen:: guidelines/states-focus.card.html
   :viewport: 700x214
   :title: Focus & keyboard

Interaction
===========

State changes use ``--duration-fast`` — 140ms — with ``--ease-out``. Hover
normally changes colour, border or fill and never changes a component's size.
Nothing scales or bounces.

A linked card is the deliberate positional exception. It rises 2px, takes the
raised fill and lights the top of its frame with ``--accent-glow``; keyboard
focus gets the same response because the whole card is the target. A card in a
flush wall stays put so it does not tear the shared hairlines. Reduced motion
holds every card still while keeping the fill, border and glow, so the state
does not disappear with the movement.

Disabled controls keep their colours and use half opacity. A disabled state
that changes hue can be mistaken for a different tone; opacity makes the
existing control unavailable without giving it a new meaning.

Loading
=======

Nothing under 200ms: a flash of loading UI reads as a state change rather than
useful progress. Over 2s the label says *why*: "booting the installation",
"reading packages instead", "searching docs.typo3.org". Skeletons only where
the shape is already known.

.. specimen:: guidelines/states-loading.card.html
   :viewport: 700x257
   :title: Loading

Empty and not found
===================

.. warning::

   **Never "no results".** Name the source asked, say it answered, say what it
   does not cover, and offer the nearest real thing. A deliberate boundary is
   not a failure: it gets ``actions-info-circle``, not an error colour.

.. specimen:: guidelines/states-empty.card.html
   :viewport: 700x448
   :title: Empty & not found

Errors and degraded answers
===========================

Warning, error and success share the same note structure: an icon, a direct
heading and an explanation. The structure identifies feedback; colour and icon
identify its tone, so colour never has to carry the distinction alone.

A **warning** is a degraded but usable answer: what was reached, what was
read instead, what that leaves out, and the command that fixes it. An
**error** is no answer, plus the command or environment variable that would
change that.

**Success** appears only when the *source* matters — "answered from bundled
knowledge · 12.4, 13.4". Never praise, never a "done" toast.

.. specimen:: guidelines/states-error.card.html
   :viewport: 700x472
   :title: Errors & degraded answers
