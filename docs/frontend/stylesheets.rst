:navigation-title: Stylesheets

===============================
How the stylesheets are written
===============================

The class layer is one vocabulary from many hands, and it reads as one file
because every file follows the same few rules. This page holds those rules:
what each layer holds, how a distance travels, what a component's file looks
like inside, and what nesting can do. The pages around this one say what the
classes *are*. This one says how to write their stylesheets, so the reason
stands here once.

The layers
==========

.. code-block:: css

   @layer tokens, reset, base, layout, components, state;

Declared once, at the top of ``styles.css``. A later layer wins over an
earlier one, whatever the specificity and wherever the rule stands. So the
layer a rule lives in decides what it can overrule, not its line and not the
weight of its selector.

.. list-table::
   :header-rows: 1

   * - Layer
     - What belongs in it
   * - ``tokens``
     - the values: colour, type, controls, spacing, radius, motion
   * - ``reset``
     - what the system takes back from the browser, for every element
   * - ``base``
     - what a bare element is, and the flow contract below
   * - ``layout``
     - the page: rows, gutters, and the containers that take steps back
   * - ``components``
     - the ``sds-`` vocabulary, one file per component
   * - ``state``
     - the last word, in reserve. What must overrule a component does it
       from here, not with a louder selector

``hidden`` is the one rule in ``state`` for the whole system. Every layer
above states a ``display`` for something, and an author rule beats the
browser's own. So the platform's word for "not now" lost wherever it met one.
``state`` puts it back for every element at once, which is why nothing on
this system needs an ``!important`` to hide one. ``hidden="until-found"``
stays as it is. The browser answers that one with ``content-visibility``,
and a page that wants find-in-page to reach a collapsed passage keeps it.

A page of prose links nothing extra. What a renderer emits without a class is
a bare element, and the layer that owns it sets it. That is the sheet of its
component, or ``base.css`` where it belongs to none. Little stays scoped to
a passage. ``components/prose.css`` holds the box itself and the two names
the parser writes on a line block. See :doc:`documents`.

The flow contract
=================

**Every distance stands once, on the thing that owes it.** A block carries
the step below itself. A container that spaces its children takes those
steps back. No rule reaches past a tag to find a block, and no distance is
two halves.

So an element in a flow has three rules in ``base``, in its component's own
file, that only mean anything together:

.. code-block:: css

   @layer base {
     sds-note {
       display: block;
       min-width: 0;
       margin-bottom: var(--space-flow);
     }
     sds-note > .sds-note {
       margin-bottom: 0;
     }
     .sds-note {
       margin: 0 0 var(--space-flow);
     }
   }

The element carries the step. The box it always renders inside itself gives
that step up. The same box on its own carries it. That is the price of one
vocabulary rendered two ways. An element renders it where script runs, bare
classes where none does, at the same measure either way.

The rules sit in ``base`` and not in the component's own layer. A container
in ``layout`` takes the step back, and a step in ``components`` wins over the
container that already paid the gap.

Two kinds of element opt out, each by what it is. One that stands in a line
of text or a row of controls is inline and carries no step. A distance below
a control belongs to the block around it. A region that only stands in the
page, a bar, a rail, a footer, owes no step either. A container or a set
spaces it, so its ``base`` lines state the display and ``min-width: 0`` and
nothing more.

This page explains the contract, so the files that follow it do not. A
``@layer base`` block with these three rules is the pattern.

What a component is made of
===========================

**Everything a component is, it is through a property of its own.** Each one
declares its set at the top of its own stylesheet, derived from the shared
tokens. Every declaration under it reads only that set:

.. code-block:: css

   .sds-btn {
     --sds-btn-height: var(--control-height);
     --sds-btn-fill: transparent;
     --sds-btn-fill-hover: var(--sds-btn-fill);

     min-height: var(--sds-btn-height);
     background: var(--sds-btn-fill);

     &:hover {
       background: var(--sds-btn-fill-hover);
     }
   }

**A state draws from the other half of the set. It does not assign into the
half at rest.** ``--sds-btn-fill: var(--sds-btn-fill-hover)`` under
``&:hover`` reads the property whose own default reads it back, and that is
a cycle. Every property in it is invalid at computed value, every declaration
that reads one drops, and nothing says so. ``tests/states.spec.ts`` holds
it.

A variant and a size then **assign values and draw nothing**:

