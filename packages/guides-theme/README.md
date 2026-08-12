# Soul, as a theme for phpDocumentor Guides

Templates that render reStructuredText and Markdown into the Soul design
system's own vocabulary, four directives the renderer does not have, and the
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
the Markdown parser. PHP 8.2 is the floor.

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
    <extension class="phpDocumentor\Guides\Code\DependencyInjection\CodeExtension"/>
    <extension class="TYPO3\Soul\GuidesTheme\DependencyInjection\SoulExtension"/>
</guides>
```

Both `<extension>` elements are load-bearing: `theme="soul"` selects a theme
that has to exist first, and the second element is what makes it exist.

## What is in the package

| Path | |
| --- | --- |
| `src/` | the extension, the four directives and their nodes, the Twig extension |
| `resources/config/` | the container configuration that registers all of it |
| `resources/template/` | the overrides, by the paths the renderer looks them up under |
| `resources/dist/` | the drop-in: `soul.css`, `document.css`, `soul.js`, `soul-boot.js`, the faces, the icon sprites — and `soul-finish.js` |

## The manual

[The theme's own manual](https://benjaminkott.github.io/typo3-soul-design-system/guides-theme/index.html)
is rendered with it: installation, every setting in `guides.xml`, the four
directives, and what each node the renderer emits comes out as. A project to
copy rather than assemble sits in `examples/starter/` in the monorepo.

## Licence

GPL-2.0-or-later. The icons and the faces it ships carry their own — see
`THIRD-PARTY.md` in the monorepo.
