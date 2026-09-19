:navigation-title: Colours

=======
Colours
=======

Every colour in this system is a semantic token, one ``light-dark(light,
dark)`` against a ``:root`` that sets ``color-scheme``. There is no second
block for dark mode. So light and dark **cannot drift**: they are one
declaration.

Light and dark are equal surfaces. Light is warm paper, not pure white. Dark
is the terminal, not a dimmed copy of the light palette. With no
``data-theme`` the reader's operating system decides, so neither mode is the
exception.

Force a mode on a subtree with ``data-theme="light"`` or
``data-theme="dark"``. Put it on ``<html>`` for a whole page. Deeper, the
browser's own chrome, scrollbars and form controls, stays in the other mode.
Every token follows the subtree's mode, and so does the ink. The subtree
sets its text colour again, because the colour above it resolved in the
other mode.

A mode choice is a product control, not a preference screen. :ref:`sds-theme
<component-sds-theme>` shows the choices in place and returns to the
machine's setting when the active choice gets a second press. The document
writes a remembered choice before the first paint. The control then reads
the document instead of a second idea of the mode.

Scrollbars belong to the surface as well. They use the border token for the
thumb, the muted text token under the pointer and a transparent track. With
``color-scheme`` alone, the browser decides, and the edge of one page looks
different per engine.

.. warning::

   **Never set a colour literal.** Not a hex, not an ``rgb()``, not a named
   colour. If nothing here fits, the answer is a new token, not a local
   value.

Surfaces
========

Each plane means something, and a thing that means nothing sits on the
canvas. A **card** is a hairline and 6px with no fill of its own.

.. list-table::
   :header-rows: 1

   * - Token
     - The plane
     - Use it when
   * - ``--surface-canvas``
     - the ground
     - ``.sds-app`` puts it under the page, and everything else sits on it
   * - ``--surface-raised``
     - lifted off that ground
     - a panel or a modal reads as a plane of its own, a table row answers a
       pointer
   * - ``--surface-sunken``
     - machine output
     - a code block, a log, the ground of a diagram
   * - ``--surface-inset``
     - a well inside another surface
     - a skeleton, a tick box under the pointer, the facts on a reference
       entry
   * - ``--surface-accent-quiet``
     - the tinted plane
     - a selected row, an accent badge, a degraded answer, with
       ``--border-accent-quiet`` as its frame and ``--text-accent-quiet`` as
       its ink
   * - ``--surface-error-quiet``
     - the plane under a failure
     - a note with ``tone="error"``, with ``--border-error-quiet`` as its
       frame and ``--status-error`` on the glyph alone. A pair of its own,
       because the status red is ink. A wash of it over paper goes grey
       before it goes red
   * - ``--surface-overlay``
     - the wash under a floating surface
     - a dialog is open, and the page behind it is out of use. What only
       stands in front of the page carries a shadow and leaves it readable
   * - ``--shadow-flyout``
     - a surface that has left the page
     - what the bar opens over the text: its panels, its drawer. Its
       neighbours are ``--shadow-basic``, ``--shadow-strong``,
       ``--shadow-tooltip``, ``--shadow-dialog`` and ``--shadow-window``. The
       job, not the distance, over a raw ``--shadow-2…64`` scale no design
       writes
   * - ``--surface-art``
     - the ground under a picture that brought its own colours
     - **it does not flip.** A drawing from elsewhere is light whatever the
       page is

.. specimen:: guidelines/colors-surfaces.card.html
   :viewport: 700x277
   :title: Surfaces

Text
====

.. list-table::
   :header-rows: 1

   * - Token
     - Carries
   * - ``--text-primary``
     - what the reader came for
   * - ``--text-secondary``
     - the line beside it, and the glyph that stands with a label
   * - ``--text-muted``
     - what the machine named: a path, a separator, a step out of reach
   * - ``--text-link``, ``--text-link-hover``
     - a link in text, and the same link under the pointer
   * - ``--text-accent-quiet``
     - ink on the tinted plane
   * - ``--text-on-accent``
     - ink on the accent fill. It does not flip either. The accent is one
       colour in both modes, so what stands on it is one colour too

.. specimen:: guidelines/colors-text.card.html
   :viewport: 700x169
   :title: Text

Borders
=======

Hairlines do the structural work. Nothing that stays on the page separates
by elevation. So the focus halo is the only ``box-shadow`` a page draws, and
it says keyboard state, not depth; see :doc:`accessibility`. What has left
the page is the exception the shadow scale exists for, and the table above
names those surfaces.

.. list-table::
   :header-rows: 1

   * - Token
     - Draws
   * - ``--border-subtle``
     - the structural hairline: a card's frame, a table's rules, the gaps of
       a grid
   * - ``--border-strong``
     - the frame a control carries, a secondary button, a badge, a field, and
       the line under a table head
   * - ``--border-accent-quiet``
     - the frame of the tinted plane, and nothing else
   * - ``--border-error-quiet``
     - the frame of the plane under a failure, and nothing else

.. specimen:: guidelines/colors-borders.card.html
   :viewport: 700x238
   :title: Borders

Accent
======

``--accent`` is ``#FF8700``, and it marks exactly three things. The active
navigation item, the shell prompt in a code block, and the pipe in the
wordmark. No second accent.

``--accent-glow`` is one of the system's two gradients. Light falls across
the top of a linked card's hairline under the pointer or keyboard focus, then
fades down the frame. It is a state, not another accented object. A layer of
its own lets that light fade without a change to the card's background. The
other gradient is the hatch a running ``sds-progress`` draws inside its own
fill: one ink at two strengths, and motion, not colour. Neither licenses a
gradient anywhere else.

Page grounds stay flat: no photograph or illustration behind text, no
texture, no decorative gradient. Artwork sits in an explicit media slot,
where its edge and purpose stay visible.

Use ``--accent``, never the raw ``--orange-*`` scale. That scale derives the
token and appears in no design.

.. specimen:: guidelines/colors-accent.card.html
   :viewport: 700x134
   :title: Accent

Status and syntax
=================

``--status-ok``, ``--status-warn`` and ``--status-error`` appear inside code
output, badges, result rows and status diagrams. **Never as page
furniture.** A status colour on a heading or a border says something is
wrong when nothing is.

Three things are the exception, and they stand here so they stay three.

A note with ``tone="error"`` sits on ``--surface-error-quiet`` inside
``--border-error-quiet``. It says a thing failed, and a reader must find
that box before the words in it. A link on a tinted note rests on
``--text-link-hover``. The resting link ink falls under the text rule on
that plane, and on the accent plane of a ``warn`` note.

The press with no undo. ``sds-btn--danger`` carries ``--status-error`` as
ink and as a hairline and takes a fill only under the pointer. A filled red
button outranks ``--accent``, the one thing on a page with that right. The
colour marks the press; it does not explain it. The label names what goes,
"Delete 3 pages", never "OK". The question above it says what that costs, so
a reader who cannot tell the tones apart still reads the consequence.

The answer a decision took. ``sds-answer`` with ``decided`` fills the disc
around its letter with ``--status-ok`` and knocks the letter out of it in
the block's own plane. A decision that fell is a result, and the one
answer with a filled disc is the one a reader came to find. The word after
its name says the same, for a reader who cannot tell the disc apart.

.. specimen:: guidelines/colors-status.card.html
   :viewport: 700x226
   :title: Status and syntax
