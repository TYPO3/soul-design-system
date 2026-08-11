:navigation-title: Soul
:layout: marketing

==================
Soul Design System
==================

Tokens, a class vocabulary and thirty-seven web components, for surfaces whose
job is to give somebody an answer and say where it came from.

One system, three ways to take it. They are not three products and not three
builds — they are three shapes of the same tokens and the same
``components.css``, which is why a change to a colour reaches all of them at
once.

.. Hidden because the page below says the same five in full sentences. The
   tree still exists — it is what the bar, the rail and the breadcrumb are
   built from — it simply does not print itself a second time.

.. toctree::
   :titlesonly:
   :hidden:

   design-system
   guides-theme/index
   frontend
   documents
   guidelines/index

.. grid::

   .. teaser:: As a Claude design system
      :to: /design-system

      An upload the design agent reads: every rule as a written page, every
      component as a rendered card at a known size, and whole screens to start
      a design from. Nothing is described in prose that is not also shown.

   .. teaser:: As a render guide template
      :to: /guides-theme/index

      A Composer package that turns reStructuredText or Markdown into pages
      set with this system, with the document layer that styles what a
      renderer emits when nobody can put a class on anything.

   .. teaser:: As a standalone frontend design
      :to: /frontend

      Two files a page links. No bundler, no import map, no framework: markup
      rendered by PHP, Twig or Fluid uses the class layer, and the custom
      elements upgrade it where there is behaviour.

.. band:: Three layers, and none of them is above another
   :quiet:
   :id: layers

**Tokens** are the values. Every colour, size, space, radius and duration is
declared once under a semantic name, and nothing else in the system states a
literal. A colour is ``light-dark(light, dark)`` against a root that declares
``color-scheme`` — which is why the two modes cannot drift apart: they are the
same declaration.

**Classes** are the vocabulary. ``sds-`` names what a thing *is* —
``.sds-card``, ``.sds-note--warn``, ``.sds-table--compact`` — and state is
``.is-*``.

**Elements** are the behaviour. Each renders light DOM and emits exactly the
classes above, so a component is an upgrade of markup rather than a second way
to write it. There is no second source of truth for what a button looks like.

.. table:: Which layer to reach for
   :widths: auto

   ==========  ==========================  ===================================
   Layer       Written as                  Reach for it when
   ==========  ==========================  ===================================
   Tokens      ``var(--surface-card)``     a value is needed at all
   Classes     ``class="sds-card"``        a server produced the markup
   Elements    ``<sds-note tone="warn">``  the thing has behaviour or state
   ==========  ==========================  ===================================

.. The quiet ground ends here: a band runs until the next one opens.

.. band::

What holds across all three
===========================

**Two modes, one declaration.** Force one with ``data-theme="light"`` or
``"dark"`` on a subtree; put it on ``<html>`` for a whole page, so the
browser's own scrollbars and form controls match. Left alone, the reader's
system decides.

**Fonts ship with it.** Eighteen woff2 faces under the SIL Open Font License,
because a design behind a strict content policy must not silently fall back to
``system-ui``.

**Never a literal.** Not a hex, not an ``rgb()``, not a pixel size picked by
hand. If nothing fits, the answer is a new token rather than a local value —
that rule is what keeps the three shapes the same system.

.. note::

   The rules themselves — the colour decisions, the type scale, the spacing,
   the brand — live in Storybook beside the specimens that prove them. This
   manual is about *using* the system; those pages are about what it decided
   and why.
