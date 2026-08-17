:navigation-title: Design with Claude

==================
Design with Claude
==================

Claude at claude.ai/design designs from an uploaded system: a stylesheet, the
tokens, the written rules, and rendered cards it can inspect. This repository
builds that upload.

Import it once into a design system of your own, then design against it. Not
maintainer-only: the design system in the app is yours, and ``make design-sync``
is an ordinary task.

What you need
=============

- **Docker and Make.** Every command here runs in the repository's container.
- **Claude Code**, with the ``/design-sync`` skill and logged in to claude.ai
  (``/login``). The first call into the app asks to add design access to that
  login — see `uploading it <#upload-it>`__.
- **An account that can open claude.ai/design.** Open it in a browser with the
  same account: design access is granted to the account, not by any command.

The first import
================

.. steps::

   .. step:: Get the repository

      .. code-block:: bash

         git clone https://github.com/TYPO3/soul-design-system.git
         cd soul-design-system

      Every command below runs from there.

   .. step:: Build the upload

      .. code-block:: bash

         make design-sync

      It builds the bundle, runs the gate, says what would change, and writes
      ``.design-sync/.cache/upload-plan.json``. On a first run it reports no
      project id and no deletes — expected, since nothing is uploaded yet.

      .. warning::

         A red gate stops it, and nothing is uploaded. Every fault it names is
         invisible in review and wrong in every design afterwards: an undefined
         class silently does nothing, a broken reference ships an unstyled card,
         an oversized card is cropped in the pane.

   .. step:: Upload it
      :name: upload-it

      In Claude Code, in this checkout:

      .. code-block:: text

         /design-sync

      It executes the plan in the order the plan names. With no design system of
      your own yet, it creates one and reports its id.

      **Claude Code asks before it reaches the app.** The first design call
      requests a scope expansion — ``user:design:write``, added to your claude.ai
      login and kept there — so it is approved once. After that only the acts
      themselves ask: creating a design system, and locking the plan, which is
      the prompt that shows the exact writes and deletes before any of them
      happen.

      Approving it can still end in *design scopes not granted*, and the same
      line says what happened: a token refresh succeeded. A refresh returns the
      scopes the token already had, so it can never add one — a fresh login can.
      Log out, log in, and read the consent screen: it either offers design
      access or it does not. If it does not, the account has none, and no command
      in Claude Code grants it — open claude.ai/design in a browser with that
      account to see where you stand.

      .. note::

         No ``/design-sync`` in your Claude Code? Ask the agent to execute
         ``.design-sync/.cache/upload-plan.json`` step by step — the file is the
         whole instruction, order included.

   .. step:: Remember where it landed
      :name: remember-where-it-landed

      The app addresses an uploaded system by a project id. Write it down, or the
      next sync imports a second copy instead of updating this one.

      Paste this into Claude Code, in this checkout:

      .. code-block:: text

         Run `make design-project` here. If it already names a design system, stop and
         tell me. Otherwise list my claude.ai design systems with their project ids and,
         if exactly one is mine, run `make design-project ARGS=<its id>`.

      That writes the id into ``.design-sync/config.local.json``, which is
      untracked. By hand it is the same command with the uuid the upload
      reported:

      .. code-block:: bash

         make design-project ARGS=0189a4c1-6f2e-4b7a-9c31-2d8f5e0a7b64

      An id this clone already has is never replaced silently — the task refuses,
      and ``ARGS="<uuid> --force"`` is how you mean it. With nothing after it,
      ``make design-project`` says what a sync would use and where it read that
      from.

   .. step:: Record what the app holds

      .. code-block:: bash

         make design-synced

      Without it, ``make design-status`` and ``make design-plan`` keep answering
      from the previous upload.

   .. step:: Open it in the app

      Open the design system at claude.ai/design. The cards appear on that first
      open: the upload writes files, and the app compiles its card index when it
      next finds the sentinel. Until then the honest state is *files current,
      pane refreshes on next open*.

      The Design System pane then lists the cards under their groups, and the
      Starting Points picker offers the screens.

Designing with it
=================

Everything the agent needs is there before your first sentence:

- ``README.md`` — the conventions, and every card with the path to its prompt
- ``guidelines/build-rules.md`` — ``SKILL.md``, the operating instruction
- each card's ``.prompt.md`` — its classes and its markup, as a block to copy
- ``screens/`` — finished pages, offered as Starting Points

How to ask for a surface
------------------------

**Name the surface and its job, not its markup.** "A get-started page for an
extension: what it does, how it installs, the first command." The layout is
already decided — :doc:`screens` says which shape answers which job.

**Start from a Starting Point where one fits.** It settles the shell, header,
measure and footer in one move.

**Name a component by its element.** ``<sds-code code-lang="bash">``, not a
``div`` with classes on it.

**Ask for a gap to be named rather than filled.** "If the system has no answer
for this, say so instead of writing CSS." A gap is closed here, in the
component; CSS invented in a design is the one part of the output that cannot
travel.

Reading what comes back
-----------------------

