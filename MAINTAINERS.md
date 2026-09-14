# Maintainer operations

This file holds repository operations a consumer does not need, so the
published manual does not carry them. Product and design rules stay in
`docs/`. The package split architecture stands in the manual at
`docs/maintaining/package-splits.rst`, because it explains the installable
boundary. Authentication and release operations stay here.

## Publish package mirrors

The package mirrors are outputs of this monorepo, and nobody writes to them. On a push to
`main`, `.github/workflows/ci.yml` runs the gate, calls
`.github/workflows/split.yml`, then renders and deploys the documentation
after the mirrors are current. A failed gate changes neither packages nor
site.

`scripts/split.ts` assembles and replays package history and never pushes
it. The split workflow asks the script for the remotes, does normal branch
and tag pushes, and refuses to force either. Use the workflow's manual
dispatch to rerun a mirror or select a package. Do not commit in a mirror
to repair it.

The workflow needs the repository secret `SPLIT_TOKEN`. Use a fine-grained
GitHub token with `Contents: write` on the package mirror repositories and
no broader grant:

```sh
gh secret set SPLIT_TOKEN
```

The repository's `GITHUB_TOKEN` is not enough on purpose. Its write scope
ends at this repository. Without `SPLIT_TOKEN` the mirror job stops before
it clones or pushes anything.

Before a change to the workflow or the replay logic, prove the assembled
package boundary on your desk:

```sh
make split ARGS=--check
make verify
```

`PACKAGES` in `scripts/lib/packages.ts` is the authority for package
contents and remotes. Do not repeat either inventory here.

## Cut a release

A release is a tag in this repository, and both packages take it. Nothing
else decides a version. The mirrors carry the tag over, Packagist reads the
theme's version off it, and npm reads the frontend's out of a manifest. That
manifest is the only reason a version stands in this tree at all.

```sh
make release ARGS=0.2.0
```

That one command is the whole of it. It runs the gate and the suite itself,
first, with no way past them. A tag is the one thing here nobody takes
back, so the run that catches the mistake is the run nobody can skip.

It refuses two trees before it starts. One with uncommitted changes,
because the gate is then green over work the release commit does not hold.
And one that already carries the tag.

Then it writes the number into every file that carries it. The two
manifests, the lock file, and the project version the site renders into its
footer. It commits exactly those files and makes the annotated tag. It
pushes nothing, ever. The write happens in the container like every other
task. The commit and the tag happen on the host, where git is and where the
name on a release belongs.

`make verify ARGS=version` asks the same question the other way and is part
of the gate. So a tree whose copies disagree cannot reach a tag.

The push of the branch and the tag is the release, and nothing automates
it:

```sh
git push origin main --follow-tags
```

`.github/workflows/ci.yml` then runs the gate over the tagged tree, mirrors
both packages with the tag, publishes `@typo3/soul-frontend` and creates
the GitHub release. Packagist needs nothing from here. It follows the
theme's mirror and turns the tag into a version. Branch and tag arrive as
two push events in either order. That is why `scripts/split.ts` reconciles
tags against the whole mirror, not only against what a run replayed.

A tag never moves and never goes. A wrong release gets another release. The
mirrors refuse a moved tag, and a consumer who installed the old one keeps
it.

### What the release page says

The page comes from the commits under the tag. Every subject under its
scope, each with a link to its commit, over the install commands for this
version and the places that carry it. Read it before you push the tag,
while a subject can still change:

```sh
make notes ARGS=v0.2.0
```

That writes `.out/release/notes.md`. The release job runs the same two
halves on the runner and hands its file to `gh release create`. The log is
git's and the document is `scripts/notes.ts`. So a task on a desk and a
step in a workflow cannot say different things.

The commands and the links come out of the manifests and `PACKAGES`. So a
package added there is a package the next release page installs and names.
A tag with a prerelease suffix gets that mark, which keeps the releases
list on the version to install.

GitHub's own `--generate-notes` is what this replaced. It lists pull
requests, work here arrives as commits, and every release it wrote was a
compare link with nothing above it.

### npm publishes without a credential

The release job asks GitHub for an OIDC token, and npm exchanges it for the
publish. There is no npm token in this repository, and nobody must create
one. This is npm's trusted publishing. It writes the provenance attestation
itself, so the job passes no `--provenance` flag. npm trusts one
workflow file by name, so the job lives in `ci.yml`, not in a called
workflow. A move means a change to the configuration below in the same
breath.

Configured once, from npm CLI 11.10.0 or later, by a maintainer of the
package, and after the first publish below. The configuration attaches to a
package that already exists:

```sh
npm trust github @typo3/soul-frontend \
  --file ci.yml \
  --repo TYPO3/soul-design-system \
  --allow-publish
```

`--file` takes the workflow's name and refuses a path. npm resolves it under
`.github/workflows/` itself.

Then set the package to demand two-factor authentication and refuse tokens.
That is npm's own recommendation, and it costs this workflow nothing,
because an OIDC exchange is not a token.

### The first publish was by hand

A trusted publisher attaches to a package, and npm had no package before
the first publish. So the first publish was not a trusted one. What went
out was the placeholder version the tree carried then, under a dist-tag of
its own. So `latest` stayed free for the first real release:

```sh
cd packages/frontend && npm publish --tag next
```

That is why `0.1.0-dev` sits on `next` and nothing points at it. The
release job writes `latest`, and nothing else does. It went out with a
granular access token made for that one publish and revoked afterwards. No
build ran first, and none had to. Everything a package ships
is in git, which is also why the release job installs nothing before it
publishes.
