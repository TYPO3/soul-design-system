:navigation-title: Icons

=====
Icons
=====

Every ``actions-*`` icon from `TYPO3/TYPO3.Icons
<https://github.com/TYPO3/TYPO3.Icons>`__. The identifiers are the core's
own — the same strings ``typo3_icon_lookup`` returns — so design and runtime
name the same thing.

**Where they come from.** The set is generated, never committed:
``scripts/icons.ts`` copies a whole category out of the ``@typo3/icons``
package, in the layout the package itself uses, so its own manifest resolves
against what ships. An empty ``packages/frontend/assets/icons/`` means ``npm ci`` has not run;
it is not a missing file to work around.

**Getting one outside** ``actions``. ``packages/frontend/assets/icons.json``
names every icon upstream has, shipped here or not: an identifier's category
and the path to its file, so nothing is guessed from the spelling. What is
actually here is ``packages/frontend/assets/icons/icons.json`` beside it, and only
that one's paths resolve. It also maps the deprecated aliases to their
current names. Resolve an alias before using it — the old spelling is not
what ``typo3_icon_lookup`` returns.

Only the ``actions`` category ships. To bring another one in, add it to
``CATEGORIES`` in ``scripts/icons.ts`` and run ``make icons``: a category
arrives whole, in the package's own layout, because a manifest's paths resolve
against it. Never drop a file into the generated directory by hand.

.. warning::

   **A missing icon is contributed upstream**, never drawn locally and never
   substituted from another set. The script fails on an identifier the
   package does not have, rather than falling back to anything.

Rules
=====

- TYPO3 UI glyphs use a 16 × 16 viewBox and filled paths with
  ``fill="currentColor"``. The signet is deliberately stroked instead: one is
  interface vocabulary, the other a brand mark, and they do not pretend to be
  one drawing family.
- Neutral standalone icons use ``--text-secondary``. ``--accent`` marks only
  an active item; status colours belong only to icons that communicate that
  status.
- **An icon is as big as the text it sits in.** That is the default and it
  needs no asking: ``<sds-icon>`` and ``class="sds-icon"`` are both ``1em``,
  so a glyph in a 13px label is 13px and one in body copy is 17px, and
  neither is a number anybody had to choose.
- A number is for a glyph standing on its own — an empty state, a mark beside
  nothing. Then: 16, 20, 24 or a whole multiple. **Never 18 or 22.** 16 is
  the floor; below it, no icon at all. The element is asked with
  ``size="24"``, markup with ``sds-icon--16``, ``sds-icon--20`` or
  ``sds-icon--24`` — the steps a page reaches for by hand. Above them the
  element is the only way to ask, because a size a page picks once is a style
  rather than a name the system carries.
- Icon before its label with an 8px gap — except direction icons, which
  follow.
- Inline the SVG wherever colour must follow the UI. An ``<img>`` cannot
  inherit ``currentColor``, which is why ``packages/frontend/src/components/icon.ts`` puts the
  glyph in the document rather than linking it.

These state icons have a stable meaning without visible text beside them and
may stand alone: ``actions-check-circle`` (answered),
``actions-exclamation-triangle`` (version-bound),
``actions-exclamation-circle`` (installation not bootable) and
``actions-info-circle`` (a stated boundary). Give a standalone ``sds-icon`` a
``label`` for assistive technology. Every other icon sits beside visible text
and is hidden from assistive technology rather than announced twice.

The set
=======

.. specimen:: guidelines/icons-set.card.html
   :viewport: 700x233
   :title: The set

Usage
=====

.. specimen:: guidelines/icons-usage.card.html
   :viewport: 700x481
   :title: Usage
