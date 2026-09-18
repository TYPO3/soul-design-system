# design-sync notes — Soul Design System

What a sync has to know before it touches the Design System artifact.
**This is one export of the design system, not the system itself.** The
repository's wiring lives under `docs/maintaining/`, and `SKILL.md` governs
designs made with the system.

## What goes up

The target is an artifact made from the "Design System" Artifact type. It
keeps a system as files under `project/`, and `scripts/build.ts` writes that
tree into `.out/bundle/project/`. The type's own instructions stand in its
`SKILL.md` and under `artifact-type/reference/`, readable on any system made
from it. `make build` follows them; where a shape is not obvious, that file
is the reason.

| Under `project/` | From |
| --- | --- |
| `design-system.json` | the index, written last. `make design-index` merges it over the one the system holds |
| `tokens.json` | `scripts/lib/tokens.ts`, out of `packages/frontend/src/tokens/*.css` |
| `README.md` | `conventions.md`, with the layouts at `<!-- @startingPoints -->` |
| `guidelines/*.md` | the sections after the tokens, in file order. `SKILL.md` first. Then the brand, the signet, the states and the icons, their cards photographed in. Then the two prompts with worked examples. `SECTIONS` in `build.ts` is the list |
| `components/bundle.js` | the elements as one classic script, `window.SDS`, built from `src/index.ts` |
| `components/bundle.css` | `packages/frontend/dist/soul-inline.css`, a copy |
| `components/<Class>/` | an element: `README.md` and `<Class>.d.ts`, read out of its source, and `preview.html` live from its stories. Its group is the domain in the story title |
| `components/<Name>Screen/` | a layout: a `page` preview at its design width, under "Layouts" |
| `components/Cover/preview.html` | `cover.html` beside this file |
| `fonts/` | the faces |
| `assets/<Group>/` | the marks, the icons and the fixtures: uploads the index names by blob id, and a `README.md` per group. A diagram, a placeholder and a screenshot are fixtures the previews point at, not a set to draw from |
| `icons/` | the lookup and the sprites, as files |
| `sync.json` | the record: a hash per file, a record per upload, the previews still pending |

**The bundle is a classic script, and the drop-in is a module.** The page
loads `bundle.js` before a preview with a plain `<script>`, so the module
`soul.js` cannot be it. `build.ts` builds the same entry as an IIFE with the
global `SDS`. The frame fetches nothing, so the entry carries every glyph
in the script through `inlineIcons()`, and `sds-icon` draws it without a
sprite. A literal `<!--` or `</script` in the file ends an inline copy, so
both go in as escapes.

**A preview fetches nothing.** The frame preloads the tokens, the faces,
`bundle.css` and `bundle.js`, so a preview's stylesheet link goes. A picture up to `INLINE_MAX` travels as a data URI. A larger one
names its upload as `{{upload:<path>}}`. Once the upload has an id, `make
design-index` writes `_blob/<id>` over it, relative like the page's own
references from inside the frame. Such a preview is `pending` in the record
and always goes up.

The page caps a preview at 256 kB, and `make build` fails on one over it.

**The tokens are lists, and a colour is one value per theme.** The page
cannot read a name-to-value map. `light-dark(a, b)` reads as `{light, dark}`,
an alias of another colour stays `{name}`, and every other `var()` resolves
to its literal. `usage` is the comment beside the declaration. The first
comment of a run speaks for the run, a later one for the declaration under
it, and a blank line ends a run. A key called `motion` the page refuses, so
the durations go under `timing`.

**A screen with an `<iframe>` stays out.** A preview holds none. The tour
embeds the other screens, and the pane lists those itself. A story that
draws a frame stays out for the same reason, and the build says so.

**A guideline card is a picture in a section.** A Markdown section is the
page's one place for a picture with prose beside it. It takes a data URI of
a raster picture only: an SVG comes out as a blocked image. So the build
photographs each card of a group, and each diagram, as a WebP through the
browser's own canvas.

The page caps a section at 200 kB. A picture over half of that stays out,
or it takes the room of every card after it. So does one the room is spent
for, and the build names each.

**An element's preview is its stories, authored.** `scripts/lib/authored.ts`
writes a story's template out as the markup its author wrote, the element
tags intact, and `prerender()` draws the first frame beside each tag. A
property a story sets, `.items` or a `body` with markup in it, has no
attribute. It goes into a table under `data-sds-prop`, and the preview's
script sets it after the bundle upgraded the elements. A template comes
back through `SDS.html` and `SDS.unsafeHTML`, which the bundle carries for
that.

