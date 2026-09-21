:navigation-title: Type

====
Type
====

The split between the two type families is semantic, not decorative.

**Source Sans 3** carries everything a person wrote. **Source Code Pro**
carries everything the machine reads, writes or names, at every size: tool
names, arguments, paths, versions, CLI fragments, headings included.
``--font-size-body``, ``packages/frontend/src/tokens/colors.css``, ``make
verify``. Never title case, never prettified.

Both families ship under ``packages/frontend/fonts/``, not from a font host.
So a design renders in the right type behind a strict content policy or with
no network. ``make fonts`` generates them from ``@fontsource``, and git keeps
them because the frontend package publishes them. A fresh clone and a
consumer have the same faces without a setup step.

Each upright family is one variable face across the weight axis. Source Sans
also ships its variable italic. The page preloads the upright latin faces, and
``font-display: optional`` keeps a late response from a swap after paint. The
first visit on a slow connection can stay in the fallback. Later visits use
the cached face without a layout change.

Weight binds to a role too. Text, labels, headings and emphasis select named
``--weight-*`` tokens, never a literal. Italic marks semantic emphasis and a
citation, not another heading style.

One scale, bound by role
========================

``tokens/typography.css`` holds every size and nothing else. Each step has
the name of the register it *is*, never of the component that uses it.
``tokens/controls.css`` holds the roles: ``--control-font-size``,
``--nav-font-size``, ``--table-head-size``. Each binds to a step above
without a second value. A size a component needs is one the scale names, or
the scale gains it.

Size tokens live under ``--font-size-*``. ``--text-*`` is text colour. So a
token's name says if it changes the register or the ink.

The role is the durable decision. A literal on a button is a second scale
with no relation to prose. A role bound to a step lets the scale move without
a control left behind.

Font-size tokens use whole pixels. A half-pixel step is not a role, and it
rasterises less predictably. An ``em`` adjustment for optical alignment is a
ratio of its context, not a size in the scale.

Scale
=====

.. specimen:: guidelines/type-scale.card.html
   :viewport: 700x331
   :title: Type scale

Two sizes carry text a person reads: ``--font-size-body`` is normal and
``--font-size-small`` is small. There is nothing under them. Not a table
head, not a caption, not the closing line of a footer, not the annotation on
a specimen card. Only a reader who already knows the text can read a smaller
size.

The box and the face tell a button label from a nav item, or a table head
from the meta beside it. Never a pixel of size. The roles that once held a
step each are names in ``controls.css`` now.

**A run of text that *is* the thing takes the reading size. One that is
*about* something else takes the small one.** So a control takes 16. A
reader reads a button before a press, and Safari zooms the page at a smaller
field on focus. So do a table's rows and heads, a rail, a breadcrumb, a
pager, a set of tabs and a swatch's value. So does the error under a control:
a hint describes the answer, an error stands between the reader and the send.

A caption, a hint, a footnote, an attribution and a badge are about the thing
beside them, and stay small. So does the annotation on a specimen card.

No step stands between the two. A single pixel is a rasterisation
difference, not a register a reader can tell apart.

Leading is a scale too
======================

``--leading-*`` runs from closed to open: solid, display, heading, tight,
snug, body, code. Every role binds to one of them, the same way the sizes do.

Two steps carry a load. ``--leading-tight`` is what a table row's three
densities come from. ``--leading-heading`` is also what a control sets in: a
control does not wrap, and prose leading makes its height a function of the
body scale.

``--leading-solid`` is the closed end, and it is for the button. A button is
a row of a glyph and a label. At the heading step the label's line box stands
taller than the mark beside it. Solid, the line box is the type size and the
row is one height. It is a step and not a bare ``1``, because that is what
the scale is for.

Prose runs at ``--leading-body``. A block the machine wrote stays the most
open step, and a diff shares it. A reader reads both line by line.

Titles and bodies move together
===============================

A titled component chooses a register, not two sizes. A note, a surface, a
modal and an accordion use the block register. A card and a result use the
entry register, because their titles are destinations. Each register binds a
title token and the shared body token, so the pair moves as one decision.

