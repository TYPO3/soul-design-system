# Soul, as a frontend

Tokens, the `sds-` class vocabulary, and the Lit elements that upgrade it.
Two files a page links, or an ESM package a bundler resolves. The same
system either way, because the elements render the classes and no second
vocabulary.

**This repository is a task's output.** The frontend's source is in the
design system's monorepo, and every release pushes it here whole. The next
release overwrites a commit made here. Issues and pull requests belong in
[soul-design-system](https://github.com/TYPO3/soul-design-system).

## Two files, no build

```html
<script src="soul-boot.js"></script>          <!-- sets the mode before the first paint -->
<link rel="stylesheet" href="soul.css">       <!-- tokens and the class layer -->
<script type="module" src="soul.js"></script> <!-- every sds- element, Lit bundled in -->
```

Copy `dist/` somewhere public and link those. No bundler, no import map,
and nothing to install. Markup from PHP, Twig or Fluid uses the classes,
and the elements upgrade it where there is behaviour. A page whose content
is a document links nothing extra. `soul.css` sets the bare elements a
renderer emits too, each in the sheet of its component.

**Or one file, pasted.** `soul-inline.css` is `soul.css` with the two
families inside it, for a page that goes out as one file. Paste it into a
`<style>`. The host of such a page writes a reset of its own outside every
layer. So the sheet's last two rules stand outside them too, and hand the
root and the body back. Run `soul-finish.js` over the page, so the elements
arrive rendered, and link no script.

Copy the directory whole. `soul.css` asks for `fonts/` beside itself, and
`soul.js` resolves `assets/icons/sprites/` against its own URL. One sprite
file per icon category, and each icon comes out of its own. A bundler
moves the module away from those assets, so a bundled build says where they
went: `setIconSprites('/where/they/are/')`, the directory and not one file.

## Or as a package

```sh
npm install @typo3/soul-frontend lit
```

Published on npm from the tag this mirror carries. So a version in a
`package.json` is a version, not a branch that moves under the project.

```js
import '@typo3/soul-frontend';
import '@typo3/soul-frontend/dist/soul.css';
```

The package entry is `dist/index.js`, which leaves `lit` external. Never
`dist/soul.js`, the drop-in above, which carries its own copy. `lit` is a
peer dependency for that reason. Two copies of it in a page give a consumer
a second reactive-element registry, and elements upgrade under the wrong
one.

npm resolves that peer on its own, so the elements work without a name for
it. It stands on the line above for the project that writes templates of
its own. An import of `lit` there wants a dependency the project declares,
not one it finds hoisted.

## What a page can write

**The element is the front door.** `<sds-code code-lang="bash">`, never a
`div` with the classes on it. The classes are what the elements emit, and
the fallback for a surface with no JavaScript. Everything that fits in a
string is a property. Between the tags goes only what an attribute cannot
carry: content, never structure.

The same list is in `dist/custom-elements.json`, compiled from the sources.
Every tag, every attribute with its type and purpose, the events it sends,
and if it takes content. An editor reads that file for completion, and a
tool points at it. The table below is the same contract for a reader.

A property written `.like="${this}"` below is a list or a piece of markup.
Script sets it, or a template binds it. Everything else is an attribute a
server writes. Where a property's name is two words, the attribute has its
own spelling: `icon-only`, `code-lang`, `box-style`, `field-id`,
`min-width`, `per-page`, `previous-href`. Three names differ from the
platform's: `heading` for `title`, `as` for `role`, `code-lang` for `lang`.
Each of those overrides a global attribute otherwise.

| Element | What it is, and what it takes |
| --- | --- |
| [`<sds-button>`](https://typo3.github.io/soul-design-system/frontend/components/controls.html#component-sds-button) | The action that starts work, or the press that is a link. `variant`: `primary`, `secondary`, `ghost`, and `danger` for the press with no undo. `size`: `md`, `sm`, `lg`. `disabled`, `title`. `type` is `button` unless it is the form's submit. `href` and `rel` draw the same control as an `<a>`. `icon-only` makes a glyph the whole control, and `title` its name. `for` and `command` (`show` unless written) address another element. The label goes between the tags |
| [`<sds-dropdown>`](https://typo3.github.io/soul-design-system/frontend/components/controls.html#component-sds-dropdown) | A button, and the short list it opens under itself. `choices` decides what the list is. Entries with `href` are pages in a disclosure. Entries without are commands in a menu. Each entry takes `label`, `icon`, `current`, `disabled`, `external`, and `lang` where it names a language. `label` is what the button says. `name` is the control's name where the label is too short. `align` (`start`, `end`) is the side the panel hangs from. `variant`, `size` and `icon-only` are the button's own. The panel is a popover in the top layer |
| [`<sds-link>`](https://typo3.github.io/soul-design-system/frontend/components/controls.html#component-sds-link) | A link, and always an `<a>` with an `href`. `label`, `href`. `external` marks and names one that leaves. `icon` is a glyph before it. `bare` drops the underline outside prose |
| [`<sds-badge>`](https://typo3.github.io/soul-design-system/frontend/components/controls.html#component-sds-badge) | A small, named piece of state. `label`, `tone` (`default`, `accent`, `ok`, `warn`, `error`), `icon` |
| [`<sds-eyebrow>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-eyebrow) | The line over a title, which says what kind of thing it opens. The label register as a block. `label` |
| [`<sds-icon>`](https://typo3.github.io/soul-design-system/frontend/components/controls.html#component-sds-icon) | One icon from the set, in the document, so `currentColor` reaches it. `name` is the TYPO3 identifier. `size` is `16`, `20`, `24` or a whole multiple, and `em` by default. `label` names it where it stands without words. Without one it hides from assistive technology |
| [`<sds-theme>`](https://typo3.github.io/soul-design-system/frontend/components/controls.html#component-sds-theme) | The mode the page is in, as one press through three: the machine's setting, light, dark. The system's own icon button, with its sentence in `title`. The document says which mark stands, so it is right before a script runs. `key` is where the choice lives, the same one `soul-boot.js` reads |
| [`<sds-surface>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-surface) | A plane that holds a statement. `plane`: `plain` for the hairline with no fill, `raised`, `sunken` for machine output. `heading`, `body`, `label`, `icon`. `box-style` sizes the plane where one instance needs it |
| [`<sds-card>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-card) | A way into something, and the whole frame is the one link. `heading`, `body`, `href`, `src` and `alt`, `label`, `tag`, `icon`, `footer`, `action`. The call to action is words, not a second control |
| [`<sds-grid>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-grid) | The wall a reader reads a set in. It reflows by the width its items need, not by a column count. `variant` (`default`, `wide`, `dense`, `flush`) says how much room an item holds. The element evens out the last row once it can measure |
| [`<sds-stat>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-stat) | A number as a fact. `value`, `unit`, `label`, `of` for the whole it is a part of, `icon`, `note`. The note bounds the figure, and a figure with no bound is a boast |
| [`<sds-swatch>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-swatch) | One colour as a fact: the chip, the name, and the resolved value. `value` paints the chip. `name` is what a design writes. `resolved` is what the mode made of it. `kind` (`fill`, `line`) says if the value is a surface or a hairline. A value that is not a colour drops out |
| [`<sds-icon-tile>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-icon-tile) | One glyph in a wall of them. The drawing fills the box, and the identifier stands under it. `name` is the icon. `caption` where a set writes something else. `href` makes the whole tile the press. `tag` is the one fact a drawing cannot show. It takes no size |
| [`<sds-quote>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-quote) | A sentence from somewhere else. `by` is mandatory. `as` is what they are to the subject, `meta` when, `initials` the monogram, `href` where to read it in full. `body`, or the sentence between the tags |
| [`<sds-byline>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-byline) | Who wrote it, and when. `name`, `as`, `meta`, `initials`, `href`. `unmarked` for the line with no monogram |
| [`<sds-steps>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-steps), [`<sds-step>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-step) | An instruction read from the top, numbered down one rail, for work with an order. The set takes `.steps` where a page holds its stops as data. A stop takes `heading`, `optional`, `anchor`, and the work between the tags. Nothing writes a figure. The set counts, so a stop in the middle renumbers the rest |
| [`<sds-note>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-note) | What an answer carries besides the answer. `tone` (`info`, `ok`, `warn`, `error`), `heading`, `body`, `icon`, `label`. `action` puts the one thing to do after the sentence, as the note's own secondary at `sm`. `href` draws that as a link, where the answer is a place |
| [`<sds-facts>`](https://typo3.github.io/soul-design-system/frontend/components/data.html#component-sds-facts) | A block of facts, scanned down the terms. The pairs between the tags as `<dt>` and `<dd>`, or `.entries` of `{ term, value, note? }` |
| [`<sds-entry>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-entry) | One numbered, addressed entry of a register, the number in a rail on the left. `heading`, `label` and `tone` for the kind, `origin`, `anchor`, `todo` for what is to do about it, `prefix` and `todo-prefix`. What it holds stands between the tags, or as `body` |
| [`<sds-register>`](https://typo3.github.io/soul-design-system/frontend/components/content.html#component-sds-register) | A list a reader cites, as `sds-entry` entries between its tags. It numbers them and groups them by `.groups` under a heading each. Every one goes into one table first, and the work they ask for into a second. `name`, `prefix`, `todo-prefix`; `.entries` where a static render has no children. `FINDING_GROUPS` are a review's four |
| [`<sds-run>`](https://typo3.github.io/soul-design-system/frontend/components/controls.html#component-sds-run) | Work in progress, as its stops. Not `<sds-steps>`, which is an instruction and never changes. A run arrives one stop at a time and ends on a `verdict`. `heading`, `verdict` (`running`, `done`, `failed`), `note`, `open`. `.steps` of `{ label, state, meta?, note?, output?, group? }`. `state` is `ahead`, `running`, `done` or `failed`. `meta` is a duration at the end of the row. `note` is what happens to it in words, `output` what it wrote. `group` is for many jobs at once. A stop that wrote nothing does not open. `.state-words` of `{ ahead?, running?, done?, failed? }` names the states in another language, partial. The share is `<sds-progress>` above it |
| [`<sds-progress>`](https://typo3.github.io/soul-design-system/frontend/components/controls.html#component-sds-progress) | How far a running job has got, driven from outside: a share, not a sequence of stops. `value` against `max`, `caption`, `label`. `readout` (`percent`, `count`, `none`) is how it says the position. `unit` is what a count counts. `note` is what the work does right now. `size` (`medium`, `small`). `pulsing` sends a hatch through the filled part and sets `aria-busy`. The ink comes from the distance itself, and arrives at `--status-ok` as the run does. With no share there is nothing to fill: that is `.sds-loading` with a spinner |
| [`<sds-table>`](https://typo3.github.io/soul-design-system/frontend/components/data.html#component-sds-table) | Rows and columns, with the scroll a wide one needs. `density` (`compact`, `medium`, `airy`), `scrollable`, `width`, `.columns`, `.rows`. A cell is text, a component, or `{ value, note }` for a name with what is true about it under it. `loading` with `loading-rows` draws bars at the row height |
| [`<sds-code>`](https://typo3.github.io/soul-design-system/frontend/components/data.html#component-sds-code) | A fenced block, its head and its copy button. `code-lang`, `caption`, `copy`, `action`. `remarks` are sentences about lines of the block, listed under it, counted from `start`. The code as `source`, as `body`, or between the tags. Content with `hljs-` classes stays exactly as it came, so a server's colour stays |
| [`<sds-diff>`](https://typo3.github.io/soul-design-system/frontend/components/data.html#component-sds-diff) | A file's changes, with colour by row on the server. `path`, `icon`, `body` |
| [`<sds-confval>`](https://typo3.github.io/soul-design-system/frontend/components/data.html#component-sds-confval) | One configuration value in a reference. `name`, `anchor`, `required`, `type`, `default`, `.facts` for whatever else the source named, `body` |
| [`<sds-image>`](https://typo3.github.io/soul-design-system/frontend/components/media.html#component-sds-image) | A picture, and nothing around it. `src`, `alt`, `width`, `height`, `class`. `zoomable` makes it a press that opens at full size |
| [`<sds-figure>`](https://typo3.github.io/soul-design-system/frontend/components/media.html#component-sds-figure) | A picture and the claim it makes. `src`, `alt`, `caption`, `width`, `height`, `zoomable` |
| [`<sds-embed>`](https://typo3.github.io/soul-design-system/frontend/components/media.html#component-sds-embed) | A document from somewhere else, in a frame this page controls. `src`, `label`, `ratio`, `width`, `height`, `caption`, `allow`, `allowfullscreen` |
| [`<sds-lightbox>`](https://typo3.github.io/soul-design-system/frontend/components/media.html#component-sds-lightbox) | A drawing at its drawn size, on the platform's `<dialog>`, reached with `zoomable` above. `src`, `alt`, `caption`, `open` |
| [`<sds-nav-main>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-nav-main) | The bar at the top of a page. It gets the site as one `MenuEntry` and measures what fits. The front doors in the row, a section's pages under it, and one level at a time in the drawer. `.menu`, or `.items` and `active` for a flat set. `home`, `signet`, `brand`, `product`, `search`, `index` for what search reads, `label`, `theme-key`. `.languages` is the same page in other languages, as `sds-dropdown` entries at the end of the row. The button shows the reader's `lang` |
| [`<sds-nav-rail>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-nav-rail) | The navigation rail beside a column: one `MenuEntry` with its pages under it, with folds at any depth. `.entry` |
| [`<sds-nav-pills>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-nav-pills) | Navigation for the sections of a page. `.items`, `active` |
| [`<sds-nav-toc>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-nav-toc) | What is on this page, and where in it the reader is. `.entries` are the sections, nested as deep as the page nests them. `label` is the heading over the list. It finds its own current entry: the last heading past the line a jumped-to one lands on |
| [`<sds-tabs>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-tabs), [`<sds-tab-item>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-tab-item) | One set of panels, one of them shown. The set takes `.items`, `active` and `sync`, the word that makes sets follow each other. An item takes `label`, `icon`, `active` and its panel between the tags |
| [`<sds-nav-breadcrumb>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-nav-breadcrumb) | Where the page sits, as a trail. `.items`, `label` |
| [`<sds-accordion>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-accordion), [`<sds-accordion-item>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-accordion-item) | Questions with their answers folded behind them, on a real `<details>`, so they fold with no script. The set takes `.entries`, `multiple` and `name`, the group they fold in. An item takes `question`, `open`, `name`, `anchor`, and the blocks between the tags |
| [`<sds-search>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-search) | The search for a page in a site with no server. The first keystroke fetches the index, and the hits drop under the field, each sentence cut to two lines. An entry in the index is `{ title, url, text }` and can carry `image`, the hit's thumbnail. The drop is a popover, like `sds-dropdown`'s, and hangs from the edge of the field with room. `index` is where the index file is, `label` names the field. `size` (`md`, `sm`, `lg`) is `sds-field`'s own |
| [`<sds-search-hits>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-search-hits) | The answer to a query: the hits, and the sentence a search with none gives. It gets them, so a page of results and the drop under a field are the same list. `.items`, `match`, `empty` |
| [`<sds-search-result>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-search-result) | One hit in a list of them. The whole row is the target, and the title is the link. `heading`, `href`, `path`, `snippet`, `match` for the search term inside it, `kind`, `meta`. `src` and `alt` for the picture beside the words |
| [`<sds-nav-pagination>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-nav-pagination) | Where a list continues. `count`, `per-page`, `current`, `href`, `label` |
| [`<sds-nav-pager>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-nav-pager) | The way on from a page in a sequence, not the one that numbers a set. `previous-href`, `previous-label`, `next-href`, `next-label`, `label` |
| [`<sds-footer>`](https://typo3.github.io/soul-design-system/frontend/components/navigation.html#component-sds-footer) | How a page ends, and where the rest of the site is. `.groups`, `note`, `product`, `signet`, `brand`, `copyright`, `version`, `meta`, `.marks`. Every part falls away where nothing sets it |
| [`<sds-field>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-field) | One line of whatever a reader types, on the platform's own `<input>`. `label`, `value`, `type`, `name`, `field-id`, `hint`. `error` sets the invalid state too, and the browser refuses to submit past it. `required`, `disabled`, `readonly`, `prefix`, `suffix`, `min-width`, `icon`, `caption`. `size` (`md`, `sm`, `lg`) is the box's three heights, which every field-shaped control takes from here. The platform's own attributes pass through: `autocomplete`, `inputmode`, `min`, `max`, `step`, `maxlength`, `pattern`. `focused`, `invalid` and `filled` draw a state a still render has to hold |
| [`<sds-textarea>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-textarea) | An answer of more than one line, in the field's box. Its own element: it shares the box and nothing a caller writes. `rows`, `value`, `resize` (`vertical`, `none`, `both`), `caption`, `label`, `name`, `field-id`, `hint`, `error`. `required`, `disabled`, `readonly`, `maxlength`, `autocomplete`, `size`, `min-width`, `filled`, `invalid`, `focused`. The value in the markup is the default a reset puts back |
| [`<sds-select>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-select) | One answer out of a list the reader does not need to see. Its own element, with the field's box and nothing else. `.options` takes strings or `{ label, value?, disabled?, group? }`. Consecutive entries with the same `group` become one `<optgroup>`. A `disabled` entry stays on the list and not on offer. `value` is the choice, or, while `filled` is off, the prompt as a disabled option. `caption`, `label`, `name`, `field-id`, `hint`, `error`, `required`, `disabled`, `min-width`, `size`, `focused`, `invalid`, and `open` for a still render. **The element draws the list**, the one native control this system rebuilds. A browser's list opens in the operating system's colours. It puts back `role="combobox"` over `role="listbox"`, the arrows, `Home`, `End`, type-ahead, `Enter`, `Escape`, and `aria-activedescendant`. The real `<select>` stays underneath and is what the form submits |
| [`<sds-field-group>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-field-group) | A control and what stands with it, as one thing at the normal step. A field, a row of actions, a hint. Each part owes no step of its own, so loose they touch. The group is the set that pays. Content between the tags |
| [`<sds-field-error>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-field-error) | The message under an invalid field, with its own glyph, because colour alone is not a message. `message` |
| [`<sds-checkbox>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-checkbox) | One thing that is either so or not. `label`, `hint`, `checked`, `indeterminate`, `name`, `value`, `required`, `disabled` |
| [`<sds-checkbox-group>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-checkbox-group) | Tick any of these, under one question: a real `<fieldset>` and `<legend>`, one name for the whole set. `legend`, `legend-said-only`, `name`, `.choices` of `{ label, value?, hint?, disabled? }`, `.values`, `hint` |
| [`<sds-radio>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-radio) | One answer out of a few, all visible. `legend`, `legend-said-only`, `name`, `.choices`, `value`, `hint`, `required` |
| [`<sds-switch>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-switch) | A setting that takes effect where it stands. That is the whole difference from a checkbox, which answers the form. `label`, `hint`, `checked`, `name`, `value`, `disabled` |
| [`<sds-range>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-range) | A value along a run of them, where the position is the answer. The number at the thumb is always beside it in an `<output>`. `caption`, `label`, `name`, `min`, `max`, `step`, `value`, `unit`, `hint`, `disabled`, `field-id` |
| [`<sds-file>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-file) | The platform's own picker with its button painted. A drawn box with a hidden input has no keyboard. `caption`, `label`, `name`, `accept`, `multiple`, `hint`, `error`, `required`, `disabled`, `field-id` |
| [`<sds-form-errors>`](https://typo3.github.io/soul-design-system/frontend/components/forms.html#component-sds-form-errors) | What stopped the form, at the top of it. `.errors`, `heading`, `announce` |
| [`<sds-dialog>`](https://typo3.github.io/soul-design-system/frontend/components/overlays.html#component-sds-dialog) | A surface that opens over the page, takes the focus and gives it back, on the platform's `<dialog>`. `heading`, also its accessible name. `body`, `.actions` (ghost first, primary last), `width`, `open`. `show()` and `close()`, and it answers a button that names it with `for` |
| [`<sds-modal>`](https://typo3.github.io/soul-design-system/frontend/components/overlays.html#component-sds-modal) | The surface alone, with nothing that opens or closes it, for a page that positions its own. `heading`, `body`, `.actions`, `width` |
| [`<sds-overlay>`](https://typo3.github.io/soul-design-system/frontend/components/overlays.html#component-sds-overlay) | The wash a floating surface sits on. It takes nothing |

Every form control is **form-associated** through `ElementInternals`, which
makes it a member of the form, not a box with a control in it. A reset
reaches the element itself, and a `<fieldset disabled>` disables everything
under it. `error` is a validity the browser refuses to submit past, on the
right box. `form`, `labels`, `validity`, `checkValidity()` and
`reportValidity()` answer on the element the way they answer on an
`<input>`.

Internals do not hold the *value*, on purpose. Every control renders a real
named `<input>`, `<select>` or `<textarea>` into the light DOM. So a
prerendered page submits what it shows before a script runs. A value in
internals as well sends every answer twice.

Every event bubbles and crosses roots, so a page listens on the element,
not on what is inside it:

| Event | From | `detail` |
| --- | --- | --- |
| `sds-change` | `sds-nav-pills`, `sds-nav-main`, `sds-nav-rail`, `sds-tabs` | `{ index, label }`, the item that became current |
| `sds-change` | `sds-nav-pagination` | `{ page }`, one-based. Cancelable: `preventDefault()` pages in place and does not follow the link |
| `sds-change` | `sds-checkbox`, `sds-switch`, `sds-radio`, `sds-checkbox-group`, `sds-select`, `sds-file` | the new state, the chosen value, the ticked values, or the chosen files |
| `sds-input` | `sds-field`, `sds-textarea`, `sds-range` | what is in the field, or where the thumb now stands |
| `sds-command` | `sds-button` with `for` | `{ command, source }`, sent **to the element named by** `for`, the way the platform's own invokers do it |
| `sds-note-action` | `sds-note` with `action` | the pressed label. Only where the action is a decision. With `href` set, the link is the answer, and nothing announces |
| `sds-theme-change` | `sds-theme` | `{ theme }`: `"light"`, `"dark"`, or `null` for the machine's |
| `sds-dropdown-choose` | `sds-dropdown` | `{ choice, index }`. Beside the navigation, not instead of it, so a page that never listens still works. `preventDefault()` is how an app takes the navigation over |

## The rule, as something to run

```sh
npx soul-check src/          # or any set of paths; the tree by default
```

Every `sds-` class an element draws is that element's own name for its own
node. A page that writes one has rebuilt the component. It cannot follow the
day a part gets a new name, cannot grow the variant the element grew, and
answers no form. `soul-check` walks a tree's markup and names each one with
the element to write instead. It exits non-zero on the first, so an agent
that loaded no instruction still finds out.

The page vocabulary is not a
finding: `sds-app`, `sds-page`, `sds-prose`, the shell and the type classes
are for the hand, because no element draws them.

It reads `dist/custom-elements.json` beside itself, so what it holds is
what this version of the package draws, not a list somebody keeps in step.

## And the classes underneath

Every element renders **light DOM** and emits the classes `soul.css`
defines. So an element and a hand-written `<button class="sds-btn">` are
the same markup under the same rules. Put `sds-app` on the root element. It
sets the canvas, the type and the text colour. Put `sds-prose` on a
document.

Names carry the prefix `sds-`, with `__part`, `--modifier` and
`.is-active` / `.is-disabled` / `.is-focused` / `.is-invalid` /
`.is-filled` / `.is-selected` for state.

**A `sds-x__y` class is `sds-x`'s own name for its own node.** A page can
write `.sds-card` and
`.sds-note--warn`. It must not write `.sds-card__foot`. The day that node
changes, every hand-written copy is a surface nobody fixes. Never invent
an `sds-` name either. Compose from the tokens instead.

`soul.css` is the full list, in the groups of the table above. The page
shell: `sds-shell`, `sds-body`, `sds-column`, `sds-bands`, `sds-page`. The
type: `sds-display`, `sds-h1`…`sds-h3`, `sds-lead`, `sds-list`. The
registers a page writes in: `sds-label`, `sds-mono`, `sds-said-only`. And
one family per component.

`sds-said-only` is the one that draws nothing. What it carries stands in
the reading order at its place and takes no room on the page. The name of
a thing the lockup above already shows, the heading of a column whose head
is a glyph. Not `hidden` and not `display: none`, which take a passage out
of the reading as well.

Every value is a token: `--surface-*`, `--text-*`, `--border-*`,
`--accent`, `--status-*`, `--syntax-*`, `--font-*`, `--space-1…16`,
`--radius-*`, `--duration-*`. Never a literal colour, size, radius or
duration, and never the raw `--orange-*` scale behind `--accent`. Both
modes ship in one declaration. Every colour is `light-dark()` against
`color-scheme: light dark`, so the two cannot drift. Force one with
`data-theme="light"` or `"dark"` on `<html>`, or the browser's own
scrollbars and form controls stay in the other.

**If an element cannot say something a page needs, the gap is in the
element.** A consumer who writes three declarations into their own
stylesheet is the outcome this system exists to prevent. Say so upstream.

## What is in it

| Path | |
| --- | --- |
| `src/tokens/` | every colour, size, space, radius and duration, declared once |
| `src/styles/` | `styles.css` is the entry point; `components.css` is the `sds-` vocabulary |
| `src/components/` | the Lit elements, each with the template function it renders |
| `dist/` | the built drop-in, plus `soul-finish.js` for a documentation build |
| `dist/soul-inline.css` | the stylesheet as one file, the faces inside it, for a page that links nothing |
| `dist/custom-elements.json` | every element as a manifest: what each tag takes, says, holds and draws |
| `dist/soul-check.js` | `npx soul-check`, the rule above as an exit code |
| `fonts/`, `assets/` | the faces, the icon sprites and the drawings a page references |

## The manual

[The design system's own documentation](https://typo3.github.io/soul-design-system/frontend/index.html)
renders with it. What each layer is for, which one to take, and the rules a
design on it follows.

## Licence

MIT. The icons and the faces carry their own; see `THIRD-PARTY.md` in the
monorepo.
