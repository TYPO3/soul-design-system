# Maintainer operations

This file holds repository operations that a consumer does not need and the
published manual therefore does not carry. Product and design rules stay in
`docs/`; the package split architecture is published at
`docs/maintaining/package-splits.rst` because it explains the installable
boundary. Authentication and release operation stay here.

## Publishing package mirrors

The package mirrors are read-only outputs of this monorepo. On a push to
`main`, `.github/workflows/ci.yml` runs the gate, calls
`.github/workflows/split.yml`, then renders and deploys the documentation after
the mirrors are current. A failed gate changes neither packages nor site.

`scripts/split.ts` assembles and replays package history but never pushes it.
The split workflow asks the script for the remotes, performs normal branch and
tag pushes, and refuses to force either. Use the workflow's manual dispatch to
rerun a mirror or select a package; do not commit in a mirror to repair it.

The workflow needs the repository secret `SPLIT_TOKEN`. Use a fine-grained
GitHub token with `Contents: write` on the package mirror repositories and no
broader grant:

```sh
gh secret set SPLIT_TOKEN
```

The repository's `GITHUB_TOKEN` is intentionally insufficient because its
write scope ends at this repository. A missing `SPLIT_TOKEN` stops the mirror
job before it clones or pushes anything.

Before changing the workflow or replay logic, prove the assembled package
boundary locally:

```sh
make split ARGS=--check
make verify
```

`PACKAGES` in `scripts/lib/packages.ts` remains authoritative for package
contents and remotes. Do not repeat either inventory here.

## Cutting a release

A release is a tag in this repository, and both packages take it. Nothing else
decides a version: the mirrors carry the tag over, Packagist reads the theme's
version straight off it, and npm reads the frontend's out of a manifest — which
is the only reason a version is written down here at all.

```sh
make release ARGS=0.2.0
```

That one command is the whole of it, and it runs the gate and the suite itself
— first, and with no way past them. A tag is the one thing here that is never
taken back, so the run that would have caught the mistake is the run that
cannot be skipped.

It refuses two trees before it starts: one with uncommitted changes, because
the gate would then be green over work the release commit will not contain, and
one that already carries the tag being asked for.

Then it writes the number into every file that carries it — the two manifests,
the lock file, and the project version the site renders into its footer —
commits exactly those files, and makes the annotated tag. It pushes nothing,
ever. The writing happens in the container like every other task; the commit
and the tag happen on the host, where git is and where the name on a release
belongs.

`make verify ARGS=version` asks the same question the other way and is part of
the gate, so a tree whose copies disagree cannot reach a tag unnoticed.

Pushing the branch and the tag is the release, and it is the one step nothing
automates:

```sh
git push origin main --follow-tags
```

`.github/workflows/ci.yml` then runs the gate over the tagged tree, mirrors
both packages with the tag, publishes
`@typo3/soul-frontend` and creates the GitHub release. Packagist needs nothing
from here — it follows the theme's mirror and turns the tag into a version.
Branch and tag arrive as two push events in either order, which is why
`scripts/split.ts` reconciles tags against the whole mirror rather than only
against what a run replayed.

A tag is never moved and never deleted. A release that was wrong is followed by
another release; the mirrors refuse a moved tag, and a consumer who installed
the old one is entitled to keep getting it.

### npm publishes without a credential

The release job asks GitHub for an OIDC token and npm exchanges it for the
publish. There is no npm token in this repository and none should be created:
this is npm's trusted publishing, and it writes the provenance attestation
itself, which is why the job passes no `--provenance` flag. npm trusts one
workflow file by name, so the job lives in `ci.yml` rather than in a called
workflow — moving it means changing the configuration below in the same breath.

Configured once, from npm CLI 11.10.0 or later, by a maintainer of the package,
and after the first publish below — the configuration is attached to a package
that already exists:

```sh
npm trust github @typo3/soul-frontend \
  --file ci.yml \
  --repo TYPO3/soul-design-system \
  --allow-publish
```

`--file` takes the workflow's name and refuses a path: npm resolves it under
`.github/workflows/` itself.

Then set the package to require two-factor authentication and disallow tokens.
That is npm's own recommendation and it costs this workflow nothing, because an
OIDC exchange is not a token.

### The first publish is by hand

A trusted publisher is configured on a package, and npm has no package until
something has been published — so the first publish cannot be a trusted one.
What goes out is the placeholder version the tree already carries, under a
dist-tag of its own so that `latest` stays free for the first real release:

```sh
cd packages/frontend && npm publish --tag next
```

Use a granular access token created for that one publish and revoke it
afterwards. Nothing is generated or built first, and nothing needs to be:
everything a package ships is committed, which is also why the release job
installs nothing before it publishes.
