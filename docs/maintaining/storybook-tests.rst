:navigation-title: Storybook tests

=================
Testing Storybook
=================

Storybook is both a component renderer and a documentation application. A
test that opens a story iframe proves the rendered component. It does not
prove that the sidebar, the toolbar or the documentation chrome around it
can boot. So the suite exercises both browser surfaces from the same build a
reader opens.

Test the shipped build
======================

``@storybook/addon-a11y`` stays in the Storybook served to Playwright. An
addon out only for tests assembles a second surface and leaves the
published one without a test. Configuration controls when the addon runs.
Build configuration does not hide it.

The same principle applies to the manager. ``tests/manager.spec.ts`` opens
the Storybook root, not ``/iframe.html``, waits for the explorer tree,
checks the Soul title and fails on page or console errors. It also chooses
a viewport through the toolbar and checks that the preview responds. A
preview test cannot stand in for any of these, because the iframe does not
load the manager bundle.

Run axe on purpose
==================

axe permits one run at a time on a page. It rejects a second caller, and
does not queue it, so the addon and Playwright must not start an analysis
together. ``.storybook/preview.ts`` sets ``a11y.manual`` under
``initialGlobals``. It is a Storybook global, not a value under
``parameters.a11y``. The panel stays available on demand, and a story
render starts no automatic axe run.

The Playwright helpers wait for an in-flight run to finish, and each loaded
story gets one deliberate ``analyze()`` call. Keep that sequence in a new
accessibility sweep. Parallelism belongs between pages, not between axe
calls on the same page.

Use a complete theme
====================

``create()`` from ``storybook/theming/create`` makes the Storybook manager
theme. Storybook expects that complete theme. A partial object can omit
colours the manager uses and crash it before it can draw an error surface.
Customise the fields you pass to ``create()``. Do not replace its result
with a hand-written object.
