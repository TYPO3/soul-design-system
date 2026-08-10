// src/lib/element.ts
import { LitElement } from "lit";
var SdsElement = class extends LitElement {
  /* Render into the element itself — see above. */
  createRenderRoot() {
    return this;
  }
};
var registered = /* @__PURE__ */ new Set();
function writeHostRule(doc) {
  if (!registered.size) return;
  const id = "sds-host-rule";
  const style = doc.getElementById(id) ?? doc.createElement("style");
  style.id = id;
  style.textContent = `${[...registered].join(",")}{display:contents}`;
  if (!style.isConnected) doc.head.append(style);
}
function installHostRule(doc = document) {
  writeHostRule(doc);
}
function define(tag, ctor) {
  if (typeof customElements === "undefined") return;
  registered.add(tag);
  if (typeof document !== "undefined") writeHostRule(document);
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}

// src/components/icon.ts
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

// src/components/icons.generated.ts
var ICON_IDS = [
  "actions-accessibility",
  "actions-approve",
  "actions-archive",
  "actions-arrow-down",
  "actions-arrow-down-alt",
  "actions-arrow-down-end",
  "actions-arrow-down-end-alt",
  "actions-arrow-down-left",
  "actions-arrow-down-left-alt",
  "actions-arrow-down-right",
  "actions-arrow-down-right-alt",
  "actions-arrow-down-start",
  "actions-arrow-down-start-alt",
  "actions-arrow-end",
  "actions-arrow-end-alt",
  "actions-arrow-end-down",
  "actions-arrow-end-down-alt",
  "actions-arrow-end-up",
  "actions-arrow-end-up-alt",
  "actions-arrow-left",
  "actions-arrow-left-alt",
  "actions-arrow-right",
  "actions-arrow-right-alt",
  "actions-arrow-right-down",
  "actions-arrow-right-down-alt",
  "actions-arrow-right-up",
  "actions-arrow-right-up-alt",
  "actions-arrow-start",
  "actions-arrow-start-alt",
  "actions-arrow-up",
  "actions-arrow-up-alt",
  "actions-aspect-ratio",
  "actions-badge",
  "actions-ban",
  "actions-barcode",
  "actions-barcode-read",
  "actions-barcode-scan",
  "actions-bell",
  "actions-bell-ring",
  "actions-bell-slash",
  "actions-bolt",
  "actions-bolt-alt",
  "actions-book",
  "actions-bookmark",
  "actions-bookmark-add",
  "actions-bookmark-remove",
  "actions-bookmarks",
  "actions-brand-apple",
  "actions-brand-bluesky",
  "actions-brand-discord",
  "actions-brand-facebook",
  "actions-brand-git",
  "actions-brand-github",
  "actions-brand-gitlab",
  "actions-brand-google",
  "actions-brand-instagram",
  "actions-brand-linkedin",
  "actions-brand-linux",
  "actions-brand-mastodon",
  "actions-brand-php",
  "actions-brand-slack",
  "actions-brand-threads",
  "actions-brand-typo3",
  "actions-brand-windows",
  "actions-brand-x",
  "actions-brand-xing",
  "actions-brand-youtube",
  "actions-briefcase",
  "actions-brightness-high",
  "actions-brightness-low",
  "actions-browser",
  "actions-brush",
  "actions-building",
  "actions-bullhorn",
  "actions-bullhorn-slash",
  "actions-calendar",
  "actions-calendar-alternative",
  "actions-canvas",
  "actions-capslock",
  "actions-caret-bar-bottom",
  "actions-caret-bar-end",
  "actions-caret-bar-start",
  "actions-caret-bar-top",
  "actions-caret-down",
  "actions-caret-end",
  "actions-caret-start",
  "actions-caret-up",
  "actions-cart",
  "actions-category",
  "actions-certificate",
  "actions-certificate-alternative",
  "actions-chat",
  "actions-check",
  "actions-check-badge",
  "actions-check-badge-alt",
  "actions-check-circle",
  "actions-check-circle-alt",
  "actions-check-square",
  "actions-check-square-alt",
  "actions-chevron-bar-down",
  "actions-chevron-bar-end",
  "actions-chevron-bar-start",
  "actions-chevron-bar-up",
  "actions-chevron-contract",
  "actions-chevron-double-end",
  "actions-chevron-double-start",
  "actions-chevron-down",
  "actions-chevron-end",
  "actions-chevron-expand",
  "actions-chevron-start",
  "actions-chevron-up",
  "actions-circle",
  "actions-circle-full",
  "actions-circle-half",
  "actions-clipboard",
  "actions-clipboard-close",
  "actions-clipboard-paste",
  "actions-clock",
  "actions-close",
  "actions-cloud",
  "actions-cloud-download",
  "actions-cloud-slash",
  "actions-cloud-upload",
  "actions-code",
  "actions-code-commit",
  "actions-code-compare",
  "actions-code-fork",
  "actions-code-merge",
  "actions-code-merge-localization",
  "actions-code-pull-request",
  "actions-code-pull-request-close",
  "actions-code-pull-request-draft",
  "actions-coffee",
  "actions-cog",
  "actions-cog-alt",
  "actions-comment",
  "actions-container",
  "actions-cookie",
  "actions-cookie-bite",
  "actions-copyright",
  "actions-cpu",
  "actions-credit-card",
  "actions-crop",
  "actions-cut",
  "actions-cut-release",
  "actions-database",
  "actions-database-export",
  "actions-database-import",
  "actions-database-reload",
  "actions-debug",
  "actions-delete",
  "actions-delete-edit",
  "actions-delete-restore",
  "actions-device-desktop",
  "actions-device-desktop-star",
  "actions-device-desktop-user",
  "actions-device-mobile",
  "actions-device-orientation-change",
  "actions-device-tablet",
  "actions-device-unidentified",
  "actions-dice",
  "actions-dice-1",
  "actions-dice-2",
  "actions-dice-3",
  "actions-dice-4",
  "actions-dice-5",
  "actions-dice-6",
  "actions-document",
  "actions-document-add",
  "actions-document-edit",
  "actions-document-edit-access",
  "actions-document-localize",
  "actions-document-move",
  "actions-document-readonly",
  "actions-document-select",
  "actions-document-share",
  "actions-document-synchronize",
  "actions-document-view",
  "actions-dot",
  "actions-download",
  "actions-drag",
  "actions-duplicate",
  "actions-duplicates",
  "actions-envelope",
  "actions-envelope-open",
  "actions-envelope-open-text",
  "actions-exchange",
  "actions-exclamation",
  "actions-exclamation-circle",
  "actions-exclamation-circle-alt",
  "actions-exclamation-triangle",
  "actions-exclamation-triangle-alt",
  "actions-expand",
  "actions-extension",
  "actions-extension-add",
  "actions-extension-import",
  "actions-extension-refresh",
  "actions-extension-remove",
  "actions-eye",
  "actions-eye-link",
  "actions-file",
  "actions-file-add",
  "actions-file-audio",
  "actions-file-certificate",
  "actions-file-csv",
  "actions-file-csv-download",
  "actions-file-edit",
  "actions-file-html",
  "actions-file-image",
  "actions-file-move",
  "actions-file-openoffice",
  "actions-file-pdf",
  "actions-file-search",
  "actions-file-shield",
  "actions-file-t3d",
  "actions-file-t3d-download",
  "actions-file-t3d-upload",
  "actions-file-text",
  "actions-file-video",
  "actions-file-view",
  "actions-filter",
  "actions-folder",
  "actions-folder-add",
  "actions-form-insert-after",
  "actions-form-insert-before",
  "actions-form-insert-in",
  "actions-fullscreen",
  "actions-gift",
  "actions-gift-card",
  "actions-git",
  "actions-globe",
  "actions-globe-alt",
  "actions-graduation-cap",
  "actions-hand-pointer",
  "actions-heart",
  "actions-heart-alt",
  "actions-history",
  "actions-house",
  "actions-hyphen",
  "actions-id-badge",
  "actions-image",
  "actions-infinity",
  "actions-info",
  "actions-info-circle",
  "actions-info-circle-alt",
  "actions-insert",
  "actions-key",
  "actions-lightbulb",
  "actions-lightbulb-on",
  "actions-line-columns",
  "actions-link",
  "actions-list",
  "actions-list-alternative",
  "actions-lock",
  "actions-login",
  "actions-logout",
  "actions-magnet",
  "actions-map",
  "actions-marker",
  "actions-menu",
  "actions-menu-alternative",
  "actions-menu-sidebar-collapsed",
  "actions-menu-sidebar-expanded",
  "actions-message",
  "actions-message-add",
  "actions-message-dots",
  "actions-message-localize",
  "actions-message-remove",
  "actions-microchip",
  "actions-minus",
  "actions-minus-badge",
  "actions-minus-badge-alt",
  "actions-minus-circle",
  "actions-minus-circle-alt",
  "actions-minus-square",
  "actions-minus-square-alt",
  "actions-moon",
  "actions-move",
  "actions-music",
  "actions-music-alt",
  "actions-newspaper",
  "actions-note",
  "actions-notebook",
  "actions-notebook-typoscript",
  "actions-open",
  "actions-options",
  "actions-package",
  "actions-pagetree",
  "actions-pagetree-mount",
  "actions-panel-collapse-end",
  "actions-panel-collapse-start",
  "actions-panel-expand-end",
  "actions-panel-expand-start",
  "actions-paperplane",
  "actions-paste-after",
  "actions-paste-before",
  "actions-pause",
  "actions-percent",
  "actions-percent-badge",
  "actions-phone",
  "actions-placeholder",
  "actions-placeholder-add",
  "actions-play",
  "actions-plus",
  "actions-plus-badge",
  "actions-plus-badge-alt",
  "actions-plus-circle",
  "actions-plus-circle-alt",
  "actions-plus-square",
  "actions-plus-square-alt",
  "actions-preview",
  "actions-qrcode",
  "actions-question",
  "actions-question-circle",
  "actions-question-circle-alt",
  "actions-random",
  "actions-receipt",
  "actions-redo",
  "actions-refresh",
  "actions-rename",
  "actions-replace",
  "actions-rocket",
  "actions-rss",
  "actions-save",
  "actions-save-add",
  "actions-save-close",
  "actions-save-translation",
  "actions-save-translation-clearcache",
  "actions-save-view",
  "actions-search",
  "actions-selection",
  "actions-selection-elements-all",
  "actions-selection-elements-invert",
  "actions-selection-elements-none",
  "actions-server",
  "actions-share",
  "actions-share-alt",
  "actions-shield",
  "actions-shield-star",
  "actions-shield-typo3",
  "actions-soft-hyphen",
  "actions-sort-amount",
  "actions-sort-amount-down",
  "actions-sort-amount-up",
  "actions-square",
  "actions-star",
  "actions-star-alt",
  "actions-store",
  "actions-surfboard",
  "actions-swap",
  "actions-synchronize",
  "actions-table",
  "actions-tag",
  "actions-template",
  "actions-template-new",
  "actions-terminal",
  "actions-text-indent",
  "actions-thumbtack",
  "actions-ticket",
  "actions-toggle-off",
  "actions-toggle-on",
  "actions-translate",
  "actions-triangle",
  "actions-trophy",
  "actions-undo",
  "actions-university",
  "actions-unlink",
  "actions-unlock",
  "actions-upload",
  "actions-user",
  "actions-user-emulate",
  "actions-user-switch",
  "actions-users",
  "actions-variable",
  "actions-variable-add",
  "actions-variable-remove",
  "actions-video",
  "actions-viewmode-compare",
  "actions-viewmode-layout",
  "actions-viewmode-list",
  "actions-viewmode-photos",
  "actions-viewmode-tiles",
  "actions-wallet",
  "actions-wand",
  "actions-wand-sparkles",
  "actions-wave",
  "actions-webhook",
  "actions-window",
  "actions-window-cog",
  "actions-window-open",
  "actions-window-restore",
  "actions-workspace"
];

