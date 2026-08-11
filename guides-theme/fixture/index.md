---
title: Every node this system must set
---

# Every node this system must set

Nobody reads this page. It exists so that every kind of node the renderer can
emit appears exactly once, rendered, where it can be looked at instead of
guessed at.

The source is Markdown, which decides how much of the document surface is
reachable at all: the Guides Markdown parser reads CommonMark plus tables and
front matter, and nothing else. Everything on this page is what a Markdown
document can say. What it cannot say is listed at the bottom, and that list is
longer than this page.

## Headings

The title above is the first level. This is the second.

### Third level

#### Fourth level

##### Fifth level

###### Sixth level

Six levels, because a documentation page eventually uses them, and the type
scale stops at three.

## Text

A paragraph with *emphasis*, **strong emphasis**, `an inline literal`, and a
[link to the renderer](https://docs.phpdoc.org/components/guides/guides/). A
second sentence, so the measure has something to hold: text is set at
sixty-six characters and everything wider than words runs to the column
instead.

A second paragraph, to prove the space between two of them is the space the
document layer sets rather than the browser's.

> A block quote is somebody else's sentences, stepped in and marked at the
> edge rather than set in italics.
>
> It can hold more than one paragraph.

---

The rule above is punctuation of the text, not a divider of the page — it
holds the same measure the paragraphs do.

## Lists

- A bullet
- A second bullet
  - Nested, one level in
  - And a second nested item
    - A third level, which is where a marker stops being obvious
- A third bullet

1. An enumerated item
2. A second one
   1. A nested number
   2. And another
3. A third

## Code

```php
<?php
namespace TYPO3\CMS\Core;

// The scope a question is answered in.
final class Version
{
    public function __construct(private readonly string $number) {}
}
```

```yaml
versions:
  - "13.4"   # LTS
  - "14.3"
domains: [labels, xlf]
```

```
A fenced block with no language. It sets in the same plane, uncoloured,
which is the honest answer when nobody said what it is.
```

An indented block, which is the other way to write one:

    vendor/bin/typo3 cache:flush

## Tables

| Layer    | What it is     | Where               |
|----------|----------------|---------------------|
| tokens   | the values     | `src/tokens/`       |
| classes  | the vocabulary | `src/styles/`       |
| elements | the behaviour  | `src/components/`   |

A table with a column wide enough to need the scroll the document layer gives
it, rather than pushing the page sideways:

| Command | What it does | When you reach for it |
|---|---|---|
| `make verify` | headers, classes, references, fit, cards, types, conventions | before calling anything done |
| `make test` | the Playwright suite, both modes, every story | the same moment |
| `make guides` | renders this fixture into `site/` | while the theme is being written |

## Pictures

![A placeholder](_images/placeholder.svg)

A picture in Markdown carries no caption of its own — the alternative text is
all there is, and a figure with a caption under it is one of the things this
source language cannot say.

## What Markdown cannot reach

Everything below exists in the renderer and has no Markdown spelling. It is
not missing from this fixture by oversight; it is unreachable from this source
language, and a theme still has to set all of it the moment a document is
written in reStructuredText instead.

- **Admonitions** — twelve kinds: note, tip, hint, important, caution,
  attention, warning, danger, error, seealso, the generic one with its own
  title, and the version-change trio.
- **`confval`** — the node a configuration reference is mostly made of.
- **Definition lists, field lists, option lists, glossaries.**
- **Footnotes and citations**, block and inline.
- **Tabs and configuration blocks** — the same content in two languages.
- **Code captions, line numbers and emphasised lines.**
- **Figures with captions**, and images with alignment or a scale.
- **Text roles** — `guilabel`, `kbd`, `file`, `command`, `abbr`, sub, sup.
- **Topics, rubrics, sidebars, containers, horizontal lists.**
- **A local table of contents** — "on this page".
- **Task lists.** `- [ ]` is GitHub's Markdown, not CommonMark, and the parser
  renders the brackets as the text they are.
