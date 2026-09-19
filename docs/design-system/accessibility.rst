:navigation-title: Accessibility

=============
Accessibility
=============

What the system answers for, and what it leaves to the page. Most of it is
not a feature on top. It is the reason a rule elsewhere in this manual reads
the way it does, collected here because a project asks this first.

The ring is the only shadow on the page
=======================================

``--border-emphasis`` of ``--accent`` at ``--focus-offset``, with a
``--focus-halo`` of ``--accent-ring`` behind it; :doc:`states` has the
values. It is the one ``box-shadow`` anything *in* the page draws, and it is
a state, not depth. What stays on the page separates with a hairline. Only a
surface that has left the page carries a shadow of its own. A ring nobody
mistakes for a raised surface still reads on a page full of surfaces.

Always ``:focus-visible``, never ``:focus``: a pointer must not leave a ring
behind. **Nothing in this system is reachable by pointer only.**

.. specimen:: guidelines/states-focus.card.html
   :viewport: 700x230
   :title: Focus & keyboard

Colour never carries it alone
=============================

Every result tone carries a glyph and a colour. Colour alone leaves the
meaning to anyone who cannot tell the hues apart. Status is a colour **plus**
a mark from the icon set, never an emoji, which is a different typeface with
a different meaning per platform.

The same rule runs through the components. A badge states its tone in words.
An admonition keeps the type's own word in the glyph's accessible name. A
figure's bound is text, not a bar.

A glyph says what it is
=======================

A few glyphs can stand without a label, because each appears in one meaning
only, everywhere. :doc:`icons` names them. Everything else takes a label.

An icon-only control keeps its label as the control's accessible name, so a
square button still announces what it does. See
:doc:`/frontend/components/controls`.

.. _said-only:

Some of a page is said and not drawn
====================================

A label answers for a control. A *page* owes the reading the other half. The
name of the thing the lockup above already shows. The heading of a column
whose head is a glyph. The word that says which of forty rows this one is.

``sds-said-only`` is the register for it. The text stands in the reading
order at its place and takes no room on the page.

It is a register, not a way to hide. ``display: none`` and the ``hidden``
attribute take a passage out of the reading as well, which is the opposite.
Use it where the picture is all a sighted reader needs. Never use it to say
something *different* from the drawing.

Contrast holds everywhere
=========================

Normal text meets the WCAG AA minimum of 4.5:1 against every surface the
system permits it on, in light and dark. The weakest permitted pair is the
test, not the canvas alone. Token values keep headroom above the minimum, so
rounding and a nearby surface do not turn a pass into a borderline.

Quiet text is still text. ``--text-muted`` carries metadata and placeholders,
``--syntax-comment`` carries code comments, and a status token can carry a
label in a result or a badge. Their lower rank comes from the hierarchy, not
from a lower contrast.

A token change reaches every copy of its value. SVG diagrams carry a light
fallback for a page without tokens, and a specimen can print a value as
evidence. Update those with the token. :doc:`artwork` says when a drawing's
fallback belongs to the artwork on purpose.

Both modes are one declaration
==============================

Light and dark sit in one ``light-dark()`` value. So a contrast decision in
one mode cannot go missing in the other. There is no second palette to keep
in step.

Reduced motion
==============

Under ``prefers-reduced-motion: reduce`` the system stops the page from
movement and takes nothing away:

- the spinner and the skeleton stop;
- the transitions across a layout band go. **The step stays; the travel
  across it goes.** A new width is the width;
- a fold opens and closes with no travel, and still opens and closes;
- a card holds still under the pointer, while its fill and hairline answer.

The preference disables nothing. It removes movement, never a state a reader
needs to see.

It works before the script does
===============================

Every element renders light DOM and upgrades markup that already carries the
whole visual system. So a page is complete before JavaScript runs. A fold is
a ``<details>``: the keyboard reaches it, find-in-page opens the answer it
lands in, and the platform closes the others. Where a behaviour is the
element's own, the copy button, the tab bar's arrow keys, its absence costs
the reader no meaning.

Direction
=========

The layout uses logical properties. ``dir="rtl"`` on ``<html>`` mirrors it,
and the glyphs that mean *onward* turn with it. :doc:`/frontend/layout` says
what a project has to do.

What the suite checks
=====================

``make test`` runs axe over every story in **both modes** and fails on
serious and critical violations. Only those two. The specimens draw states no
automated pass can interpret, a control drawn disabled, a ring on an element
without focus. A fail on ``minor`` trains everyone to ignore the run.

.. important::

   **A green run is not a claim of conformance.** axe reaches contrast,
   names, roles and structure. It cannot judge if a label says the right
   thing, or if an order makes sense to a reader. It cannot judge if an empty
   state answers the question. Those are the rules in :doc:`states`, and
   review holds them.

.. seealso::

   :doc:`states` for what each state has to say, :doc:`colours` for the
   contrast the planes rest on, and :doc:`icons` for the set and the label
   rule.