.. list-table::
   :header-rows: 1

   * - Check
     - Why
   * - It links ``styles.css`` and writes no CSS of its own
     - That stylesheet is the whole contract: tokens, then the class layer.
   * - Every class is one the system defines
     - An invented name silently does nothing, and an ``sds-x__y`` part belongs
       to the component that may rename it.
   * - No ``spec-*`` class anywhere
     - Those draw the specimen cards' chrome and stop at the card.
   * - One accent, no emoji
     - ``--accent`` marks three things; status is a colour and a glyph.
       :doc:`colours` carries the rest.
   * - It holds up in both modes
     - The tokens carry light and dark. Switch the mode and read it again.

Taking a design into your project
=================================

Markup plus one stylesheet, so it moves as it stands — install the package or
copy the drop-in: :doc:`../frontend/quickstart`, and
:doc:`../frontend/documents` for a page of prose.

A stylesheet of the design's own does not travel. If the design needed a
declaration the system has no name for, close that gap in the component here.

Keeping the uploaded system current
===================================

A token moved, a component grew: the same three stops, landing in the system the
id names.

.. steps::

   .. step:: Build, gate, and plan what would change

      .. code-block:: bash

         make design-sync

   .. step:: Push what moved

      .. code-block:: text

         /design-sync

      It reads what the app holds before it writes anything.

   .. step:: Record that the app now holds this build

      .. code-block:: bash

         make design-synced

Look at what moved between them. The gate checks mechanics, not judgement: when
``make design-status`` lists changed cards, run ``make baseline`` before the
change and ``make shots && make diff`` after.

.. note::

   On a fresh clone the plan lists no deletes and says so — the record of what
   the app holds is a local cache this clone has never written. The upload is
   unaffected, since the skill reads the app itself.

Which design system a sync lands in
-----------------------------------

``make design-project`` reads three places and reports which one answered, which
is the explanation for a sync that arrived somewhere unexpected.

.. confval:: SDS_DESIGN_PROJECT
   :type: environment variable
   :required: false

   The design system a sync updates, held as its project id, and the first
   source read — before ``.design-sync/config.local.json``, which
   ``make design-project ARGS=<uuid>`` writes, and before the committed
   ``config.json``, which carries none because a clone must not inherit somebody
   else's. An export outranks both files.

When it does not look right
===========================

.. list-table::
   :header-rows: 1

   * - What you see
     - What it is
   * - Every card renders in a system face with no icons
     - The generated fonts and icons are missing from the clone.
       ``make verify ARGS=assets`` names what to run.
   * - The import ran and the pane is empty
     - The files are up there and the card index was never compiled. Ask for
       ``DesignSync get_file _ds_needs_recompile``: a 404 is the answer — that
       write reports success and lands nothing when its type is not named, so
       nothing ever told the app to read the upload. Re-run the sentinel step of
       the plan, which carries the type, then reopen the design system.
   * - The pane still shows the previous upload
     - Same cause, one upload later: it recompiles on next open, and a stale
       pane means the sentinel did not land.
   * - A second design system appeared beside yours
     - No project id was set when that sync ran. Set it —
       `remember where it landed <#remember-where-it-landed>`__ — then delete
       the duplicate in the app.
   * - The plan reports no deletes
     - This clone has no cache of what the app holds — see the note above.
   * - ``make design-sync`` stops before the plan
     - The gate is red. Fix what it names and run it again.
   * - *DesignSync needs a claude.ai login* — after ``/login``
     - Read the rest of the line. *Refresh succeeded but design scopes not
       granted* means the token was renewed with the scopes it already had: log
       out and in so the consent screen is asked again. A consent screen without
       design access means the account has none — see
       `uploading it <#upload-it>`__.

What gets uploaded
==================

``make build`` writes ``.out/bundle/``. It is **flat** where the repo is not,
because that is the shape the pane expects:

.. code-block:: text

   .out/bundle/
     styles.css          the entry point a rendered design links
     _ds_bundle.css      the class layer
     _ds_bundle.js       the elements, bundled
     _specimen.css       the chrome the cards are drawn with
     tokens/             every value, one file per family
     fonts/  assets/     the faces, the icons, the marks
     components/<Group>/<Name>/
         <Name>.html         the card, rendered at a declared size
         <Name>.prompt.md    what it is, which classes it uses, its markup
     screens/            whole pages to start a design from
     guidelines/         the written rules, and why they exist

.. confval:: shape
   :type: string
   :default: "package"

   Set in ``.design-sync/config.json``. It pins the converter to this
   repository's own build rather than letting the sync kit detect a shape from
   the directory layout — which, with a Storybook config present, would guess
   wrong.

Why cards and not descriptions
==============================

Every component ships as a static HTML card rendered at a declared viewport,
generated from the story that documents it in Storybook.

.. warning::

   A card contains **no custom elements**. The pane opens these files with
   ``styles.css`` and no JavaScript at all, so what ships is the markup the
   element *produces*. A card carrying ``<sds-button>`` would render nothing.

Beside each card is a ``.prompt.md``: what the component is, which classes it
uses, and its markup as a block to copy. That is what the agent reads when it
places one.

What the gate checks
====================

.. code-block:: bash

   make verify

- every card declares a ``@dsCard`` header, and its declared size matches what
  it actually renders at
- every class used anywhere is defined in the stylesheets — no unknown names
- every local reference resolves, **inside the bundle** and not merely on the
  disk it was built on
- every card comes from a story, and no story is missing its card
- the committed drop-in still matches its sources

.. seealso::

   The written rules that travel with the upload are ``SKILL.md``. The published
   pages in this section keep each rule beside its reason and its rendered
   evidence.