The bundle loads before the markup in the frame, so `define()` registers
the elements when the parse ends, and each one takes its children whole. A
story whose render needs a browser, or a story too big for the page's cap,
stays out and the build says so.

## The link

Anyone can sync this system into a Design System artifact of their own.
`make design-sync` is a normal target, not a maintainer one.

The link buys the *second* sync. Without one, every run makes a new system.
The record has nothing to compare against, no removals come out, and the
gallery fills with duplicates.

It stays out of the committed `config.json` because it is per person. A
clone must not inherit somebody else's system as its default target. It is
not a credential: the Artifact tool works through the caller's own login.

`scripts/design-plan.ts` looks in three places, in order:

1. `SDS_DESIGN_SYSTEM` in the environment
2. `.design-sync/config.local.json`, gitignored, `{"url": "…"}`
3. `config.json` itself, for a fork that prefers it there

`make design-project` reads all three and says which answered.
`ARGS=<url>` writes the second, and refuses to replace a different link
without `--force`. With none of them the plan still writes, and its
preflight says to make a new design system from the type.

**`ARGS=--forget` is the reset.** It drops the link, the cached record, the
cached index, the plan and the uploads in flight together. They are one
state. A record across a change of target describes a design system nobody
uploads to. The baseline screenshots in the same cache belong to the visual
review and stay.

## A sync

The repo's half is one command: `make design-sync`, which is build → gate →
design-status → plan. It ends with the plan in
`.design-sync/.cache/upload-plan.json`, and an agent with the Artifact tool
runs that.

**Execute the plan. Do not improvise it.** It carries the preflight, the
numbered steps in order, and the exact file and upload lists. It comes from
the build and the previous record, so it cannot forget a renamed file the
way a hand-derived list can.

**First, the preflight.** Read `project/sync.json` from the system into
`.design-sync/.cache/remote-sync.json` and `project/design-system.json` into
`remote-index.json`, then list the system's files. The record is the
authority on what the system holds. The local cache is a copy, gitignored,
so on any machine but the last one that synced it is absent or stale. With
it the plan computes exact removals; without it the plan says so and
computes none. A read that finds no record is a first upload.

**Run `make design-plan` again after the preflight** if the cache had no
record before: the plan on disk knows nothing of it.

**The Artifact tool refuses a publish into an artifact this session has not
read, and a path it has not seen.** The preflight's read and listing are what
make the later calls admissible.

**Uploads go first, one call each.** `publish` with `asset: true` and the
file's full path answers with `/_blob/<id>`. Append `{"path", "blob"}` to
`.design-sync/.cache/uploads.jsonl` per upload; `make design-index` reads it.
A changed picture is a new upload, and the old blob stays. Nothing here
removes an upload, because a person can have placed it in the page.

**Then `make design-index`.** It writes the ids into the pending previews,
the index and the record, and stamps `lastChange`. It merges the index over
the cached remote one, so every key the page wrote stays. It fails loudly on
an upload with no id.

**Then the files, chunked.** `root` is `.out/bundle`, `file_path` one file
by its full path, `files` the map the plan gives, with the removals as
`null` in the first call. Under `root` the tool publishes `file_path` at
its own relative path, so the map leaves it out: a path named twice is a
refusal. The tool takes 256 paths and 16 MiB a call; the
plan stays under both. A `.d.ts` is not a served type: the plan sends it as
`{from, contentType: "text/plain"}`, or the tool refuses the whole call.

**The store re-serializes an SVG.** The bytes and the digest it reports
for an upload differ from the file's. The record keeps the file's own
hash, because that is what the next build compares against.

**The index and the record go last, in a call of their own.** Their presence
means everything before them landed. Then read the index back: its
`lastChange.at` is the value `make design-index` printed.

**After a successful upload, `make design-synced`.** It promotes the record
and the index to the cache and consumes `uploads.jsonl`. Skip it and the
next status and plan answer from the previous upload.

`make verify` checks the conventions header. It never rewrites the file.
The prose belongs to its authors. It fails on two kinds of drift, and both
matter because the page shows the header as the brand book:

- **A name that no longer exists.** A class or token named there but
  absent from the build. The agent writes markup that does nothing.
- **An element the header does not name.** A tag the bundle registers but
  the prose never mentions. Nothing breaks. The element is never in use,
  because the only document the agent reads does not say it is there.
