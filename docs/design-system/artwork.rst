:navigation-title: Artwork

=======
Artwork
=======

**A drawing is referenced into the page; a photograph is linked.** The file
name is the whole distinction and nobody states it: an SVG is referenced, and
anything else is linked. That is what ``sds-image`` does, what ``sds-figure``
does with the picture in its frame, and what the Guides theme writes for the
signet in the bar and for every picture in a document.

The reason is that the two are different kinds of thing. A photograph has no
mode — the same file in light and in dark, because there is nothing in it for a
mode to change. A drawing is written in the tokens and has to arrive in the
mode of wherever it was placed, and a linked file cannot: an ``<img>`` renders
in a document of its own, where ``--text-primary`` is not declared, so it keeps
whichever colour its author baked in on a page that has since gone dark.

There is no light copy and no dark copy. One file, referenced, reading the
tokens of the page around it.

What a file has to do
=====================

Three lines, and none of them changes the drawing.

.. list-table::
   :header-rows: 0

   * - Name the root
     - ``<svg id="art" viewBox="0 0 32 32">`` — the reference points at
       ``file.svg#art``, and the root is what carries the coordinate system
       across, so the wrapper needs to state only a size
   * - Colour the shapes
     - ``fill="var(--text-primary, #8A8378)"``, ``stroke="var(--accent,
       #FF8700)"`` — the token first, the hex behind it
   * - Nothing else colours it
     - no ``<style>`` block, and no ``fill`` or ``color`` on the root

The hex is not dead weight. It is what the file renders as on its own — opened
in a tab, linked from a README, sitting in a favicon slot — where there are no
tokens to read. On a page that declares them, the token wins and the hex is
never reached.

.. warning::

   **A comment may not contain a double dash.** ``--`` is illegal inside an XML
   comment, an SVG is parsed as XML the moment it is fetched, and a malformed
   file draws *nothing* — as a reference, as an image and as a favicon, all at
   once, with nothing on the page saying why. It is easy to write by accident,
   because every token in these files is spelled with two of them: a note
   explaining ``var(--token, #hex)`` breaks the drawing it explains. Write it
   as "a var() with a hex fallback". ``make diagrams`` refuses a file that
   carries one.

Where the colour has to live
============================

A reference clones the shapes into the page, and what travels with them is
narrower than it looks.

**A rule in the file wins over the token.** A ``<style>`` block is applied to
the shapes it matches even when they have been referenced somewhere else, and a
CSS rule beats a presentation attribute — so ``.ink { stroke: #8A8378 }``
silently defeats ``stroke="var(--text-primary, #8A8378)"`` on the same shape,
and the mark is grey on every page forever.

**A colour on the root wins too.** ``color`` or ``fill`` on the ``<svg>`` is set
on the clone the reference builds, and inherits down over whatever the page was
carrying. This is why the shapes cannot simply say ``currentColor`` and let the
root supply a fallback: the fallback would be the answer everywhere.

**What the file inherits does not travel.** A custom property the file declares
on its own root is not carried into the clone, which inherits from the page
instead. So a file cannot bring its own mode switch — and does not need one,
because the page it lands in has the tokens, and the hex covers the case where
nothing does.

The tokens to reach for
=======================

.. list-table::
   :header-rows: 0

   * - ``--text-primary``
     - the ink — the mark, the outline, anything that is the drawing itself
   * - ``--text-secondary``, ``--text-muted``
     - a quieter part: a label, a secondary line
   * - ``--accent``
     - the one thing the drawing is about, and nothing else. One per drawing
   * - ``--surface-canvas``, ``--surface-sunken``
     - a ground the drawing brings with it
   * - ``--border-subtle``, ``--border-strong``
     - a hairline the drawing draws itself

:doc:`diagrams` has the rest of what a diagram may use, and the numbers it is
drawn to.

A signet of your own
====================

The mark in a documentation bar is configured, not shipped: it is a file in the
documentation tree, and this system has no opinion about what it depicts.

.. code-block:: xml
   :caption: guides.xml

   <extension class="TYPO3\Soul\GuidesTheme\DependencyInjection\SoulExtension">
       <signet>_images/signet.svg</signet>
       <brand>Acme</brand>
       <product>Your product</product>
   </extension>

An SVG signet is referenced and follows the page into dark; a PNG one is linked
and is the same picture in both. Either works — the SVG is worth the three lines
above, because a mark that does not take the page's ink is the one thing on the
bar that looks pasted on.

**Name the drawing made for 24.** The bar draws its mark at 24, and a signet is
crisp only in the box it was drawn for: point at the 16 file and it is scaled by
1.5, which puts every straight edge in it on a half pixel and every one-unit
stroke across two of them. The other optical sizes belong in the tab instead,
one ``<favicon>`` per slot — see :doc:`/guides-theme/configuration`.

Draw the mark itself to the construction: :doc:`brand` has the rules, and
``docs/design-system/signet-prompt.md`` is that construction written as something
to hand to a drawing tool.

When it draws nothing
=====================

A reference that resolves to nothing leaves a blank space, which is the one
failure this contract has. The causes, in the order to check them:

- a comment carries a double dash, so the file is not well-formed
- the file is on another origin — a browser will not read one across origins,
  so a picture from somewhere else is linked whatever it is

A root that is not named ``id="art"`` used to be the first of those and is not
one any more: the finishing step reads every drawing a page points at and shows
an unprepared one as an image, naming it in the run. The picture arrives, in the
colours it was exported with, and it is the one on the page that does not follow
the reader into dark. **So its ground does not either.** A frame, a card's
picture and the viewer all take ``--surface-art`` under a linked picture — the
one surface in the system with a single value for both modes, because dark line
art from somebody else's exporter on a dark ground is the page contradicting the
picture. A malformed file is still a blank — nothing can tell one from a drawing
that simply has no shapes.

Specimen cards are the deliberate exception. They are opened from disk with no
server, where every file is its own origin and no reference resolves at all —
so the card generator puts the artwork where the reference was. That is
``scripts/diagrams.ts`` and ``packages/frontend/src/components/art.static.ts``, and it is why a
card shows the drawing and a page shows a reference to it.