.. code-block:: css

   .sds-btn--primary {
     --sds-btn-fill: var(--accent);
     --sds-btn-fill-hover: var(--accent-hover);
   }

Three things follow. There is no ``.sds-btn--primary:hover`` rule for a
later one to outweigh: the state stands once, whatever the variant. A
size is a few numbers, not the same declarations per variant. And a surface
that needs one instance different sets a property on it instead of a class
this system never heard of.

A value that reaches a declaration without the set is what this prevents.
``line-height: 1.6`` in one component and ``var(--leading-body)`` in every
other is drift nothing can see, for as long as the two agree. ``make verify
ARGS=sets`` holds every component to it. Two things read straight, and only
two: the focus ring, because there is one ring, and the colours that mean
something. A component that can re-point those can draw an error green.

The one thing the check cannot see is **where** a set stands. A property
travels down: never sideways to a box beside the one that declared it, never
up to the page around it. So a set sits on an ancestor of everything that
reads it. That is why a tab panel beside its row carries its own. And why
the page declares the offset it scrolls to, not the bar that causes it.

Nested, and no heavier for it
=============================

The stylesheets use **native CSS nesting**: what belongs to one subject
stands inside its block. A reader finds a component's states and conditions
where the component is, not by a search of the file for its name. The
``&:hover`` above is the shape. Two lines hold it:

- **A name stands whole.** Native nesting joins selectors, never strings.
  There is no ``&-part``, and that suits this system. Every check reads
  names literally, and a name from pieces is a name no search finds. A
  variant is a full class and a top-level rule. As ``&.sds-btn--primary`` it
  is also a class heavier than it was.
- **Nesting is scope, never weight.** A nested rule re-enters through
  ``:is()``, which carries the parent's full specificity. So a rule moves
  inside a block only when the selector it desugars to is the one it had
  flat. ``&:hover`` inside ``.sds-btn`` *is* ``.sds-btn:hover`` and moves. A
  descendant rule like ``.sds-btn--icon .sds-icon`` nests under its owner
  without loss. A part addressed as a bare class comes out a descendant and
  a class heavier, and stays where it is. What is weightless, ``:where()``,
  stays written out, because zero specificity is the point.

Weightless on purpose
=====================

Between layers, weight does not decide. A component's plainest class beats
the loudest selector in ``base``, because ``components`` stands later in the
layer order. So the bare-element rules keep their natural weight: a plain
``a:hover`` in ``base`` cannot answer over a component that states the same
property.

Weight decides *within* a layer, and that is what ``:where()`` is for here.
A condition or a scope that adds no weight to the rule it qualifies. The
glyph before its element upgrades is the model, and the reason stands beside
it in ``components/icon.css``:

.. code-block:: css

   /* `:where()`, or this would out-weigh `.sds-icon--20` and cause the jump it
      prevents. */
   :where(sds-icon:not(:defined)) {
     width: var(--sds-icon-size);
     height: var(--sds-icon-size);
   }

``components/direction.css`` is the same move on a scope. What mirrors under
``:dir(rtl)`` weighs what it weighs without the condition. So no rule wins
in one direction and loses in the other.

A condition that must *win* in its own layer is the other case. Write it at
full weight, in the layer whose turn it is to speak.

The written form
================

``make css`` holds the form: Biome, configured in ``biome.jsonc`` at the
repository root, and the gate's ``css`` check. The formatter's word is final
and not per file: one declaration to a line, two-space indentation, and how
a long value breaks. On top it lints the safety rules, a duplicate property,
an unknown property, unit or pseudo-class. One of its rules is off where it
contradicts this system, with the reason beside the switch.

One rule is this system's own, and the task checks it itself: **no colour
literal outside** ``tokens/``. The tokens hold the literals, and every other
sheet reads them. The exceptions are alpha and blend tricks, not colours.
Each states its reason in a ``colour-literal:`` comment above the
declaration it covers, the way the knockout glyphs and the mask do.

What no rule can hold stays convention, written here and held in review. A
component's set stands first under its rubric comments, then a blank line,
then what it draws, then the nested rules. The shared sheets follow their
concerns, so a selector there can reopen under a new heading. A component
file has no such liberty, because its blocks are its subjects.

.. seealso::

   :doc:`components/index` for the elements that emit these classes, and
   :doc:`/design-system/index` for the visual decisions the tokens encode.
