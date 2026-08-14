:navigation-title: Storybook tests

=================
Testing Storybook
=================

Storybook is both a component renderer and a documentation application. Tests
that open a story iframe prove the rendered component; they do not prove that
the sidebar, toolbar or documentation chrome around it can boot. The suite
therefore exercises both browser surfaces from the same build a reader opens.

Test the shipped build
======================

``@storybook/addon-a11y`` remains installed in the Storybook served to
Playwright. Removing an addon only for tests would assemble a second surface
and leave the published one untested. Configuration controls when the addon
runs; build configuration does not hide it.

The same principle applies to the manager. ``tests/manager.spec.ts`` opens the
Storybook root rather than ``/iframe.html``, waits for the explorer tree,
checks the Soul title and fails on page or console errors. It also chooses a
viewport through the toolbar and verifies that the preview responds. A preview
test cannot substitute for any of these assertions because the manager bundle
is not loaded inside the iframe.

Run axe deliberately
====================

axe exposes one run at a time on a page. A second caller is rejected rather
than queued, so the addon and Playwright must not start analysis together.
``.storybook/preview.ts`` sets ``a11y.manual`` under ``initialGlobals``: it is
a Storybook global, not a value under ``parameters.a11y``. The panel remains
available on demand while story rendering starts no automatic axe run.

The Playwright helpers wait for an in-flight run to finish, and each loaded
story receives one deliberate ``analyze()`` call. Keep that sequencing when a
new accessibility sweep is added; parallelism belongs between pages, not
between axe calls on the same page.

Use a complete theme
====================

The Storybook manager theme is created with ``create()`` from
``storybook/theming/create``. Storybook expects the resulting complete theme;
a partial object can omit colours used internally and crash the manager before
it can draw an error surface. Customise the fields passed to ``create()``
rather than replacing its result with a hand-written object.
