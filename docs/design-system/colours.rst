:navigation-title: Colours

=======
Colours
=======

Every colour in this system is a semantic token, declared once as
``light-dark(light, dark)`` against a ``:root`` that sets ``color-scheme``.
There is no second block for dark mode, which is why light and dark **cannot
drift**: they are the same declaration.

Force a mode on a subtree with ``data-theme="light"`` or ``data-theme="dark"``.
Put it on ``<html>`` for a whole page — set it deeper and the browser's own
chrome, its scrollbars and form controls, stays in the other mode.

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
wordmark. No second accent. No gradient. Anywhere.

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
