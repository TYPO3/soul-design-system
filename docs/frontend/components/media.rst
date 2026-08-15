:navigation-title: Media

=====
Media
=====

Pictures, drawings and documents from somewhere else. One rule runs through all
of them: **every picture is linked** — one ``<img>``, one file, and nothing
about what is in the file for an element to decide.

A drawing linked as an image renders in a document of its own, where none of
this system's tokens is declared, and keeps whichever grey its author wrote as
the fallback. Referencing part of the file instead would let it read the page's
tokens, and :doc:`/design-system/artwork` says what has to ship in Firefox and
Safari before that is a mechanism a site can be built on.

**A picture that keeps its own colours is given a ground drawn for them.** The
figure's frame, a card's picture and the viewer all take ``--surface-art``
where the picture is linked — the one surface in this system with a single
value for both modes. A diagram a tool exported is usually dark line art on
nothing, and on a dark ground that is a page contradicting the picture it is
showing.

.. note::

   Nothing here takes a flag for the mode a picture arrives in, and the
   finishing step reads no drawing: an image is laid out by what is in its own
   file, and it is the same picture in light and in dark.

.. _component-sds-image:

sds-image
=========

A picture, and nothing around it.

.. code-block:: html

   <sds-image src="/art/pipeline.svg" alt="Source, build, published site"></sds-image>
   <sds-image src="/art/pipeline.svg" alt="Source, build, published site" zoomable></sds-image>
   <sds-image class="sds-signet" src="/soul/assets/signet.svg" alt=""
     width="24" height="24"></sds-image>

.. confval:: src
   :name: sds-image-src
   :type: string
   :required: true

.. confval:: alt
   :name: sds-image-alt
   :type: string
   :required: true

   What the picture shows, for a reader who cannot see it. Empty where the text
   beside it already says the same thing — a mark in a lockup whose wordmark
   spells the name — and the picture is then hidden rather than announced
   without a name.

.. confval:: width
   :name: sds-image-width
   :type: number

.. confval:: height
   :name: sds-image-height
   :type: number

   Both, for a picture no stylesheet sizes. The file's own coordinate system
   keeps the proportions inside them: a 5:4 mark given a square box is drawn
   5:4 and centred, never stretched to fit.

.. confval:: zoomable
   :name: sds-image-zoomable
   :type: boolean
   :default: false

   Pressable, opening the picture at the size it was made. The trigger is a
   link to the file, so a surface running no script still opens it and the
   element only takes the press over once it has upgraded. What a picture
   shrunk into its column asks for, and what a mark in a lockup never does.

.. confval:: class
   :name: sds-image-class
   :type: string

   The class a caller gives is the one the picture renders with — which is why
   a signet is ``<sds-image class="sds-signet">`` and nothing in this element
   has to know what a signet is.

.. note::

   The element takes no content, but it does take a **fallback**: the same
   picture written in the class layer, for a surface rendering before any
   script and for a reader who runs none. The element redraws it and the
   server's copy goes, because light DOM would otherwise leave two pictures in
   one box.

.. _component-sds-figure:

sds-figure
==========

A picture and the claim it makes. The caption is not optional and not a title:
a picture whose point has to be inferred means something slightly different to
every reader, so the sentence under it states the claim the picture would be
replaced by.

.. code-block:: html

   <sds-figure src="/art/pipeline.svg" alt="Source, build, published site"
     caption="Every route resolves to the same tokens." zoomable></sds-figure>

.. confval:: src
   :name: sds-figure-src
   :type: string
   :required: true

.. confval:: alt
   :name: sds-figure-alt
   :type: string
   :required: true

.. confval:: caption
   :name: sds-figure-caption
   :type: string | markup

   May also be written between the tags as a ``<figcaption>`` carrying the
   caption class — the form for a caption with a link or a literal in it, and
   for a page read before the element upgrades.

.. confval:: width
   :name: sds-figure-width
   :type: number

.. confval:: height
   :name: sds-figure-height
   :type: number

   The picture's own size, where a document declared one. A figure fills its
   column and needs neither.

.. confval:: zoomable
   :name: sds-figure-zoomable
   :type: boolean
   :default: false

   Pressable, opening the drawing at the size it was drawn. The trigger is a
   link to the file, so a surface running no script still opens it and the
   element only takes the press over once it has upgraded. Worth it for
   anything drawn wider than its column, pointless for a photograph.