// src/components/icon.ts
var DEFAULT_SIZE = 16;
function bundledBeside() {
  try {
    return new URL("./assets/icons/sprites/actions.svg", import.meta.url).href;
  } catch {
    return "assets/icons/sprites/actions.svg";
  }
}
var spriteUrl = bundledBeside();
var setIconSprite = (url) => {
  spriteUrl = url;
};
var SdsIcon = class extends SdsElement {
  static {
    this.properties = {
      name: { type: String, reflect: true },
      size: { type: Number, reflect: true },
      /** Only for an icon that stands without a label. SKILL.md lists the four
          that may: answered, version-bound, not bootable, a stated boundary.
          Everything else sits beside its own text and is hidden from assistive
          tech rather than read out twice. */
      label: { type: String }
    };
  }
  constructor() {
    super();
    this.size = DEFAULT_SIZE;
  }
  render() {
    if (!ICON_IDS.includes(this.name)) {
      throw new Error(`unknown icon "${this.name}" \u2014 add its category to CATEGORIES in scripts/icons.ts and run \`make icons\``);
    }
    const a11y = this.label ? `role="img" aria-label="${this.label}"` : 'aria-hidden="true"';
    const cls = this.className || "sds-icon";
    const sized = this.size === DEFAULT_SIZE ? "" : ` style="width:${this.size}px;height:${this.size}px"`;
    return html`${unsafeHTML(
      `<svg width="${this.size}" height="${this.size}"${sized} class="${cls}" ${a11y} viewBox="0 0 16 16" data-icon="${this.name}"><use href="${spriteUrl}#${this.name}"></use></svg>`
    )}`;
  }
};
define("sds-icon", SdsIcon);
var iconIds = ICON_IDS;

