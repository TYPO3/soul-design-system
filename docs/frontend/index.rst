:navigation-title: Frontend

=========================
As a standalone frontend
=========================

Two files, and no assumption about what rendered the page. Markup from PHP,
Twig, Fluid or a template string uses the class layer with no JavaScript.
The custom elements upgrade that markup where there is behaviour to add.

.. toctree::
   :titlesonly:

   quickstart
   layout
   stylesheets
   components/index
   documents

.. tip::

   :doc:`quickstart` puts a working surface on a page from the package or
   the drop-in, before the reference below explains each part.

Two shapes
==========

.. tabs::

   .. tab:: The drop-in

      Copy the directory somewhere public and link two files. Lit is in the
      bundle, because a drop-in has nothing to share a copy with.

      .. code-block:: html

         <script src="/soul/soul-boot.js"></script>
         <link rel="stylesheet" href="/soul/soul.css">
         <script type="module" src="/soul/soul.js"></script>

   .. tab:: The package

      ESM with ``lit`` external, for a page that already has a bundler. A
      second copy of Lit gives a consumer a second reactive-element registry,
      and an element upgrades under the wrong one.

      .. code-block:: bash

         npm install @typo3/soul-frontend lit

      .. code-block:: javascript

         import '@typo3/soul-frontend';
         import '@typo3/soul-frontend/dist/soul.css';

.. confval:: data-theme
   :type: "light" | "dark"
   :required: false

   Forces a mode on a subtree. Put it on ``<html>`` for a whole page, so the
   browser's own scrollbars and form controls match. Without it, the
   reader's system decides, and both modes work: they are one declaration.

.. confval:: soul-boot.js
   :type: script
   :required: where there is a mode switch

   A line or two, loaded **before** the stylesheet and **not** as a module.
   It reads the stored choice and writes ``data-theme`` before the first
   paint. ``<sds-theme>`` then shows the active side, because it reads the
   document.

   With no choice it writes nothing, and that absence is the third state.
   The page follows the machine, and the switch draws the mark for it. A
   concrete mode in its place comes back to the switch as a choice the
   reader never made.

   Without it a switch still switches, but the next page forgets the choice.
   The choice lives under ``soul-theme``, which is ``sds-theme``'s own
   default too. To name another, set ``data-key`` on the tag and give the
   element the same one.

.. confval:: soul.css
   :type: stylesheet
   :required: true

   The tokens and the ``sds-`` class vocabulary, in one file. It has no
   scope class: the link *is* the opt-in. That is what lets a bare ``<p>`` or
   ``<h2>`` take its style without a class from the editor.

What it needs of a browser
==========================

**Chrome and Edge 129, Safari 17.5, Firefox 130**: browsers from autumn 2024
and newer. The floor is not a policy. It is the cost of the features below,
and each of them carries weight:

.. list-table::
   :header-rows: 1

   * - Feature
     - What depends on it
   * - ``light-dark()``
     - every colour token. Both modes are one declaration, which is why they
       cannot drift; see :doc:`/design-system/colours`
   * - the ``lh`` unit
     - a glyph centred on the line beside it, at whatever line height that
       line has
   * - ``<details name>``
     - a set of answers where one open closes the last, done by the platform
   * - ``:dir()``
     - the glyphs that mean *onward*, turned where the text runs the other
       way

.. warning::

   Below the floor a page does not degrade. It renders **unstyled**. An
   unsupported ``light-dark()`` makes every colour token invalid at once, so
   the page loses its palette, not a feature. A project that must serve older
   browsers must say so before it adopts the system.

The JavaScript targets ``es2022``, a lower bar than the CSS, and never the
thing that decides. Nothing here uses a shadow root, a container query or
``@layer``.

One contract across the layers
==============================

**Tokens** hold the decisions. Every colour, size, space, radius and
duration has a semantic name, and light and dark sit in one declaration.

**Classes** are the vocabulary. ``sds-`` names what a thing *is*,
``.sds-card``, ``.sds-note--warn``, ``.sds-table--compact``, and gives
server-rendered markup the whole visual system without JavaScript.

**Elements** add behaviour. Every one renders **light DOM** and emits exactly
the classes above. So an element upgrades the markup that was already there
instead of a second contract. There is no shadow root anywhere in this
system: ``sds-`` is it.

The classes came first, because the product that proved the system renders
HTML in PHP without a component runtime. Light DOM lets an element emit the
same class vocabulary a server writes. So ``components.css`` stays the source
of the pixels, and JavaScript adds behaviour, not a second visual
implementation.

.. code-block:: html

   <!-- The same pixels, from either column. -->
   <sds-badge tone="ok" label="passed"></sds-badge>
   <span class="sds-badge sds-badge--ok">passed</span>

Use the element where there is state, behaviour or a decision the markup has
to repeat. Use the class where a server already knows the answer and nothing
on the page changes it.

The namespace states ownership
==============================

``sds-`` is the system's own prefix. ``t3-`` implies an official TYPO3
surface, which this community system is not. A block starts with the prefix,
a private part appends a double underscore, a modifier appends a double
hyphen, and transient state uses ``.is-*``.

The prefix also keeps common names, ``card``, ``button``, ``badge``, out of
collision with application styles. It gives the gate the boundary a reader
sees: an ``sds-`` name belongs to the system, a screen's layout classes
belong to that screen.

Only the system declares names in that namespace. If a consumer needs an
``sds-`` component or modifier that does not exist, the gap closes here. Then
the element, the class layer, the specimen and the documentation agree on it.
A local invention has no render, no test, and a different spelling at the
next consumer.

.. important::

   **Web components first.** ``<sds-code code-lang="bash">``, never a ``div``
   with the classes on it. The classes are the fallback for a surface with no
   JavaScript, not the front door. A page that writes an element's own
   ``sds-x__y`` names holds a copy of something only the system changes.

Where to read on
================

.. list-table::
   :header-rows: 1

   * - Page
     - What it answers
   * - :doc:`layout`
     - the page itself: bar, rail, column, bands, footer, and where the
       layout sheds as the window narrows
   * - :doc:`stylesheets`
     - how to write a stylesheet: the layers, the flow contract, the property
       sets, and what nesting can do
   * - :doc:`components/index`
     - every element: what it is for, what it takes, what goes between its
       tags, and the classes it emits
   * - :doc:`documents`
     - the second stylesheet, for prose a renderer produced

Non-negotiable
==============

.. warning::

   **Never a colour literal.** Not a hex, not an ``rgb()``, not a named
   colour. If nothing fits, the answer is a new token, not a local value.

.. warning::

   **One accent, three places.** ``--accent`` appears on the active
   navigation item, on a shell prompt and on the wordmark's pipe. A fourth
   use makes the first three mean nothing.

.. seealso::

   ``SKILL.md`` carries the operating rules into the design bundle. This
   section is the interface and the reason for its constraints.
   :doc:`/design-system/index` does the same for visual decisions, with the
   rendered evidence beside them.
