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

**Getting one outside** ``actions``. ``packages/frontend/dist/icons.json`` is the lookup — it
names an identifier's category and the path to its file, so nothing is
guessed from the spelling. It also maps the deprecated aliases to their
current names. Resolve an alias before using it — the old spelling is not
what ``typo3_icon_lookup`` returns.

To *ship* one, add its identifier to the ``ICONS`` list in
``scripts/icons.ts`` and run ``make icons``. Never drop a file into the
generated directory by hand.

.. warning::

   **A missing icon is contributed upstream**, never drawn locally and never
   substituted from another set. The script fails on an identifier the
   package does not have, rather than falling back to anything.

Rules
=====

- 16 × 16 viewBox, filled paths, ``fill="currentColor"`` at
  ``--text-secondary``.
- **An icon is as big as the text it sits in.** That is the default and it
  needs no asking: ``<sds-icon>`` and ``class="sds-icon"`` are both ``1em``,
  so a glyph in a 13px label is 13px and one in body copy is 17px, and
  neither is a number anybody had to choose.
- A number is for a glyph standing on its own — an empty state, a mark beside
  nothing. Then: 16, 20, 24 or a whole multiple. **Never 18 or 22.** 16 is
  the floor; below it, no icon at all. Ask with ``size="24"`` on the element
  or ``sds-icon--24`` in markup.
- Icon before its label with an 8px gap — except direction icons, which
  follow.
- Inline the SVG wherever colour must follow the UI. An ``<img>`` cannot
  inherit ``currentColor``, which is why ``packages/frontend/src/lib/icon.ts`` inlines rather
  than links.

Only four icons may stand without a label: ``actions-check-circle``
(answered), ``actions-exclamation-triangle`` (version-bound),
``actions-exclamation-circle`` (installation not bootable) and
``actions-info-circle`` (a stated boundary).

The set
=======

.. specimen:: guidelines/icons-set.card.html
   :viewport: 700x240
   :title: The set

Usage
=====

.. specimen:: guidelines/icons-usage.card.html
   :viewport: 700x482
   :title: Usage
