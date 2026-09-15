:navigation-title: Media

=====
Media
=====

Pictures, drawings and documents from somewhere else. One rule runs through
all of them: **every picture is a link**. One ``<img>``, one file, and no
element decides anything about what is in the file.

A drawing as an image renders in a document of its own, where none of this
system's tokens exists. It keeps whatever grey its author wrote as the
fallback. A reference into the file lets it read the page's tokens.
:doc:`/design-system/artwork` says what Firefox and Safari have to ship
before a site can rest on that.

**A picture with its own colours gets a ground drawn for them.** The
figure's frame, a card's picture and the viewer all take ``--surface-art``,
the one surface with a single value for both modes. A diagram a tool
exported is usually dark line art on nothing. On a dark ground the page
contradicts its own picture.

.. note::

   Nothing here takes a flag for the mode a picture arrives in, and the
   finishing step reads no drawing. What is in its own file lays out an
   image, and it is the same picture in light and in dark.

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

   What the picture shows, for a reader who cannot see it. Empty where the
   text beside it says the same thing: a mark in a lockup whose wordmark
   spells the name. The picture then hides instead of an announcement with
   no name.

.. confval:: width
   :name: sds-image-width
   :type: number

.. confval:: height
   :name: sds-image-height
   :type: number

   Both, for a picture no stylesheet sizes. The file's own coordinate system
   keeps the proportions inside them. A 5:4 mark in a square box draws 5:4
   and centred, never stretched.

.. confval:: zoomable
   :name: sds-image-zoomable
   :type: boolean
   :default: false

   A press opens the picture at its made size. The trigger is a link to the
   file, so a surface with no script still opens it. The element takes the
   press over only after its upgrade. For a picture shrunk into its
   column, and never for a mark in a lockup.

.. confval:: class
   :name: sds-image-class
   :type: string

   The class a caller gives is the one the picture renders with. That is why
   a signet is ``<sds-image class="sds-signet">``, and nothing in this
   element has to know what a signet is.

.. note::

   The element takes no content, but it takes a **fallback**. That is the
   same picture in the class layer, for a surface that renders before a
   script and for a reader who runs none. The element redraws it and the server's
   copy goes, because light DOM otherwise leaves two pictures in one box.

.. _component-sds-figure:

sds-figure
==========

A picture and the claim it makes. The caption is mandatory and not a title.
A picture whose point a reader has to infer means something different to
every reader. So the sentence under it states the claim the picture stands
for.

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

   Can also stand between the tags as a ``<figcaption>`` with the caption
   class. That is the form for a caption with a link or a literal in it. It
   is also the form for a page read before the element upgrades.

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

   A press opens the drawing at its drawn size. The trigger is a link to the
   file, so a surface with no script still opens it. The element takes the
   press over only after its upgrade. Worth it for anything wider than
   its column, pointless for a photograph.

.. note::

   A picture a renderer already wrote between the tags **wins** over
   ``src``. A rewrite replaces a picture the reader can see with a second
   request for the same file.

.. _component-sds-embed:

sds-embed
=========

A document from somewhere else, in a frame this page controls. An iframe
arrives with a size that has no relation to its column, and browsers draw it
with an inset border out of 1996. This gives it the hairline and the sunken
plane every other block here has.

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

   An empty one is not nothing. A browser resolves it against the current
   document and embeds the page in itself, so the frame stays empty instead.

.. confval:: label
   :name: sds-embed-label
   :type: string
   :required: true

   What the frame holds, in a few words. It becomes the accessible name. An
   unnamed frame announces as "frame", and a reader skips it. Not ``title``, which
   on the element is a tooltip over the frame and the caption both.

.. confval:: ratio
   :name: sds-embed-ratio
   :type: string
   :default: "16 / 9"

   The shape the frame holds while it fills the column, as CSS writes it.
   For a video, a map or anything else with no size of its own.

.. confval:: width
   :name: sds-embed-width
   :type: number

.. confval:: height
   :name: sds-embed-height
   :type: number

   The size of the document, in pixels. Both together, and **without a
   ratio**, make the frame fixed. It is exactly this wide, and it scrolls
   instead of a reflow of what it holds.

.. confval:: caption
   :name: sds-embed-caption
   :type: string

.. confval:: allow
   :name: sds-embed-allow
   :type: string

   The permissions policy of the frame. A video player asks for what it
   needs. A card asks for nothing, and gets nothing.

.. confval:: allowfullscreen
   :name: sds-embed-allowfullscreen
   :type: boolean
   :default: false

.. note::

   The frame does not load lazily, on purpose. An embed is the evidence on
   the page, and one that loads on scroll is blank in every screenshot.

.. _component-sds-compare:

sds-compare
===========

Two pictures side by side, each with its claim. A concept shows what stands
and what it proposes, and a reader reads the two against each other. So
they stand in one row, each an :ref:`sds-figure <component-sds-figure>`
with its own caption, under a word that says which is which.

.. code-block:: html

   <sds-compare
     before-src="/shots/status.png" before-alt="…" before-caption="The row says what the source does now."
     after-src="/shots/source.png" after-alt="…" after-caption="The page keeps the last two reads."
     before-label="As it stands" after-label="Proposed"
     zoomable
   ></sds-compare>

The halves reflow by their own width, never by the window. A half narrower
than a picture reads is no half, and the two stand one under the other
instead. Each half is a figure, so a press opens either at its own size. A
picture arrives as every picture does: a link to a file, in the colours of
its export.

.. confval:: before-src, after-src
   :name: sds-compare-src
   :type: string
   :required: true

   The two files. ``before-alt`` and ``after-alt`` say what each shows for
   a reader who cannot see it; ``before-caption`` and ``after-caption``
   carry the claim each makes.

.. confval:: before-label, after-label
   :name: sds-compare-label
   :type: string
   :default: "Before", "After"

   The word over each half. The caller's: ``As it stands`` and ``Proposed``
   where a paper says it that way, or the names of two pages read against
   each other.

.. confval:: zoomable
   :name: sds-compare-zoomable
   :type: boolean
   :default: false

   A press opens either picture at its own size.

.. _component-sds-lightbox:

sds-lightbox
============

A drawing at its drawn size, on the platform's ``<dialog>``. So the page
behind it goes inert, the focus moves in and comes back, and Escape closes.
The surface is not the modal's. A modal stops at a reading measure because a
reader reads what is inside one, and a reader looks at a drawing.

The surface is a stage, not a box around the file: as much of the screen as
it can take without the edges. The picture fits into it and stands in the
middle, whichever way round it is. A picture smaller than the stage keeps
its own size, since a larger draw only blurs it. The page behind it stops
its scroll while it is open. The platform makes the rest inert, and a wheel
over the backdrop is not.

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

   What the drawing claims, in the head. The same sentence the figure
   carries, so the open is not a change of subject.

.. confval:: open
   :name: sds-lightbox-open
   :type: boolean
   :default: false

It answers ``sds-command``, ``show``, ``close``, ``toggle``, and has
``show()`` and ``close()`` for a page that calls them. ``sds-figure`` needs
none of it. It owns its viewer and calls ``show()`` itself.

.. seealso::

   :doc:`/design-system/diagrams` for how to make a drawing a page can
   reference, and :doc:`/design-system/artwork` for what belongs in one.
