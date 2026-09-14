:navigation-title: Icons

=====
Icons
=====

Every ``actions-*`` icon from `TYPO3/TYPO3.Icons
<https://github.com/TYPO3/TYPO3.Icons>`__. The identifiers are the core's
own, the strings ``typo3_icon_lookup`` returns, so design and runtime name
the same thing.

**Where they come from.** ``scripts/icons.ts`` copies a whole category out
of the ``@typo3/icons`` package, in the package's own layout, so its manifest
resolves against what ships. ``make icons`` writes them into the tree, and
git keeps them, because the frontend package publishes them. An empty
``packages/frontend/assets/icons/`` means ``make icons`` did not run after a
change to ``CATEGORIES``.

**An icon outside** ``actions``. ``packages/frontend/assets/icons/icons.json``
lists what is here, and its paths resolve against it. For an icon that is
not here yet, read the upstream manifest. That is
``node_modules/@typo3/icons/dist/icons.json`` in the container, or
https://typo3.github.io/TYPO3.Icons/. It names an identifier's category, so
nothing comes from a guess. Both map a deprecated alias to its current name.
Resolve an alias before you use it: the old spelling is not what
``typo3_icon_lookup`` returns.

``CATEGORIES`` in ``scripts/icons.ts`` says which categories ship, and that
is the whole answer. A category arrives whole, because a manifest's paths
resolve against it. To add one, add it there and run ``make icons``. Never
put a file into the generated directory by hand.

``spinner`` is a category of one, for one reason. ``.sds-spinner`` turns
whatever is in it, and what it turns has to be the set's own mark, not an
SVG drawn into a stylesheet.

.. warning::

   **A missing icon goes upstream.** Never draw one locally, never take one
   from another set. The script fails on an identifier the package does not
   have.

Rules
=====

- TYPO3 UI glyphs use a 16 × 16 viewBox and filled paths with
  ``fill="currentColor"``. The signet uses strokes on purpose: one is
  interface vocabulary, the other a brand mark.
- A neutral standalone icon uses ``--text-secondary``. ``--accent`` marks
  only an active item. A status colour belongs only to an icon that says that
  status.
- **An icon is as big as the text it sits in.** ``<sds-icon>`` and
  ``class="sds-icon"`` are both ``1em``. A glyph in a 14px label is 14px,
  and one in body copy is 16px.
- A number is for a glyph on its own: an empty state, a mark beside nothing.
  Then 16, 20, 24 or a whole multiple. **Never 18 or 22.** 16 is the floor;
  below it, no icon. The element takes ``size="24"``, markup takes
  ``sds-icon--16``, ``sds-icon--20`` or ``sds-icon--24``. Above those the
  element is the only way, because a size a page picks once is a style.
- Icon before its label with an 8px gap. A direction icon follows.
- Inline the SVG wherever colour must follow the UI. An ``<img>`` cannot
  inherit ``currentColor``, which is why
  ``packages/frontend/src/components/icon.ts`` puts the glyph in the
  document.

These state icons have a stable meaning and can stand alone:
``actions-check-circle`` (answered), ``actions-exclamation-triangle``
(version-bound), ``actions-exclamation-circle`` (installation not bootable)
and ``actions-info-circle`` (a stated boundary). Give a standalone
``sds-icon`` a ``label``. Every other icon sits beside visible text, hidden
from assistive technology, so nothing announces twice.

The set
=======

.. specimen:: guidelines/icons-set.card.html
   :viewport: 700x289
   :title: The set

Usage
=====

.. specimen:: guidelines/icons-usage.card.html
   :viewport: 700x513
   :title: Usage
