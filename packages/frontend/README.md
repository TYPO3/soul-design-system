# Soul, as a frontend

Tokens, the `sds-` class vocabulary, and the Lit elements that upgrade it.
Two files a page links, or an ESM package a bundler resolves — the same system
either way, because the elements render the classes rather than a second
vocabulary of their own.

**This repository is generated.** The frontend is written in the design
system's monorepo and pushed here whole on every release; a commit made here is
overwritten by the next one. Issues and pull requests belong in
[typo3-soul-design-system](https://github.com/benjaminkott/typo3-soul-design-system).

## Two files, no build

```html
<script src="soul-boot.js"></script>          <!-- sets the mode before the first paint -->
<link rel="stylesheet" href="soul.css">       <!-- tokens and the class layer -->
<script type="module" src="soul.js"></script> <!-- every sds- element, Lit bundled in -->
```

Copy `dist/` somewhere public and link those. No bundler, no import map, and
nothing to install: markup rendered by PHP, Twig or Fluid uses the classes, and
the elements upgrade it where there is behaviour. `dist/document.css` is the
second sheet, for pages whose content is a document rather than an interface —
scoped to `.sds-prose`, and deliberately not part of `soul.css`.

Copy the directory whole. `soul.css` asks for `fonts/` beside itself and
`soul.js` resolves the icon sprite against its own URL.

## Or as a package

```sh
npm install @typo3/soul-frontend lit
```

```js
import '@typo3/soul-frontend/dist/soul.css';
import '@typo3/soul-frontend/dist/soul.js';
```

`lit` is a peer dependency rather than a bundled one: two copies of it in a
page give a consumer a second reactive-element registry, and elements upgrade
under the wrong one.

## What is in it

| Path | |
| --- | --- |
| `src/tokens/` | every colour, size, space, radius and duration, declared once |
| `src/styles/` | `styles.css` is the entry point; `components.css` is the `sds-` vocabulary |
| `src/components/` | the Lit elements, each with the template function it renders |
| `dist/` | the built drop-in, plus `soul-finish.js` for a documentation build |
| `fonts/`, `assets/` | the faces, the icon sprites and the drawings a page references |

## The manual

[The design system's own documentation](https://benjaminkott.github.io/typo3-soul-design-system/frontend.html)
is set with it: what each layer is for, which one to reach for, and the rules a
design built on it follows.

## Licence

GPL-2.0-or-later. The icons and the faces carry their own — see
`THIRD-PARTY.md` in the monorepo.
