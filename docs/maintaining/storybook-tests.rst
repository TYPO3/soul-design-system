:navigation-title: Storybook tests

=================
Testing Storybook
=================

Storybook is both a component renderer and a documentation application. A
story is a rendered component, and every story is a test. The sidebar, the
toolbar and the documentation chrome around it are a second surface, and a
story proves nothing about them. So the suite has two runners, and each
opens what the other cannot.

Every story is a test
=====================

``@storybook/addon-vitest`` turns each story into a Vitest test, and the
same run starts from the Storybook sidebar. One project, because the
addon starts one and names it after the config directory. A story renders
once and the verdict runs in both themes. The switch sets ``data-theme``
on ``<html>`` and nothing else, so no second mount is necessary. A colour
that fails in one theme names it.

No Storybook build stands in front of the run. Vitest serves the sources
through Vite, in one Chromium, a frame per file.

What a story owes is in ``.storybook/preview.ts`` and
``.storybook/vitest.setup.ts``. It renders something, and prints no
warning and no error. A Specimen story is static markup drawn from the
system. And axe finds no serious or critical violation in it.

The ``.test.ts`` files under ``tests/`` mount a story, or write markup into
the frame. Then they ask what no story can answer on its own. What a press
does, what a form sends, where a mark stands after a scroll.

Test the shipped build
======================

The specs under ``tests/`` that Playwright runs open a server: the built
Storybook, the rendered site, the drop-in a consumer copies.
``tests/manager.spec.ts`` opens the Storybook root, not ``/iframe.html``,
waits for the explorer tree, checks the Soul title and fails on page or
console errors. It also chooses a viewport through the toolbar and checks
that the preview responds. It reads the index for every component's page,
and changes a control on the canvas and on the docs page. A story test
cannot stand in for any of these, because it never loads the manager bundle.

``@storybook/addon-a11y`` stays in the build. An addon out only for tests
assembles a second surface and leaves the published one without a test.

Judge with axe on purpose
=========================

The addon reports every violation in the panel and fails on none of them.
The suite holds a story to a line the addon has not: only a serious or
critical violation fails it. The specimens draw states no automated pass
can interpret, and a fail on ``minor`` trains everyone to ignore the run.
So under Vitest ``.storybook/preview.ts`` runs axe itself
in ``afterEach``, and turns the addon's run off with ``parameters.a11y``.
The specimen's own annotation layer, the ``.spec-*`` classes, stays out of
the context: it never ships to a product.

Coverage measures the frames, and the floor in ``vitest.config.ts`` holds
it. What only Node runs — the static renderer, the boot line — stays out
of the measure; ``ssr``, ``parity`` and the drop-in's spec hold those.

The build keeps ``light-dark()`` whole. Lowered for older browsers, every
token resolves at the root, and a mode forced on a subtree forces nothing.
The suite reads the sources, so a build that lowered them proved less than
the run did. ``.storybook/main.ts`` sets the target.

Use a complete theme
====================

``create()`` from ``storybook/theming/create`` makes the Storybook manager
theme. Storybook expects that complete theme. A partial object can omit
colours the manager uses and crash it before it can draw an error surface.
Customise the fields you pass to ``create()``. Do not replace its result
with a hand-written object.