.. note::

   A picture a renderer already wrote between the tags **wins** over ``src``:
   rewriting it would replace a picture the reader can see with a second
   request for the same file.

.. _component-sds-embed:

sds-embed
=========

A document from somewhere else, in a frame this page controls. An iframe
arrives carrying a size with no relation to the column it lands in, and
browsers draw it with an inset border out of 1996; this gives it the hairline
and the sunken plane every other block here has.

.. code-block:: html

   <!-- A video: no size of its own, so it fills the column at a ratio. -->
   <sds-embed src="https://…" label="The release talk" ratio="16 / 9"
     allow="encrypted-media; picture-in-picture; web-share" allowfullscreen
     caption="Twelve minutes, from the 1.4 release."></sds-embed>

   <!-- A card: made at a size, so the frame keeps it and scrolls. -->
   <sds-embed src="/_cards/…" label="Surfaces" width="700" height="420"></sds-embed>

.. confval:: src
   :name: sds-embed-src
   :type: string
   :required: true

   An empty one is not nothing: a browser resolves it against the current
   document and embeds the page in itself, so the frame is left empty instead.

.. confval:: label
   :name: sds-embed-label
   :type: string
   :required: true

   What the frame holds, in a few words: it becomes the accessible name, and an
   unnamed frame is announced as "frame" and skipped. Not ``title``, which on
   the element would be a tooltip over the frame and the caption both.

.. confval:: ratio
   :name: sds-embed-ratio
   :type: string
   :default: "16 / 9"

   The shape the frame holds while it fills the column, as CSS writes it. This
   is what a video, a map or anything else with no size of its own wants.

.. confval:: width
   :name: sds-embed-width
   :type: number

.. confval:: height
   :name: sds-embed-height
   :type: number

   The size the document was made for, in pixels. Both together, and **without
   a ratio**, are what makes the frame fixed: it is exactly this wide, and it
   scrolls rather than reflowing what it holds.

.. confval:: caption
   :name: sds-embed-caption
   :type: string

.. confval:: allow
   :name: sds-embed-allow
   :type: string

   The permissions policy the frame is granted. A video player asks for what it
   needs; a card asks for nothing, and gets nothing.

.. confval:: allowfullscreen
   :name: sds-embed-allowfullscreen
   :type: boolean
   :default: false

.. note::

   The frame does not load lazily, deliberately: an embed is the evidence on
   the page, and one that loads on scroll is blank in every screenshot.

.. _component-sds-lightbox:

sds-lightbox
============

A drawing at the size it was drawn, on the platform's ``<dialog>`` — so the
page behind it goes inert, the focus moves in and comes back, and Escape
closes. The surface is not the modal's: a modal stops at a reading measure
because what is inside one is read, and a drawing is looked at.

The surface is a stage rather than a box around the file — as much of the
screen as it can take without touching the edges — and the picture is fitted
into it and stands in the middle, whichever way round it is. One smaller than
the stage keeps its own size, since enlarging it only makes it blurrier. The
page behind it stops scrolling while it is open: the platform makes the rest
inert, which a wheel over the backdrop is not.

.. code-block:: html

   <sds-button for="the-drawing">Open the drawing</sds-button>
   <sds-lightbox id="the-drawing" src="/art/pipeline.svg"
     alt="Source, build, published site"></sds-lightbox>

.. confval:: src
   :name: sds-lightbox-src
   :type: string
   :required: true

.. confval:: alt
   :name: sds-lightbox-alt
   :type: string
   :required: true

.. confval:: caption
   :name: sds-lightbox-caption
   :type: string

   What the drawing claims, in the head — the same sentence the figure carries,
   so opening it is not a change of subject.

.. confval:: open
   :name: sds-lightbox-open
   :type: boolean
   :default: false

It answers ``sds-command`` — ``show``, ``close``, ``toggle`` — and has
``show()`` and ``close()`` for a page that would rather call them.
``sds-figure`` needs none of it: it owns its viewer and calls ``show()``
itself.

.. seealso::

   :doc:`/design-system/diagrams` for how a drawing is made so it can be
   referenced at all, and :doc:`/design-system/artwork` for what belongs in one.
