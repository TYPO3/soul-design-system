:navigation-title: Stylesheets

===============================
How the stylesheets are written
===============================

The class layer is one vocabulary written by many hands, and it reads as one
file only because every file follows the same few rules. This page is those
rules: what each layer may hold, how a distance travels, what a component's
file looks like inside, and what nesting may and may not do. The pages around
this one say what the classes *are*; this one says how their stylesheets are
written — so the reason can live here once instead of being retold in every
file it governs.

The layers
==========

.. code-block:: css

   @layer tokens, reset, base, layout, components, state;

Declared once, at the top of ``styles.css``. A later layer wins over an
earlier one whatever the specificity and wherever the rule stands — so where
a rule lives decides what it can overrule, not what line it is on and not how
loud its selector is.

.. list-table::
   :header-rows: 1

   * - Layer
     - What belongs in it
   * - ``tokens``
     - the values: colour, type, controls, spacing, radius, motion
   * - ``reset``
     - what is taken back from the browser, for every element alike
   * - ``base``
     - what a bare element is, and the flow contract below
   * - ``layout``
     - the page: rows, gutters, and the containers that take steps back
   * - ``components``
     - the ``sds-`` vocabulary, one file per component
   * - ``state``
     - the last word, held in reserve — something that must overrule a
       component does it from here, not with a louder selector

A page of prose links nothing extra. What a renderer emits without a class is
a bare element, and a bare element is set by the layer that owns it — the sheet
of the component it belongs to, or ``base.css`` where it belongs to none. Only
what a passage really adds is scoped, in ``components/prose.css``, and it is
drawn where a page carries ``sds-prose``. See :doc:`documents`.

The flow contract
=================

**Every distance is stated once, by the thing that owes it.** A block carries
the step below itself; a container that spaces its children takes those steps
back; no rule reaches past a tag to find a block, and no distance is
assembled from two halves.

An element that stands in a flow therefore has three rules in ``base``, in
its component's own file, that only mean anything together:

.. code-block:: css

   @layer base {
     sds-note {
       display: block;
       min-width: 0;
       margin-bottom: var(--space-4);
     }
     sds-note > .sds-note {
       margin-bottom: 0;
     }
     .sds-note {
       margin: 0 0 var(--space-4);
     }
   }

The element carries the step, the box it always renders inside itself gives
that step up, and the same box standing alone carries it. That is the price
of one vocabulary rendered two ways — upgraded by an element where script
runs, written as bare classes where none does — measuring the same either
way.

The rules sit in ``base`` and not in the component's own layer: a container
in ``layout`` takes the step back, and a step stated in ``components`` would
win over the container that already paid the gap.

Two kinds of element opt out, each by being what it is. One that stands in a
line of text or a row of controls is inline and carries no step at all — a
distance below a control belongs to the block standing around it. And a
region that only ever stands in the page — a bar, a rail, a footer — owes no
step either: a container or a set spaces it, so its ``base`` lines state the
display and ``min-width: 0`` and nothing more.

Because the contract is this page's to explain, the files that follow it do
not retell it: a ``@layer base`` block holding these three rules is the
pattern, recognised rather than narrated.

What a component is made of
===========================

**Everything a component is, it is through a property of its own.** Each one
declares its set at the top of its own stylesheet, derived from the tokens
every component shares, and every declaration under it reads only that set:

.. code-block:: css

   .sds-btn {
     --sds-btn-height: var(--control-height);
     --sds-btn-fill: transparent;
     --sds-btn-fill-hover: var(--sds-btn-fill);

     min-height: var(--sds-btn-height);
     background: var(--sds-btn-fill);

     &:hover {
       --sds-btn-fill: var(--sds-btn-fill-hover);
     }
   }

A variant and a size then **assign values and draw nothing**:

.. code-block:: css

   .sds-btn--primary {
     --sds-btn-fill: var(--accent);
     --sds-btn-fill-hover: var(--accent-hover);
   }

Three things follow. There is no ``.sds-btn--primary:hover`` rule for a later
one to outweigh — the state is written once, whatever the variant. A size is a
handful of numbers rather than the same declarations repeated per variant. And
a surface that needs one instance different sets a property on it instead of
writing a class this system has never heard of.

