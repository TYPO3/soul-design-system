# Soul, as a frontend

Tokens, the `sds-` class vocabulary, and the Lit elements that upgrade it.
Two files a page links, or an ESM package a bundler resolves — the same system
either way, because the elements render the classes rather than a second
vocabulary of their own.

**This repository is generated.** The frontend is written in the design
system's monorepo and pushed here whole on every release; a commit made here is
overwritten by the next one. Issues and pull requests belong in
[soul-design-system](https://github.com/TYPO3/soul-design-system).

## Two files, no build

```html
<script src="soul-boot.js"></script>          <!-- sets the mode before the first paint -->
<link rel="stylesheet" href="soul.css">       <!-- tokens and the class layer -->
<script type="module" src="soul.js"></script> <!-- every sds- element, Lit bundled in -->
```

Copy `dist/` somewhere public and link those. No bundler, no import map, and
nothing to install: markup rendered by PHP, Twig or Fluid uses the classes, and
the elements upgrade it where there is behaviour. A page whose content is a
document links nothing extra: the bare elements a renderer emits are set by
`soul.css` too, each by the sheet of the component it belongs to.

Copy the directory whole. `soul.css` asks for `fonts/` beside itself and
`soul.js` resolves the icon sprite against its own URL.

## Or as a package

```sh
npm install @typo3/soul-frontend lit
```

Published on npm from the tag this mirror carries, so a version in a
`package.json` is a version, not a branch that moves under the project.

```js
import '@typo3/soul-frontend';
import '@typo3/soul-frontend/dist/soul.css';
```

The package entry is `dist/index.js`, which leaves `lit` external — never
`dist/soul.js`, the drop-in above, which carries its own copy. `lit` is a peer
dependency for that reason: two copies of it in a page give a consumer a second
reactive-element registry, and elements upgrade under the wrong one.

npm resolves that peer on its own, so the elements work without naming it. It
is on the line above for the project that writes templates of its own: an
import of `lit` there wants a dependency the project declares, not one it
happens to find hoisted.

## What a page can write

**The element is the front door.** `<sds-code code-lang="bash">`, never a `div`
with the classes on it: the classes are what the elements emit and what a
surface running no JavaScript falls back to. Everything that fits in a string
is a property, and between the tags goes only what an attribute cannot carry —
content, never structure.

The same list is in `dist/custom-elements.json`, compiled from the sources
rather than written beside them: every tag, every attribute with its type and
what it is for, the events it says and whether it takes content. That is the
file an editor reads for completion and the one to point a tool at — the table
below is the same contract for a reader.

A property written `.like="${this}"` below is a list or a piece of markup, so
it is set from JavaScript or bound by a template; everything else is an
attribute a server writes directly. Where a property's name is two words, the
attribute is spelt out: `icon-only`, `code-lang`, `box-style`, `field-id`,
`min-width`, `per-page`, `previous-href`. And three names had to differ from
the ones the platform already has — `heading` rather than `title`, `as` rather
than `role`, `code-lang` rather than `lang` — because each of those would have
been quietly overridden.

| Element | What it is, and what it takes |
| --- | --- |
| [`<sds-button>`](https://typo3.github.io/soul-design-system/frontend/components/controls.html#component-sds-button) | The action that starts work, or the press that is a link. `variant` (`primary`, `secondary`, `ghost`, and `danger` for the press that cannot be undone — status colour as ink and a hairline, never a fill, with a label naming what goes), `size` (`md`, `sm`, `lg` — `lg` is the one action a screen is for), `disabled`, `title`. `type` is `button` unless it is the form's submit — a `<button>` with no type inside a `<form>` submits it. `href` and `rel` draw the same control as an `<a>`, with the middle click and the status line a browser already has; `icon-only` makes a glyph the whole control and `title` its name; `for` and `command` (`show` unless written) address another element. The label goes between the tags |
| [`<sds-dropdown>`](https://typo3.github.io/soul-design-system/frontend/components/controls.html#component-sds-dropdown) | A button, and the short list it opens under itself. `choices` decides what the list is: entries carrying `href` are pages and become links in a disclosure Tab walks as well, entries carrying none are commands and become a menu. The arrows open the panel and walk its rows either way. Each entry takes `label`, `icon`, `current`, `disabled`, `external`, and `lang` where it names a language. `label` is what the button says, `name` what it is called where the label is too short to say it, `align` (`start`, `end`) which side the panel hangs from, and `variant`, `size` and `icon-only` are the button's own. The panel is a popover: the top layer holds it, so no ancestor's overflow clips it, and opening, light dismiss, Escape and the focus going back to the button are the platform's |
| [`<sds-link>`](https://typo3.github.io/soul-design-system/frontend/components/controls.html#component-sds-link) | A link, and always an `<a>` with an `href`. `label`, `href`, `external` marks and names one that leaves, `icon` a glyph before it, `bare` drops the underline where the surrounding text is not prose |
| [`<sds-badge>`](https://typo3.github.io/soul-design-system/frontend/components/controls.html#component-sds-badge) | A small, named piece of state. `label`, `tone` (`default`, `accent`, `ok`, `warn`, `error`), `icon` |
| [`<sds-eyebrow>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-eyebrow) | The line over a title, saying what kind of thing it opens — the label register as a block, sitting flush so the register's leading is the air. `label` |
| [`<sds-icon>`](https://typo3.github.io/soul-design-system/frontend/components/controls.html#component-sds-icon) | One icon from the set, inlined into the document rather than linked, so `currentColor` reaches it. `name` is the TYPO3 identifier, `size` is `16`, `20`, `24` or a whole multiple and defaults to `em`, `label` names it where it stands without words — without one it is hidden from assistive tech rather than read out beside its own text |
| [`<sds-theme>`](https://typo3.github.io/soul-design-system/frontend/components/controls.html#component-sds-theme) | The mode the page is in, as one press that steps through three — the machine's setting, light, dark, and round again. The system's own icon button, its sentence in `title` for the reader who cannot see the mark and for the one hovering it; which mark stands is what the document says, so it is right before any script runs. `key` is where the choice is kept — the same one `soul-boot.js` reads, or the mode is written here and looked for elsewhere on the next page |
| [`<sds-surface>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-surface) | A plane holding a statement. `plane` (`plain` for the unfilled hairline, `raised`, `sunken` for machine output), `heading`, `body`, `label`, `icon`, `box-style` sizes the plane where one instance needs it — nothing by default, the element fills the cell a wall stretches for it |
| [`<sds-card>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-card) | A way into something, and the whole frame is the one link. `heading`, `body`, `href`, `src` and `alt`, `label`, `tag`, `icon`, `footer`, `action` — the call to action is words, not a second control |
| [`<sds-grid>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-grid) | The wall a set is read in, reflowing by the width its items need rather than by a column count. `variant` (`default`, `wide`, `dense`, `flush`) says how much room an item holds — a reader with no script gets the reflowing grid the stylesheet declares, and the element evens out the last row once it can measure |
| [`<sds-stat>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-stat) | A number stated as a fact. `value`, `unit`, `label`, `of` for the whole it is a part of, `icon`, `note` — the line that bounds the figure, and a figure with no bound is a boast |
| [`<sds-swatch>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-swatch) | One colour, stated as a fact: the chip, what the colour is called, and the value that name resolves to — a swatch missing one of the three documents part of a colour. `value` paints the chip, `name` is what a design writes, `resolved` is what the mode made of it, and `kind` (`fill`, `line`) says whether the value is a surface or a hairline, which is drawn as the chip's own edge rather than its middle. A value that is not a colour is dropped rather than guessed at |
| [`<sds-icon-tile>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-icon-tile) | One glyph in a wall of them, scanned rather than read: the drawing fills the box and the identifier is held back under it. `name` is the icon, `caption` where a set writes something other than the identifier, `href` makes the whole tile the press, and `tag` is the one fact a drawing cannot show — that it mirrors, that it is going. It takes no size: a wall is scanned at one distance, and a tile drawn larger is a tile claiming to matter more |
| [`<sds-quote>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-quote) | A sentence borrowed from somewhere. `by` is required, `as` what they are to the subject, `meta` when, `initials` the monogram, `href` where it can be read in full, `body` or the sentence between the tags |
| [`<sds-byline>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-byline) | Who wrote it, and when. `name`, `as`, `meta`, `initials`, `href`, `unmarked` for the line that carries no monogram |
| [`<sds-steps>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-steps), [`<sds-step>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-step) | An instruction read from the top, numbered down one rail — for work that has an order; a set of things to do in any order is a list instead. The set takes `.steps` where a page holds its stops as data; a stop takes `heading`, `optional`, `anchor`, and what has to be done between the tags, which is where a paragraph, a command or a picture of the result goes. Nothing writes a figure: the set counts, so a stop put in the middle renumbers everything under it |
| [`<sds-note>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-note) | What an answer carries besides the answer. `tone` (`info`, `ok`, `warn`, `error`), `heading`, `body`, `icon`, `label`. `action` puts the one thing to do about what it says after the sentence, as the note's own secondary at `sm` — one and no more, a message offering two answers being a dialog, and on a narrow box it goes under the sentence rather than squeezing it; `href` draws that as a link, where the answer is a place rather than a decision |
| [`<sds-run>`](https://typo3.github.io/soul-design-system/frontend/components/controls.html#component-sds-run) | Work being *done*, as the stops it is made of — not `<sds-steps>`, which is an instruction and never changes. A run arrives one stop at a time, the stops fold onto what they wrote, and the whole ends on a `verdict`. `heading`, `verdict` (`running`, `done`, `failed`), `note` for the line under it, `open` for whether the whole stands unfolded, and `.steps` of `{ label, state, meta?, note?, output?, group? }` — `state` is `ahead|running|done|failed`, `meta` a duration at the end of the row, `note` what is happening to it in words, `output` what it wrote, `group` where the work is many jobs at once rather than one sequence. A stop that wrote nothing does not open. The share, where the work reports one, is `<sds-progress>` above it |
| [`<sds-progress>`](https://typo3.github.io/soul-design-system/frontend/components/controls.html#component-sds-progress) | How far a running job has got, driven from outside — a share, not a sequence of stops. `value` against `max`, `caption`, `label`, `readout` (`percent`, `count`, `none`) for how the position is said, `unit` for what a count counts, `note` for what the work is doing right now, `size` (`medium`, `small`), `pulsing` sends a hatch travelling through the filled part to say work is happening right now (and sets `aria-busy`). The fill's ink is mixed from the distance itself, so the colour says what the length says; so the colour arrives at `--status-ok` as the run does. Where the share is not known there is nothing to fill: that is `.sds-loading` with a spinner |
| [`<sds-table>`](https://typo3.github.io/soul-design-system/frontend/components/data.html#component-sds-table) | Rows and columns, with the scroll a wide one needs. `density` (`compact`, `medium`, `airy`), `scrollable`, `width`, `.columns`, `.rows` — a cell is text, a component, or `{ value, note }` for a name with what is true about it right now under it — and `loading` with `loading-rows` for the wait before them — the head stays and the body is drawn as bars at the height the rows will have |
| [`<sds-code>`](https://typo3.github.io/soul-design-system/frontend/components/data.html#component-sds-code) | A fenced block, its head and its copy button. `code-lang`, `caption`, `copy`, `action`, and the code as `source`, as `body`, or between the tags — content that already carries `hljs-` classes is kept exactly as it came, so a server that highlighted it is not undone |
| [`<sds-diff>`](https://typo3.github.io/soul-design-system/frontend/components/data.html#component-sds-diff) | A file's changes, coloured by row on the server. `path`, `icon`, `body` |
| [`<sds-confval>`](https://typo3.github.io/soul-design-system/frontend/components/data.html#component-sds-confval) | One configuration value in a reference. `name`, `anchor`, `required`, `type`, `default`, `.facts` for whatever else the source named, `body` |
| [`<sds-image>`](https://typo3.github.io/soul-design-system/frontend/components/media.html#component-sds-image) | A picture, and nothing around it. `src`, `alt`, `width`, `height`, `zoomable` makes it a press that opens at full size, `class` |
| [`<sds-figure>`](https://typo3.github.io/soul-design-system/frontend/components/media.html#component-sds-figure) | A picture and the claim it makes. `src`, `alt`, `caption`, `width`, `height`, `zoomable` |
| [`<sds-embed>`](https://typo3.github.io/soul-design-system/frontend/components/media.html#component-sds-embed) | A document from somewhere else, in a frame this page controls. `src`, `label`, `ratio`, `width`, `height`, `caption`, `allow`, `allowfullscreen` |
| [`<sds-lightbox>`](https://typo3.github.io/soul-design-system/frontend/components/media.html#component-sds-lightbox) | A drawing opened at the size it was drawn — the platform's `<dialog>`, reached with `zoomable` above rather than by hand. `src`, `alt`, `caption`, `open` |
| [`<sds-nav-main>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-nav-main) | The bar at the top of a page. Handed the site as one `MenuEntry` with everything under it, it measures what still fits: the front doors in the row, a section's pages in a drop or a wall under it, and on a phone one level at a time in the drawer, stepping into a section and back out. `.menu`, `.items` and `active` for a flat set of sections, `home`, `signet`, `brand`, `product`, `search`, `index` for what search reads, `label`, `theme-key`, and `.languages` — the same page in other languages, taking `sds-dropdown`'s entries and drawing that control at the end of the row, the button saying the `lang` the reader is in |
| [`<sds-nav-rail>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-nav-rail) | The navigation rail beside a column: one `MenuEntry` with its pages under it, folds at any depth. `.entry` |
| [`<sds-nav-pills>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-nav-pills) | Navigation for the sections of a page. `.items`, `active` |
| [`<sds-nav-toc>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-nav-toc) | What is on this page, and where in it the reader is. `.entries` are the sections, nested as deep as the page nests them, and `label` is the heading over the list. The one navigation here that finds its own current entry: a heading is current because the reader has scrolled to it, which nothing rendering the page can know — so the element reads the page and marks the last heading to have passed the line a jumped-to one lands on |
| [`<sds-tabs>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-tabs), [`<sds-tab-item>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-tab-item) | One set of panels, one of them shown. The set takes `.items`, `active` and `sync` — the word that makes sets follow each other, so one setting shown in four places is chosen once and the choice outlives the page; an item takes `label`, `icon`, `active` and its panel between the tags |
| [`<sds-nav-breadcrumb>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-nav-breadcrumb) | Where the page sits, as a trail. `.items`, `label` |
| [`<sds-accordion>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-accordion), [`<sds-accordion-item>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-accordion-item) | Questions with their answers folded behind them, on a real `<details>`, so they fold with no script. The set takes `.entries`, `multiple` and `name` — the group they fold in; an item takes `question`, `open`, `name`, `anchor`, and the blocks behind it between the tags |
| [`<sds-search>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-search) | Finding a page in a site that has no server: the index is fetched on the first keystroke and the hits are dropped under the field, each with its sentence cut to two lines — a drop is passed through on the way to a page. An entry in the index is `{ title, url, text }` and may carry `image`, which becomes the hit's thumbnail. The drop is a popover, like `sds-dropdown`'s: the top layer holds it, so no ancestor's overflow clips it, a press outside is the platform's own dismissal, and it hangs from whichever edge of the field has room for it. `index` is where the index file is, `label` names the field, and `size` (`md`, `sm`, `lg`) is `sds-field`'s own — a bar running its controls at `sm` runs the search at `sm` too |
| [`<sds-search-hits>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-search-hits) | What a query was answered with: the hits, and the sentence a search with none gives. Handed them rather than finding them, so a page of results and the drop under a field are the same list. `.items`, `match`, `empty` |
| [`<sds-search-result>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-search-result) | One hit in a list of them. The whole row is the target and the title is the link. `heading`, `href`, `path`, `snippet`, `match` for what was searched for inside it, `kind`, `meta`, `src` and `alt` for the picture beside the words |
| [`<sds-nav-pagination>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-nav-pagination) | Where a list continues. `count`, `per-page`, `current`, `href`, `label` |
| [`<sds-nav-pager>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-nav-pager) | The way on from a page that is read in order — not the one that numbers a set. `previous-href`, `previous-label`, `next-href`, `next-label`, `label` |
| [`<sds-footer>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-footer) | How a page ends, and where the rest of the site is. `.groups`, `note`, `product`, `signet`, `brand`, `copyright`, `version`, `meta`, `.marks` — every part falls away where nothing is set |
| [`<sds-field>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-field) | One line of whatever a reader types, on the platform's own `<input>`. `label`, `value`, `type`, `name`, `field-id`, `hint`, `error` — which sets the invalid state with it, and which the browser then refuses to submit past — `required`, `disabled`, `readonly`, `prefix`, `suffix`, `min-width`, `icon`, `caption`, and `size` (`md`, `sm`, `lg`) — the box's three heights, which every control drawn as a field takes from here. The platform's own attributes pass straight through: `autocomplete`, `inputmode`, `min`, `max`, `step`, `maxlength`, `pattern`. `focused`, `invalid` and `filled` draw a state a still render has to hold; set none and the states are the browser's |
| [`<sds-textarea>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-textarea) | An answer of more than one line, in the field's box — its own element, because what it shares with a field is the box and not what a caller writes. `rows`, `value`, `resize` (`vertical`, `none`, `both`), `caption`, `label`, `name`, `field-id`, `hint`, `error`, `required`, `disabled`, `readonly`, `maxlength`, `autocomplete`, `size`, `min-width`, `filled`, `invalid`, `focused`. The value the markup came with is the default a reset puts back |
| [`<sds-select>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-select) | One answer out of a list the reader does not need to see — its own element, sharing the field's box and nothing else. `.options` takes strings or `{ label, value?, disabled?, group? }`: consecutive entries naming the same `group` become one `<optgroup>`, and a `disabled` entry stays on the list without being on offer, so a reader learns an answer is closed rather than missing. `value` is the choice, or — while `filled` is off — the prompt, rendered as a disabled option because a closed box has nowhere to put a placeholder. `caption`, `label`, `name`, `field-id`, `hint`, `error`, `required`, `disabled`, `min-width`, `size`, `focused`, `invalid`, and `open` — the list drawn standing open, for a still render. **The list is drawn rather than the browser's**, which is the one place this system rebuilds a native control: a browser's own list opens in a window the page has no reach into, so a dark page opens a light one. What that costs is put back by hand — `role="combobox"` over `role="listbox"`, the arrows, `Home`, `End`, type-ahead, `Enter`, `Escape`, and `aria-activedescendant`, so the focus never leaves the button. The real `<select>` stays underneath: it is what the form submits, and it is the whole control on a page that runs no script |
| [`<sds-field-group>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-field-group) | A control and what stands with it — a field, a row of actions, a hint — as one thing, at the normal step. Each part owes no step of its own, so standing loose they touch; the group is the set that pays. Content between the tags |
| [`<sds-field-error>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-field-error) | The message under an invalid field, with its own glyph, because colour alone is not a message. `message` |
| [`<sds-checkbox>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-checkbox) | One thing that is either so or not. `label`, `hint`, `checked`, `indeterminate`, `name`, `value`, `required`, `disabled` |
| [`<sds-checkbox-group>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-checkbox-group) | Tick any of these, under one question — a real `<fieldset>` and `<legend>`, one name for the whole set. `legend`, `legend-said-only`, `name`, `.choices` of `{ label, value?, hint?, disabled? }`, `.values`, `hint` |
| [`<sds-radio>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-radio) | One answer out of a few, all of them visible. `legend`, `legend-said-only`, `name`, `.choices`, `value`, `hint`, `required` |
| [`<sds-switch>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-switch) | A setting that takes effect where it stands — which is the whole difference from a checkbox, one turning something on now and the other answering the form. `label`, `hint`, `checked`, `name`, `value`, `disabled` |
| [`<sds-range>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-range) | A value picked along a run of them, for the quantity where the position is the answer; the number the thumb stands at is always beside it in an `<output>`. `caption`, `label`, `name`, `min`, `max`, `step`, `value`, `unit`, `hint`, `disabled`, `field-id` |
| [`<sds-file>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-file) | The platform's own picker with its button painted — a drawn box with a hidden input behind it has no keyboard. `caption`, `label`, `name`, `accept`, `multiple`, `hint`, `error`, `required`, `disabled`, `field-id` |
| [`<sds-form-errors>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-form-errors) | What stopped the form, at the top of it. `.errors`, `heading`, `announce` |
| [`<sds-dialog>`](https://typo3.github.io/soul-design-system/frontend/components/overlays.html#component-sds-dialog) | A surface that opens over the page, takes the focus and gives it back, on the platform's `<dialog>`. `heading` — also its accessible name — `body`, `.actions` (ghost first, primary last), `width`, `open`; `show()` and `close()`, and it answers a button that names it with `for` |
| [`<sds-modal>`](https://typo3.github.io/soul-design-system/frontend/components/overlays.html#component-sds-modal) | The surface alone, with nothing that opens or closes it, for a page that positions its own. `heading`, `body`, `.actions`, `width` |
| [`<sds-overlay>`](https://typo3.github.io/soul-design-system/frontend/components/overlays.html#component-sds-overlay) | The wash a floating surface sits on. It takes nothing |

Every form control is **form-associated** through `ElementInternals`, which is
what makes it a member of the form rather than a box that happens to contain
one: a reset reaches the element itself, a `<fieldset disabled>` disables
everything under it, `error` is a validity the browser refuses to submit past
and reports on the right box, and `form`, `labels`, `validity`,
`checkValidity()` and `reportValidity()` answer on the element the way they
answer on an `<input>`. The *value* is not held there on purpose — every one of
these renders a real named `<input>`, `<select>` or `<textarea>` into the light
DOM, so a page prerendered by a server submits what it shows before a line of
script has run; holding it in internals as well would send every answer twice.

Every event bubbles and is composed, so a page listens on the element rather
than on whatever is inside it:

| Event | From | `detail` |
| --- | --- | --- |
| `sds-change` | `sds-nav-pills`, `sds-nav-main`, `sds-nav-rail`, `sds-tabs` | `{ index, label }` — the item that became current |
| `sds-change` | `sds-nav-pagination` | `{ page }`, one-based. Cancelable: `preventDefault()` pages in place instead of following the link |
| `sds-change` | `sds-checkbox`, `sds-switch`, `sds-radio`, `sds-checkbox-group`, `sds-select`, `sds-file` | the new state, the chosen value, the values ticked, or the files chosen |
| `sds-input` | `sds-field`, `sds-textarea`, `sds-range` | what is in the field, or where the thumb now stands |
| `sds-command` | `sds-button` with `for` | `{ command, source }`, dispatched **on the element named by** `for`, the way the platform's own invokers do it |
| `sds-note-action` | `sds-note` with `action` | the label that was pressed. Said only where the action is a decision: with `href` set, following the link is the answer and nothing is announced |
| `sds-theme-change` | `sds-theme` | `{ theme }` — `"light"`, `"dark"`, or `null` for the machine's |
| `sds-dropdown-choose` | `sds-dropdown` | `{ choice, index }`. Said beside the navigation rather than instead of it, so a page that never listens still works; preventing it is how an app takes the navigation over |

## The rule, as something to run

```sh
npx soul-check src/          # or any set of paths; the tree by default
```

Every `sds-` class an element draws is that element's own name for its own
node, and a page that writes one has rebuilt the component: it cannot follow
the day a part is renamed, cannot grow the variant the element grew, and answers
no form. `soul-check` walks a tree's markup and names each one with the element
to write instead, and exits non-zero on the first — so an agent that loaded no
instruction still finds out. The page vocabulary is not a finding: `sds-app`,
`sds-page`, `sds-prose`, the shell and the type classes are written by hand,
because no element draws them.

It reads `dist/custom-elements.json` beside itself, so what it holds is what
this version of the package draws — not a list somebody keeps in step.

## And the classes underneath

Every element renders **light DOM** and emits the classes `soul.css` defines,
so an element and a hand-written `<button class="sds-btn">` are the same markup
under the same rules. Put `sds-app` on the root element — it establishes the
canvas, the type and the text colour — and `sds-prose` on a document.

Names are prefixed `sds-`, with `__part`, `--modifier` and `.is-active` /
`.is-disabled` / `.is-focused` / `.is-invalid` / `.is-filled` / `.is-selected`
for state. **A `sds-x__y` class is `sds-x`'s own name for its own node**: a
page may write `.sds-card` and `.sds-note--warn`, and may not write
`.sds-card__foot`, because the day that node changes every hand-written copy of
it is a surface nobody will fix. Never invent an `sds-` name either — compose
from the tokens instead. `soul.css` is the full list, and it is grouped the way
the table above is: the page shell (`sds-shell`, `sds-body`, `sds-column`,
`sds-bands`, `sds-page`), the type (`sds-display`, `sds-h1`…`sds-h3`,
`sds-lead`, `sds-list`), the registers a page writes in (`sds-label`,
`sds-mono`, `sds-said-only`), and one family per component.

`sds-said-only` is the one that draws nothing: what it carries stands in the
reading order at the place it belongs and takes no room on the page — the name
of a thing the lockup above already shows, the heading of a column whose head
is a glyph. Not `hidden` and not `display: none`, which take a passage out of
the reading as well.

Every value is a token — `--surface-*`, `--text-*`, `--border-*`, `--accent`,
`--status-*`, `--syntax-*`, `--font-*`, `--space-1…16`, `--radius-*`,
`--duration-*`. Never a literal colour, size, radius or duration, and never the
raw `--orange-*` scale that `--accent` is drawn from. Both modes ship in one
declaration: every colour is `light-dark()` against `color-scheme: light dark`,
so the two cannot drift. Force one with `data-theme="light"` or `"dark"` on
`<html>`, or the browser's own scrollbars and form controls stay in the other.

**If an element cannot say something a page needs, the gap is in the element.**
A consumer writing three declarations into their own stylesheet is the outcome
this system exists to prevent — say so upstream rather than working around it.

## What is in it

| Path | |
| --- | --- |
| `src/tokens/` | every colour, size, space, radius and duration, declared once |
| `src/styles/` | `styles.css` is the entry point; `components.css` is the `sds-` vocabulary |
| `src/components/` | the Lit elements, each with the template function it renders |
| `dist/` | the built drop-in, plus `soul-finish.js` for a documentation build |
| `dist/custom-elements.json` | every element as a manifest — what each tag takes, says, holds and draws |
| `dist/soul-check.js` | `npx soul-check`, the rule above as an exit code |
| `fonts/`, `assets/` | the faces, the icon sprites and the drawings a page references |

## The manual

[The design system's own documentation](https://typo3.github.io/soul-design-system/frontend/index.html)
is set with it: what each layer is for, which one to reach for, and the rules a
design built on it follows.

## Licence

MIT. The icons and the faces carry their own — see
`THIRD-PARTY.md` in the monorepo.
