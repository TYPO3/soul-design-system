:navigation-title: Type

====
Type
====

The split between the type families is semantic rather than decorative.

**Source Sans 3** carries everything a person wrote. **Source Code Pro**
carries everything the machine reads, writes or names — tool names,
arguments, paths, versions, CLI fragments — at *every* size, including
headings. ``--font-size-body``, ``packages/frontend/src/tokens/colors.css``,
``make verify``. Never title-cased, never prettified.

Both are vendored under ``packages/frontend/fonts/`` rather than pulled from a font host, so a
rendered design sets in the right type behind a strict content policy or
with no network at all. They are generated from ``@fontsource`` by
``make fonts`` and committed because the frontend package publishes them. A
fresh clone and a consuming project therefore have the same faces without a
setup step or a network request at render time.

Each upright family uses a variable face across the weight axis; Source Sans
also ships its variable italic face. The page preloads the upright latin faces,
and ``font-display: optional`` keeps a late response from replacing a fallback
after paint. The first visit may stay in the fallback on a slow connection;
later visits use the cached face without a layout-changing swap.

Weight is bound by role as well. Running text, labels, headings and emphasis
select named ``--weight-*`` tokens rather than literals. Italic is reserved
for semantic emphasis and citation rather than used as another heading style.
Variable faces make those changes without adding another font request.

One scale, bound by role
========================

``tokens/typography.css`` holds every size and nothing else: each step is
named for the register it *is*, never for the component that reaches for it.
``tokens/controls.css`` is where roles live — ``--control-font-size``,
``--nav-font-size``, ``--table-head-size`` — and each binds to a step above
without writing another value. Controls still set tighter than prose, but they
use the same steps. A size a component needs is one the scale already names,
or the scale is what gains it.

Size tokens live under ``--font-size-*``. The ``--text-*`` namespace is
reserved for text colour, so a token's name says whether it changes the
register or the ink before its value is read.

The role is the durable decision. A literal on a button creates a second type
scale whose relationship to prose exists only in that declaration; binding
``--control-font-size`` to a step lets the scale move without leaving a
control behind. The split also keeps the scale honest about its own length:
when four names once stood on one value, they were four roles wearing the
scale's clothes, and the register they shared could not be counted.

Font-size tokens use whole pixels. A half-pixel step is neither a distinct
role nor an optical correction tied to context, so it creates an unnameable
step between the named ones and produces less predictable rasterisation. A
relative ``em`` adjustment may still be used for optical alignment; that is a
ratio of its context, not another font size in the scale.

Scale
=====

.. specimen:: guidelines/type-scale.card.html
   :viewport: 700x343
   :title: Type scale

Two sizes carry text a person reads: ``--font-size-body`` is normal and
``--font-size-small`` is small. There is nothing under them — not a table
head, not a caption, not the closing line of a footer, not the annotation on a
specimen card. A size below the small one is read by whoever already knows
what it says.

One step covers all of it, and that is the scale saying what it means: what
separates a button label from a nav item, or a table head from the meta beside
it, is the box around it and the face it is set in, never a pixel of size. The
roles that used to hold a step each — a control size, a compact size, a meta
size, a label size — are names in ``controls.css`` now, where a role can be
repointed without the scale growing a step to hold it.

What is not allowed is a step wedged between them. A single pixel is a
rasterisation difference rather than a register a reader can tell apart — the
finding that took the UI step off 15, and the same one that closed the run of
13, 12 and 11 this scale used to end on.

Titles and bodies move together
===============================

A titled component chooses a register rather than separate sizes for its
heading and text. Notes, surfaces, modals and accordions use the block
register; cards and results use the entry register because their titles are
destinations. Each register binds a title token and the shared body token, so
the relationship between them moves as one decision.

Sentence-bearing blocks use the reading register wherever they stand. A note
should not become dense merely because its sentences sit in a box. Code,
compact rows and captions choose dense roles explicitly because they are
scanned as machine content. Density follows how the content is read, not
whether it has a border or happens to sit inside ``.sds-prose``.

This is why a component never chooses ``--font-size-*`` directly for one half
of a titled block. Doing so creates an independent relationship between title
and body which the register tokens can no longer keep together.

Display and headings
====================

Headings use sentence case. :doc:`writing` carries the rest of the voice: how
claims are bounded, why machine names stay verbatim and why promotional
superlatives do not belong in a precise interface.

