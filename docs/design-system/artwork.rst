:navigation-title: Artwork

=======
Artwork
=======

**Every picture is linked.** A drawing, a photograph, a mark in a bar: one
``<img>`` pointing at one file. ``sds-image`` does that, ``sds-figure`` does it
inside its frame, and the Guides theme does it for the signet and for every
picture in a document. Nothing about the file has to be true for the picture to
arrive, and nothing reads the file to decide.

What that costs is the mode. An ``<img>`` renders its file in a document of its
own, where ``--text-primary`` is not declared, so a drawing keeps whichever
colour its author wrote as the fallback on a page that has since gone dark.
**So the surface under it does not follow the reader either** — see
:ref:`its ground <artwork-ground>` below.

It is worth knowing what is not being used, because the file contract below
still reads as though it were. A reference — ``<use href="drawing.svg#part">``
— clones the shapes into the page, where inherited properties reach them, and
that one file would then arrive in the mode of wherever it was placed. The
reason it is not the mechanism here is the fragment.

.. _artwork-reference:

Why it is not referenced
========================

A reference resolves against a fragment naming an ``id`` inside the file. That
puts two demands on a system, and the second is the one that ends it:

- **every drawing has to be prepared** — a named root, in every project that
  ever points at one
- **something has to open the file** to find out whether it was, before the page
  is written, because a reference into a file that never named that ``id``
  draws *nothing*: no error, no fallback, a hole where the picture was

SVG 2 removes the fragment — ``<use href="drawing.svg">`` means the file's root,
no ``id`` anywhere, and with it both demands go. **Chrome has shipped that since
137; Firefox and Safari have not.** Until they do, referencing costs every
consumer a file contract and every renderer a file read, and pays a page built
in Chrome that is blank for everybody else. So it is not used, and this page
records the condition rather than the workaround: when the other two ship it,
artwork can be referenced as it stands and the mode comes back for free.

.. _artwork-file:

What a file has to do
=====================

Two lines, and neither changes the drawing.

.. list-table::
   :header-rows: 0

   * - Colour the shapes
     - ``fill="var(--text-primary, #8A8378)"``, ``stroke="var(--accent,
       #FF8700)"`` — the token first, the hex behind it
   * - Nothing else colours it
     - no ``<style>`` block, and no ``fill`` or ``color`` on the root

Written that way, a file is ready for the day a page can reach into it, and it
loses nothing in the meantime: **the hex is what an ``<img>`` renders**, and
what the file renders as on its own — opened in a tab, linked from a README,
sitting in a favicon slot. The fallback belongs to the drawing rather than to
the text scale, so a text-contrast adjustment does not silently redraw a
standalone brand mark.

Drawings this system ships name a root as well — ``<g id="soul-ref">`` — and
that is the card generator's handle, not a page's: ``make diagrams`` reads the
shapes out from under it and puts them where a specimen card shows one. See
:doc:`diagrams`.

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

The rules below are about a reference, which is not how a page shows a picture
today — they are why the file is written the way it is, and what would defeat
it the day a page can reach in. A reference clones the shapes into the page, and
what travels with them is narrower than it looks.

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
instead. So a file cannot bring its own mode switch — and does not need one:
the hex covers the page that declares nothing, which today is every page.

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

There is no signet component. Embedding the drawing in an element would copy
the optical files into TypeScript and bind a consumer to this system's own
mark. ``sds-image`` supplies the artwork mechanism instead, while
``.sds-signet`` supplies only the layout behaviour a mark needs and leaves its
size to the caller.

.. code-block:: xml
   :caption: guides.xml

   <extension class="TYPO3\Soul\GuidesTheme\DependencyInjection\SoulExtension">
       <signet>_images/signet.svg</signet>
       <brand>Acme</brand>
       <product>Your product</product>
   </extension>

The mark is shown like every other picture — linked, whatever is in it — so an
SVG and a PNG both work and both are the same picture in both modes. Write the
SVG's colours as :ref:`the file contract <artwork-file>` asks anyway: it is what
makes the mark right the day a page can reach into it, and the hex behind each
token is what the mark is drawn in until then.

**Name the drawing made for 24.** The bar draws its mark at 24, and a signet is
crisp only in the box it was drawn for: point at the 16 file and it is scaled by
1.5, which puts every straight edge in it on a half pixel and every one-unit
stroke across two of them. The other optical sizes belong in the tab instead,
one ``<favicon>`` per slot — see :doc:`/guides-theme/configuration`.

Draw the mark itself to the construction: :doc:`brand` has the rules, and
``docs/design-system/signet-prompt.md`` is that construction written as something
to hand to a drawing tool.

.. _artwork-ground:

The ground it stands on
=======================

A drawing arrives in the colours it was exported with, and it is the one thing
on the page that does not follow the reader into dark. **So its ground does not
either.** A figure's frame, a card's picture and the viewer all take
``--surface-art`` — the one surface in the system with a single value for both
modes, because dark line art on a dark ground is the page contradicting the
picture it is showing. A photograph brings its own ground and is left alone.

When it draws nothing
=====================

A picture that does not appear has one cause left, and it is in the file:

**a comment carries a double dash**, so the file is not well-formed. An SVG is
parsed as XML the moment it is fetched, and a malformed one draws nothing — as
an image, and as a favicon, with nothing on the page saying why.

Specimen cards are the one place artwork is not linked. They are opened from
disk with no server, so the card generator puts the drawing's shapes into the
card itself — that is ``scripts/diagrams.ts`` and
``packages/frontend/src/components/art.static.ts``, and it is why a specimen shows
the drawing in both modes and a page shows one picture in both.
