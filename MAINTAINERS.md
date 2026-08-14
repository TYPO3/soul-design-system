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