A heading sets itself: ``h1`` to ``h3`` carry the size their level usually
has, so an outline written as plain HTML is already set, and below ``h3``
everything is the UI register. ``sds-h1``, ``sds-h2`` and ``sds-h3`` are for
where the two disagree — a section that stands third in the outline and reads
as the first thing on the page. The level is the document's and the size is
the page's; the class is how the page says so without moving the heading in
the outline. ``sds-display`` is not one of them: it is the opening line of a
page rather than a step in the outline, and it says nothing about level at
all.

.. specimen:: guidelines/type-display.card.html
   :viewport: 700x184
   :title: Display & headings

Body and lead
=============

.. specimen:: guidelines/type-body.card.html
   :viewport: 700x223
   :title: Body & lead

Lists
=====

A list is indented by the width of its own marker, so an item's text lines up
with the text of the paragraph above it, and the marker is muted — it is
punctuation for the item, not part of what the item says. The element carries
all of that: a ``<ul>`` an editor emitted is already set, with no class on it.

Two classes say what the element cannot. ``sds-list`` puts air between items
that are each a sentence or two; ``sds-list--plain`` takes the markers and the
top-level indent off a list whose items are links, where every item is marked
by being a link already.

An ordered list stays the right shape for steps that are one line each. Where a
step carries a command, a file to edit and the line that says it worked, that is
an instruction rather than a list, and it is
:ref:`sds-steps <component-sds-steps>` — numbered stops down one rail, each
holding blocks.

.. specimen:: guidelines/type-lists.card.html
   :viewport: 700x263
   :title: Lists

.. note::

   The one thing the system does not decide is *which* marker an ordered list
   counts with. A source that said ``a.`` or ``i.`` arrives as the ``type``
   attribute HTML has for it, and that attribute carries no weight at all — so
   the rules here are written to leave it alone wherever it is set, rather than
   quietly turning every lettered list back into a numbered one.

Notes at the foot
=================

A statement that needs a source carries a mark, and the note it points at
stands at the foot of the page. The label hangs **beside** the note rather than
above it, so a stack of them lines up on one edge and an eye run down that edge
finds the one it wants — which is the only thing anybody does with these.

``sds-footnote`` is the block, and a citation is one of them: the label carries
a work's name instead of a number, and that is content rather than a second
look. A page that does need the two apart has the anchor the renderer wrote —
``citation-<name>`` against ``footnote-<n>`` — so nothing is lost by the one
name.

.. specimen:: guidelines/type-notes.card.html
   :viewport: 700x308
   :title: Notes at the foot

.. note::

   Arriving is its own state. A stack of notes is a stack of rows that look
   alike, and a browser scrolls to one of them without saying where it stopped
   — so ``:target`` lights the label in ``--text-accent-quiet``, the same mark
   a heading, a confval and a term already make when a link lands on them.

Mono and labels
===============

**Anything set in mono is set through ``--font-modifier-mono``.** Every glyph
in Source Code Pro carries the same advance, so a run in it at the size beside
it reads a step larger than that size and pushes the line apart. The token is
a bare ratio rather than a step in the scale or a length, which is what lets
one value answer both halves of the problem: multiplied against ``1em`` it
corrects a phrase inside a sentence — ``code``, ``kbd``, ``samp``,
``.sds-mono``, an option name — and multiplied against a step it corrects a
run that is set at one, as a label, a table head, a badge, a nav item or a
block the machine wrote.

It is stated once, in ``tokens/fonts.css``. A mono declaration that reaches a
size without passing through it is the bug this rule exists for: most of the
mono in the system once did, and every one of those surfaces drew a step
larger than the sans it stood next to. A glyph standing alone is the exception
— a permalink mark is a character, not a run, and its size is an optical
choice about the mark.

Inline code carries no box and no colour of its own. A tinted, bordered,
padded chip breaks the line's rhythm at every occurrence, and a reference
sentence can hold four of them; a second ink would have to come from a palette
where orange is already the link and green, amber and red already mean a
status, so it would either collide with a link or claim a meaning the run does
not have.

What sets the run apart is a step of weight instead. It is set in
``--weight-medium`` where the sentence around it is regular, which puts back
the colour the smaller size took out and costs neither a box nor a hue — the
face on its own reads as a lighter grey at that ratio, and the run goes under
in running text. A block the machine wrote takes the step straight back off:
inside it the block has already decided the size, the weight and the colour,
and a whole block set in medium is one asking to be read as emphasis.

.. specimen:: guidelines/type-mono.card.html
   :viewport: 700x244
   :title: Mono & labels
