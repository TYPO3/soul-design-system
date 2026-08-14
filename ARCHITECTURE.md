# How this repo is built

The repository map now lives in the published maintainer documentation:
[`docs/maintaining/source-and-output.rst`](docs/maintaining/source-and-output.rst)
names the authoritative sources, the tasks that read them and the generated
artefacts they produce.

This file temporarily holds the architecture decisions that have not yet moved
beside the part of the system they govern. `SKILL.md` remains the operating
instruction for designing with the system, the published documentation keeps
design reasons beside their rules, and `.design-sync/NOTES.md` covers the
design-guide upload alone.

## Two packages come out of this tree, and they leave through `packages/`

**Both leave the same way, and that is the point of the directory.** A package
under `packages/` is pushed to a repository of its own and published from
there; nothing else in the tree leaves. `packages/frontend/` is the npm
package — the tokens, the class layer, the elements, and the drop-in built from
them — and `packages/guides-theme/` is the Composer package.

The root is a private workspace: it holds the devDependencies, the tooling, the
specimens and the gate, and it is not a package anybody installs. That is what
the move bought — before it, the repository root *was* the npm package, so the
whole tree was something a consumer resolved paths into.

**Composer forced the question.** Packagist reads the `composer.json` at the root of a
repository, so a package in a subdirectory does not exist for it. Everything
under `packages/` is therefore pushed to a read-only repository of its own —
that is what the directory means, and the only thing it means.

**It is assembled per commit, not split out of the history.** `splitsh-lite`
reproduces a subdirectory's commits exactly, which is the one thing that cannot
work for the theme: its package has to contain a directory this tree does not
have in that place — the drop-in. So `scripts/split.ts` replays instead. Every
commit that touches a package is assembled and committed over there with the
author, date and message it had here, plus a `Split-From:` trailer that says
where the mirror stopped, so the next run continues rather than repeats. A tag
here becomes a tag there, on an empty commit where the package itself did not
change — a release has to exist before it can be tagged, and only a tag is what
Composer resolves.

**Neither door delivers a documentation build on its own, and the gap is what
a consumer feels.** The theme is PHP; the stylesheets are not, and neither is
the step that draws this system's elements before a browser sees them. A PHP
project cannot pull npm, so a Composer-only build renders documents that link
nothing and hold empty cards.

So the drop-in carries that step. `packages/frontend/dist/soul-finish.js` is
`scripts/lib/site.ts` bundled for Node — copy the drop-in, draw every element,
write the search index, refuse a reference that leaves the output — and it
arrives inside the theme package, because a PHP project cannot ask npm for a
stylesheet.

**This site is built as one of those projects.** `make guides` builds the
renderer with the three Composer commands the manual prints and takes the
templates and the drop-in out of the `vendor/` they produce — it imports none
of them from the tree. The publishing workflow does not call that task at all:
it runs those three commands itself, as a reader's own workflow does, and adds
only the two steps a reader has no use for — `make embed` for the specimen
cards these pages embed and `make chrome` for what they are drawn with. Both
read `specimens/` and generate nothing, which is why a runner with no npm
install can take them. The
renderer is built by the three Composer commands the manual prints —
`init`, `config repositories.soul`, `require` — with one thing named
differently on a desk: the repository is the package `scripts/lib/packages.ts`
assembles, where CI names the mirror the job before it pushed to. Both renders were compared over one commit and are
byte-identical, which is the only way a documented path stays true — it is the
path.

**The mirror needs one thing no file here can carry: a token.** The job pushes
into repositories this run does not belong to, and `GITHUB_TOKEN` is scoped to
the one it does — so `SPLIT_TOKEN` is a secret on this repository, a
fine-grained token with `Contents: write` on the two mirrors and no other
grant. Missing, the job stops on that sentence instead of pushing half a
release. It is the whole setup, and it is needed once:

```sh
gh secret set SPLIT_TOKEN
```

**What is still open is registration, not mechanism.** Neither name is claimed
on Packagist or npm yet. Until then the `composer.json` the manual prints names
the theme's mirror as a VCS repository and asks for `dev-main`, and the drop-in
arrives inside that package.
Nothing in CI installs it: what holds the documented path honest is that this
site is rendered along it, with the same file a reader runs.