A value that reaches a declaration without passing through the set is the
thing this prevents: ``line-height: 1.55`` in one component and
``var(--leading-body)`` in every other is drift nothing can see.
``make verify ARGS=sets`` holds every component to it. Two things are read
straight, and only two: the focus ring, because there is one ring, and the
colours that mean something — a component able to re-point those could draw an
error green.

The one thing the check cannot see is **where** a set is declared. A property
travels down: never sideways to a box beside the one that declared it, never
up to the page around it. A set therefore sits on an ancestor of everything
that reads it — which is why a tab panel standing beside its row carries its
own, and why the offset the page scrolls to is declared on the page rather
than on the bar that causes it.

Nested, and no heavier for it
=============================

The stylesheets are written with **native CSS nesting**: what belongs to one
subject stands inside its block. A component's states and conditions are read
where the component is, instead of being found by searching the file for its
name — the ``&:hover`` above is the shape. Two lines hold it:

- **A name is written whole.** Native nesting joins selectors, never strings —
  there is no ``&-part`` — and that suits this system: every check reads names
  literally, and a name assembled from pieces is a name no search finds. A
  variant is a full class and a top-level rule; nesting it as ``&.sds-btn--primary``
  would also make it a class heavier than it was.
- **Nesting is scope, never weight.** A nested rule re-enters through
  ``:is()``, which carries the parent's full specificity. So a rule moves
  inside a block only when the selector it desugars to is the selector it
  already had flat: ``&:hover`` inside ``.sds-btn`` *is* ``.sds-btn:hover``
  and moves; a descendant rule like ``.sds-btn--icon .sds-icon`` nests
  losslessly under its owner; a part addressed as a bare class would come out
  a descendant and a class heavier, and stays where it is. What is written
  weightless — ``:where()`` — stays written out, because zero specificity is
  the point.

Weightless on purpose
=====================

Between layers, weight does not decide. A component's plainest class beats
the loudest selector in ``base``, because ``components`` stands later in the
layer order — which is why the bare-element rules are written at their
natural weight: a plain ``a:hover`` in ``base`` cannot answer over any
component that states the same property, however either one is spelt.

Weight decides *within* a layer, and that is the whole of what ``:where()`` is
for here: a condition or a scope that adds no weight to the rule it qualifies.
The glyph before its element upgrades is the model, and the reason stands
beside it in ``components/icon.css``:

.. code-block:: css

   /* `:where()`, or this would out-weigh `.sds-icon--20` and cause the jump it
      prevents. */
   :where(sds-icon:not(:defined)) {
     width: var(--sds-icon-size);
     height: var(--sds-icon-size);
   }

``components/direction.css`` is the same move on a scope: what mirrors under
``:dir(rtl)`` weighs what it would weigh without the condition, so no rule
starts winning an argument in one direction that it loses in the other.

A condition that must *win* something in its own layer is the other case — it
is written at full weight, in the layer whose turn it is to speak.

The written form
================

``make css`` holds the form — Biome, configured in ``biome.jsonc`` at the
repository root and run by the gate as the ``css`` check. The formatter's
word is final and not negotiated per file: one declaration to a line,
two-space indentation, and how a long value breaks. What it lints on top are
the safety rules — a duplicate property, an unknown property, unit or
pseudo-class — with one of its rules turned off where it contradicts this
system, and the reason written beside the switch.

One rule is this system's own, and the task checks it itself: **no colour
literal outside** ``tokens/`` — the tokens are where the literals live, and
every other sheet reads them. The exceptions are alpha and blend tricks
rather than colours, and each states its reason in a ``colour-literal:``
comment above the declaration it covers, the way the knockout glyphs and
the mask do.

What no rule can hold stays convention, written here and held in review: a
component's set stands first under its rubric comments, then a blank line,
then what is drawn, then the nested rules; and the shared sheets are
organised by concern, so a selector there may reopen under a new heading —
the one liberty a component file does not have, because its blocks are its
subjects.

.. seealso::

   :doc:`components/index` for the elements that emit these classes, and
   :doc:`/design-system/index` for the visual decisions the tokens encode.
