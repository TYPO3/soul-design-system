:navigation-title: Design system

=============
Design system
=============

What the system decided, and a card that renders the decision beside it. Every
page here states a rule and then shows it: the specimens are the same files the
design pane opens and Storybook embeds, generated from the stories that produce
them, so a rule and its rendering cannot drift apart.

.. toctree::
   :titlesonly:

   design-with-claude
   colours
   type
   writing
   spacing
   states
   accessibility
   icons
   illustrations
   diagrams
   artwork
   brand
   forms
   screens

Non-negotiable
==============

These rules are not preferences. Each exists because breaking it made
something worse in a way that took a while to see.

- **One accent.** ``--accent`` marks exactly three things: the active
  navigation item, the shell prompt in a code block, the pipe in the wordmark.
- **A shadow says a surface has left the page, and nothing else says it.**
  ``--shadow-flyout`` under what the bar opens over the text, and the named
  steps beside it — ``basic``, ``strong``, ``tooltip``, ``dialog``,
  ``window`` — for whatever else genuinely floats. Everything that stays on
  the page separates with a hairline plus ``--surface-overlay``; the focus
  ring is a state rather than depth.
- **No emoji.** Status is a colour plus a glyph from ``packages/frontend/assets/icons/``.
- **Mono is semantic.** Anything the machine reads, writes or names is Source
  Code Pro, verbatim, at every size.
- **16px is the floor** for the signet and the icons.
- **Interaction never changes size.** A linked card alone may lift 2px and
  light its frame; a flush wall and reduced motion hold it still.

.. seealso::

   ``SKILL.md`` is the operating instruction. The pages in this section put
   each rule beside its reason. Read the matching page before extending or
   breaking a rule.

Where the rules live
====================

.. list-table::
   :header-rows: 0

   * - ``packages/frontend/src/tokens/*.css``
     - the values: colour, type, control scale, spacing, radius, motion
   * - ``packages/frontend/src/styles/styles.css``
     - the single entry point — tokens, then the component layer
   * - ``packages/frontend/src/styles/components.css``
     - the ``sds-`` class vocabulary every surface is built from
   * - ``packages/frontend/src/styles/document.css``
     - the document layer, linked beside it where prose is being set
   * - ``packages/frontend/src/components/*.ts``
     - the elements, which emit exactly those classes
   * - ``stories/**/*.stories.ts``
     - what every specimen card is generated from
   * - ``specimens/guidelines/*.card.html``
     - the token-layer cards embedded in these pages

The direction of truth runs story → card. A card is **generated**: edit the
story, never the card, and ``make verify`` fails on a card no story produces.
