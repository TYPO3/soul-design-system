:navigation-title: States

======
States
======

An answer always carries its source, its version binding, and what it leaves
out. These states carry exactly that. None of them is a spinner with a
shrug.

Focus
=====

An outline ``--border-emphasis`` wide in ``--accent``, ``--focus-offset``
off the box, plus a halo ``--focus-halo`` wide in ``--accent-ring``. That is
2px, 2px and 3px, and every surface that draws the ring reads the three
tokens, not the numbers. Always ``:focus-visible``, never ``:focus``: a click
must not leave a ring behind.

Nothing in this system is reachable by pointer only.

.. specimen:: guidelines/states-focus.card.html
   :viewport: 700x230
   :title: Focus & keyboard

Interaction
===========

A state change uses ``--duration-fast``, 140ms, with ``--ease-out``. Hover
changes colour, border or fill, and never a component's size. Nothing scales
or bounces.

A press takes those colours one step further. ``--accent-active`` under a
filled control, the sunken plane under one with no fill at rest, and nothing
moves under the finger. No specimen can hold that state, and a reader notices
it soonest. A control that looks the same under a press reads as dead on
every page that takes longer than a frame to answer.

A linked card is the one positional exception. It rises 2px, takes the raised
fill and lights the top of its frame with ``--accent-glow``. Keyboard focus
gets the same response, because the whole card is the target. A card in a
flush wall stays put, so it does not tear the shared hairlines. Reduced
motion holds every card still and keeps the fill, border and glow.

A disabled control keeps its colours at half opacity. A disabled state with a
new hue reads as a different tone. Opacity makes the control unavailable
without a new meaning.

Loading
=======

Nothing under 200ms: a flash of loading UI reads as a state change, not as
progress. Over 2s the label says *why*: "booting the installation", "reading
packages instead", "searching docs.typo3.org". A skeleton only where the
shape is certain.

A table has a certain shape, and ``sds-table`` draws its own skeleton. The
head it already has, with bars at the row height under it, so nothing moves
when the rows arrive. ``loading`` and ``loading-rows`` are the whole of it;
see :ref:`sds-table <component-sds-table>`.

**A spinner claims no distance; a bar claims one.** Work that reports how far
it got is ``sds-progress``. A filled length with the position beside it as a
number, driven from outside, and it moves only when the work says so. The ink
comes from that same distance. Grey at the start, and ``--status-ok`` as the
run approaches a result. Never through amber or red, which say something went
wrong with a job that is only early.

Where reports arrive far apart, ``pulsing`` sends a hatch through the filled
part, so a slow run and a stalled one look different. Reduced motion keeps
the hatch and stops its movement. Work that reports nothing gets the spinner:
a bar on a timer tells the reader something nothing measured.

.. specimen:: guidelines/states-loading.card.html
   :viewport: 700x273
   :title: Loading

Empty and not found
===================

.. warning::

   **Never "no results".** Name the source, say it answered, say what it does
   not cover, and offer the nearest real thing. A deliberate boundary is not
   a failure. It gets ``actions-info-circle``, not an error colour.

.. specimen:: guidelines/states-empty.card.html
   :viewport: 700x419
   :title: Empty & not found

A status on a word
==================

``.sds-ok``, ``.sds-warn`` and ``.sds-error`` put a status colour on a word:
a count in a table cell, a state in a line of prose. They set the colour and
nothing else.

Use one where a badge is a pill around a single word. ``sds-badge`` is the
mark on a *thing*, a row, a card, a heading, and it draws a box. In the
middle of a sentence or a cell, a box is furniture. The classes are the same
three colours as the badge, without the box.

They are the only way a page can colour a word. A page that writes ``color:
var(--status-warn)`` into its own stylesheet holds a copy of this layer's
value. The two drift when the palette moves.

.. specimen:: guidelines/states-tone.card.html
   :viewport: 700x345
   :title: Status on a word

Errors and degraded answers
===========================

Warning, error and success share one note structure: an icon, a direct
heading and an explanation. The structure identifies feedback. Colour and
icon identify its tone, so colour never carries the difference alone.

A **warning** is a degraded but usable answer. What the tool reached, what it
read instead, what that leaves out, and the command that fixes it. An
**error** is no answer, plus the command or environment variable that changes
that.

**Success** appears only when the *source* matters: "answered from bundled
knowledge · 12.4, 13.4". Never praise, never a "done" toast.

.. specimen:: guidelines/states-error.card.html
   :viewport: 700x470
   :title: Errors & degraded answers

A message with an action
========================

Where the reader can settle what the note says on the page, the note carries
the answer. ``action`` puts one button after the sentence, and ``href`` makes
it a link. One, and only where the press is the whole answer. A message that
offers a choice between two things is a dialog. A note with a button nobody
needs is a sentence dressed up as urgent.

The button belongs to the note, not to whoever writes the message. So every
message in a product offers its answer as the same control in the same place.
It is a secondary. The note is not what the page is for, and a filled button
in it outranks what the reader came to do.