A sentence-bearing block uses the reading register wherever it stands. A box
does not make a note dense. Code, compact rows and captions choose a dense
role, because a reader scans them as machine content. Density follows how a
reader reads the content, not if it has a border.

So a component never sets ``--font-size-*`` on one half of a titled block.
That makes a second relation the register tokens cannot keep.

Display and headings
====================

Headings use sentence case. :doc:`writing` carries the rest of the voice.

A heading sets itself. ``h1`` to ``h3`` carry the size of their level, so a
plain HTML outline needs no class. Below ``h3`` everything is the UI
register. ``sds-h1``, ``sds-h2`` and ``sds-h3`` are for the page that
disagrees with the outline. A section can stand third and read as the first
thing on the page. The level is the document's, the size is the page's.

``sds-display`` is the opening line of a page, not a step in the outline.

.. specimen:: guidelines/type-display.card.html
   :viewport: 700x200
   :title: Display & headings

Body and lead
=============

.. specimen:: guidelines/type-body.card.html
   :viewport: 700x209
   :title: Body & lead

Lists
=====

A list indents by the width of its own marker, so an item's text lines up
with the paragraph above it. The marker takes the muted ink: it is
punctuation, not content. The element carries all of that. A ``<ul>`` from
an editor needs no class.

Two classes say what the element cannot. ``sds-list`` puts air between items
that are a sentence or two each. ``sds-list--plain`` takes the markers and
the top-level indent off a list of links.

An ordered list is the right shape for steps of one line each. A step with a
command, a file to edit and a line that says it worked is an instruction:
:ref:`sds-steps <component-sds-steps>`, numbered stops down one rail, each
with blocks.

.. specimen:: guidelines/type-lists.card.html
   :viewport: 700x248
   :title: Lists

.. note::

   The system does not decide *which* marker an ordered list counts with. A
   source that said ``a.`` or ``i.`` arrives as HTML's ``type`` attribute.
   The rules here leave that attribute alone.

Notes at the foot
=================

A statement with a source carries a mark, and the note stands at the foot of
the page. The label hangs **beside** the note, so a stack of them lines up on
one edge and an eye finds the one it wants.

``sds-footnote`` is the block, and a citation is one of them. Its label
carries a work's name instead of a number. A page that needs the two apart
has the renderer's anchor: ``citation-<name>`` against ``footnote-<n>``.

.. specimen:: guidelines/type-notes.card.html
   :viewport: 700x288
   :title: Notes at the foot

.. note::

   Arrival is a state. A browser scrolls to one row of a stack that all look
   alike, so ``:target`` lights the label in ``--text-accent-quiet``. A
   heading, a confval and a term make the same mark when a link lands.

Mono and labels
===============

**Everything in mono goes through ``--font-modifier-mono``.** Every glyph in
Source Code Pro has the same advance, so a run at the size beside it reads a
step larger. The token is a bare ratio, not a step or a length. Against
``1em`` it corrects a phrase in a sentence: ``code``, ``kbd``, ``samp``,
``.sds-mono``, an option name. Against a step it corrects a run set at one: a
label, a table head, a badge, a nav item, a block the machine wrote.

``tokens/fonts.css`` states it once. A mono declaration that reaches a size
without it draws a step larger than the sans beside it. A glyph on its own is
the exception: a permalink mark is a character, and its size is an optical
choice.

Inline code has no box and no colour of its own. A tinted, padded chip breaks
the line at every occurrence, and a reference sentence can hold four. A
second ink collides with the link or claims a status the run does not have.

A step of weight sets the run apart instead. It is ``--weight-medium`` where
the sentence is regular. That puts back the colour the ratio took out, at the
cost of no box and no hue. A block the machine wrote takes the step off
again. The block decides size, weight and colour, and a whole block in medium
reads as emphasis.

A name that is a link, or stands in one, keeps the link's ink. The face is
the machine's. The colour is what says the word is a link. The link's
rules say it at rest, under the pointer and on a tinted plane. The same
holds for a name cell in a table: the primary ink, never the link ink,
because ``--text-link`` says link and nothing else.

.. specimen:: guidelines/type-mono.card.html
   :viewport: 700x230
   :title: Mono & labels
