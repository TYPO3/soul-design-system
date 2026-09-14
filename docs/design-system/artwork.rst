:navigation-title: Artwork

=======
Artwork
=======

**Every picture is a link.** A drawing, a photograph, a mark in a bar: one
``<img>`` that points at one file. ``sds-image`` does that, ``sds-figure``
does it inside its frame, and the Guides theme does it for the signet and
every picture in a document. Nothing about the file has to be true for the
picture to arrive, and nothing reads the file first.

The cost is the mode. An ``<img>`` renders its file in a document of its own,
where ``--text-primary`` does not exist. So a drawing keeps the fallback
colour its author wrote on a page that has gone dark. **So the surface under
it does not follow the reader either**; see :ref:`its ground
<artwork-ground>`.

A reference, ``<use href="drawing.svg#part">``, clones the shapes into the
page, where inherited properties reach them. That file then arrives in the
mode of its page. The fragment is the reason this is not the mechanism here.

.. _artwork-reference:

Why not a reference
===================

A reference resolves against a fragment that names an ``id`` inside the file.
That puts two demands on a system, and the second one ends it:

- **every drawing needs a named root**, in every project that points at one;
- **something has to open the file** to make sure of that before the renderer
  writes the page. A reference into a file without that ``id`` draws *nothing*: no
  error, no fallback, a hole.

SVG 2 removes the fragment. ``<use href="drawing.svg">`` means the file's
root, and both demands go with it. **Chrome ships that since 137; Firefox and
Safari do not.** Until they do, a reference costs every consumer a file
contract and pays a page that is blank outside Chrome. This page records the
condition. When the other two ship it, a reference works on the artwork as it
stands, and the mode comes back for free.

.. _artwork-file:

What a file has to do
=====================

Two lines, and neither changes the drawing.

.. list-table::
   :header-rows: 0

   * - Colour the shapes
     - ``fill="var(--text-primary, #8A8378)"``, ``stroke="var(--accent,
       #FF8700)"``: the token first, the hex behind it
   * - Nothing else colours it
     - no ``<style>`` block, and no ``fill`` or ``color`` on the root

A file written that way is ready for the day a page can reach into it, and it
loses nothing until then. **The hex is what an ``<img>`` renders.** It is
also what the file renders on its own: in a tab, from a README, in a favicon
slot.
The fallback belongs to the drawing, not to the text scale, so a contrast
adjustment does not redraw a brand mark.

The drawings this system ships name a root as well, ``<g id="soul-ref">``.
That is the card generator's handle: ``make diagrams`` reads the shapes out
from under it for the specimen cards. See :doc:`diagrams`.

.. warning::

   **A comment must not contain a double dash.** ``--`` is not valid inside
   an XML comment, and a browser parses an SVG as XML. A file that is not
   valid draws *nothing*, as a reference, as an image and as a favicon, with
   no message. Every token in these files spells two of them, so a note that
   explains ``var(--token, #hex)`` breaks the drawing. Write "a var() with a
   hex fallback". ``make diagrams`` refuses a file with one.

Where the colour has to live
============================

These rules are about a reference, which is not how a page shows a picture
today. They are the reason for the file contract, and what defeats it the
day a page can reach in. A reference clones the shapes, and less travels
with them than it looks.

**A rule in the file wins over the token.** A ``<style>`` block reaches the
shapes it matches after a reference too, and a CSS rule beats a presentation
attribute. So ``.ink { stroke: #8A8378 }`` defeats ``stroke="var(--text-primary,
#8A8378)"`` on the same shape, and the mark is grey on every page.

**A colour on the root wins too.** ``color`` or ``fill`` on the ``<svg>``
lands on the clone and inherits down over what the page carries. So the
shapes cannot say ``currentColor`` with a fallback on the root: the fallback
is then the answer everywhere.

**What the file inherits does not travel.** A custom property on the file's
own root does not reach the clone, which inherits from the page. So a file
cannot bring its own mode switch, and does not need one. The hex covers the
page that declares nothing, which today is every page.

The tokens to use
=================

.. list-table::
   :header-rows: 0

   * - ``--text-primary``
     - the ink: the mark, the outline, the drawing itself
   * - ``--text-secondary``, ``--text-muted``
     - a quieter part: a label, a secondary line
   * - ``--accent``
     - the one thing the drawing is about. One per drawing
   * - ``--surface-canvas``, ``--surface-sunken``
     - a ground the drawing brings with it
   * - ``--border-subtle``, ``--border-strong``
     - a hairline the drawing draws itself

:doc:`diagrams` has the rest of what a diagram can use, and its numbers.

A signet of your own
====================

The mark in a documentation bar is a configuration, not a shipped file. It is
a file in the documentation tree, and this system has no opinion about what
it depicts.

There is no signet component. A drawing inside an element copies the optical
files into TypeScript and binds a consumer to this system's own mark.
``sds-image`` supplies the artwork mechanism. ``.sds-signet`` supplies only
the layout a mark needs and leaves its size to the caller.

.. code-block:: xml
   :caption: guides.xml

   <extension class="TYPO3\Soul\GuidesTheme\DependencyInjection\SoulExtension">
       <signet>_images/signet.svg</signet>
       <brand>Acme</brand>
       <product>Your product</product>
   </extension>

The bar shows the mark like every other picture, as a link. So an SVG and a
PNG both work, and both are the same picture in both modes. Write the SVG's
colours as :ref:`the file contract <artwork-file>` asks anyway. That makes the
mark right the day a page can reach into it, and the hex is what draws it
until then.

**Name the drawing made for 24.** The bar draws its mark at 24, and a signet
is crisp only in the box of its drawing. The 16 file scales by 1.5, which
puts every straight edge on a half pixel. The other optical sizes belong in
the tab, one ``<favicon>`` per slot; see :doc:`/guides-theme/configuration`.

Draw the mark itself to the construction. :doc:`brand` has the rules, and
``docs/design-system/signet-prompt.md`` is that construction as an
instruction for a drawing tool.

.. _artwork-ground:

The ground it stands on
=======================

A drawing arrives in the colours of its export, the one thing on the page that
does not follow the reader into dark. **So its ground does not either.** A
figure's frame, a card's picture and the viewer all take ``--surface-art``,
the one surface with a single value for both modes. Dark line art on a dark
ground is the page against its own picture. A photograph brings its own
ground, and the page leaves it alone.

When it draws nothing
=====================

A picture that does not appear has one cause left, and it is in the file.
**A comment carries a double dash**, so the file is not well-formed. A
browser parses an SVG as XML. A file that is not valid draws nothing, as an
image and as a favicon, with no message.

Specimen cards are the one place artwork is not a link. They open from disk
with no server, so the card generator puts the drawing's shapes into the card
itself: ``scripts/diagrams.ts`` and
``packages/frontend/src/components/art.static.ts``. That is why a specimen
shows the drawing in both modes and a page shows one picture in both.
