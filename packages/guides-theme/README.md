# Soul, as a theme for phpDocumentor Guides

Templates that render reStructuredText and Markdown into the Soul design
system's own vocabulary, the directives the renderer does not have, and the
drop-in a page links — stylesheet, script, faces and icons — inside the
package, because a stylesheet is not something Composer can be asked for
separately.

**This repository is generated.** The theme is written in the design system's
monorepo and pushed here whole on every release; a commit made here is
overwritten by the next one. Issues and pull requests belong in
[typo3-soul-design-system](https://github.com/benjaminkott/typo3-soul-design-system).

## Installing it

Not on Packagist yet, so name the repository. There is no tag either, so the
branch is what a project asks for — swap it for a constraint as soon as there
is a release to name:

```json
{
    "repositories": [
        {
            "type": "vcs",
            "url": "https://github.com/benjaminkott/typo3-soul-guides-theme"
        }
    ],
    "require": {
        "typo3/soul-guides-theme": "dev-main"
    },
    "minimum-stability": "dev",
    "prefer-stable": true
}
```

```sh
composer install
```

The package brings `phpdocumentor/guides-cli`, `guides-code` and
`guides-markdown` with it, so that one line is the command, the highlighter and
the Markdown parser — and the theme registers the last two itself, so
reStructuredText and Markdown both render out of the box and neither is named
in a project's configuration. PHP 8.2 is the floor.

## Rendering a site

```sh
vendor/bin/guides docs --output=site -c docs --fail-on-error
node vendor/typo3/soul-guides-theme/resources/dist/soul-finish.js site
```

The first command writes documents. The second is what turns them into a site:
it copies the drop-in to the site root, draws every element on every page ahead
of the browser so the pages read with no script, writes the search index the
bar fetches, and refuses to finish on a reference that leaves the output. It is
one bundled file and needs nothing installed.

`guides.xml` beside the documents selects the theme and registers it:

```xml
<guides xmlns="https://www.phpdoc.org/guides"
        input-format="rst" links_are_relative="true" theme="soul">
    <project title="Your project" version="1.0"/>
    <extension class="TYPO3\Soul\GuidesTheme\DependencyInjection\SoulExtension"/>
</guides>
```

The `<extension>` element is load-bearing: `theme="soul"` selects a theme that
has to exist first, and that element is what makes it exist. `input-format` is
`rst` or `md`, and picking one is all a project does about it.

## What an author can write

Everything below is registered by the extension, so a project that selected the
theme has it — nothing to add to `guides.xml`, no template to copy. Written in
reStructuredText here; the Markdown parser takes the same directives.

Every option is spelt the way the element it draws spells it, so `href` links
and `src` takes a file here as everywhere else in the system, and a card read
in Storybook is written without a lookup. An option a directive does not know
is not an error and is not dropped either where it is `:class:` — that lands on
the element, because an author who wrote it meant it for their own stylesheet.

| Written | What it is |
| --- | --- |
| `:layout: marketing` | A document field rather than a directive, at the top beside `:navigation-title:`. Renders the page as a run of full-bleed bands with no rail; any other value, and any page that writes none, is the manual shape |
| `.. hero:: <image>` | The opening copy of a landing page beside one decorative image. Goes right after the document title, which stays the page's heading. `:alt:` |
| `.. band:: [heading]` | A full-bleed section. It *opens* a section rather than wrapping one — what follows belongs to it until the next band. `:quiet:` is the second ground, `:id:` an anchor |
| `.. grid:: [width]` | A set read side by side, reflowing by its own minimum width — no column count. The argument is `default`, `wide`, `dense` or `flush`, said as what the items hold; `:variant:` says it as an option. `:class:` |
| `.. card-grid::` | The same set in the spelling a TYPO3 manual uses, so a documentation set written for the Bootstrap theme renders unchanged. `:columns:`, `:columns-sm:`, `:columns-md:`, `:columns-lg:` are read as one question and answered with a minimum width; `:gap: 0` is the wall, every other `:gap:` and `:card-height:` are accepted and dropped. `:class:` |
| `.. card:: <title>` | One card, whose title carries where it goes — a `:ref:`, a `:doc:` or a link — and the whole frame becomes that one link. `:href:` says the target as a path instead, `:label:`, `:tag:`, `:icon:`, `:src:`, `:alt:`, `:footer:`, `:action:`, `:class:` |
| `.. stat:: <figure>` | One number stated as a fact. The body is the line that bounds it and is not optional in practice — a figure with no bound is a boast. `:unit:`, `:label:`, `:of:` (the whole it is a part of, drawn as a share), `:icon:`, `:class:` |
| `.. surface:: <title>` | One filled plane stating something in place, and one of a set: it goes in a `grid` the way `stat` does. It states rather than goes somewhere, which is the line between it and `card`, and it is not what `topic` is — a digression in the reading flow stays an `<aside>`. `:plane:` (`raised`, `sunken` for machine output), `:label:` the tracked-out line over the title, `:icon:` a glyph above it, `:class:` |
| `.. quote:: <who>` | A sentence borrowed from somewhere, with where it came from. The attribution is the argument because the element requires one, and the sentence goes between the tags — out of a document it carries links. A block quote is not the spelling: the parser resolves one into a definition list, so `<blockquote>` never reaches a template. `:as:` what they are to the subject, `:meta:` when, `:initials:` the monogram and it is drawn only where they are given, `:href:` where it can be read in full, `:class:` |
| `.. button:: <label>` | One press. The label carries where it goes — a `:ref:`, a `:doc:` or a link — and given a target the control is drawn as a link, with the middle click and the status line a browser already has. `:href:` says the target as a path instead, `:variant:` (`primary`, `secondary`, `ghost`), `:size:` (`sm`), `:icon:` a glyph before the label, `:icon-only:` makes the glyph the whole control and the label its name, `:title:`, `:rel:`, `:disabled:`, `:class:`; `type`, `for` and `command` are not offered — a document has no form to submit and no element to command |
| `.. button-bar::` | The presses of a page on one line, centred against each other so a link beside a button sits right. Named the way `card-grid` is, and layout rather than a component, so it has no variant. `:class:` |
| `.. accordion::` | A set of questions with their answers folded behind them, exclusive unless `:multiple:`. `:name:` is the group, and two sets on a page need different ones; a set that writes none is given one. `:class:` |
| `.. accordion-item:: <question>` | One question, and the blocks folded behind it. `:open:` stands it open (`:show:` is the Bootstrap theme's name for the same flag), `:class:`; `:header-level:` and `:name:` are accepted and dropped |
| `.. specimen:: <card>` | A rendered card of the project's own, embedded in a frame at the size it was measured at. The argument is a path under `_cards/` in the documentation source. `:viewport:` (`700x260`), `:title:` |

A landing page, and the manual page beside it:

```rst
:layout: marketing

======================
Design and ship as one
======================

.. hero:: /_images/workbench.png

   The opening summary belongs inside the directive.

.. band:: What it costs
   :quiet:
   :id: pricing

.. grid:: dense

   .. stat:: 240
      :unit: ms
      :label: median answer

      Measured over the last release, on a warm index.

.. button-bar::

   .. button:: :doc:`installation`
      :icon: actions-download

   .. button:: The renderer
      :href: https://docs.phpdoc.org/components/guides/guides/
      :variant: secondary
      :rel: external
```

```rst
.. card-grid::
   :columns: 1
   :columns-md: 2

   .. card:: :doc:`installation`
      :label: Chapter 01
      :icon: actions-book
      :action: Read it

      What the package needs, and the commands that render a project with it.

.. accordion::
   :name: running-it

   .. accordion-item:: What does it need installed?
      :open:

      PHP 8.2 or newer, and a project it can read.
```

The element is the front door: each of these renders `sds-card`, `sds-grid`,
`sds-stat` itself rather than a `div` wearing its classes, and the templates
write none of that markup. `soul-finish.js` draws every element before the page
is published, so a reader with no JavaScript gets the whole of it.

## What is in the package

| Path | |
| --- | --- |
| `src/` | the extension, the directives and their nodes, the Twig extension |
| `resources/config/` | the container configuration that registers all of it |
| `resources/template/` | the overrides, by the paths the renderer looks them up under |
| `resources/dist/` | the drop-in: `soul.css`, `document.css`, `soul.js`, `soul-boot.js`, the faces, the icon sprites — and `soul-finish.js` |

## The manual

[The theme's own manual](https://benjaminkott.github.io/typo3-soul-design-system/guides-theme/index.html)
is rendered with it: installation, every setting in `guides.xml`, every
directive above with a rendered example, and what each node the renderer emits
comes out as. The page *A project to copy* prints the settings file and the
workflow a project needs, whole.

## Licence

MIT. The icons and the faces it ships carry their own — see
`THIRD-PARTY.md` in the monorepo.
