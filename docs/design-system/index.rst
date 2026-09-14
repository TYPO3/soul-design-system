:navigation-title: Design system

=============
Design system
=============

What the system decided, and a card that renders the decision beside it.
Every page here states a rule and then shows it. The specimens are the same
files the design pane opens and Storybook embeds, generated from the stories.
So a rule and its rendering cannot drift apart.

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

These rules are not preferences. Each exists because a break made something
worse in a way that took time to see.

- **One accent.** ``--accent`` marks exactly three things. The active
  navigation item, the shell prompt in a code block, the pipe in the
  wordmark.
- **A shadow says a surface has left the page, and nothing else says it.**
  ``--shadow-flyout`` under what the bar opens over the text. The named steps
  beside it, ``basic``, ``strong``, ``tooltip``, ``dialog``, ``window``, for
  whatever else floats. Everything on the page separates
  with a hairline plus ``--surface-overlay``. The focus ring is a state, not
  depth.
- **No emoji.** Status is a colour plus a glyph from
  ``packages/frontend/assets/icons/``.
- **Mono is semantic.** Everything the machine reads, writes or names is
  Source Code Pro, verbatim, at every size.
- **16px is the floor** for the signet and the icons.
- **Interaction never changes size.** A linked card alone can lift 2px and
  light its frame. A flush wall and reduced motion hold it still.

.. seealso::

   ``SKILL.md`` is the operating instruction. The pages in this section put
   each rule beside its reason. Read the page before you extend or break a
   rule.

Where the rules live
====================

.. list-table::
   :header-rows: 0

   * - ``packages/frontend/src/tokens/*.css``
     - the values: colour, type, control scale, spacing, radius, motion
   * - ``packages/frontend/src/styles/styles.css``
     - the single entry point: tokens, then the component layer
   * - ``packages/frontend/src/styles/components.css``
     - the ``sds-`` class vocabulary every surface uses
   * - ``packages/frontend/src/styles/components/prose.css``
     - ``sds-prose``: the box a passage stands in, and the line block. The
       parser writes those two names, not a template
   * - ``packages/frontend/src/components/*.ts``
     - the elements, which emit exactly those classes
   * - ``stories/**/*.stories.ts``
     - the source of every specimen card
   * - ``specimens/guidelines/*.card.html``
     - the token-layer cards these pages embed

Truth runs story → card. **A task generates the card**: edit the story,
never the card, and ``make verify`` fails on a card no story produces.
