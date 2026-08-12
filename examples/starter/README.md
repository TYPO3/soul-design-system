# A documentation site, from an empty directory

Copy this directory, point the render step at your own documents, and you have
a site: a landing page, a manual page beside a rail, search, both modes, and a
GitHub Actions workflow that publishes it to Pages.

It is also a fixture. `.github/workflows/ci.yml` in the design system builds
exactly this project the way `.github/workflows/publish.yml` here describes —
with no `make` and no container — so an instruction that stops being true
stops the build rather than the reader.

## What is in it

| Path | |
| --- | --- |
| `composer.json` | the theme, named by its repository until it is on Packagist |
| `docs/guides.xml` | the project, the bar and the footer |
| `docs/index.rst` | the landing page: `:layout: marketing`, bands and a grid of teasers |
| `docs/guide/` | the manual shape, and what the renderer's own directives become |
| `.github/workflows/publish.yml` | render, finish, publish |

## Running it

```sh
composer install
vendor/bin/guides docs --output=site -c docs --fail-on-error
node vendor/typo3/soul-guides-theme/resources/dist/soul-finish.js site
php -S localhost:8000 -t site
```

The second command writes documents. The third is what turns them into a site:
the drop-in copied to the site root, every element drawn before the browser
arrives, the search index written, and any reference that leaves the output
refused. It comes out of `vendor/` with the theme, which carries the drop-in
because a stylesheet is nothing Composer can be asked for on its own.
`docs/guide/publishing.rst` says what each command is for — it is a page of
this example, so it is also the rendered proof that the example works.

## Two things to change first

**The version.** `composer.json` names the theme's repository and asks for
`dev-main`, because the package is not on Packagist yet and carries no tag.
That is a moving target: a site rebuilt against a branch can change on a
commit nobody in your repository made. Ask for a tag as soon as there is one.

**`docs/guides.xml`.** The project title, the two names in the bar, and the
sections a reader can reach. Everything in that file is optional except the
two `<extension>` elements; left out, the bar carries the project title.
