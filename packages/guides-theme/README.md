# Soul, as a theme for phpDocumentor Guides

Templates that render reStructuredText and Markdown into the Soul design
system's own vocabulary, and the directives the renderer lacks. The
drop-in a page links, stylesheet, script, faces and icons, is inside the
package, because Composer cannot fetch a stylesheet on its own.

**This repository is a task's output.** The theme's source is in the design
system's monorepo, and every release pushes it here whole. The next release
overwrites a commit made here. Issues and pull requests belong in
[soul-design-system](https://github.com/TYPO3/soul-design-system).

## Install it

```sh
composer require typo3/soul-guides-theme
```

The package brings `phpdocumentor/guides-cli`, `guides-code` and
`guides-markdown` with it. So that one line is the command, the highlighter
and the Markdown parser. The theme registers the last two itself, so
reStructuredText and Markdown both render out of the box, and a project's
configuration names neither. PHP 8.2 is the floor.

## Render a site

```sh
vendor/bin/guides docs --output=site -c docs --fail-on-error
node vendor/typo3/soul-guides-theme/resources/dist/soul-finish.js site
```

The first command writes documents. The second turns them into a site. It
copies the drop-in to the site root and draws every element on every page
before the browser, so the pages read with no script. It writes the search
index the bar fetches, and refuses to finish on a reference that leaves the
output. It is one bundled file and needs nothing installed.

`guides.xml` beside the documents selects the theme and registers it:

```xml
<guides xmlns="https://www.phpdoc.org/guides"
        input-format="rst" links_are_relative="true" theme="soul">
    <project title="Your project" version="1.0"/>
    <extension class="TYPO3\Soul\GuidesTheme\DependencyInjection\SoulExtension"/>
</guides>
```

The `<extension>` element carries the weight. `theme="soul"` selects a
theme that has to exist first, and that element makes it exist.
`input-format` is `rst` or `md`, and that choice is all a project does
about it.

## What a project can set

Everything below goes inside that `<extension>` element, and every one of
them is optional. A theme with nothing set renders a site that says the
project's own title.

| Setting | |
| --- | --- |
| `<signet>` | A path to the mark in the bar, relative to the documentation root, where the renderer can read it. The render copies it into the output with the documents |
| `<favicon href sizes>` | The mark in the tab, one element per file. A mark at three optical sizes is three files, and the browser picks by `sizes`. With none, the signet is the tab icon |
| `<product>` | The name in the bar where it is not the project's own title. A manual for one product inside a larger project |
| `<brand>` | Whose product it is, as the first half of a lockup with the accent rule between the two |
| `<home>` | What the bar links back to, where that is not the project's index |
| `<pager>` | `true` puts the pages either side of this one at the end of the column, in the toctree's flat order. Off by default. In a reference nobody reads front to back, that path is a row of noise |
| `<markdown>` | `false` stops the Markdown twin. On by default; see below |
| `<navigation><link href label external/></navigation>` | The few places the bar carries. With none, it is the top level of the toctree. A `label` is only for a link the tree has no page for |
| `<footer><group title><link href label external/></group></footer>` | A column of the footer that points somewhere the tree does not. The other columns are the toctree itself and take no configuration |
| `<footer><social href label/></footer>` | An account somewhere else. There is no glyph to set. The URL names the service, and the mark comes out of it |
| `<footer><note>` | The line that says what this site is |

## The twin

The renderer writes every document twice. `page.md` lands beside
`page.html`, and each page names its own in the head.

```html
<link rel="alternate" type="text/markdown" href="stylesheets.md" />
<link rel="canonical" href="stylesheets.html" />
```

It is a second **output format**, not a conversion of the page. Both come
from the same parsed document, node by node. So a directive says what it is
in Markdown the same way it says what it is in HTML. A format's name is the
file extension every reference inside it resolves to. That makes the twin a
site of its own. A link in one twin lands on the next, and nothing that
follows those links gets a page.

It is GitHub Flavoured Markdown, so a table is a table, a block carries its
language, and an admonition arrives as `> [!WARNING]`.

What the page carries in its head, the twin opens with as front matter.
`title`, `description` and `canonical`, the page this file is the twin of,
so the pair points both ways. And every field the author wrote above the
title under its own name: `:author:`, `:date:`, `:copyright:`,
`:navigation-title:`, the keys of `.. meta::`. The description is the
author's `:abstract:` or `meta` description where there is one, and the
first sentence of the page where there is not. A field that speaks only to
the renderer, like `:orphan:`, lands nowhere.

`llms.txt` lands at the publish root with them. The toctree as a list of
those twins, a heading per section and a line per page with the same
description its twin opens with. It is the way in for a reader with no
navigation.

The reader all of it is for is a program: an agent on a link, a model
asked to read the manual. `<markdown>false</markdown>` turns it off.

## What an author can write

The extension registers everything below, so a project with the theme has
it. Nothing to add to `guides.xml`, no template to copy. The examples are
reStructuredText. The Markdown parser takes the same directives.

Every option has the spelling of the element it draws. So `href` links and
`src` takes a file here as everywhere else in the system, and a card read
in Storybook needs no lookup. An option a directive does not know is not an
error. `:class:` lands on the element, because an author who wrote it meant
it for their own stylesheet.

A heading and everything under it is a **section**, and the theme draws
that box itself as `<section class="sds-section">`, not the renderer's
`<div class="section">`. Nothing gets one on request: a heading is one.
It carries the distance between two sections. The step is the section's,
sized by the level of the heading the next one opens. The last block inside
a section owes its edge nothing. A `:class:` on a section goes
through.

| Written | What it is |
| --- | --- |
| `:layout: marketing` | A document field, not a directive, at the top beside `:navigation-title:`. It renders the page as a run of full-bleed bands with no rail. Any other value, and a page with none, is the manual shape |
| `.. hero:: <image>` | The opening copy of a landing page beside one decorative image. Right after the document title, which stays the page's heading. `:alt:` |
| `.. band:: [heading]` | A full-bleed section. It *opens* a section and does not wrap one. What follows belongs to it until the next band. `:quiet:` is the second ground, `:id:` an anchor |
| `.. grid:: [width]` | A set read side by side, reflowed by its own minimum width, with no column count. The argument is `default`, `wide`, `dense` or `flush`, as what the items hold. `:variant:` says it as an option. `:class:` |
| `.. split::` | Two of anything, side by side until there is no room for two. Every block in it is a column. `:align:` is where the shorter half stands against the taller one: `start`, `center`, `end`. `:leads:` is which half comes first once they stack: `start`, `end`. `:class:` |
| `.. half:: [heading]` | One side of a split: the run of blocks that stands as one column. A heading, its paragraph and a press are three columns without it. The optional heading becomes an `h2` inside the column. It takes no position of its own; the split decides. `:class:` |
| `.. card:: <title>` | One card, whose title carries where it goes: a `:ref:`, a `:doc:` or a link. The whole frame becomes that one link. `:href:` says the target as a path instead. `:label:`, `:tag:`, `:icon:`, `:src:`, `:alt:`, `:footer:`, `:action:`, `:class:` |
| `.. stat:: <figure>` | One number as a fact. The body is the line that bounds it, and in practice it is mandatory. A figure with no bound is a boast. `:unit:`, `:label:`, `:of:` for the whole it is a part of, `:icon:`, `:class:` |
| `.. swatch:: <value>` | One colour of a palette: the chip, the name and the resolved value. The argument paints the chip, and a value that is not a colour drops out. No body. A colour that needs a paragraph carries a rule, and that is prose beside the palette. `:name:` is the name, `:resolved:` the resolved value in full. `:kind:` is `fill` or `line`, a hairline as its own edge. `:class:` |
| `.. surface:: <title>` | One filled plane with a statement in place, and one of a set. It goes in a `grid` the way `stat` does. It states and does not go somewhere, which is the line between it and `card`. It is not `topic`: a digression in the reading flow stays an `<aside>`. `:plane:` is `raised`, or `sunken` for machine output. `:label:` is the tracked-out line over the title, `:icon:` a glyph above it. `:class:` |
| `.. quote:: <who>` | A sentence from somewhere else, with its source. The attribution is the argument because the element demands one. The sentence goes between the tags, because out of a document it carries links. A block quote is not the spelling. The parser turns one into a definition list, so `<blockquote>` never reaches a template. `:as:` is what they are to the subject, `:meta:` when. `:initials:` is the monogram, drawn only with these given. `:href:` is where to read it in full. `:class:` |
| `.. button:: <label>` | One press. The label carries where it goes: a `:ref:`, a `:doc:` or a link. With a target, the control is a link, with the browser's middle click and status line. `:href:` says the target as a path instead. `:variant:` is `primary`, `secondary` or `ghost`. `:size:` is `md`, `sm` or `lg`; `lg` is the one action a page is for. `:icon:` is a glyph before the label. `:icon-only:` makes the glyph the whole control and the label its name. `:title:`, `:rel:`, `:disabled:`, `:class:`. `type`, `for` and `command` are not on offer. A document has no form to submit and no element to command |
| `.. button-bar::` | The presses of a page on one line, centred against each other, so a link beside a button sits right. Named for what it holds. Layout, not a component, so it has no variant. `:class:` |
| `.. directory-tree::` | A directory in the shape it has on disk, from a nested list. The name is the first literal in an item, and the rest of the line is what it is for. `:level:` is how deep it stands **open**. Nothing drops below it, unlike the theme this spelling comes from. `:show-file-icons:` marks a directory and a file as such. `:class:` |
| `.. accordion::` | A set of questions with their answers folded behind them, exclusive unless `:multiple:`. `:group:` is the group the answers fold in. Two sets on a page need different ones, and a set with none gets one. `:class:` |
| `.. accordion-item:: <question>` | One question, and the blocks folded behind it. `:open:` stands it open; `:show:` is the Bootstrap theme's name for the same flag. `:name:` is the address of this one answer, and it lands on the answer. The platform opens a fold a fragment points into, and leaves one shut that it points at. `:class:`. `:header-level:` goes in and drops out |
| `.. facts::` | A block of facts, scanned down the terms. The body is a field list: the field's name is the term, its body the value. `:class:` |
| `.. steps::` | An instruction read from the top, numbered down one rail, for work with an order. Things to do in any order are a bullet list. The number is the set's own count. A stop in the middle renumbers the rest, and no page states a figure. Nothing says how far along a reader is, because a rendered page does not know. `:class:` |
| `.. step:: <title>` | One stop, and the blocks that do it. A command, a file to edit, the output that says it worked, which no attribute carries. `:optional:` marks a stop a reader can skip, with the disc unfilled and the word beside the title. `:name:` is its address, and it lands on the stop itself, with nothing to open first. `:class:`. The title takes no heading level. The number says where a reader is in an instruction |
| `.. figure::`, `.. image::` | Not the theme's directives but the core's, drawn differently. Both become `sds-figure`. So a picture has a frame, and a ground under one that does not fill its column. Its caption stands in a caption's register. The theme adds one option. `:zoomable:` makes the frame a press that opens the picture at full size. It is a choice, and the theme ignores it under a `:target:`, whose link already wraps the whole picture. `:target:` and `:class:` go through. `:align:` and `:title:` drop |
| `.. configuration-block::` | Not the theme's directive but the core's, drawn differently. The same setting in several languages, one tab per block, with the block's language as the label. It becomes `sds-tabs` exactly as `.. tabs::` does, and carries `sync`. So every configuration block of a page follows one choice, and the choice outlives the page |
| `.. code-block:: diff` | Not the theme's directive but the core's, drawn differently. A block whose language is `diff` becomes `sds-diff` instead of `sds-code`. The same frame and head, and rows with status colour. The server colours them, so a page needs no script. `:caption:` names the file. The format's `+++` and `---` headers stay context. `:linenos:` and `:emphasize-lines:` do not apply |
| `.. example:: [caption]` | A piece of markup and, under it, that markup rendered. The print is the lines the parser got, and the render comes from those same lines. So what a reader copies is what produced the thing below it. The argument is the caption over the block. `:language:` colours the print; `text` by default, since no highlighter here knows reStructuredText. `:class:` lands on the frame the render stands in, `.sds-example`. Its dashed, unfilled line says the box is not part of the page. Not for `band`, `hero` or `:layout:`. Those are the shape of a page, and a band inside anything stops at its parent's width |
| `.. specimen:: <card>` | A rendered card of the project's own, in a frame at the size of its measurement. The argument is a path under `_cards/` in the documentation source. `:viewport:` (`700x260`), `:title:` |
| `.. code-block:: typoscript` | Not the theme's directive but the core's, with a language the highlighter lacks. `guides-code` colours a block with a PHP port of highlight.js, which has no TypoScript grammar. So the theme registers one, and a TypoScript block gets its colour on the server like any other. The object path, the object type, the value, a `{$constant}`, a `[condition]`, an `@import` and a comment. It is the same grammar the design system's own element uses in the browser. So the colour does not change when a script runs |

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
.. grid:: wide

   .. card:: :doc:`installation`
      :label: Chapter 01
      :icon: actions-book
      :action: Read it

      What the package needs, and the commands that render a project with it.

.. accordion::
   :group: running-it

   .. accordion-item:: What does it need installed?
      :open:

      PHP 8.2 or newer, and a project it can read.
```

The element is the front door. Each of these renders `sds-card`,
`sds-grid`, `sds-stat` itself, not a `div` with its classes, and the
templates write none of that markup. `soul-finish.js` draws every element
before the publish, so a reader with no JavaScript gets the whole of it.

## What is in the package

| Path | |
| --- | --- |
| `src/` | the extension, the directives and their nodes, the Twig extension |
| `resources/config/` | the container configuration that registers all of it |
| `resources/template/` | the overrides, by the paths the renderer looks them up under. `*.html.twig` for the page and `*.md.twig` for the twin, beside each other |
| `resources/template/markdown.php` | which template each node uses in the Markdown format |
| `resources/highlight/` | the grammars the highlighter lacks, as the JSON it loads a language from. A task's output, and `Grammars` registers them |
| `resources/dist/` | the drop-in: `soul.css`, `soul.js`, `soul-boot.js`, the faces, the icon sprites, and `soul-finish.js` |

## The manual

[The theme's own manual](https://typo3.github.io/soul-design-system/guides-theme/index.html)
renders with it. Installation, every setting in `guides.xml`, every
directive above with a rendered example, and what each node the renderer
emits comes out as. The page *A project to copy* prints the settings file
and the workflow a project needs, whole.

## Licence

MIT. The icons and the faces it ships carry their own; see
`THIRD-PARTY.md` in the monorepo.
