:navigation-title: Colours

=======
Colours
=======

Every colour in this system is a semantic token, declared once as
``light-dark(light, dark)`` against a ``:root`` that sets ``color-scheme``.
There is no second block for dark mode, which is why light and dark **cannot
drift**: they are the same declaration.

Light and dark are equal surfaces. Light is warm paper rather than pure white;
dark is the terminal rather than a dimmed copy of the light palette. With no
``data-theme`` the reader's operating-system preference decides, so neither
mode is presented as the exception.

Force a mode on a subtree with ``data-theme="light"`` or ``data-theme="dark"``.
Put it on ``<html>`` for a whole page — set it deeper and the browser's own
chrome, its scrollbars and form controls, stays in the other mode.

A mode choice is a product control rather than a preference screen.
:ref:`sds-theme <component-sds-theme>` shows the available choices in place
and returns to the machine's setting when the active choice is pressed again.
The document writes a remembered choice before the first paint; the control
then reads the document instead of keeping a second idea of the current mode.

Scrollbars belong to the surface as well. They use the border token for the
thumb, the muted text token under the pointer and a transparent track. Relying
on ``color-scheme`` alone would leave their exact treatment to the browser and
make the edge of the same page look unrelated across engines.

.. warning::

   **Never set a colour literal.** Not a hex, not an ``rgb()``, not a named
   colour. If nothing here fits, the answer is a new token, not a local value.

Surfaces
========

Each plane means something, and a thing that means nothing sits on the canvas.
A **card** is a hairline and 6px with no fill of its own.

.. list-table::
   :header-rows: 1

   * - Token
     - The plane
     - Reach for it when
   * - ``--surface-canvas``
     - the ground
     - ``.sds-app`` puts it under the page, and everything else sits on it
   * - ``--surface-raised``
     - lifted off that ground
     - a panel or a modal has to read as a plane of its own, a table row
       answers a pointer
   * - ``--surface-sunken``
     - machine output
     - a code block, a log, the ground a diagram is drawn on
   * - ``--surface-inset``
     - a well inside another surface
     - a skeleton, a tick box under the pointer, the facts on a reference entry
   * - ``--surface-accent-quiet``
     - the one tinted plane
     - a selected row, an accent badge — with ``--border-accent-quiet`` as its
       frame and ``--text-accent-quiet`` as its ink
   * - ``--surface-overlay``
     - the wash under a floating surface
     - a dialog is open. In a system with no shadows it is the whole of how
       one plane is separated from another
   * - ``--surface-art``
     - the ground under a picture that brought its own colours
     - **it does not flip.** A drawing exported elsewhere is light whatever
       the page is

.. specimen:: guidelines/colors-surfaces.card.html
   :viewport: 700x270
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
     - what the machine named — a path, a separator, a step that cannot be
       taken
   * - ``--text-link``, ``--text-link-hover``
     - a link in running text, and the same link under the pointer
   * - ``--text-accent-quiet``
     - ink on the tinted plane
   * - ``--text-on-accent``
     - ink on the accent fill. It does not flip either — the accent is one
       colour in both modes, so what stands on it is one colour too

.. specimen:: guidelines/colors-text.card.html
   :viewport: 700x176
   :title: Text

Borders
=======

Hairlines do the structural work. A floating surface is separated by the
overlay wash and its border rather than by elevation. The focus halo is the
only ``box-shadow`` in the system, and it communicates keyboard state rather
than depth — see :doc:`accessibility`.

.. list-table::
   :header-rows: 1

   * - Token
     - Draws
   * - ``--border-subtle``
     - the hairline that does the structural work: a card's frame, a table's
       rules, the gaps a grid is separated by
   * - ``--border-strong``
     - the frame a control carries — a secondary button, a badge, a field —
       and the line under a table head
   * - ``--border-accent-quiet``
     - the frame of the tinted plane, and nothing else

.. specimen:: guidelines/colors-borders.card.html
   :viewport: 700x240
   :title: Borders

Accent
======

``--accent`` is ``#FF8700``, and it marks exactly three things: the active
navigation item, the shell prompt in a code block, and the pipe in the
wordmark. No second accent.

``--accent-glow`` is the one gradient: light falling across the top of a
linked card's hairline under the pointer or keyboard focus, then fading down
the frame. It is a state rather than another accented object. Keeping it on a
layer of its own lets that light fade without replacing the card's background.
It licenses no gradient elsewhere.

Page grounds stay flat: no photograph or illustration behind text, no
repeating texture and no decorative gradient. Artwork occupies an explicit
media slot, where its edge and purpose remain visible.

Use ``--accent``, never the raw ``--orange-*`` scale — that scale exists to
derive the token and is not for use in a design.

.. specimen:: guidelines/colors-accent.card.html
   :viewport: 700x150
   :title: Accent

Status and syntax
=================

``--status-ok``, ``--status-warn`` and ``--status-error`` appear inside code
output, badges, result rows and status-about diagrams. **Never as page
furniture.** A status colour on a heading or a border means the page is
telling you something is wrong when nothing is.

.. specimen:: guidelines/colors-status.card.html
   :viewport: 700x230
   :title: Status and syntax