// src/components/button.ts
import { html as html2, nothing } from "lit";
function buttonClass({ variant = "primary", size = "md", label = "", disabled = false }) {
  const cls = ["sds-btn", `sds-btn--${variant}`];
  if (size === "sm") cls.push("sds-btn--sm");
  if (!label) cls.push("sds-btn--icon");
  if (disabled) cls.push("is-disabled");
  return cls.join(" ");
}
var SdsButton = class extends SdsElement {
  static {
    this.properties = {
      variant: { type: String, reflect: true },
      size: { type: String, reflect: true },
      label: { type: String },
      icon: { type: String },
      title: { type: String },
      disabled: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.variant = "primary";
    this.size = "md";
    this.label = "";
    this.disabled = false;
  }
  render() {
    const cls = buttonClass({
      variant: this.variant,
      size: this.size,
      label: this.label,
      disabled: this.disabled
    });
    const body = html2`${this.icon ? html2`<sds-icon name="${this.icon}"></sds-icon>` : nothing}${this.label}`;
    return this.title ? html2`<button class="${cls}" title="${this.title}">${body}</button>` : html2`<button class="${cls}">${body}</button>`;
  }
};
define("sds-button", SdsButton);

// src/components/badge.ts
import { html as html3 } from "lit";
var SdsBadge = class _SdsBadge extends SdsElement {
  static {
    /** The glyph each result tone carries. */
    this.TONE_ICON = {
      ok: "actions-check-circle",
      warn: "actions-exclamation-triangle",
      error: "actions-exclamation-circle"
    };
  }
  static {
    this.properties = {
      label: { type: String },
      tone: { type: String, reflect: true },
      icon: { type: String }
    };
  }
  constructor() {
    super();
    this.label = "";
    this.tone = "default";
  }
  render() {
    const glyph = this.icon ?? _SdsBadge.TONE_ICON[this.tone];
    const cls = this.tone === "default" ? "sds-badge" : `sds-badge sds-badge--${this.tone}`;
    return glyph ? html3`<span class="${cls}"><sds-icon name="${glyph}"></sds-icon>${this.label}</span>` : html3`<span class="${cls}">${this.label}</span>`;
  }
};
define("sds-badge", SdsBadge);

// src/components/link.ts
import { html as html4 } from "lit";
var SdsLink = class extends SdsElement {
  static {
    this.properties = {
      label: { type: String },
      href: { type: String, reflect: true },
      external: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.label = "";
    this.href = "#";
    this.external = false;
  }
  render() {
    return this.external ? html4`<a class="sds-link sds-link--external" href="${this.href}" target="_blank" rel="noreferrer">${this.label} <sds-icon name="actions-window-open"></sds-icon></a>` : html4`<a class="sds-link" href="${this.href}">${this.label}</a>`;
  }
};
define("sds-link", SdsLink);

// src/components/field.ts
import { html as html5, nothing as nothing2 } from "lit";
function fieldClass({ focused, invalid, filled, select }) {
  const cls = ["sds-field"];
  if (select) cls.push("sds-select");
  if (focused) cls.push("is-focused");
  if (invalid) cls.push("is-invalid");
  if (filled) cls.push("is-filled");
  return cls.join(" ");
}
var SdsFieldError = class extends SdsElement {
  static {
    this.properties = { message: { type: String } };
  }
  constructor() {
    super();
    this.message = "";
  }
  render() {
    return html5`<span class="sds-field-error"><sds-icon name="actions-exclamation-circle"></sds-icon>${this.message}</span>`;
  }
};
define("sds-field-error", SdsFieldError);
var SdsField = class extends SdsElement {
  static {
    this.properties = {
      value: { type: String },
      icon: { type: String },
      focused: { type: Boolean, reflect: true },
      invalid: { type: Boolean, reflect: true },
      filled: { type: Boolean, reflect: true },
      select: { type: Boolean, reflect: true },
      minWidth: { type: Number, attribute: "min-width" }
    };
  }
  constructor() {
    super();
    this.value = "";
    this.focused = false;
    this.invalid = false;
    this.filled = false;
    this.select = false;
    this.minWidth = 220;
  }
  render() {
    const cls = fieldClass(this);
    if (this.select) {
      return html5`<span class="${cls}" style="min-width:${this.minWidth}px">${this.value} <span style="color:var(--text-muted);"><sds-icon name="actions-chevron-down"></sds-icon></span></span>`;
    }
    const caret = this.focused ? html5`<span style="width:2px; height:15px; background:var(--accent);"></span>` : nothing2;
    const text = this.focused ? html5`<span style="color:var(--text-primary)">${this.value}</span>` : this.icon ? html5`<span>${this.value}</span>` : html5`${this.value}`;
    return html5`<span class="${cls}" style="min-width:${this.minWidth}px">${this.icon ? html5`<sds-icon name="${this.icon}"></sds-icon>` : nothing2}${text}${caret}</span>`;
  }
};
define("sds-field", SdsField);

// src/components/pills.ts
import { html as html7 } from "lit";

// src/lib/template.ts
function lines(parts, indent = 0) {
  const gap = `
${" ".repeat(indent)}`;
  const out = [];
  parts.forEach((part, i) => {
    if (i) out.push(gap);
    out.push(part);
  });
  return out;
}

// src/components/nav-base.ts
import { html as html6 } from "lit";
var SdsNav = class extends SdsElement {
  static {
    this.properties = {
      items: { type: Array },
      active: { type: Number, reflect: true }
    };
  }
  constructor() {
    super();
    this.items = [];
    this.active = 0;
  }
  items_() {
    return this.items.map(
      (label, i) => html6`<span class="${i === this.active ? `${this.item} is-active` : this.item}">${label}</span>`
    );
  }
};

// src/components/pills.ts
var SdsPills = class extends SdsNav {
  constructor() {
    super(...arguments);
    this.block = "sds-pills";
    this.item = "sds-pill";
  }
  render() {
    return html7`<nav class="${this.block}">
  ${lines(this.items_(), 2)}
</nav>`;
  }
};
define("sds-pills", SdsPills);

// src/components/tabs.ts
import { html as html8 } from "lit";
var SdsTabs = class extends SdsNav {
  constructor() {
    super(...arguments);
    this.block = "sds-tabs";
    this.item = "sds-tab";
  }
  render() {
    return html8`<div class="${this.block}">
  ${lines(this.items_(), 2)}
</div>`;
  }
};
define("sds-tabs", SdsTabs);

// src/components/rail.ts
import { html as html9 } from "lit";
var SdsRail = class extends SdsNav {
  constructor() {
    super(...arguments);
    this.block = "sds-rail";
    this.item = "sds-rail__item";
  }
  render() {
    return html9`<div class="${this.block}">
  ${lines(this.items_(), 2)}
</div>`;
  }
};
define("sds-rail", SdsRail);

// src/components/card.ts
import { html as html10 } from "lit";
var SdsSurface = class extends SdsElement {
  static {
    this.properties = {
      plane: { type: String, reflect: true },
      heading: { type: String },
      body: { type: String },
      /* The host is `display: contents`, so it is not in the box tree and
         cannot be sized from outside. Layout for the plane goes here and lands
         on the element that is actually laid out. */
      boxStyle: { type: String, attribute: "box-style" }
    };
  }
  constructor() {
    super();
    this.plane = "card";
    this.heading = "";
    this.body = "";
    this.boxStyle = "flex:1; min-width:200px";
  }
  render() {
    return html10`<div class="sds-${this.plane}" style="${this.boxStyle}">
  <div class="sds-surface-title">${this.heading}</div>
  <div class="sds-surface-body">${this.body}</div>
</div>`;
  }
};
define("sds-surface", SdsSurface);

// src/components/overlay.ts
import { html as html11 } from "lit";
var SdsOverlay = class extends SdsElement {
  render() {
    return html11`<div class="sds-overlay"></div>`;
  }
};
var SdsModal = class extends SdsElement {
  static {
    this.properties = {
      heading: { type: String },
      body: { type: String },
      /** Rendered buttons. Ghost first, primary last — the destructive-free
          order the rest of the system reads in. */
      actions: { type: Array },
      width: { type: Number, reflect: true }
    };
  }
  constructor() {
    super();
    this.heading = "";
    this.body = "";
    this.actions = [];
    this.width = 330;
  }
  render() {
    return html11`<div class="sds-modal" style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:${this.width}px">
  <div class="sds-modal__head">
    <span>${this.heading}</span>
    <span style="color:var(--text-muted);"><sds-icon name="actions-close"></sds-icon></span>
  </div>
  <div class="sds-modal__body">${this.body}</div>
  <div class="sds-modal__foot">
    ${lines(this.actions, 4)}
  </div>
</div>`;
  }
};
var SdsDrawer = class extends SdsElement {
  static {
    this.properties = {
      body: { type: String },
      width: { type: Number, reflect: true }
    };
  }
  constructor() {
    super();
    this.body = "";
    this.width = 120;
  }
  render() {
    return html11`<div class="sds-drawer" style="position:absolute; right:0; top:0; bottom:0; width:${this.width}px">
  ${this.body}
</div>`;
  }
};
define("sds-overlay", SdsOverlay);
define("sds-modal", SdsModal);
define("sds-drawer", SdsDrawer);

// src/components/dialog.ts
import { html as html12 } from "lit";
var SdsDialog = class extends SdsElement {
  static {
    this.properties = {
      heading: { type: String },
      body: { type: String },
      actions: { type: Array },
      width: { type: Number, reflect: true },
      open: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.heading = "";
    this.body = "";
    this.actions = [];
    this.width = 330;
    this.open = false;
  }
  get dialog() {
    return this.querySelector("dialog");
  }
  /** Open it modally: the platform makes the rest of the page inert, moves
      the focus in, and traps it until this closes. */
  show() {
    this.open = true;
    void this.updateComplete.then(() => {
      const el = this.dialog;
      if (el && !el.open) el.showModal();
    });
  }
  close() {
    this.dialog?.close();
    this.open = false;
  }
  updated() {
    const el = this.dialog;
    if (!el) return;
    if (!this.isConnected) return;
    try {
      if (this.open && !el.open) el.showModal();
      if (!this.open && el.open) el.close();
    } catch {
      if (this.open) el.setAttribute("open", "");
    }
  }
  render() {
    return html12`<dialog
      class="sds-modal"
      style="width:${this.width}px"
      aria-label="${this.heading}"
      @close="${() => {
      this.open = false;
    }}"
    >
  <div class="sds-modal__head">
    <span>${this.heading}</span>
    <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" title="Close" @click="${() => this.close()}"><sds-icon name="actions-close"></sds-icon></button>
  </div>
  <div class="sds-modal__body">${this.body}</div>
  <div class="sds-modal__foot">
    ${lines(this.actions, 4)}
  </div>
</dialog>`;
  }
};
define("sds-dialog", SdsDialog);

// src/components/table.ts
import { html as html13 } from "lit";
var SdsTable = class extends SdsElement {
  static {
    this.properties = {
      density: { type: String, reflect: true },
      scrollable: { type: Boolean, reflect: true },
      columns: { type: Array },
      rows: { type: Array }
    };
  }
  constructor() {
    super();
    this.density = "medium";
    this.scrollable = false;
    this.columns = [];
    this.rows = [];
  }
  cell(value, cls) {
    return cls ? html13`<td class="${cls}">${value}</td>` : html13`<td>${value}</td>`;
  }
  bodyRow(row) {
    const cells = lines(row.cells.map((v, i) => this.cell(v, this.columns[i]?.cls)), 6);
    return row.style ? html13`<tr style="${row.style}">
      ${cells}
    </tr>` : html13`<tr>
      ${cells}
    </tr>`;
  }
  render() {
    const cls = `sds-table sds-table--${this.density}${this.scrollable ? " sds-table--scroll" : ""}`;
    return html13`<table class="${cls}">
  <thead><tr>
    ${lines(this.columns.map((c) => html13`<th>${c.head}</th>`), 4)}
  </tr></thead>
  <tbody>
    ${lines(this.rows.map((r) => this.bodyRow(r)), 4)}
  </tbody>
</table>`;
  }
};
define("sds-table", SdsTable);

// src/components/code.ts
import { html as html14 } from "lit";
var SdsCode = class extends SdsElement {
  constructor() {
    super();
    /* Content written between the tags, taken before Lit renders over it.
    
         The element renders light DOM, so `render()` replaces its children — and
         the children are the whole point when the block comes from a renderer
         rather than from a story:
    
           <sds-code lang="bash" copy><code>…</code></sds-code>
    
         So they are lifted out on connect and handed back to the template as
         nodes. Lit renders a DOM node as a child value, and re-rendering moves
         the same nodes rather than copying them. */
    this.taken = null;
    /* A button that cannot do its one job is worse than no button, so a
       browser with no clipboard gets none. That is decided on connect rather
       than at render time: `renderStatic` runs this in Node, where there is no
       `navigator` at all, and a guard on the object itself would silently drop
       the affordance from every specimen card — which is a picture of the
       component and should show what it has. */
    this.clipboard = true;
    this.lang = "";
    this.body = [];
    this.copy = false;
    this.copied = false;
  }
  static {
    this.properties = {
      lang: { type: String, reflect: true },
      /* Styled lines, which no attribute can carry — a shell prompt, a comment
         and a result are three different spans, and flattening them to a string
         would throw away the only thing the component does. */
      body: { type: Array },
      action: { type: Object },
      copy: { type: Boolean, reflect: true },
      copied: { type: Boolean, state: true }
    };
  }
  connectedCallback() {
    if (typeof navigator !== "undefined") this.clipboard = Boolean(navigator.clipboard);
    if (this.taken === null && this.childNodes.length > 0) {
      this.taken = [...this.childNodes];
      for (const node of this.taken) node.remove();
    }
    super.connectedCallback();
  }
  /** Whatever the block would put on the clipboard: its text, trailing
      blank lines dropped the way a shell would not want them. */
  get text() {
    return (this.textContent ?? "").replace(/\n+$/, "");
  }
  async toClipboard() {
    try {
      await navigator.clipboard.writeText(this.text);
    } catch {
      return;
    }
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 1600);
  }
  get copyButton() {
    if (!this.copy || !this.clipboard) return void 0;
    return html14`<button type="button" class="sds-code__copy${this.copied ? " is-copied" : ""}" aria-label="Copy this block" @click="${() => void this.toClipboard()}"><span class="sds-code__glyph"><sds-icon name="actions-duplicate"></sds-icon></span><span class="sds-code__copied"><sds-icon name="actions-check"></sds-icon></span><span>${this.copied ? "copied" : "copy"}</span></button>`;
  }
  /* The lines the free `comment()`, `shell()` and `ok()` helpers used to
     build. They were three exported functions that assembled markup a caller
     then handed back in — which made the component's own output something any
     caller could half-write. A line is data now, and only this file turns it
     into spans. */
  line({ kind, text, code }) {
    const tail = code ? html14` <span class="sds-code__cmd">${code}</span>` : void 0;
    switch (kind) {
      case "shell":
        return html14`<span class="sds-code__prompt">$</span> <span class="sds-code__cmd">${text}</span>${tail}`;
      case "comment":
        return html14`<span class="sds-code__comment">${text}</span>${tail}`;
      case "ok":
        return html14`<span class="sds-code__ok">✓</span> ${text}${tail}`;
      default:
        return html14`${text}${tail}`;
    }
  }
  /* Content written between the tags, in the `<code>` a code block is
       supposed to have.
  
       The element renders that wrapper, and the `language-` class on it, from
       its own `lang`. A caller writing
  
         <sds-code lang="json"><code class="language-json">…</code></sds-code>
  
       says the language twice, and the two can disagree unnoticed — `lang`
       paints the head, the class decides the highlighting. The component owns
       it, so a caller writes the body and nothing else. */
  get wrapped() {
    return this.lang ? html14`<code class="language-${this.lang}">${this.taken}</code>` : html14`<code>${this.taken}</code>`;
  }
  render() {
    const affordance = this.action ?? this.copyButton;
    const head = this.lang || affordance ? html14`<div class="sds-code__head">
    <span class="sds-code__lang">${this.lang}</span>
    ${affordance}
  </div>` : void 0;
    return html14`<div class="sds-code">
  ${head}
  <pre class="sds-code__body">${this.taken ? this.wrapped : lines(this.body.map((l) => this.line(l)), 0)}</pre>
</div>`;
  }
};
var SdsDiff = class extends SdsElement {
  static {
    this.properties = {
      path: { type: String, reflect: true },
      icon: { type: String },
      body: { type: Array }
    };
  }
  constructor() {
    super();
    this.path = "";
    this.body = [];
  }
  /* Diff rows carry no newline between them: each `sds-diff__line` is a
     block, so a newline inside the `<pre>` would add an empty line between
     every pair of rows. */
  line({ kind, text }) {
    if (kind === "context") return html14`<span class="sds-diff__line">   ${text}</span>`;
    const mark = kind === "add" ? "+" : "-";
    return html14`<span class="sds-diff__line sds-diff__line--${kind}"><span class="sds-diff__mark">${mark}</span>  ${text}</span>`;
  }
  render() {
    return html14`<div class="sds-code">
  <div class="sds-code__head" style="justify-content:flex-start"><sds-icon name="${this.icon ?? "actions-code-compare"}"></sds-icon><span class="spec-cap">${this.path}</span></div>
  <pre class="sds-diff">${this.body.map((l) => this.line(l))}</pre>
</div>`;
  }
};
define("sds-code", SdsCode);
define("sds-diff", SdsDiff);

// src/index.ts
if (typeof document !== "undefined") installHostRule();
var TAGS = [
  "sds-icon",
  "sds-button",
  "sds-badge",
  "sds-link",
  "sds-field",
  "sds-field-error",
  "sds-pills",
  "sds-tabs",
  "sds-rail",
  "sds-surface",
  "sds-overlay",
  "sds-modal",
  "sds-drawer",
  "sds-dialog",
  "sds-table",
  "sds-code",
  "sds-diff"
];
export {
  SdsBadge,
  SdsButton,
  SdsCode,
  SdsDialog,
  SdsDiff,
  SdsDrawer,
  SdsElement,
  SdsField,
  SdsFieldError,
  SdsIcon,
  SdsLink,
  SdsModal,
  SdsOverlay,
  SdsPills,
  SdsRail,
  SdsSurface,
  SdsTable,
  SdsTabs,
  TAGS,
  buttonClass,
  define,
  fieldClass,
  iconIds,
  installHostRule,
  setIconSprite
};
//# sourceMappingURL=index.js.map
