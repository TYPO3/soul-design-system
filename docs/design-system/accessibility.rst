:navigation-title: Accessibility

=============
Accessibility
=============

What the system answers for, and what it leaves to the page built on it. Most
of it is not a feature added on top: it is the reason a rule elsewhere in this
manual is written the way it is, collected here because a project evaluating
the system asks this before it asks anything else.

The ring is the only shadow on the page
=======================================

``--border-emphasis`` of ``--accent`` at ``--focus-offset``, with a
``--focus-halo`` of ``--accent-ring`` behind it — see :doc:`states` for the
values those hold. It is the one ``box-shadow`` anything standing *in* the page
draws, and it is a state rather than depth: what stays on the page separates
with a hairline, and only a surface that has left it — what the bar opens over
the text — carries a shadow of its own. A ring nobody can mistake for a raised
surface is a ring that still reads on a page full of surfaces.

Always ``:focus-visible`` and never ``:focus``: a pointer should not leave a
ring behind. **Nothing in this system is reachable by pointer only.**

.. specimen:: guidelines/states-focus.card.html
   :viewport: 700x213
   :title: Focus & keyboard

Colour never carries it alone
=============================

Every result tone carries a glyph as well as a colour, because colour alone
leaves the meaning to anyone who cannot tell the hues apart. Status is a
colour **plus** a mark from the icon set — never an emoji, which is a
different typeface with a different meaning per platform.

The same rule runs through the components: a badge states its tone in words,
an admonition keeps the type's own word in the glyph's accessible name even
where the tone no longer tells two types apart, and a figure's bound is text
rather than a bar.

A glyph says what it is
=======================

A handful of glyphs may stand without a label, and they earned it by appearing
in one meaning only, everywhere: :doc:`icons` names them and says what each
one means. Everything else takes a label.

An icon-only control is the case worth naming: the label becomes the control's
accessible name rather than being dropped, so a square button is still
announced as what it does — see :doc:`/frontend/components/controls`.

Contrast holds everywhere
=========================

Normal text meets the WCAG AA minimum of 4.5:1 against every surface on which
the system allows it to appear, in light and dark. The weakest permitted
pairing is the test, not the canvas alone. Token values keep some headroom
above the minimum so rounding, rendering and a nearby surface do not turn a
passing value into a borderline one.

Quiet text is still text. ``--text-muted`` carries metadata and placeholders,
``--syntax-comment`` carries code comments, and a status token may carry a
label inside a result or badge. Their lower visual rank comes from their place
in the hierarchy, not from accepting contrast below the text requirement.

A token change reaches every copy of its value. SVG diagrams carry a light
fallback for the case where no page tokens exist, and specimens may print a
value as evidence; update those sources with the token rather than leaving the
published explanation behind. :doc:`artwork` explains when a drawing's
standalone fallback deliberately belongs to the artwork instead.

Both modes are one declaration
==============================

Light and dark sit in the same ``light-dark()`` value, so a contrast decision
cannot be made in one mode and forgotten in the other. There is no second
palette to keep in step, which is the failure this arrangement exists to
prevent rather than a convenience.

Reduced motion
==============

Under ``prefers-reduced-motion: reduce`` the system stops moving the page
without taking anything away from it:

- the spinner and the skeleton stop animating;
- the transitions across a layout band go — **the step stays, what goes is
  the travel across it**, because a new width is simply the width;
- a fold opens and closes with no travel, and still opens and closes;
- a card is held still under the pointer, while its fill and hairline still
  answer, so the surface is not left unresponsive.

Nothing is disabled by the preference. What it removes is movement, never a
state a reader needs to see.

It works before the script does
===============================

Every element renders light DOM and upgrades markup that already carries the
whole visual system, so a page is complete before any JavaScript runs. A fold
is a ``<details>``, which means the keyboard reaches it, find-in-page opens
the answer it lands in, and what closes the others is the platform rather than
a listener. Where behaviour is genuinely the element's — the copy button, the
tab bar's arrow keys — its absence costs the reader nothing that carries
meaning.

Direction
=========

The layout is written in logical properties, so ``dir="rtl"`` on ``<html>``
mirrors it and the glyphs the system uses to mean *onward* turn with it. See
:doc:`/frontend/layout` for what a project has to do and what it still owes.

What is actually checked
========================

``make test`` runs axe over the specimens in **both modes** and fails on
serious and critical violations. Only those two: the specimens deliberately
draw states no automated pass can interpret — a control drawn disabled, a ring
on an element that does not have focus — and failing on ``minor`` would train
everyone to ignore the run.

.. important::

   **A green run is not a claim of conformance.** axe reaches contrast,
   names, roles and structure. It cannot judge whether a label says the right
   thing, whether an order makes sense to somebody reading with one, or
   whether an empty state answers the question that was asked. Those are the
   rules in :doc:`states` and they are checked by reading, not by a runner.

.. seealso::

   :doc:`states` for what each state has to say, :doc:`colours` for the
   contrast the planes are built on, and :doc:`icons` for the set and the
   label rule.
